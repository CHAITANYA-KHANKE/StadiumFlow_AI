'use client';

import React, { useSyncExternalStore } from 'react';
import { Navbar } from './Navbar';

interface ShellProps {
  children: React.ReactNode;
}

const emptySubscribe = () => () => {};

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-slate-600 dark:text-slate-400">
        <div className="flex flex-col items-center gap-4">
          <svg className="animate-spin h-8 w-8 text-brand-cyan" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-sm font-semibold tracking-wider uppercase">Loading StadiumFlow AI...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col text-foreground font-sans">
      <Navbar />
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      <footer className="bg-brand-dark border-t border-brand-border py-4 px-6 text-center text-xs text-slate-600 font-medium">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2">
          <span>StadiumFlow AI © 2026. Made for FIFA WC Smart Stadium Challenge.</span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-lime" />
            Ground Safety telemetry verified
          </span>
        </div>
      </footer>
    </div>
  );
};
