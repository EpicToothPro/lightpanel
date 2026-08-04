// ============================================================================
// LightPanel Frontend Type Definitions
// Maps to Go backend structs + extended types for the premium UI
// ============================================================================

// --- System Stats (maps to monitor.SystemStats) ---
export interface SystemStats {
  cpu_usage: number;
  mem_total_mb: number;
  mem_used_mb: number;
  mem_free_mb: number;
  mem_percent: number;
  disk_total_gb: number;
  disk_used_gb: number;
  disk_free_gb: number;
  disk_percent: number;
  uptime: string;
  load_avg: string;
  hostname: string;
}

// --- Site Config (maps to nginx.SiteConfig) ---
export interface SiteConfig {
  domain: string;
  site_type: 'static' | 'php';
  php_version?: string;
  ssl_enabled: boolean;
  created_at: string;
}

// --- Database Info (maps to database.DBInfo) ---
export interface DatabaseInfo {
  name: string;
  user?: string;
}

// --- SSL Certificate (maps to ssl.CertInfo) ---
export interface CertInfo {
  domain: string;
  expiry: string;
  status: 'valid' | 'expiring' | 'expired';
  issuer: string;
}

// --- Extended Types for Premium UI ---

export type RuntimeType = 'nodejs' | 'nextjs' | 'php' | 'python' | 'ruby' | 'java' | 'kotlin' | 'swift' | 'dotnet' | 'perl' | 'static' | 'html' | 'typescript';

export type AppStatus = 'running' | 'stopped' | 'deploying' | 'error' | 'starting' | 'restarting';
export type DeployStatus = 'success' | 'failed' | 'building' | 'deploying' | 'cancelled' | 'queued';
export type BackupStatus = 'completed' | 'in_progress' | 'failed' | 'scheduled';
export type CronStatus = 'active' | 'paused' | 'error';
export type DatabaseType = 'mysql' | 'mariadb' | 'postgresql' | 'mongodb' | 'redis';
export type DatabaseStatus = 'running' | 'stopped' | 'error' | 'maintenance';
export type SSLChallengeType = 'http-01' | 'dns-01';
export type LogLevel = 'info' | 'warn' | 'error' | 'debug';
export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Application {
  id: string;
  name: string;
  runtime: RuntimeType;
  version: string;
  status: AppStatus;
  domain: string;
  port: number;
  cpu_usage: number;
  memory_usage: number;
  memory_limit: number;
  last_deployment: string;
  git_repo?: string;
  git_branch?: string;
  build_command?: string;
  start_command?: string;
  env_vars: Record<string, string>;
  created_at: string;
}

export interface Website {
  id: string;
  name: string;
  domain: string;
  document_root: string;
  runtime: 'static' | 'php';
  php_version?: string;
  ssl_enabled: boolean;
  ssl_status: 'active' | 'pending' | 'none';
  deployment_status: DeployStatus;
  traffic_today: number;
  created_at: string;
}

export interface Domain {
  id: string;
  name: string;
  status: 'active' | 'pending' | 'error';
  dns_status: 'propagated' | 'pending' | 'error';
  ssl_status: 'active' | 'pending' | 'expired' | 'none';
  linked_to?: string;
  linked_type?: 'website' | 'application';
  nameservers: string[];
  verified: boolean;
  created_at: string;
}

export interface Subdomain {
  id: string;
  name: string;
  parent_domain: string;
  full_domain: string;
  target: string;
  target_type: 'website' | 'application' | 'redirect';
  port?: number;
  ssl_enabled: boolean;
  created_at: string;
}

export interface DatabaseExtended {
  id: string;
  name: string;
  type: DatabaseType;
  version: string;
  status: DatabaseStatus;
  host: string;
  port: number;
  storage_used_mb: number;
  storage_limit_mb: number;
  linked_apps: string[];
  last_backup?: string;
  username: string;
  created_at: string;
}

export interface SSLCertificate {
  id: string;
  domain: string;
  alt_names: string[];
  issuer: string;
  status: 'active' | 'expiring' | 'expired' | 'pending' | 'revoked';
  issued_at: string;
  expires_at: string;
  auto_renew: boolean;
  challenge_type: SSLChallengeType;
}

