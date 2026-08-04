'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockMailLogs } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';

export default function MailLogsPage() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = mockMailLogs.filter(l => {
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    const matchSearch = search === '' || l.sender.toLowerCase().includes(search.toLowerCase()) || l.recipient.toLowerCase().includes(search.toLowerCase()) || l.subject.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Mail Delivery Logs" description="Real-time SMTP transmission logs, delivery receipts, and bounce reports" />

      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Filter by sender, recipient, or subject..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 text-sm bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200"
        />
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 text-xs bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200"
        >
          <option value="all">All Delivery Statuses</option>
          <option value="delivered">Delivered</option>
          <option value="bounced">Bounced</option>
          <option value="rejected">Rejected</option>
          <option value="queued">Queued</option>
        </select>
      </div>

      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Timestamp</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Sender</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Recipient</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Subject</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Spam Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-slate-500">{formatDateTime(log.timestamp)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-indigo-400">{log.sender}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-slate-300">{log.recipient}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-slate-400 truncate max-w-xs block">{log.subject}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={log.status === 'delivered' ? 'success' : log.status === 'bounced' ? 'failed' : log.status === 'rejected' ? 'error' : 'pending'} />
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className={`text-xs font-mono font-bold ${log.spam_score > 5 ? 'text-red-400' : 'text-slate-400'}`}>
                      {log.spam_score.toFixed(1)}
                    </span>
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
