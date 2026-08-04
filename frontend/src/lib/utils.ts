import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateStr);
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins < 60) return `${mins}m ${secs}s`;
  const hours = Math.floor(mins / 60);
  const remainMins = mins % 60;
  return `${hours}h ${remainMins}m`;
}

export function formatUptime(uptimeStr: string): string {
  return uptimeStr;
}

export function generatePassword(length: number = 24): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let result = '';
  const array = new Uint32Array(length);
  crypto.getRandomValues(array);
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function getRuntimeColor(runtime: string): string {
  const colors: Record<string, string> = {
    nodejs: '#339933',
    nextjs: '#000000',
    php: '#777BB4',
    python: '#3776AB',
    ruby: '#CC342D',
    java: '#ED8B00',
    kotlin: '#7F52FF',
    swift: '#F05138',
    dotnet: '#512BD4',
    perl: '#39457E',
    static: '#64748b',
    html: '#E34F26',
    typescript: '#3178C6',
  };
  return colors[runtime] || '#64748b';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    running: 'text-emerald-400',
    active: 'text-emerald-400',
    success: 'text-emerald-400',
    completed: 'text-emerald-400',
    valid: 'text-emerald-400',
    propagated: 'text-emerald-400',
    stopped: 'text-slate-400',
    paused: 'text-slate-400',
    pending: 'text-amber-400',
    deploying: 'text-blue-400',
    building: 'text-blue-400',
    starting: 'text-blue-400',
    restarting: 'text-blue-400',
    in_progress: 'text-blue-400',
    queued: 'text-slate-400',
    expiring: 'text-amber-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
    failed: 'text-red-400',
    expired: 'text-red-400',
    cancelled: 'text-slate-400',
    revoked: 'text-red-400',
    maintenance: 'text-amber-400',
    none: 'text-slate-500',
  };
  return colors[status] || 'text-slate-400';
}

export function getStatusBgColor(status: string): string {
  const colors: Record<string, string> = {
    running: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    active: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    success: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    completed: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    valid: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    propagated: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
    stopped: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
    paused: 'bg-slate-400/10 text-slate-400 border-slate-400/20',
    pending: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    deploying: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    building: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    starting: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    in_progress: 'bg-blue-400/10 text-blue-400 border-blue-400/20',
    expiring: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    error: 'bg-red-400/10 text-red-400 border-red-400/20',
    failed: 'bg-red-400/10 text-red-400 border-red-400/20',
    expired: 'bg-red-400/10 text-red-400 border-red-400/20',
    revoked: 'bg-red-400/10 text-red-400 border-red-400/20',
    maintenance: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
    none: 'bg-slate-400/10 text-slate-500 border-slate-400/20',
  };
  return colors[status] || 'bg-slate-400/10 text-slate-400 border-slate-400/20';
}

export function getDatabaseIcon(type: string): string {
  const icons: Record<string, string> = {
    postgresql: '🐘',
    mysql: '🐬',
    mariadb: '🔷',
    mongodb: '🍃',
    redis: '⚡',
  };
  return icons[type] || '🗃️';
}
