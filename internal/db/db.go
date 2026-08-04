package db

import (
	"database/sql"
	"fmt"
	"regexp"

	_ "github.com/go-sql-driver/mysql"
)

type DBManager struct {
	DSN string
}

func NewManager(user, pass, host string, port int) *DBManager {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/", user, pass, host, port)
	return &DBManager{DSN: dsn}
}

var safeIdentifier = regexp.MustCompile(`^[a-zA-Z0-9_]+$`)

func (m *DBManager) connect() (*sql.DB, error) {
	db, err := sql.Open("mysql", m.DSN)
	if err != nil {
		return nil, err
	}
	if err := db.Ping(); err != nil {
		db.Close()
		return nil, err
	}
	return db, nil
}

func (m *DBManager) CreateDatabase(dbName, username, password string) error {
	if !safeIdentifier.MatchString(dbName) || !safeIdentifier.MatchString(username) {
		return fmt.Errorf("invalid characters in database or username")
	}

	db, err := m.connect()
	if err != nil {
		return fmt.Errorf("database connection failed: %w", err)
	}
	defer db.Close()

	// Create Database
	_, err = db.Exec(fmt.Sprintf("CREATE DATABASE IF NOT EXISTS `%s` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci", dbName))
	if err != nil {
		return fmt.Errorf("failed to create database: %w", err)
	}

	// Create User & Grant Privileges
	_, err = db.Exec(fmt.Sprintf("CREATE USER IF NOT EXISTS '%s'@'localhost' IDENTIFIED BY '%s'", username, password))
	if err != nil {
		return fmt.Errorf("failed to create user: %w", err)
	}

	_, err = db.Exec(fmt.Sprintf("GRANT ALL PRIVILEGES ON `%s`.* TO '%s'@'localhost'", dbName, username))
	if err != nil {
		return fmt.Errorf("failed to grant privileges: %w", err)
	}

	_, err = db.Exec("FLUSH PRIVILEGES")
	return err
}

func (m *DBManager) ListDatabases() ([]string, error) {
	db, err := m.connect()
	if err != nil {
		return nil, err
	}
	defer db.Close()

	rows, err := db.Query("SHOW DATABASES")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var dbs []string
	for rows.Next() {
		var name string
		if err := rows.Scan(&name); err == nil {
			if name != "information_schema" && name != "mysql" && name != "performance_schema" && name != "sys" {
				dbs = append(dbs, name)
			}
		}
	}
	return dbs, nil
}

func (m *DBManager) DeleteDatabase(dbName string) error {
	if !safeIdentifier.MatchString(dbName) {
		return fmt.Errorf("invalid database name")
	}

	db, err := m.connect()
	if err != nil {
		return err
	}
	defer db.Close()

	_, err = db.Exec(fmt.Sprintf("DROP DATABASE IF EXISTS `%s`", dbName))
	return err
}
