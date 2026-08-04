'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'api' | 'security'>('general');

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Settings" description="Global control panel settings, security, and credentials" />

      {/* Tabs */}
      <div className="flex border-b border-[#1e293b] gap-6">
        {[
          { id: 'general', label: 'General & Server Identity' },
          { id: 'notifications', label: 'Notifications' },
          { id: 'api', label: 'API & SSH Keys' },
          { id: 'security', label: 'Security & Auth' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* General Settings */}
      {activeTab === 'general' && (
        <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-200">Server Identity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Hostname</label>
              <input type="text" defaultValue="vps-prod-01" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Admin Email (Let's Encrypt)</label>
              <input type="email" defaultValue="admin@example.com" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200" />
            </div>
          </div>
          <div className="pt-4 border-t border-[#1e293b] flex justify-end">
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Save Changes</button>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-200">Notification Alerts</h3>
          <div className="space-y-3">
            {[
              { title: 'SSL Expiry Warnings', desc: 'Notify when certificates have less than 14 days remaining', checked: true },
              { title: 'Deployment Failure Alerts', desc: 'Send immediate alert when a build or deployment fails', checked: true },
              { title: 'High CPU / Memory Alerts', desc: 'Alert when system resources exceed 90% utilization for >5 mins', checked: true },
              { title: 'Database Backup Complete', desc: 'Daily notification upon completion of automated database backups', checked: false },
            ].map((n, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-[#1e293b]">
                <div>
                  <p className="text-sm font-medium text-slate-200">{n.title}</p>
                  <p className="text-xs text-slate-500">{n.desc}</p>
                </div>
                <input type="checkbox" defaultChecked={n.checked} className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-indigo-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* API & SSH */}
      {activeTab === 'api' && (
        <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-200">API Tokens</h3>
            <button className="px-3 py-1.5 text-xs font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">Generate Token</button>
          </div>
          <div className="p-3 bg-[#0a0a0f] border border-[#1e293b] rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-slate-300">lp_live_9f8a7b6c5d4e3f2a1b0c9d8e</p>
              <p className="text-xs text-slate-500">Created Aug 01, 2026 • Full Access</p>
            </div>
            <button className="text-xs text-red-400 hover:text-red-300">Revoke</button>
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-200">Authentication & Basic Auth</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Admin User</label>
              <input type="text" defaultValue="admin" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200" />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">New Password</label>
              <input type="password" placeholder="••••••••••••" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200" />
            </div>
          </div>
          <div className="pt-4 border-t border-[#1e293b] flex justify-end">
            <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Update Auth Credentials</button>
          </div>
        </div>
      )}
    </div>
  );
}
