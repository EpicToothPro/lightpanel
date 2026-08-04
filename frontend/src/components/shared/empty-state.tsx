'use client';

import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-[#1e293b] flex items-center justify-center mb-4 text-slate-500">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-slate-300 mb-1.5">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-4 px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
