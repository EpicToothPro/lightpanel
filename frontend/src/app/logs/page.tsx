'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { CopyButton } from '@/components/shared/copy-button';
import { mockLogs } from '@/lib/mock-data';
import { LogLevel } from '@/types';

export default function LogsPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [isLive, setIsLive] = useState(true);

  const filteredLogs = logs.filter(log => {
    const matchLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchSource = sourceFilter === 'all' || log.source === sourceFilter;
    const matchSearch = search === '' || log.message.toLowerCase().includes(search.toLowerCase()) || log.source.toLowerCase().includes(search.toLowerCase());
    return matchLevel && matchSource && matchSearch;
  });

  const getLevelBadge = (level: LogLevel) => {
    switch (level) {
      case 'info': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'warn': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'error': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'debug': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="System Logs" description="Real-time application, system, and access logs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
              isLive ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'text-slate-400 border-[#1e293b] hover:text-slate-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 pulse-dot' : 'bg-slate-500'}`} />
            {isLive ? 'Live Streaming' : 'Paused'}
          </button>
          <button
            onClick={() => setLogs([])}
            className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 border border-[#1e293b] rounded-lg hover:border-[#334155] transition-colors"
          >
            Clear Output
          </button>
        </div>
      </PageHeader>

      {/* Controls / Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Filter logs by keyword..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={levelFilter}
            onChange={e => setLevelFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200 focus:outline-none"
          >
            <option value="all">All Levels</option>
            <option value="info">INFO</option>
            <option value="warn">WARN</option>
            <option value="error">ERROR</option>
            <option value="debug">DEBUG</option>
          </select>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="px-3 py-2 text-xs bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200 focus:outline-none"
          >
            <option value="all">All Sources</option>
            <option value="nginx">Nginx</option>
            <option value="ssl">SSL</option>
            <option value="deployment">Deployment</option>
            <option value="application">Application</option>
            <option value="database">Database</option>
            <option value="system">System</option>
          </select>
        </div>
      </div>

      {/* Log Console Window */}
      <div className="rounded-xl border border-[#1e293b] bg-[#0c0c14] overflow-hidden font-mono text-xs shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-[#12121a] border-b border-[#1e293b]">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-400 font-sans text-xs">/var/log/lightpanel.log</span>
          </div>
          <span className="text-slate-500 text-[11px]">{filteredLogs.length} entries</span>
        </div>

        <div className="p-4 space-y-2 max-h-[550px] overflow-y-auto divide-y divide-white/[0.02]">
          {filteredLogs.map((log) => (
            <div key={log.id} className="pt-2 first:pt-0 flex items-start justify-between group hover:bg-white/[0.02] px-2 py-1 rounded transition-colors">
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-slate-600 text-[11px] whitespace-nowrap">{log.timestamp.split('T')[1].replace('Z', '')}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold border ${getLevelBadge(log.level)}`}>
                  {log.level}
                </span>
                <span className="text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded text-[11px]">{log.source}</span>
                <span className="text-slate-300">{log.message}</span>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <CopyButton text={`[${log.timestamp}] [${log.level.toUpperCase()}] [${log.source}] ${log.message}`} />
              </div>
            </div>
          ))}

          {filteredLogs.length === 0 && (
            <div className="py-12 text-center text-slate-600">
              No matching log records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
