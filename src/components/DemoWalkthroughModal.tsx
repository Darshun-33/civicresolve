import React from 'react';
import { useComplaints } from '../context/ComplaintContext';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  X,
  CheckCircle2,
  ArrowRight,
  Database,
  Trash2,
  FileText,
  Search,
  ShieldCheck,
  UserCheck,
  Zap,
} from 'lucide-react';

export const DemoWalkthroughModal: React.FC = () => {
  const {
    isDemoWalkthroughOpen,
    setIsDemoWalkthroughOpen,
    loadDemo,
    clearDemo,
    setIsAdminMode,
    complaints,
  } = useComplaints();
  const navigate = useNavigate();

  if (!isDemoWalkthroughOpen) return null;

  const demoSteps = [
    {
      num: 1,
      title: 'Submit Grievance & Gemini AI Triage',
      desc: 'Fill out an issue or use prefilled prompts. Watch the real-time AI scanning animation extract category, priority, department, and confidence.',
      actionLabel: 'Open Report Form',
      action: () => {
        setIsDemoWalkthroughOpen(false);
        navigate('/report');
      },
      icon: FileText,
    },
    {
      num: 2,
      title: 'Intelligent Duplicate Detection',
      desc: 'Type a pothole in "Anna Nagar". The platform instantly flags matching existing complaints nearby and gives citizens the choice to corroborate (+1) or file separately.',
      actionLabel: 'Test Duplicate Detection',
      action: () => {
        setIsDemoWalkthroughOpen(false);
        navigate('/report?demoDuplicate=true');
      },
      icon: Zap,
    },
    {
      num: 3,
      title: 'Admin Command Center & Status Lifecycle',
      desc: 'Switch to Admin Demo. Inspect the complaint dossier, review AI urgency reasoning, and advance status from Reported → In Progress → Resolved with official notes.',
      actionLabel: 'Open Admin Triage',
      action: () => {
        setIsAdminMode(true);
        setIsDemoWalkthroughOpen(false);
        navigate('/admin');
      },
      icon: ShieldCheck,
    },
    {
      num: 4,
      title: 'Citizen-Verified Resolution Loop',
      desc: 'Track a resolved complaint (e.g. CR-2026-1045). Test the citizen verification prompt: confirm the fix on-site or dispute it if still persisting.',
      actionLabel: 'Track Sample Complaint',
      action: () => {
        setIsDemoWalkthroughOpen(false);
        navigate('/track?id=CR-2026-1045');
      },
      icon: UserCheck,
    },
  ];

  const demoCount = complaints.filter((c) => c.isDemo).length;
  const userCount = complaints.filter((c) => !c.isDemo).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl liquid-glass-elevated rounded-3xl p-6 sm:p-8 border border-white/20 shadow-card-layered max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orchid to-orchid-electric p-0.5 flex items-center justify-center shadow-orchid-glow">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-white flex items-center gap-2">
                <span>Hackathon Presentation Guide</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orchid/30 text-lilac font-mono">
                  Live Evaluation
                </span>
              </h3>
              <p className="text-xs text-lavender/80">
                Interactive walkthrough demonstrating all core and differentiating features.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsDemoWalkthroughOpen(false)}
            className="p-2 rounded-xl text-lavender hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Data Controls */}
        <div className="liquid-glass p-4 rounded-2xl mb-6 flex flex-wrap items-center justify-between gap-3 border border-white/10">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-pearl">
              <Database className="w-4 h-4 text-orchid-electric" />
              <span>Demonstration Dataset Manager</span>
            </div>
            <p className="text-xs text-lavender/80">
              Active: <strong>{demoCount}</strong> demo records, <strong>{userCount}</strong> user submissions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                loadDemo();
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold btn-liquid-primary flex items-center gap-1.5"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Load 4 Realistic Demo Records</span>
            </button>
            <button
              onClick={() => {
                clearDemo();
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold btn-liquid-secondary text-amber-200 hover:text-white flex items-center gap-1.5"
              title="Clears only demo records; preserves user submissions."
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Demo Records</span>
            </button>
          </div>
        </div>

        {/* 4 Interactive Walkthrough Steps */}
        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-lilac/70">
            Guided 4-Step Judging Flow
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoSteps.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.num}
                  className="liquid-glass-card p-4 rounded-2xl border border-white/10 flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-orchid/20 border border-orchid/30 text-orchid-electric flex items-center justify-center font-bold text-xs">
                        {step.num}
                      </div>
                      <h5 className="font-semibold text-sm text-pearl leading-snug">
                        {step.title}
                      </h5>
                    </div>
                    <p className="text-xs text-lilac/80 leading-relaxed">{step.desc}</p>
                  </div>

                  <button
                    onClick={step.action}
                    className="w-full mt-2 py-2 px-3 rounded-xl text-xs font-medium btn-liquid-secondary hover:border-orchid/40 flex items-center justify-center gap-1.5 transition-all text-pearl hover:text-orchid-electric"
                  >
                    <span>{step.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-lavender/60">
          <span>Google Gemini API + Express + React + Tailwind + Persistent Cross-Device Storage</span>
          <button
            onClick={() => setIsDemoWalkthroughOpen(false)}
            className="text-pearl hover:underline font-medium"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

