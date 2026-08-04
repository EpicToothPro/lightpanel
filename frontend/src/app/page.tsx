'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { StatCard } from '@/components/shared/stat-card';
import { StatusBadge } from '@/components/shared/status-badge';
import { fetchSystemStats, fetchApplications, fetchWebsites, fetchDatabases } from '@/lib/api';
import type { Application, Website, DatabaseExtended } from '@/types';

// Clean SVG Icons for Dashboard Metrics
function CpuIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>;
}

function RamIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-cyan-400"><path d="M6 19v-3"/><path d="M10 19v-3"/><path d="M14 19v-3"/><path d="M18 19v-3"/><rect width="20" height="8" x="2" y="8" rx="2"/><path d="M2 5h20"/></svg>;
}

function DiskIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><line x1="22" x2="2" y1="12" y2="12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/><line x1="6" x2="6.01" y1="16" y2="16"/><line x1="10" x2="10.01" y1="16" y2="16"/></svg>;
}

function LayersIcon() {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L3.18 12.5"/><path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L3.18 17.5"/></svg>;
}

export default function DashboardPage() {
  const [systemInfo, setSystemInfo] = useState({
    cpuPercent: 0,
    cpuCores: 1,
    memUsedMb: 0,
    memTotalMb: 0,
    memPercent: 0,
    diskUsedGb: 0,
    diskTotalGb: 0,
    diskPercent: 0,
    uptime: '--',
    hostname: 'lightpanel-node',
  });
  const [apps, setApps] = useState<Application[]>([]);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [databases, setDatabases] = useState<DatabaseExtended[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLiveData() {
      try {
        const [statsRes, appsRes, sitesRes, dbRes] = await Promise.all([
          fetchSystemStats(),
          fetchApplications(),
          fetchWebsites(),
          fetchDatabases(),
        ]);

        if (statsRes.success && statsRes.data) {
          const s = statsRes.data as any;
          setSystemInfo({
            cpuPercent: s.cpu_usage ?? 0,
            cpuCores: s.cpu_cores ?? 1,
            memUsedMb: s.mem_used_mb ?? 0,
            memTotalMb: s.mem_total_mb ?? 0,
            memPercent: s.mem_percent ?? 0,
            diskUsedGb: s.disk_used_gb ?? 0,
            diskTotalGb: s.disk_total_gb ?? 0,
            diskPercent: s.disk_percent ?? 0,
            uptime: s.uptime ?? '--',
            hostname: s.hostname ?? 'lightpanel-node',
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
        // Handled cleanly
      } finally {
        setLoading(false);
      }
    }
    loadLiveData();
  }, []);

  const ramUsedGb = (systemInfo.memUsedMb / 1024).toFixed(1);
  const ramTotalGb = (systemInfo.memTotalMb / 1024).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-indigo-950/40 via-[#12121a] to-cyan-950/40 border border-[#1e293b] rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            Infrastructure Overview
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
          </h1>
          <p className="text-xs text-slate-400">
            Node: <span className="font-mono text-slate-300">{systemInfo.hostname}</span> • Uptime: <span className="font-mono text-slate-300">{systemInfo.uptime}</span>
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
            <span>Open Webmail</span>
          </Link>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="CPU Load"
          value={`${systemInfo.cpuPercent}%`}
          subtitle={`${systemInfo.cpuCores} vCPU Core(s)`}
          icon={<CpuIcon />}
          color="indigo"
        />
        <StatCard
          title="Memory Usage"
          value={`${systemInfo.memPercent}%`}
          subtitle={`${ramUsedGb} GB / ${ramTotalGb} GB Used`}
          icon={<RamIcon />}
          color="cyan"
        />
        <StatCard
          title="Storage Usage"
          value={`${systemInfo.diskPercent}%`}
          subtitle={`${systemInfo.diskUsedGb} GB / ${systemInfo.diskTotalGb} GB Used`}
          icon={<DiskIcon />}
          color="emerald"
        />
        <StatCard
          title="Active Workloads"
          value={apps.length + websites.length}
          subtitle={`${apps.length} Applications • ${websites.length} Websites`}
          icon={<LayersIcon />}
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
            {apps.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No applications deployed yet.</p>
            ) : (
              apps.slice(0, 4).map((app) => (
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
              ))
            )}
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
            {databases.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No databases provisioned yet.</p>
            ) : (
              databases.slice(0, 4).map((db) => (
                <div key={db.id} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-[#1e293b] hover:border-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-xs font-mono font-bold">
                      {db.type.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-200 font-mono">{db.name}</h3>
                      <p className="text-[10px] text-slate-400">Host: {db.host || 'localhost'} • {db.storage_used_mb || 0} MB</p>
                    </div>
                  </div>
                  <StatusBadge status={db.status} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
