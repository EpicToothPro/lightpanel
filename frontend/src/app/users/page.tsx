'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { formatDate } from '@/lib/utils';

interface SystemUser {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator' | 'read-only';
  status: 'active' | 'disabled';
  lastLogin: string;
  sshKeys: number;
}

const mockUsers: SystemUser[] = [
  { id: 'usr-1', username: 'admin', email: 'admin@lightpanel.dev', role: 'admin', status: 'active', lastLogin: '2026-08-04T11:22:04Z', sshKeys: 2 },
  { id: 'usr-2', username: 'deployer', email: 'ci-cd@lightpanel.dev', role: 'operator', status: 'active', lastLogin: '2026-08-03T14:22:00Z', sshKeys: 1 },
  { id: 'usr-3', username: 'auditor', email: 'audit@lightpanel.dev', role: 'read-only', status: 'disabled', lastLogin: '2026-07-20T08:00:00Z', sshKeys: 0 },
];

export default function UsersPage() {
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Users & Access" description="Manage server administrative access, roles, and SSH keys">
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Add User
        </button>
      </PageHeader>

      {showAdd && (
        <div className="rounded-xl border border-indigo-500/20 bg-[#12121a] p-6">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Create Access Account</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Username</label>
              <input type="text" placeholder="johndoe" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email</label>
              <input type="email" placeholder="john@example.com" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Role</label>
              <select className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200">
                <option value="admin">Administrator</option>
                <option value="operator">Operator</option>
                <option value="read-only">Read Only</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#1e293b]">
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Create User</button>
            <button onClick={() => setShowAdd(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 border border-[#1e293b] rounded-lg transition-colors">Cancel</button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">User</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Role</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">SSH Keys</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Last Login</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {mockUsers.map(u => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white uppercase">
                        {u.username.charAt(0)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-slate-200">{u.username}</span>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20 capitalize">{u.role}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={u.status} /></td>
                  <td className="px-5 py-4 hidden md:table-cell"><span className="text-xs text-slate-400">{u.sshKeys} keys</span></td>
                  <td className="px-5 py-4 hidden lg:table-cell"><span className="text-xs text-slate-500">{formatDate(u.lastLogin)}</span></td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded hover:bg-indigo-500/10 transition-colors">Edit</button>
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
