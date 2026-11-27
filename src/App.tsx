import React, { useState, useEffect } from 'react';
import { ActiveTab } from './types';
import { TranslationProvider, useTranslation } from './lib/TranslationContext';
import { Navbar } from './components/Navbar';
import { OfflineBanner } from './components/OfflineBanner';
import { LandingPage } from './components/LandingPage';
import { Dashboard } from './components/Dashboard';
import { TutorView } from './components/TutorView';
import { NotesView } from './components/NotesView';
import { QuizView } from './components/QuizView';
import { AssessmentView } from './components/AssessmentView';
import { SavedMaterialsView } from './components/SavedMaterialsView';
import { ProgressView } from './components/ProgressView';
import { AboutView } from './components/AboutView';
import { Footer } from './components/Footer';
import { AlertCircle, X, Globe } from 'lucide-react';

const TranslationLoadingSkeleton: React.FC<{ message: string }> = ({ message }) => (
  <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 animate-pulse">
    <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs sm:text-sm font-semibold">
      <Globe className="w-4 h-4 text-teal-600 animate-spin shrink-0" />
      <span>{message}</span>
    </div>
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
      <div className="h-7 w-2/3 bg-slate-200 rounded-lg"></div>
      <div className="h-4 w-full bg-slate-100 rounded-lg"></div>
      <div className="h-4 w-5/6 bg-slate-100 rounded-lg"></div>
      <div className="flex gap-3 pt-2">
        <div className="h-10 w-36 bg-teal-100 rounded-xl"></div>
        <div className="h-10 w-32 bg-slate-100 rounded-xl"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
        <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
        <div className="h-5 w-1/2 bg-slate-200 rounded-lg"></div>
        <div className="h-4 w-full bg-slate-100 rounded-lg"></div>
        <div className="h-4 w-4/5 bg-slate-100 rounded-lg"></div>
      </div>
      <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
        <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
        <div className="h-5 w-1/2 bg-slate-200 rounded-lg"></div>
        <div className="h-4 w-full bg-slate-100 rounded-lg"></div>
        <div className="h-4 w-4/5 bg-slate-100 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const AppShell: React.FC<{ isOnline: boolean }> = ({ isOnline }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('landing');
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>(undefined);
  const [selectedSubject, setSelectedSubject] = useState<string | undefined>(undefined);

  const {
    language,
    setLanguage,
    t,
    isTranslating,
    translationNotice,
    dismissTranslationNotice,
  } = useTranslation();

  const handleSelectTopic = (topic: string, subject: string) => {
    setSelectedTopic(topic);
    setSelectedSubject(subject);
  };

  const handleNavigateToTool = (tab: ActiveTab, prefillTopic?: string, prefillSubject?: string) => {
    if (prefillTopic) setSelectedTopic(prefillTopic);
    if (prefillSubject) setSelectedSubject(prefillSubject);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenOfflinePack = () => {
    setActiveTab('saved');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        isOnline={isOnline}
      />

      {/* Offline Alert Banner */}
      <OfflineBanner
        isOnline={isOnline}
        language={language}
        onOpenOfflinePack={handleOpenOfflinePack}
      />

      {/* Friendly Fallback Notice (Offline / API Translation Failure) */}
      {translationNotice && (
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-2.5 text-blue-900 text-xs sm:text-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{translationNotice}</span>
            </div>
            <button
              type="button"
              onClick={dismissTranslationNotice}
              className="p-1 rounded-md text-blue-700 hover:bg-blue-100 cursor-pointer shrink-0"
              aria-label={t.languageSelector.dismiss}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Page Content */}
      <main className="flex-1">
        {isTranslating ? (
          <TranslationLoadingSkeleton message={t.languageSelector.translatingBanner} />
        ) : (
          <>
            {activeTab === 'landing' && (
              <LandingPage
                setActiveTab={setActiveTab}
                language={language}
              />
            )}

            {activeTab === 'dashboard' && (
              <Dashboard
                setActiveTab={setActiveTab}
                language={language}
                onSelectTopic={handleSelectTopic}
                isOnline={isOnline}
              />
            )}

            {activeTab === 'assessment' && (
              <AssessmentView
                key={`assessment-${selectedTopic || 'default'}-${language}`}
                initialTopic={selectedTopic}
                initialSubject={selectedSubject}
                language={language}
                setLanguage={setLanguage}
                isOnline={isOnline}
                onNavigateToTool={handleNavigateToTool}
              />
            )}

            {activeTab === 'tutor' && (
              <TutorView
                key={`tutor-${selectedTopic || 'default'}-${language}`}
                initialTopic={selectedTopic}
                initialSubject={selectedSubject}
                language={language}
                setLanguage={setLanguage}
                isOnline={isOnline}
              />
            )}

            {activeTab === 'notes' && (
              <NotesView
                key={`notes-${selectedTopic || 'default'}-${language}`}
                initialTopic={selectedTopic}
                initialSubject={selectedSubject}
                language={language}
                setLanguage={setLanguage}
                isOnline={isOnline}
              />
            )}

            {activeTab === 'quiz' && (
              <QuizView
                key={`quiz-${selectedTopic || 'default'}-${language}`}
                initialTopic={selectedTopic}
                initialSubject={selectedSubject}
                language={language}
                setLanguage={setLanguage}
                isOnline={isOnline}
              />
            )}

            {activeTab === 'saved' && (
              <SavedMaterialsView
                language={language}
                setLanguage={setLanguage}
                isOnline={isOnline}
                onOpenQuiz={() => {
                  setActiveTab('quiz');
                }}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressView
                language={language}
                setLanguage={setLanguage}
                isOnline={isOnline}
                onNavigateToAssessment={() => setActiveTab('assessment')}
              />
            )}

            {activeTab === 'about' && (
              <AboutView
                language={language}
              />
            )}
          </>
        )}
      </main>

      {/* Educational Footer */}
      <Footer
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
      />
    </div>
  );
};

export default function App() {
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Monitor network connectivity changes
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <TranslationProvider isOnline={isOnline}>
      <AppShell isOnline={isOnline} />
    </TranslationProvider>
  );
}
