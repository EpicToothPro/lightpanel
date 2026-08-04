'use client';

import React from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
  loading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  const variantStyles = {
    danger: {
      icon: 'text-red-400 bg-red-500/10',
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    warning: {
      icon: 'text-amber-400 bg-amber-500/10',
      button: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-[#12121a] border border-[#1e293b] rounded-xl shadow-2xl max-w-md w-full p-6 animate-in">
        <div className="flex items-start gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/><path d="M12 17h.01"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 id="confirm-title" className="text-base font-semibold text-slate-200">{title}</h3>
            <p className="text-sm text-slate-400 mt-1.5">{description}</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-slate-200 bg-white/[0.04] border border-[#1e293b] rounded-lg hover:border-[#334155] transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ${styles.button}`}
          >
            {loading && (
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            )}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
