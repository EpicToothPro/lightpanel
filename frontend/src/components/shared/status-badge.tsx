'use client';

import React from 'react';
import { getStatusBgColor } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  className?: string;
  dot?: boolean;
}

export function StatusBadge({ status, className = '', dot = true }: StatusBadgeProps) {
  const colorClasses = getStatusBgColor(status);
  const label = status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${colorClasses} ${className}`}
      role="status"
      aria-label={`Status: ${label}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full bg-current ${
          ['running', 'active', 'deploying', 'building', 'starting', 'in_progress'].includes(status) ? 'pulse-dot' : ''
        }`} />
      )}
      {label}
    </span>
  );
}
