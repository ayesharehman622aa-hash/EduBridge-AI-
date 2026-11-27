import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChatMessage, Language, NoteItem } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import {
  getLanguageDisplayName,
  getPromptLanguageName,
  getSpeechRecognitionLocale,
  isCustomLanguage,
  isRtlLanguage,
} from '../lib/languages';
import { storage } from '../lib/storage';
import { LanguageSelector } from './LanguageSelector';
import {
  Send,
  Sparkles,
  Copy,
  Check,
  Bookmark,
  RotateCcw,
  AlertCircle,
  GraduationCap,
  Bot,
  User,
  HelpCircle,
  WifiOff,
  Mic,
  Square,
  Loader2,
  X,
  Volume2,
} from 'lucide-react';

interface SpeechRecognitionAlternativeLike {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  length: number;
  [index: number]: SpeechRecognitionAlternativeLike;
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: SpeechRecognitionResultLike;
  };
}

interface SpeechRecognitionErrorEventLike {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

type VoiceState = 'idle' | 'listening' | 'transcribing';

interface TutorViewProps {
  initialTopic?: string;
  initialSubject?: string;
  language?: Language;
  setLanguage?: (lang: Language) => void;
  isOnline: boolean;
}

function getSpeechRecognitionCtor(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

function getSupportedRecorderMimeType(): string {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return '';
  }
  const candidates = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/mp4',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

function formatDuration(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export const TutorView: React.FC<TutorViewProps> = ({
  initialTopic,
  initialSubject,
  isOnline,
}) => {
  const { language, t, isRtl } = useTranslation();

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-tutor-msg',
      sender: 'assistant',
      text: t.tutor.welcomeMessage,
      timestamp: Date.now(),
      language,
    },
  ]);

