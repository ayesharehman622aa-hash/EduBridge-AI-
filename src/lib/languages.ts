import { FontScript, Language, LanguageOption } from '../types';

export const PRESET_LANGUAGES: LanguageOption[] = [
  { code: 'en', nativeName: 'English', englishName: 'English', rtl: false, script: 'latin' },
  { code: 'ur', nativeName: 'اردو', englishName: 'Urdu', rtl: true, script: 'urdu' },
  { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi', rtl: false, script: 'devanagari' },
  { code: 'bn', nativeName: 'বাংলা', englishName: 'Bengali', rtl: false, script: 'bengali' },
  { code: 'ar', nativeName: 'العربية', englishName: 'Arabic', rtl: true, script: 'arabic' },
  { code: 'fa', nativeName: 'فارسی', englishName: 'Persian', rtl: true, script: 'arabic' },
  { code: 'ps', nativeName: 'پښتو', englishName: 'Pashto', rtl: true, script: 'arabic' },
  { code: 'sd', nativeName: 'سنڌي', englishName: 'Sindhi', rtl: true, script: 'urdu' },
  { code: 'pa', nativeName: 'ਪੰਜਾਬੀ', englishName: 'Punjabi', rtl: false, script: 'gurmukhi' },
  { code: 'es', nativeName: 'Español', englishName: 'Spanish', rtl: false, script: 'latin' },
  { code: 'fr', nativeName: 'Français', englishName: 'French', rtl: false, script: 'latin' },
  { code: 'pt', nativeName: 'Português', englishName: 'Portuguese', rtl: false, script: 'latin' },
  { code: 'tr', nativeName: 'Türkçe', englishName: 'Turkish', rtl: false, script: 'latin' },
  { code: 'id', nativeName: 'Bahasa Indonesia', englishName: 'Indonesian', rtl: false, script: 'latin' },
  { code: 'sw', nativeName: 'Kiswahili', englishName: 'Swahili', rtl: false, script: 'latin' },
  { code: 'zh', nativeName: '中文', englishName: 'Chinese', rtl: false, script: 'chinese' },
  { code: 'ja', nativeName: '日本語', englishName: 'Japanese', rtl: false, script: 'japanese' },
  { code: 'ko', nativeName: '한국어', englishName: 'Korean', rtl: false, script: 'korean' },
  { code: 'ru', nativeName: 'Русский', englishName: 'Russian', rtl: false, script: 'latin' },
  { code: 'he', nativeName: 'עברית', englishName: 'Hebrew', rtl: true, script: 'hebrew' },
];

export const RTL_LANGUAGE_CODES = new Set(['ar', 'ur', 'fa', 'ps', 'sd', 'he']);

const CUSTOM_PREFIX = 'custom:';

export function makeCustomLanguageId(name: string): Language {
  const trimmed = name.trim();
  const matchedPreset = PRESET_LANGUAGES.find(
    (p) =>
      p.code.toLowerCase() === trimmed.toLowerCase() ||
      p.nativeName.toLowerCase() === trimmed.toLowerCase() ||
      p.englishName.toLowerCase() === trimmed.toLowerCase()
  );
  if (matchedPreset) return matchedPreset.code;
  return `${CUSTOM_PREFIX}${trimmed}`;
}

export function isCustomLanguage(lang: Language): boolean {
  return lang.startsWith(CUSTOM_PREFIX) || !PRESET_LANGUAGES.some((p) => p.code === lang);
}

export function getPresetLanguage(lang: Language): LanguageOption | undefined {
  return PRESET_LANGUAGES.find((p) => p.code === lang);
}

export function getLanguageDisplayName(lang: Language): string {
  const preset = getPresetLanguage(lang);
  if (preset) return preset.nativeName;
  if (lang.startsWith(CUSTOM_PREFIX)) {
    return lang.slice(CUSTOM_PREFIX.length);
  }
  return lang || 'English';
}

export function getPromptLanguageName(lang: Language): string {
  const preset = getPresetLanguage(lang);
  if (preset) {
    return preset.code === 'en' ? 'English' : `${preset.englishName} (${preset.nativeName})`;
  }
  return getLanguageDisplayName(lang);
}

export function getHtmlLangCode(lang: Language): string {
  const preset = getPresetLanguage(lang);
  if (preset) return preset.code;
  return 'en';
}

const SPEECH_LOCALES: Record<string, string> = {
  en: 'en-US',
  ur: 'ur-PK',
  hi: 'hi-IN',
  bn: 'bn-BD',
  ar: 'ar-SA',
  fa: 'fa-IR',
  ps: 'ps-AF',
  sd: 'sd-PK',
  pa: 'pa-IN',
  es: 'es-ES',
  fr: 'fr-FR',
  pt: 'pt-BR',
  tr: 'tr-TR',
  id: 'id-ID',
  sw: 'sw-KE',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
  ru: 'ru-RU',
  he: 'he-IL',
};

export function getSpeechRecognitionLocale(lang: Language): string {
  return SPEECH_LOCALES[lang] || getHtmlLangCode(lang) || 'en-US';
}

export function isRtlLanguage(lang: Language): boolean {
  const preset = getPresetLanguage(lang);
  if (preset) return preset.rtl;
  const normalized = getLanguageDisplayName(lang).toLowerCase();
  if (RTL_LANGUAGE_CODES.has(normalized)) return true;
  if (
    /arabic|urdu|persian|farsi|pashto|pushto|sindhi|hebrew|kurdish|sorani|uyghur|divehi|dhivehi|yiddish|syriac|kashmiri|balochi|saraiki/.test(
      normalized
    )
  ) {
    return true;
  }
  // Detect Arabic or Hebrew script characters
  return /[\u0590-\u08FF]/.test(normalized);
}

export function getLanguageScript(lang: Language): FontScript {
  const preset = getPresetLanguage(lang);
  if (preset) return preset.script;
  const name = getLanguageDisplayName(lang).toLowerCase();
  if (/urdu|sindhi|kashmiri|saraiki|[\u0679\u067E\u0686\u0688\u0691\u0698\u06BA\u06BE\u06C1\u06D2]/.test(name)) {
    return 'urdu';
  }
  if (/arabic|persian|farsi|pashto|pushto|kurdish|sorani|[\u0600-\u06FF]/.test(name)) {
    return 'arabic';
  }
  if (/hebrew|yiddish|[\u0590-\u05FF]/.test(name)) return 'hebrew';
  if (/hindi|marathi|nepali|sanskrit|bhojpuri|maithili|[\u0900-\u097F]/.test(name)) return 'devanagari';
  if (/bengali|bangla|assamese|[\u0980-\u09FF]/.test(name)) return 'bengali';
  if (/punjabi|gurmukhi|[\u0A00-\u0A7F]/.test(name)) return 'gurmukhi';
  if (/chinese|mandarin|cantonese|[\u4E00-\u9FFF]/.test(name)) return 'chinese';
  if (/japanese|[\u3040-\u30FF]/.test(name)) return 'japanese';
  if (/korean|[\uAC00-\uD7AF]/.test(name)) return 'korean';
  return 'latin';
}

export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') return 'en';
  const candidates = navigator.languages && navigator.languages.length > 0 ? navigator.languages : [navigator.language];
  for (const locale of candidates) {
    if (!locale) continue;
    const base = locale.split('-')[0].toLowerCase();
    if (PRESET_LANGUAGES.some((p) => p.code === base)) {
      return base;
    }
  }
  return 'en';
}

