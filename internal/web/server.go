package web

import (
	"embed"
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"

	"github.com/lightpanel/lightpanel/internal/config"
	"github.com/lightpanel/lightpanel/internal/db"
	"github.com/lightpanel/lightpanel/internal/monitor"
	"github.com/lightpanel/lightpanel/internal/site"
	"github.com/lightpanel/lightpanel/internal/ssl"
)

//go:embed templates/*
var templateFS embed.FS

type Server struct {
	cfg         config.Config
	siteMgr     *site.SiteManager
	dbMgr       *db.DBManager
	sslMgr      *ssl.SSLManager
	tmpl        *template.Template
}

func NewServer(cfg config.Config) (*Server, error) {
	tmpl, err := template.ParseFS(templateFS, "templates/index.html")
	if err != nil {
		return nil, fmt.Errorf("failed to parse embedded templates: %w", err)
	}

	return &Server{
		cfg:     cfg,
		siteMgr: site.NewManager(cfg.NginxAvailableDir, cfg.NginxEnabledDir),
		dbMgr:   db.NewManager("root", "", "localhost", 3306),
		sslMgr:  ssl.NewManager(),
		tmpl:    tmpl,
	}, nil
}

type DashboardData struct {
	Profile           string
	Port              int
	BackgroundPolling bool
	PollIntervalSec   int
	Stats             monitor.SystemStats
	Sites             []site.VHost
	Databases         []string
}

func (s *Server) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("/", s.handleIndex)
	mux.HandleFunc("/api/stats", s.handleStats)
	mux.HandleFunc("/api/sites/create", s.handleSiteCreate)
	mux.HandleFunc("/api/sites/delete", s.handleSiteDelete)
	mux.HandleFunc("/api/db/create", s.handleDBCreate)
	mux.HandleFunc("/api/db/delete", s.handleDBDelete)
	mux.HandleFunc("/api/ssl/issue", s.handleSSLIssue)
}

func (s *Server) handleIndex(w http.ResponseWriter, r *http.Request) {
	stats, _ := monitor.GetStats()
	sites, _ := s.siteMgr.ListSites()
	dbs, _ := s.dbMgr.ListDatabases()

	data := DashboardData{
		Profile:           s.cfg.Profile,
		Port:              s.cfg.Port,
		BackgroundPolling: s.cfg.BackgroundPolling,
		PollIntervalSec:   s.cfg.PollIntervalSec,
		Stats:             stats,
		Sites:             sites,
		Databases:         dbs,
	}

	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	_ = s.tmpl.Execute(w, data)
}

func (s *Server) handleStats(w http.ResponseWriter, r *http.Request) {
	stats, err := monitor.GetStats()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if r.Header.Get("HX-Request") == "true" {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		fmt.Fprintf(w, `
        <div class="glass rounded-xl p-6 border border-slate-800 shadow-lg">
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-slate-400">CPU Usage</span>
                <span class="text-xs font-semibold text-indigo-400">%.1f%%</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div class="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style="width: %.1f%%"></div>
            </div>
        </div>

        <div class="glass rounded-xl p-6 border border-slate-800 shadow-lg">
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-slate-400">RAM Usage</span>
                <span class="text-xs font-semibold text-cyan-400">%d MB / %d MB</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div class="bg-cyan-500 h-2.5 rounded-full transition-all duration-500" style="width: %.1f%%"></div>
            </div>
        </div>

        <div class="glass rounded-xl p-6 border border-slate-800 shadow-lg">
            <div class="flex justify-between items-center mb-2">
                <span class="text-sm font-medium text-slate-400">Disk Usage</span>
                <span class="text-xs font-semibold text-emerald-400">%.1f GB Free</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div class="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" style="width: %.1f%%"></div>
            </div>
        </div>`, stats.CPUUsage, stats.CPUUsage, stats.MemUsedMB, stats.MemTotalMB, stats.MemUsedPct, stats.DiskFreeGB, stats.DiskUsedPct)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(stats)
}

func (s *Server) handleSiteCreate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	domain := r.FormValue("domain")
	siteType := r.FormValue("type")
	phpVer := r.FormValue("php_version")

	vhost := site.VHost{
		Domain:     domain,
		Type:       siteType,
		PHPVersion: phpVer,
	}

	if err := s.siteMgr.CreateSite(vhost); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	sites, _ := s.siteMgr.ListSites()
	s.renderSiteList(w, sites)
}

func (s *Server) handleSiteDelete(w http.ResponseWriter, r *http.Request) {
	domain := r.URL.Query().Get("domain")
	_ = s.siteMgr.DeleteSite(domain)

	sites, _ := s.siteMgr.ListSites()
	s.renderSiteList(w, sites)
}

func (s *Server) renderSiteList(w http.ResponseWriter, sites []site.VHost) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	for _, site := range sites {
		enabledStr := "Disabled"
		if site.Enabled {
			enabledStr = "Enabled"
		}
		fmt.Fprintf(w, `
        <div class="flex justify-between items-center p-3 bg-slate-800/40 rounded border border-slate-800">
            <div>
                <span class="text-sm font-medium text-slate-200 block">%s</span>
                <span class="text-xs text-slate-400 font-mono">%s</span>
            </div>
            <div class="flex gap-2">
                <button hx-post="/api/ssl/issue?domain=%s" hx-target="#status-msg" class="px-2 py-1 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs rounded hover:bg-emerald-600/30">SSL</button>
                <button hx-delete="/api/sites/delete?domain=%s" hx-target="#vhost-list" class="px-2 py-1 bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs rounded hover:bg-rose-600/30">Delete</button>
            </div>
        </div>`, site.Domain, enabledStr, site.Domain, site.Domain)
	}
}

func (s *Server) handleDBCreate(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	dbname := r.FormValue("dbname")
	username := r.FormValue("username")
	password := r.FormValue("password")

	if err := s.dbMgr.CreateDatabase(dbname, username, password); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	dbs, _ := s.dbMgr.ListDatabases()
	s.renderDBList(w, dbs)
}

func (s *Server) handleDBDelete(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	_ = s.dbMgr.DeleteDatabase(name)

	dbs, _ := s.dbMgr.ListDatabases()
	s.renderDBList(w, dbs)
}

func (s *Server) renderDBList(w http.ResponseWriter, dbs []string) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	for _, dbname := range dbs {
		fmt.Fprintf(w, `
        <div class="flex justify-between items-center p-3 bg-slate-800/40 rounded border border-slate-800">
            <span class="text-sm font-mono text-slate-300">%s</span>
            <button hx-delete="/api/db/delete?name=%s" hx-target="#db-list" class="px-2 py-1 bg-rose-600/20 text-rose-400 border border-rose-500/30 text-xs rounded hover:bg-rose-600/30">Drop</button>
        </div>`, dbname, dbname)
	}
}

func (s *Server) handleSSLIssue(w http.ResponseWriter, r *http.Request) {
	domain := r.URL.Query().Get("domain")
	email := "admin@" + domain

	if err := s.sslMgr.IssueCertificate(domain, email); err != nil {
		http.Error(w, fmt.Sprintf("SSL Error: %v", err), http.StatusInternalServerError)
		return
	}
	fmt.Fprintf(w, "Successfully issued SSL certificate for %s", domain)
}
