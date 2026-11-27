import React from 'react';
import { ActiveTab, Language } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import { LanguageSelector } from './LanguageSelector';
import { GraduationCap, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0f2b46] text-slate-300 border-t border-slate-700/60 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-teal-500 flex items-center justify-center text-slate-900 shadow-sm shrink-0">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                EduBridge <span className="text-teal-400">AI</span>
              </span>
            </div>

            <p className="text-sm text-teal-200 font-medium">
              {t.tagline}
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              {t.missionShort}
            </p>

            <p className="text-[11px] text-slate-400 leading-relaxed max-w-md pt-1">
              {t.footer.privacyLine}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
              {t.footer.toolsHeading}
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('assessment')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {t.nav.assessment}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('tutor')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {t.nav.tutor}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {t.nav.notes}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('quiz')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {t.nav.quiz}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('saved')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {t.nav.saved}
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('progress')}
                  className="hover:text-white transition-colors cursor-pointer text-start"
                >
                  {t.nav.progress}
                </button>
              </li>
            </ul>
          </div>

          {/* Accessibility & Language */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-teal-300 uppercase tracking-wider">
              {t.footer.accessibilityHeading}
            </h4>
            <div className="space-y-2.5 text-xs">
              <LanguageSelector variant="footer" upward />

              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                {t.footer.lowBandwidthNote}
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} EduBridge AI. {t.footer.copyright}
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>{t.footer.craftedFor}</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
