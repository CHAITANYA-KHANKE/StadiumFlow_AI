import React from 'react';
import { IncidentSeverity } from '@/types';
import { StatusBadge } from './StatusBadge';

interface AlertCardProps {
  title: string;
  description: string;
  severity: IncidentSeverity;
  timestamp?: string;
  zoneName?: string;
  onClick?: () => void;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({
  title,
  description,
  severity,
  timestamp,
  zoneName,
  onClick,
  className = ''
}) => {
  const borderColors = {
    LOW: 'border-l-slate-500 border-brand-border',
    MEDIUM: 'border-l-status-yellow border-brand-border',
    HIGH: 'border-l-status-orange border-brand-border',
    CRITICAL: 'border-l-status-red border-brand-border'
  };

  const isClickable = !!onClick;
  const borderClass = borderColors[severity] || 'border-l-brand-cyan border-brand-border';

  return (
    <div
      role="alert"
      onClick={onClick}
      className={`flex flex-col bg-brand-elevated border-l-4 p-4 rounded-r-lg shadow-md transition-all ${borderClass} ${
        isClickable ? 'cursor-pointer hover:bg-slate-200/80 dark:hover:bg-slate-800/80 active:scale-[0.99]' : ''
      } ${className}`}
    >
      <div className="flex justify-between items-start gap-2">
        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm leading-5">{title}</h3>
        <StatusBadge status={severity} />
      </div>
      
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">{description}</p>
      
      {(zoneName || timestamp) && (
        <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500 font-medium border-t border-brand-border/40 pt-2">
          {zoneName && (
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {zoneName}
            </span>
          )}
          {timestamp && (
            <span>
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
