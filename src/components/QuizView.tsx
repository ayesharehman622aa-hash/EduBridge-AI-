import React, { useState } from 'react';
import { Language, Quiz, QuizAttempt } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import { getPromptLanguageName, isRtlLanguage } from '../lib/languages';
import { storage } from '../lib/storage';
import { LanguageSelector } from './LanguageSelector';
import {
  CheckCircle2,
  Trophy,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

interface QuizViewProps {
  initialTopic?: string;
  initialSubject?: string;
  language?: Language;
  setLanguage?: (lang: Language) => void;
  isOnline: boolean;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialTopic,
  initialSubject,
  isOnline,
}) => {
  const { language, t, isRtl } = useTranslation();

  // Form State
  const [topic, setTopic] = useState(initialTopic || '');
  const [subject, setSubject] = useState(initialSubject || 'General Science');
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [numQuestions, setNumQuestions] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active Quiz State
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [quizAttemptResult, setQuizAttemptResult] = useState<QuizAttempt | null>(null);

  const sampleSubjects = [
    { value: 'General Science', label: t.subjects.generalScience },
    { value: 'Biology', label: t.subjects.biology },
    { value: 'Physics', label: t.subjects.physics },
    { value: 'Chemistry', label: t.subjects.chemistry },
    { value: 'Mathematics', label: t.subjects.mathematics },
    { value: 'History & Geography', label: t.subjects.historyGeography },
    { value: 'English Grammar', label: t.subjects.englishGrammar },
    { value: 'Urdu Grammar', label: t.subjects.urduGrammar },
  ];

  const popularQuizTopics = [
    { title: t.quiz.suggestedTopic1, subject: 'Biology' },
    { title: t.quiz.suggestedTopic2, subject: 'Physics' },
    { title: t.quiz.suggestedTopic3, subject: 'Mathematics' },
    { title: t.quiz.suggestedTopic4, subject: 'General Science' },
    { title: t.quiz.suggestedTopic5, subject: 'Earth Science' },
  ];

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) {
      setErrorMsg(t.quiz.errorEmptyTopic);
      return;
    }

    if (!isOnline) {
      setErrorMsg(t.quiz.errorOffline);
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setIsSubmitted(false);
    setSelectedAnswers({});
    setShowHints({});
    setCurrentQuestionIndex(0);
    setQuizAttemptResult(null);

    try {
      const res = await fetch('/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          subject,
          difficulty,
          numQuestions,
          language,
          languageName: getPromptLanguageName(language),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t.quiz.errorGenerateFailed);
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error(t.quiz.errorGenerateFailed);
      }

      setCurrentQuiz(data);
      storage.saveQuiz(data);
    } catch (err: unknown) {
      console.error('Quiz generation error:', err);
      const errMessage = err instanceof Error ? err.message : '';
      setErrorMsg(errMessage || t.quiz.errorGenerateFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (qIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [qIndex]: optionIndex,
    }));
  };

  const toggleHint = (qIndex: number) => {
    setShowHints((prev) => ({
      ...prev,
      [qIndex]: !prev[qIndex],
    }));
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;

    let correctCount = 0;
    const answersList = currentQuiz.questions.map((q, idx) => {
      const selected = selectedAnswers[idx] ?? -1;
      const isCorrect = selected === q.correctAnswerIndex;
      if (isCorrect) correctCount++;
      return {
        questionIndex: idx,
        selectedOptionIndex: selected,
        isCorrect,
      };
    });

    const total = currentQuiz.questions.length;
    const percentage = Math.round((correctCount / total) * 100);

    const attempt: QuizAttempt = {
      id: 'attempt-' + Date.now(),
      quizId: currentQuiz.id,
      topic: currentQuiz.topic,
      subject: currentQuiz.subject,
      difficulty: currentQuiz.difficulty,
      language: currentQuiz.language,
      timestamp: Date.now(),
      score: correctCount,
      totalQuestions: total,
      percentage,
      answers: answersList,
    };

    setQuizAttemptResult(attempt);
    setIsSubmitted(true);
    storage.saveQuizAttempt(attempt);
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setShowHints({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setQuizAttemptResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-teal-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0f2b46]">
              {t.quiz.title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            {t.quiz.subtitle}
          </p>
        </div>

        {/* Language Selector */}
        <div className="self-start md:self-center">
          <LanguageSelector variant="header" />
        </div>
      </div>

      {/* Quiz Creation Form */}
      {!currentQuiz && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Quick Pre-made topic shortcuts */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>{t.quiz.suggestionsHeading}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {popularQuizTopics.map((pt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setTopic(pt.title);
                    setSubject(pt.subject);
                  }}
                  className="text-xs bg-slate-50 hover:bg-teal-50 hover:border-teal-400 text-slate-700 py-1.5 px-3 rounded-lg border border-slate-200 transition-colors cursor-pointer text-start"
                >
                  {pt.title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topic Input */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.quiz.topicLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={t.quiz.topicPlaceholder}
                dir={isRtl ? 'rtl' : 'ltr'}
                className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl px-4 py-2.5 text-sm text-slate-900"
              />
            </div>

            {/* Subject Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.quiz.subjectLabel}
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

            {/* Difficulty Select */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.quiz.difficultyLabel}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl px-3 py-2.5 text-sm text-slate-900"
              >
                <option value="beginner">{t.quiz.difficultyLevels.beginner}</option>
                <option value="intermediate">{t.quiz.difficultyLevels.intermediate}</option>
                <option value="advanced">{t.quiz.difficultyLevels.advanced}</option>
              </select>
            </div>

            {/* Number of Questions */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.quiz.numQuestionsLabel}
              </label>
              <div className="flex gap-2">
                {[3, 5, 8, 10].map((num) => (
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
                    {num}
                  </button>
                ))}
              </div>
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
              onClick={handleGenerateQuiz}
              disabled={isLoading || !topic.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t.quiz.generating}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-200 shrink-0" />
                  <span>{t.quiz.generateButton}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Active Interactive Quiz Solver */}
      {currentQuiz && !isSubmitted && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn">
          {/* Progress Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div className="min-w-0">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">
                {currentQuiz.subject} • {t.quiz.difficultyLevels[currentQuiz.difficulty] || currentQuiz.difficulty}
              </span>
              <h2 className="text-xl font-black text-[#0f2b46]">
                {currentQuiz.topic}
              </h2>
            </div>

            <div className="text-end shrink-0">
              <span className="text-xs text-slate-500 font-semibold block">
                {t.quiz.questionProgress}
              </span>
              <span className="text-lg font-black text-teal-700">
                {currentQuestionIndex + 1} / {currentQuiz.questions.length}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-teal-600 h-2 transition-all duration-300"
              style={{
                width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`,
              }}
            ></div>
          </div>

          {/* Current Question Body */}
          {(() => {
            const q = currentQuiz.questions[currentQuestionIndex];
            const isRtlQ = isRtlLanguage(currentQuiz.language) || /[\u0590-\u08FF]/.test(q.question);
            const selectedOpt = selectedAnswers[currentQuestionIndex];

            return (
              <div dir={isRtlQ ? 'rtl' : 'ltr'} className="space-y-6 py-2">
                {/* Question Statement */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className={`text-base sm:text-lg font-bold text-slate-900 leading-snug ${currentQuiz.language === 'ur' ? 'font-urdu' : ''}`}>
                      <span className="text-teal-700 me-2">
                        {t.common.questionShort}{currentQuestionIndex + 1}.
                      </span>
                      {q.question}
                    </h3>

                    {q.hint && (
                      <button
                        onClick={() => toggleHint(currentQuestionIndex)}
                        className="shrink-0 p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 border border-amber-200 text-xs flex items-center gap-1 transition-colors cursor-pointer"
                        title={t.quiz.hintLabel}
                      >
                        <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                        <span className="hidden sm:inline">{t.quiz.hintLabel}</span>
                      </button>
                    )}
                  </div>

                  {/* Hint Display */}
                  {showHints[currentQuestionIndex] && q.hint && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong className="font-semibold me-1">{t.quiz.hintPrefix}</strong>
                        <span>{q.hint}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4 Answer Options */}
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
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className={`text-sm ${currentQuiz.language === 'ur' ? 'font-urdu' : ''}`}>
                            {opt}
                          </span>
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

          {/* Navigation & Submit Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4 rtl:rotate-180 shrink-0" />
              <span>{t.quiz.previousQuestion}</span>
            </button>

            {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-[#0f2b46] text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>{t.quiz.nextQuestion}</span>
                <ArrowRight className="w-4 h-4 rtl:rotate-180 shrink-0" />
              </button>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(selectedAnswers).length < currentQuiz.questions.length}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs font-bold transition-all shadow-md cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span>{t.quiz.submitQuiz}</span>
                <Check className="w-4 h-4 shrink-0" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Quiz Results & Detailed Explanation View */}
      {currentQuiz && isSubmitted && quizAttemptResult && (
        <div className="space-y-6 animate-fadeIn">
          {/* Result Score Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 mx-auto flex items-center justify-center shadow-xs">
              <Trophy className="w-8 h-8 text-teal-600" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">
                {t.quiz.scoreTitle}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900">
                {quizAttemptResult.score} / {quizAttemptResult.totalQuestions}
                <span className="text-xl sm:text-2xl text-teal-600 ms-2">
                  ({quizAttemptResult.percentage}%)
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                {quizAttemptResult.percentage >= 80
                  ? t.quiz.masteryHigh
                  : quizAttemptResult.percentage >= 60
                  ? t.quiz.masteryMedium
                  : t.quiz.masteryLow}
              </p>
            </div>

            {/* Actions: Retake or Generate New */}
            <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleRetakeQuiz}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 shrink-0" />
                <span>{t.quiz.retakeQuiz}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentQuiz(null);
                  setIsSubmitted(false);
                }}
                className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <Sparkles className="w-4 h-4 text-teal-200 shrink-0" />
                <span>{t.quiz.createAnother}</span>
              </button>
            </div>
          </div>

          {/* Solutions & Pedagogical Explanations List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-2">
              <h3 className="text-lg font-bold text-[#0f2b46] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                <span>{t.quiz.explanationsTitle}</span>
              </h3>
              <span className="text-xs text-slate-400">
                {t.quiz.stepByStepSolution}
              </span>
            </div>

            <div className="space-y-6">
              {currentQuiz.questions.map((q, idx) => {
                const userSelected = selectedAnswers[idx] ?? -1;
                const isCorrect = userSelected === q.correctAnswerIndex;
                const isRtlQ = isRtlLanguage(currentQuiz.language) || /[\u0590-\u08FF]/.test(q.question);

                return (
                  <div
                    key={q.id || idx}
                    dir={isRtlQ ? 'rtl' : 'ltr'}
                    className={`p-5 rounded-2xl border transition-colors ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-red-50/30 border-red-200'
                    }`}
                  >
                    {/* Question Header & Status Badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h4 className={`text-sm sm:text-base font-bold text-slate-900 ${currentQuiz.language === 'ur' ? 'font-urdu' : ''}`}>
                        <span className="text-teal-700 me-2">
                          {t.common.questionShort}{idx + 1}.
                        </span>
                        {q.question}
                      </h4>

                      <span
                        className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <Check className="w-3.5 h-3.5 shrink-0" />
                            <span>{t.common.correct}</span>
                          </>
                        ) : (
                          <>
                            <X className="w-3.5 h-3.5 shrink-0" />
                            <span>{t.common.incorrect}</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Answer Comparison */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs mb-3">
                      <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                        <span className="text-slate-500 font-semibold block mb-0.5">
                          {t.quiz.yourAnswer}:
                        </span>
                        <span className={`font-bold ${isCorrect ? 'text-emerald-700' : 'text-red-600'}`}>
                          {userSelected >= 0
                            ? `${String.fromCharCode(65 + userSelected)}. ${q.options[userSelected]}`
                            : t.common.noOptionSelected}
                        </span>
                      </div>

                      <div className="p-2.5 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-950">
                        <span className="text-emerald-800 font-semibold block mb-0.5">
                          {t.quiz.correctAnswer}:
                        </span>
                        <span className="font-bold">
                          {String.fromCharCode(65 + q.correctAnswerIndex)}. {q.options[q.correctAnswerIndex]}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Pedagogical Explanation */}
                    <div className="p-3 bg-white/90 rounded-xl border border-slate-200/90 text-xs text-slate-700 leading-relaxed space-y-1">
                      <div className="font-bold flex items-center gap-1.5 text-teal-800">
                        <Lightbulb className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        <span>{t.quiz.whyCorrect}</span>
                      </div>
                      <p className={currentQuiz.language === 'ur' ? 'font-urdu' : ''}>
                        {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

