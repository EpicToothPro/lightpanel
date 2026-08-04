'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';

export default function EmailServerSettingsPage() {
  const [smtpPort, setSmtpPort] = useState('587');
  const [imapPort, setImapPort] = useState('993');
  const [tlsEnforced, setTlsEnforced] = useState(true);
  const [rateLimit, setRateLimit] = useState('500');
  const [maxAttachmentMB, setMaxAttachmentMB] = useState('25');

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Email Server Settings" description="Configure Postfix, Dovecot, TLS security policies, and rate limits" />

      {/* Daemon Status */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-200">Mail Daemons Health & Ports</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Postfix (MTA)', status: 'running', port: '25 / 587' },
            { name: 'Dovecot (IMAP)', status: 'running', port: '993 / 143' },
            { name: 'OpenDKIM', status: 'running', port: '8891' },
            { name: 'Rspamd', status: 'running', port: '11334' },
          ].map(d => (
            <div key={d.name} className="p-4 rounded-xl border border-[#1e293b] bg-[#0a0a0f]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 pulse-dot" />
                <span className="text-xs font-semibold text-slate-200">{d.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">Port: {d.port}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TLS & Security Policy */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-200">Security & TLS Enforcement</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-[#1e293b]">
            <div>
              <p className="text-sm font-medium text-slate-200">Enforce STARTTLS for Outbound & Inbound SMTP</p>
              <p className="text-xs text-slate-500">Require encrypted transmission for all email connections</p>
            </div>
            <input
              type="checkbox"
              checked={tlsEnforced}
              onChange={e => setTlsEnforced(e.target.checked)}
              className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Outbound Hourly Rate Limit (per account)</label>
            <input
              type="number"
              value={rateLimit}
              onChange={e => setRateLimit(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Max Attachment Size (MB)</label>
            <input
              type="number"
              value={maxAttachmentMB}
              onChange={e => setMaxAttachmentMB(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-[#1e293b] flex justify-end">
          <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
            Save Mail Server Settings
          </button>
        </div>
      </div>
    </div>
  );
}
