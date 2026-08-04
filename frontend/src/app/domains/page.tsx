'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { CopyButton } from '@/components/shared/copy-button';
import { mockDomains } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function DomainsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [newDomain, setNewDomain] = useState('');

  return (
    <div className="space-y-6">
      <PageHeader title="Domains" description="Manage your domain names and DNS configuration">
        <button onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Add Domain
        </button>
      </PageHeader>

      {/* Add Domain Form */}
      {showAdd && (
        <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
          <h3 className="text-sm font-semibold text-slate-200 mb-3">Add New Domain</h3>
          <div className="flex gap-3">
            <input type="text" placeholder="example.com" value={newDomain} onChange={e => setNewDomain(e.target.value)}
              className="flex-1 max-w-sm px-4 py-2 text-sm bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              Add Domain
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 border border-[#1e293b] rounded-lg hover:border-[#334155] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Domain Cards */}
      <div className="space-y-4">
        {mockDomains.map(domain => (
          <div key={domain.id} className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden hover:border-[#334155] transition-all">
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold text-slate-200 font-mono">{domain.name}</h3>
                    {domain.verified && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-emerald-400">
                        <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">Added {formatDate(domain.created_at)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={domain.status} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">DNS Status</p>
                  <StatusBadge status={domain.dns_status} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">SSL Status</p>
                  <StatusBadge status={domain.ssl_status} />
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Linked To</p>
                  <span className="text-sm text-slate-300">{domain.linked_to || 'Not linked'}</span>
                </div>
              </div>

              {domain.nameservers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-[#1e293b]">
                  <p className="text-xs text-slate-500 mb-2">Nameservers</p>
                  <div className="flex flex-wrap gap-2">
                    {domain.nameservers.map((ns, i) => (
                      <div key={i} className="flex items-center gap-1">
                        <code className="text-xs font-mono text-slate-400 bg-white/[0.04] px-2 py-1 rounded">{ns}</code>
                        <CopyButton text={ns} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 px-5 py-3 bg-white/[0.02] border-t border-[#1e293b]">
              <button className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors">
                DNS Records
              </button>
              <button className="text-xs font-medium text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors">
                Redirects
              </button>
              <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-3 py-1.5 rounded-md hover:bg-indigo-500/10 transition-colors">
                Manage
              </button>
              <div className="flex-1" />
              <button className="text-xs font-medium text-red-400 hover:text-red-300 px-3 py-1.5 rounded-md hover:bg-red-500/10 transition-colors">
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