const FONT_CONFIG: Record<
  FontScript,
  { googleUrl: string; fontFamily: string; lineHeight: string }
> = {
  latin: {
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
    fontFamily: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    lineHeight: '1.5',
  },
  urdu: {
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Nastaliq+Urdu:wght@400;600;700&display=swap',
    fontFamily: "'Noto Nastaliq Urdu', 'Noto Naskh Arabic', 'Inter', Tahoma, Arial, sans-serif",
    lineHeight: '1.95',
  },
  arabic: {
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap',
    fontFamily: "'Noto Naskh Arabic', 'Inter', Tahoma, Arial, sans-serif",
    lineHeight: '1.75',
  },
  devanagari: {
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700&display=swap',
    fontFamily: "'Noto Sans Devanagari', 'Inter', system-ui, sans-serif",
    lineHeight: '1.65',
  },
  bengali: {
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap',
    fontFamily: "'Noto Sans Bengali', 'Inter', system-ui, sans-serif",
    lineHeight: '1.65',
  },
  gurmukhi: {
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Gurmukhi:wght@400;500;600;700&display=swap',
    fontFamily: "'Noto Sans Gurmukhi', 'Inter', system-ui, sans-serif",
    lineHeight: '1.65',
  },
  hebrew: {
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Hebrew:wght@400;500;600;700&display=swap',
    fontFamily: "'Noto Sans Hebrew', 'Inter', system-ui, sans-serif",
    lineHeight: '1.65',
  },
  chinese: {
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+SC:wght@400;500;700&display=swap',
    fontFamily: "'Noto Sans SC', 'Inter', system-ui, sans-serif",
    lineHeight: '1.65',
  },
  japanese: {
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+JP:wght@400;500;700&display=swap',
    fontFamily: "'Noto Sans JP', 'Inter', system-ui, sans-serif",
    lineHeight: '1.65',
  },
  korean: {
    googleUrl:
      'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+KR:wght@400;500;700&display=swap',
    fontFamily: "'Noto Sans KR', 'Inter', system-ui, sans-serif",
    lineHeight: '1.65',
  },
};

export function applyLanguageDocumentSettings(lang: Language): void {
  if (typeof document === 'undefined') return;

  const rtl = isRtlLanguage(lang);
  const script = getLanguageScript(lang);
  const cfg = FONT_CONFIG[script];

  const html = document.documentElement;
  html.dir = rtl ? 'rtl' : 'ltr';
  html.lang = getHtmlLangCode(lang);
  html.style.setProperty('--app-font-family', cfg.fontFamily);
  html.style.setProperty('--app-line-height', cfg.lineHeight);

  const linkId = 'edubridge-script-font';
  let linkEl = document.getElementById(linkId) as HTMLLinkElement | null;
  if (!linkEl) {
    linkEl = document.createElement('link');
    linkEl.id = linkId;
    linkEl.rel = 'stylesheet';
    document.head.appendChild(linkEl);
  }
  if (linkEl.href !== cfg.googleUrl) {
    linkEl.href = cfg.googleUrl;
  }
}

export function getTranslationCacheKey(lang: Language): string {
  return getLanguageDisplayName(lang).trim().toLowerCase() + '::' + lang.trim().toLowerCase();
}
