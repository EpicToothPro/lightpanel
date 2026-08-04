package api

import (
	"html/template"
	"io/fs"
	"log"
	"net/http"
	"sync"

	"github.com/lightpanel/lightpanel/internal/config"
	"github.com/lightpanel/lightpanel/internal/database"
	"github.com/lightpanel/lightpanel/internal/monitor"
	"github.com/lightpanel/lightpanel/internal/nginx"
	"github.com/lightpanel/lightpanel/internal/ssl"
	"github.com/lightpanel/lightpanel/web"
)

type PageData struct {
	ActivePage string
	Config     *config.Config
	Stats      *monitor.SystemStats
	Sites      []nginx.SiteConfig
	Databases  []database.DBInfo
	Certs      []ssl.CertInfo
	Error      string
	Success    string
	SiteCount  int
	DBCount    int
	CertCount  int
}

type Server struct {
	cfg       *config.Config
	nginx     *nginx.Manager
	db        *database.Manager
	templates map[string]*template.Template
	mu        sync.RWMutex
}

func NewServer(cfg *config.Config, nginxMgr *nginx.Manager, dbMgr *database.Manager) *Server {
	s := &Server{
		cfg:       cfg,
		nginx:     nginxMgr,
		db:        dbMgr,
		templates: make(map[string]*template.Template),
	}

	// Full pages
	s.templates["dashboard"] = template.Must(template.ParseFS(web.TemplateFS, "templates/layout.html", "templates/dashboard.html", "templates/partials/stats.html"))
	s.templates["sites"] = template.Must(template.ParseFS(web.TemplateFS, "templates/layout.html", "templates/sites.html", "templates/partials/site-list.html"))
	s.templates["databases"] = template.Must(template.ParseFS(web.TemplateFS, "templates/layout.html", "templates/databases.html", "templates/partials/db-list.html"))
	s.templates["ssl"] = template.Must(template.ParseFS(web.TemplateFS, "templates/layout.html", "templates/ssl.html", "templates/partials/ssl-list.html"))

	// Partials
	s.templates["stats"] = template.Must(template.ParseFS(web.TemplateFS, "templates/partials/stats.html"))
	s.templates["site-list"] = template.Must(template.ParseFS(web.TemplateFS, "templates/partials/site-list.html"))
	s.templates["db-list"] = template.Must(template.ParseFS(web.TemplateFS, "templates/partials/db-list.html"))
	s.templates["ssl-list"] = template.Must(template.ParseFS(web.TemplateFS, "templates/partials/ssl-list.html"))

	return s
}

func (s *Server) Handler() http.Handler {
	mux := http.NewServeMux()

	mux.HandleFunc("GET /{$}", s.handleDashboard)
	mux.HandleFunc("GET /sites", s.handleSitesPage)
	mux.HandleFunc("GET /databases", s.handleDatabasesPage)
	mux.HandleFunc("GET /ssl", s.handleSSLPage)

	mux.HandleFunc("GET /api/stats", s.handleAPIStats)
	mux.HandleFunc("GET /api/sites", s.handleAPISiteList)
	mux.HandleFunc("POST /api/sites", s.handleAPICreateSite)
	mux.HandleFunc("DELETE /api/sites", s.handleAPIDeleteSite)

	mux.HandleFunc("GET /api/databases", s.handleAPIDBList)
	mux.HandleFunc("POST /api/databases", s.handleAPICreateDB)
	mux.HandleFunc("DELETE /api/databases", s.handleAPIDeleteDB)

	mux.HandleFunc("GET /api/ssl", s.handleAPISSLList)
	mux.HandleFunc("POST /api/ssl", s.handleAPIIssueSSL)
	mux.HandleFunc("DELETE /api/ssl", s.handleAPIRevokeSSL)

	staticFS, err := fs.Sub(web.TemplateFS, "static")
	if err != nil {
		log.Fatalf("failed to create static fs: %v", err)
	}
	mux.Handle("GET /static/", http.StripPrefix("/static/", http.FileServer(http.FS(staticFS))))

	return basicAuth(mux, s.cfg.AdminUser, s.cfg.AdminPass)
}

func basicAuth(next http.Handler, user, pass string) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		u, p, ok := r.BasicAuth()
		if !ok || u != user || p != pass {
			w.Header().Set("WWW-Authenticate", `Basic realm="LightPanel"`)
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func (s *Server) renderPage(w http.ResponseWriter, pageName string, data PageData) {
	tmpl, ok := s.templates[pageName]
	if !ok {
		http.Error(w, "template not found", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tmpl.ExecuteTemplate(w, "layout.html", data); err != nil {
		log.Printf("Error rendering page %s: %v", pageName, err)
	}
}

func (s *Server) renderPartial(w http.ResponseWriter, partialName string, data PageData) {
	tmpl, ok := s.templates[partialName]
	if !ok {
		http.Error(w, "partial not found", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	if err := tmpl.ExecuteTemplate(w, partialName+".html", data); err != nil {
		log.Printf("Error rendering partial %s: %v", partialName, err)
	}
}
