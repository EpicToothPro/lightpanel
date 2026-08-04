'use client';

import React, { useState } from 'react';
import { copyToClipboard } from '@/lib/utils';

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export function CopyButton({ text, className = '', label }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium 
        transition-all duration-200
        ${copied 
          ? 'text-emerald-400 bg-emerald-400/10 border border-emerald-400/20' 
          : 'text-slate-400 hover:text-slate-200 bg-white/[0.04] border border-[#1e293b] hover:border-[#334155]'
        } ${className}`}
      aria-label={`Copy ${label || 'text'}`}
    >
      {copied ? (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
      )}
      {label && <span>{copied ? 'Copied!' : label}</span>}
      {!label && copied && <span>Copied!</span>}
    </button>
  );
}
