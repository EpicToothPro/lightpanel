'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockEmailDomains } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function EmailDomainsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  return (
    <div className="space-y-6">
      <PageHeader title="Email Domains" description="Manage domains authorized to send and receive email on this server">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Add Email Domain
        </button>
      </PageHeader>

      {showAdd && (
        <div className="rounded-xl border border-indigo-500/20 bg-[#12121a] p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-200">Add New Email Domain</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Domain Name</label>
              <input
                type="text"
                placeholder="example.com"
                value={newDomain}
                onChange={e => setNewDomain(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Catch-All Address (optional)</label>
              <input
                type="text"
                placeholder="admin@example.com"
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-[#1e293b]">
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              Configure Domain
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-slate-400 border border-[#1e293b] rounded-lg hover:border-[#334155]">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {mockEmailDomains.map(d => (
          <div key={d.id} className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4 hover:border-[#334155] transition-all">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold font-mono text-slate-100">{d.name}</h3>
                <p className="text-xs text-slate-500">Added {formatDate(d.created_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/ssl"
                  className="px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors flex items-center gap-1.5"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>
                  Bind TLS (mail.{d.name})
                </Link>
                <Link href={`/email/dns?domain=${d.name}`} className="px-3 py-1.5 text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20">
                  DNS Setup
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-[#1e293b]">
              <div>
                <span className="text-xs text-slate-500 block">Mailboxes</span>
                <span className="text-sm font-semibold text-slate-200">{d.mailboxes_count}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Aliases</span>
                <span className="text-sm font-semibold text-slate-200">{d.aliases_count}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Catch-All</span>
                <span className="text-xs font-mono text-indigo-400">{d.catchall_address || 'None'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">DKIM / SPF / DMARC</span>
                <div className="flex items-center gap-1.5 mt-1">
                  <StatusBadge status={d.dkim_status} dot={false} />
                  <StatusBadge status={d.spf_status} dot={false} />
                  <StatusBadge status={d.dmarc_status} dot={false} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
