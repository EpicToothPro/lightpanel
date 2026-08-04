package api

import (
	"log"
	"net/http"

	"github.com/lightpanel/lightpanel/internal/monitor"
	"github.com/lightpanel/lightpanel/internal/nginx"
	"github.com/lightpanel/lightpanel/internal/ssl"
)

func (s *Server) handleDashboard(w http.ResponseWriter, r *http.Request) {
	data := PageData{
		ActivePage: "dashboard",
		Config:     s.cfg,
	}

	stats, err := monitor.GetStats()
	if err != nil {
		log.Printf("Failed to get stats: %v", err)
	} else {
		data.Stats = stats
	}

	sites, err := s.nginx.ListSites()
	if err == nil {
		data.SiteCount = len(sites)
	}

	if s.db != nil {
		dbs, err := s.db.ListDatabases()
		if err == nil {
			data.DBCount = len(dbs)
		}
	}

	certs, err := ssl.ListCertificates()
	if err == nil {
		data.CertCount = len(certs)
	}

	s.renderPage(w, "dashboard", data)
}

func (s *Server) handleSitesPage(w http.ResponseWriter, r *http.Request) {
	data := PageData{
		ActivePage: "sites",
		Config:     s.cfg,
	}

	sites, err := s.nginx.ListSites()
	if err != nil {
		data.Error = "Failed to list sites"
		log.Printf("Error listing sites: %v", err)
	} else {
		data.Sites = sites
	}

	s.renderPage(w, "sites", data)
}

func (s *Server) handleDatabasesPage(w http.ResponseWriter, r *http.Request) {
	data := PageData{
		ActivePage: "databases",
		Config:     s.cfg,
	}

	if s.db == nil {
		data.Error = "MariaDB unavailable"
	} else {
		dbs, err := s.db.ListDatabases()
		if err != nil {
			data.Error = "Failed to list databases"
			log.Printf("Error listing databases: %v", err)
		} else {
			data.Databases = dbs
		}
	}

	s.renderPage(w, "databases", data)
}

func (s *Server) handleSSLPage(w http.ResponseWriter, r *http.Request) {
	data := PageData{
		ActivePage: "ssl",
		Config:     s.cfg,
	}

	certs, err := ssl.ListCertificates()
	if err != nil {
		data.Error = "Failed to list certificates"
		log.Printf("Error listing certificates: %v", err)
	} else {
		data.Certs = certs
	}

	s.renderPage(w, "ssl", data)
}

func (s *Server) handleAPIStats(w http.ResponseWriter, r *http.Request) {
	data := PageData{}
	stats, err := monitor.GetStats()
	if err != nil {
		log.Printf("Failed to get stats: %v", err)
	} else {
		data.Stats = stats
	}
	s.renderPartial(w, "stats", data)
}

func (s *Server) handleAPISiteList(w http.ResponseWriter, r *http.Request) {
	data := PageData{}
	sites, err := s.nginx.ListSites()
	if err != nil {
		data.Error = "Failed to list sites"
		log.Printf("Error: %v", err)
	} else {
		data.Sites = sites
	}
	s.renderPartial(w, "site-list", data)
}

func (s *Server) handleAPICreateSite(w http.ResponseWriter, r *http.Request) {
	data := PageData{}
	if err := r.ParseForm(); err != nil {
		data.Error = "Failed to parse form"
	} else {
		cfg := nginx.SiteConfig{
			Domain:     r.FormValue("domain"),
			SiteType:   r.FormValue("site_type"),
			PHPVersion: r.FormValue("php_version"),
		}
		if err := s.nginx.CreateSite(cfg); err != nil {
			data.Error = "Failed to create site: " + err.Error()
		} else {
			data.Success = "Site created successfully"
		}
	}

	sites, _ := s.nginx.ListSites()
	data.Sites = sites
	s.renderPartial(w, "site-list", data)
}

