'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { mockWebmailMessages, mockMailboxes } from '@/lib/mock-data';
import { MailMessage } from '@/types';
import { formatDate } from '@/lib/utils';

export default function WebmailClientPage() {
  const [folder, setFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'archive' | 'contacts'>('inbox');
  const [activeMessage, setActiveMessage] = useState<MailMessage | null>(mockWebmailMessages[0] || null);
  const [search, setSearch] = useState('');
  const [showCompose, setShowCompose] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState(mockMailboxes[0]?.email || 'admin@lightpanel.dev');

  const filteredMessages = mockWebmailMessages.filter(m => {
    if (folder === 'contacts') return false;
    const matchFolder = m.folder === folder;
    const matchSearch = search === '' || m.subject.toLowerCase().includes(search.toLowerCase()) || m.from.toLowerCase().includes(search.toLowerCase()) || m.snippet.toLowerCase().includes(search.toLowerCase());
    return matchFolder && matchSearch;
  });

  const unreadInbox = mockWebmailMessages.filter(m => m.folder === 'inbox' && !m.read).length;

  const mockContacts = [
    { name: 'Alex Dev', email: 'alex@lightpanel.dev', role: 'Lead Developer' },
    { name: 'Support Team', email: 'support@lightpanel.dev', role: 'Customer Support' },
    { name: 'DigitalOcean Support', email: 'support@digitalocean.com', role: 'Cloud Infrastructure' },
    { name: 'Let\'s Encrypt Expiry', email: 'expiry@letsencrypt.org', role: 'SSL Certificate Issuer' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-100">Webmail Client</h1>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">TLS Encrypted</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Connected as <span className="font-mono text-indigo-400">{selectedIdentity}</span></p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedIdentity}
            onChange={e => setSelectedIdentity(e.target.value)}
            className="px-3 py-2 text-xs bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200"
          >
            {mockMailboxes.map(m => (
              <option key={m.id} value={m.email}>{m.email}</option>
            ))}
          </select>
          <button
            onClick={() => setShowCompose(true)}
            className="px-4 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            Compose Mail
          </button>
        </div>
      </div>

      {/* Main Mail App Window */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] shadow-2xl">
        {/* Left Sidebar: Folders */}
        <div className="lg:col-span-3 border-r border-[#1e293b] p-3 space-y-1 bg-[#0a0a0f]/50">
          {[
            { id: 'inbox', label: 'Inbox', icon: '📥', count: unreadInbox },
            { id: 'sent', label: 'Sent Messages', icon: '📤' },
            { id: 'drafts', label: 'Drafts', icon: '📝' },
            { id: 'spam', label: 'Junk / Spam', icon: '🚫' },
            { id: 'trash', label: 'Trash', icon: '🗑️' },
            { id: 'archive', label: 'Archive', icon: '📦' },
            { id: 'contacts', label: 'Address Book', icon: '👥' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => { setFolder(f.id as any); setActiveMessage(null); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                folder === f.id
                  ? 'bg-indigo-500/15 text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span>{f.icon}</span>
                <span>{f.label}</span>
              </div>
              {f.count !== undefined && f.count > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500 text-white rounded-full">
                  {f.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Middle Column: Message List or Contacts List */}
        <div className="lg:col-span-4 border-r border-[#1e293b] flex flex-col bg-[#12121a]">
          {/* Search bar */}
          <div className="p-3 border-b border-[#1e293b]">
            <input
              type="text"
              placeholder="Search mail..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-3 py-1.5 text-xs bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {folder === 'contacts' ? (
            <div className="divide-y divide-[#1e293b] overflow-y-auto max-h-[550px]">
              {mockContacts.map((c, i) => (
                <div key={i} className="p-3 hover:bg-white/[0.02] cursor-pointer">
                  <p className="text-xs font-bold text-slate-200">{c.name}</p>
                  <p className="text-[11px] font-mono text-indigo-400">{c.email}</p>
                  <p className="text-[10px] text-slate-500">{c.role}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-[#1e293b] overflow-y-auto max-h-[550px]">
              {filteredMessages.map(m => (
                <div
                  key={m.id}
                  onClick={() => setActiveMessage(m)}
                  className={`p-3.5 hover:bg-white/[0.02] cursor-pointer transition-colors ${
                    activeMessage?.id === m.id ? 'bg-indigo-500/10 border-l-2 border-indigo-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-semibold truncate max-w-[180px] ${!m.read ? 'text-slate-100 font-bold' : 'text-slate-400'}`}>
                      {m.from}
                    </span>
                    <span className="text-[10px] text-slate-500">{formatDate(m.timestamp)}</span>
                  </div>
                  <p className={`text-xs truncate ${!m.read ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>{m.subject}</p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{m.snippet}</p>
                </div>
              ))}

              {filteredMessages.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500">
                  No messages in {folder}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Message View */}
        <div className="lg:col-span-5 p-5 flex flex-col bg-[#0c0c14]/50">
          {activeMessage ? (
            <div className="space-y-4">
              <div className="pb-4 border-b border-[#1e293b] space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="text-base font-bold text-slate-100">{activeMessage.subject}</h3>
                  <button className="text-xs text-red-400 hover:text-red-300">Delete</button>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>From: <strong className="text-slate-200">{activeMessage.from}</strong></span>
                  <span className="text-slate-500">{formatDate(activeMessage.timestamp)}</span>
                </div>
                <div className="text-xs text-slate-400">
                  To: <span className="font-mono text-slate-300">{activeMessage.to}</span>
                </div>
              </div>

              {/* Body */}
              <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed min-h-[200px] font-sans">
                {activeMessage.body}
              </div>

              {/* Attachments */}
              {activeMessage.attachments && activeMessage.attachments.length > 0 && (
                <div className="pt-4 border-t border-[#1e293b] space-y-2">
                  <p className="text-xs font-semibold text-slate-400">Attachments ({activeMessage.attachments.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {activeMessage.attachments.map((att, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 rounded-lg bg-[#12121a] border border-[#1e293b] text-xs">
                        <span>📎</span>
                        <div>
                          <p className="text-slate-200 font-medium">{att.name}</p>
                          <p className="text-[10px] text-slate-500">{(att.size / 1024).toFixed(0)} KB</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Select a message to view content
            </div>
          )}
        </div>
      </div>

      {/* Compose Modal */}
      {showCompose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#12121a] border border-[#1e293b] rounded-xl shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1e293b] pb-3">
              <h3 className="text-base font-bold text-slate-200">Compose New Email</h3>
              <button onClick={() => setShowCompose(false)} className="text-slate-500 hover:text-slate-300">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">From Identity</label>
                <select
                  value={selectedIdentity}
                  onChange={e => setSelectedIdentity(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200"
                >
                  {mockMailboxes.map(m => (
                    <option key={m.id} value={m.email}>{m.email}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">To Recipient</label>
                <input type="email" placeholder="recipient@example.com" className="w-full px-3 py-1.5 text-xs bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Subject</label>
                <input type="text" placeholder="Subject..." className="w-full px-3 py-1.5 text-xs bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Message Body</label>
                <textarea rows={6} placeholder="Type your email here..." className="w-full px-3 py-2 text-xs bg-[#0a0a0f] border border-[#1e293b] rounded-lg text-slate-200 font-sans" />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-[#1e293b]">
              <button className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1">
                📎 Attach File
              </button>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowCompose(false)} className="px-3 py-1.5 text-xs font-medium text-slate-400 border border-[#1e293b] rounded-lg">Cancel</button>
                <button onClick={() => setShowCompose(false)} className="px-4 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Send Email</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
