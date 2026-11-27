import React, { useState } from 'react';
import {
  Language,
  DiagnosticAssessment,
  AssessmentResult,
  LearningGapAnalysis,
  ActiveTab,
} from '../types';
import { useTranslation } from '../lib/TranslationContext';
import { getPromptLanguageName, isRtlLanguage } from '../lib/languages';
import { storage, calculateSkillLevel } from '../lib/storage';
import { LanguageSelector } from './LanguageSelector';
import {
  Target,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  RotateCcw,
  Layers,
  BrainCircuit,
  FileCheck2,
  Leaf,
  Clock,
  MessageSquare,
  BookOpen,
  AlertCircle,
  Lightbulb,
  Calendar,
} from 'lucide-react';

interface AssessmentViewProps {
  initialTopic?: string;
  initialSubject?: string;
  language?: Language;
  setLanguage?: (lang: Language) => void;
  isOnline: boolean;
  onNavigateToTool: (tab: ActiveTab, prefillTopic?: string, prefillSubject?: string) => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  initialTopic,
  initialSubject,
  isOnline,
  onNavigateToTool,
}) => {
  const { language, t, isRtl } = useTranslation();

  // Form State
  const [topic, setTopic] = useState(initialTopic || '');
  const [subject, setSubject] = useState(initialSubject || 'Biology');
  const [numQuestions, setNumQuestions] = useState<number>(4);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzingGaps, setIsAnalyzingGaps] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Assessment State
  const [currentAssessment, setCurrentAssessment] = useState<DiagnosticAssessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(null);
  const [selectedPlanDay, setSelectedPlanDay] = useState<number>(1);

  const sampleSubjects = [
    { value: 'Biology', label: t.subjects.biology },
    { value: 'Physics', label: t.subjects.physics },
    { value: 'Mathematics', label: t.subjects.mathematics },
    { value: 'Chemistry', label: t.subjects.chemistry },
    { value: 'General Science', label: t.subjects.generalScience },
    { value: 'History & Geography', label: t.subjects.historyGeography },
    { value: 'English Grammar', label: t.subjects.englishGrammar },
  ];

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

  const suggestedAssessments = [
    { title: t.assessment.suggestedTopic1, subject: 'Biology' },
    { title: t.assessment.suggestedTopic2, subject: 'Biology' },
    { title: t.assessment.suggestedTopic3, subject: 'Physics' },
    { title: t.assessment.suggestedTopic4, subject: 'Mathematics' },
    { title: t.assessment.suggestedTopic5, subject: 'General Science' },
  ];

  const handleGenerateAssessment = async () => {
    if (!topic.trim()) {
      setErrorMsg(t.assessment.errorEmptyTopic);
      return;
    }

    if (!isOnline) {
      setErrorMsg(t.assessment.errorOffline);
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setAssessmentResult(null);
    setSelectedPlanDay(1);

    try {
      const res = await fetch('/api/assessment/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          subject,
          language,
          languageName: getPromptLanguageName(language),
          numQuestions,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t.assessment.errorGenerateFailed);
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error(t.assessment.errorGenerateFailed);
      }

      setCurrentAssessment(data);
      storage.saveAssessment(data);
    } catch (err: unknown) {
      console.error('Assessment generation error:', err);
      const message = err instanceof Error ? err.message : t.assessment.errorGenerateFailed;
      setErrorMsg(message || t.assessment.errorGenerateFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (qIdx: number, optIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIdx]: optIdx,
    }));
  };

  const handleSubmitAssessment = async () => {
    if (!currentAssessment) return;

    let correctCount = 0;
    const subtopicStats: Record<string, { correct: number; total: number }> = {};

    const answersList = currentAssessment.questions.map((q, idx) => {
      const selected = selectedAnswers[idx] ?? -1;
      const isCorrect = selected === q.correctAnswerIndex;
      if (isCorrect) correctCount++;

      const sub = q.subtopic || 'Core Concept';
      if (!subtopicStats[sub]) {
        subtopicStats[sub] = { correct: 0, total: 0 };
      }
      subtopicStats[sub].total += 1;
      if (isCorrect) {
        subtopicStats[sub].correct += 1;
      }

      return {
        questionIndex: idx,
        selectedOptionIndex: selected,
        isCorrect,
        subtopic: q.subtopic,
        skillTested: q.skillTested,
      };
    });

    const total = currentAssessment.questions.length;
    const percentage = Math.round((correctCount / total) * 100);
    const skillData = calculateSkillLevel(percentage);

    const subtopicBreakdown = Object.entries(subtopicStats).map(([sub, stats]) => ({
      subtopic: sub,
      correct: stats.correct,
      total: stats.total,
      percentage: Math.round((stats.correct / stats.total) * 100),
    }));

    const weakSubs = Array.from(
      new Set(answersList.filter((a) => !a.isCorrect && a.subtopic).map((a) => a.subtopic))
    );

    setIsSubmitted(true);
    setIsAnalyzingGaps(true);

    let gapAnalysis: LearningGapAnalysis | undefined = undefined;

    try {
      const targetLanguage = currentAssessment.language || language;
      const res = await fetch('/api/assessment/analyze-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: currentAssessment.topic,
          subject: currentAssessment.subject,
          language: targetLanguage,
          languageName: getPromptLanguageName(targetLanguage),
          score: correctCount,
          totalQuestions: total,
          percentage,
          answers: answersList,
          questions: currentAssessment.questions,
        }),
      });

      if (res.ok) {
        gapAnalysis = await res.json();
      }
    } catch (e) {
      console.warn('AI Gap Analysis failed or unavailable, continuing with calculated metrics', e);
    } finally {
      setIsAnalyzingGaps(false);
    }

    const result: AssessmentResult = {
      id: 'result-' + Date.now(),
      assessmentId: currentAssessment.id,
      title: currentAssessment.title,
      topic: currentAssessment.topic,
      subject: currentAssessment.subject,
      language: currentAssessment.language,
      timestamp: Date.now(),
      score: correctCount,
      totalQuestions: total,
      percentage,
      skillLevel: skillData.level,
      skillLevelLabel: t.skillLevels[skillData.level] || skillData.labelEn,
      answers: answersList,
      subtopicBreakdown,
      weakSubtopics: weakSubs,
      questions: currentAssessment.questions,
      aiGapAnalysis: gapAnalysis,
    };

    setAssessmentResult(result);
    storage.saveAssessmentResult(result);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setAssessmentResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5 text-teal-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0f2b46]">{t.assessment.title}</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">{t.assessment.subtitle}</p>
        </div>

        {/* Paperless & Language Controls */}
        <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-semibold">
            <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{t.assessment.zeroPaperWaste}</span>
          </div>

          <LanguageSelector variant="header" />
        </div>
      </div>

      {/* Creation View */}
      {!currentAssessment && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Paperless Assessment & Self-Measurement Callout */}
          <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-teal-50 rounded-2xl p-5 border border-teal-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h3 className="font-bold text-slate-900 text-sm">{t.assessment.wasteCalloutTitle}</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  {t.assessment.wasteCalloutDesc}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Curriculum Suggestions */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>{t.assessment.suggestionsHeading}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestedAssessments.map((sa, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTopic(sa.title);
                    setSubject(sa.subject);
                  }}
                  className="text-xs bg-slate-50 hover:bg-teal-50 hover:border-teal-400 text-slate-700 py-1.5 px-3 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                >
                  {sa.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Topic Input */}
            <div className="md:col-span-2 space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.assessment.topicLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t.assessment.topicPlaceholder}
                dir={isRtl ? 'rtl' : 'ltr'}
                className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl px-4 py-2.5 text-sm text-slate-900"
              />
            </div>

            {/* Subject Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.assessment.subjectLabel}
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl px-3 py-2.5 text-sm text-slate-900"
              >
                {sampleSubjects.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Number of Calibrated Questions */}
          <div className="space-y-1.5 max-w-xs">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.assessment.questionDepthLabel}
            </label>
            <div className="flex gap-2">
              {[4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setNumQuestions(num)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                    numQuestions === num
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {num} {t.assessment.questionsWord}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2">
            <button
              onClick={handleGenerateAssessment}
              disabled={isLoading || !topic.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.assessment.generating}</span>
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 text-teal-200" />
                  <span>{t.assessment.generateButton}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Active Assessment Taking Interface */}
      {currentAssessment && !isSubmitted && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
                {getSubjectLabel(currentAssessment.subject)} • {t.assessment.diagnosticCheckBadge}
              </span>
              <h2 className="text-xl font-black text-[#0f2b46]">{currentAssessment.title}</h2>
            </div>

            <div className="text-end shrink-0">
              <span className="text-xs text-slate-500 font-semibold block">
                {t.assessment.questionNumber}
              </span>
              <span className="text-lg font-black text-teal-700">
                {currentQuestionIndex + 1} / {currentAssessment.questions.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-teal-600 h-2 transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / currentAssessment.questions.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* Question Details with Subtopic & Tested Skill */}
          {(() => {
            const q = currentAssessment.questions[currentQuestionIndex];
            const isRtlQ =
              isRtlLanguage(currentAssessment.language || language) ||
              /[\u0590-\u08FF]/.test(q.question);
            const selectedOpt = selectedAnswers[currentQuestionIndex];

            return (
              <div className="space-y-6 py-2" dir={isRtlQ ? 'rtl' : 'ltr'}>
                {/* Cognitive Dimensions Tags */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200/60">
                    <strong>{t.assessment.subtopicLabel}:</strong> {q.subtopic}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-teal-50 text-teal-800 text-[11px] font-semibold border border-teal-200/60">
                    <strong>{t.assessment.skillTestedLabel}:</strong> {q.skillTested}
                  </span>
                </div>

                {/* Question Statement */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  <span className="text-teal-700 me-2">
                    {t.common.questionShort}
                    {currentQuestionIndex + 1}.
                  </span>
                  {q.question}
                </h3>

                {/* 4 Options */}
                <div className="space-y-3">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = selectedOpt === optIdx;
                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleOptionSelect(currentQuestionIndex, optIdx)}
                        className={`w-full text-start p-4 rounded-xl border-2 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'border-teal-600 bg-teal-50/70 text-teal-950 font-semibold shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="text-sm">{opt}</span>
                        </div>

                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isSelected ? 'border-teal-600 bg-teal-600 text-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* Navigation and Submit */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
              <span>{t.assessment.prevQuestion}</span>
            </button>

            {currentQuestionIndex < currentAssessment.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0f2b46] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.assessment.nextQuestion}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180" />
              </button>
            ) : (
              <button
                onClick={handleSubmitAssessment}
                disabled={Object.keys(selectedAnswers).length < currentAssessment.questions.length}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>{t.assessment.submitAssessment}</span>
                <Check className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Analyzing Gaps Loading Overlay */}
      {isSubmitted && isAnalyzingGaps && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center animate-spin">
            <BrainCircuit className="w-8 h-8 text-teal-600" />
          </div>
          <h3 className="text-base font-bold text-slate-800">{t.assessment.analyzingGaps}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">{t.assessment.analyzingSubtext}</p>
        </div>
      )}

      {/* Assessment Results, Skill Measurement & AI Gap Analysis */}
      {isSubmitted && !isAnalyzingGaps && assessmentResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Main Calibrated Score & Skill Level Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
              <div className="space-y-1 text-center md:text-start">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-widest block">
                  {t.assessment.resultTitle}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0f2b46]">
                  {assessmentResult.title}
                </h2>
                <p className="text-xs text-slate-500">
                  {getSubjectLabel(assessmentResult.subject)} •{' '}
                  {new Date(assessmentResult.timestamp).toLocaleString()}
                </p>
              </div>

              {/* Skill Badge */}
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-center shrink-0 min-w-[200px]">
                <span className="text-[10px] uppercase font-bold text-teal-800 tracking-wider block mb-1">
                  {t.assessment.measuredSkillLevel}
                </span>
                <div className="text-xl font-black text-teal-900">
                  {t.skillLevels[assessmentResult.skillLevel] || assessmentResult.skillLevelLabel}
                </div>
                <div className="text-sm font-bold text-teal-700 mt-1">
                  {assessmentResult.score} / {assessmentResult.totalQuestions} ({assessmentResult.percentage}%)
                </div>
              </div>
            </div>

            {/* Subtopic Performance Breakdown */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#0f2b46] flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-600" />
                <span>{t.assessment.subtopicPerformance}</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {assessmentResult.subtopicBreakdown.map((sb, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                      <span className="truncate me-2">{sb.subtopic}</span>
                      <span className={sb.percentage >= 75 ? 'text-emerald-700' : 'text-amber-700'}>
                        {sb.correct}/{sb.total} ({sb.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${
                          sb.percentage >= 75 ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${sb.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Paperless Impact Averted Waste Card with Configured School Baseline */}
            {(() => {
              const baseline = storage.getBaselineSheets();
              const waterLiters = baseline * 10;
              const carbonGrams = Math.round(baseline * 4.5);
              return (
                <div className="bg-emerald-50/70 rounded-2xl p-4 sm:p-5 border border-emerald-200 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                      <Leaf className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{t.assessment.paperlessTestTitle}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md self-start sm:self-auto">
                      {t.assessment.schoolBaselineLabel} {baseline} {t.common.sheetsPerTest}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 pt-1">
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                      <span className="font-bold text-emerald-800 block text-sm">
                        {baseline} {t.common.sheets}
                      </span>
                      <span className="text-[11px] text-slate-500">{t.assessment.paperSheetsSaved}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                      <span className="font-bold text-emerald-800 block text-sm">
                        {waterLiters} {t.common.liters}
                      </span>
                      <span className="text-[11px] text-slate-500">{t.assessment.waterFootprintSaved}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                      <span className="font-bold text-emerald-800 block text-sm">
                        {carbonGrams} {t.common.grams}
                      </span>
                      <span className="text-[11px] text-slate-500">{t.assessment.co2Averted}</span>
                    </div>
                    <div className="bg-white p-2.5 rounded-xl border border-emerald-200/80">
                      <span className="font-bold text-emerald-800 block text-sm">
                        3.5 {t.common.mins}
                      </span>
                      <span className="text-[11px] text-slate-500">{t.assessment.gradingLaborSaved}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Identified Weak Subtopics Alert Banner */}
          {assessmentResult.weakSubtopics && assessmentResult.weakSubtopics.length > 0 && (
            <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-5 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0" />
                <h3 className="font-bold text-amber-900 text-sm">{t.assessment.weakSubtopicsTitle}</h3>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">{t.assessment.weakSubtopicsDesc}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {assessmentResult.weakSubtopics.map((sub, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Question-by-Question Diagnostic Review */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-2">
              <div>
                <h3 className="text-lg font-bold text-[#0f2b46] flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>{t.assessment.detailedQuestionReview}</span>
                </h3>
                <p className="text-xs text-slate-500">{t.assessment.reviewSubtitle}</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
                {assessmentResult.score} / {assessmentResult.totalQuestions} {t.assessment.correctCountLabel}
              </span>
            </div>

            <div className="space-y-6">
              {(assessmentResult.questions || currentAssessment?.questions || []).map((q, idx) => {
                const answerRecord = assessmentResult.answers[idx];
                const selectedOptIdx = answerRecord ? answerRecord.selectedOptionIndex : -1;
                const isCorrect = answerRecord ? answerRecord.isCorrect : false;
                const studentAnswerText =
                  selectedOptIdx >= 0 && q.options[selectedOptIdx]
                    ? q.options[selectedOptIdx]
                    : t.common.noOptionSelected;
                const correctAnswerText = q.options[q.correctAnswerIndex] || '—';
                const isRtlQ =
                  isRtlLanguage(assessmentResult.language || language) ||
                  /[\u0590-\u08FF]/.test(q.question);

                return (
                  <div
                    key={q.id || idx}
                    dir={isRtlQ ? 'rtl' : 'ltr'}
                    className={`rounded-2xl p-5 border-2 transition-all space-y-4 ${
                      isCorrect
                        ? 'bg-emerald-50/30 border-emerald-200'
                        : 'bg-rose-50/30 border-rose-200'
                    }`}
                  >
                    {/* Question Header & Tags */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center ${
                            isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <span className="font-bold text-xs text-slate-800">
                          {t.assessment.questionIndexLabel} {idx + 1}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 text-[11px] font-semibold border border-blue-200/60">
                          {q.subtopic}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-md bg-purple-50 text-purple-800 text-[11px] font-semibold border border-purple-200/60">
                          {q.skillTested}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold inline-flex items-center gap-1 ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>{t.assessment.statusCorrect}</span>
                            </>
                          ) : (
                            <>
                              <X className="w-3 h-3 stroke-[3]" />
                              <span>{t.assessment.statusIncorrect}</span>
                            </>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Question Statement */}
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {q.question}
                    </h4>

                    {/* Compare Answers Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                      {/* Student's Selected Answer */}
                      <div
                        className={`p-3 rounded-xl border ${
                          isCorrect
                            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                            : 'bg-rose-50/70 border-rose-200 text-rose-950'
                        }`}
                      >
                        <div className="text-[10px] uppercase font-bold tracking-wider mb-1 opacity-75">
                          {t.assessment.studentSelectedAnswer}:
                        </div>
                        <div className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                              isCorrect ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                            }`}
                          >
                            {selectedOptIdx >= 0 ? String.fromCharCode(65 + selectedOptIdx) : '—'}
                          </span>
                          <span>{studentAnswerText}</span>
                        </div>
                      </div>

                      {/* Correct Answer */}
                      <div className="p-3 rounded-xl border bg-emerald-50/70 border-emerald-200 text-emerald-950">
                        <div className="text-[10px] uppercase font-bold tracking-wider mb-1 text-emerald-800">
                          {t.assessment.correctAnswerLabel}:
                        </div>
                        <div className="text-xs sm:text-sm font-semibold flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                            {String.fromCharCode(65 + q.correctAnswerIndex)}
                          </span>
                          <span>{correctAnswerText}</span>
                        </div>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-[#0f2b46] flex items-center gap-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>{t.assessment.explanationLabel}</span>
                      </div>
                      <p className="leading-relaxed text-slate-600">{q.explanation}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Learning Gap Detector Card */}
          {assessmentResult.aiGapAnalysis && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-200">
                <h3 className="text-lg font-bold text-[#0f2b46] flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>{t.assessment.gapAnalysisTitle}</span>
                </h3>
                <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                  {t.common.poweredByGemini}
                </span>
              </div>

              {/* Summary */}
              <div className="bg-teal-50/60 p-4 rounded-xl border border-teal-100 text-xs sm:text-sm text-slate-800 leading-relaxed">
                <strong>{t.assessment.diagnosticOverviewPrefix} </strong>
                {assessmentResult.aiGapAnalysis.summary}
              </div>

              {/* Strengths & Weaknesses 2-Col */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200 space-y-2">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.assessment.strengthsHeading}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {assessmentResult.aiGapAnalysis.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Knowledge Gaps */}
                <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-200 space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>{t.assessment.knowledgeGapsHeading}</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {assessmentResult.aiGapAnalysis.knowledgeGaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <X className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Remedial Actions Linking to Tutor & Notes */}
              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold text-[#0f2b46] flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>{t.assessment.recommendedActionsHeading}</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {assessmentResult.aiGapAnalysis.recommendedRemedies.map((remedy, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between hover:border-teal-400 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800 inline-block">
                          {remedy.actionType}
                        </span>
                        <h5 className="font-bold text-xs sm:text-sm text-slate-900">{remedy.title}</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">{remedy.description}</p>
                      </div>

                      <div className="pt-3">
                        <button
                          onClick={() => {
                            if (remedy.actionType === 'tutor') {
                              onNavigateToTool('tutor', remedy.prefillTopic, remedy.prefillSubject);
                            } else if (remedy.actionType === 'notes') {
                              onNavigateToTool('notes', remedy.prefillTopic, remedy.prefillSubject);
                            } else {
                              onNavigateToTool('quiz', remedy.prefillTopic, remedy.prefillSubject);
                            }
                          }}
                          className="w-full py-1.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {remedy.actionType === 'tutor' && <MessageSquare className="w-3.5 h-3.5" />}
                          {remedy.actionType === 'notes' && <BookOpen className="w-3.5 h-3.5" />}
                          {remedy.actionType === 'quiz' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          <span>{t.assessment.startRemedyNow}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personalized 7-Day Remedial Study Plan */}
              {assessmentResult.aiGapAnalysis.sevenDayPlan &&
                assessmentResult.aiGapAnalysis.sevenDayPlan.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h4 className="text-base font-bold text-[#0f2b46] flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-teal-600 shrink-0" />
                          <span>{t.assessment.sevenDayPlanTitle}</span>
                        </h4>
                        <p className="text-xs text-slate-500">{t.assessment.sevenDayPlanSubtitle}</p>
                      </div>
                      <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-auto">
                        {t.assessment.calibratedFor}{' '}
                        {t.skillLevels[assessmentResult.skillLevel] || assessmentResult.skillLevelLabel}
                      </span>
                    </div>

                    {/* Day Selector Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                      {assessmentResult.aiGapAnalysis.sevenDayPlan.map((item) => (
                        <button
                          key={item.day}
                          onClick={() => setSelectedPlanDay(item.day)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                            selectedPlanDay === item.day
                              ? 'bg-teal-600 text-white shadow-sm'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {t.assessment.dayLabelPrefix} {item.day}
                        </button>
                      ))}
                    </div>

                    {/* Active Day Detail Card */}
                    {(() => {
                      const activeDayPlan =
                        assessmentResult.aiGapAnalysis.sevenDayPlan.find(
                          (p) => p.day === selectedPlanDay
                        ) || assessmentResult.aiGapAnalysis.sevenDayPlan[0];
                      if (!activeDayPlan) return null;

                      return (
                        <div className="bg-gradient-to-br from-teal-50/70 via-white to-slate-50 rounded-2xl p-5 sm:p-6 border-2 border-teal-300 space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <span className="text-xs font-bold uppercase tracking-wider text-teal-700 block">
                                {activeDayPlan.dayLabel}
                              </span>
                              <h5 className="text-base sm:text-lg font-black text-slate-900">
                                {activeDayPlan.topic}
                              </h5>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-lg bg-teal-100 text-teal-800 text-xs font-bold flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5" />
                                <span>
                                  {activeDayPlan.estimatedMinutes} {t.common.mins}
                                </span>
                              </span>
                              <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                                {activeDayPlan.actionType}
                              </span>
                            </div>
                          </div>

                          <div className="p-4 rounded-xl bg-white border border-teal-100 text-xs sm:text-sm text-slate-700 space-y-1 leading-relaxed">
                            <strong className="text-teal-900 block">{t.assessment.coreConceptFocus}</strong>
                            <p>{activeDayPlan.shortExplanation}</p>
                          </div>

                          <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-slate-800 space-y-1">
                            <strong className="text-slate-900 block flex items-center gap-1.5">
                              <Target className="w-4 h-4 text-teal-600 shrink-0" />
                              <span>{t.assessment.dailyPracticeActivity}</span>
                            </strong>
                            <p className="text-slate-600">{activeDayPlan.practiceActivity}</p>
                          </div>

                          <div className="pt-2 flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => {
                                if (activeDayPlan.actionType === 'tutor') {
                                  onNavigateToTool('tutor', activeDayPlan.topic, assessmentResult.subject);
                                } else if (activeDayPlan.actionType === 'notes') {
                                  onNavigateToTool('notes', activeDayPlan.topic, assessmentResult.subject);
                                } else {
                                  onNavigateToTool('quiz', activeDayPlan.topic, assessmentResult.subject);
                                }
                              }}
                              className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-colors cursor-pointer"
                            >
                              {activeDayPlan.actionType === 'tutor' && <MessageSquare className="w-4 h-4" />}
                              {activeDayPlan.actionType === 'notes' && <BookOpen className="w-4 h-4" />}
                              {activeDayPlan.actionType === 'quiz' && <CheckCircle2 className="w-4 h-4" />}
                              {activeDayPlan.actionType === 'guide' && <Target className="w-4 h-4" />}
                              <span>{t.assessment.launchActivity}</span>
                            </button>

                            {selectedPlanDay < 7 && (
                              <button
                                onClick={() => setSelectedPlanDay((prev) => Math.min(7, prev + 1))}
                                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                              >
                                <span>{t.assessment.viewNextDay}</span>
                                <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180 shrink-0" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* 7-Day Roadmap Mini Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2">
                      {assessmentResult.aiGapAnalysis.sevenDayPlan.map((d) => (
                        <button
                          key={d.day}
                          onClick={() => setSelectedPlanDay(d.day)}
                          className={`text-start p-2.5 rounded-xl border transition-all cursor-pointer ${
                            selectedPlanDay === d.day
                              ? 'border-teal-500 bg-teal-50 shadow-xs'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                            <span className="text-teal-700">
                              {t.assessment.dayLabelPrefix} {d.day}
                            </span>
                            <span className="text-slate-400 text-[10px]">{d.estimatedMinutes}m</span>
                          </div>
                          <div className="font-semibold text-xs text-slate-900 line-clamp-2 leading-snug">
                            {d.topic}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

              {/* 3-Step Immediate Quick Plan */}
              {assessmentResult.aiGapAnalysis.studyPlan && (
                <div className="space-y-3 pt-3 border-t border-slate-200">
                  <h4 className="text-sm font-bold text-[#0f2b46] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{t.assessment.studyPlanHeading}</span>
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {assessmentResult.aiGapAnalysis.studyPlan.map((step) => (
                      <div
                        key={step.stepNumber}
                        className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-teal-700">
                            {t.common.step} {step.stepNumber}
                          </span>
                          <span className="text-[11px] text-slate-500 font-semibold">
                            {step.estimatedMinutes} {t.common.mins}
                          </span>
                        </div>
                        <div className="font-bold text-xs text-slate-900">{step.goal}</div>
                        <div className="text-[11px] text-slate-500">{step.method}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetake}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.assessment.retakeButton}</span>
            </button>

            <button
              onClick={() => {
                setCurrentAssessment(null);
                setIsSubmitted(false);
              }}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
            >
              <Target className="w-4 h-4 text-teal-200" />
              <span>{t.assessment.createNewButton}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
