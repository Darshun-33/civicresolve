import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useLanguage } from '../context/LanguageContext';
import { StatusBadge } from '../components/StatusBadge';
import { PriorityBadge } from '../components/PriorityBadge';
import { Timeline } from '../components/Timeline';
import {
  Search,
  MapPin,
  Building,
  Calendar,
  Sparkles,
  CheckCircle2,
  AlertOctagon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Send,
  Users,
  Image as ImageIcon,
  HelpCircle,
  Check
} from 'lucide-react';

export const TrackComplaint: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { complaints, verifyResolution, supportComplaint } = useComplaints();
  const { t } = useLanguage();

  const [searchId, setSearchId] = useState('');
  const [activeComplaintId, setActiveComplaintId] = useState<string | null>(null);

  // Dispute feedback form state
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [disputeFeedback, setDisputeFeedback] = useState('');
  const [verifySuccessMsg, setVerifySuccessMsg] = useState<string | null>(null);

  // Sync with searchParams on mount or query change
  useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      setSearchId(idParam);
      setActiveComplaintId(idParam.trim().toUpperCase());
    } else if (complaints.length > 0 && !activeComplaintId) {
      // Default to the first complaint for instant demo readiness
      setActiveComplaintId(complaints[0].id);
      setSearchId(complaints[0].id);
    }
  }, [searchParams, complaints]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    const normalized = searchId.trim().toUpperCase();
    setActiveComplaintId(normalized);
    setSearchParams({ id: normalized });
    setShowDisputeForm(false);
  };

  const currentComplaint = complaints.find(
    (c) => c.id.toUpperCase() === (activeComplaintId || '').toUpperCase()
  );

  const handleVerifyYes = () => {
    if (!currentComplaint) return;
    verifyResolution(currentComplaint.id, {
      status: 'verified',
      timestamp: new Date().toISOString(),
    });
    setVerifySuccessMsg('Thank you! Your on-site resolution certification has been recorded.');
    setTimeout(() => setVerifySuccessMsg(null), 4000);
  };

  const handleVerifyDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentComplaint) return;
    verifyResolution(currentComplaint.id, {
      status: 'disputed',
      timestamp: new Date().toISOString(),
      feedback: disputeFeedback.trim() || 'Citizen reported the issue remains unresolved on-site.',
    });
    setShowDisputeForm(false);
    setDisputeFeedback('');
    setVerifySuccessMsg('Your dispute report has been registered and flagged for administrative re-inspection.');
    setTimeout(() => setVerifySuccessMsg(null), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Search Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 text-xs font-semibold text-orchid-electric uppercase tracking-wider">
          <Search className="w-4 h-4" />
          <span>Grievance Audit & Tracking</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-white">
          {t.track.title}
        </h1>
        <p className="text-sm text-lilac/80 max-w-lg mx-auto">
          {t.track.subtitle}
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto pt-3">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder={t.track.searchPlaceholder}
              className="w-full liquid-glass-input rounded-2xl pl-11 pr-28 py-3 text-sm placeholder:text-lavender/50 font-mono uppercase"
            />
            <Search className="w-4 h-4 text-orchid absolute left-4" />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-2 rounded-xl btn-liquid-primary text-xs font-semibold"
            >
              {t.track.searchBtn}
            </button>
          </div>
        </form>

        {/* Quick Demo ID pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-lavender/70">
          <span>Quick Samples:</span>
          {complaints.slice(0, 4).map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setSearchId(c.id);
                setActiveComplaintId(c.id);
                setSearchParams({ id: c.id });
              }}
              className={`px-2.5 py-0.5 rounded-lg font-mono text-[11px] border transition-colors ${
                currentComplaint?.id === c.id
                  ? 'bg-orchid/20 border-orchid text-white'
                  : 'bg-white/5 border-white/10 hover:border-orchid/40 text-lavender'
              }`}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* RESULT SECTION */}
      {currentComplaint ? (
        <div className="space-y-6 animate-fade-in">
          {/* Main Complaint Overview Card */}
          <div className="liquid-glass-elevated rounded-3xl p-6 sm:p-8 border border-white/20 shadow-card-layered space-y-6">
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-sm font-extrabold text-orchid-electric bg-orchid/20 border border-orchid/40 px-3 py-1 rounded-xl">
                  {currentComplaint.id}
                </span>
                <PriorityBadge priority={currentComplaint.priority} size="md" />
                <StatusBadge status={currentComplaint.status} size="md" />
                {currentComplaint.isDemo && (
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-lavender">
                    Demo
                  </span>
                )}
              </div>

              <div className="text-xs text-lavender flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  Filed{' '}
                  {new Date(currentComplaint.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Title & Description */}
            <div className="space-y-2">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-white">
                {currentComplaint.title}
              </h2>
              <p className="text-sm text-lilac/90 leading-relaxed whitespace-pre-line">
                {currentComplaint.description}
              </p>
            </div>

            {/* Meta Information Pills */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-white/10 text-xs">
              <div className="liquid-glass p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-lilac/70">Designated Department:</span>
                <p className="text-pearl font-semibold flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-orchid" />
                  <span className="truncate">{currentComplaint.department}</span>
                </p>
              </div>

              <div className="liquid-glass p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-lilac/70">Location / Landmark:</span>
                <p className="text-pearl font-semibold flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-orchid" />
                  <span className="truncate">{currentComplaint.location}</span>
                </p>
              </div>

              <div className="liquid-glass p-3 rounded-xl border border-white/10 space-y-1">
                <span className="text-lilac/70">Community Corroboration:</span>
                <p className="text-orchid-electric font-semibold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>+{currentComplaint.corroborationCount} Citizens Supported</span>
                </p>
              </div>
            </div>

            {/* Photographic Evidence if attached */}
            {currentComplaint.imageDataUrl && (
              <div className="pt-2">
                <span className="block text-xs font-semibold text-lilac mb-2 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-orchid-electric" />
                  <span>Citizen Evidence Photograph</span>
                </span>
                <div className="rounded-2xl overflow-hidden max-h-64 border border-white/15 bg-black/40 flex items-center justify-center">
                  <img
                    src={currentComplaint.imageDataUrl}
                    alt="Complaint evidence"
                    className="max-h-64 w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* AI Assessment Box */}
            <div className="liquid-glass p-4 rounded-2xl border border-orchid/30 space-y-2 bg-gradient-to-r from-plum/60 via-orchid/10 to-plum/60">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-pearl font-semibold">
                  <Sparkles className="w-4 h-4 text-orchid-electric" />
                  <span>Gemini AI Triage Assessment</span>
                </div>
                <span className="text-[11px] font-mono text-orchid-electric">
                  Confidence: {currentComplaint.confidence}%
                </span>
              </div>
              <p className="text-xs text-lilac leading-relaxed">
                {currentComplaint.aiSummary}
              </p>
              <p className="text-[11px] text-lavender/80 italic">
                Reasoning: {currentComplaint.urgencyReason}
              </p>
            </div>
          </div>

          {/* CITIZEN-VERIFIED RESOLUTION SECTION (Shown when status is Resolved) */}
          {currentComplaint.status === 'Resolved' && (
            <div className="liquid-glass-elevated rounded-3xl p-6 sm:p-8 border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-plum/60 to-emerald-950/20 shadow-[0_0_25px_rgba(16,185,129,0.2)] space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-white">
                      {t.track.citizenVerificationTitle}
                    </h3>
                    <p className="text-xs text-lilac/80">
                      {t.track.citizenVerificationDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Success Notification message */}
              {verifySuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-medium">
                  {verifySuccessMsg}
                </div>
              )}

              {/* Current Verification State */}
              {currentComplaint.citizenVerification ? (
                <div className="liquid-glass p-4 rounded-2xl border border-white/10 flex items-center gap-3">
                  {currentComplaint.citizenVerification.status === 'verified' ? (
                    <div className="flex items-center gap-2.5 text-emerald-300 text-sm font-semibold">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>{t.track.verifiedBadge}</span>
                      <span className="text-xs font-normal text-lavender ml-2 font-mono">
                        (Certified on{' '}
                        {new Date(
                          currentComplaint.citizenVerification.timestamp
                        ).toLocaleString()}
                        )
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 text-amber-300 text-sm font-semibold">
                      <AlertOctagon className="w-5 h-5 text-amber-400" />
                      <span>{t.track.disputedBadge}</span>
                      <span className="text-xs font-normal text-lavender ml-2">
                        Feedback: "{currentComplaint.citizenVerification.feedback}"
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                /* Unverified Prompt Buttons */
                <div className="space-y-4 pt-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      onClick={handleVerifyYes}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all"
                    >
                      <Check className="w-4 h-4" />
                      <span>{t.track.btnYesResolved}</span>
                    </button>

                    <button
                      onClick={() => setShowDisputeForm(!showDisputeForm)}
                      className="px-5 py-2.5 rounded-xl bg-amber-600/80 hover:bg-amber-600 text-white font-semibold text-xs flex items-center gap-2 transition-all"
                    >
                      <AlertOctagon className="w-4 h-4" />
                      <span>{t.track.btnNoDisputed}</span>
                    </button>
                  </div>

                  {/* Disputed feedback mini-form */}
                  {showDisputeForm && (
                    <form onSubmit={handleVerifyDispute} className="space-y-3 pt-2">
                      <label className="block text-xs text-lilac font-medium">
                        What problem is still lingering on-site?
                      </label>
                      <textarea
                        value={disputeFeedback}
                        onChange={(e) => setDisputeFeedback(e.target.value)}
                        placeholder={t.track.disputeFeedbackPlaceholder}
                        rows={2}
                        className="w-full liquid-glass-input rounded-xl p-3 text-xs"
                        required
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl btn-liquid-primary text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{t.track.submitFeedback}</span>
                      </button>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Timeline and History Component */}
          <div className="liquid-glass-elevated rounded-3xl p-6 sm:p-8 border border-white/15">
            <h3 className="font-display font-bold text-lg text-white mb-6">
              {t.track.timelineTitle}
            </h3>
            <Timeline complaint={currentComplaint} />
          </div>
        </div>
      ) : (
        /* Not Found Screen */
        <div className="liquid-glass-elevated rounded-3xl p-10 border border-white/15 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-lavender">
            <Search className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-xl text-white">
            {t.track.notFoundTitle}
          </h3>
          <p className="text-sm text-lilac/80 max-w-md mx-auto">
            {t.track.notFoundDesc}
          </p>
          <div className="pt-2">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl btn-liquid-primary font-semibold text-xs"
            >
              <span>{t.report.title}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

