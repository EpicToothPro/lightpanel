'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { mockActivity } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';

export default function AuditLogPage() {
  const [filter, setFilter] = useState('all');

  const filtered = mockActivity.filter(a => filter === 'all' || a.type === filter);

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Log" description="Security and administrative action history across the server" />

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {['all', 'deployment', 'ssl', 'backup', 'site', 'database', 'error'].map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors capitalize ${
              filter === t ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30' : 'text-slate-400 border-[#1e293b] hover:border-[#334155]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Timestamp</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Action</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Details</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-slate-500">{formatDateTime(item.timestamp)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-200">{item.title}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-slate-400">{item.description}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{item.user}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
