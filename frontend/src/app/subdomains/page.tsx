'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { mockSubdomains, mockDomains } from '@/lib/mock-data';

export default function SubdomainsPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', parent: mockDomains[0]?.name || '', target: '', port: '', ssl: true });

  return (
    <div className="space-y-6">
      <PageHeader title="Subdomains" description="Create and manage subdomains for your domains">
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Add Subdomain
        </button>
      </PageHeader>

      {/* Add Subdomain Form */}
      {showAdd && (
        <div className="rounded-xl border border-indigo-500/20 bg-[#12121a] p-6">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Create Subdomain</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Subdomain Name</label>
              <input type="text" placeholder="api" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
              {form.name && form.parent && (
                <p className="text-xs text-slate-500 mt-1">Will create: <span className="font-mono text-indigo-400">{form.name}.{form.parent}</span></p>
              )}
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Parent Domain</label>
              <select value={form.parent} onChange={e => setForm({...form, parent: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                {mockDomains.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Target Application/Website</label>
              <input type="text" placeholder="my-app" value={form.target} onChange={e => setForm({...form, target: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Port (optional)</label>
              <input type="text" placeholder="3000" value={form.port} onChange={e => setForm({...form, port: e.target.value})}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
          </div>
          <div className="flex items-center gap-3 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.ssl} onChange={e => setForm({...form, ssl: e.target.checked})}
                className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-indigo-500 focus:ring-indigo-500/50" />
              <span className="text-sm text-slate-300">Enable automatic SSL</span>
            </label>
          </div>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#1e293b]">
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              Create Subdomain
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 border border-[#1e293b] rounded-lg hover:border-[#334155] transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Subdomains Table */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Subdomain</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Target</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Port</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">SSL</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {mockSubdomains.map(sub => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-5 py-4">
                    <div>
                      <span className="text-sm font-mono font-medium text-slate-200">{sub.full_domain}</span>
                      <p className="text-xs text-slate-500 mt-0.5">{sub.target_type}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-sm text-slate-400">{sub.target}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-sm font-mono text-slate-400">{sub.port || '—'}</span>
                  </td>
                  <td className="px-5 py-4">
                    {sub.ssl_enabled ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        Active
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500">Disabled</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 rounded-md text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors" title="Edit">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                      </button>
                      <button onClick={() => setDeleteTarget(sub.id)} className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
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
        title="Delete Subdomain"
        description="Are you sure you want to delete this subdomain? This action cannot be undone and will remove all associated DNS records."
        confirmText="Delete"
        variant="danger"
      />
    </div>
  );
}
