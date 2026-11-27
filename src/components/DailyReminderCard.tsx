import React, { useState, useEffect } from 'react';
import { Language, StudyReminderSetting } from '../types';
import { useTranslation } from '../lib/TranslationContext';
import { storage } from '../lib/storage';
import {
  Bell,
  BellRing,
  Clock,
  Sparkles,
  Check,
  AlertCircle,
  Volume2,
  VolumeX,
  Flame,
  ShieldAlert,
  SendHorizontal,
} from 'lucide-react';

interface DailyReminderCardProps {
  language?: Language;
  studyStreakDays: number;
}

// Gentle pleasant synthesizer chime using Web Audio API (no external file needed)
const playChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.12);

      gain.gain.setValueAtTime(0, now + idx * 0.12);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.55);
    });
  } catch (e) {
    console.warn('Web Audio playback error', e);
  }
};

export const DailyReminderCard: React.FC<DailyReminderCardProps> = ({
  studyStreakDays,
}) => {
  const { t } = useTranslation();

  const [reminder, setReminder] = useState<StudyReminderSetting>(() => storage.getStudyReminder());
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [inAppToast, setInAppToast] = useState<{ title: string; body: string } | null>(null);

  const subjectOptions = [
    { value: 'All Subjects', label: t.subjects.allSubjects },
    { value: 'Biology', label: t.subjects.biology },
    { value: 'Mathematics', label: t.subjects.mathematics },
    { value: 'Physics', label: t.subjects.physics },
    { value: 'Chemistry', label: t.subjects.chemistry },
    { value: 'General Science', label: t.subjects.generalScience },
    { value: 'English Grammar', label: t.subjects.englishGrammar },
    { value: 'Urdu Literature', label: t.subjects.urduLiterature },
  ];

  const selectedSubjectLabel =
    subjectOptions.find((s) => s.value === reminder.subjectFocus)?.label || reminder.subjectFocus;

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    } else {
      setIsSupported(false);
    }
  }, []);

  // Background reminder checker interval
  useEffect(() => {
    if (!reminder.enabled) return;

    const checkReminder = () => {
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;
      const todayDateStr = now.toISOString().slice(0, 10);

      if (currentTimeStr === reminder.time && reminder.lastTriggeredDate !== todayDateStr) {
        triggerReminder(
          t.reminders.notificationTitle,
          `${t.reminders.notificationBodyPrefix} (${selectedSubjectLabel} • ${studyStreakDays} ${t.common.days})`
        );

        const updated = {
          ...reminder,
          lastTriggeredDate: todayDateStr,
        };
        setReminder(updated);
        storage.saveStudyReminder(updated);
      }
    };

    const interval = setInterval(checkReminder, 30000);
    checkReminder();

    return () => clearInterval(interval);
  }, [reminder, studyStreakDays, t, selectedSubjectLabel]);

  const requestNotificationPermission = async () => {
    if (!isSupported) {
      setFeedbackMsg(t.reminders.browserUnsupported);
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm === 'granted') {
        setFeedbackMsg(t.reminders.permissionGranted);
        setTimeout(() => setFeedbackMsg(null), 3500);
      } else if (perm === 'denied') {
        setFeedbackMsg(t.reminders.permissionDenied);
      }
    } catch (e) {
      console.warn('Error requesting notification permission', e);
    }
  };

  const triggerReminder = (title: string, body: string) => {
    if (reminder.soundEnabled) {
      playChime();
    }

    if (isSupported && permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/favicon.ico',
          tag: 'edubridge-study-reminder',
        });
      } catch (err) {
        console.warn('Native notification failed, showing in-app alert', err);
        setInAppToast({ title, body });
      }
    } else {
      setInAppToast({ title, body });
    }
  };

  const handleTestNotification = () => {
    if (permission === 'default' && isSupported) {
      requestNotificationPermission().then(() => {
        executeTestNotification();
      });
    } else {
      executeTestNotification();
    }
  };

  const executeTestNotification = () => {
    const title = t.reminders.testTitle;
    const body = `${t.reminders.testBodyPrefix} (${selectedSubjectLabel})`;

    triggerReminder(title, body);

    setFeedbackMsg(t.reminders.testSentMessage);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const handleToggle = (enabled: boolean) => {
    if (enabled && permission === 'default' && isSupported) {
      requestNotificationPermission();
    }

    const updated = {
      ...reminder,
      enabled,
    };
    setReminder(updated);
    storage.saveStudyReminder(updated);
  };

  const handleTimeChange = (time: string) => {
    const updated = {
      ...reminder,
      time,
    };
    setReminder(updated);
    storage.saveStudyReminder(updated);
  };

  const handleSubjectChange = (subjectFocus: string) => {
    const updated = {
      ...reminder,
      subjectFocus,
    };
    setReminder(updated);
    storage.saveStudyReminder(updated);
  };

  const handleSoundToggle = (soundEnabled: boolean) => {
    const updated = {
      ...reminder,
      soundEnabled,
    };
    setReminder(updated);
    storage.saveStudyReminder(updated);
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5">
      {/* Top Header & Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              {reminder.enabled ? (
                <BellRing className="w-5 h-5 text-amber-600 animate-wiggle" />
              ) : (
                <Bell className="w-5 h-5 text-slate-400" />
              )}
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#0f2b46]">
              {t.reminders.title}
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            {t.reminders.subtitle}
          </p>
        </div>

        {/* Enable Toggle Switch */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={reminder.enabled}
              onChange={(e) => handleToggle(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-400 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
            <span className="ms-2.5 text-xs font-bold text-slate-700">
              {reminder.enabled ? t.reminders.statusActive : t.reminders.statusOff}
            </span>
          </label>
        </div>
      </div>

      {/* Browser Notification Permission Status Banner */}
      {isSupported && (
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-2">
            {permission === 'granted' ? (
              <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{t.reminders.permissionGranted}</span>
              </span>
            ) : permission === 'denied' ? (
              <span className="flex items-center gap-1.5 text-red-700 font-bold">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
                <span>{t.reminders.permissionDenied}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-amber-800 font-semibold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{t.reminders.permissionDefault}</span>
              </span>
            )}
          </div>

          {permission !== 'granted' && permission !== 'denied' && (
            <button
              onClick={requestNotificationPermission}
              className="px-3 py-1 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {t.reminders.requestPermissionBtn}
            </button>
          )}
        </div>
      )}

      {/* Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Preferred Time Picker */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>{t.reminders.reminderTimeLabel}</span>
          </label>
          <input
            type="time"
            value={reminder.time}
            onChange={(e) => handleTimeChange(e.target.value)}
            disabled={!reminder.enabled}
            className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl px-3 py-2 text-sm text-slate-900 disabled:opacity-50"
          />
        </div>

        {/* Target Subject Focus */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t.reminders.focusSubjectLabel}
          </label>
          <select
            value={reminder.subjectFocus}
            onChange={(e) => handleSubjectChange(e.target.value)}
            disabled={!reminder.enabled}
            className="w-full bg-slate-50 border border-slate-300 focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-200 rounded-xl px-3 py-2 text-sm text-slate-900 disabled:opacity-50"
          >
            {subjectOptions.map((sub) => (
              <option key={sub.value} value={sub.value}>
                {sub.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sound Toggle & Test Action */}
        <div className="space-y-1.5 flex flex-col justify-end">
          <div className="flex items-center justify-between pb-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              {reminder.soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              )}
              <span>{t.reminders.soundAlertLabel}</span>
            </span>
            <input
              type="checkbox"
              checked={reminder.soundEnabled}
              onChange={(e) => handleSoundToggle(e.target.checked)}
              disabled={!reminder.enabled}
              className="rounded text-teal-600 focus:ring-teal-400"
            />
          </div>

          <button
            onClick={handleTestNotification}
            className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <SendHorizontal className="w-3.5 h-3.5 text-teal-600 rtl:rotate-180 shrink-0" />
            <span>{t.reminders.testNotificationBtn}</span>
          </button>
        </div>
      </div>

      {/* Streak Incentive Banner */}
      <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-teal-900">
        <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          {t.reminders.streakNotice}
        </p>
      </div>

      {/* Feedback Toast Banner */}
      {feedbackMsg && (
        <div className="p-3 rounded-xl bg-slate-900 text-teal-300 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* In-App Notification Modal/Toast if triggered */}
      {inAppToast && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#0f2b46] to-[#15466e] text-white shadow-lg border border-teal-400 flex items-start justify-between gap-4 animate-scaleUp">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-teal-500 text-slate-950 rounded-lg shrink-0 mt-0.5">
              <BellRing className="w-4 h-4 text-white" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-bold text-sm text-white">{inAppToast.title}</h4>
              <p className="text-xs text-teal-100">{inAppToast.body}</p>
            </div>
          </div>
          <button
            onClick={() => setInAppToast(null)}
            aria-label={t.common.close}
            className="text-slate-300 hover:text-white text-xs font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

