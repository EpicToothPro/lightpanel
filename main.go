package main

import (
	"context"
	"flag"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/lightpanel/lightpanel/internal/api"
	"github.com/lightpanel/lightpanel/internal/config"
	"github.com/lightpanel/lightpanel/internal/database"
	"github.com/lightpanel/lightpanel/internal/nginx"
)

func main() {
	configPath := flag.String("config", "config.json", "path to config file")
	flag.Parse()

	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.Println("Starting LightPanel...")

	cfg, err := config.Load(*configPath)
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	log.Printf("Mode: %s | Workers: %d | Poll: %ds", cfg.Mode, cfg.MaxWorkers, cfg.PollIntervalSec)

	nginxMgr := nginx.NewManager(cfg.NginxSitesAvailable, cfg.NginxSitesEnabled, cfg.WebRoot)

	var dbMgr *database.Manager
	dbMgr, err = database.NewManager(cfg.DBHost, cfg.DBPort, cfg.DBRootUser, cfg.DBRootPass)
	if err != nil {
		log.Printf("WARNING: MariaDB unavailable: %v (database features disabled)", err)
		dbMgr = nil
	} else {
		defer dbMgr.Close()
	}

	srv := api.NewServer(cfg, nginxMgr, dbMgr)

	httpServer := &http.Server{
		Addr:         cfg.ListenAddr,
		Handler:      srv.Handler(),
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 30 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	// Graceful shutdown
	go func() {
		sigCh := make(chan os.Signal, 1)
		signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
		<-sigCh
		log.Println("Shutting down...")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		httpServer.Shutdown(ctx)
	}()

	log.Printf("LightPanel listening on %s", cfg.ListenAddr)
	if err := httpServer.ListenAndServe(); err != http.ErrServerClosed {
		log.Fatalf("Server error: %v", err)
	}
	log.Println("Server stopped.")
}
