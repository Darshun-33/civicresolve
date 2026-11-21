import React from 'react';
import { PriorityLevel } from '../types/complaint';
import { AlertTriangle, AlertCircle, Info, ShieldAlert } from 'lucide-react';

interface PriorityBadgeProps {
  priority: PriorityLevel;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  const config = {
    Critical: {
      bg: 'bg-red-500/20 border-red-500/40 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.35)]',
      icon: ShieldAlert,
      pulse: true,
    },
    High: {
      bg: 'bg-amber-500/20 border-amber-400/40 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      icon: AlertTriangle,
      pulse: false,
    },
    Medium: {
      bg: 'bg-orchid/20 border-orchid/35 text-lilac-soft shadow-[0_0_10px_rgba(173,66,184,0.2)]',
      icon: AlertCircle,
      pulse: false,
    },
    Low: {
      bg: 'bg-lavender/20 border-lavender/30 text-pearl/80',
      icon: Info,
      pulse: false,
    },
  }[priority] || {
    bg: 'bg-gray-500/20 border-gray-500/30 text-gray-200',
    icon: Info,
    pulse: false,
  };

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-md font-medium tracking-wide ${sizeClasses[size]} ${config.bg}`}
    >
      <IconComponent className="w-3.5 h-3.5" />
      <span>{priority}</span>
      {config.pulse && (
        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping ml-0.5" />
      )}
    </span>
  );
};

