'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { mockNotifications } from '@/lib/mock-data';

const pathLabels: Record<string, string> = {
  '/': 'Overview',
  '/applications': 'Applications',
  '/websites': 'Websites',
  '/domains': 'Domains',
  '/subdomains': 'Subdomains',
  '/databases': 'Databases',
  '/ssl': 'SSL Certificates',
  '/files': 'File Manager',
  '/deployments': 'Deployments',
  '/backups': 'Backups',
  '/cron-jobs': 'Cron Jobs',
  '/env-variables': 'Environment Variables',
  '/logs': 'Logs',
  '/monitoring': 'Monitoring',
  '/server-settings': 'Server Settings',
  '/users': 'Users & Access',
  '/audit-log': 'Audit Log',
  '/settings': 'Settings',
};

interface TopbarProps {
  onMobileMenuToggle: () => void;
  sidebarCollapsed: boolean;
}

export function Topbar({ onMobileMenuToggle, sidebarCollapsed }: TopbarProps) {
  const pathname = usePathname();
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = mockNotifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Build breadcrumbs
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...segments.map((seg, i) => ({
      label: pathLabels['/' + segments.slice(0, i + 1).join('/')] || seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '),
      href: '/' + segments.slice(0, i + 1).join('/'),
    })),
  ];

  const getNotifColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-emerald-400';
      case 'warning': return 'text-amber-400';
      case 'error': return 'text-red-400';
      default: return 'text-blue-400';
    }
  };

  const getNotifDot = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-400';
      case 'warning': return 'bg-amber-400';
      case 'error': return 'bg-red-400';
      default: return 'bg-blue-400';
    }
  };

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-[#1e293b] flex items-center justify-between px-4 lg:px-6">
      {/* Left section */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
          aria-label="Toggle menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>
          </svg>
        </button>

        {/* Breadcrumbs */}
        <nav className="hidden sm:flex items-center gap-1.5 text-sm min-w-0" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={crumb.href}>
              {i > 0 && (
                <svg className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              )}
              {i === breadcrumbs.length - 1 ? (
                <span className="text-slate-200 font-medium truncate">{crumb.label}</span>
              ) : (
                <Link href={crumb.href} className="text-slate-500 hover:text-slate-300 transition-colors truncate">
                  {crumb.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        {/* Search */}
        <button
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-slate-500 hover:text-slate-300 bg-white/[0.03] border border-[#1e293b] hover:border-[#334155] transition-all"
          aria-label="Search"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
          </svg>
          <span className="hidden md:inline">Search...</span>
          <kbd className="hidden md:inline text-[10px] text-slate-600 bg-white/[0.06] px-1.5 py-0.5 rounded border border-[#1e293b]">⌘K</kbd>
        </button>

        {/* Server status */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-slate-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="font-mono">vps-prod-01</span>
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] transition-colors"
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={notifOpen}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center text-[10px] font-bold text-white bg-red-500 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-[#12121a] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden">
              <div className="p-3 border-b border-[#1e293b] flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-200">Notifications</h3>
                <span className="text-xs text-slate-500">{unreadCount} unread</span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-[#1e293b]">
                {mockNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 hover:bg-white/[0.02] transition-colors cursor-pointer ${!notif.read ? 'bg-white/[0.01]' : ''}`}
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getNotifDot(notif.type)}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-medium ${notif.read ? 'text-slate-400' : 'text-slate-200'}`}>
                          {notif.title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-[#1e293b]">
                <button className="w-full text-center text-xs text-indigo-400 hover:text-indigo-300 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/[0.06] transition-colors"
            aria-label="User menu"
            aria-expanded={userMenuOpen}
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              A
            </div>
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-[#12121a] border border-[#1e293b] rounded-xl shadow-2xl overflow-hidden">
              <div className="p-3 border-b border-[#1e293b]">
                <p className="text-sm font-medium text-slate-200">admin</p>
                <p className="text-xs text-slate-500">admin@lightpanel.dev</p>
              </div>
              <div className="p-1">
                <Link href="/settings" className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-slate-200 rounded-lg hover:bg-white/[0.04] transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
                  Settings
                </Link>
                <button className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 transition-colors w-full">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
