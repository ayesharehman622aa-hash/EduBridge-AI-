import React, { useState } from 'react';
import { Language, NoteItem } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import { getPromptLanguageName, isRtlLanguage } from '../lib/languages';
import { storage } from '../lib/storage';
import { LanguageSelector } from './LanguageSelector';
import {
  BookOpen,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  Download,
  FileText,
  Layers,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';

interface NotesViewProps {
  initialTopic?: string;
  initialSubject?: string;
  language?: Language;
  setLanguage?: (lang: Language) => void;
  isOnline: boolean;
}

export const NotesView: React.FC<NotesViewProps> = ({
  initialTopic,
  initialSubject,
  isOnline,
}) => {
  const { language, t, isRtl } = useTranslation();

  const [topic, setTopic] = useState(initialTopic || '');
  const [subject, setSubject] = useState(initialSubject || 'General Science');
  const [sourceText, setSourceText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedNote, setGeneratedNote] = useState<NoteItem | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

  const popularTopics = [
    { title: t.notes.sampleTopic1, subject: 'General Science' },
    { title: t.notes.sampleTopic2, subject: 'Biology' },
    { title: t.notes.sampleTopic3, subject: 'Mathematics' },
    { title: t.notes.sampleTopic4, subject: 'Physics' },
    { title: t.notes.sampleTopic5, subject: 'Chemistry' },
    { title: t.notes.sampleTopic6, subject: 'English Grammar' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setErrorMsg(t.notes.errorEmptyTopic);
      return;
    }

    if (!isOnline) {
      setErrorMsg(t.notes.errorOffline);
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/notes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          subject,
          sourceText: sourceText.trim(),
          language,
          languageName: getPromptLanguageName(language),
          depth: 'standard',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || t.notes.errorGenerateFailed);
      }

      setGeneratedNote(data);
      storage.saveNote(data);
    } catch (err: unknown) {
      console.error('Notes generator failed:', err);
      const errMessage = err instanceof Error ? err.message : '';
      setErrorMsg(errMessage || t.notes.errorGenerateFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedNote) return;
    const formatted = `${generatedNote.title}\n${t.notes.subjectLabel}: ${generatedNote.subject}\n\n${t.notes.summaryHeading}:\n${generatedNote.summary}\n\n${t.notes.keyPointsHeading}:\n${generatedNote.keyPoints.map((p) => '• ' + p).join('\n')}\n\n${t.notes.detailedConcepts}:\n${generatedNote.detailedSections.map((s) => `${s.heading}:\n${s.content}\n${s.examples ? `${t.notes.realWorldExample} ` + s.examples.join(', ') : ''}`).join('\n\n')}\n\n${t.notes.keyDefinitions}:\n${generatedNote.definitions.map((d) => `${d.term}: ${d.definition}`).join('\n')}\n\n${t.notes.practiceQuestions}:\n${generatedNote.quickReviewQuestions.map((q) => '? ' + q).join('\n')}`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!generatedNote) return;
    const formatted = `${generatedNote.title}\n${t.notes.subjectLabel}: ${generatedNote.subject}\n${new Date(generatedNote.createdAt).toLocaleDateString()}\n\n${t.notes.summaryHeading}:\n${generatedNote.summary}\n\n${t.notes.keyPointsHeading}:\n${generatedNote.keyPoints.map((p) => '• ' + p).join('\n')}\n\n${t.notes.detailedConcepts}:\n${generatedNote.detailedSections.map((s) => `--- ${s.heading} ---\n${s.content}\n${s.examples ? `${t.notes.realWorldExample} ` + s.examples.join(', ') : ''}`).join('\n\n')}\n\n${t.notes.keyDefinitions}:\n${generatedNote.definitions.map((d) => `${d.term}: ${d.definition}`).join('\n')}\n\n${t.notes.practiceQuestions}:\n${generatedNote.quickReviewQuestions.map((q) => '? ' + q).join('\n')}`;

    const blob = new Blob([formatted], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${generatedNote.title.replace(/\s+/g, '_')}_notes.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const noteIsRtl = generatedNote
    ? isRtlLanguage(generatedNote.language) || /[\u0590-\u08FF]/.test(generatedNote.title + generatedNote.summary)
    : isRtl;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-teal-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0f2b46]">
              {t.notes.title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            {t.notes.subtitle}
          </p>
        </div>

        {/* Language Selector */}
        <div className="self-start md:self-center">
          <LanguageSelector variant="header" />
        </div>
      </div>

      {/* Input Form Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        {/* Sample Topics Shortcuts */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{t.notes.sampleTopics}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularTopics.map((pt, i) => (
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Topic Title Input */}
          <div className="md:col-span-2 space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.notes.topicLabel} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder={t.notes.topicPlaceholder}
              dir={isRtl ? 'rtl' : 'ltr'}
              className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl px-4 py-2.5 text-sm text-slate-900"
            />
          </div>

          {/* Subject Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {t.notes.subjectLabel}
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

        {/* Optional Source Text / Textbook Excerpt */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t.notes.textLabel}
          </label>
          <textarea
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder={t.notes.textPlaceholder}
            rows={3}
            dir={isRtl ? 'rtl' : 'ltr'}
            className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl p-3 text-sm text-slate-900"
          />
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{t.notes.autoSaveNote}</span>
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading || !topic.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t.notes.generating}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-200 shrink-0" />
                <span>{t.notes.generateButton}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Notes Display */}
      {generatedNote && (
        <div
          dir={noteIsRtl ? 'rtl' : 'ltr'}
          className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 animate-fadeIn ${
            generatedNote.language === 'ur' ? 'font-urdu' : ''
          }`}
        >
          {/* Note Top Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                  {generatedNote.subject}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(generatedNote.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-2xl font-black text-[#0f2b46]">
                {generatedNote.title}
              </h2>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                <span>{copied ? t.tutor.copied : t.notes.copyNotes}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 shrink-0" />
                <span>{t.notes.downloadText}</span>
              </button>

              <div className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-semibold flex items-center gap-1.5 border border-teal-200">
                <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span>{t.notes.savedLocalBadge}</span>
              </div>
            </div>
          </div>

          {/* Section 1: Summary Overview */}
          <div className="bg-teal-50/50 rounded-xl p-4 sm:p-5 border border-teal-100 space-y-1.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-teal-800 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{t.notes.summaryHeading}</span>
            </h3>
            <p className="text-sm text-slate-800 leading-relaxed font-normal">
              {generatedNote.summary}
            </p>
          </div>

          {/* Section 2: Key Takeaway Points */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#0f2b46] flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{t.notes.keyPointsHeading}</span>
            </h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {generatedNote.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Detailed Concepts & Explanations */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-[#0f2b46] flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-600 shrink-0" />
              <span>{t.notes.detailedConcepts}</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {generatedNote.detailedSections.map((sec, idx) => (
                <div key={idx} className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-sm text-teal-900">
                    {sec.heading}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {sec.content}
                  </p>
                  {sec.examples && sec.examples.length > 0 && (
                    <div className="pt-2 text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="font-semibold text-teal-700 me-1">
                        {t.notes.realWorldExample}
                      </span>
                      {sec.examples.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Key Definitions / Formulas */}
          {generatedNote.definitions && generatedNote.definitions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-[#0f2b46]">
                {t.notes.keyDefinitions}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {generatedNote.definitions.map((def, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="font-bold text-xs text-teal-800 block">
                      {def.term}
                    </span>
                    <span className="text-xs text-slate-600 leading-normal block">
                      {def.definition}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 5: Practice / Review Questions */}
          {generatedNote.quickReviewQuestions && generatedNote.quickReviewQuestions.length > 0 && (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{t.notes.practiceQuestions}</span>
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                {generatedNote.quickReviewQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="font-bold text-teal-600 shrink-0">
                      {t.common.questionShort}{idx + 1}:
                    </span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

