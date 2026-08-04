'use client';

import React, { useState, useMemo } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatCard } from '@/components/shared/stat-card';
import { mockStats, generateTimeSeriesData } from '@/lib/mock-data';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d';

const rangeHours: Record<TimeRange, number> = {
  '1h': 1, '6h': 6, '24h': 24, '7d': 168, '30d': 720,
};

function ChartCard({ title, data, color, unit, yDomain }: {
  title: string; data: { timestamp: string; value: number }[]; color: string; unit: string; yDomain?: [number, number];
}) {
  const chartData = data.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    value: d.value,
  }));

  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
        <span className="text-xs text-slate-500">{unit}</span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} domain={yDomain || ['auto', 'auto']} width={35} />
            <Tooltip
              contentStyle={{ background: '#12121a', border: '1px solid #1e293b', borderRadius: '8px', fontSize: '12px', color: '#f1f5f9' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Area type="monotone" dataKey="value" stroke={color} fill={`url(#gradient-${title})`} strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default function MonitoringPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('24h');

  const hours = rangeHours[timeRange];
  const cpuData = useMemo(() => generateTimeSeriesData(hours, mockStats.cpu_usage, 15), [hours]);
  const memData = useMemo(() => generateTimeSeriesData(hours, mockStats.mem_percent, 10), [hours]);
  const diskData = useMemo(() => generateTimeSeriesData(hours, mockStats.disk_percent, 3), [hours]);
  const networkData = useMemo(() => generateTimeSeriesData(hours, 35, 25), [hours]);
  const loadData = useMemo(() => generateTimeSeriesData(hours, 0.5, 0.3), [hours]);
  const responseData = useMemo(() => generateTimeSeriesData(hours, 45, 30), [hours]);

  const CpuIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>;
  const MemIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 19v-3"/><path d="M10 19v-3"/><path d="M14 19v-3"/><path d="M18 19v-3"/><path d="M8 11V9"/><path d="M16 11V9"/><path d="M12 11V9"/><path d="M2 15h20"/><path d="M2 7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v1.1a2 2 0 0 0 0 3.837V17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-5.1a2 2 0 0 0 0-3.837Z"/></svg>;
  const DiskIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>;
  const NetIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/></svg>;

  return (
    <div className="space-y-6">
      <PageHeader title="Monitoring" description="Real-time server performance metrics">
        <div className="flex gap-1 bg-[#12121a] border border-[#1e293b] rounded-lg p-0.5">
          {(['1h', '6h', '24h', '7d', '30d'] as TimeRange[]).map(range => (
            <button key={range} onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                timeRange === range ? 'bg-indigo-500/20 text-indigo-400' : 'text-slate-500 hover:text-slate-300'
              }`}>
              {range}
            </button>
          ))}
        </div>
      </PageHeader>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="CPU Usage" value={`${mockStats.cpu_usage.toFixed(1)}%`} icon={<CpuIcon />} color="indigo" progress={mockStats.cpu_usage} />
        <StatCard title="Memory" value={`${mockStats.mem_percent.toFixed(1)}%`} icon={<MemIcon />} color="cyan" progress={mockStats.mem_percent} subtitle={`${mockStats.mem_used_mb}/${mockStats.mem_total_mb} MB`} />
        <StatCard title="Disk" value={`${mockStats.disk_percent.toFixed(1)}%`} icon={<DiskIcon />} color="emerald" progress={mockStats.disk_percent} subtitle={`${mockStats.disk_free_gb} GB free`} />
        <StatCard title="Load Avg" value={mockStats.load_avg.split(' ')[0]} icon={<NetIcon />} color="purple" subtitle={mockStats.load_avg} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="CPU Usage" data={cpuData} color="#6366f1" unit="%" yDomain={[0, 100]} />
        <ChartCard title="Memory Usage" data={memData} color="#06b6d4" unit="%" yDomain={[0, 100]} />
        <ChartCard title="Network Traffic" data={networkData} color="#10b981" unit="Mbps" />
        <ChartCard title="Response Time" data={responseData} color="#f59e0b" unit="ms" />
        <ChartCard title="Disk Usage" data={diskData} color="#8b5cf6" unit="%" yDomain={[0, 100]} />
        <ChartCard title="Load Average" data={loadData} color="#ec4899" unit="" />
      </div>
    </div>
  );
}
