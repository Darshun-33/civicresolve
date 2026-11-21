import React from 'react';
import { Complaint } from '../types/complaint';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { MapPin, Building, Calendar, Users, CheckCircle2, AlertOctagon, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ComplaintCardProps {
  complaint: Complaint;
  onOpenDetails?: (complaint: Complaint) => void;
}

export const ComplaintCard: React.FC<ComplaintCardProps> = ({
  complaint,
  onOpenDetails,
}) => {
  return (
    <div className="liquid-glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between transition-all duration-200">
      <div>
        {/* Top Meta Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-orchid-electric bg-orchid/15 border border-orchid/30 px-2 py-0.5 rounded-lg">
              {complaint.id}
            </span>
            {complaint.isDemo && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-lavender">
                Demo
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <PriorityBadge priority={complaint.priority} size="sm" />
            <StatusBadge status={complaint.status} size="sm" />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-base text-pearl group-hover:text-white transition-colors line-clamp-2 leading-snug mb-2">
          {complaint.title}
        </h3>

        {/* Description snippet */}
        <p className="text-xs text-lilac/80 line-clamp-2 leading-relaxed mb-4">
          {complaint.description}
        </p>

        {/* Location & Department */}
        <div className="space-y-1.5 text-xs text-lavender/90 mb-4 pt-3 border-t border-white/10">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-orchid shrink-0" />
            <span className="truncate">{complaint.location}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Building className="w-3.5 h-3.5 text-orchid shrink-0" />
            <span className="truncate">{complaint.department}</span>
          </div>
        </div>
      </div>

      {/* Footer Details */}
      <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-lavender/70">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 text-lavender/60" />
            {new Date(complaint.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
          {complaint.corroborationCount > 0 && (
            <span className="flex items-center gap-0.5 text-orchid-electric font-medium">
              <Users className="w-3 h-3" />
              +{complaint.corroborationCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onOpenDetails && (
            <button
              onClick={() => onOpenDetails(complaint)}
              className="text-xs text-pearl hover:text-orchid-electric font-semibold transition-colors"
            >
              Details
            </button>
          )}
          <Link
            to={`/track?id=${complaint.id}`}
            className="text-xs text-orchid-electric hover:text-white font-semibold flex items-center gap-0.5 transition-colors"
          >
            <span>Track</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
};

