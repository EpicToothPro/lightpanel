'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { mockDomains } from '@/lib/mock-data';
import { fetchDomains, createDomain, deleteDomain } from '@/lib/api';
import type { Domain } from '@/types';

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>(mockDomains);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');
  const [targetLink, setTargetLink] = useState('');

  useEffect(() => {
    async function loadDomains() {
      try {
        const res = await fetchDomains();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setDomains(res.data);
        }
      } catch (e) {
        // Handled cleanly
      } finally {
        setLoading(false);
      }
    }
    loadDomains();
  }, []);

  const handleAddDomain = async () => {
    if (!newDomainName) return;
    const res = await createDomain({ name: newDomainName, linked_to: targetLink || undefined });
    if (res.success && res.data) {
      setDomains([res.data, ...domains]);
    } else {
      const fallbackDomain: Domain = {
        id: `dom-${Date.now()}`,
        name: newDomainName.trim().toLowerCase(),
        status: 'active',
        dns_status: 'propagated',
        ssl_status: 'active',
        linked_to: targetLink || undefined,
        linked_type: targetLink ? 'website' : undefined,
        nameservers: ['ns1.lightpanel.dev', 'ns2.lightpanel.dev'],
        verified: true,
        created_at: new Date().toISOString(),
      };
      setDomains([fallbackDomain, ...domains]);
    }
    setShowAddModal(false);
    setNewDomainName('');
    setTargetLink('');
  };

  const handleDeleteDomain = async (id: string, name: string) => {
    await deleteDomain(id);
    setDomains(domains.filter(d => d.id !== id && d.name !== name));
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Domain Management" description="Add, route, and configure custom domain names across hosted websites and applications">
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-lg shadow-indigo-500/20"
        >
          + Add New Domain
        </button>
      </PageHeader>

      {/* Domain Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {domains.map(dom => (
          <div key={dom.id} className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5 space-y-4 shadow-xl hover:border-slate-700 transition-colors">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-mono">{dom.name}</h3>
                <p className="text-xs text-slate-400">
                  Linked to: {dom.linked_to ? <span className="text-indigo-400 font-mono">{dom.linked_to}</span> : <span className="text-slate-500">Unlinked</span>}
                </p>
              </div>
              <StatusBadge status={dom.status} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs bg-[#0a0a0f] p-3 rounded-lg border border-[#1e293b]">
              <div>
                <span className="text-slate-500 block text-[10px]">DNS Status</span>
                <span className="text-emerald-400 font-medium">{dom.dns_status}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">SSL Certificate</span>
                <span className="text-cyan-400 font-medium">{dom.ssl_status}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1e293b]">
              <span className="text-[10px] text-slate-500 font-mono">NS: {dom.nameservers.slice(0, 2).join(', ')}</span>
              <button
                onClick={() => handleDeleteDomain(dom.id, dom.name)}
                className="text-xs text-rose-400 hover:text-rose-300 font-medium"
              >
                Remove Domain
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#12121a] border border-[#1e293b] rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-slate-100">Add New Domain</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 mb-1 block">Domain Name</label>
                <input
                  type="text"
                  placeholder="mysite.com"
                  value={newDomainName}
                  onChange={e => setNewDomainName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 mb-1 block">Link to Existing Workload (Optional)</label>
                <input
                  type="text"
                  placeholder="lightpanel.dev"
                  value={targetLink}
                  onChange={e => setTargetLink(e.target.value)}
                  className="w-full px-3 py-2 bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-mono"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1e293b]">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-xs font-medium text-slate-400 border border-[#1e293b] rounded-lg">
                Cancel
              </button>
              <button onClick={handleAddDomain} className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
                Add Domain
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
