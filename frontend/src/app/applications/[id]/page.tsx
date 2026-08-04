'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { CopyButton } from '@/components/shared/copy-button';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { mockApplications, mockDeployments, mockLogs } from '@/lib/mock-data';
import { getRuntimeColor, formatRelativeTime, formatDuration } from '@/lib/utils';

export default function ApplicationDetailPage() {
  const params = useParams();
  const appId = (params?.id as string) || 'app-1';
  const app = mockApplications.find(a => a.id === appId) || mockApplications[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'env' | 'logs' | 'deployments' | 'settings'>('overview');
  const [showDelete, setShowDelete] = useState(false);
  const [appStatus, setAppStatus] = useState(app.status);

  return (
    <div className="space-y-6">
      {/* Header with App Info & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0"
            style={{ backgroundColor: getRuntimeColor(app.runtime) + '20', color: getRuntimeColor(app.runtime) }}
          >
            {app.runtime.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-100">{app.name}</h1>
              <StatusBadge status={appStatus} />
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              {app.domain} • Port {app.port} • {app.runtime} {app.version}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {appStatus === 'running' ? (
            <button
              onClick={() => setAppStatus('stopped')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg hover:bg-amber-500/20 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect width="14" height="14" x="5" y="5" rx="2"/></svg>
              Stop
            </button>
          ) : (
            <button
              onClick={() => setAppStatus('running')}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="6 3 20 12 6 21 6 3"/></svg>
              Start
            </button>
          )}

          <button
            onClick={() => setAppStatus('restarting')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-blue-400 bg-blue-500/10 border border-blue-500/20 rounded-lg hover:bg-blue-500/20 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
            Restart
          </button>

          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/></svg>
            Redeploy
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#1e293b] gap-6">
        {[
          { id: 'overview', label: 'Overview & Config' },
          { id: 'env', label: 'Environment Variables' },
          { id: 'logs', label: 'Logs' },
          { id: 'deployments', label: 'Deployment History' },
          { id: 'settings', label: 'Settings & Danger Zone' },
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

      {/* Tab: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">CPU Usage</p>
              <p className="text-xl font-bold text-slate-100">{app.cpu_usage}%</p>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full mt-3">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${app.cpu_usage}%` }} />
              </div>
            </div>
            <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">Memory Usage</p>
              <p className="text-xl font-bold text-slate-100">{app.memory_usage} MB <span className="text-xs font-normal text-slate-500">/ {app.memory_limit} MB</span></p>
              <div className="w-full h-1.5 bg-white/[0.06] rounded-full mt-3">
                <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${(app.memory_usage / app.memory_limit) * 100}%` }} />
              </div>
            </div>
            <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5">
              <p className="text-xs font-medium text-slate-500 mb-1">Last Deployment</p>
              <p className="text-sm font-semibold text-slate-200 mt-1">{formatRelativeTime(app.last_deployment)}</p>
              <p className="text-xs text-slate-500 mt-1">Branch: <span className="font-mono text-slate-400">{app.git_branch}</span></p>
            </div>
          </div>

          <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Runtime Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Build Command</label>
                <input type="text" defaultValue={app.build_command} className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Start Command</label>
                <input type="text" defaultValue={app.start_command} className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Git Repository</label>
                <input type="text" defaultValue={app.git_repo} className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
              </div>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Port Mapping</label>
                <input type="text" defaultValue={app.port} className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Env */}
      {activeTab === 'env' && (
        <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-4">
          <h3 className="text-base font-semibold text-slate-200">App Environment Variables</h3>
          <div className="space-y-3">
            {Object.entries(app.env_vars).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-[#1e293b]">
                <code className="text-xs font-mono font-bold text-indigo-400">{k}</code>
                <code className="text-xs font-mono text-slate-300">{v}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Logs */}
      {activeTab === 'logs' && (
        <div className="rounded-xl border border-[#1e293b] bg-[#0c0c14] p-4 font-mono text-xs text-slate-300 space-y-2 h-96 overflow-y-auto">
          {mockLogs.filter(l => l.source === 'application' || l.source === 'nginx').map(log => (
            <div key={log.id} className="flex items-center gap-3">
              <span className="text-slate-600">{log.timestamp.split('T')[1].replace('Z','')}</span>
              <span className="text-indigo-400">[{log.level.toUpperCase()}]</span>
              <span>{log.message}</span>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Deployments */}
      {activeTab === 'deployments' && (
        <div className="space-y-3">
          {mockDeployments.map(d => (
            <div key={d.id} className="p-4 rounded-xl border border-[#1e293b] bg-[#12121a] flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-200">{d.commit_message}</p>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{d.branch}@{d.commit} • {formatDuration(d.duration)}</p>
              </div>
              <StatusBadge status={d.status} />
            </div>
          ))}
        </div>
      )}

      {/* Tab: Settings & Danger Zone */}
      {activeTab === 'settings' && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 space-y-4">
          <h3 className="text-base font-semibold text-red-400">Danger Zone</h3>
          <p className="text-xs text-slate-400">Permanently remove this application and all associated environment configurations and logs.</p>
          <button onClick={() => setShowDelete(true)} className="px-4 py-2 text-sm font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            Delete Application
          </button>
        </div>
      )}

      <ConfirmDialog
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={() => setShowDelete(false)}
        title="Delete Application"
        description={`Are you sure you want to delete ${app.name}? All container data, port bindings, and custom domains will be deleted.`}
        confirmText="Delete Application"
        variant="danger"
      />
    </div>
  );
}
