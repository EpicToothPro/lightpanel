'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';

export default function ServerSettingsPage() {
  const [profile, setProfile] = useState('medium');

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Server Settings" description="Configure core server settings, Nginx profile, and system workers" />

      {/* Performance Profile Tuning */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-200">Performance Profile Tuning</h3>
        <p className="text-xs text-slate-400">
          LightPanel automatically profiles Nginx workers, PHP-FPM processes, and background polling intervals based on system RAM.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {[
            { id: 'low', label: 'Low Memory (< 1GB)', workers: '1 Worker', php: 'ondemand (max 5)', poll: '30s Polling' },
            { id: 'medium', label: 'Medium (1 - 4GB)', workers: '2 Workers', php: 'dynamic (max 10)', poll: '10s Polling' },
            { id: 'high', label: 'High Performance (> 4GB)', workers: 'Auto Workers', php: 'dynamic (max 30)', poll: '5s Polling' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setProfile(p.id)}
              className={`p-4 rounded-xl border text-left transition-all ${
                profile === p.id
                  ? 'border-indigo-500 bg-indigo-500/10 text-slate-200'
                  : 'border-[#1e293b] bg-[#0a0a0f] text-slate-400 hover:border-[#334155]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">{p.label}</span>
                {profile === p.id && <span className="w-2 h-2 rounded-full bg-indigo-400" />}
              </div>
              <div className="space-y-1 text-xs text-slate-500">
                <p>Nginx: {p.workers}</p>
                <p>PHP-FPM: {p.php}</p>
                <p>Metrics: {p.poll}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Path Configurations */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4">
        <h3 className="text-base font-semibold text-slate-200">System Directories & Ports</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Listen Address</label>
            <input type="text" defaultValue=":8443" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-mono" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Web Root Directory</label>
            <input type="text" defaultValue="/var/www" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-mono" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Nginx Sites Available</label>
            <input type="text" defaultValue="/etc/nginx/sites-available" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-mono" />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">Nginx Sites Enabled</label>
            <input type="text" defaultValue="/etc/nginx/sites-enabled" className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-mono" />
          </div>
        </div>

        <div className="pt-4 border-t border-[#1e293b] flex justify-end">
          <button className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
            Save Server Settings
          </button>
        </div>
      </div>
    </div>
  );
}
