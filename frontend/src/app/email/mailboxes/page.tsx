'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { CopyButton } from '@/components/shared/copy-button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { mockMailboxes, mockEmailDomains } from '@/lib/mock-data';
import { formatBytes, formatDate } from '@/lib/utils';

export default function MailboxesPage() {
  const [domainFilter, setDomainFilter] = useState('all');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedMailbox, setSelectedMailbox] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filtered = mockMailboxes.filter(m => domainFilter === 'all' || m.domain === domainFilter);

  return (
    <div className="space-y-6">
      <PageHeader title="Mailbox Management" description="Create and manage user email accounts, quotas, protocols, and forwarders">
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Create Mailbox
        </button>
      </PageHeader>

      {/* Filter by Domain */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-slate-400">Filter Domain:</label>
        <select
          value={domainFilter}
          onChange={e => setDomainFilter(e.target.value)}
          className="px-3 py-1.5 text-sm bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200"
        >
          <option value="all">All Domains</option>
          {mockEmailDomains.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Create Mailbox Wizard Form */}
      {showCreate && (
        <div className="rounded-xl border border-indigo-500/20 bg-[#12121a] p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-200">Create New Mailbox Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email Username</label>
              <input type="text" placeholder="alex" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Domain</label>
              <select className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200">
                {mockEmailDomains.map(d => (
                  <option key={d.id} value={d.name}>@{d.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Storage Quota</label>
              <select className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200">
                <option value="1024">1 GB</option>
                <option value="2048">2 GB</option>
                <option value="5120">5 GB</option>
                <option value="10240">10 GB</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <input type="password" placeholder="••••••••••••" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200" />
            </div>
            <div className="sm:col-span-2 flex items-center gap-4 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-indigo-500" />
                <span className="text-xs text-slate-300">Enable IMAP</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-indigo-500" />
                <span className="text-xs text-slate-300">Enable SMTP</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-indigo-500" />
                <span className="text-xs text-slate-300">Enable POP3</span>
              </label>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-[#1e293b]">
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Save Mailbox</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm font-medium text-slate-400 border border-[#1e293b] rounded-lg hover:border-[#334155]">Cancel</button>
          </div>
        </div>
      )}

      {/* Mailbox Table */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Mailbox</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Quota Usage</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Protocols</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Last Login</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {filtered.map(m => {
                const pct = (m.used_mb / m.quota_mb) * 100;
                return (
                  <tr key={m.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <span className="text-sm font-mono font-medium text-slate-200">{m.email}</span>
                        {m.aliases.length > 0 && (
                          <p className="text-xs text-slate-500 truncate max-w-xs mt-0.5">Aliases: {m.aliases.join(', ')}</p>
                        )}
                        {m.auto_reply_enabled && (
                          <span className="inline-block mt-1 text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">Auto-Reply Active</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-36">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-400 font-mono">{(m.used_mb / 1024).toFixed(1)} GB</span>
                          <span className="text-slate-500 text-[10px]">{(m.quota_mb / 1024).toFixed(0)} GB</span>
                        </div>
                        <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${pct > 80 ? 'bg-amber-400' : 'bg-indigo-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-xs font-mono">
                        <span className={m.imap_enabled ? 'text-emerald-400' : 'text-slate-600'}>IMAP</span>
                        <span className="text-slate-700">•</span>
                        <span className={m.smtp_enabled ? 'text-emerald-400' : 'text-slate-600'}>SMTP</span>
                        <span className="text-slate-700">•</span>
                        <span className={m.pop3_enabled ? 'text-emerald-400' : 'text-slate-600'}>POP3</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={m.status} />
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-xs text-slate-500">{m.last_login ? formatDate(m.last_login) : 'Never'}</span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelectedMailbox(m.id)} className="text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-500/10">Edit</button>
                        <button onClick={() => setDeleteTarget(m.id)} className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10">Delete</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => setDeleteTarget(null)}
        title="Delete Mailbox"
        description="Are you sure you want to delete this mailbox? All stored emails, folders, and settings will be permanently lost."
        confirmText="Delete Mailbox"
        variant="danger"
      />
    </div>
  );
}
