'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { mockWebsites, mockDomains } from '@/lib/mock-data';

export default function AnalyticsPage() {
  const [globalEnabled, setGlobalEnabled] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState(mockDomains[0]?.name || 'lightpanel.dev');

  return (
    <div className="space-y-6">
      <PageHeader title="Traffic & App Analytics" description="Privacy-conscious, lightweight web analytics for your hosted sites and applications">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer bg-[#12121a] border border-[#1e293b] px-3 py-1.5 rounded-lg">
            <input
              type="checkbox"
              checked={globalEnabled}
              onChange={e => setGlobalEnabled(e.target.checked)}
              className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-indigo-500"
            />
            <span className="text-xs font-semibold text-slate-300">Analytics Enabled</span>
          </label>
        </div>
      </PageHeader>

      {/* Domain Switcher */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-slate-400">Selected Property:</label>
        <select
          value={selectedDomain}
          onChange={e => setSelectedDomain(e.target.value)}
          className="px-3 py-1.5 text-sm bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200"
        >
          {mockDomains.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      {!globalEnabled ? (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-8 text-center space-y-2">
          <h3 className="text-base font-bold text-amber-400">Analytics Disabled Globally</h3>
          <p className="text-xs text-slate-400">No pageviews or visitor tracking data is being collected.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Pageviews (30d)" value="12,450" icon={<span className="text-lg">👁️</span>} color="indigo" trend={{ value: 14.2, label: 'vs last month' }} />
            <StatCard title="Unique Visitors" value="3,200" icon={<span className="text-lg">👤</span>} color="cyan" trend={{ value: 8.7, label: 'vs last month' }} />
            <StatCard title="Avg. Visit Duration" value="2m 22s" icon={<span className="text-lg">⏱️</span>} color="emerald" />
            <StatCard title="Bounce Rate" value="32.4%" icon={<span className="text-lg">📉</span>} color="purple" />
          </div>

          {/* Breakdown Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Pages */}
            <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200">Top Pages</h3>
              <div className="space-y-2 text-xs">
                {[
                  { path: '/', views: '5,400 (43%)' },
                  { path: '/docs', views: '2,300 (18%)' },
                  { path: '/blog/release-v2.4', views: '1,800 (14%)' },
                  { path: '/pricing', views: '1,200 (9%)' },
                ].map(p => (
                  <div key={p.path} className="flex items-center justify-between p-2 rounded bg-[#0a0a0f] border border-[#1e293b]">
                    <span className="font-mono text-indigo-400">{p.path}</span>
                    <span className="text-slate-300 font-bold">{p.views}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Referrers */}
            <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200">Top Traffic Referrers</h3>
              <div className="space-y-2 text-xs">
                {[
                  { ref: 'google.com', count: '4,200 (34%)' },
                  { ref: 'github.com', count: '2,800 (22%)' },
                  { ref: 'Direct / None', count: '1,900 (15%)' },
                  { ref: 'twitter.com', count: '950 (7%)' },
                ].map(r => (
                  <div key={r.ref} className="flex items-center justify-between p-2 rounded bg-[#0a0a0f] border border-[#1e293b]">
                    <span className="text-slate-300 font-medium">{r.ref}</span>
                    <span className="text-slate-400 font-mono">{r.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Device & Country */}
            <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200">Device Breakdown</h3>
              <div className="space-y-2 text-xs">
                {[
                  { device: 'Desktop', pct: '68%' },
                  { device: 'Mobile', pct: '27%' },
                  { device: 'Tablet', pct: '5%' },
                ].map(d => (
                  <div key={d.device} className="flex items-center justify-between p-2 rounded bg-[#0a0a0f] border border-[#1e293b]">
                    <span className="text-slate-300">{d.device}</span>
                    <span className="text-emerald-400 font-bold">{d.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
