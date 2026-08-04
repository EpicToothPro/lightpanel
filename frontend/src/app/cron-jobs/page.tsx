'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { mockCronJobs } from '@/lib/mock-data';
import { formatDateTime } from '@/lib/utils';

export default function CronJobsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', command: '', schedule: '0 0 * * *' });

  return (
    <div className="space-[#1e293b] space-y-6">
      <PageHeader title="Cron Jobs" description="Schedule recurring tasks and system commands">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Add Cron Job
        </button>
      </PageHeader>

      {showAdd && (
        <div className="rounded-xl border border-indigo-500/20 bg-[#12121a] p-6">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Create New Cron Job</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Job Name</label>
              <input
                type="text"
                placeholder="Database Backup"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Schedule (Cron Syntax)</label>
              <input
                type="text"
                placeholder="0 2 * * *"
                value={form.schedule}
                onChange={e => setForm({ ...form, schedule: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Command</label>
              <input
                type="text"
                placeholder="/opt/lightpanel/scripts/backup-db.sh"
                value={form.command}
                onChange={e => setForm({ ...form, command: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#1e293b]">
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              Save Cron Job
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 border border-[#1e293b] rounded-lg hover:border-[#334155] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Name</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 font-mono">Schedule</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Command</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Last Run</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Next Run</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {mockCronJobs.map(job => (
                <tr key={job.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm font-medium text-slate-200">{job.name}</span>
                  </td>
                  <td className="px-5 py-4">
                    <code className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{job.schedule}</code>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <code className="text-xs font-mono text-slate-400 truncate max-w-xs block">{job.command}</code>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{job.last_run ? formatDateTime(job.last_run) : 'Never'}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{job.next_run ? formatDateTime(job.next_run) : '—'}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-500/10 transition-colors">Run Now</button>
                      <button onClick={() => setDeleteTarget(job.id)} className="text-xs font-medium text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => setDeleteTarget(null)}
        title="Delete Cron Job"
        description="Are you sure you want to delete this cron job? Scheduled tasks will stop running immediately."
        confirmText="Delete Job"
        variant="danger"
      />
    </div>
  );
}
