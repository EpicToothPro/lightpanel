'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { mockBackups } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';

export default function BackupsPage() {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const typeIcons: Record<string, string> = {
    database: '🗄️', website: '🌐', application: '📦', full: '💾',
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Backups" description="Manage backups for your websites, databases, and applications">
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Create Backup
        </button>
      </PageHeader>

      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Backup</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Type</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Size</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Created</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden xl:table-cell">Retention</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {mockBackups.map(backup => (
                <tr key={backup.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{typeIcons[backup.type] || '📦'}</span>
                      <div>
                        <span className="text-sm font-medium text-slate-200">{backup.name}</span>
                        <p className="text-xs text-slate-500">{backup.target_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-slate-400 capitalize">{backup.type}</span>
                    {backup.scheduled && <span className="ml-1.5 text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded">Scheduled</span>}
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={backup.status} /></td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm text-slate-400">{backup.size_mb > 0 ? `${backup.size_mb} MB` : '—'}</span>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-xs text-slate-500">{formatDateTime(backup.created_at)}</span>
                  </td>
                  <td className="px-5 py-4 hidden xl:table-cell">
                    <span className="text-xs text-slate-500">{backup.retention_days}d</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 px-2 py-1 rounded-md hover:bg-emerald-500/10 transition-colors">Restore</button>
                      <button className="text-xs font-medium text-slate-400 hover:text-slate-200 px-2 py-1 rounded-md hover:bg-white/[0.04] transition-colors">Download</button>
                      <button onClick={() => setDeleteTarget(backup.id)} className="text-xs font-medium text-red-400 hover:text-red-300 px-2 py-1 rounded-md hover:bg-red-500/10 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => setDeleteTarget(null)}
        title="Delete Backup" description="This will permanently delete this backup. This action cannot be undone." confirmText="Delete" variant="danger" />
    </div>
  );
}
