import React from 'react';
import { Building2, ShieldCheck, Heart, Sparkles, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#170E1C]/80 backdrop-blur-xl relative overflow-hidden text-sm">
      <div className="ambient-glow-orchid absolute -bottom-24 left-1/2 -translate-x-1/2 w-96 h-96 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orchid/20 border border-orchid/30 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-orchid-electric" />
              </div>
              <span className="font-display font-bold text-lg text-pearl">CivicResolve</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                MVP Prototype
              </span>
            </div>
            <p className="text-xs text-lilac/80 max-w-md leading-relaxed">
              Your Voice. Your City. Our Responsibility. An intelligent civic intelligence platform
              powered by Google Gemini AI, transforming public infrastructure grievances into actionable municipal workflows.
            </p>
            <div className="pt-2 text-[11px] text-lavender/60 flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-orchid" />
              <span>Built for municipal innovation and citizen empowerment.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-pearl font-semibold mb-3">
              Platform Links
            </h4>
            <ul className="space-y-2 text-xs text-lilac/80">
              <li>
                <Link to="/" className="hover:text-orchid-electric transition-colors">
                  Home & Overview
                </Link>
              </li>
              <li>
                <Link to="/report" className="hover:text-orchid-electric transition-colors">
                  Report a Grievance
                </Link>
              </li>
              <li>
                <Link to="/track" className="hover:text-orchid-electric transition-colors">
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-orchid-electric transition-colors">
                  Citizen Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-orchid-electric transition-colors">
                  Municipal Admin Command Center
                </Link>
              </li>
            </ul>
          </div>

          {/* Architecture / Integrity */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-pearl font-semibold mb-3">
              Architecture & Trust
            </h4>
            <ul className="space-y-2 text-xs text-lilac/80">
              <li className="flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-orchid-electric" />
                <span>Google GenAI SDK (Node.js)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Terminal className="w-3 h-3 text-orchid-electric" />
                <span>Rule-Based Safe Fallback Triage</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Citizen-Verified Resolution Loop</span>
              </li>
              <li className="text-[11px] text-lavender/60 pt-2 border-t border-white/5">
                Demonstration platform. Complaints persist via CivicResolve Backend API & shared storage.
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-lavender/60">
          <p>© 2026 CivicResolve. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Engineered with passion for smarter, cleaner, accountable cities.</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

