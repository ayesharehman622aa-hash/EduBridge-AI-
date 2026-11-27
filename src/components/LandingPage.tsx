import React from 'react';
import { ActiveTab, Language } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import {
  Sparkles,
  MessageSquare,
  BookOpen,
  CheckCircle2,
  HardDrive,
  ShieldCheck,
  HeartHandshake,
  ArrowRight,
  Check,
  Languages,
  Target,
  Leaf,
} from 'lucide-react';

interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  language?: Language;
}

export const LandingPage: React.FC<LandingPageProps> = ({ setActiveTab }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0f2b46] via-[#13385a] to-[#0f2b46] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-teal-900/40">
        {/* Subtle decorative background glow */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -start-24 w-96 h-96 rounded-full bg-teal-400 blur-3xl"></div>
          <div className="absolute top-1/2 -end-24 w-96 h-96 rounded-full bg-cyan-400 blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Mission Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs sm:text-sm font-semibold tracking-wide">
            <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{t.landing.missionBadge}</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t.landing.heroTitle}
          </h1>

          {/* Tagline & Subtitle */}
          <p className="text-teal-200 font-semibold text-lg sm:text-xl">
            {t.tagline}
          </p>

          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            {t.landing.heroSubtitle}
          </p>

          {/* Call to Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => setActiveTab('assessment')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm sm:text-base shadow-lg shadow-teal-500/25 transition-all hover:scale-[1.02] focus:outline-none focus:ring-3 focus:ring-teal-200 cursor-pointer"
            >
              <Target className="w-4 h-4 text-slate-950 shrink-0" />
              <span>{t.landing.startAssessment}</span>
              <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm sm:text-base border border-slate-600 transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
            >
              <span>{t.landing.startLearning}</span>
            </button>

            <button
              onClick={() => setActiveTab('tutor')}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-transparent hover:bg-white/10 text-slate-200 font-medium text-sm sm:text-base border border-white/20 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 text-teal-300 shrink-0" />
              <span>{t.landing.exploreDemo}</span>
            </button>
          </div>

          {/* Quick Pillars Banner */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto text-xs sm:text-sm text-slate-300 border-t border-slate-700/60">
            <div className="flex items-center justify-center gap-2 py-1">
              <Check className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{t.landing.quickStatsStudents}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <Languages className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{t.landing.quickStatsLanguages}</span>
            </div>
            <div className="flex items-center justify-center gap-2 py-1">
              <HardDrive className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{t.landing.quickStatsFree}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Audience & Purpose Card */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-200/80 flex flex-col md:flex-row items-center gap-6">
          <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center shrink-0">
            <HeartHandshake className="w-8 h-8 text-teal-700" />
          </div>
          <div className="space-y-1.5 text-center md:text-start flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-[#0f2b46]">
              {t.landing.dedicatedTitle}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t.landing.forWhom}
            </p>
          </div>
          <button
            onClick={() => setActiveTab('about')}
            className="shrink-0 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer"
          >
            {t.landing.readMission}
          </button>
        </div>
      </section>

      {/* 4 Core Features Showcase */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0f2b46] tracking-tight">
            {t.landing.toolsHeading}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            {t.landing.toolsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Featured Card 0: Diagnostic Self-Assessment & Gap Detector */}
          <div className="md:col-span-2 bg-gradient-to-br from-teal-950 via-[#0f2b46] to-slate-900 text-white rounded-2xl p-6 sm:p-8 border-2 border-teal-500/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-400/20 text-teal-300 border border-teal-400/30 text-xs font-bold">
                <Leaf className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                <span>{t.landing.paperlessBadge}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {t.landing.featureAssessmentTitle}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                {t.landing.featureAssessmentDesc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-teal-200 pt-1">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{t.landing.assessmentPillar1}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{t.landing.assessmentPillar2}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                  <span>{t.landing.assessmentPillar3}</span>
                </span>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto">
              <button
                onClick={() => setActiveTab('assessment')}
                className="w-full md:w-auto px-6 py-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Target className="w-4 h-4 shrink-0" />
                <span>{t.landing.startAssessment}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
              </button>
            </div>
          </div>

          {/* Card 1: AI Tutor */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2b46]">
                {t.landing.featureTutorTitle}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.landing.featureTutorDesc}
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.tutorBullet1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.tutorBullet2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.tutorBullet3}</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => setActiveTab('tutor')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#0f2b46] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{t.landing.tutorCta}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
              </button>
            </div>
          </div>

          {/* Card 2: Smart Notes */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-teal-600 group-hover:text-white transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2b46]">
                {t.landing.featureNotesTitle}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.landing.featureNotesDesc}
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.notesBullet1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.notesBullet2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.notesBullet3}</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => setActiveTab('notes')}
                className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{t.landing.notesCta}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
              </button>
            </div>
          </div>

          {/* Card 3: AI Quiz Generator */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2b46]">
                {t.landing.featureQuizTitle}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.landing.featureQuizDesc}
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.quizBullet1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.quizBullet2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.quizBullet3}</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-[#0f2b46] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{t.landing.quizCta}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
              </button>
            </div>
          </div>

          {/* Card 4: Low-Connectivity Offline Readiness */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <HardDrive className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#0f2b46]">
                {t.landing.featureOfflineTitle}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {t.landing.featureOfflineDesc}
              </p>
              <ul className="text-xs text-slate-500 space-y-1.5 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.offlineBullet1}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.offlineBullet2}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.landing.offlineBullet3}</span>
                </li>
              </ul>
            </div>
            <div className="pt-6">
              <button
                onClick={() => setActiveTab('saved')}
                className="w-full py-2.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{t.landing.offlineCta}</span>
                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Principles Section */}
      <section className="bg-slate-100/80 border-t border-slate-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-200 mb-2">
            <ShieldCheck className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0f2b46]">
            {t.landing.trustTitle}
          </h3>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto leading-relaxed">
            {t.landing.trustBody}
          </p>
        </div>
      </section>
    </div>
  );
};

