'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { CopyButton } from '@/components/shared/copy-button';
import { mockDNSAuthRecords, mockEmailDomains } from '@/lib/mock-data';

export default function EmailDNSAuthPage() {
  const [domain, setDomain] = useState(mockEmailDomains[0]?.name || 'lightpanel.dev');

  return (
    <div className="space-y-6">
      <PageHeader title="DNS & Mail Authentication" description="Auto-generated MX, SPF, DKIM, DMARC, and A records for email deliverability" />

      <div className="flex items-center gap-3">
        <label className="text-xs font-medium text-slate-400">Select Domain:</label>
        <select
          value={domain}
          onChange={e => setDomain(e.target.value)}
          className="px-3 py-1.5 text-sm bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200"
        >
          {mockEmailDomains.map(d => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {mockDNSAuthRecords.map((rec, i) => (
          <div key={i} className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5 space-y-3 hover:border-[#334155] transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">{rec.type}</span>
                <span className="text-sm font-semibold text-slate-200">{rec.host}</span>
              </div>
              <StatusBadge status={rec.status} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded-lg bg-[#0a0a0f] border border-[#1e293b]">
                <code className="text-xs font-mono text-slate-300 break-all">{rec.value}</code>
                <CopyButton text={rec.value} />
              </div>
              <p className="text-xs text-slate-500">{rec.instructions}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
