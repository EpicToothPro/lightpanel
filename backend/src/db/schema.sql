-- ============================================================================
-- LightPanel Complete PostgreSQL Schema
-- Self-Hosted Web-Hosting Control Panel Core Database
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(64) PRIMARY KEY,
  username VARCHAR(64) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(32) NOT NULL DEFAULT 'standard', -- 'owner', 'admin', 'standard', 'readonly'
  two_factor_secret VARCHAR(255),
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  status VARCHAR(32) DEFAULT 'active',
  storage_quota_mb INT DEFAULT -1, -- -1 = Unlimited
  max_websites INT DEFAULT -1, -- -1 = Unlimited
  max_databases INT DEFAULT -1, -- -1 = Unlimited
  max_mailboxes INT DEFAULT -1, -- -1 = Unlimited
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_shares (
  id VARCHAR(64) PRIMARY KEY,
  resource_type VARCHAR(32) NOT NULL, -- 'site', 'app', 'domain', 'database', 'mailbox'
  resource_id VARCHAR(64) NOT NULL,
  shared_with_user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  permission_level VARCHAR(32) NOT NULL, -- 'view', 'edit', 'deploy', 'admin'
  granted_by VARCHAR(64) NOT NULL REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS websites (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  domain VARCHAR(255) UNIQUE NOT NULL,
  document_root VARCHAR(512) NOT NULL,
  runtime VARCHAR(32) NOT NULL, -- 'static', 'php'
  php_version VARCHAR(16),
  ssl_enabled BOOLEAN DEFAULT FALSE,
  ssl_status VARCHAR(32) DEFAULT 'none',
  deployment_status VARCHAR(32) DEFAULT 'success',
  traffic_today INT DEFAULT 0,
  owner_user_id VARCHAR(64) REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  runtime VARCHAR(32) NOT NULL, -- 'nodejs', 'nextjs', 'python', 'java', 'ruby', 'dotnet', etc.
  version VARCHAR(32) NOT NULL,
  status VARCHAR(32) DEFAULT 'stopped',
  domain VARCHAR(255) NOT NULL,
  port INT NOT NULL,
  cpu_usage NUMERIC(5,2) DEFAULT 0.00,
  memory_usage INT DEFAULT 0,
  memory_limit INT DEFAULT 512,
  last_deployment TIMESTAMP WITH TIME ZONE,
  git_repo TEXT,
  git_branch VARCHAR(128) DEFAULT 'main',
  build_command TEXT,
  start_command TEXT,
  env_vars_json JSONB DEFAULT '{}'::jsonb,
  owner_user_id VARCHAR(64) REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS domains (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  status VARCHAR(32) DEFAULT 'active',
  dns_status VARCHAR(32) DEFAULT 'propagated',
  ssl_status VARCHAR(32) DEFAULT 'active',
  linked_to VARCHAR(128),
  linked_type VARCHAR(32),
  nameservers_json JSONB DEFAULT '[]'::jsonb,
  verified BOOLEAN DEFAULT TRUE,
  owner_user_id VARCHAR(64) REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subdomains (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  parent_domain VARCHAR(255) NOT NULL,
  full_domain VARCHAR(255) UNIQUE NOT NULL,
  target VARCHAR(128) NOT NULL,
  target_type VARCHAR(32) NOT NULL,
  port INT,
  ssl_enabled BOOLEAN DEFAULT TRUE,
  owner_user_id VARCHAR(64) REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS databases (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  type VARCHAR(32) NOT NULL, -- 'postgresql', 'mariadb', 'mongodb', 'redis'
  version VARCHAR(32) NOT NULL,
  status VARCHAR(32) DEFAULT 'running',
  host VARCHAR(128) DEFAULT '127.0.0.1',
  port INT NOT NULL,
  storage_used_mb INT DEFAULT 0,
  storage_limit_mb INT DEFAULT -1, -- -1 = Unlimited
  linked_apps_json JSONB DEFAULT '[]'::jsonb,
  username VARCHAR(64) NOT NULL,
  password_encrypted TEXT NOT NULL,
  owner_user_id VARCHAR(64) REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ssl_certificates (
  id VARCHAR(64) PRIMARY KEY,
  domain VARCHAR(255) UNIQUE NOT NULL,
  alt_names_json JSONB DEFAULT '[]'::jsonb,
  issuer VARCHAR(128) DEFAULT 'Lets Encrypt',
  status VARCHAR(32) DEFAULT 'active',
  issued_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT TRUE,
  challenge_type VARCHAR(32) DEFAULT 'http-01'
);

CREATE TABLE IF NOT EXISTS email_domains (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) UNIQUE NOT NULL,
  mailboxes_count INT DEFAULT 0,
  aliases_count INT DEFAULT 0,
  catchall_address VARCHAR(255),
  dkim_status VARCHAR(32) DEFAULT 'valid',
  spf_status VARCHAR(32) DEFAULT 'valid',
  dmarc_status VARCHAR(32) DEFAULT 'valid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mailboxes (
  id VARCHAR(64) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  domain VARCHAR(255) NOT NULL,
  quota_mb INT DEFAULT -1, -- -1 = Unlimited
  used_mb INT DEFAULT 0,
  status VARCHAR(32) DEFAULT 'active',
  imap_enabled BOOLEAN DEFAULT TRUE,
  smtp_enabled BOOLEAN DEFAULT TRUE,
  pop3_enabled BOOLEAN DEFAULT TRUE,
  auto_reply_enabled BOOLEAN DEFAULT FALSE,
  auto_reply_subject TEXT,
  auto_reply_body TEXT,
  forward_address VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS email_aliases (
  id VARCHAR(64) PRIMARY KEY,
  alias_email VARCHAR(255) UNIQUE NOT NULL,
  target_emails_json JSONB NOT NULL,
  domain VARCHAR(255) NOT NULL,
  type VARCHAR(32) DEFAULT 'alias', -- 'alias', 'forwarder', 'catch-all', 'group', 'shared'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spam_settings (
  domain VARCHAR(255) PRIMARY KEY,
  spam_score_threshold NUMERIC(4,2) DEFAULT 5.0,
  greylisting BOOLEAN DEFAULT TRUE,
  bayesian_filtering BOOLEAN DEFAULT TRUE,
  auto_delete_spam BOOLEAN DEFAULT FALSE,
  blacklist_json JSONB DEFAULT '[]'::jsonb,
  whitelist_json JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS mail_queue (
  id VARCHAR(64) PRIMARY KEY,
  queue_id VARCHAR(64) NOT NULL,
  sender VARCHAR(255) NOT NULL,
  recipient VARCHAR(255) NOT NULL,
  size_bytes INT DEFAULT 0,
  arrived_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(32) DEFAULT 'active',
  delay_reason TEXT
);

CREATE TABLE IF NOT EXISTS backups (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  type VARCHAR(32) NOT NULL, -- 'website', 'database', 'application', 'full'
  target_name VARCHAR(128) NOT NULL,
  status VARCHAR(32) DEFAULT 'completed',
  size_mb INT DEFAULT 0,
  retention_days INT DEFAULT 30,
  storage_location VARCHAR(512) NOT NULL,
  scheduled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cron_jobs (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(128) NOT NULL,
  command TEXT NOT NULL,
  schedule VARCHAR(64) NOT NULL,
  status VARCHAR(32) DEFAULT 'active',
  last_run TIMESTAMP WITH TIME ZONE,
  next_run TIMESTAMP WITH TIME ZONE,
  last_status VARCHAR(32) DEFAULT 'success',
  output TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(64) PRIMARY KEY,
  user_id VARCHAR(64),
  username VARCHAR(64) NOT NULL,
  action VARCHAR(128) NOT NULL,
  resource_type VARCHAR(64),
  resource_id VARCHAR(64),
  details TEXT,
  ip_address VARCHAR(45),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_properties (
  id VARCHAR(64) PRIMARY KEY,
  domain VARCHAR(255) UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  privacy_mode VARCHAR(32) DEFAULT 'anonymized',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id VARCHAR(64) PRIMARY KEY,
  domain VARCHAR(255) NOT NULL,
  path VARCHAR(512) NOT NULL,
  visitor_hash VARCHAR(64) NOT NULL,
  referrer TEXT,
  device_type VARCHAR(32) DEFAULT 'desktop',
  country VARCHAR(64) DEFAULT 'Unknown',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(128) PRIMARY KEY,
  value_json JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS setup_status (
  id INT PRIMARY KEY DEFAULT 1,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  setup_data_json JSONB DEFAULT '{}'::jsonb
);
