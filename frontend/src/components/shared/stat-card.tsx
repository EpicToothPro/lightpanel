'use client';

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  color?: 'indigo' | 'cyan' | 'emerald' | 'amber' | 'red' | 'purple';
  progress?: number;
}

const colorMap = {
  indigo: { ring: 'ring-indigo-500/20', icon: 'text-indigo-400 bg-indigo-500/10', bar: 'bg-indigo-500' },
  cyan: { ring: 'ring-cyan-500/20', icon: 'text-cyan-400 bg-cyan-500/10', bar: 'bg-cyan-500' },
  emerald: { ring: 'ring-emerald-500/20', icon: 'text-emerald-400 bg-emerald-500/10', bar: 'bg-emerald-500' },
  amber: { ring: 'ring-amber-500/20', icon: 'text-amber-400 bg-amber-500/10', bar: 'bg-amber-500' },
  red: { ring: 'ring-red-500/20', icon: 'text-red-400 bg-red-500/10', bar: 'bg-red-500' },
  purple: { ring: 'ring-purple-500/20', icon: 'text-purple-400 bg-purple-500/10', bar: 'bg-purple-500' },
};

export function StatCard({ title, value, subtitle, icon, trend, color = 'indigo', progress }: StatCardProps) {
  const colors = colorMap[color];

  return (
    <div className={`relative overflow-hidden rounded-xl border border-[#1e293b] bg-[#12121a] p-5 transition-all duration-200 hover:border-[#334155] hover:bg-[#13132a] group`}>
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
          <p className="text-2xl font-bold text-slate-100 tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${
              trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {trend.value >= 0 ? (
                  <path d="m18 15-6-6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
                ) : (
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                )}
              </svg>
              <span>{Math.abs(trend.value)}% {trend.label}</span>
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${colors.icon}`}>
          {icon}
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-3 relative">
          <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block text-right">{progress.toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}

// Skeleton loader
export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#1e293b] bg-[#12121a] p-5">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="skeleton h-4 w-24 mb-3" />
          <div className="skeleton h-7 w-20 mb-2" />
          <div className="skeleton h-3 w-32" />
        </div>
        <div className="skeleton w-10 h-10 rounded-lg" />
      </div>
      <div className="mt-3">
        <div className="skeleton h-1.5 w-full rounded-full" />
      </div>
    </div>
  );
}
