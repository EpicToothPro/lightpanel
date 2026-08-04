'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { mockSpamSettings } from '@/lib/mock-data';

export default function SpamFilteringPage() {
  const [settings, setSettings] = useState(mockSpamSettings);
  const [newBlacklist, setNewBlacklist] = useState('');
  const [newWhitelist, setNewWhitelist] = useState('');

  const addBlacklist = () => {
    if (!newBlacklist.trim()) return;
    setSettings({ ...settings, blacklist: [...settings.blacklist, newBlacklist.trim()] });
    setNewBlacklist('');
  };

  const addWhitelist = () => {
    if (!newWhitelist.trim()) return;
    setSettings({ ...settings, whitelist: [...settings.whitelist, newWhitelist.trim()] });
    setNewWhitelist('');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader title="Spam & Anti-Abuse Filtering" description="Configure SpamAssassin thresholds, greylisting, bayesian engines, and IP/domain rules" />

      {/* Engine Controls */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-6 space-y-6">
        <h3 className="text-base font-semibold text-slate-200">Spam Engine Thresholds</h3>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-slate-300">Spam Score Threshold</label>
            <span className="text-sm font-mono font-bold text-indigo-400">{settings.spam_score_threshold.toFixed(1)} points</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            step="0.5"
            value={settings.spam_score_threshold}
            onChange={e => setSettings({ ...settings, spam_score_threshold: parseFloat(e.target.value) })}
            className="w-full h-2 bg-[#0a0a0f] rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <p className="text-xs text-slate-500 mt-1">Lower threshold = stricter filtering. Scores above this value are marked as SPAM.</p>
        </div>

        <div className="space-y-3 pt-4 border-t border-[#1e293b]">
          {[
            { key: 'greylisting', title: 'Enable Greylisting', desc: 'Temporarily rejects emails from unknown senders to stop automated bot spam.' },
            { key: 'bayesian_filtering', title: 'Bayesian Machine Learning Filter', desc: 'Learns spam patterns from user-flagged emails over time.' },
            { key: 'auto_delete_spam', title: 'Auto-Delete High-Scoring Spam', desc: 'Automatically purge messages with spam scores > 10.0 immediately.' },
          ].map(opt => (
            <div key={opt.key} className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-[#1e293b]">
              <div>
                <p className="text-sm font-medium text-slate-200">{opt.title}</p>
                <p className="text-xs text-slate-500">{opt.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={(settings as any)[opt.key]}
                onChange={e => setSettings({ ...settings, [opt.key]: e.target.checked })}
                className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-indigo-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Blacklist / Whitelist Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blacklist */}
        <div className="rounded-xl border border-red-500/20 bg-[#12121a] p-6 space-y-4">
          <h3 className="text-base font-semibold text-red-400">Blacklist (Block Senders)</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="spammer.com or 198.51.100.42"
              value={newBlacklist}
              onChange={e => setNewBlacklist(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200"
            />
            <button onClick={addBlacklist} className="px-3 py-1.5 text-xs font-medium bg-red-600 hover:bg-red-700 text-white rounded-lg">Add</button>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {settings.blacklist.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#0a0a0f] border border-[#1e293b]">
                <code className="text-xs font-mono text-slate-300">{item}</code>
                <button
                  onClick={() => setSettings({ ...settings, blacklist: settings.blacklist.filter((_, i) => i !== idx) })}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Whitelist */}
        <div className="rounded-xl border border-emerald-500/20 bg-[#12121a] p-6 space-y-4">
          <h3 className="text-base font-semibold text-emerald-400">Whitelist (Always Allow)</h3>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="trusted-partner.com"
              value={newWhitelist}
              onChange={e => setNewWhitelist(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs bg-[#0a0a0f] border border-[#1e293b] rounded-lg font-mono text-slate-200"
            />
            <button onClick={addWhitelist} className="px-3 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg">Add</button>
          </div>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {settings.whitelist.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded bg-[#0a0a0f] border border-[#1e293b]">
                <code className="text-xs font-mono text-slate-300">{item}</code>
                <button
                  onClick={() => setSettings({ ...settings, whitelist: settings.whitelist.filter((_, i) => i !== idx) })}
                  className="text-xs text-red-400 hover:text-red-300"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
