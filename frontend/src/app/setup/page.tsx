'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SetupWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [setupData, setSetupData] = useState({
    hostname: 'vps-prod-01',
    adminUsername: 'admin',
    adminEmail: 'admin@lightpanel.dev',
    adminPassword: '',
    dbHost: '127.0.0.1',
    dbPort: '5432',
    dbName: 'lightpanel',
    dbUser: 'postgres',
    dbPass: 'postgres',
    redisHost: '127.0.0.1',
    redisPort: '6379',
    mailDomain: 'lightpanel.dev',
    enableSSLAuto: true,
    defaultQuotaMB: -1, // Unlimited by default
    enableAnalytics: true,
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 10));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const finishSetup = async () => {
    try {
      await fetch('/api/v1/setup/finish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(setupData),
      });
    } catch (e) {
      // client-side fallback
    }
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">LightPanel First-Run Setup</h1>
          <p className="text-xs text-slate-400">Configure your private self-hosted infrastructure control panel</p>
        </div>

        {/* Progress Bar */}
        <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Step {step} of 10</span>
            <span className="font-semibold text-indigo-400">
              {step === 1 && '1. Server Identity'}
              {step === 2 && '2. Admin Creation'}
              {step === 3 && '3. PostgreSQL Database'}
              {step === 4 && '4. Redis Cache & Queue'}
              {step === 5 && '5. Mail Server (Postfix/Dovecot)'}
              {step === 6 && '6. Domain & Let\'s Encrypt SSL'}
              {step === 7 && '7. Storage & Quota Defaults'}
              {step === 8 && '8. Runtime Engine Defaults'}
              {step === 9 && '9. Analytics Toggle'}
              {step === 10 && '10. Review & Provision'}
            </span>
          </div>
          <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${(step / 10) * 100}%` }} />
          </div>
        </div>

        {/* Wizard Form Card */}
        <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-6 shadow-2xl">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Server Identity</h3>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Hostname</label>
                <input
                  type="text"
                  value={setupData.hostname}
                  onChange={e => setSetupData({ ...setupData, hostname: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Create First Admin Account</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Admin Username</label>
                  <input
                    type="text"
                    value={setupData.adminUsername}
                    onChange={e => setSetupData({ ...setupData, adminUsername: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Admin Email</label>
                  <input
                    type="email"
                    value={setupData.adminEmail}
                    onChange={e => setSetupData({ ...setupData, adminEmail: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Master Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={setupData.adminPassword}
                    onChange={e => setSetupData({ ...setupData, adminPassword: e.target.value })}
                    className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">PostgreSQL Database</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Host</label>
                  <input type="text" value={setupData.dbHost} onChange={e => setSetupData({ ...setupData, dbHost: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Port</label>
                  <input type="text" value={setupData.dbPort} onChange={e => setSetupData({ ...setupData, dbPort: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Database Name</label>
                  <input type="text" value={setupData.dbName} onChange={e => setSetupData({ ...setupData, dbName: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">User / Password</label>
                  <input type="text" value={setupData.dbUser} onChange={e => setSetupData({ ...setupData, dbUser: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Redis Cache & Queue Configuration</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Redis Host</label>
                  <input type="text" value={setupData.redisHost} onChange={e => setSetupData({ ...setupData, redisHost: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-400 mb-1.5 block">Redis Port</label>
                  <input type="text" value={setupData.redisPort} onChange={e => setSetupData({ ...setupData, redisPort: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Mail Configuration (Postfix & Dovecot)</h3>
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Primary Mail Domain</label>
                <input type="text" value={setupData.mailDomain} onChange={e => setSetupData({ ...setupData, mailDomain: e.target.value })} className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200" />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Domain & SSL Settings</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={setupData.enableSSLAuto} onChange={e => setSetupData({ ...setupData, enableSSLAuto: e.target.checked })} className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-indigo-500" />
                <span className="text-sm text-slate-200">Automatically issue Let's Encrypt certificates for new hostnames</span>
              </label>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Storage & Quota Defaults</h3>
              <p className="text-xs text-slate-400">Default quota behavior is set to <span className="font-bold text-emerald-400">Unlimited</span> unless configured per user or account.</p>
              <div className="p-3 bg-[#0a0a0f] border border-[#1e293b] rounded-lg flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Default User Quota</span>
                <span className="text-emerald-400 font-mono font-bold">Unlimited (-1 MB)</span>
              </div>
            </div>
          )}

          {step === 8 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Runtime Engine Defaults</h3>
              <p className="text-xs text-slate-400">Supported runtimes: Node.js, Next.js, PHP, Python, Java, Kotlin, Swift, .NET, Perl, Ruby, and Static HTML.</p>
            </div>
          )}

          {step === 9 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Analytics Module Toggle</h3>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={setupData.enableAnalytics} onChange={e => setSetupData({ ...setupData, enableAnalytics: e.target.checked })} className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-indigo-500" />
                <span className="text-sm text-slate-200">Enable privacy-conscious, self-hosted web analytics globally</span>
              </label>
            </div>
          )}

          {step === 10 && (
            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-200">Review & Provision System</h3>
              <div className="p-4 rounded-lg bg-[#0a0a0f] border border-[#1e293b] space-y-2 text-xs">
                <p><span className="text-slate-500">Hostname:</span> <span className="text-slate-200 font-mono">{setupData.hostname}</span></p>
                <p><span className="text-slate-500">Admin Account:</span> <span className="text-slate-200 font-medium">{setupData.adminUsername} ({setupData.adminEmail})</span></p>
                <p><span className="text-slate-500">PostgreSQL:</span> <span className="text-slate-200 font-mono">{setupData.dbHost}:{setupData.dbPort}/{setupData.dbName}</span></p>
                <p><span className="text-slate-500">Default Quota:</span> <span className="text-emerald-400 font-bold">Unlimited</span></p>
                <p><span className="text-slate-500">Analytics:</span> <span className="text-indigo-400">{setupData.enableAnalytics ? 'Enabled' : 'Disabled'}</span></p>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-[#1e293b]">
            <button onClick={prevStep} disabled={step === 1} className="px-4 py-2 text-sm font-medium text-slate-400 border border-[#1e293b] rounded-lg disabled:opacity-30">
              Previous
            </button>
            {step < 10 ? (
              <button onClick={nextStep} className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                Next Step
              </button>
            ) : (
              <button onClick={finishSetup} className="px-5 py-2 text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg shadow-emerald-900/20">
                Complete Setup & Launch Panel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
