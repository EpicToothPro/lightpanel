'use client';

import React from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockEmailDomains, mockMailboxes, mockDNSAuthRecords, mockQueueItems, mockMailLogs } from '@/lib/mock-data';

export default function EmailDashboardPage() {
  const totalMailboxes = mockMailboxes.length;
  const activeDomains = mockEmailDomains.length;
  const sentToday = 142;
  const receivedToday = 890;
  const spamBlocked = 67;
  const queueSize = mockQueueItems.length;
  const failedDeliveries = mockMailLogs.filter(l => l.status === 'bounced' || l.status === 'rejected').length;
  const usedStorageMB = mockMailboxes.reduce((acc, m) => acc + m.used_mb, 0);
  const totalStorageMB = mockMailboxes.reduce((acc, m) => acc + m.quota_mb, 0);

  const MailIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;
  const InboxIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
  const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>;
  const ServerIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/></svg>;

  const emailSubPages = [
    { label: 'Domains', href: '/email/domains', icon: '🌐', desc: 'Email domain configuration' },
    { label: 'Mailboxes', href: '/email/mailboxes', icon: '📬', desc: 'Manage user accounts & quotas' },
    { label: 'Aliases & Forwards', href: '/email/aliases', icon: '🔀', desc: 'Forwarding & catch-all rules' },
    { label: 'Spam & Filtering', href: '/email/spam', icon: '🛡️', desc: 'SpamAssassin & blacklists' },
    { label: 'DNS & Auth', href: '/email/dns', icon: '🔑', desc: 'MX, SPF, DKIM & DMARC' },
    { label: 'Webmail Client', href: '/email/webmail', icon: '📧', desc: 'Launch browser email client' },
    { label: 'Mail Logs', href: '/email/logs', icon: '📜', desc: 'Outbound & inbound delivery logs' },
    { label: 'Mail Queue', href: '/email/queue', icon: '⏳', desc: 'Postfix queue monitoring' },
    { label: 'Server Settings', href: '/email/settings', icon: '⚙️', desc: 'SMTP / IMAP server config' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Email Services" description="Self-hosted mail server dashboard for domains, mailboxes, and security">
        <Link
          href="/email/webmail"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg shadow-emerald-900/20"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>
          Open Webmail
        </Link>
      </PageHeader>

      {/* Webmail Featured Launch Banner */}
      <div className="rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/50 via-purple-950/30 to-[#12121a] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-indigo-400 pulse-dot" />
            Browser-Based Webmail Ready
          </div>
          <h2 className="text-xl font-bold text-slate-100">Access Your Webmail Client</h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Read, compose, manage folders, set filters, and view attachments directly inside LightPanel's integrated email client interface.
          </p>
        </div>
        <div className="flex items-center gap-3 z-10 flex-shrink-0">
          <Link
            href="/email/webmail"
            className="px-5 py-2.5 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2"
          >
            Launch Webmail →
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Mailboxes"
          value={totalMailboxes}
          icon={<MailIcon />}
          color="indigo"
          subtitle={`${activeDomains} active email domains`}
        />
        <StatCard
          title="Sent / Received Today"
          value={`${sentToday} / ${receivedToday}`}
          icon={<InboxIcon />}
          color="cyan"
          subtitle={`${spamBlocked} spam messages blocked`}
        />
        <StatCard
          title="Mail Storage Used"
          value={`${(usedStorageMB / 1024).toFixed(1)} GB`}
          icon={<ServerIcon />}
          color="emerald"
          progress={(usedStorageMB / totalStorageMB) * 100}
          subtitle={`${((totalStorageMB - usedStorageMB) / 1024).toFixed(1)} GB free of ${(totalStorageMB / 1024).toFixed(1)} GB`}
        />
        <StatCard
          title="Mail Queue & Bounces"
          value={`${queueSize} in Queue`}
          icon={<ShieldIcon />}
          color={failedDeliveries > 0 ? 'amber' : 'purple'}
          subtitle={`${failedDeliveries} failed bounces today`}
        />
      </div>

      {/* Authentication Status Overview */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-slate-200">Domain Mail Authentication Status</h3>
          <Link href="/email/dns" className="text-xs text-indigo-400 hover:text-indigo-300">View DNS records →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockEmailDomains.map(d => (
            <div key={d.id} className="p-4 rounded-xl border border-[#1e293b] bg-[#0a0a0f] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-mono font-bold text-slate-200">{d.name}</span>
                <span className="text-xs text-slate-500">{d.mailboxes_count} mailboxes</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">SPF Record</span>
                  <StatusBadge status={d.spf_status} dot={false} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">DKIM Signing</span>
                  <StatusBadge status={d.dkim_status} dot={false} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">DMARC Policy</span>
                  <StatusBadge status={d.dmarc_status} dot={false} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Email Modules Grid */}
      <div>
        <h3 className="text-base font-semibold text-slate-200 mb-3">Email Management Sections</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {emailSubPages.map(p => (
            <Link
              key={p.label}
              href={p.href}
              className="p-5 rounded-xl border border-[#1e293b] bg-[#12121a] hover:border-[#334155] hover:bg-[#151524] transition-all group flex items-start gap-4"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform">{p.icon}</span>
              <div>
                <h4 className="text-sm font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">{p.label}</h4>
                <p className="text-xs text-slate-500 mt-1">{p.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
