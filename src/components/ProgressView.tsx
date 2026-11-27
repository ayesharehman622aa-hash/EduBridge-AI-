import React, { useState, useEffect } from 'react';
import { Language, QuizAttempt, StudentStats, AssessmentResult, SkillLevel } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import { isRtlLanguage } from '../lib/languages';
import { storage } from '../lib/storage';
import {
  TrendingUp,
  Trophy,
  Flame,
  BarChart3,
  Award,
  HardDrive,
  RotateCcw,
  Download,
  Leaf,
  Target,
  BrainCircuit,
  Droplet,
  Clock,
  ArrowRight,
  Sliders,
  Plus,
  Minus,
  Info,
  Lightbulb,
  Check,
  X,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
} from 'lucide-react';

interface ProgressViewProps {
  language?: Language;
  setLanguage?: (lang: Language) => void;
  isOnline: boolean;
  onNavigateToAssessment?: () => void;
}

export const ProgressView: React.FC<ProgressViewProps> = ({ onNavigateToAssessment }) => {
  const { language, t } = useTranslation();

  const [stats, setStats] = useState<StudentStats>(storage.getStudentStats());
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [assessments, setAssessments] = useState<AssessmentResult[]>([]);
  const [selectedAssessmentModal, setSelectedAssessmentModal] = useState<AssessmentResult | null>(null);
  const [modalTab, setModalTab] = useState<'questions' | 'gaps' | 'studyPlan'>('questions');
  const [baselineSheets, setBaselineSheets] = useState<number>(storage.getBaselineSheets());

  useEffect(() => {
    setStats(storage.getStudentStats());
    setAttempts(storage.getQuizAttempts());
    setAssessments(storage.getAssessmentResults());
    setBaselineSheets(storage.getBaselineSheets());
  }, []);

  const getSubjectLabel = (subj: string): string => {
    const map: Record<string, string> = {
      'General Science': t.subjects.generalScience,
      Biology: t.subjects.biology,
      Physics: t.subjects.physics,
      Chemistry: t.subjects.chemistry,
      Mathematics: t.subjects.mathematics,
      'History & Geography': t.subjects.historyGeography,
      'English Grammar': t.subjects.englishGrammar,
      'Urdu Grammar': t.subjects.urduGrammar,
      'Earth Science': t.subjects.earthScience,
      English: t.subjects.english,
      'Urdu Literature': t.subjects.urduLiterature,
    };
    return map[subj] || subj;
  };

  const handleBaselineChange = (newVal: number) => {
    const clamped = Math.min(10, Math.max(1, newVal));
    setBaselineSheets(clamped);
    storage.setBaselineSheets(clamped);
    setStats(storage.getStudentStats());
  };

  const handleExportData = () => {
    const backupData = {
      studentStats: stats,
      assessmentResults: assessments,
      quizAttempts: attempts,
      savedNotes: storage.getSavedNotes(),
      savedQuizzes: storage.getSavedQuizzes(),
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `edubridge_student_progress_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetProgress = () => {
    if (window.confirm(t.progress.resetConfirm)) {
      storage.clearAllData();
      setStats(storage.getStudentStats());
      setAttempts(storage.getQuizAttempts());
      setAssessments(storage.getAssessmentResults());
    }
  };

  // Milestones
  const milestones = [
    {
      title: t.progress.milestone1Title,
      desc: t.progress.milestone1Desc,
      achieved: stats.assessmentsCompleted >= 1,
      icon: <Target className="w-5 h-5 text-teal-600" />,
    },
    {
      title: t.progress.milestone2Title,
      desc: t.progress.milestone2Desc,
      achieved: stats.paperlessMetrics.paperSheetsSaved >= 6,
      icon: <Leaf className="w-5 h-5 text-emerald-600" />,
    },
    {
      title: t.progress.milestone3Title,
      desc: t.progress.milestone3Desc,
      achieved: stats.averageAssessmentScore >= 75 && stats.assessmentsCompleted >= 1,
      icon: <Trophy className="w-5 h-5 text-amber-500" />,
    },
    {
      title: t.progress.milestone4Title,
      desc: t.progress.milestone4Desc,
      achieved: stats.studyStreakDays >= 3,
      icon: <Flame className="w-5 h-5 text-red-500" />,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-teal-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0f2b46]">{t.progress.title}</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">{t.progress.subtitle}</p>
        </div>

        {/* Local Storage Disclaimer */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold self-start md:self-center">
          <HardDrive className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{t.progress.localActualDataBadge}</span>
        </div>
      </div>

      {/* Paperless Assessment Impact Dashboard */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-950 to-[#0f2b46] text-white rounded-3xl p-6 sm:p-8 border border-emerald-500/40 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
              <Leaf className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>{t.landing.missionBadge}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {t.progress.paperlessImpactHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.progress.paperlessIntro}
            </p>
          </div>

          <div className="bg-slate-900/70 border border-emerald-400/30 rounded-2xl p-4 text-center shrink-0">
            <span className="text-3xl font-black text-emerald-400 block">
              {stats.paperlessMetrics.digitalTestsCompleted}
            </span>
            <span className="text-xs text-slate-300 font-semibold uppercase tracking-wider">
              {t.progress.digitalTestsTaken}
            </span>
          </div>
        </div>

        {/* 4 Impact Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 rounded-2xl p-4 border border-emerald-500/30 space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">
              {stats.paperlessMetrics.paperSheetsSaved}
            </div>
            <div className="text-xs font-bold text-white">{t.progress.sheetsSavedLabel}</div>
            <div className="text-[10px] text-slate-400">
              ~{baselineSheets} {t.progress.baselinePerTestSuffix}
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-4 border border-cyan-500/30 space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">
              {stats.paperlessMetrics.waterSavedLiters} {t.common.liters}
            </div>
            <div className="text-xs font-bold text-white">{t.progress.waterSavedLabel}</div>
            <div className="text-[10px] text-slate-400">{t.progress.waterAssumptionShort}</div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-4 border border-teal-500/30 space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-teal-300">
              {stats.paperlessMetrics.carbonSavedGrams} {t.common.grams}
            </div>
            <div className="text-xs font-bold text-white">{t.progress.carbonSavedLabel}</div>
            <div className="text-[10px] text-slate-400">{t.progress.carbonAssumptionShort}</div>
          </div>

          <div className="bg-slate-900/60 rounded-2xl p-4 border border-amber-500/30 space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-amber-400">
              {stats.paperlessMetrics.gradingMinutesSaved} {t.common.mins}
            </div>
            <div className="text-xs font-bold text-white">{t.progress.gradingHoursLabel}</div>
            <div className="text-[10px] text-slate-400">{t.progress.laborAssumptionShort}</div>
          </div>
        </div>
      </div>

      {/* School Baseline Configuration Panel & Documented Assumptions */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Sliders className="w-4 h-4 text-emerald-700" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">{t.progress.schoolBaselineHeading}</h3>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              {t.progress.schoolBaselineDesc}
            </p>
          </div>

          {/* Stepper Control */}
          <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 self-start md:self-auto">
            <button
              onClick={() => handleBaselineChange(baselineSheets - 1)}
              disabled={baselineSheets <= 1}
              className="w-8 h-8 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-800 font-bold flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
              aria-label="-"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="px-3 text-center">
              <span className="text-lg font-black text-slate-900 block leading-none">{baselineSheets}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {t.common.sheetsPerTest}
              </span>
            </div>

            <button
              onClick={() => handleBaselineChange(baselineSheets + 1)}
              disabled={baselineSheets >= 10}
              className="w-8 h-8 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 disabled:opacity-40 text-slate-800 font-bold flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
              aria-label="+"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Slider & Presets */}
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>{t.progress.baselineSheetsLabel}</span>
              <span className="text-teal-700 font-black">
                {baselineSheets} {t.common.sheets}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={baselineSheets}
              onChange={(e) => handleBaselineChange(parseInt(e.target.value, 10))}
              className="w-full accent-teal-600 cursor-pointer"
            />
            <p className="text-[11px] text-slate-500">{t.progress.baselineSheetsHelp}</p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500 me-1">
              {t.progress.quickPresetsLabel}
            </span>
            {[
              { label: t.progress.preset2, val: 2 },
              { label: t.progress.preset3, val: 3 },
              { label: t.progress.preset5, val: 5 },
            ].map((preset) => (
              <button
                key={preset.val}
                onClick={() => handleBaselineChange(preset.val)}
                className={`text-xs px-3 py-1.5 rounded-lg border font-semibold transition-colors cursor-pointer ${
                  baselineSheets === preset.val
                    ? 'bg-teal-50 border-teal-500 text-teal-800 font-bold'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Documented Assumptions Card */}
          <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
              <Info className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{t.progress.documentedAssumptionsTitle}</span>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600 pt-1">
              <li className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                  <span>{t.progress.waterCardTitle}</span>
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">{t.progress.assumptionWater}</p>
              </li>
              <li className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{t.progress.carbonCardTitle}</span>
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">{t.progress.assumptionCarbon}</p>
              </li>
              <li className="bg-white p-3 rounded-xl border border-slate-200/80 space-y-1">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>{t.progress.laborCardTitle}</span>
                </span>
                <p className="text-[11px] text-slate-500 leading-relaxed">{t.progress.assumptionLabor}</p>
              </li>
            </ul>
            <p className="text-[10px] text-slate-400 italic pt-1">{t.progress.assumptionCitation}</p>
          </div>
        </div>
      </div>

      {/* Multi-Assessment Progress & Growth Tracking (Real Comparison Over Time) */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600 shrink-0" />
              <span>{t.progress.assessmentComparisonHeading}</span>
            </h3>
            <p className="text-xs text-slate-500">{t.progress.assessmentComparisonDesc}</p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
            {t.progress.verifiedAttemptsBadge}
          </span>
        </div>

        {(() => {
          const topicGroups: Record<string, AssessmentResult[]> = {};
          assessments.forEach((a) => {
            const key = `${a.subject} • ${a.topic}`;
            if (!topicGroups[key]) topicGroups[key] = [];
            topicGroups[key].push(a);
          });
          Object.values(topicGroups).forEach((group) => group.sort((a, b) => a.timestamp - b.timestamp));

          const groupEntries = Object.entries(topicGroups);

          if (groupEntries.length === 0) {
            return <div className="text-center py-8 text-xs text-slate-400">{t.progress.emptyHistory}</div>;
          }

          return (
            <div className="space-y-4">
              {groupEntries.map(([, group], idx) => {
                const attemptsCount = group.length;
                const latest = group[group.length - 1];
                const previous = attemptsCount > 1 ? group[group.length - 2] : null;
                const scoreDelta = previous ? latest.percentage - previous.percentage : null;

                return (
                  <div key={idx} className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-bold uppercase text-teal-700">
                          {getSubjectLabel(latest.subject)}
                        </span>
                        <h4 className="font-bold text-sm sm:text-base text-slate-900">{latest.topic}</h4>
                        <span className="text-xs text-slate-500">
                          {attemptsCount}{' '}
                          {attemptsCount === 1 ? t.progress.attemptSingular : t.progress.attemptPlural}
                        </span>
                      </div>

                      {/* Growth Delta Indicator */}
                      {previous && scoreDelta !== null ? (
                        <div className="flex items-center gap-2 self-start sm:self-auto">
                          <div
                            className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 text-xs font-bold ${
                              scoreDelta > 0
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : scoreDelta < 0
                                ? 'bg-rose-50 border-rose-300 text-rose-800'
                                : 'bg-slate-100 border-slate-300 text-slate-800'
                            }`}
                          >
                            {scoreDelta > 0 && <ArrowUpRight className="w-4 h-4 text-emerald-600 stroke-[2.5]" />}
                            {scoreDelta < 0 && <ArrowDownRight className="w-4 h-4 text-rose-600 stroke-[2.5]" />}
                            <span>{scoreDelta > 0 ? `+${scoreDelta}%` : `${scoreDelta}%`}</span>
                            <span className="text-[11px] font-semibold opacity-90">
                              {scoreDelta > 0
                                ? t.progress.improvementDelta
                                : scoreDelta < 0
                                ? t.progress.declineDelta
                                : t.progress.noChangeDelta}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="self-start sm:self-auto flex flex-wrap items-center gap-2">
                          <span className="text-xs px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 font-semibold">
                            {t.progress.initialBaseline}
                          </span>
                          {onNavigateToAssessment && (
                            <button
                              onClick={onNavigateToAssessment}
                              className="text-xs px-3 py-1 rounded-full bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors cursor-pointer"
                            >
                              {t.progress.takeReAssessment}
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Compare Previous vs Latest */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {previous ? (
                        <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                          <div className="flex items-center justify-between text-slate-500 text-[11px]">
                            <span>{t.progress.previousAttempt}</span>
                            <span>{new Date(previous.timestamp).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between font-bold text-slate-800">
                            <span>{t.skillLevels[previous.skillLevel] || previous.skillLevelLabel}</span>
                            <span className="text-sm font-black">{previous.percentage}%</span>
                          </div>
                        </div>
                      ) : (
                        <div className="p-3 bg-white/70 rounded-xl border border-dashed border-slate-300 text-slate-500 text-[11px] flex items-center justify-center">
                          {t.progress.firstBenchmark}
                        </div>
                      )}

                      <div className="p-3 bg-white rounded-xl border border-teal-200 space-y-1 shadow-xs">
                        <div className="flex items-center justify-between text-teal-700 text-[11px] font-bold">
                          <span>{t.progress.latestAttempt}</span>
                          <span>{new Date(latest.timestamp).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between font-bold text-slate-900">
                          <span>{t.skillLevels[latest.skillLevel] || latest.skillLevelLabel}</span>
                          <span className="text-sm font-black text-teal-700">{latest.percentage}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Subtopic Shift comparison if multiple attempts */}
                    {previous && previous.subtopicBreakdown && latest.subtopicBreakdown && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block">
                          {t.progress.comparisonSubtopicShift}:
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                          {latest.subtopicBreakdown.map((latestSub, sIdx) => {
                            const prevSub = previous.subtopicBreakdown?.find(
                              (ps) => ps.subtopic === latestSub.subtopic
                            );
                            const prevPct = prevSub ? prevSub.percentage : null;
                            const diff = prevPct !== null ? latestSub.percentage - prevPct : null;

                            return (
                              <div
                                key={sIdx}
                                className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs space-y-1"
                              >
                                <div className="flex items-center justify-between font-semibold text-slate-800 text-[11px]">
                                  <span className="truncate me-1">{latestSub.subtopic}</span>
                                  <span className="font-bold">{latestSub.percentage}%</span>
                                </div>
                                {diff !== null && (
                                  <div
                                    className={`text-[10px] font-bold ${
                                      diff > 0
                                        ? 'text-emerald-700'
                                        : diff < 0
                                        ? 'text-rose-700'
                                        : 'text-slate-500'
                                    }`}
                                  >
                                    {diff > 0
                                      ? `▲ +${diff}% ${t.progress.gainedLabel}`
                                      : diff < 0
                                      ? `▼ ${diff}% ${t.progress.shiftLabel}`
                                      : `— ${t.progress.maintainedLabel}`}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* 4 Stats Highlights Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.assessmentsCompleted}</div>
            <div className="text-xs text-slate-500 font-medium">{t.dashboard.assessmentsCompleted}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {stats.averageAssessmentScore > 0 ? stats.averageAssessmentScore : stats.averageScore}%
            </div>
            <div className="text-xs text-slate-500 font-medium">{t.progress.avgDiagnosticScore}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">{stats.identifiedGapsCount}</div>
            <div className="text-xs text-slate-500 font-medium">{t.progress.gapsDetected}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900">
              {stats.studyStreakDays} {t.common.days}
            </div>
            <div className="text-xs text-slate-500 font-medium">{t.dashboard.studyStreak}</div>
          </div>
        </div>
      </div>

      {/* Subject-Wise Skill Measurement Breakdown */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-teal-600 shrink-0" />
              <span>{t.progress.subjectBreakdown}</span>
            </h3>
            <p className="text-xs text-slate-500">{t.progress.subjectMeasuredSub}</p>
          </div>

          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/80 self-start sm:self-auto">
            {t.progress.standardsCalibrated}
          </span>
        </div>

        <div className="space-y-5 pt-2">
          {Object.entries(stats.subjectMastery || {}).map(([subj, data], idx) => {
            const skillLevel: SkillLevel =
              data.latestSkillLevel ||
              (data.averageScore >= 90
                ? 'mastery'
                : data.averageScore >= 75
                ? 'proficient'
                : data.averageScore >= 60
                ? 'competent'
                : data.averageScore >= 40
                ? 'developing'
                : 'foundational');

            return (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{getSubjectLabel(subj)}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-teal-100 text-teal-800">
                      {t.skillLevels[skillLevel] || skillLevel}
                    </span>
                  </div>
                  <span className="text-slate-600 font-semibold">
                    {t.progress.scoreLabel} <strong className="text-teal-700">{data.averageScore}%</strong> (
                    {data.quizzesTaken + (data.assessmentsTaken || 0)} {t.progress.assessmentsWord})
                  </span>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${
                      data.averageScore >= 75
                        ? 'bg-emerald-500'
                        : data.averageScore >= 60
                        ? 'bg-teal-500'
                        : 'bg-amber-500'
                    }`}
                    style={{ width: `${Math.min(data.averageScore, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Diagnostic Assessment History Table */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Target className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{t.progress.assessmentHistoryHeading}</span>
          </h3>
          <span className="text-xs text-slate-400">
            {assessments.length} {t.progress.recordedTestsWord}
          </span>
        </div>

        {assessments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">{t.progress.colDate}</th>
                  <th className="py-3 px-4">{t.progress.colTopic}</th>
                  <th className="py-3 px-4">{t.progress.colSubject}</th>
                  <th className="py-3 px-4">{t.progress.colSkillLevel}</th>
                  <th className="py-3 px-4">{t.progress.colScore}</th>
                  <th className="py-3 px-4">{t.progress.colAction}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assessments.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {new Date(res.timestamp).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{res.topic}</td>
                    <td className="py-3 px-4 text-slate-600">{getSubjectLabel(res.subject)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full font-bold text-[11px] bg-teal-100 text-teal-800">
                        {t.skillLevels[res.skillLevel] || res.skillLevelLabel}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {res.score}/{res.totalQuestions} ({res.percentage}%)
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedAssessmentModal(res)}
                        className="text-teal-600 font-bold hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <span>{t.progress.viewGaps}</span>
                        <ArrowRight className="w-3 h-3 rtl:rotate-180" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-xs text-slate-400">{t.progress.emptyHistory}</div>
        )}
      </div>

      {/* Learning Milestones Badges */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Award className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{t.progress.badgesTitle}</span>
          </h3>
          <span className="text-xs text-teal-700 font-semibold">
            {milestones.filter((m) => m.achieved).length} / {milestones.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {milestones.map((m, i) => (
            <div
              key={i}
              className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 ${
                m.achieved
                  ? 'bg-teal-50/50 border-teal-200 text-slate-900'
                  : 'bg-slate-50/50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className={`p-2 rounded-lg shrink-0 ${m.achieved ? 'bg-white shadow-xs' : 'bg-slate-200'}`}>
                {m.icon}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900">{m.title}</div>
                <div className="text-[11px] text-slate-500 leading-snug">{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Footer: Export and Reset Controls */}
      <div className="bg-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
        <div className="text-xs text-slate-600 leading-relaxed text-center sm:text-start">
          {t.progress.localNote}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportData}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>{t.progress.exportData}</span>
          </button>

          <button
            onClick={handleResetProgress}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-red-50 border border-slate-200 text-red-600 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.progress.resetHistory}</span>
          </button>
        </div>
      </div>

      {/* Full Diagnostic Assessment Review Modal */}
      {selectedAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 gap-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {getSubjectLabel(selectedAssessmentModal.subject)}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(selectedAssessmentModal.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900">{selectedAssessmentModal.topic}</h3>
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                    {t.skillLevels[selectedAssessmentModal.skillLevel] ||
                      selectedAssessmentModal.skillLevelLabel}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {t.progress.scoreLabel} {selectedAssessmentModal.score}/
                    {selectedAssessmentModal.totalQuestions} ({selectedAssessmentModal.percentage}%)
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedAssessmentModal(null)}
                aria-label={t.common.close}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 flex items-center justify-center font-bold text-sm cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Identified Weak Subtopics Alert Banner */}
            {selectedAssessmentModal.weakSubtopics && selectedAssessmentModal.weakSubtopics.length > 0 && (
              <div className="bg-amber-50/90 border border-amber-300/80 rounded-xl p-3.5 space-y-1 text-xs">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                  <span>{t.assessment.weakSubtopicsTitle}:</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {selectedAssessmentModal.weakSubtopics.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[11px] font-semibold border border-amber-200"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
              <button
                onClick={() => setModalTab('questions')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  modalTab === 'questions'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t.progress.tabQuestions}
              </button>
              <button
                onClick={() => setModalTab('gaps')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  modalTab === 'gaps'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t.progress.tabGaps}
              </button>
              <button
                onClick={() => setModalTab('studyPlan')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                  modalTab === 'studyPlan'
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {t.progress.tabStudyPlan}
              </button>
            </div>

            {/* TAB 1: Questions Review */}
            {modalTab === 'questions' && (
              <div className="space-y-4">
                {selectedAssessmentModal.questions && selectedAssessmentModal.questions.length > 0 ? (
                  selectedAssessmentModal.questions.map((q, idx) => {
                    const ans = selectedAssessmentModal.answers[idx];
                    const selectedIdx = ans ? ans.selectedOptionIndex : -1;
                    const isCorrect = ans ? ans.isCorrect : false;
                    const studentAnswer =
                      selectedIdx >= 0 && q.options[selectedIdx]
                        ? q.options[selectedIdx]
                        : t.common.noOptionSelected;
                    const correctAnswer = q.options[q.correctAnswerIndex] || '—';
                    const isRtlQ =
                      isRtlLanguage(selectedAssessmentModal.language || language) ||
                      /[\u0590-\u08FF]/.test(q.question);

                    return (
                      <div
                        key={idx}
                        dir={isRtlQ ? 'rtl' : 'ltr'}
                        className={`p-4 rounded-xl border space-y-3 ${
                          isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <span className="font-bold text-slate-900">
                            {t.assessment.questionIndexLabel} {idx + 1} •{' '}
                            <span className="text-slate-500">{q.subtopic}</span>
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1 ${
                              isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {isCorrect ? (
                              <Check className="w-3 h-3 stroke-[3]" />
                            ) : (
                              <X className="w-3 h-3 stroke-[3]" />
                            )}
                            <span>{isCorrect ? t.common.correct : t.common.incorrect}</span>
                          </span>
                        </div>

                        <h5 className="font-semibold text-xs sm:text-sm text-slate-900">{q.question}</h5>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          <div
                            className={`p-2.5 rounded-lg border ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                                : 'bg-rose-50 border-rose-200 text-rose-950'
                            }`}
                          >
                            <span className="text-[10px] uppercase font-bold block opacity-75">
                              {t.assessment.studentSelectedAnswer}:
                            </span>
                            <span className="font-medium">{studentAnswer}</span>
                          </div>
                          <div className="p-2.5 rounded-lg border bg-emerald-50 border-emerald-200 text-emerald-950">
                            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                              {t.assessment.correctAnswerLabel}:
                            </span>
                            <span className="font-medium">{correctAnswer}</span>
                          </div>
                        </div>

                        <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs text-slate-600 space-y-0.5">
                          <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                            <Lightbulb className="w-3 h-3 text-amber-500 shrink-0" />
                            <span>{t.assessment.explanationLabel}</span>
                          </span>
                          <p>{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-slate-400">
                    {t.progress.noArchivedQuestions}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: AI Gap Analysis */}
            {modalTab === 'gaps' && (
              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                {selectedAssessmentModal.aiGapAnalysis ? (
                  <>
                    <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-100 text-slate-800 leading-relaxed">
                      <strong>{t.assessment.diagnosticOverviewPrefix} </strong>
                      {selectedAssessmentModal.aiGapAnalysis.summary}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-200 space-y-1.5">
                        <span className="font-bold text-emerald-900 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{t.assessment.strengthsHeading}</span>
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                          {selectedAssessmentModal.aiGapAnalysis.strengths.map((str, i) => (
                            <li key={i}>{str}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-200 space-y-1.5">
                        <span className="font-bold text-amber-900 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                          <span>{t.assessment.knowledgeGapsHeading}</span>
                        </span>
                        <ul className="list-disc list-inside space-y-1 text-slate-600">
                          {selectedAssessmentModal.aiGapAnalysis.knowledgeGaps.map((gap, i) => (
                            <li key={i}>{gap}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">{t.progress.noGapReport}</div>
                )}
              </div>
            )}

            {/* TAB 3: 7-Day Remedial Plan */}
            {modalTab === 'studyPlan' && (
              <div className="space-y-3">
                {selectedAssessmentModal.aiGapAnalysis?.sevenDayPlan &&
                selectedAssessmentModal.aiGapAnalysis.sevenDayPlan.length > 0 ? (
                  selectedAssessmentModal.aiGapAnalysis.sevenDayPlan.map((d) => (
                    <div
                      key={d.day}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-teal-700">{d.dayLabel}</span>
                        <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">
                          {d.estimatedMinutes} {t.common.mins} • {d.actionType}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 text-xs sm:text-sm">{d.topic}</div>
                      <p className="text-slate-600 leading-relaxed text-[11px]">{d.shortExplanation}</p>
                      <div className="text-[11px] text-teal-900 font-medium pt-0.5">
                        <strong>{t.progress.practicePrefix} </strong>
                        {d.practiceActivity}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-xs text-slate-400">{t.progress.noStudyPlan}</div>
                )}
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedAssessmentModal(null)}
                className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs cursor-pointer"
              >
                {t.common.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
