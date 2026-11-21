import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useComplaints } from '../context/ComplaintContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Building2,
  FileText,
  Search,
  LayoutDashboard,
  ShieldAlert,
  Languages,
  Menu,
  X,
  Sparkles,
  Layers,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { isAdminMode, setIsAdminMode, setIsDemoWalkthroughOpen } = useComplaints();
  const { language, toggleLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: t.nav.home, icon: Building2 },
    { to: '/report', label: t.nav.report, icon: FileText },
    { to: '/track', label: t.nav.track, icon: Search },
    { to: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
    { to: '/admin', label: t.nav.admin, icon: ShieldAlert },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 pt-3 pb-2 transition-all duration-200">
      <div className="max-w-7xl mx-auto liquid-glass-elevated rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between border border-white/15">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orchid to-orchid-electric p-0.5 shadow-orchid-glow group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-plum-dark/90 rounded-[10px] flex items-center justify-center">
              <Building2 className="w-5 h-5 text-orchid-electric" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-orchid-electric transition-colors">
                CivicResolve
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-orchid/20 border border-orchid/30 text-lilac font-semibold">
                AI
              </span>
            </div>
            <p className="text-[10px] text-lavender/70 hidden sm:block font-medium tracking-wide">
              {t.tagline}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const isActive = location.pathname === item.to;
            const IconComponent = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'text-white bg-white/10 shadow-sm border border-white/10'
                    : 'text-lilac hover:text-white hover:bg-white/5'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${isActive ? 'text-orchid-electric' : 'text-lavender'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orchid-electric rounded-full shadow-[0_0_8px_#E65BD6]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Hackathon Demo Walkthrough Button */}
          <button
            onClick={() => setIsDemoWalkthroughOpen(true)}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-orchid/20 hover:bg-orchid/30 text-lilac border border-orchid/40 flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(173,66,184,0.25)] hover:shadow-orchid-glow"
            title="Open Interactive Demo Walkthrough for Judges"
          >
            <Sparkles className="w-3.5 h-3.5 text-orchid-electric animate-spin" style={{ animationDuration: '6s' }} />
            <span>{t.nav.demoMode}</span>
          </button>

          {/* Language Toggle (EN / TA) */}
          <button
            onClick={toggleLanguage}
            className="px-2.5 py-1.5 rounded-xl text-xs font-semibold liquid-glass hover:bg-white/10 text-pearl border border-white/15 flex items-center gap-1.5 transition-all"
            title="Switch Language (English / தமிழ்)"
          >
            <Languages className="w-3.5 h-3.5 text-orchid-electric" />
            <span className="font-mono">{language === 'en' ? 'தமிழ் (TA)' : 'English (EN)'}</span>
          </button>

          {/* Mode Switch (Citizen / Admin) */}
          <div className="flex items-center bg-plum-dark/90 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setIsAdminMode(false)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                !isAdminMode
                  ? 'bg-gradient-to-r from-orchid to-orchid-electric text-white shadow-sm'
                  : 'text-lavender hover:text-pearl'
              }`}
            >
              Citizen
            </button>
            <button
              onClick={() => setIsAdminMode(true)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
                isAdminMode
                  ? 'bg-amber-600/90 text-white shadow-sm'
                  : 'text-lavender hover:text-pearl'
              }`}
            >
              Admin Demo
            </button>
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-pearl liquid-glass hover:bg-white/10 border border-white/15"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 liquid-glass-elevated rounded-2xl p-4 border border-white/15 space-y-3">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((item) => {
              const isActive = location.pathname === item.to;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/10'
                      : 'text-lilac hover:bg-white/5'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-orchid-electric' : 'text-lavender'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={() => {
                toggleLanguage();
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold liquid-glass text-pearl border border-white/15 flex items-center gap-2"
            >
              <Languages className="w-4 h-4 text-orchid-electric" />
              <span>{language === 'en' ? 'தமிழ் (TA)' : 'English (EN)'}</span>
            </button>

            <button
              onClick={() => {
                setIsDemoWalkthroughOpen(true);
                setMobileMenuOpen(false);
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-orchid/20 text-lilac border border-orchid/40 flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-orchid-electric" />
              <span>{t.nav.demoMode}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-lavender">Active Role:</span>
            <div className="flex items-center bg-plum-dark p-1 rounded-xl border border-white/10 text-xs">
              <button
                onClick={() => setIsAdminMode(false)}
                className={`px-3 py-1 rounded-lg font-medium ${
                  !isAdminMode ? 'bg-orchid text-white' : 'text-lavender'
                }`}
              >
                Citizen
              </button>
              <button
                onClick={() => setIsAdminMode(true)}
                className={`px-3 py-1 rounded-lg font-medium ${
                  isAdminMode ? 'bg-amber-600 text-white' : 'text-lavender'
                }`}
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

