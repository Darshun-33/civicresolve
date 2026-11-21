import React from 'react';
import { Link } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  Activity,
  MapPin,
  Building,
  TrendingUp,
  Cpu,
  Eye,
  UserCheck
} from 'lucide-react';

export const Home: React.FC = () => {
  const { stats, complaints, setIsDemoWalkthroughOpen } = useComplaints();
  const { t } = useLanguage();

  return (
    <div className="space-y-24 py-6">
      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-8 pb-12 overflow-hidden">
        {/* Ambient radial glows */}
        <div className="ambient-glow-orchid absolute -top-20 -left-20 w-[550px] h-[550px] pointer-events-none opacity-80" />
        <div className="ambient-glow-electric absolute top-32 -right-24 w-[500px] h-[500px] pointer-events-none opacity-70" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Column: Hero Editorial Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full liquid-glass border border-orchid/30 text-xs font-semibold text-lilac shadow-[0_0_15px_rgba(173,66,184,0.25)]">
              <span className="w-2 h-2 rounded-full bg-orchid-electric animate-pulse" />
              <span>Next-Gen Civic Intelligence • Powered by Google Gemini AI</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
              {t.hero.headline}
            </h1>

            <p className="text-base sm:text-lg text-lilac/85 max-w-2xl leading-relaxed">
              {t.hero.subheadline}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/report"
                className="px-6 py-3.5 rounded-2xl btn-liquid-primary font-bold text-sm tracking-wide flex items-center gap-2 group"
              >
                <span>{t.hero.reportBtn}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/track"
                className="px-6 py-3.5 rounded-2xl btn-liquid-secondary font-semibold text-sm tracking-wide flex items-center gap-2"
              >
                <span>{t.hero.trackBtn}</span>
              </Link>

              <button
                onClick={() => setIsDemoWalkthroughOpen(true)}
                className="px-4 py-3.5 rounded-2xl liquid-glass text-xs font-medium text-lilac hover:text-white border border-white/10 flex items-center gap-2 hover:border-orchid/40 transition-all"
              >
                <Sparkles className="w-4 h-4 text-orchid-electric" />
                <span>{t.hero.demoBtn}</span>
              </button>
            </div>

            {/* Trust and Platform Indicators */}
            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-lavender/80">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Transparent Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-orchid-electric" />
                <span>Automated Department Routing</span>
              </div>
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-orchid" />
                <span>Citizen-Verified Closures</span>
              </div>
            </div>
          </div>

          {/* Right Column: Layered Urban Intelligence Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer Layered Glass Container */}
              <div className="liquid-glass-elevated rounded-3xl p-6 border border-white/20 relative overflow-hidden">
                {/* Visual Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-amber-400" />
                    <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="font-mono text-xs text-lilac/80 ml-2">
                      live-telemetry.civic
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orchid/20 text-orchid-electric border border-orchid/30">
                    REALTIME
                  </span>
                </div>

                {/* Layered Smart City Graphic */}
                <div className="relative h-64 bg-plum-dark/80 rounded-2xl overflow-hidden border border-white/10 p-4 flex flex-col justify-between">
                  <div className="bg-mesh-grid absolute inset-0 opacity-40 pointer-events-none" />

                  {/* Connected Node Network SVG */}
                  <svg
                    className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
                    viewBox="0 0 350 240"
                    fill="none"
                  >
                    <path
                      d="M 50 180 Q 150 90 280 160"
                      stroke="url(#gradient-line)"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />
                    <path
                      d="M 80 80 Q 200 190 300 70"
                      stroke="url(#gradient-line2)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#AD42B8" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#E65BD6" stopOpacity="0.2" />
                      </linearGradient>
                      <linearGradient id="gradient-line2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#E65BD6" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#856B91" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Floating Glowing City Pins */}
                  <div className="relative z-10 flex justify-between items-start">
                    <div className="liquid-glass px-3 py-1.5 rounded-xl border border-orchid/40 text-[11px] text-pearl flex items-center gap-1.5 shadow-[0_0_15px_rgba(230,91,214,0.35)] animate-float">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Velachery Water Line: Repaired</span>
                    </div>
                    <div className="liquid-glass px-2.5 py-1 rounded-xl border border-red-500/40 text-[10px] text-red-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                      <span>Adyar: High Alert</span>
                    </div>
                  </div>

                  {/* Center Pulse Pin */}
                  <div className="relative z-10 self-center flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-orchid/20 border border-orchid-electric flex items-center justify-center shadow-orchid-glow">
                      <MapPin className="w-6 h-6 text-orchid-electric animate-bounce" />
                    </div>
                    <span className="mt-1 text-[11px] font-mono font-bold text-pearl bg-plum/90 px-2 py-0.5 rounded border border-white/10">
                      Anna Nagar • Pothole
                    </span>
                  </div>

                  {/* Bottom Stats Preview Bar */}
                  <div className="relative z-10 liquid-glass p-2.5 rounded-xl border border-white/15 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-lilac">
                      <Sparkles className="w-3.5 h-3.5 text-orchid-electric" />
                      <span className="font-semibold">Gemini AI Dispatch:</span>
                    </div>
                    <span className="font-mono text-emerald-300 font-bold">
                      94% Confidence
                    </span>
                  </div>
                </div>

                {/* Floating Metric Card Overlay */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                  <div className="liquid-glass p-3 rounded-xl border border-white/10">
                    <div className="text-[11px] text-lavender font-medium">Avg Triage Speed</div>
                    <div className="text-lg font-bold font-mono text-orchid-electric">
                      &lt; 1.2s
                    </div>
                  </div>
                  <div className="liquid-glass p-3 rounded-xl border border-white/10">
                    <div className="text-[11px] text-lavender font-medium">Citizen Verifications</div>
                    <div className="text-lg font-bold font-mono text-emerald-300">
                      {stats.citizenVerifiedCount} Confirmed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Statistics Section (Calculated from actual stored records) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="liquid-glass-elevated rounded-3xl p-6 sm:p-8 border border-white/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-4">
            <div>
              <h2 className="font-display font-bold text-xl text-white">
                Live Municipal Telemetry
              </h2>
              <p className="text-xs text-lavender/80">
                Calculated dynamically from active stored complaint records in this instance.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-orchid-electric bg-orchid/10 border border-orchid/20 px-3 py-1.5 rounded-xl">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>{complaints.length} Records Persisted</span>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1: Total */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs font-medium text-lilac/70 uppercase tracking-wider">
                {t.hero.statTotal}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                {stats.total}
              </div>
              <p className="text-[11px] text-lavender">Logged community issues</p>
            </div>

            {/* Stat 2: Active / In Progress */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs font-medium text-amber-300/80 uppercase tracking-wider">
                {t.hero.statActive}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-amber-300 tracking-tight">
                {stats.inProgress + stats.reported}
              </div>
              <p className="text-[11px] text-lavender">
                {stats.inProgress} ongoing, {stats.reported} queued
              </p>
            </div>

            {/* Stat 3: Resolved */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs font-medium text-emerald-300/80 uppercase tracking-wider">
                {t.hero.statSolved}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-emerald-300 tracking-tight">
                {stats.resolved}
              </div>
              <p className="text-[11px] text-lavender">Field operations completed</p>
            </div>

            {/* Stat 4: Resolution Rate */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-1">
              <span className="text-xs font-medium text-orchid-electric uppercase tracking-wider">
                {t.hero.statRate}
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono text-orchid-electric tracking-tight">
                {stats.resolutionRate}%
              </div>
              <p className="text-[11px] text-lavender">
                {stats.citizenVerifiedRate}% citizen verified
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Feature Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            {t.features.title}
          </h2>
          <p className="text-sm text-lilac/80">{t.features.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 */}
          <div className="liquid-glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orchid/20 border border-orchid/30 flex items-center justify-center text-orchid-electric shadow-orchid-glow">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-pearl">{t.features.f1Title}</h3>
            <p className="text-xs text-lilac/80 leading-relaxed">{t.features.f1Desc}</p>
          </div>

          {/* Card 2 */}
          <div className="liquid-glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orchid-electric/20 border border-orchid-electric/30 flex items-center justify-center text-orchid-electric shadow-orchid-glow">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-pearl">{t.features.f2Title}</h3>
            <p className="text-xs text-lilac/80 leading-relaxed">{t.features.f2Desc}</p>
          </div>

          {/* Card 3 */}
          <div className="liquid-glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <Building className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-pearl">{t.features.f3Title}</h3>
            <p className="text-xs text-lilac/80 leading-relaxed">{t.features.f3Desc}</p>
          </div>

          {/* Card 4 */}
          <div className="liquid-glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg text-pearl">{t.features.f4Title}</h3>
            <p className="text-xs text-lilac/80 leading-relaxed">{t.features.f4Desc}</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="liquid-glass p-8 sm:p-12 rounded-3xl border border-white/15">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
              {t.howItWorks.title}
            </h2>
            <p className="text-sm text-lilac/80">{t.howItWorks.subtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Step 1 */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="w-8 h-8 rounded-full bg-orchid/20 border border-orchid/40 text-orchid-electric font-mono font-bold flex items-center justify-center text-xs">
                01
              </div>
              <h4 className="font-bold text-sm text-pearl">{t.howItWorks.s1Title}</h4>
              <p className="text-xs text-lilac/80 leading-relaxed">{t.howItWorks.s1Desc}</p>
            </div>

            {/* Step 2 */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="w-8 h-8 rounded-full bg-orchid/20 border border-orchid/40 text-orchid-electric font-mono font-bold flex items-center justify-center text-xs">
                02
              </div>
              <h4 className="font-bold text-sm text-pearl">{t.howItWorks.s2Title}</h4>
              <p className="text-xs text-lilac/80 leading-relaxed">{t.howItWorks.s2Desc}</p>
            </div>

            {/* Step 3 */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="w-8 h-8 rounded-full bg-orchid/20 border border-orchid/40 text-orchid-electric font-mono font-bold flex items-center justify-center text-xs">
                03
              </div>
              <h4 className="font-bold text-sm text-pearl">{t.howItWorks.s3Title}</h4>
              <p className="text-xs text-lilac/80 leading-relaxed">{t.howItWorks.s3Desc}</p>
            </div>

            {/* Step 4 */}
            <div className="liquid-glass-card p-5 rounded-2xl border border-white/10 space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-mono font-bold flex items-center justify-center text-xs">
                04
              </div>
              <h4 className="font-bold text-sm text-pearl">{t.howItWorks.s4Title}</h4>
              <p className="text-xs text-lilac/80 leading-relaxed">{t.howItWorks.s4Desc}</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/report"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl btn-liquid-primary font-bold text-sm tracking-wide shadow-orchid-glow"
            >
              <span>{t.hero.reportBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

