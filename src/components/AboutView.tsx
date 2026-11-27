import React from 'react';
import { Language } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import {
  WifiOff,
  ShieldCheck,
  Globe2,
  Compass,
  GraduationCap,
  Leaf,
  Lock,
} from 'lucide-react';

interface AboutViewProps {
  language?: Language;
}

export const AboutView: React.FC<AboutViewProps> = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Hero Mission Card */}
      <div className="bg-gradient-to-r from-[#0f2b46] to-[#15466e] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-teal-900/50 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold">
          <GraduationCap className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{t.about.missionBadge}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
          {t.about.title}
        </h1>

        <p className="text-teal-200 text-base sm:text-lg font-medium">
          {t.tagline}
        </p>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
          {t.about.missionBody}
        </p>
      </div>

      {/* 4 Pillars of EduBridge AI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pillar 1: Rural & Low-Connectivity Design */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <WifiOff className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0f2b46]">
            {t.about.howToUseOfflineHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.about.offlineBody}
          </p>
        </div>

        {/* Pillar 2: Pedagogical Clarity & Village Analogies */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0f2b46]">
            {t.about.pedagogyHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.about.pedagogyBody}
          </p>
        </div>

        {/* Pillar 3: Academic Honesty & Truthfulness */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0f2b46]">
            {t.about.aiEthicsHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.about.honestyBody}
          </p>
        </div>

        {/* Pillar 4: True Multilingual Access */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Globe2 className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-[#0f2b46]">
            {t.about.multilingualHeading}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.about.multilingualBody}
          </p>
        </div>
      </div>

      {/* Code for Humanity: Eliminating Measurement-Related Waste */}
      <div className="bg-gradient-to-br from-emerald-900 to-[#0f2b46] text-white rounded-2xl p-6 sm:p-8 border border-emerald-500/30 shadow-lg space-y-4">
        <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
          <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{t.landing.missionBadge}</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-white">
          {t.about.paperlessHeading}
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-3xl">
          {t.about.wasteBody}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
          <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/30">
            <span className="font-bold text-emerald-400 block text-base">{t.about.wasteCard1Val}</span>
            <span className="text-[11px] text-slate-300">{t.about.wasteCard1Desc}</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/30">
            <span className="font-bold text-cyan-400 block text-base">{t.about.wasteCard2Val}</span>
            <span className="text-[11px] text-slate-300">{t.about.wasteCard2Desc}</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/30">
            <span className="font-bold text-teal-300 block text-base">{t.about.wasteCard3Val}</span>
            <span className="text-[11px] text-slate-300">{t.about.wasteCard3Desc}</span>
          </div>
          <div className="bg-slate-900/60 p-3 rounded-xl border border-emerald-500/30">
            <span className="font-bold text-amber-400 block text-base">{t.about.wasteCard4Val}</span>
            <span className="text-[11px] text-slate-300">{t.about.wasteCard4Desc}</span>
          </div>
        </div>
      </div>

      {/* How to study with EduBridge AI banner */}
      <div className="bg-slate-100/90 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
        <h3 className="text-base sm:text-lg font-bold text-[#0f2b46]">
          {t.about.studyFlowHeading}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-700">
          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-teal-700 block">
              {t.about.flowStep1Title}
            </span>
            <p className="text-slate-500 text-xs">
              {t.about.flowStep1Desc}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-teal-700 block">
              {t.about.flowStep2Title}
            </span>
            <p className="text-slate-500 text-xs">
              {t.about.flowStep2Desc}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-teal-700 block">
              {t.about.flowStep3Title}
            </span>
            <p className="text-slate-500 text-xs">
              {t.about.flowStep3Desc}
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0f2b46] flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-[#0f2b46]">
            {t.about.privacyHeading}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {t.about.privacyLine}
          </p>
        </div>
      </div>
    </div>
  );
};

