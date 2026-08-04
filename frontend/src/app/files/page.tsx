'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/shared/page-header';
import { mockFiles } from '@/lib/mock-data';
import { formatBytes, formatDateTime } from '@/lib/utils';

const fileTypeIcons: Record<string, string> = {
  directory: '📁', html: '🌐', js: '📜', ts: '🔷', json: '📋', md: '📝',
  env: '🔐', yml: '⚙️', yaml: '⚙️', conf: '🔧', css: '🎨', py: '🐍',
  go: '🔵', sh: '🖥️', sql: '🗃️', log: '📄', txt: '📄', default: '📄',
};

export default function FilesPage() {
  const [currentPath, setCurrentPath] = useState('/var/www/lightpanel.dev');
  const [selected, setSelected] = useState<string[]>([]);

  const pathParts = currentPath.split('/').filter(Boolean);

  const getIcon = (item: typeof mockFiles[0]) => {
    if (item.type === 'directory') return fileTypeIcons.directory;
    return fileTypeIcons[item.extension || ''] || fileTypeIcons.default;
  };

  return (
    <div className="space-y-6">
      <PageHeader title="File Manager" description="Browse and manage server files">
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 border border-[#1e293b] rounded-lg hover:border-[#334155] hover:text-slate-200 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Upload
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 border border-[#1e293b] rounded-lg hover:border-[#334155] hover:text-slate-200 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/><line x1="12" x2="12" y1="10" y2="16"/><line x1="9" x2="15" y1="13" y2="13"/></svg>
            New Folder
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 border border-[#1e293b] rounded-lg hover:border-[#334155] hover:text-slate-200 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><line x1="12" x2="12" y1="10" y2="16"/><line x1="9" x2="15" y1="13" y2="13"/></svg>
            New File
          </button>
        </div>
      </PageHeader>

      {/* Breadcrumb Path */}
      <div className="flex items-center gap-1 px-4 py-2.5 rounded-lg bg-[#12121a] border border-[#1e293b] overflow-x-auto">
        <button onClick={() => setCurrentPath('/')} className="text-xs text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-white/[0.04] transition-colors flex-shrink-0">
          /
        </button>
        {pathParts.map((part, i) => (
          <React.Fragment key={i}>
            <svg width="12" height="12" viewBox="0 0 24 24" className="text-slate-600 flex-shrink-0"><path d="m9 18 6-6-6-6" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
            <button
              onClick={() => setCurrentPath('/' + pathParts.slice(0, i + 1).join('/'))}
              className="text-xs text-slate-400 hover:text-slate-200 px-1.5 py-0.5 rounded hover:bg-white/[0.04] transition-colors flex-shrink-0"
            >
              {part}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <input type="text" placeholder="Search files..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-[#12121a] border border-[#1e293b] rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
      </div>

      {/* File Table */}
      <div className="rounded-xl border border-[#1e293b] bg-[#12121a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1e293b]">
                <th className="w-8 px-4 py-3">
                  <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#334155] bg-[#0a0a0f] text-indigo-500" />
                </th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-3 py-3">Name</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-3 py-3 hidden md:table-cell">Size</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-3 py-3 hidden lg:table-cell">Modified</th>
                <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-3 py-3 hidden xl:table-cell">Permissions</th>
                <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e293b]">
              {mockFiles.map(file => (
                <tr key={file.path} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="w-8 px-4 py-3">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#334155] bg-[#0a0a0f] text-indigo-500" />
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base flex-shrink-0">{getIcon(file)}</span>
                      <button className={`text-sm font-medium truncate ${
                        file.type === 'directory' ? 'text-indigo-400 hover:text-indigo-300' : 'text-slate-200 hover:text-slate-100'
                      } transition-colors`}>
                        {file.name}
                      </button>
                    </div>
                  </td>
                  <td className="px-3 py-3 hidden md:table-cell">
                    <span className="text-xs text-slate-500">{file.type === 'directory' ? '—' : formatBytes(file.size)}</span>
                  </td>
                  <td className="px-3 py-3 hidden lg:table-cell">
                    <span className="text-xs text-slate-500">{formatDateTime(file.modified)}</span>
                  </td>
                  <td className="px-3 py-3 hidden xl:table-cell">
                    <code className="text-xs font-mono text-slate-500">{file.permissions}</code>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {file.type === 'file' && (
                        <button className="p-1.5 rounded-md text-slate-500 hover:text-blue-400 hover:bg-blue-400/10 transition-colors" title="Edit">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                        </button>
                      )}
                      <button className="p-1.5 rounded-md text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors" title="Download">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                      </button>
                      <button className="p-1.5 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors" title="Delete">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Terminal Panel */}
      <div className="rounded-xl border border-red-500/20 bg-[#0c0c14] overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500/5 border-b border-red-500/20">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-400"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
          <span className="text-xs font-medium text-red-400">Terminal</span>
          <span className="text-[10px] text-red-400/60 bg-red-500/10 px-1.5 py-0.5 rounded">Danger Zone</span>
        </div>
        <div className="p-4 font-mono text-xs text-slate-400 h-32 overflow-y-auto">
          <p className="text-slate-600">root@vps-prod-01:/var/www/lightpanel.dev$</p>
          <p className="text-slate-500 mt-1">Type a command to execute on the server...</p>
        </div>
        <div className="flex items-center px-4 py-2 border-t border-[#1e293b]">
          <span className="text-xs text-slate-600 font-mono mr-2">$</span>
          <input type="text" placeholder="Enter command..." 
            className="flex-1 bg-transparent text-xs text-slate-200 font-mono placeholder-slate-600 focus:outline-none" />
          <button className="px-3 py-1 text-xs font-medium text-red-400 border border-red-500/20 rounded hover:bg-red-500/10 transition-colors">
            Execute
          </button>
        </div>
      </div>
    </div>
  );
}