  const [inputValue, setInputValue] = useState(
    initialTopic ? `${initialTopic} — ${t.tutor.prefillTemplate}` : ''
  );
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedNoteId, setSavedNoteId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // Voice-to-text state
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [autoSendVoice, setAutoSendVoice] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);
  const cancelledRef = useRef(false);
  const fallbackTriggeredRef = useRef(false);
  const prefixTextRef = useRef('');
  const speechFinalTextRef = useRef('');
  const autoSendRef = useRef(autoSendVoice);

  useEffect(() => {
    autoSendRef.current = autoSendVoice;
  }, [autoSendVoice]);

  const sampleQuestions = [
    t.tutor.sampleQ1,
    t.tutor.sampleQ2,
    t.tutor.sampleQ3,
    t.tutor.sampleQ4,
    t.tutor.sampleQ5,
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const clearRecordingTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const stopMediaTracks = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  const cleanupVoiceResources = useCallback(() => {
    cancelledRef.current = true;
    clearRecordingTimer();

    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {
        // ignore abort errors
      }
      recognitionRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore stop errors
      }
    }
    mediaRecorderRef.current = null;
    stopMediaTracks();
    audioChunksRef.current = [];
    setInterimTranscript('');
    setRecordingSeconds(0);
    setVoiceState('idle');
  }, [clearRecordingTimer, stopMediaTracks]);

  useEffect(() => {
    return () => {
      cleanupVoiceResources();
    };
  }, [cleanupVoiceResources]);

  const handleSend = useCallback(
    async (customMessage?: string) => {
      const textToSend = (customMessage ?? inputValue).trim();
      if (!textToSend || isLoading) return;

      if (!isOnline) {
        setApiError(t.tutor.offlineError);
        return;
      }

      setApiError(null);

      const userMessage: ChatMessage = {
        id: 'msg-' + Date.now(),
        sender: 'user',
        text: textToSend,
        timestamp: Date.now(),
        language,
      };

      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInputValue('');
      setIsLoading(true);

      try {
        const conversationHistory = newMessages.map((m) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          text: m.text,
        }));

        const res = await fetch('/api/tutor/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            language,
            languageName: getPromptLanguageName(language),
            history: conversationHistory,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || t.tutor.requestFailed);
        }

        const botMessage: ChatMessage = {
          id: 'msg-' + Date.now() + '-ai',
          sender: 'assistant',
          text: data.text,
          timestamp: Date.now(),
          language,
        };

        setMessages((prev) => [...prev, botMessage]);
        storage.incrementStat('tutorQuestionsAsked');
      } catch (err: unknown) {
        console.error('Tutor chat request failed:', err);
        const errMessage = err instanceof Error ? err.message : '';
        setApiError(errMessage || t.tutor.requestFailed);
      } finally {
        setIsLoading(false);
      }
    },
    [inputValue, isLoading, isOnline, language, messages, t.tutor.offlineError, t.tutor.requestFailed]
  );

  const combineTranscriptWithPrefix = useCallback((spoken: string) => {
    const cleanSpoken = spoken.trim();
    const prefix = prefixTextRef.current.trim();
    if (!prefix) return cleanSpoken;
    if (!cleanSpoken) return prefix;
    return `${prefix} ${cleanSpoken}`;
  }, []);

  const startTimer = useCallback(() => {
    clearRecordingTimer();
    setRecordingSeconds(0);
    timerRef.current = window.setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
  }, [clearRecordingTimer]);

  const startMediaRecorderFallback = useCallback(async () => {
    if (!isOnline) {
      setApiError(t.tutor.offlineError);
      setVoiceState('idle');
      return;
    }

    if (
      typeof MediaRecorder === 'undefined' ||
      !navigator.mediaDevices ||
      typeof navigator.mediaDevices.getUserMedia !== 'function'
    ) {
      setApiError(t.tutor.voiceUnsupported);
      setVoiceState('idle');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      audioChunksRef.current = [];
      cancelledRef.current = false;

      const selectedMime = getSupportedRecorderMimeType();
      const recorder = selectedMime
        ? new MediaRecorder(stream, { mimeType: selectedMime })
        : new MediaRecorder(stream);

      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        clearRecordingTimer();
        stopMediaTracks();
        mediaRecorderRef.current = null;
        setVoiceState('idle');
        setApiError(t.tutor.voiceFailed);
      };

      recorder.onstop = async () => {
        clearRecordingTimer();
        stopMediaTracks();
        mediaRecorderRef.current = null;

        if (cancelledRef.current) {
          audioChunksRef.current = [];
          setVoiceState('idle');
          return;
        }

        const recordedMime = recorder.mimeType || selectedMime || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: recordedMime });
        audioChunksRef.current = [];

        if (blob.size < 400) {
          setVoiceState('idle');
          setApiError(t.tutor.voiceNoSpeech);
          return;
        }

        setVoiceState('transcribing');

        try {
          const base64Audio = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const result = typeof reader.result === 'string' ? reader.result : '';
              const base64 = result.includes(',') ? result.split(',')[1] : result;
              if (!base64) {
                reject(new Error('Empty audio payload'));
              } else {
                resolve(base64);
              }
            };
            reader.onerror = () => reject(new Error('Failed to read recorded audio'));
            reader.readAsDataURL(blob);
          });

          const res = await fetch('/api/tutor/transcribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              audioBase64: base64Audio,
              mimeType: recordedMime,
              language,
              languageName: getPromptLanguageName(language),
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || t.tutor.voiceFailed);
          }

          const transcript = typeof data.text === 'string' ? data.text.trim() : '';
          if (!transcript) {
            setApiError(t.tutor.voiceNoSpeech);
            return;
          }

          const combined = combineTranscriptWithPrefix(transcript);
          setInputValue(combined);
          if (autoSendRef.current) {
            await handleSend(combined);
          }
        } catch (err: unknown) {
          const errMessage = err instanceof Error ? err.message : '';
          setApiError(errMessage || t.tutor.voiceFailed);
        } finally {
          setVoiceState('idle');
          setRecordingSeconds(0);
        }
      };

      setInterimTranscript('');
      setVoiceState('listening');
      startTimer();
      recorder.start(250);
    } catch (err: unknown) {
      clearRecordingTimer();
      stopMediaTracks();
      setVoiceState('idle');
      const errName = err instanceof DOMException ? err.name : '';
      if (errName === 'NotAllowedError' || errName === 'PermissionDeniedError' || errName === 'SecurityError') {
        setApiError(t.tutor.voicePermissionDenied);
      } else if (errName === 'NotFoundError' || errName === 'DevicesNotFoundError') {
        setApiError(t.tutor.voiceUnsupported);
      } else {
        setApiError(t.tutor.voiceFailed);
      }
    }
  }, [
    clearRecordingTimer,
    combineTranscriptWithPrefix,
    handleSend,
    isOnline,
    language,
    startTimer,
    stopMediaTracks,
    t.tutor.offlineError,
    t.tutor.voiceFailed,
    t.tutor.voiceNoSpeech,
    t.tutor.voicePermissionDenied,
    t.tutor.voiceUnsupported,
  ]);

  const stopVoiceInput = useCallback(
    (cancel = false) => {
      cancelledRef.current = cancel;
      clearRecordingTimer();

      if (recognitionRef.current) {
        try {
          if (cancel) {
            recognitionRef.current.abort();
          } else {
            recognitionRef.current.stop();
          }
        } catch {
          // ignore recognition stop/abort errors
        }
        if (cancel) {
          recognitionRef.current = null;
          setInterimTranscript('');
          setRecordingSeconds(0);
          setVoiceState('idle');
        }
        return;
      }

      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        try {
          mediaRecorderRef.current.stop();
        } catch {
          stopMediaTracks();
          setVoiceState('idle');
        }
      } else if (cancel) {
        stopMediaTracks();
        setVoiceState('idle');
      }
    },
    [clearRecordingTimer, stopMediaTracks]
  );

  const startVoiceInput = useCallback(() => {
    if (isLoading || voiceState === 'transcribing') return;

    if (voiceState === 'listening') {
      stopVoiceInput(false);
      return;
    }

    setApiError(null);
    cancelledRef.current = false;
    fallbackTriggeredRef.current = false;
    prefixTextRef.current = inputValue.trim();
    speechFinalTextRef.current = '';
    setInterimTranscript('');

    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    const canRecordMedia =
      typeof MediaRecorder !== 'undefined' &&
      Boolean(navigator.mediaDevices?.getUserMedia);

    if (!SpeechRecognitionCtor && !canRecordMedia) {
      setApiError(t.tutor.voiceUnsupported);
      return;
    }

    // Use Gemini transcription directly for custom languages or browsers lacking Web Speech API
    if (!SpeechRecognitionCtor || isCustomLanguage(language)) {
      void startMediaRecorderFallback();
      return;
    }

    try {
      const recognition = new SpeechRecognitionCtor();
      recognitionRef.current = recognition;
      recognition.lang = getSpeechRecognitionLocale(language);
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        let finalized = '';
        let interim = '';

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          const text = result[0]?.transcript || '';
          if (result.isFinal) {
            finalized += (finalized ? ' ' : '') + text.trim();
          } else {
            interim += (interim ? ' ' : '') + text.trim();
          }
        }

        speechFinalTextRef.current = finalized;
        setInterimTranscript(interim);
        const liveCombined = combineTranscriptWithPrefix(finalized || interim);
        if (liveCombined) {
          setInputValue(liveCombined);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
        const code = event.error;
        if (cancelledRef.current) return;

        if (code === 'not-allowed' || code === 'service-not-allowed') {
          clearRecordingTimer();
          recognitionRef.current = null;
          setVoiceState('idle');
          setInterimTranscript('');
          setApiError(t.tutor.voicePermissionDenied);
          return;
        }

        if (code === 'no-speech') {
          clearRecordingTimer();
          recognitionRef.current = null;
          setVoiceState('idle');
          setInterimTranscript('');
          setApiError(t.tutor.voiceNoSpeech);
          return;
        }

        if (
          (code === 'language-not-supported' || code === 'network' || code === 'audio-capture') &&
          canRecordMedia
        ) {
          fallbackTriggeredRef.current = true;
          clearRecordingTimer();
          recognitionRef.current = null;
          setInterimTranscript('');
          void startMediaRecorderFallback();
          return;
        }

        clearRecordingTimer();
        recognitionRef.current = null;
        setVoiceState('idle');
        setInterimTranscript('');
        setApiError(t.tutor.voiceFailed);
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        if (fallbackTriggeredRef.current) {
          fallbackTriggeredRef.current = false;
          return;
        }

        clearRecordingTimer();
        setRecordingSeconds(0);
        setInterimTranscript('');
        setVoiceState('idle');

        if (cancelledRef.current) {
          setInputValue(prefixTextRef.current);
          return;
        }

        const spokenText = speechFinalTextRef.current.trim();
        if (spokenText) {
          const combined = combineTranscriptWithPrefix(spokenText);
          setInputValue(combined);
          if (autoSendRef.current) {
            void handleSend(combined);
          }
        }
      };

      setVoiceState('listening');
      startTimer();
      recognition.start();
    } catch {
      clearRecordingTimer();
      recognitionRef.current = null;
      if (canRecordMedia) {
        void startMediaRecorderFallback();
      } else {
        setVoiceState('idle');
        setApiError(t.tutor.voiceUnsupported);
      }
    }
  }, [
    clearRecordingTimer,
    combineTranscriptWithPrefix,
    handleSend,
    inputValue,
    isLoading,
    language,
    startMediaRecorderFallback,
    startTimer,
    stopVoiceInput,
    t.tutor.voiceFailed,
    t.tutor.voiceNoSpeech,
    t.tutor.voicePermissionDenied,
    t.tutor.voiceUnsupported,
    voiceState,
  ]);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveAsNote = (msg: ChatMessage) => {
    const titleMatch = msg.text.match(/^#+ (.*)/m);
    const title = titleMatch ? titleMatch[1].trim() : t.tutor.defaultLessonTitle;

    const newNote: NoteItem = {
      id: 'note-from-tutor-' + Date.now(),
      title,
      subject: initialSubject || t.tutor.defaultSubject,
      language: msg.language,
      createdAt: Date.now(),
      summary: msg.text.slice(0, 180) + '...',
      keyPoints: [
        t.tutor.transcriptBullet1,
        t.tutor.transcriptBullet2,
      ],
      detailedSections: [
        {
          heading: t.tutor.lessonHeading,
          content: msg.text,
        },
      ],
      definitions: [],
      quickReviewQuestions: [t.tutor.reviewQuestionDefault],
      tags: ['Tutor Chat', getLanguageDisplayName(msg.language)],
    };

    const success = storage.saveNote(newNote);
    if (success) {
      setSavedNoteId(msg.id);
      setTimeout(() => setSavedNoteId(null), 3000);
    }
  };

  const handleClearChat = () => {
    cleanupVoiceResources();
    setMessages([
      {
        id: 'welcome-tutor-msg-reset',
        sender: 'assistant',
        text: t.tutor.welcomeResetMessage,
        timestamp: Date.now(),
        language,
      },
    ]);
    setApiError(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header Bar */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5 text-teal-700" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0f2b46]">
              {t.tutor.title}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            {t.tutor.subtitle}
          </p>
        </div>

        {/* Controls: Language Selector & Clear */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          <LanguageSelector variant="header" />

          <button
            onClick={handleClearChat}
            className="h-9 px-3 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            title={t.tutor.clearChat}
          >
            <RotateCcw className="w-3.5 h-3.5 shrink-0" />
            <span>{t.tutor.clearChat}</span>
          </button>
        </div>
      </div>

      {/* Uncertainty Notice / Academic Honesty */}
      <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-blue-900">
        <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.tutor.uncertaintyNotice}
        </p>
      </div>

      {/* Sample Question Chips */}
      <div className="space-y-2">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span>{t.tutor.sampleQuestionsTitle}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleQuestions.map((sq, i) => (
            <button
              key={i}
              onClick={() => handleSend(sq)}
              disabled={isLoading || voiceState !== 'idle'}
              className="text-xs bg-white hover:bg-teal-50 hover:border-teal-400 text-slate-700 hover:text-teal-900 py-1.5 px-3 rounded-full border border-slate-200 shadow-2xs transition-all text-start cursor-pointer disabled:opacity-50"
            >
              {sq}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 min-h-[420px] flex flex-col justify-between space-y-6">
        {/* Messages List */}
        <div className="space-y-5">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const msgIsRtl = isRtlLanguage(msg.language) || /[\u0590-\u08FF]/.test(msg.text);

            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                )}

                <div className={`max-w-[85%] sm:max-w-[78%] space-y-2 ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Speech Bubble */}
                  <div
                    dir={msgIsRtl ? 'rtl' : 'ltr'}
                    className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? 'bg-[#0f2b46] text-white rounded-se-xs'
                        : 'bg-slate-50 border border-slate-200 text-slate-900 rounded-ss-xs'
                    } ${msg.language === 'ur' ? 'font-urdu' : ''}`}
                  >
                    {!isUser && (
                      <div className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-md mb-2">
                        <Sparkles className="w-3 h-3 text-teal-600 shrink-0" />
                        <span>{t.tutor.stepByStepBadge}</span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap font-normal text-start">
                      {msg.text}
                    </div>
                  </div>

                  {/* Actions for Assistant Messages: Copy & Save */}
                  {!isUser && (
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-700 font-semibold">{t.tutor.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 shrink-0" />
                            <span>{t.tutor.copyAnswer}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => handleSaveAsNote(msg)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md hover:bg-teal-50 text-teal-700 hover:text-teal-800 border border-teal-200 transition-colors cursor-pointer"
                      >
                        {savedNoteId === msg.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="text-emerald-700 font-semibold">{t.tutor.savedSuccess}</span>
                          </>
                        ) : (
                          <>
                            <Bookmark className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                            <span>{t.tutor.saveToNotes}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  <div className={`text-[10px] text-slate-400 ${isUser ? 'text-end' : 'text-start'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                {isUser && (
                  <div className="w-9 h-9 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <User className="w-5 h-5" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-600 flex items-center gap-3 shadow-xs">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2 h-2 rounded-full bg-teal-600 animate-bounce [animation-delay:0.4s]"></div>
                </div>
                <span>
                  {t.tutor.preparingExplanation}
                </span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {apiError && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span className="break-words">{apiError}</span>
              </div>
              <button
                type="button"
                onClick={() => setApiError(null)}
                className="text-red-500 hover:text-red-700 p-1 rounded shrink-0 cursor-pointer"
                aria-label={t.common.close}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-slate-100 space-y-2.5">
          {!isOnline && (
            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
              <WifiOff className="w-4 h-4 shrink-0 text-amber-700" />
              <span>
                {t.tutor.offlineInputNotice}
              </span>
            </div>
          )}

          {/* Live Voice Status Banner */}
          {voiceState === 'listening' && (
            <div
              role="status"
              aria-live="polite"
              className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex flex-wrap items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <span className="relative flex h-3 w-3 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-900">
                    <span className="truncate">{t.tutor.voiceListening}</span>
                    <span className="font-mono text-[11px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded shrink-0">
                      {formatDuration(recordingSeconds)}
                    </span>
                  </div>
                  {interimTranscript && (
                    <p
                      dir={isRtl ? 'rtl' : 'ltr'}
                      className="text-xs text-rose-800 mt-1 italic truncate"
                    >
                      “{interimTranscript}”
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => stopVoiceInput(false)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  <Square className="w-3 h-3 fill-current shrink-0" />
                  <span>{t.tutor.voiceStop}</span>
                </button>
                <button
                  type="button"
                  onClick={() => stopVoiceInput(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.common.cancel}</span>
                </button>
              </div>
            </div>
          )}

          {voiceState === 'transcribing' && (
            <div
              role="status"
              aria-live="polite"
              className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 text-xs font-semibold flex items-center gap-2.5"
            >
              <Loader2 className="w-4 h-4 animate-spin text-teal-700 shrink-0" />
              <span>{t.tutor.voiceTranscribing}</span>
            </div>
          )}

          {/* Voice Auto-Send Preference & Hint Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => setAutoSendVoice((prev) => !prev)}
              aria-pressed={autoSendVoice}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                autoSendVoice
                  ? 'bg-teal-50 border-teal-300 text-teal-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 shrink-0 ${autoSendVoice ? 'text-teal-600' : 'text-slate-400'}`} />
              <span>{t.tutor.voiceAutoSend}</span>
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  autoSendVoice ? 'bg-teal-600' : 'bg-slate-300'
                }`}
              />
            </button>

            <span className="text-[11px] text-slate-500">
              {getLanguageDisplayName(language)}
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <button
              type="button"
              onClick={startVoiceInput}
              disabled={isLoading || voiceState === 'transcribing'}
              aria-label={voiceState === 'listening' ? t.tutor.voiceStop : t.tutor.voiceStart}
              aria-pressed={voiceState === 'listening'}
              title={voiceState === 'listening' ? t.tutor.voiceStop : t.tutor.voiceStart}
              data-testid="tutor-voice-btn"
              className={`h-[46px] min-w-[46px] px-3 rounded-xl flex items-center justify-center gap-1.5 border text-sm font-semibold transition-all focus:outline-none focus:ring-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0 ${
                voiceState === 'listening'
                  ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-600 focus:ring-rose-300 shadow-sm animate-pulse'
                  : voiceState === 'transcribing'
                    ? 'bg-teal-50 text-teal-700 border-teal-300 focus:ring-teal-200'
                    : 'bg-slate-100 hover:bg-teal-50 text-teal-700 border-slate-300 hover:border-teal-400 focus:ring-teal-200'
              }`}
            >
              {voiceState === 'transcribing' ? (
                <Loader2 className="w-5 h-5 animate-spin shrink-0" />
              ) : voiceState === 'listening' ? (
                <Square className="w-4 h-4 fill-current shrink-0" />
              ) : (
                <Mic className="w-5 h-5 shrink-0" />
              )}
            </button>

            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t.tutor.placeholder}
              disabled={isLoading || voiceState === 'transcribing'}
              dir={isRtl ? 'rtl' : 'ltr'}
              className="flex-1 min-w-0 h-[46px] bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl px-3.5 sm:px-4 text-sm text-slate-900 transition-colors disabled:opacity-60"
            />

            <button
              type="submit"
              disabled={isLoading || voiceState !== 'idle' || !inputValue.trim()}
              aria-label={t.tutor.send}
              title={t.tutor.send}
              className="h-[46px] bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-bold px-3.5 sm:px-5 rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <span className="hidden sm:inline">{t.tutor.send}</span>
              <Send className="w-4 h-4 rtl:rotate-180 shrink-0" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
