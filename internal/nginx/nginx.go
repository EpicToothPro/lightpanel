package nginx

import (
	"bytes"
	"embed"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"regexp"
	"strings"
	"text/template"
)

//go:embed tmpl/*
var tmplFS embed.FS

type SiteConfig struct {
	Domain     string `json:"domain"`
	SiteType   string `json:"site_type"`
	PHPVersion string `json:"php_version,omitempty"`
	SSLEnabled bool   `json:"ssl_enabled"`
	CreatedAt  string `json:"created_at"`
}

type Manager struct {
	sitesAvailable string
	sitesEnabled   string
	webRoot        string
}

func NewManager(sitesAvailable, sitesEnabled, webRoot string) *Manager {
	return &Manager{
		sitesAvailable: sitesAvailable,
		sitesEnabled:   sitesEnabled,
		webRoot:        webRoot,
	}
}

func validateDomain(domain string) bool {
	matched, _ := regexp.MatchString(`^[a-zA-Z0-9.-]+$`, domain)
	return matched
}

func (m *Manager) CreateSite(cfg SiteConfig) error {
	if !validateDomain(cfg.Domain) {
		return fmt.Errorf("invalid domain name: %s", cfg.Domain)
	}

	if cfg.SiteType != "php" && cfg.SiteType != "static" {
		return fmt.Errorf("invalid site type: %s", cfg.SiteType)
	}
	if cfg.SiteType == "php" && cfg.PHPVersion == "" {
		cfg.PHPVersion = "8.2"
	}

	siteRoot := filepath.Join(m.webRoot, cfg.Domain)
	if err := os.MkdirAll(siteRoot, 0755); err != nil {
		return fmt.Errorf("failed to create web root: %w", err)
	}

	tmplName := cfg.SiteType + ".conf.tmpl"
	tmpl, err := template.ParseFS(tmplFS, "tmpl/"+tmplName)
	if err != nil {
		return fmt.Errorf("failed to parse template: %w", err)
	}

	var buf bytes.Buffer
	data := map[string]interface{}{
		"Domain":     cfg.Domain,
		"WebRoot":    m.webRoot,
		"PHPVersion": cfg.PHPVersion,
	}
	if err := tmpl.Execute(&buf, data); err != nil {
		return fmt.Errorf("failed to execute template: %w", err)
	}

	confPath := filepath.Join(m.sitesAvailable, cfg.Domain+".conf")
	if err := os.WriteFile(confPath, buf.Bytes(), 0644); err != nil {
		return fmt.Errorf("failed to write config: %w", err)
	}

	symlinkPath := filepath.Join(m.sitesEnabled, cfg.Domain+".conf")
	if err := os.Symlink(confPath, symlinkPath); err != nil && !os.IsExist(err) {
		return fmt.Errorf("failed to create symlink: %w", err)
	}

	indexPath := filepath.Join(siteRoot, "index.html")
	if _, err := os.Stat(indexPath); os.IsNotExist(err) {
		os.WriteFile(indexPath, []byte("<h1>Welcome to "+cfg.Domain+"</h1>\n"), 0644)
	}

	return m.ReloadNginx()
}

func (m *Manager) DeleteSite(domain string) error {
	if !validateDomain(domain) {
		return fmt.Errorf("invalid domain name: %s", domain)
	}

	symlinkPath := filepath.Join(m.sitesEnabled, domain+".conf")
	_ = os.Remove(symlinkPath)

	confPath := filepath.Join(m.sitesAvailable, domain+".conf")
	if err := os.Remove(confPath); err != nil && !os.IsNotExist(err) {
		return fmt.Errorf("failed to remove config: %w", err)
	}

	return m.ReloadNginx()
}

func (m *Manager) ListSites() ([]SiteConfig, error) {
	entries, err := os.ReadDir(m.sitesAvailable)
	if err != nil {
		if os.IsNotExist(err) {
			return nil, nil
		}
		return nil, fmt.Errorf("failed to read sites directory: %w", err)
	}

	var sites []SiteConfig
	for _, entry := range entries {
		if entry.IsDir() || !strings.HasSuffix(entry.Name(), ".conf") {
			continue
		}
		domain := strings.TrimSuffix(entry.Name(), ".conf")
		confPath := filepath.Join(m.sitesAvailable, entry.Name())
		data, err := os.ReadFile(confPath)
		if err != nil {
			continue
		}

		info, err := entry.Info()
		var createdAt string
		if err == nil {
			createdAt = info.ModTime().Format("2006-01-02 15:04:05")
		}

		siteType := "static"
		if strings.Contains(string(data), "fastcgi_pass") {
			siteType = "php"
		}

		sites = append(sites, SiteConfig{
			Domain:    domain,
			SiteType:  siteType,
			CreatedAt: createdAt,
		})
	}
	return sites, nil
}

func (m *Manager) ReloadNginx() error {
	out, err := exec.Command("nginx", "-t").CombinedOutput()
	if err != nil {
		return fmt.Errorf("nginx config test failed: %v, output: %s", err, string(out))
	}
	
	if out, err := exec.Command("systemctl", "reload", "nginx").CombinedOutput(); err != nil {
		return fmt.Errorf("nginx reload failed: %v, output: %s", err, string(out))
	}
	return nil
}
