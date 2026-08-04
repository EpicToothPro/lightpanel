'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockApplications } from '@/lib/mock-data';
import { fetchApplications, createApplication, deleteApplication } from '@/lib/api';
import type { Application } from '@/types';

export default function ApplicationsPage() {
  const [apps, setApps] = useState<Application[]>(mockApplications);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAppName, setNewAppName] = useState('');
  const [newRuntime, setNewRuntime] = useState('nodejs');
  const [newVersion, setNewVersion] = useState('20.x');

  useEffect(() => {
    async function loadApps() {
      try {
        const res = await fetchApplications();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setApps(res.data);
        }
      } catch (e) {
        // Fallback to initial state
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, []);

  const handleCreateApp = async () => {
    if (!newAppName) return;
    const newApp: Partial<Application> = {
      name: newAppName,
      runtime: newRuntime as any,
      version: newVersion,
      port: Math.floor(3000 + Math.random() * 5000),
      status: 'running',
    };

    const res = await createApplication(newApp);
    if (res.success && res.data) {
      setApps([res.data, ...apps]);
    } else {
      setApps([
        {
          id: `app-${Date.now()}`,
          name: newAppName,
          runtime: newRuntime as any,
          version: newVersion,
          domain: 'app.lightpanel.dev',
          port: 4100,
          status: 'running',
          cpu_usage: 1.2,
          memory_usage: 128,
          memory_limit: 512,
          last_deployment: new Date().toISOString(),
          env_vars: {},
          created_at: new Date().toISOString(),
        },
        ...apps,
      ]);
    }
    setShowCreateModal(false);
    setNewAppName('');
  };

  const handleDeleteApp = async (id: string) => {
    await deleteApplication(id);
    setApps(apps.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Workload Applications" description="Deploy and manage backend services across Node, Next.js, PHP, Python, Java, Kotlin, .NET, Ruby, and Perl">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-lg shadow-indigo-500/20"
        >
          + Deploy New Application
        </button>
      </PageHeader>

      {/* Applications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {apps.map(app => (
          <div key={app.id} className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5 space-y-4 shadow-xl hover:border-slate-700 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-mono text-xs font-bold">
                  {app.runtime.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{app.name}</h3>
                  <p className="text-xs font-mono text-slate-400">{app.domain || `Internal Port :${app.port}`}</p>
                </div>
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#0a0a0f] p-3 rounded-lg border border-[#1e293b]">
              <div>
                <span className="text-slate-500 block text-[10px]">Runtime</span>
                <span className="text-slate-300 font-mono">{app.runtime} {app.version}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">RAM Usage</span>
                <span className="text-slate-300 font-mono">{app.memory_usage} MB / {app.memory_limit} MB</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]">
              <span className="text-[10px] text-slate-500">Port {app.port}</span>
              <button
                onClick={() => handleDeleteApp(app.id)}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium"
              >
                Delete App
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create App Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#12121a] border border-[#1e293b] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Deploy New Application</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 mb-1 block">Application Name</label>
                <input
                  type="text"
                  placeholder="my-backend-service"
                  value={newAppName}
                  onChange={e => setNewAppName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Runtime Engine</label>
                <select
                  value={newRuntime}
                  onChange={e => setNewRuntime(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
                >
                  {['nodejs', 'nextjs', 'php', 'python', 'java', 'kotlin', 'dotnet', 'ruby', 'perl'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e293b]">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-xs font-medium text-slate-400 border border-[#1e293b] rounded-lg">
                Cancel
              </button>
              <button onClick={handleCreateApp} className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                Create & Deploy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
