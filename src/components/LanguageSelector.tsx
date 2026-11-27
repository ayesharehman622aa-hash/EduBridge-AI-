import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Globe, Search, Check, ChevronDown, Plus, X } from 'lucide-react';
import {
  PRESET_LANGUAGES,
  getLanguageDisplayName,
  makeCustomLanguageId,
} from '../lib/languages';
import { storage } from '../lib/storage';
import { useTranslation } from '../lib/TranslationContext';

interface LanguageSelectorProps {
  variant?: 'header' | 'footer';
  upward?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'header',
  upward = false,
}) => {
  const { language, setLanguage, t, isTranslating } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customLanguageInput, setCustomLanguageInput] = useState('');
  const [recentCustomLanguages, setRecentCustomLanguages] = useState<string[]>(() =>
    storage.getCustomLanguages()
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);

  const currentDisplayName = getLanguageDisplayName(language);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setShowCustomInput(false);
      setCustomLanguageInput('');
      setRecentCustomLanguages(storage.getCustomLanguages());
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 20);
    }
  }, [isOpen]);

  useEffect(() => {
    if (showCustomInput) {
      setTimeout(() => {
        customInputRef.current?.focus();
      }, 20);
    }
  }, [showCustomInput]);

  const filteredPresets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return PRESET_LANGUAGES;
    return PRESET_LANGUAGES.filter(
      (item) =>
        item.nativeName.toLowerCase().includes(q) ||
        item.englishName.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredCustom = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return recentCustomLanguages.filter((c) => {
      const name = getLanguageDisplayName(c).toLowerCase();
      return !q || name.includes(q);
    });
  }, [recentCustomLanguages, searchQuery]);

  const handleSelectLanguage = (langId: string) => {
    setLanguage(langId);
    setIsOpen(false);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = customLanguageInput.trim();
    if (!cleaned) return;
    const langId = makeCustomLanguageId(cleaned);
    setLanguage(langId);
    setRecentCustomLanguages(storage.getCustomLanguages());
    setIsOpen(false);
  };

  const isHeader = variant === 'header';

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t.languageSelector.buttonAriaLabel}
        title={currentDisplayName}
        className={
          isHeader
            ? 'w-[104px] sm:w-[144px] h-9 px-2 sm:px-2.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 flex items-center justify-between gap-1.5 cursor-pointer'
            : 'w-[180px] h-9 px-3 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 flex items-center justify-between gap-2 cursor-pointer'
        }
      >
        <span className="flex items-center gap-1.5 min-w-0 flex-1">
          <Globe className={`w-3.5 h-3.5 text-teal-400 shrink-0 ${isTranslating ? 'animate-spin' : ''}`} />
          <span className="truncate text-start">{currentDisplayName}</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label={t.languageSelector.buttonAriaLabel}
          className={
            upward
              ? 'fixed inset-x-3 bottom-16 sm:absolute sm:inset-auto sm:start-0 sm:bottom-full sm:mb-2 sm:w-72 z-50 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden'
              : 'fixed inset-x-3 top-[68px] sm:absolute sm:inset-auto sm:end-0 sm:top-full sm:mt-2 sm:w-72 z-50 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden'
          }
        >
          {/* Search Input */}
          <div className="p-2.5 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.languageSelector.searchPlaceholder}
                className="w-full bg-white border border-slate-200 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl ps-8 pe-7 py-1.5 text-xs text-slate-900"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute end-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Language List */}
          <div className="max-h-60 overflow-y-auto py-1 divide-y divide-slate-50" role="listbox">
            {filteredCustom.map((customId) => {
              const isSelected = language === customId;
              const name = getLanguageDisplayName(customId);
              return (
                <button
                  key={customId}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(customId)}
                  className={`w-full px-3.5 py-2 text-start text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 text-teal-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span className="truncate">{name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-medium shrink-0">
                      {t.languageSelector.recentCustom}
                    </span>
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                </button>
              );
            })}

            {filteredPresets.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelectLanguage(item.code)}
                  className={`w-full px-3.5 py-2 text-start text-xs flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-teal-50 text-teal-800 font-bold'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center justify-between gap-2 min-w-0 flex-1">
                    <span className="truncate font-semibold">{item.nativeName}</span>
                    {item.code !== 'en' && (
                      <span className="text-[11px] text-slate-400 shrink-0">{item.englishName}</span>
                    )}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-teal-600 shrink-0" />}
                </button>
              );
            })}

            {filteredPresets.length === 0 && filteredCustom.length === 0 && (
              <div className="px-3.5 py-4 text-center text-xs text-slate-400">
                {t.languageSelector.noResults}
              </div>
            )}
          </div>

          {/* Other Language Option */}
          <div className="border-t border-slate-200 bg-slate-50 p-2.5">
            {!showCustomInput ? (
              <button
                type="button"
                onClick={() => setShowCustomInput(true)}
                className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold text-teal-700 hover:bg-teal-50 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 shrink-0" />
                <span>{t.languageSelector.otherLanguage}</span>
              </button>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-2">
                <input
                  ref={customInputRef}
                  type="text"
                  value={customLanguageInput}
                  onChange={(e) => setCustomLanguageInput(e.target.value)}
                  placeholder={t.languageSelector.customInputPlaceholder}
                  className="w-full bg-white border border-slate-300 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl px-3 py-1.5 text-xs text-slate-900"
                />
                <div className="flex items-center justify-end gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowCustomInput(false)}
                    className="px-2.5 py-1 rounded-lg text-[11px] font-semibold text-slate-600 hover:bg-slate-200 cursor-pointer"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={!customLanguageInput.trim()}
                    className="px-3 py-1 rounded-lg text-[11px] font-bold bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white cursor-pointer disabled:cursor-not-allowed"
                  >
                    {t.languageSelector.applyCustom}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
