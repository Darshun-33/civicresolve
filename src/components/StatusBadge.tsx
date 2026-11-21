import React from 'react';
import { ComplaintStatus } from '../types/complaint';
import { Clock, Loader2, CheckCircle2 } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplaintStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  const config = {
    Reported: {
      bg: 'bg-blue-500/15 border-blue-400/30 text-blue-200 shadow-[0_0_12px_rgba(59,130,246,0.2)]',
      icon: Clock,
      label: 'Reported',
    },
    'In Progress': {
      bg: 'bg-amber-500/15 border-amber-400/35 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
      icon: Loader2,
      label: 'In Progress',
      iconClass: 'animate-spin',
    },
    Resolved: {
      bg: 'bg-emerald-500/15 border-emerald-400/35 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.25)]',
      icon: CheckCircle2,
      label: 'Resolved',
    },
  }[status] || {
    bg: 'bg-gray-500/15 border-gray-400/30 text-gray-200',
    icon: Clock,
    label: status,
  };

  const IconComponent = config.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-md font-semibold tracking-wide ${sizeClasses[size]} ${config.bg}`}
    >
      {showIcon && (
        <IconComponent
          className={`w-3.5 h-3.5 ${('iconClass' in config && config.iconClass) || ''}`}
        />
      )}
      <span>{config.label}</span>
    </span>
  );
};

