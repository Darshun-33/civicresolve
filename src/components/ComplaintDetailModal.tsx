import React, { useState } from 'react';
import { Complaint, ComplaintStatus } from '../types/complaint';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { Timeline } from './Timeline';
import { useComplaints } from '../context/ComplaintContext';
import {
  X,
  MapPin,
  Building,
  Calendar,
  Sparkles,
  CheckCircle2,
  Clock,
  ShieldAlert,
  AlertTriangle,
  Send,
  Users,
  Image as ImageIcon
} from 'lucide-react';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
}) => {
  const { updateStatus, isAdminMode } = useComplaints();
  const [adminStatus, setAdminStatus] = useState<ComplaintStatus | ''>('');
  const [adminNote, setAdminNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  if (!complaint) return null;

  const handleStatusUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminStatus) return;

    setIsUpdating(true);
    updateStatus(
      complaint.id,
      adminStatus,
      adminNote || `Status updated to ${adminStatus} via Administrative Center.`,
      'Admin Triage Officer'
    );
    setIsUpdating(false);
    setUpdateSuccess(true);
    setAdminNote('');
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl liquid-glass-elevated rounded-3xl p-6 sm:p-8 border border-white/20 shadow-card-layered max-h-[92vh] overflow-y-auto">
        {/* Top Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-4 mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-orchid-electric bg-orchid/20 border border-orchid/40 px-2.5 py-0.5 rounded-lg">
                {complaint.id}
              </span>
              <PriorityBadge priority={complaint.priority} size="md" />
              <StatusBadge status={complaint.status} size="md" />
              {complaint.isDemo && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-lavender">
                  Demo Record
                </span>
              )}
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-white pt-2">
              {complaint.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-lavender hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Complaint Details & Image & AI Triage */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="liquid-glass p-5 rounded-2xl border border-white/10 space-y-3">
              <h4 className="text-xs uppercase tracking-wider text-lilac font-semibold">
                Citizen Grievance Description
              </h4>
              <p className="text-sm text-pearl leading-relaxed whitespace-pre-line">
                {complaint.description}
              </p>

              {/* Meta pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                <div className="flex items-center gap-2 text-lavender">
                  <MapPin className="w-4 h-4 text-orchid shrink-0" />
                  <span className="text-pearl font-medium">{complaint.location}</span>
                </div>
                <div className="flex items-center gap-2 text-lavender">
                  <Building className="w-4 h-4 text-orchid shrink-0" />
                  <span className="text-pearl font-medium">{complaint.department}</span>
                </div>
                <div className="flex items-center gap-2 text-lavender">
                  <Calendar className="w-4 h-4 text-orchid shrink-0" />
                  <span>
                    Reported on{' '}
                    {new Date(complaint.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {complaint.corroborationCount > 0 && (
                  <div className="flex items-center gap-2 text-orchid-electric font-semibold">
                    <Users className="w-4 h-4 shrink-0" />
                    <span>+{complaint.corroborationCount} Citizens Corroborated</span>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Evidence Image */}
            {complaint.imageDataUrl && (
              <div className="liquid-glass p-4 rounded-2xl border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-lilac">
                  <ImageIcon className="w-4 h-4 text-orchid-electric" />
                  <span>Citizen Photographic Evidence</span>
                </div>
                <div className="relative rounded-xl overflow-hidden max-h-72 border border-white/15 bg-black/40 flex items-center justify-center">
                  <img
                    src={complaint.imageDataUrl}
                    alt="Evidence photograph"
                    className="max-h-72 w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* AI Intelligence Dossier Card */}
            <div className="liquid-glass p-5 rounded-2xl border border-orchid/30 relative overflow-hidden bg-gradient-to-br from-plum/60 via-mauve/40 to-orchid/10">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-orchid/20 border border-orchid/40 text-orchid-electric flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-pearl">
                      Gemini Multimodal AI Analysis
                    </h4>
                    <p className="text-[11px] text-lavender">
                      Automated civic triage & risk classification
                    </p>
                  </div>
                </div>
                <span
                  className={`text-[11px] font-mono font-semibold px-2.5 py-1 rounded-full border ${
                    complaint.analysisSource === 'Gemini'
                      ? 'bg-orchid/20 border-orchid/40 text-orchid-electric'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                  }`}
                >
                  Source: {complaint.analysisSource}
                </span>
              </div>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-lilac/70 font-medium">Executive AI Summary:</span>
                  <p className="text-pearl mt-0.5 leading-relaxed font-medium">
                    {complaint.aiSummary}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
                  <div>
                    <span className="text-lilac/70">Urgency Assessment:</span>
                    <p className="text-pearl font-semibold mt-0.5">
                      {complaint.priority} Priority
                    </p>
                  </div>
                  <div>
                    <span className="text-lilac/70">AI Confidence:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orchid to-orchid-electric rounded-full"
                          style={{ width: `${complaint.confidence}%` }}
                        />
                      </div>
                      <span className="text-pearl font-mono font-bold">
                        {complaint.confidence}%
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-lilac/70">Risk Rationale:</span>
                  <p className="text-pearl/90 mt-0.5 leading-relaxed">
                    {complaint.urgencyReason}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/10">
                  <span className="text-lilac/70">Recommended Operational Step:</span>
                  <p className="text-orchid-electric font-medium mt-0.5 leading-relaxed">
                    → {complaint.suggestedAction}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Timeline & Admin Status Transition */}
          <div className="space-y-6">
            {/* Admin Status Management Box */}
            {isAdminMode && (
              <div className="liquid-glass p-5 rounded-2xl border border-amber-500/30 bg-amber-950/20 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Status Control</span>
                </div>
                <p className="text-xs text-lavender">
                  Advance the grievance along municipal resolution stages.
                </p>

                <form onSubmit={handleStatusUpdate} className="space-y-3 pt-1">
                  <div>
                    <label className="block text-[11px] text-lilac font-medium mb-1">
                      New Status Target:
                    </label>
                    <select
                      value={adminStatus || complaint.status}
                      onChange={(e) => setAdminStatus(e.target.value as ComplaintStatus)}
                      className="w-full liquid-glass-input rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="Reported">Reported</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-lilac font-medium mb-1">
                      Action Note / Field Update:
                    </label>
                    <textarea
                      value={adminNote}
                      onChange={(e) => setAdminNote(e.target.value)}
                      placeholder="e.g., Road repair team dispatched; pothole patched with hot-mix asphalt."
                      rows={2}
                      className="w-full liquid-glass-input rounded-xl p-2.5 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full py-2 px-3 rounded-xl text-xs font-semibold btn-liquid-primary flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Commit Status Change</span>
                  </button>

                  {updateSuccess && (
                    <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-xs text-center border border-emerald-500/30">
                      ✓ Status successfully updated!
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Timeline Component */}
            <Timeline complaint={complaint} />
          </div>
        </div>
      </div>
    </div>
  );
};

