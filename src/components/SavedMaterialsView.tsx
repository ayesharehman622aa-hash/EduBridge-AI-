import React, { useState, useEffect } from 'react';
import { Language, NoteItem, Quiz, OfflineGuide } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import { storage } from '../lib/storage';
import { OFFLINE_STUDY_GUIDES } from '../lib/offlineLibrary';
import {
  Bookmark,
  BookOpen,
  CheckCircle2,
  HardDrive,
  Search,
  Trash2,
  Copy,
  Check,
  Eye,
  X,
} from 'lucide-react';

interface SavedMaterialsViewProps {
  language?: Language;
  setLanguage?: (lang: Language) => void;
  isOnline: boolean;
  onOpenQuiz?: (quiz: Quiz) => void;
}

export const SavedMaterialsView: React.FC<SavedMaterialsViewProps> = ({
  onOpenQuiz,
}) => {
  const { language, t, isRtl } = useTranslation();
  const useUrduPack = language === 'ur';

  const [filterType, setFilterType] = useState<'all' | 'notes' | 'quizzes' | 'guides'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedNotes, setSavedNotes] = useState<NoteItem[]>([]);
  const [savedQuizzes, setSavedQuizzes] = useState<Quiz[]>([]);
  const [activeModalItem, setActiveModalItem] = useState<{
    type: 'note' | 'guide';
    data: NoteItem | OfflineGuide;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSavedNotes(storage.getSavedNotes());
    setSavedQuizzes(storage.getSavedQuizzes());
  }, []);

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(t.saved.deleteConfirm)) {
      storage.deleteNote(id);
      setSavedNotes(storage.getSavedNotes());
      if (activeModalItem?.data.id === id) {
        setActiveModalItem(null);
      }
    }
  };

  const handleCopyModalText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const query = searchQuery.toLowerCase().trim();

  const filteredNotes = savedNotes.filter((n) => {
    if (filterType !== 'all' && filterType !== 'notes') return false;
    if (!query) return true;
    return (
      n.title.toLowerCase().includes(query) ||
      n.subject.toLowerCase().includes(query) ||
      n.summary.toLowerCase().includes(query)
    );
  });

  const filteredQuizzes = savedQuizzes.filter((q) => {
    if (filterType !== 'all' && filterType !== 'quizzes') return false;
    if (!query) return true;
    return (
      q.topic.toLowerCase().includes(query) ||
      q.subject.toLowerCase().includes(query)
    );
  });

  const filteredGuides = OFFLINE_STUDY_GUIDES.filter((g) => {
    if (filterType !== 'all' && filterType !== 'guides') return false;
    if (!query) return true;
    return (
      g.title.toLowerCase().includes(query) ||
      g.titleUrdu.includes(query) ||
      g.subject.toLowerCase().includes(query) ||
      g.summary.toLowerCase().includes(query)
    );
  });

  const totalFilteredCount = filteredNotes.length + filteredQuizzes.length + filteredGuides.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <Bookmark className="w-5 h-5 text-teal-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0f2b46]">
              {t.saved.title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            {t.saved.subtitle}
          </p>
        </div>

        {/* Offline Guarantee Badge */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold self-start md:self-center">
          <HardDrive className="w-4 h-4 text-teal-600 shrink-0" />
          <span>{t.saved.savedLocallyBadge}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterType === 'all'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.saved.filterAll} ({savedNotes.length + savedQuizzes.length + OFFLINE_STUDY_GUIDES.length})
          </button>

          <button
            onClick={() => setFilterType('notes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterType === 'notes'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.saved.filterNotes} ({savedNotes.length})
          </button>

          <button
            onClick={() => setFilterType('quizzes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterType === 'quizzes'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.saved.filterQuizzes} ({savedQuizzes.length})
          </button>

          <button
            onClick={() => setFilterType('guides')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              filterType === 'guides'
                ? 'bg-white text-teal-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.saved.filterOfflineGuides} ({OFFLINE_STUDY_GUIDES.length})
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.saved.searchPlaceholder}
            dir={isRtl ? 'rtl' : 'ltr'}
            className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl ps-9 pe-4 py-2 text-xs sm:text-sm text-slate-900"
          />
        </div>
      </div>

      {/* Grid of Saved Materials */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Core Pre-Cached Offline Guides */}
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => setActiveModalItem({ type: 'guide', data: guide })}
            dir={useUrduPack ? 'rtl' : 'ltr'}
            className="bg-white rounded-2xl p-5 border-2 border-teal-200/80 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-100 text-teal-800">
                  {useUrduPack ? guide.subjectUrdu : guide.subject}
                </span>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <HardDrive className="w-3 h-3 text-amber-700 shrink-0" />
                  <span>{t.saved.offlinePackBadge}</span>
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors leading-snug">
                {useUrduPack ? guide.titleUrdu : guide.title}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {useUrduPack ? guide.summaryUrdu : guide.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-teal-600 font-semibold group-hover:underline flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span>{t.saved.readFullGuide}</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {t.saved.offlinePackBadge}
              </span>
            </div>
          </div>
        ))}

        {/* 2. User Generated Saved Notes */}
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => setActiveModalItem({ type: 'note', data: note })}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {note.subject}
                </span>
                <span className="text-[11px] text-slate-400">
                  {new Date(note.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-700 transition-colors leading-snug">
                {note.title}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                {note.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-teal-600 font-semibold group-hover:underline flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 shrink-0" />
                <span>{t.saved.readNotes}</span>
              </span>

              <button
                onClick={(e) => handleDeleteNote(note.id, e)}
                className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title={t.saved.deleteConfirm}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* 3. User Saved Quizzes */}
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {quiz.subject}
                </span>
                <span className="text-[10px] font-semibold text-slate-400 capitalize">
                  {t.quiz.difficultyLevels[quiz.difficulty] || quiz.difficulty}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base leading-snug">
                {quiz.topic}
              </h3>

              <p className="text-xs text-slate-500 leading-relaxed">
                {quiz.questions.length} {t.saved.questionsCountSuffix}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
              {onOpenQuiz && (
                <button
                  onClick={() => onOpenQuiz(quiz)}
                  className="text-teal-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.saved.takeQuiz}</span>
                </button>
              )}
              <span className="text-[11px] text-slate-400">
                {new Date(quiz.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {totalFilteredCount === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">
            {t.saved.emptyMessage}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {t.saved.emptyHint}
          </p>
        </div>
      )}

      {/* Detail Reader Modal */}
      {activeModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div
            dir={activeModalItem.type === 'guide' ? (useUrduPack ? 'rtl' : 'ltr') : undefined}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scaleUp"
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-200 gap-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 inline-block">
                  {activeModalItem.type === 'guide'
                    ? useUrduPack
                      ? (activeModalItem.data as OfflineGuide).subjectUrdu
                      : activeModalItem.data.subject
                    : activeModalItem.data.subject}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#0f2b46]">
                  {activeModalItem.type === 'guide'
                    ? useUrduPack
                      ? (activeModalItem.data as OfflineGuide).titleUrdu
                      : activeModalItem.data.title
                    : (activeModalItem.data as NoteItem).title}
                </h2>
              </div>

              <button
                onClick={() => setActiveModalItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                aria-label={t.saved.closeModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content - For Notes */}
            {activeModalItem.type === 'note' &&
              (() => {
                const note = activeModalItem.data as NoteItem;
                return (
                  <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
                    {/* Summary */}
                    <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 space-y-1">
                      <h4 className="text-xs font-black uppercase text-teal-800">
                        {t.notes.summaryHeading}
                      </h4>
                      <p>{note.summary}</p>
                    </div>

                    {/* Key Takeaways */}
                    <div className="space-y-2">
                      <h4 className="font-bold text-[#0f2b46]">
                        {t.notes.keyPointsHeading}
                      </h4>
                      <ul className="space-y-1.5 text-xs sm:text-sm">
                        {note.keyPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Detailed Sections */}
                    <div className="space-y-4">
                      <h4 className="font-bold text-[#0f2b46]">
                        {t.notes.detailedConcepts}
                      </h4>
                      {note.detailedSections.map((sec, i) => (
                        <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5">
                          <h5 className="font-bold text-sm text-slate-900">{sec.heading}</h5>
                          <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-wrap">{sec.content}</p>
                          {sec.examples && sec.examples.length > 0 && (
                            <div className="text-xs text-teal-800 bg-white p-2 rounded-lg border border-slate-200">
                              <strong className="me-1">{t.common.exampleLabel}</strong>
                              {sec.examples.join(', ')}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Definitions */}
                    {note.definitions && note.definitions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-[#0f2b46]">
                          {t.notes.keyDefinitions}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                          {note.definitions.map((def, i) => (
                            <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                              <span className="font-bold text-teal-800 block">{def.term}</span>
                              <span className="text-slate-600">{def.definition}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

            {/* Modal Content - For Pre-cached Guides */}
            {activeModalItem.type === 'guide' &&
              (() => {
                const guide = activeModalItem.data as OfflineGuide;
                return (
                  <div className="space-y-6 text-sm text-slate-800 leading-relaxed">
                    <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 space-y-1">
                      <h4 className="text-xs font-black uppercase text-teal-800">
                        {t.saved.summaryLabel}
                      </h4>
                      <p>{useUrduPack ? guide.summaryUrdu : guide.summary}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-[#0f2b46]">
                        {t.saved.coreTakeaways}
                      </h4>
                      <ul className="space-y-1.5 text-xs sm:text-sm">
                        {(useUrduPack ? guide.keyTakeawaysUrdu : guide.keyTakeaways).map((pt, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-bold text-[#0f2b46]">
                        {t.saved.detailedExplanation}
                      </h4>
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 whitespace-pre-wrap text-xs sm:text-sm font-normal">
                        {useUrduPack ? guide.contentUrdu : guide.content}
                      </div>
                    </div>
                  </div>
                );
              })()}

            {/* Modal Footer Controls */}
            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-slate-400">
                {t.saved.offlineGuaranteed}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const text =
                      activeModalItem.type === 'note'
                        ? JSON.stringify(activeModalItem.data, null, 2)
                        : useUrduPack
                        ? (activeModalItem.data as OfflineGuide).contentUrdu
                        : (activeModalItem.data as OfflineGuide).content;
                    handleCopyModalText(text);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                  <span>{copied ? t.tutor.copied : t.notes.copyNotes}</span>
                </button>

                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {t.saved.closeModal}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

