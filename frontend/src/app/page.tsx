'use client';

import React from 'react';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockStats, mockApplications, mockWebsites, mockDeployments, mockActivity, mockSSLCertificates, mockMailboxes } from '@/lib/mock-data';
import { formatRelativeTime, formatDuration, getRuntimeColor } from '@/lib/utils';
import Link from 'next/link';

// Simple inline SVG icons for the dashboard
const CpuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>
);
const MemIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 19v-3"/><path d="M10 19v-3"/><path d="M14 19v-3"/><path d="M18 19v-3"/><path d="M8 11V9"/><path d="M16 11V9"/><path d="M12 11V9"/><path d="M2 15h20"/><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z"/></svg>
);
const DiskIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>
);
const UptimeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
);
const NetworkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>
);
const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
);

const quickActions = [
  { label: 'Create Website', href: '/websites', icon: '🌐', color: 'from-blue-500/20 to-blue-600/5' },
  { label: 'Add Domain', href: '/domains', icon: '🔗', color: 'from-purple-500/20 to-purple-600/5' },
  { label: 'Create Subdomain', href: '/subdomains', icon: '🔀', color: 'from-violet-500/20 to-violet-600/5' },
  { label: 'Deploy Application', href: '/deployments', icon: '🚀', color: 'from-indigo-500/20 to-indigo-600/5' },
  { label: 'Create Database', href: '/databases', icon: '🗄️', color: 'from-cyan-500/20 to-cyan-600/5' },
  { label: 'Open Webmail', href: '/email/webmail', icon: '📧', color: 'from-emerald-500/20 to-emerald-600/5' },
  { label: 'Issue SSL Certificate', href: '/ssl', icon: '🔒', color: 'from-emerald-500/20 to-emerald-600/5' },
  { label: 'Upload Files', href: '/files', icon: '📁', color: 'from-amber-500/20 to-amber-600/5' },
];

