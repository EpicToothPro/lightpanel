'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockQueueItems } from '@/lib/mock-data';
import { formatBytes, formatDateTime } from '@/lib/utils';

export default function MailQueuePage() {
  const [queue, setQueue] = useState(mockQueueItems);

  const flushQueue = () => {
    // Simulate flushing queue
    setQueue(prev => prev.map(q => ({ ...q, status: 'active', delay_reason: undefined })));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Mail Queue (Postfix Queue)" description="Monitor active, deferred, and held messages waiting for transmission">
        <div className="flex items-center gap-2">
          <button onClick={flushQueue} className="px-3 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
            Flush Queue Now
          </button>
          <button onClick={clearQueue} className="px-3 py-2 text-xs font-medium text-red-400 border border-red-500/20 rounded-lg hover:bg-red-500/10 transition-colors">
            Purge Queue
          </button>
        </div>
      </PageHeader>

      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Queue ID</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Sender</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Recipient</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Size</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Arrived</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {queue.map(q => (
                <tr key={q.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <code className="text-xs font-mono font-bold text-indigo-400">{q.queue_id}</code>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-mono text-slate-300">{q.sender}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div>
                      <span className="text-xs font-mono text-slate-300">{q.recipient}</span>
                      {q.delay_reason && (
                        <p className="text-[11px] text-amber-400 mt-1 max-w-xs">{q.delay_reason}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-slate-400">{formatBytes(q.size_bytes)}</span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={q.status === 'active' ? 'running' : 'pending'} />
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{formatDateTime(q.arrived_at)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {queue.length === 0 && (
          <div className="py-12 text-center text-xs text-slate-500">
            Mail queue is empty. All messages delivered.
          </div>
        )}
      </div>
    </div>
  );
}
