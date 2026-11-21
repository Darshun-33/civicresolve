import React from 'react';
import { Complaint, ComplaintStatus } from '../types/complaint';
import { CheckCircle2, Clock, Loader2, UserCheck, AlertOctagon, Sparkles } from 'lucide-react';
import { StatusBadge } from './StatusBadge';

interface TimelineProps {
  complaint: Complaint;
}

export const Timeline: React.FC<TimelineProps> = ({ complaint }) => {
  const steps: ComplaintStatus[] = ['Reported', 'In Progress', 'Resolved'];

  const getStepIndex = (status: ComplaintStatus) => {
    switch (status) {
      case 'Reported':
        return 0;
      case 'In Progress':
        return 1;
      case 'Resolved':
        return 2;
      default:
        return 0;
    }
  };

  const currentStep = getStepIndex(complaint.status);

  return (
    <div className="space-y-6">
      {/* Visual Stepper Bar */}
      <div className="liquid-glass p-5 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between relative z-10">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep || complaint.status === 'Resolved';
            const isCurrent = idx === currentStep && complaint.status !== 'Resolved';
            const isPending = idx > currentStep;

            return (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
                      isCompleted
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                        : isCurrent
                        ? 'bg-orchid/25 border-orchid-electric text-white shadow-[0_0_18px_rgba(230,91,214,0.45)] ring-2 ring-orchid-electric/40'
                        : 'bg-mauve-dark/50 border-white/10 text-lavender'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 animate-spin text-orchid-electric" />
                    ) : (
                      <span className="text-sm font-semibold">{idx + 1}</span>
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium tracking-wide ${
                      isCurrent
                        ? 'text-pearl font-bold'
                        : isCompleted
                        ? 'text-emerald-300'
                        : 'text-lavender/60'
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div className="flex-1 mx-2 sm:mx-4 h-1 bg-white/10 rounded relative overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        idx < currentStep
                          ? 'bg-gradient-to-r from-emerald-400 to-orchid-electric w-full'
                          : 'w-0'
                      }`}
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* Citizen Verification Banner if Resolved */}
        {complaint.citizenVerification && (
          <div
            className={`mt-4 pt-3 border-t border-white/10 flex items-center gap-2.5 text-xs ${
              complaint.citizenVerification.status === 'verified'
                ? 'text-emerald-300'
                : 'text-amber-300'
            }`}
          >
            {complaint.citizenVerification.status === 'verified' ? (
              <>
                <UserCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  <strong>Citizen-Verified Resolution:</strong> Confirmed on-site by resident at{' '}
                  {new Date(complaint.citizenVerification.timestamp).toLocaleString()}
                </span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  <strong>Citizen Disputed Resolution:</strong> Resident reported issue is still persisting:{' '}
                  <em>"{complaint.citizenVerification.feedback || 'Persisting on-site'}"</em>
                </span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Timestamped Log Entries */}
      <div className="space-y-3">
        <h4 className="text-xs uppercase tracking-wider text-lilac/70 font-semibold flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          <span>Operational Audit History ({complaint.timeline.length} Events)</span>
        </h4>

        <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
          {complaint.timeline.map((event, index) => (
            <div key={event.id || index} className="relative group">
              {/* Timeline marker */}
              <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-plum-dark border-2 border-orchid shadow-[0_0_8px_rgba(173,66,184,0.6)] group-hover:scale-125 transition-transform" />

              <div className="liquid-glass p-3.5 rounded-xl border border-white/10 hover:border-orchid/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={event.status} size="sm" showIcon={false} />
                    <span className="text-xs font-semibold text-pearl">
                      {event.actor}
                    </span>
                  </div>
                  <span className="text-[11px] text-lavender/70 font-mono">
                    {new Date(event.timestamp).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="text-xs text-lilac/90 leading-relaxed">{event.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

