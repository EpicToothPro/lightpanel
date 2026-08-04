'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockDeployments } from '@/lib/mock-data';
import { formatRelativeTime, formatDuration } from '@/lib/utils';

export default function DeploymentsPage() {
  const [filter, setFilter] = useState('all');

  const filtered = mockDeployments.filter(d => filter === 'all' || d.status === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="Deployments" description="Track and manage your application deployments">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
          New Deployment
        </button>
      </PageHeader>

      <div className="flex gap-1.5 mb-4">
        {['all', 'success', 'failed', 'building', 'queued'].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
              filter === s ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' : 'text-slate-400 border-[#1e293b] hover:border-[#334155]'
            }`}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map(dep => (
          <div key={dep.id} className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5 hover:border-[#334155] transition-all">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  dep.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                  dep.status === 'failed' ? 'bg-red-500/10 text-red-400' :
                  'bg-blue-500/10 text-blue-400'
                }`}>
                  {dep.status === 'success' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  ) : dep.status === 'failed' ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" x2="6" y1="6" y2="18"/><line x1="6" x2="18" y1="6" y2="18"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/></svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-slate-200">{dep.app_name}</h3>
                    <StatusBadge status={dep.status} />
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{dep.commit_message}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                    <span className="font-mono">{dep.branch}@{dep.commit}</span>
                    <span>•</span>
                    <span>{formatDuration(dep.duration)}</span>
                    <span>•</span>
                    <span>{formatRelativeTime(dep.started_at)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="text-xs font-medium text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors">Logs</button>
                {dep.status === 'success' && (
                  <button className="text-xs font-medium text-amber-400 hover:text-amber-300 px-2.5 py-1.5 rounded-md hover:bg-amber-500/10 transition-colors">Rollback</button>
                )}
                <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-2.5 py-1.5 rounded-md hover:bg-indigo-500/10 transition-colors">Redeploy</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
