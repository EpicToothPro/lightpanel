'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockWebsites } from '@/lib/mock-data';

export default function WebsitesPage() {
  const [search, setSearch] = useState('');

  const filtered = mockWebsites.filter(site =>
    site.name.toLowerCase().includes(search.toLowerCase()) || site.domain.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Websites" description="Manage your hosted websites and static sites">
        <Link href="/websites/new" className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Create Website
        </Link>
      </PageHeader>

      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" placeholder="Search websites..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full max-w-md pl-9 pr-4 py-2 text-sm bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(site => (
          <div key={site.id} className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5 hover:border-[#334155] transition-all group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-200">{site.name}</h3>
                <p className="text-xs font-mono text-slate-500 mt-0.5">{site.domain}</p>
              </div>
              <StatusBadge status={site.ssl_status === 'active' ? 'active' : site.ssl_status} />
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Runtime</span>
                <span className="text-slate-300">{site.runtime}{site.php_version ? ` ${site.php_version}` : ''}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Document Root</span>
                <span className="text-slate-400 font-mono text-[11px] truncate ml-4">{site.document_root}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Traffic Today</span>
                <span className="text-slate-300">{site.traffic_today.toLocaleString()} visits</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">SSL</span>
                <span className={site.ssl_enabled ? 'text-emerald-400' : 'text-slate-500'}>
                  {site.ssl_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-[#1e293b]">
              <Link href={`/files?root=${encodeURIComponent(site.document_root)}`}
                className="flex-1 text-center py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-md hover:bg-white/[0.04] transition-colors">
                Files
              </Link>
              <Link href={`/logs?source=${site.name}`}
                className="flex-1 text-center py-1.5 text-xs font-medium text-slate-400 hover:text-slate-200 rounded-md hover:bg-white/[0.04] transition-colors">
                Logs
              </Link>
              <Link href={`/websites/${site.id}`}
                className="flex-1 text-center py-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 rounded-md hover:bg-indigo-500/10 transition-colors">
                Settings
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
