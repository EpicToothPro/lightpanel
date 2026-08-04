package database

import (
	"database/sql"
	"fmt"
	"regexp"
	"strings"

	_ "github.com/go-sql-driver/mysql"
)

type DBInfo struct {
	Name string `json:"name"`
	User string `json:"user,omitempty"`
}

type Manager struct {
	db *sql.DB
}

func NewManager(host string, port int, user, pass string) (*Manager, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/", user, pass, host, port)
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}
	return &Manager{db: db}, nil
}

func validateName(name string) bool {
	matched, _ := regexp.MatchString(`^[a-zA-Z0-9_]+$`, name)
	return matched
}

func (m *Manager) CreateDatabase(dbName, userName, userPass string) error {
	if !validateName(dbName) || !validateName(userName) {
		return fmt.Errorf("invalid database or user name")
	}

	queries := []string{
		fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s`", dbName),
		fmt.Sprintf("CREATE USER IF NOT EXISTS '%s'@'localhost' IDENTIFIED BY '%s'", userName, userPass),
		fmt.Sprintf("GRANT ALL PRIVILEGES ON `%s`.* TO '%s'@'localhost'", dbName, userName),
		"FLUSH PRIVILEGES",
	}

	for _, q := range queries {
		if _, err := m.db.Exec(q); err != nil {
			return fmt.Errorf("failed to execute query %q: %w", q, err)
		}
	}
	return nil
}

func (m *Manager) DeleteDatabase(dbName, userName string) error {
	if !validateName(dbName) || !validateName(userName) {
		return fmt.Errorf("invalid database or user name")
	}

	queries := []string{
		fmt.Sprintf("DROP DATABASE IF EXISTS `%s`", dbName),
		fmt.Sprintf("DROP USER IF EXISTS '%s'@'localhost'", userName),
	}

	for _, q := range queries {
		if _, err := m.db.Exec(q); err != nil {
			return fmt.Errorf("failed to execute query %q: %w", q, err)
		}
	}
	return nil
}

func (m *Manager) ListDatabases() ([]DBInfo, error) {
	rows, err := m.db.Query("SHOW DATABASES")
	if err != nil {
		return nil, fmt.Errorf("failed to list databases: %w", err)
	}
	defer rows.Close()

	var dbs []DBInfo
	exclude := map[string]bool{
		"information_schema": true,
		"mysql":              true,
		"performance_schema": true,
		"sys":                true,
		"phpmyadmin":         true,
	}

	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		if !exclude[strings.ToLower(name)] {
			dbs = append(dbs, DBInfo{Name: name})
		}
	}
	return dbs, nil
}

func (m *Manager) Close() error {
	return m.db.Close()
}