func (s *Server) handleAPIDeleteSite(w http.ResponseWriter, r *http.Request) {
	data := PageData{}
	domain := r.URL.Query().Get("domain")
	if err := s.nginx.DeleteSite(domain); err != nil {
		data.Error = "Failed to delete site: " + err.Error()
	} else {
		data.Success = "Site deleted successfully"
	}

	sites, _ := s.nginx.ListSites()
	data.Sites = sites
	s.renderPartial(w, "site-list", data)
}

func (s *Server) handleAPIDBList(w http.ResponseWriter, r *http.Request) {
	data := PageData{}
	if s.db == nil {
		data.Error = "MariaDB unavailable"
	} else {
		dbs, err := s.db.ListDatabases()
		if err != nil {
			data.Error = "Failed to list databases"
			log.Printf("Error: %v", err)
		} else {
			data.Databases = dbs
		}
	}
	s.renderPartial(w, "db-list", data)
}

func (s *Server) handleAPICreateDB(w http.ResponseWriter, r *http.Request) {
	data := PageData{}
	if s.db == nil {
		data.Error = "MariaDB unavailable"
	} else {
		if err := r.ParseForm(); err != nil {
			data.Error = "Failed to parse form"
		} else {
			dbName := r.FormValue("db_name")
			userName := r.FormValue("db_user")
			userPass := r.FormValue("db_pass")
			if err := s.db.CreateDatabase(dbName, userName, userPass); err != nil {
				data.Error = "Failed to create database: " + err.Error()
			} else {
				data.Success = "Database created successfully"
			}
		}
	}

	if s.db != nil {
		dbs, _ := s.db.ListDatabases()
		data.Databases = dbs
	}
	s.renderPartial(w, "db-list", data)
}

func (s *Server) handleAPIDeleteDB(w http.ResponseWriter, r *http.Request) {
	data := PageData{}
	if s.db == nil {
		data.Error = "MariaDB unavailable"
	} else {
		dbName := r.URL.Query().Get("name")
		userName := r.URL.Query().Get("user")
		if err := s.db.DeleteDatabase(dbName, userName); err != nil {
			data.Error = "Failed to delete database: " + err.Error()
		} else {
			data.Success = "Database deleted successfully"
		}
	}

	if s.db != nil {
		dbs, _ := s.db.ListDatabases()
		data.Databases = dbs
	}
	s.renderPartial(w, "db-list", data)
}

func (s *Server) handleAPISSLList(w http.ResponseWriter, r *http.Request) {
	data := PageData{}
	certs, err := ssl.ListCertificates()
	if err != nil {
		data.Error = "Failed to list certificates"
		log.Printf("Error: %v", err)
	} else {
		data.Certs = certs
	}
	s.renderPartial(w, "ssl-list", data)
}

func (s *Server) handleAPIIssueSSL(w http.ResponseWriter, r *http.Request) {
	data := PageData{}
	if err := r.ParseForm(); err != nil {
		data.Error = "Failed to parse form"
	} else {
		domain := r.FormValue("domain")
		webroot := s.cfg.WebRoot + "/" + domain
		if err := ssl.IssueCertificate(domain, webroot, s.cfg.CertEmail); err != nil {
			data.Error = "Failed to issue certificate: " + err.Error()
		} else {
			data.Success = "Certificate issued successfully"
		}
	}

	certs, _ := ssl.ListCertificates()
	data.Certs = certs
	s.renderPartial(w, "ssl-list", data)
}

func (s *Server) handleAPIRevokeSSL(w http.ResponseWriter, r *http.Request) {
	data := PageData{}
	domain := r.URL.Query().Get("domain")
	if err := ssl.RevokeCertificate(domain); err != nil {
		data.Error = "Failed to revoke certificate: " + err.Error()
	} else {
		data.Success = "Certificate revoked successfully"
	}

	certs, _ := ssl.ListCertificates()
	data.Certs = certs
	s.renderPartial(w, "ssl-list", data)
}
