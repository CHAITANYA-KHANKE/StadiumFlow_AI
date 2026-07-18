import React from 'react';
import { CongestionLevel } from '@/types';

interface StatusBadgeProps {
  status: CongestionLevel | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const configs = {
    // Congestion Levels
    GREEN: { bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', text: 'Low Traffic' },
    YELLOW: { bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', text: 'Moderate Traffic' },
    ORANGE: { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', text: 'Heavy Traffic' },
    RED: { bg: 'bg-red-500/10 text-red-400 border-red-500/20', text: 'Critical / Delayed' },
    
    // Severity Levels
    LOW: { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20', text: 'Low Severity' },
    MEDIUM: { bg: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20', text: 'Medium Severity' },
    HIGH: { bg: 'bg-orange-500/10 text-orange-400 border-orange-500/20', text: 'High Severity' },
    CRITICAL: { bg: 'bg-red-500/10 text-red-400 border-red-500/20', text: 'Critical Priority' }
  };

  const current = configs[status] || { bg: 'bg-slate-500/10 text-slate-400 border-slate-500/20', text: status };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border ${current.bg} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current" aria-hidden="true" />
      <span>{current.text}</span>
    </span>
  );
};
