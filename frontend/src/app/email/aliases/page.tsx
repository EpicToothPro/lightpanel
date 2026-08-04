'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { mockEmailAliases, mockEmailDomains } from '@/lib/mock-data';

export default function EmailAliasesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [aliasType, setAliasType] = useState<'alias' | 'forwarder' | 'catch-all' | 'group' | 'shared'>('alias');

  return (
    <div className="space-y-6">
      <PageHeader title="Aliases, Forwarders & Routing" description="Configure email forwarding, catch-all addresses, group distribution lists, and shared mailboxes">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Add Alias / Forwarder
        </button>
      </PageHeader>

      {showAdd && (
        <div className="rounded-xl border border-indigo-500/20 bg-[#12121a] p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-200">Create Email Alias or Routing Rule</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Rule Type</label>
              <select
                value={aliasType}
                onChange={e => setAliasType(e.target.value as any)}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
              >
                <option value="alias">Standard Alias</option>
                <option value="forwarder">Forwarder</option>
                <option value="group">Group Distribution List</option>
                <option value="catch-all">Catch-All Inbox</option>
                <option value="shared">Shared Mailbox</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Incoming Address / Alias</label>
              <input type="text" placeholder="sales@lightpanel.dev" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Target Recipient(s)</label>
              <input type="text" placeholder="user1@domain.com, user2@domain.com" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-[#1e293b]">
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              Save Routing Rule
            </button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-slate-400 border border-[#1e293b] rounded-lg hover:border-[#334155]">
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
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Incoming Address</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Type</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Forwards To</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Domain</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {mockEmailAliases.map(a => (
                <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <code className="text-sm font-mono font-bold text-indigo-400">{a.alias_email}</code>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 capitalize font-medium">
                      {a.type}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1">
                      {a.target_emails.map((t, idx) => (
                        <code key={idx} className="text-xs font-mono text-slate-300 bg-white/[0.04] px-2 py-0.5 rounded border border-[#1e293b]">
                          {t}
                        </code>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-xs text-slate-500 font-mono">{a.domain}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10">Delete</button>
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
