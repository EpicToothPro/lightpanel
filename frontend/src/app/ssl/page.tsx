'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockSSLCertificates, mockDomains } from '@/lib/mock-data';
import { formatDate } from '@/lib/utils';

export default function SSLPage() {
  const [showIssue, setShowIssue] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState('');

  return (
    <div className="space-y-6">
      <PageHeader title="SSL Certificates" description="Manage SSL/TLS certificates for your domains">
        <button onClick={() => setShowIssue(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>
          Issue Certificate
        </button>
      </PageHeader>

      {/* Issue Certificate Flow */}
      {showIssue && (
        <div className="rounded-xl border border-emerald-500/20 bg-[#12121a] p-6">
          <h3 className="text-base font-semibold text-slate-200 mb-4">Issue SSL Certificate</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Select Domain</label>
              <select value={selectedDomain} onChange={e => setSelectedDomain(e.target.value)}
                className="w-full max-w-md px-3 py-2 text-sm bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
                <option value="">Choose a domain...</option>
                {mockDomains.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Challenge Type</label>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#1e293b] cursor-pointer hover:border-[#334155] transition-colors bg-[#0a0a0f]">
                  <input type="radio" name="challenge" value="http-01" defaultChecked className="text-emerald-500 focus:ring-emerald-500/50" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">HTTP-01</p>
                    <p className="text-xs text-slate-500">Automatic via webroot</p>
                  </div>
                </label>
                <label className="flex items-center gap-2 px-4 py-3 rounded-lg border border-[#1e293b] cursor-pointer hover:border-[#334155] transition-colors bg-[#0a0a0f]">
                  <input type="radio" name="challenge" value="dns-01" className="text-emerald-500 focus:ring-emerald-500/50" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">DNS-01</p>
                    <p className="text-xs text-slate-500">Required for wildcards</p>
                  </div>
                </label>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#1e293b] bg-[#0a0a0f] text-emerald-500 focus:ring-emerald-500/50" />
              <span className="text-sm text-slate-300">Enable automatic renewal</span>
            </label>
          </div>
          <div className="flex items-center gap-3 mt-5 pt-4 border-t border-[#1e293b]">
            <button className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors">Issue Certificate</button>
            <button onClick={() => setShowIssue(false)} className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 border border-[#1e293b] rounded-lg hover:border-[#334155] transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Certificate List */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Domain</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Issuer</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">Issued</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Expires</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">Auto Renew</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {mockSSLCertificates.map(cert => {
                const daysLeft = Math.ceil((new Date(cert.expires_at).getTime() - Date.now()) / 86400000);
                return (
                  <tr key={cert.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div>
                        <span className="text-sm font-mono font-medium text-slate-200">{cert.domain}</span>
                        {cert.alt_names.length > 0 && (
                          <p className="text-xs text-slate-500 mt-0.5">{cert.alt_names.join(', ')}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      <span className="text-sm text-slate-400">{cert.issuer}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={cert.status} />
                    </td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-sm text-slate-500">{formatDate(cert.issued_at)}</span>
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <span className="text-sm text-slate-400">{formatDate(cert.expires_at)}</span>
                        <p className={`text-xs mt-0.5 ${daysLeft < 14 ? 'text-amber-400' : 'text-slate-500'}`}>
                          {daysLeft}d remaining
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 hidden md:table-cell">
                      {cert.auto_renew ? (
                        <span className="text-xs text-emerald-400 flex items-center gap-1">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          Enabled
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500">Disabled</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button className="text-xs font-medium text-indigo-400 hover:text-indigo-300 px-2.5 py-1 rounded-md hover:bg-indigo-500/10 transition-colors">Renew</button>
                        <button className="text-xs font-medium text-red-400 hover:text-red-300 px-2.5 py-1 rounded-md hover:bg-red-500/10 transition-colors">Revoke</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
