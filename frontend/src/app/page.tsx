'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockApplications, mockWebsites, mockDatabases, mockSSLCertificates } from '@/lib/mock-data';
import { fetchSystemStats, fetchApplications, fetchWebsites, fetchDatabases } from '@/lib/api';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    cpuUsagePct: 18.4,
    ramUsagePct: 42.1,
    diskUsagePct: 29.8,
    activeAppsCount: 6,
    activeWebsitesCount: 4,
    activeDatabasesCount: 5,
    validSslCount: 8,
  });
  const [apps, setApps] = useState(mockApplications);
  const [websites, setWebsites] = useState(mockWebsites);
  const [databases, setDatabases] = useState(mockDatabases);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsRes, appsRes, sitesRes, dbRes] = await Promise.all([
          fetchSystemStats(),
          fetchApplications(),
          fetchWebsites(),
          fetchDatabases(),
        ]);

        if (statsRes.success && statsRes.data) {
          setStats({
            cpuUsagePct: statsRes.data.cpu_usage ?? 18.4,
            ramUsagePct: statsRes.data.mem_percent ?? 42.1,
            diskUsagePct: statsRes.data.disk_percent ?? 29.8,
            activeAppsCount: appsRes.data?.length ?? 6,
            activeWebsitesCount: sitesRes.data?.length ?? 4,
            activeDatabasesCount: dbRes.data?.length ?? 5,
            validSslCount: 8,
          });
        }

        if (appsRes.success && Array.isArray(appsRes.data)) {
          setApps(appsRes.data);
        }
        if (sitesRes.success && Array.isArray(sitesRes.data)) {
          setWebsites(sitesRes.data);
        }
        if (dbRes.success && Array.isArray(dbRes.data)) {
          setDatabases(dbRes.data);
        }
      } catch (err) {
        // Fallback to initial state
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/40 via-[#12121a] to-cyan-950/40 border border-[#1e293b] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            VPS Infrastructure Overview
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400">
            Self-Hosted Server Management Node • Hostname: <span className="font-mono text-slate-300">vps-prod-01</span>
          </p>
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <Link
            href="/websites/new"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-lg shadow-indigo-500/20 flex items-center gap-2"
          >
            <span>+ Create Website</span>
          </Link>
          <Link
            href="/email/webmail"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white transition-colors shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            <span>✉ Open Webmail</span>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="CPU Core Load"
          value={`${stats.cpuUsagePct}%`}
          subtitle="8 vCPUs • 2.4 GHz"
          icon={<span className="text-lg">⚡</span>}
          color="indigo"
          trend={{ value: -2.1, label: 'vs last hour' }}
        />
        <StatCard
          title="Memory Usage"
          value={`${stats.ramUsagePct}%`}
          subtitle="6.7 GB / 16.0 GB Used"
          icon={<span className="text-lg">🧠</span>}
          color="cyan"
          trend={{ value: 1.4, label: 'vs last hour' }}
        />
        <StatCard
          title="NVMe Storage"
          value={`${stats.diskUsagePct}%`}
          subtitle="149 GB / 500 GB Used"
          icon={<span className="text-lg">💾</span>}
          color="emerald"
        />
        <StatCard
          title="Active Workloads"
          value={stats.activeAppsCount + stats.activeWebsitesCount}
          subtitle={`${stats.activeAppsCount} Apps • ${stats.activeWebsitesCount} Websites`}
          icon={<span className="text-lg">🚀</span>}
          color="purple"
        />
      </div>

      {/* Middle Grid: Applications & Databases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Applications List */}
        <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Active Applications
            </h2>
            <Link href="/applications" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
              View All ({apps.length}) →
            </Link>
          </div>
          <div className="space-y-2">
            {apps.slice(0, 4).map((app) => (
              <div key={app.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-[#1e293b] hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 text-xs font-mono font-bold">
                    {app.runtime.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200">{app.name}</h3>
                    <p className="text-[10px] text-slate-400 font-mono">{app.domain || 'Internal Port ' + app.port}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">{app.runtime} {app.version}</span>
                  <StatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Databases List */}
        <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-500" />
              Database Engines
            </h2>
            <Link href="/databases" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">
              Manage Databases ({databases.length}) →
            </Link>
          </div>
          <div className="space-y-2">
            {databases.slice(0, 4).map((db) => (
              <div key={db.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-[#1e293b] hover:border-slate-700 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold">
                    {db.type.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-slate-200 font-mono">{db.name}</h3>
                    <p className="text-[10px] text-slate-400">User: {db.username} • {db.storage_used_mb} MB</p>
                  </div>
                </div>
                <StatusBadge status={db.status} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
