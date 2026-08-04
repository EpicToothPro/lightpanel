'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { mockDomains } from '@/lib/mock-data';

export default function CreateWebsiteWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    runtime: 'static',
    domain: mockDomains[0]?.name || '',
    documentRoot: '/var/www/mywebsite',
    sourceType: 'git',
    gitRepo: '',
    phpVersion: '8.3',
    envVars: '',
    enableSSL: true,
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 9));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Create Website Wizard" description="Follow the step-by-step wizard to deploy a new website" />

      {/* Progress Bar */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-4">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Step {step} of 9</span>
          <span className="font-semibold text-indigo-400">
            {step === 1 && '1. Website Name'}
            {step === 2 && '2. Runtime Selection'}
            {step === 3 && '3. Domain Selection'}
            {step === 4 && '4. Document Root'}
            {step === 5 && '5. Deployment Source'}
            {step === 6 && '6. Runtime Version'}
            {step === 7 && '7. Environment Variables'}
            {step === 8 && '8. SSL Setup'}
            {step === 9 && '9. Review & Create'}
          </span>
        </div>
        <div className="w-full h-2 bg-white/[0.06] rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${(step / 9) * 100}%` }} />
        </div>
      </div>

      {/* Wizard Content Card */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-6">
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Enter Website Name</h3>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Website Name</label>
              <input
                type="text"
                placeholder="my-cool-website"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Select Runtime</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'static', label: 'Static HTML/JS', desc: 'Nginx static server' },
                { id: 'php', label: 'PHP Engine', desc: 'PHP-FPM fastcgi' },
                { id: 'nodejs', label: 'Node.js', desc: 'Node.js runtime' },
                { id: 'nextjs', label: 'Next.js', desc: 'SSR & React framework' },
                { id: 'python', label: 'Python WSGI', desc: 'FastAPI / Django' },
                { id: 'ruby', label: 'Ruby / Rails', desc: 'Puma / Rack' },
              ].map(r => (
                <button
                  key={r.id}
                  onClick={() => setFormData({ ...formData, runtime: r.id })}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    formData.runtime === r.id
                      ? 'border-indigo-500 bg-indigo-500/10 text-slate-200'
                      : 'border-[#1e293b] bg-[#0a0a0f] text-slate-400 hover:border-[#334155]'
                  }`}
                >
                  <p className="text-sm font-semibold">{r.label}</p>
                  <p className="text-[11px] text-slate-500">{r.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Assign Domain</h3>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Select Domain</label>
              <select
                value={formData.domain}
                onChange={e => setFormData({ ...formData, domain: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
              >
                {mockDomains.map(d => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Specify Document Root</h3>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Document Root Path</label>
              <input
                type="text"
                value={formData.documentRoot}
                onChange={e => setFormData({ ...formData, documentRoot: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200"
              />
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Deployment Source</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="src" checked={formData.sourceType === 'git'} onChange={() => setFormData({ ...formData, sourceType: 'git' })} />
                <span className="text-sm text-slate-200">Git Repository</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="src" checked={formData.sourceType === 'upload'} onChange={() => setFormData({ ...formData, sourceType: 'upload' })} />
                <span className="text-sm text-slate-200">File Upload / Archive</span>
              </label>
            </div>
            {formData.sourceType === 'git' && (
              <input
                type="text"
                placeholder="https://github.com/user/repository.git"
                value={formData.gitRepo}
                onChange={e => setFormData({ ...formData, gitRepo: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200"
              />
            )}
          </div>
        )}

        {step === 6 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">PHP / Runtime Version</h3>
            <select
              value={formData.phpVersion}
              onChange={e => setFormData({ ...formData, phpVersion: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
            >
              <option value="8.3">PHP 8.3 (Latest)</option>
              <option value="8.2">PHP 8.2 (Stable)</option>
              <option value="8.1">PHP 8.1</option>
              <option value="7.4">PHP 7.4 (Legacy)</option>
            </select>
          </div>
        )}

        {step === 7 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Environment Variables</h3>
            <textarea
              rows={4}
              placeholder="KEY=VALUE&#10;APP_ENV=production"
              value={formData.envVars}
              onChange={e => setFormData({ ...formData, envVars: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200"
            />
          </div>
        )}

        {step === 8 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Automatic Let's Encrypt SSL</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableSSL}
                onChange={e => setFormData({ ...formData, enableSSL: e.target.checked })}
                className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-indigo-500"
              />
              <span className="text-sm text-slate-200">Automatically issue Let's Encrypt SSL certificate upon creation</span>
            </label>
          </div>
        )}

        {step === 9 && (
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-200">Review & Provision</h3>
            <div className="space-y-2 text-xs bg-[#0a0a0f] p-4 rounded-lg border border-[#1e293b]">
              <p><span className="text-slate-500">Name:</span> <span className="text-slate-200 font-semibold">{formData.name || 'my-website'}</span></p>
              <p><span className="text-slate-500">Runtime:</span> <span className="text-slate-200">{formData.runtime} ({formData.phpVersion})</span></p>
              <p><span className="text-slate-500">Domain:</span> <span className="text-slate-200 font-mono">{formData.domain}</span></p>
              <p><span className="text-slate-500">Document Root:</span> <span className="text-slate-200 font-mono">{formData.documentRoot}</span></p>
              <p><span className="text-slate-500">SSL Auto-Issue:</span> <span className="text-emerald-400">{formData.enableSSL ? 'Yes' : 'No'}</span></p>
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1e293b]">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 disabled:opacity-30 border border-[#1e293b] rounded-lg"
          >
            Previous
          </button>
          {step < 9 ? (
            <button
              onClick={nextStep}
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={() => router.push('/websites')}
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
            >
              Create Website
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
