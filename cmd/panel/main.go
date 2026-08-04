package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/lightpanel/lightpanel/internal/config"
	"github.com/lightpanel/lightpanel/internal/web"
)

func main() {
	configPath := flag.String("config", "config.json", "Path to config.json")
	profileFlag := flag.String("profile", "", "Override performance profile (low, medium, high)")
	flag.Parse()

	cfg, err := config.LoadConfig(*configPath)
	if err != nil {
		log.Printf("Warning: Failed to load config file (%v), using default profile", err)
		cfg = config.DefaultConfig("low")
	}

	if *profileFlag != "" {
		cfg = config.DefaultConfig(*profileFlag)
	}

	server, err := web.NewServer(cfg)
	if err != nil {
		log.Fatalf("Failed to initialize server: %v", err)
	}

	mux := http.NewServeMux()
	server.RegisterRoutes(mux)

	addr := fmt.Sprintf(":%d", cfg.Port)
	log.Printf("LightPanel daemon running on http://0.0.0.0%s (Profile: %s)", addr, cfg.Profile)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
