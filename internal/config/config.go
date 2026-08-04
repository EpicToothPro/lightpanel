package config

import (
	"encoding/json"
	"os"
)

type Config struct {
	Mode                string `json:"mode"`
	ListenAddr          string `json:"listen_addr"`
	DBHost              string `json:"db_host"`
	DBPort              int    `json:"db_port"`
	DBRootUser          string `json:"db_root_user"`
	DBRootPass          string `json:"db_root_pass"`
	NginxSitesAvailable string `json:"nginx_sites_available"`
	NginxSitesEnabled   string `json:"nginx_sites_enabled"`
	WebRoot             string `json:"web_root"`
	MaxWorkers          int    `json:"max_workers"`
	PollIntervalSec     int    `json:"poll_interval_sec"`
	AdminUser           string `json:"admin_user"`
	AdminPass           string `json:"admin_pass"`
	CertEmail           string `json:"cert_email"`
}

func Load(path string) (*Config, error) {
	c := &Config{
		ListenAddr:          ":8443",
		DBHost:              "127.0.0.1",
		DBPort:              3306,
		DBRootUser:          "root",
		NginxSitesAvailable: "/etc/nginx/sites-available",
		NginxSitesEnabled:   "/etc/nginx/sites-enabled",
		WebRoot:             "/var/www",
		AdminUser:           "admin",
		AdminPass:           "changeme",
	}

	data, err := os.ReadFile(path)
	if err != nil && !os.IsNotExist(err) {
		return nil, err
	}
	if err == nil {
		if err := json.Unmarshal(data, c); err != nil {
			return nil, err
		}
	}

	c.ApplyProfile()
	return c, nil
}

func (c *Config) ApplyProfile() {
	if c.MaxWorkers == 0 || c.PollIntervalSec == 0 {
		switch c.Mode {
		case "low":
			c.MaxWorkers = 2
			c.PollIntervalSec = 30
		case "high":
			c.MaxWorkers = 8
			c.PollIntervalSec = 5
		default:
			c.Mode = "medium"
			c.MaxWorkers = 4
			c.PollIntervalSec = 10
		}
	}
}