export interface Deployment {
  id: string;
  app_name: string;
  git_repo: string;
  branch: string;
  commit: string;
  commit_message: string;
  status: DeployStatus;
  duration: number; // seconds
  started_at: string;
  finished_at?: string;
  triggered_by: string;
}

export interface Backup {
  id: string;
  name: string;
  type: 'website' | 'database' | 'application' | 'full';
  target_name: string;
  status: BackupStatus;
  size_mb: number;
  created_at: string;
  retention_days: number;
  storage_location: string;
  scheduled: boolean;
}

export interface CronJob {
  id: string;
  name: string;
  command: string;
  schedule: string;
  status: CronStatus;
  last_run?: string;
  next_run?: string;
  last_status?: 'success' | 'failed';
  output?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  source: string;
  message: string;
  details?: string;
}

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  action_url?: string;
}

export interface ActivityEvent {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  user: string;
  icon?: string;
}

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory';
  size: number;
  modified: string;
  permissions: string;
  extension?: string;
}

export interface MonitoringDataPoint {
  timestamp: string;
  value: number;
}

export interface MonitoringMetric {
  name: string;
  unit: string;
  current: number;
  data: MonitoringDataPoint[];
}

export interface EnvVariable {
  key: string;
  value: string;
  target: string;
  type: 'plain' | 'secret';
}

// --- Email Module Types ---

export interface EmailDomain {
  id: string;
  name: string;
  mailboxes_count: number;
  aliases_count: number;
  catchall_address?: string;
  dkim_status: 'valid' | 'pending' | 'missing';
  spf_status: 'valid' | 'pending' | 'missing';
  dmarc_status: 'valid' | 'pending' | 'missing';
  created_at: string;
}

export interface Mailbox {
  id: string;
  email: string;
  domain: string;
  quota_mb: number;
  used_mb: number;
  status: 'active' | 'suspended' | 'locked';
  imap_enabled: boolean;
  smtp_enabled: boolean;
  pop3_enabled: boolean;
  auto_reply_enabled: boolean;
  auto_reply_subject?: string;
  auto_reply_body?: string;
  forward_address?: string;
  aliases: string[];
  created_at: string;
  last_login?: string;
}

export interface EmailAlias {
  id: string;
  alias_email: string;
  target_emails: string[];
  domain: string;
  type: 'alias' | 'forwarder' | 'catch-all' | 'group' | 'shared';
  created_at: string;
}

export interface SpamSettings {
  domain: string;
  spam_score_threshold: number;
  greylisting: boolean;
  bayesian_filtering: boolean;
  auto_delete_spam: boolean;
  blacklist: string[];
  whitelist: string[];
}

export interface DNSAuthRecord {
  type: 'MX' | 'TXT (SPF)' | 'TXT (DKIM)' | 'TXT (DMARC)' | 'A (Mail)' | 'AAAA';
  host: string;
  value: string;
  status: 'valid' | 'pending' | 'error';
  instructions: string;
}

export interface MailAttachment {
  name: string;
  size: number;
  type: string;
}

export interface MailMessage {
  id: string;
  folder: 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'archive';
  from: string;
  to: string;
  subject: string;
  body: string;
  snippet: string;
  timestamp: string;
  read: boolean;
  flagged: boolean;
  attachments?: MailAttachment[];
}

export interface MailLog {
  id: string;
  timestamp: string;
  sender: string;
  recipient: string;
  subject: string;
  status: 'delivered' | 'bounced' | 'rejected' | 'queued';
  spam_score: number;
  client_ip: string;
}

export interface QueueItem {
  id: string;
  queue_id: string;
  sender: string;
  recipient: string;
  size_bytes: number;
  arrived_at: string;
  status: 'active' | 'deferred' | 'hold';
  delay_reason?: string;
}

// --- API Response Types ---
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  success: boolean;
}

// --- Navigation ---
export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: number;
  children?: NavItem[];
}

// --- Create Forms ---
export interface CreateSiteForm {
  domain: string;
  site_type: 'static' | 'php';
  php_version?: string;
}

export interface CreateDatabaseForm {
  db_name: string;
  db_user: string;
  db_pass: string;
}

export interface CreateSubdomainForm {
  name: string;
  parent_domain: string;
  target: string;
  target_type: 'website' | 'application' | 'redirect';
  port?: number;
  ssl_enabled: boolean;
}
