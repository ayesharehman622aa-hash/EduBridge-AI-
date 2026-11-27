import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Language } from '../types';
import {
  builtInTranslations,
  mergeWithEnglishFallback,
  TranslationDictionary,
} from './translations';
import { getPresetBuiltInTranslation } from './presetTranslations';
import {
  applyLanguageDocumentSettings,
  getPromptLanguageName,
  isCustomLanguage,
  isRtlLanguage,
} from './languages';
import { storage } from './storage';

interface TranslationContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  isRtl: boolean;
  isTranslating: boolean;
  translationNotice: string | null;
  dismissTranslationNotice: () => void;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

function resolveLocalTranslation(lang: Language): TranslationDictionary | null {
  if (lang === 'en') return builtInTranslations.en;
  if (lang === 'ur') return builtInTranslations.ur;
  const presetBuiltIn = getPresetBuiltInTranslation(lang);
  if (presetBuiltIn) return presetBuiltIn;
  const cached = storage.getCachedTranslations<TranslationDictionary>(lang);
  if (cached) return mergeWithEnglishFallback(cached);
  return null;
}

export const TranslationProvider: React.FC<{
  children: React.ReactNode;
  isOnline: boolean;
}> = ({ children, isOnline }) => {
  const [language, setLanguageState] = useState<Language>(() => storage.getLanguage());
  const [activeDict, setActiveDict] = useState<TranslationDictionary>(() => {
    const initial = storage.getLanguage();
    return resolveLocalTranslation(initial) || builtInTranslations.en;
  });
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationNotice, setTranslationNotice] = useState<string | null>(null);
  const [usingEnglishFallback, setUsingEnglishFallback] = useState<boolean>(false);

  const requestIdRef = useRef(0);

  const resolveTranslationsForLanguage = useCallback(
    async (targetLang: Language, onlineStatus: boolean) => {
      const reqId = ++requestIdRef.current;
      setTranslationNotice(null);

      const localPack = resolveLocalTranslation(targetLang);
      if (localPack) {
        setActiveDict(localPack);
        setUsingEnglishFallback(false);
        setIsTranslating(false);
        applyLanguageDocumentSettings(targetLang);
        return;
      }

      if (!onlineStatus) {
        setActiveDict(builtInTranslations.en);
        setUsingEnglishFallback(true);
        setIsTranslating(false);
        applyLanguageDocumentSettings('en');
        setTranslationNotice(builtInTranslations.en.languageSelector.offlineFallbackMessage);
        return;
      }

      // Start one-shot Gemini UI translation (with server cache + flash-lite fallback)
      applyLanguageDocumentSettings(targetLang);
      setIsTranslating(true);
      setUsingEnglishFallback(false);

      try {
        const res = await fetch('/api/translate-ui', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            language: targetLang,
            targetLanguage: getPromptLanguageName(targetLang),
            strings: builtInTranslations.en,
          }),
        });

        const data = await res.json();
        if (reqId !== requestIdRef.current) return;

        if (!res.ok || !data?.translations) {
          const isQuota = res.status === 429 || data?.code === 'QUOTA_EXCEEDED';
          throw Object.assign(new Error(data?.error || 'Translation request failed.'), { isQuota });
        }

        const merged = mergeWithEnglishFallback(data.translations);
        storage.setCachedTranslations(targetLang, merged);
        setActiveDict(merged);
        setUsingEnglishFallback(false);
      } catch (err: unknown) {
        if (reqId !== requestIdRef.current) return;
        const isQuota = Boolean((err as { isQuota?: boolean })?.isQuota);
        console.warn('UI translation unavailable, falling back to English:', err);
        setActiveDict(builtInTranslations.en);
        setUsingEnglishFallback(true);
        applyLanguageDocumentSettings('en');
        setTranslationNotice(
          isQuota
            ? builtInTranslations.en.languageSelector.quotaFallbackMessage
            : builtInTranslations.en.languageSelector.errorFallbackMessage
        );
      } finally {
        if (reqId === requestIdRef.current) {
          setIsTranslating(false);
        }
      }
    },
    []
  );

  useEffect(() => {
    resolveTranslationsForLanguage(language, isOnline);
  }, [language, isOnline, resolveTranslationsForLanguage]);

  const setLanguage = useCallback((nextLang: Language) => {
    const trimmed = nextLang.trim() || 'en';
    storage.setLanguage(trimmed);
    if (isCustomLanguage(trimmed)) {
      storage.addCustomLanguage(trimmed);
    }
    setLanguageState(trimmed);
  }, []);

  const isRtl = usingEnglishFallback ? false : isRtlLanguage(language);

  return (
    <TranslationContext.Provider
      value={{
        language,
        setLanguage,
        t: activeDict,
        isRtl,
        isTranslating,
        translationNotice,
        dismissTranslationNotice: () => setTranslationNotice(null),
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export function useTranslation(): TranslationContextValue {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return ctx;
}
