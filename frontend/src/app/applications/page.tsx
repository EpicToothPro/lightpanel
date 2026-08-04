'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockApplications } from '@/lib/mock-data';
import { getRuntimeColor, formatRelativeTime } from '@/lib/utils';

export default function ApplicationsPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockApplications.filter(app => {
    const matchSearch = app.name.toLowerCase().includes(search.toLowerCase()) || app.domain.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Applications" description="Manage your deployed applications and services">
        <Link
          href="/applications/new"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Deploy Application
        </Link>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input
            type="text"
            placeholder="Search applications..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
          />
        </div>
        <div className="flex gap-1.5">
          {['all', 'running', 'stopped', 'error'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                statusFilter === s
                  ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                  : 'text-slate-400 border-[#1e293b] hover:border-[#334155] hover:text-slate-300'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Application</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Runtime</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Domain</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden xl:table-cell">Resources</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Last Deploy</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {filtered.map(app => (
                <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: getRuntimeColor(app.runtime) + '20', color: getRuntimeColor(app.runtime) }}
                      >
                        {app.runtime.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <Link href={`/applications/${app.id}`} className="text-sm font-medium text-slate-200 hover:text-indigo-400 transition-colors">
                          {app.name}
                        </Link>
                        <p className="text-xs text-slate-500">Port {app.port}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-slate-400">{app.runtime}</span>
                    <span className="text-xs text-slate-600 ml-1">{app.version}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm font-mono text-slate-400">{app.domain}</span>
                  </td>
                  <td className="px-5 py-4 hidden xl:table-cell">
                    <div className="text-xs text-slate-400">
                      <span>{app.cpu_usage}% CPU</span>
                      <span className="text-slate-600 mx-1">•</span>
                      <span>{app.memory_usage}/{app.memory_limit} MB</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{formatRelativeTime(app.last_deployment)}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 rounded-md text-slate-500 hover:text-emerald-400 hover:bg-emerald-400/10 transition-colors" title="Start/Stop">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="6 3 20 12 6 21 6 3"/></svg>
                      </button>
                      <button className="p-1.5 rounded-md text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors" title="Restart">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
                      </button>
                      <Link href={`/applications/${app.id}`} className="p-1.5 rounded-md text-slate-500 hover:text-indigo-400 hover:bg-indigo-400/10 transition-colors" title="View">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-sm text-slate-500">No applications found</p>
          </div>
        )}
      </div>
    </div>
  );
}
