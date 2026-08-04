package site

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"strings"
	"text/template"
)

type VHost struct {
	Domain      string `json:"domain"`
	Type        string `json:"type"` // "static" or "php"
	DocumentRoot string `json:"document_root"`
	PHPVersion  string `json:"php_version"` // e.g. "8.2" or "8.1"
	Enabled     bool   `json:"enabled"`
}

type SiteManager struct {
	AvailableDir string
	EnabledDir   string
}

func NewManager(availableDir, enabledDir string) *SiteManager {
	return &SiteManager{
		AvailableDir: availableDir,
		EnabledDir:   enabledDir,
	}
}

const staticTemplate = `server {
    listen 80;
    server_name {{.Domain}};
    root {{.DocumentRoot}};
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    access_log /var/log/nginx/{{.Domain}}.access.log;
    error_log /var/log/nginx/{{.Domain}}.error.log;
}
`

const phpTemplate = `server {
    listen 80;
    server_name {{.Domain}};
    root {{.DocumentRoot}};
    index index.php index.html index.htm;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/var/run/php/php{{.PHPVersion}}-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }

    access_log /var/log/nginx/{{.Domain}}.access.log;
    error_log /var/log/nginx/{{.Domain}}.error.log;
}
`

func (m *SiteManager) CreateSite(site VHost) error {
	if site.Domain == "" {
		return fmt.Errorf("domain name cannot be empty")
	}
	if site.DocumentRoot == "" {
		site.DocumentRoot = fmt.Sprintf("/var/www/%s", site.Domain)
	}
	if site.PHPVersion == "" {
		site.PHPVersion = "8.2"
	}

	// Ensure doc root exists
	if err := os.MkdirAll(site.DocumentRoot, 0755); err != nil {
		return fmt.Errorf("failed to create document root: %w", err)
	}

	// Ensure config directories exist
	if err := os.MkdirAll(m.AvailableDir, 0755); err != nil {
		return fmt.Errorf("failed to create available dir: %w", err)
	}
	if err := os.MkdirAll(m.EnabledDir, 0755); err != nil {
		return fmt.Errorf("failed to create enabled dir: %w", err)
	}

	// Select template
	tmplStr := staticTemplate
	if site.Type == "php" {
		tmplStr = phpTemplate
	}

	tmpl, err := template.New("vhost").Parse(tmplStr)
	if err != nil {
		return err
	}

	availPath := filepath.Join(m.AvailableDir, site.Domain+".conf")
	f, err := os.Create(availPath)
	if err != nil {
		return fmt.Errorf("failed to create config file: %w", err)
	}
	defer f.Close()

	if err := tmpl.Execute(f, site); err != nil {
		return fmt.Errorf("failed to write template: %w", err)
	}

	// Symlink to enabled
	enabledPath := filepath.Join(m.EnabledDir, site.Domain+".conf")
	_ = os.Remove(enabledPath) // remove if already exists
	if err := os.Symlink(availPath, enabledPath); err != nil {
		return fmt.Errorf("failed to create symlink: %w", err)
	}

	// Reload nginx if installed
	return m.ReloadNginx()
}

func (m *SiteManager) DeleteSite(domain string) error {
	availPath := filepath.Join(m.AvailableDir, domain+".conf")
	enabledPath := filepath.Join(m.EnabledDir, domain+".conf")

	_ = os.Remove(enabledPath)
	_ = os.Remove(availPath)

	return m.ReloadNginx()
}

func (m *SiteManager) ListSites() ([]VHost, error) {
	files, err := os.ReadDir(m.AvailableDir)
	if err != nil {
		if os.IsNotExist(err) {
			return []VHost{}, nil
		}
		return nil, err
	}

	var sites []VHost
	for _, f := range files {
		if strings.HasSuffix(f.Name(), ".conf") {
			domain := strings.TrimSuffix(f.Name(), ".conf")
			enabledPath := filepath.Join(m.EnabledDir, f.Name())
			_, err := os.Stat(enabledPath)
			isEnabled := !os.IsNotExist(err)

			sites = append(sites, VHost{
				Domain:  domain,
				Enabled: isEnabled,
			})
		}
	}
	return sites, nil
}

func (m *SiteManager) ReloadNginx() error {
	cmd := exec.Command("nginx", "-s", "reload")
	return cmd.Run()
}
