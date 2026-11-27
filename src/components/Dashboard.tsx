import React, { useEffect, useState } from 'react';
import { ActiveTab, Language, StudentStats, NoteItem, AssessmentResult } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import { storage } from '../lib/storage';
import { DailyReminderCard } from './DailyReminderCard';
import {
  Trophy,
  Flame,
  BookOpen,
  CheckCircle2,
  MessageSquare,
  ArrowRight,
  Sparkles,
  BookMarked,
  BrainCircuit,
  Target,
  Leaf,
  Award,
} from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  language?: Language;
  onSelectTopic?: (topic: string, subject: string) => void;
  isOnline: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  setActiveTab,
  onSelectTopic,
}) => {
  const { language, t } = useTranslation();

  const [stats, setStats] = useState<StudentStats>(storage.getStudentStats());
  const [savedNotes, setSavedNotes] = useState<NoteItem[]>([]);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    setStats(storage.getStudentStats());
    setSavedNotes(storage.getSavedNotes());
    setAssessments(storage.getAssessmentResults());
  }, []);

  const recommendedTopics = [
    { title: t.dashboard.jumpTopic1, subjectKey: 'Biology', subjectLabel: t.subjects.biology, icon: '🌱' },
    { title: t.dashboard.jumpTopic2, subjectKey: 'Mathematics', subjectLabel: t.subjects.mathematics, icon: '➗' },
    { title: t.dashboard.jumpTopic3, subjectKey: 'Physics', subjectLabel: t.subjects.physics, icon: '🚀' },
    { title: t.dashboard.jumpTopic4, subjectKey: 'Earth Science', subjectLabel: t.subjects.earthScience, icon: '💧' },
    { title: t.dashboard.jumpTopic5, subjectKey: 'Biology', subjectLabel: t.subjects.biology, icon: '🔬' },
    { title: t.dashboard.jumpTopic6, subjectKey: 'English', subjectLabel: t.subjects.english, icon: '✍️' },
  ];

  const handleTopicClick = (topicTitle: string, subject: string) => {
    if (onSelectTopic) {
      onSelectTopic(topicTitle, subject);
    }
    setActiveTab('assessment');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome Greeting */}
      <div className="bg-gradient-to-r from-[#0f2b46] to-[#15466e] text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{t.dashboard.commandCenterBadge}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.dashboard.welcome}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {t.dashboard.welcomeSubtitle}
          </p>
        </div>

        {/* Quick Streak Badge */}
        <div className="bg-slate-900/60 border border-teal-500/30 rounded-xl p-4 flex items-center gap-4 shrink-0 shadow-inner">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-amber-400">
              {stats.studyStreakDays} {t.common.days}
            </div>
            <div className="text-xs text-slate-300 font-medium">
              {t.dashboard.studyStreak}
            </div>
          </div>
        </div>
      </div>

      {/* Code for Humanity: Paperless Assessment Impact Banner */}
      <div className="bg-gradient-to-r from-emerald-900/90 via-teal-900/90 to-[#0f2b46] text-white rounded-2xl p-6 border border-emerald-500/30 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Leaf className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{t.dashboard.paperlessBannerTitle}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              {t.dashboard.paperlessImpactTitle}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t.dashboard.paperlessBannerDesc}
            </p>
          </div>

          {/* Actual Measured Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0 w-full md:w-auto">
            <div className="bg-slate-900/60 border border-emerald-500/30 rounded-xl p-3 text-center">
              <span className="text-lg sm:text-xl font-black text-emerald-400 block">
                {stats.paperlessMetrics.paperSheetsSaved}
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-300">
                {t.dashboard.sheetsSavedShort}
              </span>
            </div>
            <div className="bg-slate-900/60 border border-emerald-500/30 rounded-xl p-3 text-center">
              <span className="text-lg sm:text-xl font-black text-cyan-400 block">
                {stats.paperlessMetrics.waterSavedLiters} L
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-300">
                {t.dashboard.waterSavedShort}
              </span>
            </div>
            <div className="bg-slate-900/60 border border-emerald-500/30 rounded-xl p-3 text-center">
              <span className="text-lg sm:text-xl font-black text-teal-400 block">
                {stats.paperlessMetrics.carbonSavedGrams} g
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-300">
                {t.dashboard.co2AvertedShort}
              </span>
            </div>
            <div className="bg-slate-900/60 border border-emerald-500/30 rounded-xl p-3 text-center">
              <span className="text-lg sm:text-xl font-black text-amber-400 block">
                {stats.paperlessMetrics.gradingMinutesSaved} m
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-300">
                {t.dashboard.gradingSavedShort}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Stat 1: Diagnostic Assessments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-black text-slate-900">
              {stats.assessmentsCompleted}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {t.dashboard.assessmentsCompleted}
            </div>
          </div>
        </div>

        {/* Stat 2: Avg Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-black text-slate-900">
              {stats.averageAssessmentScore > 0 ? stats.averageAssessmentScore : stats.averageScore}%
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {t.dashboard.avgScore}
            </div>
          </div>
        </div>

        {/* Stat 3: Saved Notes */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <BookMarked className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-black text-slate-900">
              {savedNotes.length}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {t.dashboard.savedMaterials}
            </div>
          </div>
        </div>

        {/* Stat 4: Tutor Questions */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="text-2xl font-black text-slate-900">
              {stats.tutorQuestionsAsked}
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {t.dashboard.questionsExplored}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Learning & Self-Assessment Actions */}
      <div className="space-y-4">
        <h2 className="text-lg sm:text-xl font-bold text-[#0f2b46]">
          {t.dashboard.quickActions}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Self-Assessment */}
          <button
            onClick={() => setActiveTab('assessment')}
            className="p-5 rounded-2xl bg-gradient-to-br from-teal-50 to-white border-2 border-teal-300 hover:border-teal-500 hover:shadow-md transition-all text-start flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5 flex-wrap">
                <span>{t.dashboard.actionAssessmentTitle}</span>
                <span className="text-[10px] bg-teal-100 text-teal-800 px-1.5 py-0.5 rounded font-bold">
                  {t.common.newBadge}
                </span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t.dashboard.actionAssessmentDesc}
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-teal-700 group-hover:text-teal-800">
              <span>{t.dashboard.actionAssessmentCta}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
            </div>
          </button>

          {/* Action 2: AI Tutor */}
          <button
            onClick={() => setActiveTab('tutor')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all text-start flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                {t.dashboard.actionTutorTitle}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.dashboard.actionTutorDesc}
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-teal-600 group-hover:text-teal-700">
              <span>{t.dashboard.actionTutorCta}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
            </div>
          </button>

          {/* Action 3: Smart Notes */}
          <button
            onClick={() => setActiveTab('notes')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all text-start flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                {t.dashboard.actionNotesTitle}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.dashboard.actionNotesDesc}
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-teal-600 group-hover:text-teal-700">
              <span>{t.dashboard.actionNotesCta}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
            </div>
          </button>

          {/* Action 4: Adaptive Quiz */}
          <button
            onClick={() => setActiveTab('quiz')}
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all text-start flex flex-col justify-between group cursor-pointer"
          >
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">
                {t.dashboard.actionQuizTitle}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {t.dashboard.actionQuizDesc}
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs font-semibold text-teal-600 group-hover:text-teal-700">
              <span>{t.dashboard.actionQuizCta}</span>
              <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
            </div>
          </button>
        </div>
      </div>

      {/* Skill Status Card: Calibrated Skill Levels per Subject */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0f2b46] flex items-center gap-2">
              <Award className="w-5 h-5 text-teal-600 shrink-0" />
              <span>{t.dashboard.skillStatusTitle}</span>
            </h2>
            <p className="text-xs text-slate-500">
              {t.dashboard.skillSubcaption}
            </p>
          </div>

          <button
            onClick={() => setActiveTab('progress')}
            className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1 self-start sm:self-auto cursor-pointer"
          >
            <span>{t.dashboard.viewDetailedSkills}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs text-slate-800">{t.dashboard.demoBioLabel}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 shrink-0">
                {t.skillLevels.proficient}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {t.dashboard.demoBioDesc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs text-slate-800">{t.dashboard.demoMathLabel}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 shrink-0">
                {t.skillLevels.competent}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {t.dashboard.demoMathDesc}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-xs text-slate-800">{t.dashboard.demoPhysLabel}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 shrink-0">
                {t.skillLevels.developing}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {t.dashboard.demoPhysDesc}
            </p>
          </div>
        </div>
      </div>

      {/* Daily Study Habit Reminder Card with Notification API */}
      <DailyReminderCard
        language={language}
        studyStreakDays={stats.studyStreakDays}
      />

      {/* Recommended Topics / Fast Start Curriculum */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#0f2b46]">
              {t.dashboard.jumpStartTitle}
            </h2>
            <p className="text-xs text-slate-500">
              {t.dashboard.jumpStartSubtitle}
            </p>
          </div>
          <span className="text-[11px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60 self-start sm:self-auto">
            {t.dashboard.paperlessTag}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {recommendedTopics.map((topic, i) => (
            <button
              key={i}
              onClick={() => handleTopicClick(topic.title, topic.subjectKey)}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-start transition-all group cursor-pointer"
            >
              <span className="text-xl shrink-0">{topic.icon}</span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs sm:text-sm text-slate-900 group-hover:text-teal-700 truncate">
                  {topic.title}
                </div>
                <div className="text-[10px] text-slate-400 font-medium">
                  {topic.subjectLabel}
                </div>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 shrink-0 rtl:rotate-180" />
            </button>
          ))}
        </div>
      </div>

      {/* Two Column Section: Recent Notes & Assessment History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Saved Notes */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{t.dashboard.recentNotesTitle}</span>
              </h3>
              <button
                onClick={() => setActiveTab('saved')}
                className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer"
              >
                {t.dashboard.viewAll}
              </button>
            </div>

            <div className="pt-3 space-y-2.5">
              {savedNotes.slice(0, 3).map((note) => (
                <div
                  key={note.id}
                  onClick={() => setActiveTab('saved')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                      {note.title}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-teal-100 text-teal-800 shrink-0">
                      {note.subject}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                    {note.summary}
                  </p>
                </div>
              ))}

              {savedNotes.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  {t.dashboard.noRecentActivity}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('notes')}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold text-center transition-colors cursor-pointer"
          >
            {t.dashboard.generateNewNotesBtn}
          </button>
        </div>

        {/* Recent Diagnostic Assessments */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.dashboard.recentAssessmentsTitle}</span>
              </h3>
              <button
                onClick={() => setActiveTab('progress')}
                className="text-xs font-semibold text-teal-600 hover:underline cursor-pointer"
              >
                {t.dashboard.fullProgressLink}
              </button>
            </div>

            <div className="pt-3 space-y-2.5">
              {assessments.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  onClick={() => setActiveTab('progress')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/70 transition-colors cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                      {res.topic}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>{res.subject}</span>
                      <span>•</span>
                      <span>{new Date(res.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="shrink-0 text-end">
                    <div
                      className={`text-sm font-black ${
                        res.percentage >= 75
                          ? 'text-emerald-600'
                          : res.percentage >= 60
                          ? 'text-teal-600'
                          : 'text-amber-600'
                      }`}
                    >
                      {res.score}/{res.totalQuestions} ({res.percentage}%)
                    </div>
                    <span className="text-[10px] text-slate-500 font-bold block">
                      {t.skillLevels[res.skillLevel] || res.skillLevelLabel}
                    </span>
                  </div>
                </div>
              ))}

              {assessments.length === 0 && (
                <div className="text-center py-6 text-xs text-slate-400">
                  {t.progress.emptyHistory}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setActiveTab('assessment')}
            className="w-full mt-4 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold text-center transition-colors cursor-pointer"
          >
            {t.dashboard.takeAssessmentBtn}
          </button>
        </div>
      </div>
    </div>
  );
};

