'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { mockDomains } from '@/lib/mock-data';

function EyeIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"/><circle cx="12" cy="12" r="3"/></svg>;
}

function UserIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
}

function ClockIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}

function TrendIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>;
}

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
            <StatCard title="Total Pageviews" value="12,450" icon={<EyeIcon />} color="indigo" trend={{ value: 14.2, label: 'vs last month' }} />
            <StatCard title="Unique Visitors" value="3,200" icon={<UserIcon />} color="cyan" trend={{ value: 8.7, label: 'vs last month' }} />
            <StatCard title="Avg. Visit Duration" value="2m 22s" icon={<ClockIcon />} color="emerald" />
            <StatCard title="Bounce Rate" value="32.4%" icon={<TrendIcon />} color="purple" />
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
