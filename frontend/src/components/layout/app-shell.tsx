'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './sidebar';
import { Topbar } from './topbar';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('lightpanel-sidebar-collapsed');
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  const handleToggle = () => {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    localStorage.setItem('lightpanel-sidebar-collapsed', JSON.stringify(next));
  };

  // Compute margin based on screen size and collapsed state
  const getMarginLeft = () => {
    if (!mounted) return '0px';
    if (typeof window === 'undefined') return '0px';
    if (window.innerWidth < 1024) return '0px';
    return sidebarCollapsed ? '72px' : '260px';
  };

  const [marginLeft, setMarginLeft] = useState('0px');

  useEffect(() => {
    const update = () => setMarginLeft(getMarginLeft());
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [mounted, sidebarCollapsed]);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={handleToggle}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div
        className="transition-all duration-300 ease-in-out min-h-screen flex flex-col"
        style={{ marginLeft }}
      >
        <Topbar
          onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
          sidebarCollapsed={sidebarCollapsed}
        />

        <main className="flex-1 p-4 lg:p-6 page-enter">
          {children}
        </main>
      </div>
    </div>
  );
}