export default function DashboardPage() {
  const stats = mockStats;
  const apps = mockApplications;
  const runningApps = apps.filter(a => a.status === 'running');
  const activeWebsites = mockWebsites.filter(w => w.deployment_status === 'success');
  const expiringCerts = mockSSLCertificates.filter(c => c.status === 'expiring');
  const activeMailboxes = mockMailboxes.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100 tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Welcome back — <span className="font-mono text-slate-300">{stats.hostname}</span> is online
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="CPU Usage"
          value={`${stats.cpu_usage.toFixed(1)}%`}
          icon={<CpuIcon />}
          color="indigo"
          progress={stats.cpu_usage}
          subtitle={`Load: ${stats.load_avg}`}
        />
        <StatCard
          title="Memory"
          value={`${stats.mem_used_mb} MB`}
          icon={<MemIcon />}
          color="cyan"
          progress={stats.mem_percent}
          subtitle={`${stats.mem_free_mb} MB free of ${stats.mem_total_mb} MB`}
        />
        <StatCard
          title="Disk"
          value={`${stats.disk_used_gb} GB`}
          icon={<DiskIcon />}
          color="emerald"
          progress={stats.disk_percent}
          subtitle={`${stats.disk_free_gb} GB free of ${stats.disk_total_gb} GB`}
        />
        <StatCard
          title="Uptime"
          value={stats.uptime}
          icon={<UptimeIcon />}
          color="purple"
          subtitle="Last reboot: Jun 23, 2026"
        />
        <StatCard
          title="Applications"
          value={`${runningApps.length}/${apps.length}`}
          icon={<NetworkIcon />}
          color="amber"
          subtitle={`${runningApps.length} running`}
        />
        <StatCard
          title="Mailboxes"
          value={`${activeMailboxes}`}
          icon={<MailIcon />}
          color="emerald"
          subtitle="Postfix & Dovecot active"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-slate-200 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border border-[#1e293b] bg-gradient-to-br ${action.color} 
                hover:border-[#334155] hover:scale-[1.02] transition-all duration-200 group`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">{action.icon}</span>
              <span className="text-[11px] font-medium text-slate-400 group-hover:text-slate-300 text-center leading-tight">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Running Applications */}
        <div className="lg:col-span-2 rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e293b]">
            <h2 className="text-sm font-semibold text-slate-200">Running Applications</h2>
            <Link href="/applications" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-[#1e293b]">
            {apps.map((app) => (
              <div key={app.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center justify-center w-9 h-9 rounded-lg" style={{ backgroundColor: getRuntimeColor(app.runtime) + '20' }}>
                  <span className="text-sm font-bold" style={{ color: getRuntimeColor(app.runtime) }}>
                    {app.runtime.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-200 truncate">{app.name}</span>
                    <StatusBadge status={app.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {app.domain} • port {app.port} • {app.runtime} {app.version}
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-0.5">
                  <span className="text-xs text-slate-400">{app.cpu_usage}% CPU</span>
                  <span className="text-xs text-slate-500">{app.memory_usage} MB</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* System Health */}
          <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5">
            <h2 className="text-sm font-semibold text-slate-200 mb-4">System Health</h2>
            <div className="space-y-3">
              {[
                { label: 'Nginx', status: 'running' },
                { label: 'Postfix (Mail)', status: 'running' },
                { label: 'Dovecot (IMAP)', status: 'running' },
                { label: 'MariaDB', status: 'running' },
                { label: 'PHP-FPM 8.3', status: 'running' },
                { label: 'Redis', status: 'running' },
                { label: 'Certbot', status: 'active' },
                { label: 'SSH', status: 'running' },
              ].map(service => (
                <div key={service.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">{service.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-dot" />
                    <span className="text-xs text-emerald-400 font-medium">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SSL Expiring */}
          {expiringCerts.length > 0 && (
            <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 9v4" strokeLinecap="round"/><path d="M12 17h.01" strokeLinecap="round"/>
                </svg>
                <h2 className="text-sm font-semibold text-amber-400">SSL Certificates Expiring</h2>
              </div>
              {expiringCerts.map(cert => (
                <div key={cert.id} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-slate-300 font-mono">{cert.domain}</span>
                  <span className="text-xs text-amber-400">
                    {Math.ceil((new Date(cert.expires_at).getTime() - Date.now()) / 86400000)}d left
                  </span>
                </div>
              ))}
              <Link href="/ssl" className="text-xs text-amber-400 hover:text-amber-300 mt-2 block transition-colors">
                Manage certificates →
              </Link>
            </div>
          )}

          {/* Active Websites */}
          <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-slate-200">Websites</h2>
              <span className="text-xs text-slate-500">{activeWebsites.length} active</span>
            </div>
            <div className="space-y-2.5">
              {mockWebsites.slice(0, 4).map(site => (
                <div key={site.id} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-slate-300 font-mono truncate">{site.domain}</p>
                    <p className="text-xs text-slate-500">{site.runtime}{site.php_version ? ` ${site.php_version}` : ''} • {site.traffic_today.toLocaleString()} visits</p>
                  </div>
                  <StatusBadge status={site.ssl_status === 'active' ? 'active' : site.ssl_status} dot={false} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Deployments */}
        <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e293b]">
            <h2 className="text-sm font-semibold text-slate-200">Recent Deployments</h2>
            <Link href="/deployments" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-[#1e293b]">
            {mockDeployments.slice(0, 4).map((dep) => (
              <div key={dep.id} className="flex items-center gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  dep.status === 'success' ? 'bg-emerald-400' : dep.status === 'failed' ? 'bg-red-400' : 'bg-blue-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-300">{dep.app_name}</span>
                    <span className="text-xs text-slate-600 font-mono">{dep.commit}</span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{dep.commit_message}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-400">{formatDuration(dep.duration)}</p>
                  <p className="text-[10px] text-slate-600">{formatRelativeTime(dep.started_at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#1e293b]">
            <h2 className="text-sm font-semibold text-slate-200">Recent Activity</h2>
            <Link href="/audit-log" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">View all →</Link>
          </div>
          <div className="divide-y divide-[#1e293b]">
            {mockActivity.slice(0, 6).map((event) => {
              const typeColors: Record<string, string> = {
                deployment: 'bg-indigo-400',
                ssl: 'bg-emerald-400',
                backup: 'bg-cyan-400',
                site: 'bg-purple-400',
                database: 'bg-amber-400',
                error: 'bg-red-400',
              };
              return (
                <div key={event.id} className="flex items-start gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${typeColors[event.type] || 'bg-slate-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-300">{event.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{event.description}</p>
                  </div>
                  <span className="text-[10px] text-slate-600 flex-shrink-0 mt-0.5">{formatRelativeTime(event.timestamp)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
