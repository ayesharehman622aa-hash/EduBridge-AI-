import React, { useState } from 'react';
import { ActiveTab, Language } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Target,
  MessageSquare, 
  BookOpen, 
  CheckCircle2, 
  Bookmark, 
  TrendingUp, 
  Info, 
  Wifi, 
  WifiOff, 
  Menu, 
  X 
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isOnline: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isOnline,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'landing', label: t.nav.home, icon: <GraduationCap className="w-4 h-4 shrink-0" /> },
    { id: 'dashboard', label: t.nav.dashboard, icon: <LayoutDashboard className="w-4 h-4 shrink-0" /> },
    { id: 'assessment', label: t.nav.assessment, icon: <Target className="w-4 h-4 shrink-0" /> },
    { id: 'tutor', label: t.nav.tutor, icon: <MessageSquare className="w-4 h-4 shrink-0" /> },
    { id: 'notes', label: t.nav.notes, icon: <BookOpen className="w-4 h-4 shrink-0" /> },
    { id: 'quiz', label: t.nav.quiz, icon: <CheckCircle2 className="w-4 h-4 shrink-0" /> },
    { id: 'saved', label: t.nav.saved, icon: <Bookmark className="w-4 h-4 shrink-0" /> },
    { id: 'progress', label: t.nav.progress, icon: <TrendingUp className="w-4 h-4 shrink-0" /> },
    { id: 'about', label: t.nav.about, icon: <Info className="w-4 h-4 shrink-0" /> },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0f2b46] text-white shadow-md border-b border-slate-700/60">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-3 h-16 min-w-0">
          
          {/* Brand Logo & Tagline */}
          <button
            onClick={() => handleNavClick('landing')}
            className="flex items-center gap-2 sm:gap-3 text-start focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-lg p-1 group min-w-0 shrink cursor-pointer"
            aria-label={t.appName}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-teal-400 flex items-center justify-center text-slate-900 shadow-md group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-white stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-[13px] sm:text-lg tracking-tight text-white group-hover:text-teal-300 transition-colors whitespace-nowrap">
                  EduBridge <span className="text-teal-400">AI</span>
                </span>
                <span className="hidden 2xl:inline-flex text-[10px] font-semibold uppercase tracking-wider bg-teal-900/60 text-teal-300 px-2 py-0.5 rounded-full border border-teal-500/30 whitespace-nowrap">
                  {t.nav.openAccess}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden md:block max-w-[180px] truncate">
                {t.nav.brandSubtitle}
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-0.5 min-w-0" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white font-semibold shadow-sm'
                      : 'text-slate-200 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls: Connectivity Status, Compact Language Dropdown & Mobile Menu */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Connectivity Status Badge */}
            <div 
              className={`flex items-center justify-center gap-1.5 w-7 h-7 sm:w-auto sm:h-auto sm:px-2.5 sm:py-1 rounded-full text-xs font-medium border transition-colors shrink-0 ${
                isOnline
                  ? 'bg-teal-950/60 text-teal-300 border-teal-700/50'
                  : 'bg-amber-950/80 text-amber-300 border-amber-600/60 animate-pulse'
              }`}
              title={isOnline ? t.nav.online : t.nav.offline}
              aria-label={isOnline ? t.nav.online : t.nav.offline}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                  <span className="hidden sm:inline text-[11px] whitespace-nowrap">{t.nav.online}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="hidden sm:inline text-[11px] font-semibold whitespace-nowrap">{t.nav.offline}</span>
                </>
              )}
            </div>

            {/* Compact Fixed-Width Any-Language Dropdown */}
            <LanguageSelector variant="header" />

            {/* Mobile / Tablet Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-400 shrink-0 cursor-pointer"
              aria-label={t.nav.toggleMenu}
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-700/60 py-3 px-1 space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-start cursor-pointer ${
                    isActive
                      ? 'bg-teal-600 text-white font-semibold'
                      : 'text-slate-200 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
