'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { CopyButton } from '@/components/shared/copy-button';
import { mockEnvVariables, mockApplications } from '@/lib/mock-data';

export default function EnvVariablesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [targetApp, setTargetApp] = useState('api-gateway');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const filtered = mockEnvVariables.filter(env => targetApp === 'all' || env.target === targetApp);

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Environment Variables" description="Manage global and application-specific environment variables">
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Add Variable
        </button>
      </PageHeader>

      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-slate-400">Target App:</label>
        <select
          value={targetApp}
          onChange={e => setTargetApp(e.target.value)}
          className="px-3 py-1.5 text-sm bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
        >
          <option value="all">All Applications</option>
          {mockApplications.map(app => (
            <option key={app.id} value={app.name}>{app.name}</option>
          ))}
        </select>
      </div>

      {showAdd && (
        <div className="rounded-xl border border-indigo-500/20 bg-[#12121a] p-6">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Add Environment Variable</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">KEY</label>
              <input
                type="text"
                placeholder="DATABASE_URL"
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 uppercase"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">VALUE</label>
              <input
                type="password"
                placeholder="postgres://user:pass@localhost:5432/db"
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Scope Target</label>
              <select
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              >
                {mockApplications.map(app => (
                  <option key={app.id} value={app.name}>{app.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#1e293b]">
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
              Save Variable
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
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Key</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Value</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Target</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Type</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {filtered.map((env, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <code className="text-xs font-mono font-bold text-indigo-400">{env.key}</code>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-mono text-slate-300">
                        {env.type === 'secret' && !showSecrets[env.key] ? '••••••••••••••••' : env.value}
                      </code>
                      {env.type === 'secret' && (
                        <button onClick={() => toggleSecret(env.key)} className="text-slate-500 hover:text-slate-300">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        </button>
                      )}
                      <CopyButton text={env.value} />
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded border border-[#1e293b]">{env.target}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-xs px-2 py-0.5 rounded ${env.type === 'secret' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-500/10 text-slate-400'}`}>
                      {env.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-xs font-medium text-red-400 hover:text-red-300 px-2 py-1 rounded hover:bg-red-500/10 transition-colors">Delete</button>
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
