'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { CopyButton } from '@/components/shared/copy-button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { mockDatabases } from '@/lib/mock-data';
import { formatDate, getDatabaseIcon } from '@/lib/utils';

export default function DatabasesPage() {
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});

  const togglePassword = (id: string) => {
    setShowPasswords(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Databases" description="Manage your database instances and credentials">
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Create Database
        </button>
      </PageHeader>

      {/* Create Database Wizard */}
      {showCreate && (
        <div className="rounded-xl border border-indigo-500/20 bg-[#12121a] p-6">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Create New Database</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Database Type</label>
              <select className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                <option value="postgresql">PostgreSQL</option>
                <option value="mariadb">MariaDB / MySQL</option>
                <option value="mongodb">MongoDB</option>
                <option value="redis">Redis</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Database Name</label>
              <input type="text" placeholder="my_database"
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Username</label>
              <input type="text" placeholder="db_user"
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Password</label>
              <div className="flex gap-2">
                <input type="password" placeholder="••••••••"
                  className="flex-1 px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                <button className="px-3 py-2 text-xs font-medium text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 transition-colors">
                  Generate
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Port</label>
              <input type="text" placeholder="5432"
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Storage Limit</label>
              <select className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50">
                <option>1 GB</option>
                <option>2 GB</option>
                <option>5 GB</option>
                <option>10 GB</option>
                <option>Unlimited</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#1e293b]">
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Create Database</button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 border border-[#1e293b] rounded-lg hover:border-[#334155] transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Database Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {mockDatabases.map(db => (
          <div key={db.id} className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden hover:border-[#334155] transition-all">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getDatabaseIcon(db.type)}</span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-200">{db.name}</h3>
                    <p className="text-xs text-slate-500">{db.type} {db.version}</p>
                  </div>
                </div>
                <StatusBadge status={db.status} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Host</p>
                  <div className="flex items-center gap-1">
                    <code className="text-xs font-mono text-slate-300">{db.host}</code>
                    <CopyButton text={db.host} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Port</p>
                  <div className="flex items-center gap-1">
                    <code className="text-xs font-mono text-slate-300">{db.port}</code>
                    <CopyButton text={db.port.toString()} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Username</p>
                  <div className="flex items-center gap-1">
                    <code className="text-xs font-mono text-slate-300">{db.username}</code>
                    <CopyButton text={db.username} />
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">Password</p>
                  <div className="flex items-center gap-1">
                    <code className="text-xs font-mono text-slate-400">{showPasswords[db.id] ? 'p@ssw0rd_secure!' : '••••••••••••'}</code>
                    <button onClick={() => togglePassword(db.id)} className="p-1 rounded text-slate-500 hover:text-slate-300 transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Storage Usage */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-500">Storage</span>
                  <span className="text-slate-400">{db.storage_used_mb} MB / {db.storage_limit_mb} MB</span>
                </div>
                <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${(db.storage_used_mb / db.storage_limit_mb) * 100}%` }} />
                </div>
              </div>

              {db.linked_apps.length > 0 && (
                <div className="mt-3 pt-3 border-t border-[#1e293b]">
                  <p className="text-xs text-slate-500 mb-1">Linked Applications</p>
                  <div className="flex flex-wrap gap-1.5">
                    {db.linked_apps.map(app => (
                      <span key={app} className="text-xs text-slate-400 bg-white/[0.04] px-2 py-0.5 rounded">{app}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 px-4 py-2.5 bg-white/[0.02] border-t border-[#1e293b]">
              <button className="text-xs font-medium text-emerald-400 hover:text-emerald-300 px-2.5 py-1.5 rounded-md hover:bg-emerald-500/10 transition-colors">
                {db.status === 'running' ? 'Stop' : 'Start'}
              </button>
              <button className="text-xs font-medium text-blue-400 hover:text-blue-300 px-2.5 py-1.5 rounded-md hover:bg-blue-500/10 transition-colors">Restart</button>
              <button className="text-xs font-medium text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors">Logs</button>
              <button className="text-xs font-medium text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-md hover:bg-white/[0.04] transition-colors">Backup</button>
              <div className="flex-1" />
              <button onClick={() => setDeleteTarget(db.id)} className="text-xs font-medium text-red-400 hover:text-red-300 px-2.5 py-1.5 rounded-md hover:bg-red-500/10 transition-colors">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => setDeleteTarget(null)}
        title="Delete Database"
        description="This will permanently delete this database and all its data. This action cannot be undone. Make sure you have a backup before proceeding."
        confirmText="Delete Database"
        variant="danger"
      />
    </div>
  );
}
