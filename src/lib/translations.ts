export interface TranslationDictionary {
  appName: string;
  tagline: string;
  missionShort: string;
  common: {
    close: string;
    days: string;
    day: string;
    step: string;
    mins: string;
    sheets: string;
    sheetsPerTest: string;
    liters: string;
    grams: string;
    correct: string;
    incorrect: string;
    noOptionSelected: string;
    exampleLabel: string;
    newBadge: string;
    poweredByGemini: string;
    cancel: string;
    loading: string;
    errorGeneric: string;
    questionShort: string;
  };
  languageSelector: {
    buttonAriaLabel: string;
    searchPlaceholder: string;
    noResults: string;
    otherLanguage: string;
    customInputPlaceholder: string;
    applyCustom: string;
    translatingBanner: string;
    offlineFallbackMessage: string;
    errorFallbackMessage: string;
    quotaFallbackMessage: string;
    dismiss: string;
    recentCustom: string;
  };
  skillLevels: {
    foundational: string;
    developing: string;
    competent: string;
    proficient: string;
    mastery: string;
  };
  subjects: {
    allSubjects: string;
    generalScience: string;
    biology: string;
    physics: string;
    chemistry: string;
    mathematics: string;
    historyGeography: string;
    englishGrammar: string;
    urduGrammar: string;
    earthScience: string;
    english: string;
    urduLiterature: string;
  };
  nav: {
    home: string;
    dashboard: string;
    assessment: string;
    tutor: string;
    notes: string;
    quiz: string;
    saved: string;
    progress: string;
    about: string;
    language: string;
    offline: string;
    online: string;
    brandSubtitle: string;
    openAccess: string;
    toggleMenu: string;
  };
  offlineBanner: {
    message: string;
    viewOfflineBank: string;
  };
  footer: {
    toolsHeading: string;
    accessibilityHeading: string;
    lowBandwidthNote: string;
    copyright: string;
    craftedFor: string;
    privacyLine: string;
  };
  landing: {
    heroTitle: string;
    heroSubtitle: string;
    startLearning: string;
    startAssessment: string;
    exploreDemo: string;
    missionBadge: string;
    dedicatedTitle: string;
    forWhom: string;
    readMission: string;
    toolsHeading: string;
    toolsSubtitle: string;
    featureAssessmentTitle: string;
    featureAssessmentDesc: string;
    assessmentPillar1: string;
    assessmentPillar2: string;
    assessmentPillar3: string;
    featureTutorTitle: string;
    featureTutorDesc: string;
    tutorBullet1: string;
    tutorBullet2: string;
    tutorBullet3: string;
    tutorCta: string;
    featureNotesTitle: string;
    featureNotesDesc: string;
    notesBullet1: string;
    notesBullet2: string;
    notesBullet3: string;
    notesCta: string;
    featureQuizTitle: string;
    featureQuizDesc: string;
    quizBullet1: string;
    quizBullet2: string;
    quizBullet3: string;
    quizCta: string;
    featureOfflineTitle: string;
    featureOfflineDesc: string;
    offlineBullet1: string;
    offlineBullet2: string;
    offlineBullet3: string;
    offlineCta: string;
    paperlessBadge: string;
    paperlessDesc: string;
    quickStatsStudents: string;
    quickStatsLanguages: string;
    quickStatsFree: string;
    trustTitle: string;
    trustBody: string;
  };
  dashboard: {
    commandCenterBadge: string;
    welcome: string;
    welcomeSubtitle: string;
    todayFocus: string;
    studyStreak: string;
    quizzesCompleted: string;
    assessmentsCompleted: string;
    avgScore: string;
    savedMaterials: string;
    questionsExplored: string;
    quickActions: string;
    recentActivity: string;
    offlineNotice: string;
    noRecentActivity: string;
    paperlessBannerTitle: string;
    paperlessImpactTitle: string;
    paperlessBannerDesc: string;
    sheetsSavedShort: string;
    waterSavedShort: string;
    co2AvertedShort: string;
    gradingSavedShort: string;
    actionAssessmentTitle: string;
    actionAssessmentDesc: string;
    actionAssessmentCta: string;
    actionTutorTitle: string;
    actionTutorDesc: string;
    actionTutorCta: string;
    actionNotesTitle: string;
    actionNotesDesc: string;
    actionNotesCta: string;
    actionQuizTitle: string;
    actionQuizDesc: string;
    actionQuizCta: string;
    skillStatusTitle: string;
    skillSubcaption: string;
    viewDetailedSkills: string;
    demoBioLabel: string;
    demoBioDesc: string;
    demoMathLabel: string;
    demoMathDesc: string;
    demoPhysLabel: string;
    demoPhysDesc: string;
    jumpStartTitle: string;
    jumpStartSubtitle: string;
    paperlessTag: string;
    jumpTopic1: string;
    jumpTopic2: string;
    jumpTopic3: string;
    jumpTopic4: string;
    jumpTopic5: string;
    jumpTopic6: string;
    recentNotesTitle: string;
    viewAll: string;
    generateNewNotesBtn: string;
    recentAssessmentsTitle: string;
    fullProgressLink: string;
    takeAssessmentBtn: string;
  };
  reminders: {
    title: string;
    subtitle: string;
    enableToggle: string;
    statusActive: string;
    statusOff: string;
    reminderTimeLabel: string;
    focusSubjectLabel: string;
    permissionGranted: string;
    permissionDenied: string;
    permissionDefault: string;
    requestPermissionBtn: string;
    testNotificationBtn: string;
    testSentMessage: string;
    browserUnsupported: string;
    soundAlertLabel: string;
    streakNotice: string;
    sampleNotificationBody: string;
    notificationTitle: string;
    notificationBodyPrefix: string;
    testTitle: string;
    testBodyPrefix: string;
  };
  assessment: {
    title: string;
    subtitle: string;
    zeroPaperWaste: string;
    wasteCalloutTitle: string;
    wasteCalloutDesc: string;
    suggestionsHeading: string;
    suggestedTopic1: string;
    suggestedTopic2: string;
    suggestedTopic3: string;
    suggestedTopic4: string;
    suggestedTopic5: string;
    createTitle: string;
    topicLabel: string;
    topicPlaceholder: string;
    subjectLabel: string;
    questionDepthLabel: string;
    questionsWord: string;
    generateButton: string;
    generating: string;
    analyzingGaps: string;
    analyzingSubtext: string;
    activeTitle: string;
    diagnosticCheckBadge: string;
    questionNumber: string;
    skillTestedLabel: string;
    subtopicLabel: string;
    submitAssessment: string;
    nextQuestion: string;
    prevQuestion: string;
    resultTitle: string;
    measuredSkillLevel: string;
    scoreSummary: string;
    subtopicPerformance: string;
    paperlessTestTitle: string;
    schoolBaselineLabel: string;
    paperSheetsSaved: string;
    waterFootprintSaved: string;
    co2Averted: string;
    gradingLaborSaved: string;
    gapAnalysisTitle: string;
    strengthsHeading: string;
    weaknessesHeading: string;
    knowledgeGapsHeading: string;
    recommendedActionsHeading: string;
    studyPlanHeading: string;
    retakeButton: string;
    createNewButton: string;
    paperlessAlert: string;
    detailedQuestionReview: string;
    reviewSubtitle: string;
    correctCountLabel: string;
    questionIndexLabel: string;
    weakSubtopicsTitle: string;
    weakSubtopicsDesc: string;
    sevenDayPlanTitle: string;
    sevenDayPlanSubtitle: string;
    studentSelectedAnswer: string;
    correctAnswerLabel: string;
    explanationLabel: string;
    statusCorrect: string;
    statusIncorrect: string;
    diagnosticOverviewPrefix: string;
    startRemedyNow: string;
    calibratedFor: string;
    dayLabelPrefix: string;
    coreConceptFocus: string;
    dailyPracticeActivity: string;
    launchActivity: string;
    viewNextDay: string;
    errorEmptyTopic: string;
    errorOffline: string;
    errorGenerateFailed: string;
  };
  tutor: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    clearChat: string;
    languageNote: string;
    sampleQuestionsTitle: string;
    stepByStepBadge: string;
    copyAnswer: string;
    copied: string;
    saveToNotes: string;
    savedSuccess: string;
    uncertaintyNotice: string;
    welcomeMessage: string;
    welcomeResetMessage: string;
    prefillTemplate: string;
    offlineError: string;
    offlineInputNotice: string;
    requestFailed: string;
    preparingExplanation: string;
    defaultLessonTitle: string;
    defaultSubject: string;
    transcriptBullet1: string;
    transcriptBullet2: string;
    lessonHeading: string;
    reviewQuestionDefault: string;
    sampleQ1: string;
    sampleQ2: string;
    sampleQ3: string;
    sampleQ4: string;
    sampleQ5: string;
    voiceStart: string;
    voiceStop: string;
    voiceListening: string;
    voiceTranscribing: string;
    voiceAutoSend: string;
    voicePermissionDenied: string;
    voiceUnsupported: string;
    voiceNoSpeech: string;
    voiceFailed: string;
  };
  notes: {
    title: string;
    subtitle: string;
    topicLabel: string;
    topicPlaceholder: string;
    subjectLabel: string;
    textLabel: string;
    textPlaceholder: string;
    generateButton: string;
    generating: string;
    summaryHeading: string;
    keyPointsHeading: string;
    detailedConcepts: string;
    keyDefinitions: string;
    practiceQuestions: string;
    copyNotes: string;
    saveNotes: string;
    downloadText: string;
    sampleTopics: string;
    autoSaveNote: string;
    savedLocalBadge: string;
    realWorldExample: string;
    errorEmptyTopic: string;
    errorOffline: string;
    errorGenerateFailed: string;
    sampleTopic1: string;
    sampleTopic2: string;
    sampleTopic3: string;
    sampleTopic4: string;
    sampleTopic5: string;
    sampleTopic6: string;
  };
  quiz: {
    title: string;
    subtitle: string;
    suggestionsHeading: string;
    topicLabel: string;
    topicPlaceholder: string;
    subjectLabel: string;
    difficultyLabel: string;
    numQuestionsLabel: string;
    generateButton: string;
    generating: string;
    questionProgress: string;
    submitQuiz: string;
    nextQuestion: string;
    previousQuestion: string;
    scoreTitle: string;
    scoreSubtitle: string;
    retakeQuiz: string;
    saveResult: string;
    explanationsTitle: string;
    yourAnswer: string;
    correctAnswer: string;
    hintLabel: string;
    hintPrefix: string;
    masteryHigh: string;
    masteryMedium: string;
    masteryLow: string;
    createAnother: string;
    stepByStepSolution: string;
    whyCorrect: string;
    errorEmptyTopic: string;
    errorOffline: string;
    errorGenerateFailed: string;
    suggestedTopic1: string;
    suggestedTopic2: string;
    suggestedTopic3: string;
    suggestedTopic4: string;
    suggestedTopic5: string;
    difficultyLevels: {
      beginner: string;
      intermediate: string;
      advanced: string;
    };
  };
  saved: {
    title: string;
    subtitle: string;
    savedLocallyBadge: string;
    offlinePackBadge: string;
    readFullGuide: string;
    readNotes: string;
    questionsCountSuffix: string;
    takeQuiz: string;
    filterAll: string;
    filterNotes: string;
    filterQuizzes: string;
    filterOfflineGuides: string;
    searchPlaceholder: string;
    emptyMessage: string;
    emptyHint: string;
    deleteConfirm: string;
    offlineGuaranteed: string;
    summaryLabel: string;
    coreTakeaways: string;
    detailedExplanation: string;
    closeModal: string;
  };
  progress: {
    title: string;
    subtitle: string;
    localActualDataBadge: string;
    analyticsHeading: string;
    quizHistoryHeading: string;
    assessmentHistoryHeading: string;
    subjectBreakdown: string;
    emptyHistory: string;
    localNote: string;
    skillMeasurementHeading: string;
    paperlessImpactHeading: string;
    paperlessIntro: string;
    digitalTestsTaken: string;
    sheetsSavedLabel: string;
    waterSavedLabel: string;
    carbonSavedLabel: string;
    gradingHoursLabel: string;
    baselinePerTestSuffix: string;
    waterAssumptionShort: string;
    carbonAssumptionShort: string;
    laborAssumptionShort: string;
    schoolBaselineHeading: string;
    schoolBaselineDesc: string;
    baselineSheetsLabel: string;
    baselineSheetsHelp: string;
    sheetsLabel: string;
    quickPresetsLabel: string;
    preset2: string;
    preset3: string;
    preset5: string;
    documentedAssumptionsTitle: string;
    waterCardTitle: string;
    carbonCardTitle: string;
    laborCardTitle: string;
    assumptionWater: string;
    assumptionCarbon: string;
    assumptionLabor: string;
    assumptionCitation: string;
    assessmentComparisonHeading: string;
    assessmentComparisonDesc: string;
    verifiedAttemptsBadge: string;
    attemptSingular: string;
    attemptPlural: string;
    initialBaseline: string;
    takeReAssessment: string;
    previousAttempt: string;
    firstBenchmark: string;
    latestAttempt: string;
    gainedLabel: string;
    shiftLabel: string;
    maintainedLabel: string;
    improvementDelta: string;
    declineDelta: string;
    noChangeDelta: string;
    comparisonSubtopicShift: string;
    fullReviewModalTitle: string;
    avgDiagnosticScore: string;
    gapsDetected: string;
    subjectMeasuredSub: string;
    standardsCalibrated: string;
    scoreLabel: string;
    assessmentsWord: string;
    recordedTestsWord: string;
    colDate: string;
    colTopic: string;
    colSubject: string;
    colSkillLevel: string;
    colScore: string;
    colAction: string;
    viewGaps: string;
    badgesTitle: string;
    milestone1Title: string;
    milestone1Desc: string;
    milestone2Title: string;
    milestone2Desc: string;
    milestone3Title: string;
    milestone3Desc: string;
    milestone4Title: string;
    milestone4Desc: string;
    exportData: string;
    resetHistory: string;
    resetConfirm: string;
    tabQuestions: string;
    tabGaps: string;
    tabStudyPlan: string;
    noArchivedQuestions: string;
    noGapReport: string;
    noStudyPlan: string;
    practicePrefix: string;
  };
  about: {
    title: string;
    missionBadge: string;
    missionHeading: string;
    missionBody: string;
    accessibilityHeading: string;
    offlineBody: string;
    pedagogyHeading: string;
    pedagogyBody: string;
    aiEthicsHeading: string;
    honestyBody: string;
    multilingualHeading: string;
    multilingualBody: string;
    howToUseOfflineHeading: string;
    paperlessHeading: string;
    wasteBody: string;
    wasteCard1Val: string;
    wasteCard1Desc: string;
    wasteCard2Val: string;
    wasteCard2Desc: string;
    wasteCard3Val: string;
    wasteCard3Desc: string;
    wasteCard4Val: string;
    wasteCard4Desc: string;
    studyFlowHeading: string;
    flowStep1Title: string;
    flowStep1Desc: string;
    flowStep2Title: string;
    flowStep2Desc: string;
    flowStep3Title: string;
    flowStep3Desc: string;
    privacyHeading: string;
    privacyLine: string;
  };
}

export const builtInTranslations: Record<'en' | 'ur', TranslationDictionary> = {
  en: {
    appName: 'EduBridge AI',
    tagline: 'Making quality education accessible to every student, everywhere.',
    missionShort:
      'Dedicated to empowering rural and underserved students with free, high-quality, multilingual learning and paperless self-measurement tools.',
    common: {
      close: 'Close',
      days: 'Days',
      day: 'Day',
      step: 'Step',
      mins: 'Mins',
      sheets: 'Sheets',
      sheetsPerTest: 'Sheets / Test',
      liters: 'Liters',
      grams: 'g',
      correct: 'Correct',
      incorrect: 'Incorrect',
      noOptionSelected: 'No option selected',
      exampleLabel: 'Example:',
      newBadge: 'New',
      poweredByGemini: 'Powered by Gemini AI',
      cancel: 'Cancel',
      loading: 'Loading...',
      errorGeneric: 'Something went wrong. Please try again.',
      questionShort: 'Q',
    },
    languageSelector: {
      buttonAriaLabel: 'Select application language',
      searchPlaceholder: 'Search any language...',
      noResults: 'No matching language found',
      otherLanguage: 'Other language...',
      customInputPlaceholder: 'Type any language name (e.g. Marathi, Somali)',
      applyCustom: 'Apply',
      translatingBanner: 'Translating interface into your selected language...',
      offlineFallbackMessage: 'You are offline and this language is not cached yet. Showing English for now.',
      errorFallbackMessage: 'Could not translate the interface right now. Showing English instead.',
      quotaFallbackMessage:
        'Daily AI translation limit reached. Showing English for now—built-in languages (English, Urdu, Arabic, Hindi, Spanish, French) still work without quota, or you can add a billing-enabled key in Settings > Secrets.',
      dismiss: 'Dismiss',
      recentCustom: 'Custom',
    },
    skillLevels: {
      foundational: 'Foundational (Level 1)',
      developing: 'Developing (Level 2)',
      competent: 'Competent (Level 3)',
      proficient: 'Proficient (Level 4)',
      mastery: 'Mastery (Level 5)',
    },
    subjects: {
      allSubjects: 'All Subjects',
      generalScience: 'General Science',
      biology: 'Biology',
      physics: 'Physics',
      chemistry: 'Chemistry',
      mathematics: 'Mathematics',
      historyGeography: 'History & Geography',
      englishGrammar: 'English Grammar',
      urduGrammar: 'Urdu Grammar',
      earthScience: 'Earth Science',
      english: 'English',
      urduLiterature: 'Urdu Literature',
    },
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      assessment: 'Self-Assessment',
      tutor: 'AI Tutor',
      notes: 'Smart Notes',
      quiz: 'Quiz Generator',
      saved: 'Saved Materials',
      progress: 'Progress & Skills',
      about: 'About',
      language: 'Language',
      offline: 'Offline Mode Active',
      online: 'Connected',
      brandSubtitle: 'Quality education for every student',
      openAccess: 'Open Access',
      toggleMenu: 'Toggle navigation menu',
    },
    offlineBanner: {
      message: 'Saved notes and results work offline. AI features need an internet connection.',
      viewOfflineBank: 'View Offline Study Bank',
    },
    footer: {
      toolsHeading: 'Learning Tools',
      accessibilityHeading: 'Accessibility & Language',
      lowBandwidthNote: 'Engineered for low-bandwidth mobile connections, clear contrast, and accessible screen readers.',
      copyright: 'Education open and free for every student.',
      craftedFor: 'Crafted for underserved rural communities with',
      privacyLine: 'No accounts or tracking. Notes and scores are stored in your browser. Your questions are sent to the Gemini API.',
    },
    landing: {
      heroTitle: 'Quality Education & Paperless Self-Measurement for Every Student',
      heroSubtitle:
        'EduBridge AI bridges the educational divide for rural and underserved learners. Diagnose knowledge gaps with instant self-assessments, eliminate paper test waste, ask questions in simple words, and receive personalized study plans in any language.',
      startLearning: 'Go to Dashboard',
      startAssessment: 'Take Diagnostic Assessment',
      exploreDemo: 'Try AI Tutor',
      missionBadge: 'Code for Humanity: Self-Measurement & Waste Reduction',
      dedicatedTitle: 'Dedicated to Underserved and Rural Students',
      forWhom:
        'Built specifically for students with limited school resources, slow internet connections, or self-directed study needs, eliminating printed test booklet waste.',
      readMission: 'Read Our Mission',
      toolsHeading: 'Four Core Tools Built for Real Learning',
      toolsSubtitle:
        'Every feature is intentionally designed to work cleanly on budget devices, with slow internet, and for self-directed study.',
      featureAssessmentTitle: 'Diagnostic Self-Assessment & Gap Detector',
      featureAssessmentDesc:
        'Test your understanding across specific subtopics. Gemini detects exact knowledge gaps, measures your calibrated skill level, and creates a step-by-step remedial plan.',
      assessmentPillar1: 'Subtopic-calibrated scores',
      assessmentPillar2: 'AI knowledge gap detection',
      assessmentPillar3: 'Zero test paper printing waste',
      featureTutorTitle: '24/7 AI Personal Tutor',
      featureTutorDesc:
        'Friendly step-by-step guidance in your chosen language. No question is too basic, and concepts are explained with real-world village and daily-life analogies.',
      tutorBullet1: 'Works in any language you choose',
      tutorBullet2: 'Step-by-step problem breakdown',
      tutorBullet3: 'Prompted for accurate, step-by-step explanations. Always verify important facts.',
      tutorCta: 'Open AI Tutor',
      featureNotesTitle: 'Smart Revision Notes',
      featureNotesDesc:
        'Paste textbook paragraphs or enter any syllabus topic to receive clear summaries, bulleted takeaways, and vocabulary definitions in seconds.',
      notesBullet1: 'Summaries, bullet takeaways & definitions',
      notesBullet2: 'Paste complex textbook passages for quick synthesis',
      notesBullet3: 'One-click save to offline study library',
      notesCta: 'Create Study Notes',
      featureQuizTitle: 'Adaptive Practice Quizzes',
      featureQuizDesc:
        'Practice with instant multiple-choice questions matched to your grade level. Get clear explanations for every correct and incorrect answer.',
      quizBullet1: 'Customizable difficulty (Beginner to Advanced)',
      quizBullet2: 'Instant score calculation & full solution review',
      quizBullet3: 'Auto-recorded performance history',
      quizCta: 'Take a Quiz',
      featureOfflineTitle: 'Low-Connectivity Ready',
      featureOfflineDesc:
        'Saved notes and results work offline. AI features need an internet connection.',
      offlineBullet1: 'True browser localStorage persistence',
      offlineBullet2: 'Pre-cached foundational curriculum guides',
      offlineBullet3: 'Transparent connectivity state notifications',
      offlineCta: 'Access Saved Materials',
      paperlessBadge: '100% Paperless & Zero Printing Waste',
      paperlessDesc:
        'Replaces disposable paper practice sheets, physical test booklets, and manual grading hours in resource-constrained schools.',
      quickStatsStudents: '100% Free & Open Access',
      quickStatsLanguages: 'Any Language Worldwide',
      quickStatsFree: 'Offline Saved Study Library',
      trustTitle: 'Our Academic Integrity & Privacy Pledge',
      trustBody:
        'No accounts or tracking. Notes and scores are stored in your browser. Your questions are sent to the Gemini API. Prompted for accurate, step-by-step explanations. Always verify important facts.',
    },
    dashboard: {
      commandCenterBadge: 'Student Learning & Self-Measurement Command Center',
      welcome: 'Welcome back, Student!',
      welcomeSubtitle:
        'Here is your learning command center. All your study resources and diagnostic metrics are saved locally on this device.',
      todayFocus: 'What would you like to measure or study today?',
      studyStreak: 'Study Streak',
      quizzesCompleted: 'Practice Quizzes',
      assessmentsCompleted: 'Diagnostic Assessments',
      avgScore: 'Average Score',
      savedMaterials: 'Saved Study Items',
      questionsExplored: 'Questions Explored',
      quickActions: 'Quick Learning Actions',
      recentActivity: 'Recent Study Activity',
      offlineNotice: 'Saved notes and results work offline. AI features need an internet connection.',
      noRecentActivity:
        'No study activity recorded yet. Try taking a diagnostic self-assessment or asking the AI Tutor a question!',
      paperlessBannerTitle: 'Measurement-Related Waste Prevented',
      paperlessImpactTitle: 'Paperless Self-Measurement Impact',
      paperlessBannerDesc:
        'By assessing yourself digitally on EduBridge AI, you prevent physical test paper consumption, preserve water, and eliminate repetitive grading delay.',
      sheetsSavedShort: 'Sheets Saved',
      waterSavedShort: 'Water Saved',
      co2AvertedShort: 'CO2e Averted',
      gradingSavedShort: 'Grading Saved',
      actionAssessmentTitle: 'Self-Assessment',
      actionAssessmentDesc: 'Diagnose knowledge gaps with AI and measure actual skill levels.',
      actionAssessmentCta: 'Start Assessment',
      actionTutorTitle: 'Ask AI Tutor',
      actionTutorDesc: 'Step-by-step explanations in your chosen language.',
      actionTutorCta: 'Start Chat',
      actionNotesTitle: 'Create Smart Notes',
      actionNotesDesc: 'Generate structured summaries & key definitions.',
      actionNotesCta: 'Generate Notes',
      actionQuizTitle: 'Practice Quiz',
      actionQuizDesc: 'Test understanding with instant feedback.',
      actionQuizCta: 'Start Quiz',
      skillStatusTitle: 'Current Calibrated Skill Levels',
      skillSubcaption: 'Calibrated skill levels calculated from real student diagnostic assessments:',
      viewDetailedSkills: 'View Detailed Skills',
      demoBioLabel: 'Biology / Life Science',
      demoBioDesc: 'Mastered photosynthesis & stomata; revision recommended for enzyme denaturation.',
      demoMathLabel: 'Mathematics',
      demoMathDesc: 'Solid on basic fractions; recommend practicing multi-step equation balancing.',
      demoPhysLabel: 'Physics',
      demoPhysDesc: 'Good recall of first two laws; action-reaction vector pairs require targeted study.',
      jumpStartTitle: 'Curriculum Jump-Start Topics',
      jumpStartSubtitle: 'Click any topic to launch an instant paperless diagnostic assessment:',
      paperlessTag: 'Paperless Self-Measurement',
      jumpTopic1: 'Photosynthesis & Leaves',
      jumpTopic2: 'Fractions & Ratios',
      jumpTopic3: "Newton's Laws of Motion",
      jumpTopic4: 'Water Cycle & Climate',
      jumpTopic5: 'Cell Structure & Organelles',
      jumpTopic6: 'English Active & Passive Voice',
      recentNotesTitle: 'Recent Study Notes',
      viewAll: 'View all',
      generateNewNotesBtn: '+ Generate New Notes',
      recentAssessmentsTitle: 'Recent Diagnostic Assessments',
      fullProgressLink: 'Full Progress',
      takeAssessmentBtn: 'Take Diagnostic Assessment',
    },
    reminders: {
      title: 'Daily Study Habit Reminders',
      subtitle: 'Build consistent learning habits. Get a browser notification at your chosen study hour.',
      enableToggle: 'Enable Daily Reminder',
      statusActive: 'Active',
      statusOff: 'Off',
      reminderTimeLabel: 'Preferred Study Time',
      focusSubjectLabel: 'Target Study Focus',
      permissionGranted: 'Notifications Enabled in Browser',
      permissionDenied: 'Notifications Blocked in Browser (Click lock icon to enable)',
      permissionDefault: 'Permission Required',
      requestPermissionBtn: 'Allow Browser Notifications',
      testNotificationBtn: 'Test Notification Now',
      testSentMessage: 'Test notification sent! Check your desktop/device alerts.',
      browserUnsupported: 'Browser does not support Notification API; in-app reminder alerts will be used.',
      soundAlertLabel: 'Play Gentle Chime',
      streakNotice: 'Students with active study reminders are 3x more likely to maintain a 7-day learning streak!',
      sampleNotificationBody: 'Time for your daily EduBridge AI study session! Keep your learning streak alive.',
      notificationTitle: 'EduBridge AI: Daily Study Time!',
      notificationBodyPrefix: 'Time for your daily study session! Keep your study streak alive.',
      testTitle: 'EduBridge AI: Daily Study Reminder',
      testBodyPrefix: 'Test Alert: Daily study reminder is active!',
    },
    assessment: {
      title: 'Diagnostic Self-Assessment',
      subtitle: 'Measure your actual mastery, identify knowledge gaps with AI, and eliminate paper practice sheet waste.',
      zeroPaperWaste: 'Zero Paper Waste',
      wasteCalloutTitle: 'Self-Measurement: Eliminating Paper-Based Assessment Waste',
      wasteCalloutDesc:
        'Rural schools frequently spend scarce funds printing disposable practice test booklets and grading manually. Digital self-assessment delivers instant calibrated skill metrics, detects knowledge gaps, and saves paper sheets per test.',
      suggestionsHeading: 'Curriculum Diagnostic Suggestions:',
      suggestedTopic1: 'Photosynthesis & Leaf Anatomy',
      suggestedTopic2: 'Cell Structure & Organelles',
      suggestedTopic3: "Newton's Laws & Force Equilibrium",
      suggestedTopic4: 'Fraction Operations & Ratios',
      suggestedTopic5: 'Water Cycle & Climate Systems',
      createTitle: 'Create New Diagnostic Assessment',
      topicLabel: 'Syllabus Topic to Measure',
      topicPlaceholder: 'e.g. Plant Physiology & Photosynthesis, Fractions & Decimals, Newton Laws...',
      subjectLabel: 'Subject Category',
      questionDepthLabel: 'Diagnostic Question Depth',
      questionsWord: 'Questions',
      generateButton: 'Generate Diagnostic Assessment',
      generating: 'Synthesizing Calibrated Assessment...',
      analyzingGaps: 'Gemini AI is analyzing your answers & detecting knowledge gaps...',
      analyzingSubtext:
        'Synthesizing calibrated skill metrics, strengths, and personalized remedial learning steps...',
      activeTitle: 'Assessment in Progress',
      diagnosticCheckBadge: 'Diagnostic Self-Assessment',
      questionNumber: 'Question',
      skillTestedLabel: 'Skill Tested',
      subtopicLabel: 'Subtopic',
      submitAssessment: 'Submit & Detect Learning Gaps',
      nextQuestion: 'Next Question',
      prevQuestion: 'Previous Question',
      resultTitle: 'Diagnostic Measurement & Skill Report',
      measuredSkillLevel: 'Measured Skill Level',
      scoreSummary: 'Overall Assessment Score',
      subtopicPerformance: 'Subtopic Performance Breakdown',
      paperlessTestTitle: 'Paperless Assessment Impact for this Test:',
      schoolBaselineLabel: 'School Baseline:',
      paperSheetsSaved: 'Paper sheets saved',
      waterFootprintSaved: 'Water footprint saved',
      co2Averted: 'CO2e emissions averted',
      gradingLaborSaved: 'Grading labor saved',
      gapAnalysisTitle: 'AI Learning Gap Detection',
      strengthsHeading: 'Identified Strengths & Mastered Concepts',
      weaknessesHeading: 'Vulnerable Areas Needing Reinforcement',
      knowledgeGapsHeading: 'Specific Knowledge Gaps Detected',
      recommendedActionsHeading: 'Recommended Remedial Learning Actions',
      studyPlanHeading: 'Personalized Remedial Study Plan',
      retakeButton: 'Retake This Assessment',
      createNewButton: 'Start New Assessment',
      paperlessAlert: 'Digital Self-Measurement: Replaced paper test booklet & manual grading sheets.',
      detailedQuestionReview: 'Detailed Question-by-Question Diagnostic Review',
      reviewSubtitle:
        'Every question, your submitted response, the verified correct option, and pedagogical explanation:',
      correctCountLabel: 'Correct',
      questionIndexLabel: 'Question',
      weakSubtopicsTitle: 'Subtopics Requiring Remediation',
      weakSubtopicsDesc:
        'Based on your actual assessment submissions, the following specific subtopics had incorrect answers and require targeted remediation:',
      sevenDayPlanTitle: '7-Day Personalized Remedial Study Plan',
      sevenDayPlanSubtitle:
        'Curriculum-tailored daily learning journey based on your measured skill level and missed concepts.',
      studentSelectedAnswer: 'Your Selected Answer',
      correctAnswerLabel: 'Correct Answer',
      explanationLabel: 'Pedagogical Explanation & Misconception Analysis',
      statusCorrect: 'Correctly Answered',
      statusIncorrect: 'Needs Attention',
      diagnosticOverviewPrefix: 'Diagnostic Overview:',
      startRemedyNow: 'Start Remedy Now',
      calibratedFor: 'Calibrated for:',
      dayLabelPrefix: 'Day',
      coreConceptFocus: 'Core Concept Focus:',
      dailyPracticeActivity: 'Daily Practice Activity:',
      launchActivity: 'Launch This Remedial Activity',
      viewNextDay: 'View Next Day',
      errorEmptyTopic: 'Please enter an assessment topic!',
      errorOffline:
        'Saved notes and results work offline. AI features need an internet connection.',
      errorGenerateFailed: 'Failed to generate assessment. Please try again.',
    },
    tutor: {
      title: 'AI Personal Tutor',
      subtitle: 'Ask any academic question. Your tutor explains concepts step by step with easy examples and no jargon.',
      placeholder: 'Type your question here (e.g. How does photosynthesis work in simple words?)...',
      send: 'Ask Question',
      clearChat: 'Clear Conversation',
      languageNote: 'Choose your preferred teaching language:',
      sampleQuestionsTitle: 'Sample questions to try:',
      stepByStepBadge: 'Step-by-step explanation',
      copyAnswer: 'Copy',
      copied: 'Copied!',
      saveToNotes: 'Save as Note',
      savedSuccess: 'Saved to My Materials!',
      uncertaintyNotice:
        'Prompted for accurate, step-by-step explanations. Always verify important facts. No accounts or tracking. Notes and scores are stored in your browser. Your questions are sent to the Gemini API.',
      welcomeMessage:
        'Welcome! I am your EduBridge AI Personal Tutor. Ask me any question from Science, Math, History, or Grammar. I will explain it step by step using simple, real-world examples!',
      welcomeResetMessage: 'Conversation refreshed! What new educational concept would you like to master today?',
      prefillTemplate: 'Can you explain this topic step by step with a simple real-world example?',
      offlineError:
        'Saved notes and results work offline. AI features need an internet connection.',
      offlineInputNotice: 'Saved notes and results work offline. AI features need an internet connection.',
      requestFailed: 'Unable to reach the tutor service. Please try again.',
      preparingExplanation: 'AI Tutor is preparing your step-by-step explanation...',
      defaultLessonTitle: 'Tutor Study Lesson',
      defaultSubject: 'General Studies',
      transcriptBullet1: 'Step-by-step tutoring transcript',
      transcriptBullet2: 'Concrete practical concept analogy',
      lessonHeading: 'Tutoring Explanation',
      reviewQuestionDefault: 'What is the main takeaway of this concept?',
      sampleQ1: 'How does photosynthesis work using a kitchen or cooking analogy?',
      sampleQ2: "Explain Newton's 3rd Law of Motion with everyday examples.",
      sampleQ3: 'How do fractions work in real life using bread or money?',
      sampleQ4: 'What causes rain in the water cycle step by step?',
      sampleQ5: 'What is a plant cell wall and why do animals not have one?',
      voiceStart: 'Speak your question',
      voiceStop: 'Stop recording',
      voiceListening: 'Listening... Speak your question clearly',
      voiceTranscribing: 'Converting your speech to text...',
      voiceAutoSend: 'Auto-send voice',
      voicePermissionDenied: 'Microphone access denied. Please allow microphone permission in your browser settings.',
      voiceUnsupported: 'Voice input is not supported in this browser. Please type your question.',
      voiceNoSpeech: 'No speech detected. Please tap the microphone and try speaking again.',
      voiceFailed: 'Could not convert speech to text. Please try again or type your question.',
    },
    notes: {
      title: 'Smart Notes Generator',
      subtitle: 'Transform any textbook topic, syllabus concept, or study text into structured, easy-to-revise notes.',
      topicLabel: 'Topic or Chapter Title',
      topicPlaceholder: 'e.g. Water Cycle, Cell Division, Fractions, Mughal History...',
      subjectLabel: 'Subject Category',
      textLabel: 'Study Material (Optional: Paste textbook excerpts or notes)',
      textPlaceholder:
        'Paste paragraph from your textbook or syllabus here, or leave empty to generate from topic title alone...',
      generateButton: 'Generate Structured Notes',
      generating: 'Synthesizing Educational Notes...',
      summaryHeading: 'Executive Overview',
      keyPointsHeading: 'Key Learning Takeaways',
      detailedConcepts: 'Detailed Explanations & Examples',
      keyDefinitions: 'Key Vocabulary & Formulas',
      practiceQuestions: 'Quick Self-Check Questions',
      copyNotes: 'Copy All Text',
      saveNotes: 'Save to Offline Materials',
      downloadText: 'Download Note File',
      sampleTopics: 'Popular curriculum topics:',
      autoSaveNote: 'Saved notes and results work offline. AI features need an internet connection.',
      savedLocalBadge: 'Saved to Local Storage',
      realWorldExample: 'Real-world example:',
      errorEmptyTopic: 'Please enter a topic title!',
      errorOffline: 'Saved notes and results work offline. AI features need an internet connection.',
      errorGenerateFailed: 'Failed to generate notes. Please check connection.',
      sampleTopic1: 'Water Cycle & Evaporation',
      sampleTopic2: 'Photosynthesis & Respiration',
      sampleTopic3: 'Fractions & Common Denominators',
      sampleTopic4: "Newton's Laws of Motion",
      sampleTopic5: 'States of Matter (Solid, Liquid, Gas)',
      sampleTopic6: 'Parts of Speech in English',
    },
    quiz: {
      title: 'AI Quiz Generator',
      subtitle: 'Test your understanding with instant, custom multiple-choice questions and clear answer explanations.',
      suggestionsHeading: 'Quick Quiz Suggestions:',
      topicLabel: 'Quiz Subject & Topic',
      topicPlaceholder: 'e.g. Newton Laws of Motion, Digestive System, Fractions, Geometry...',
      subjectLabel: 'Subject',
      difficultyLabel: 'Difficulty Level',
      numQuestionsLabel: 'Number of Questions',
      generateButton: 'Generate Interactive Quiz',
      generating: 'Crafting Educational Quiz Questions...',
      questionProgress: 'Question',
      submitQuiz: 'Submit & View Score',
      nextQuestion: 'Next Question',
      previousQuestion: 'Previous Question',
      scoreTitle: 'Quiz Performance Summary',
      scoreSubtitle: 'Review your results and learn from the detailed answer explanations below.',
      retakeQuiz: 'Retake This Quiz',
      saveResult: 'Save Score to Progress',
      explanationsTitle: 'Detailed Solutions & Explanations',
      yourAnswer: 'Your Answer',
      correctAnswer: 'Correct Answer',
      hintLabel: 'Hint',
      hintPrefix: 'Hint:',
      masteryHigh: 'Outstanding mastery! You have understood the fundamental principles of this topic.',
      masteryMedium: 'Good effort! Review the detailed solution explanations below to cement your understanding.',
      masteryLow: 'Keep practicing! Read through each explanation below and try retaking the quiz.',
      createAnother: 'Create Another Quiz',
      stepByStepSolution: 'Step-by-step conceptual solution',
      whyCorrect: 'Why this is the correct answer:',
      errorEmptyTopic: 'Please enter a quiz topic!',
      errorOffline: 'Saved notes and results work offline. AI features need an internet connection.',
      errorGenerateFailed: 'Failed to generate quiz. Please try again.',
      suggestedTopic1: 'Photosynthesis & Leaves',
      suggestedTopic2: "Newton's Laws of Motion",
      suggestedTopic3: 'Fractions & Percentages',
      suggestedTopic4: 'Solar System & Planets',
      suggestedTopic5: 'Water Cycle & Rain',
      difficultyLevels: {
        beginner: 'Beginner (School / Basic)',
        intermediate: 'Intermediate (Standard Syllabus)',
        advanced: 'Advanced (Challenging / Deep)',
      },
    },
    saved: {
      title: 'My Saved Materials',
      subtitle: 'Saved notes and results work offline. AI features need an internet connection.',
      savedLocallyBadge: 'Saved Locally on this Device',
      offlinePackBadge: 'Offline Pack',
      readFullGuide: 'Read Full Guide',
      readNotes: 'Read Notes',
      questionsCountSuffix: 'Questions Quiz',
      takeQuiz: 'Take This Quiz',
      filterAll: 'All Items',
      filterNotes: 'Revision Notes',
      filterQuizzes: 'Saved Quizzes & Tests',
      filterOfflineGuides: 'Core Offline Pack',
      searchPlaceholder: 'Search your saved notes and topics...',
      emptyMessage: 'No saved items found. Generate notes or save tutor answers to access them offline anytime!',
      emptyHint: 'Try clearing your search query or creating new notes using the Smart Notes Generator.',
      deleteConfirm: 'Are you sure you want to remove this item from your device?',
      offlineGuaranteed: 'Saved notes and results work offline. AI features need an internet connection.',
      summaryLabel: 'Summary',
      coreTakeaways: 'Core Takeaways',
      detailedExplanation: 'Detailed Explanation',
      closeModal: 'Close',
    },
    progress: {
      title: 'My Learning & Skill Measurement',
      subtitle: 'Track your measured skill levels, learning gap remedies, and paperless environmental savings.',
      localActualDataBadge: 'Actual Student Data (Private Local Storage)',
      analyticsHeading: 'Skill Analytics & Mastery',
      quizHistoryHeading: 'Recent Practice History',
      assessmentHistoryHeading: 'Diagnostic Self-Assessment History',
      subjectBreakdown: 'Calibrated Performance by Subject',
      emptyHistory: 'No assessments completed yet. Take your first diagnostic test to measure your skill level!',
      localNote:
        'No accounts or tracking. Notes and scores are stored in your browser. Your questions are sent to the Gemini API.',
      skillMeasurementHeading: 'Measured Skill Trajectory',
      paperlessImpactHeading: 'Paperless Assessment & Waste Elimination',
      paperlessIntro:
        'Every diagnostic assessment completed digitally on EduBridge AI eliminates physical test booklet printing and manual answer sheet grading. Here is your actual estimated savings tally:',
      digitalTestsTaken: 'Digital Tests Taken',
      sheetsSavedLabel: 'Paper Sheets Saved',
      waterSavedLabel: 'Water Saved (Liters)',
      carbonSavedLabel: 'CO2e Averted (Grams)',
      gradingHoursLabel: 'Grading Minutes Saved',
      baselinePerTestSuffix: 'sheets per test baseline',
      waterAssumptionShort: '10 Liters conserved per sheet',
      carbonAssumptionShort: '4.5g CO2e avoided per sheet',
      laborAssumptionShort: '~3.5 mins saved per digital test',
      schoolBaselineHeading: 'School Printed Assessment Baseline Configuration',
      schoolBaselineDesc:
        'Customize the baseline number of physical paper sheets your school or classroom typically prints per test (question sheets + answer sheet + teacher rubric).',
      baselineSheetsLabel: 'Paper Sheets Per Printed Test Baseline',
      baselineSheetsHelp:
        'Standard school baseline is 3 sheets (2 sheets question booklet + 1 grading sheet). Configurable from 1 to 10 sheets.',
      sheetsLabel: 'Sheets',
      quickPresetsLabel: 'School Presets:',
      preset2: '2 Sheets (Quick Quiz)',
      preset3: '3 Sheets (Standard Exam - Default)',
      preset5: '5 Sheets (Full Booklet)',
      documentedAssumptionsTitle: 'Documented Environmental Conversion Assumptions',
      waterCardTitle: 'Water Conservation',
      carbonCardTitle: 'Carbon Footprint',
      laborCardTitle: 'Teacher Grading Labor',
      assumptionWater:
        'Water: ~10 Liters conserved per A4 paper sheet (Environmental Paper Network lifecycle analysis for standard virgin woodfree paper).',
      assumptionCarbon:
        'CO2e: ~4.5g carbon emissions averted per sheet (conservative cradle-to-gate paper production and transport estimate).',
      assumptionLabor:
        'Grading Labor: ~3.5 minutes saved per student per test via automated instant evaluation instead of manual grading.',
      assumptionCitation:
        'All metrics are mathematical estimates calculated directly from your verified digital test counts and configured school baseline.',
      assessmentComparisonHeading: 'Multi-Assessment Progress & Growth Tracking',
      assessmentComparisonDesc:
        'Compare your consecutive diagnostic attempts on the same syllabus topics to measure actual learning gain or identify emerging gaps.',
      verifiedAttemptsBadge: 'Verified Consecutive Attempts',
      attemptSingular: 'attempt recorded',
      attemptPlural: 'attempts recorded',
      initialBaseline: 'Initial Baseline',
      takeReAssessment: 'Take Re-Assessment',
      previousAttempt: 'Previous Attempt',
      firstBenchmark: 'First recorded assessment benchmark',
      latestAttempt: 'Latest Attempt',
      gainedLabel: 'gained',
      shiftLabel: 'shift',
      maintainedLabel: 'maintained',
      improvementDelta: 'Score Improved',
      declineDelta: 'Score Declined',
      noChangeDelta: 'Score Unchanged',
      comparisonSubtopicShift: 'Subtopic Shift',
      fullReviewModalTitle: 'Full Diagnostic Test & Response Review',
      avgDiagnosticScore: 'Avg Diagnostic Score',
      gapsDetected: 'Knowledge Gaps Detected',
      subjectMeasuredSub: 'Calibrated skill performance measured from actual student tests:',
      standardsCalibrated: 'Standards-Calibrated (Levels 1 - 5)',
      scoreLabel: 'Score:',
      assessmentsWord: 'assessments',
      recordedTestsWord: 'recorded diagnostic tests',
      colDate: 'Date',
      colTopic: 'Topic',
      colSubject: 'Subject',
      colSkillLevel: 'Skill Level',
      colScore: 'Score',
      colAction: 'Action',
      viewGaps: 'View Gaps',
      badgesTitle: 'Study Milestones & Badges',
      milestone1Title: 'Diagnostic Pioneer',
      milestone1Desc: 'Completed first digital diagnostic self-assessment',
      milestone2Title: 'Paper Saver',
      milestone2Desc: 'Saved 6 or more physical test sheets',
      milestone3Title: 'High Competency',
      milestone3Desc: 'Achieved Proficient or Mastery skill level',
      milestone4Title: 'Study Streak',
      milestone4Desc: 'Maintained a consistent study streak',
      exportData: 'Export My Data',
      resetHistory: 'Reset History',
      resetConfirm: 'Are you sure you want to reset your local progress statistics?',
      tabQuestions: 'Question-by-Question Review',
      tabGaps: 'AI Gap Analysis',
      tabStudyPlan: '7-Day Remedial Plan',
      noArchivedQuestions: 'Question details were not archived for this legacy entry.',
      noGapReport: 'No AI gap report available for this attempt.',
      noStudyPlan: 'No 7-day study plan generated for this assessment.',
      practicePrefix: 'Practice:',
    },
    about: {
      title: 'About EduBridge AI',
      missionBadge: 'Educational Mission',
      missionHeading: 'Our Mission for Underserved & Rural Learners',
      missionBody:
        "EduBridge AI was created with a single urgent mission: to democratize world-class educational tutoring for students in rural villages, underfunded schools, and low-income households. Geography and wealth should never dictate a young mind's capacity to learn, explore, and excel.",
      accessibilityHeading: 'Designed for Real Low-Bandwidth Realities',
      offlineBody:
        'Students in remote areas frequently grapple with intermittent mobile data or high bandwidth costs. Saved notes and results work offline. AI features need an internet connection.',
      pedagogyHeading: 'Pedagogical Grounding with Real Analogies',
      pedagogyBody:
        'Science and mathematics can feel intimidating when presented in dense academic jargon. Our pedagogical prompts guide the AI to explain abstract principles using everyday life—farming cycles, bread baking, market exchange, water wells, and physical forces.',
      aiEthicsHeading: 'Pedagogical Accuracy & Academic Honesty',
      honestyBody:
        'Prompted for accurate, step-by-step explanations. Always verify important facts. When a topic is historically disputed, scientifically debated, or context-dependent, EduBridge AI aims to state limits clearly and encourage critical thinking.',
      multilingualHeading: 'True Multilingual Equality',
      multilingualBody:
        'Millions of brilliant students struggle simply because curriculum content is locked behind unfamiliar vocabularies. EduBridge AI translates both the interface and AI tutoring into any language you select, ensuring language is a bridge, never a barrier.',
      howToUseOfflineHeading: 'How to Learn in Low-Connectivity Environments',
      paperlessHeading: 'Code for Humanity: Eliminating Assessment-Related Waste',
      wasteBody:
        'Traditional paper practice assessments generate enormous, recurrent environmental and economic waste: disposable question booklets, answer sheets, ink cartridges, transport logistics, and dozens of hours of manual grading. EduBridge AI replaces this paper loop with instantaneous digital self-measurement.',
      wasteCard1Val: '3 Sheets',
      wasteCard1Desc: 'Estimated baseline per test',
      wasteCard2Val: '30 Liters',
      wasteCard2Desc: 'Estimated water footprint',
      wasteCard3Val: '13.5 g',
      wasteCard3Desc: 'Estimated CO2e avoided',
      wasteCard4Val: 'Instant',
      wasteCard4Desc: 'Automated AI feedback',
      studyFlowHeading: 'Recommended 3-Step Study Flow for Low-Bandwidth Students:',
      flowStep1Title: '1. Connect & Generate',
      flowStep1Desc: 'Whenever you find a signal (at school or a hotspot), generate notes for your upcoming chapter.',
      flowStep2Title: '2. Study Offline at Home',
      flowStep2Desc: 'Saved notes and results work offline. AI features need an internet connection.',
      flowStep3Title: '3. Test Understanding',
      flowStep3Desc: 'Take quizzes to identify knowledge gaps, review step-by-step explanations, and track your mastery.',
      privacyHeading: 'Privacy & Data Storage',
      privacyLine:
        'No accounts or tracking. Notes and scores are stored in your browser. Your questions are sent to the Gemini API.',
    },
  },
  ur: {
    appName: 'ایجو برج اے آئی (EduBridge AI)',
    tagline: 'ہر طالب علم کے لیے، ہر جگہ معیاری تعلیم اور خود تشخیصی نظام۔',
    missionShort:
      'دیہی اور پسماندہ علاقوں کے طلباء کے لیے مفت، معیاری، کثیر لسانی اور بغیر کاغذ کے خود تشخیصی تعلیمی نظام۔',
    common: {
      close: 'بند کریں',
      days: 'دن',
      day: 'دن',
      step: 'مرحلہ',
      mins: 'منٹ',
      sheets: 'صفحات',
      sheetsPerTest: 'صفحات فی ٹیسٹ',
      liters: 'لیٹر',
      grams: 'گرام',
      correct: 'درست',
      incorrect: 'غلط',
      noOptionSelected: 'کوئی جواب منتخب نہیں کیا گیا',
      exampleLabel: 'مثال:',
      newBadge: 'نیا',
      poweredByGemini: 'جیمینائی اے آئی کے تعاون سے',
      cancel: 'منسوخ کریں',
      loading: 'لوڈ ہو رہا ہے...',
      errorGeneric: 'کچھ خرابی پیش آ گئی۔ براہ کرم دوبارہ کوشش کریں۔',
      questionShort: 'سوال',
    },
    languageSelector: {
      buttonAriaLabel: 'ایپ کی زبان منتخب کریں',
      searchPlaceholder: 'کوئی بھی زبان تلاش کریں...',
      noResults: 'کوئی متعلقہ زبان نہیں ملی',
      otherLanguage: 'کوئی اور زبان...',
      customInputPlaceholder: 'کسی بھی زبان کا نام لکھیں (مثلاً فارسی، مراٹھی)',
      applyCustom: 'منتخب کریں',
      translatingBanner: 'آپ کی منتخب کردہ زبان میں انٹرفیس کا ترجمہ ہو رہا ہے...',
      offlineFallbackMessage: 'آپ اس وقت آف لائن ہیں اور یہ زبان محفوظ نہیں ہے۔ فی الحال انگریزی دکھائی جا رہی ہے۔',
      errorFallbackMessage: 'اس وقت ترجمہ مکمل نہیں ہو سکا۔ فی الحال انگریزی دکھائی جا رہی ہے۔',
      quotaFallbackMessage:
        'یومیہ اے آئی ترجمے کی حد پوری ہو گئی ہے۔ فی الحال انگریزی دکھائی جا رہی ہے—بلٹ ان زبانیں (انگریزی، اردو، عربی، ہندی، ہسپانوی، فرانسیسی) بغیر کوٹہ کے کام کرتی ہیں۔',
      dismiss: 'بند کریں',
      recentCustom: 'ذاتی',
    },
    skillLevels: {
      foundational: 'بنیادی سطح / رہنمائی درکار (درجہ ۱)',
      developing: 'ابھرتی ہوئی تفہیم (درجہ ۲)',
      competent: 'معیاری فہم (درجہ ۳)',
      proficient: 'قابلِ قدر مہارت (درجہ ۴)',
      mastery: 'ماہرانہ مہارت (درجہ ۵)',
    },
    subjects: {
      allSubjects: 'تمام مضامین',
      generalScience: 'جنرل سائنس',
      biology: 'حیاتیات (بائیولوجی)',
      physics: 'طبیعیات (فزکس)',
      chemistry: 'کیمیا (کیمسٹری)',
      mathematics: 'ریاضی (میتھ)',
      historyGeography: 'تاریخ اور جغرافیہ',
      englishGrammar: 'انگریزی گرامر',
      urduGrammar: 'اردو قواعد',
      earthScience: 'زمینی سائنس',
      english: 'انگریزی',
      urduLiterature: 'اردو ادب',
    },
    nav: {
      home: 'مرکزی صفحہ',
      dashboard: 'ڈیش بورڈ',
      assessment: 'خود تشخیصی امتحان',
      tutor: 'اے آئی اتالیق (ٹیوٹر)',
      notes: 'سمارٹ نوٹس',
      quiz: 'کوئز جنریٹر',
      saved: 'محفوظ مواد',
      progress: 'مہارت اور پیش رفت',
      about: 'ہمارے متعلق',
      language: 'زبان',
      offline: 'آف لائن موڈ فعال ہے',
      online: 'انٹرنیٹ سے منسلک',
      brandSubtitle: 'ہر طالب علم کے لیے معیاری تعلیم',
      openAccess: 'مفت رسائی',
      toggleMenu: 'مینو کھولیں یا بند کریں',
    },
    offlineBanner: {
      message: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      viewOfflineBank: 'آف لائن اسباق دیکھیں',
    },
    footer: {
      toolsHeading: 'تعلیمی اوزار',
      accessibilityHeading: 'رسائی اور زبان',
      lowBandwidthNote: 'کمزور انٹرنیٹ اور سستے اسمارٹ فونز کے لیے خاص طور پر بہتر بنایا گیا ہے۔',
      copyright: 'تعلیم سب کے لیے کھلی اور مفت ہے۔',
      craftedFor: 'دیہی اور پسماندہ طلباء کے لیے خلوص سے تیار کردہ',
      privacyLine: 'کوئی اکاؤنٹ یا ٹریکنگ نہیں۔ نوٹس اور اسکور آپ کے براؤزر میں محفوظ رہتے ہیں۔ آپ کے سوالات جیمینائی اے پی آئی کو بھیجے جاتے ہیں۔',
    },
    landing: {
      heroTitle: 'ہر طالب علم کے لیے معیاری تعلیم اور بغیر کاغذ کے خود تشخیصی نظام',
      heroSubtitle:
        'ایجو برج اے آئی دیہی اور کم وسائل والے طلباء کے لیے تعلیمی فاصلے ختم کرتا ہے۔ تشخیصی ٹیسٹ کے ذریعے تعلیمی کمزوریاں معلوم کریں، کاغذ کے ضیاع کو روکیں اور اپنی منتخب زبان میں ذاتی اسٹڈی پلان حاصل کریں۔',
      startLearning: 'ڈیش بورڈ پر جائیں',
      startAssessment: 'خود تشخیصی امتحان دیں',
      exploreDemo: 'اے آئی ٹیوٹر آزمائیں',
      missionBadge: 'کوڈ فار ہیومینٹی: خود پیمائش اور وسائل کے ضیاع کا خاتمہ',
      dedicatedTitle: 'دیہی اور پسماندہ طبقات کے لیے وقف',
      forWhom:
        'خاص طور پر ان طلباء اور اسکولوں کے لیے جن کے پاس پرنٹنگ اور درسی وسائل کم ہیں، تاکہ کاغذ کے بغیر معیاری ٹیسٹنگ ممکن ہو سکے۔',
      readMission: 'ہمارا منشور پڑھیں',
      toolsHeading: 'طاقتور اور آسان تعلیمی اوزار',
      toolsSubtitle:
        'ہر اوزار کو سستے اسمارٹ فونز، کم رفتار انٹرنیٹ اور خود تدریسی ضرورتوں کو مدنظر رکھ کر بنایا گیا ہے۔',
      featureAssessmentTitle: 'تشخیصی خود پیمائش اور کمی کی نشاندہی',
      featureAssessmentDesc:
        'مختلف ذیلی عنوانات پر اپنی گرفت جانچیں۔ جیمینائی اے آئی آپ کی کمزوریوں کی نشاندہی کر کے ذاتی مطالعہ کا منصوبہ تجویز کرتا ہے۔',
      assessmentPillar1: 'ذیلی موضوعات میں پیمائش',
      assessmentPillar2: 'اے آئی کمزوریوں کی نشاندہی',
      assessmentPillar3: 'کاغذی پرچوں کی بچت',
      featureTutorTitle: '24/7 ذاتی اے آئی ٹیوٹر',
      featureTutorDesc:
        'اپنی منتخب زبان میں مرحلہ وار رہنمائی۔ روزمرہ زندگی اور دیہی مثالوں کے ساتھ سائنسی و ریاضیاتی تصورات کی سادہ وضاحت۔',
      tutorBullet1: 'آپ کی منتخب کردہ ہر زبان میں معاونت',
      tutorBullet2: 'مرحلہ وار سائنسی اور ریاضیاتی تفہیم',
      tutorBullet3: 'درست اور مرحلہ وار وضاحت کے لیے ترتیب دیا گیا۔ اہم حقائق کی ہمیشہ تصدیق کریں۔',
      tutorCta: 'ٹیوٹر سے سوال پوچھیں',
      featureNotesTitle: 'سمارٹ دہرائی نوٹس',
      featureNotesDesc:
        'درسی کتاب کے پیراگراف درج کریں اور چند سیکنڈ میں اہم نکات، خلاصہ، اور مشکل الفاظ کے معانی حاصل کریں۔',
      notesBullet1: 'خلاصہ، اہم نکات اور بنیادی فارمولے',
      notesBullet2: 'درسی کتاب سے متن چسپاں کرنے کی سہولت',
      notesBullet3: 'آف لائن دہرائی کے لیے محفوظ کرنے کا آپشن',
      notesCta: 'نوٹس جنریٹر کھولیں',
      featureQuizTitle: 'خودکار کوئز مع حل',
      featureQuizDesc:
        'اپنی جماعت کی سطح کے مطابق معروضی سوالات حل کریں۔ ہر درست اور غلط جواب کی مکمل اور آسان تفہیم حاصل کریں۔',
      quizBullet1: 'ابتدائی، درمیانی اور اعلیٰ درجے کے امتحانات',
      quizBullet2: 'فوری جانچ اور تفصیلی جواباتی وضاحت',
      quizBullet3: 'تعلیمی پیش رفت کی خودکار ٹریکنگ',
      quizCta: 'کوئز جنریٹر شروع کریں',
      featureOfflineTitle: 'کم انٹرنیٹ کے لیے تیار',
      featureOfflineDesc: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      offlineBullet1: 'براؤزر اسٹوریج میں نوٹس کی محفوظیت',
      offlineBullet2: 'پہلے سے لوڈ شدہ بنیادی سائنسی و ریاضیاتی گائیڈز',
      offlineBullet3: 'شفاف آف لائن / آن لائن کیفیتی اشاریہ',
      offlineCta: 'محفوظ مواد کا معائنہ',
      paperlessBadge: '100% ڈیجیٹل اور کاغذ کے ضیاع سے پاک',
      paperlessDesc:
        'کاغذی پرچوں، امتحانی کتابچوں اور اساتذہ کے گھنٹوں پر محیط دستی چیکنگ کے ضیاع کو ختم کرتا ہے۔',
      quickStatsStudents: '100% مفت اور کھلی رسائی',
      quickStatsLanguages: 'دنیا کی کسی بھی زبان میں معاونت',
      quickStatsFree: 'مقامی آف لائن اسٹوریج',
      trustTitle: 'تعلیمی دیانت داری اور رازداری کا عہد',
      trustBody:
        'کوئی اکاؤنٹ یا ٹریکنگ نہیں۔ نوٹس اور اسکور آپ کے براؤزر میں محفوظ رہتے ہیں۔ آپ کے سوالات جیمینائی اے پی آئی کو بھیجے جاتے ہیں۔ درست اور مرحلہ وار وضاحت کے لیے ترتیب دیا گیا؛ اہم حقائق کی ہمیشہ تصدیق کریں۔',
    },
    dashboard: {
      commandCenterBadge: 'آپ کا ذاتی تعلیمی ڈیش بورڈ',
      welcome: 'خوش آمدید، عزیز طالب علم!',
      welcomeSubtitle:
        'یہ آپ کا تعلیمی مرکز ہے۔ آپ کا تمام مطالعہ جاتی مواد اور امتحانی پیمائش اس ڈیوائس پر مقامی طور پر محفوظ ہے۔',
      todayFocus: 'آج آپ کس موضوع کی پیمائش یا مطالعہ کرنا پسند کریں گے؟',
      studyStreak: 'مطالعہ کا تسلسل',
      quizzesCompleted: 'مشقی کوئز',
      assessmentsCompleted: 'تشخیصی امتحانات',
      avgScore: 'اوسط اسکور',
      savedMaterials: 'محفوظ شدہ مواد',
      questionsExplored: 'ٹیوٹر سے سوالات',
      quickActions: 'فوری تعلیمی اقدامات',
      recentActivity: 'حالیہ مطالعہ کی سرگرمیاں',
      offlineNotice: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      noRecentActivity: 'ابھی تک کوئی سرگرمی ریکارڈ نہیں ہوئی۔ خود تشخیصی امتحان دے کر اپنی صلاحیت جانچیں!',
      paperlessBannerTitle: 'کاغذ اور ماحولیاتی ضیاع کی روک تھام',
      paperlessImpactTitle: 'کاغذی امتحانات کے ضیاع کا تدارک اور فوری خود تشخیصی فہم',
      paperlessBannerDesc:
        'ایجو برج اے آئی پر ڈیجیٹل ٹیسٹ دے کر آپ نے کاغذی پرچوں، پانی کے ضیاع اور اساتذہ کے دستی جانچ کے وقت کی بچت کی ہے۔',
      sheetsSavedShort: 'صفحات کاغذ',
      waterSavedShort: 'پانی محفوظ',
      co2AvertedShort: 'کاربن روکا',
      gradingSavedShort: 'چیکنگ وقت',
      actionAssessmentTitle: 'خود تشخیصی امتحان',
      actionAssessmentDesc: 'اپنی مہارت ماپیں، علمی کمزوریاں جانیں اور کاغذ بچائیں۔',
      actionAssessmentCta: 'امتحان شروع کریں',
      actionTutorTitle: 'ذاتی ٹیوٹر سے پوچھیں',
      actionTutorDesc: 'اپنی منتخب زبان میں قدم بہ قدم آسان رہنمائی حاصل کریں۔',
      actionTutorCta: 'بات چیت شروع کریں',
      actionNotesTitle: 'سمارٹ نوٹس بنائیں',
      actionNotesDesc: 'کتاب کے پیراگراف کو خلاصے اور اہم نکات میں بدلیں۔',
      actionNotesCta: 'نوٹس جنریٹر کھولیں',
      actionQuizTitle: 'کوئز کے ذریعے جانچیں',
      actionQuizDesc: 'معروضی سوالات حل کریں اور تفصیلی حل دیکھیں۔',
      actionQuizCta: 'کوئز شروع کریں',
      skillStatusTitle: 'مختلف مضامین میں آپ کی موجودہ مہارت',
      skillSubcaption: 'مستند خود تشخیصی امتحانات پر مبنی علمی مہارت کی درجہ بندی:',
      viewDetailedSkills: 'مکمل مہارت رپورٹ',
      demoBioLabel: 'حیاتیات / سائنس',
      demoBioDesc: 'پودوں کی ساخت اور فوٹوسنتھیسز میں عمدہ فہم، درجہ حرارت انزائم کے عمل میں مزید مشق درکار ہے۔',
      demoMathLabel: 'ریاضی (میتھ)',
      demoMathDesc: 'کسر کے بنیادی تصورات واضح، متغیرات والے الجبرا میں رہنمائی درکار۔',
      demoPhysLabel: 'طبیعیات (فزکس)',
      demoPhysDesc: 'نیوٹن کے پہلے دو قوانین سمجھے ہوئے ہیں، عمل و ردعمل کے ویکٹر تجزیہ میں معاونت درکار۔',
      jumpStartTitle: 'نصاب کے منتخب اہم موضوعات',
      jumpStartSubtitle: 'کسی بھی موضوع پر کلک کر کے فوری خود تشخیصی امتحان شروع کریں:',
      paperlessTag: 'بغیر کاغذ کے خود پیمائش',
      jumpTopic1: 'پودوں میں خوراک بننے کا عمل (فوٹوسنتھیسز)',
      jumpTopic2: 'کسر اور تناسب (Fractions)',
      jumpTopic3: 'نیوٹن کے حرکتی قوانین',
      jumpTopic4: 'پانی کا قدرتی چکر (واٹر سائیکل)',
      jumpTopic5: 'خلیاتی ساخت اور آرگنیلز',
      jumpTopic6: 'انگریزی گرامر (Active & Passive Voice)',
      recentNotesTitle: 'حالیہ محفوظ شدہ نوٹس',
      viewAll: 'سب دیکھیں',
      generateNewNotesBtn: '+ نئے نوٹس تیار کریں',
      recentAssessmentsTitle: 'حالیہ تشخیصی امتحانات',
      fullProgressLink: 'مکمل رپورٹ',
      takeAssessmentBtn: 'نیا تشخیصی امتحان شروع کریں',
    },
    reminders: {
      title: 'روزمرہ مطالعہ کے یاددہانی نوٹیفیکیشنز',
      subtitle: 'مسلسل پڑھنے کی عادت اپنائیں۔ اپنے منتخب وقت پر براؤزر میں بروقت یاددہانی حاصل کریں۔',
      enableToggle: 'روزانہ یاددہانی فعال کریں',
      statusActive: 'فعال',
      statusOff: 'غیر فعال',
      reminderTimeLabel: 'مطالعہ کا منتخب وقت',
      focusSubjectLabel: 'ہدف مضمون',
      permissionGranted: 'براؤزر نوٹیفیکیشنز فعال ہیں',
      permissionDenied: 'نوٹیفیکیشنز بلاک ہیں (براؤزر کے تالے کے نشان پر کلک کر کے فعال کریں)',
      permissionDefault: 'براؤزر سے اجازت درکار ہے',
      requestPermissionBtn: 'براؤزر نوٹیفیکیشن کی اجازت دیں',
      testNotificationBtn: 'آزمائشی نوٹیفیکیشن بھیجیں',
      testSentMessage: 'آزمائشی نوٹیفیکیشن بھیج دیا گیا! اپنی اسکرین یا نوٹیفیکیشن بار چیک کریں۔',
      browserUnsupported: 'یہ براؤزر نوٹیفیکیشن سپورٹ نہیں کرتا؛ ان ایپ نوٹیفیکیشن استعمال ہوگی۔',
      soundAlertLabel: 'ہلکی آواز کی گھنٹی',
      streakNotice: 'روزانہ یاددہانی استعمال کرنے والے طلباء ۷ دن کے مطالعہ کا تسلسل برقرار رکھنے میں ۳ گنا زیادہ کامیاب رہتے ہیں!',
      sampleNotificationBody: 'ایجو برج اے آئی پر آج کے مطالعہ کا وقت ہو گیا ہے! اپنا تعلیمی تسلسل برقرار رکھیں۔',
      notificationTitle: 'ایجو برج اے آئی: مطالعہ کا وقت!',
      notificationBodyPrefix: 'آج کے تعلیمی سیشن کا وقت ہو گیا ہے۔ اپنا مطالعہ کا تسلسل برقرار رکھیں!',
      testTitle: 'ایجو برج اے آئی: روزانہ یاددہانی',
      testBodyPrefix: 'آزمائشی یاددہانی: آپ کا روزانہ مطالعہ کا ہدف فعال ہے۔',
    },
    assessment: {
      title: 'تشخیصی خود امتحانی نظام (Self-Assessment)',
      subtitle: 'اپنی حقیقی علمی صلاحیت کی پیمائش کریں، اے آئی کے ذریعے کمزور نکات جانیں اور کاغذی پرچوں کا ضیاع روکیں۔',
      zeroPaperWaste: 'کاغذی ضیاع کی روک تھام',
      wasteCalloutTitle: 'خود تشخیصی پیمائش اور کاغذی ضیاع کا خاتمہ',
      wasteCalloutDesc:
        'دیہی اسکولوں میں ہر امتحانی مشق کے لیے درجنوں صفحات پرنٹ کیے جاتے ہیں جن کی تصحیح میں گھنٹوں ضائع ہوتے ہیں۔ ایجو برج اے آئی پر ہر ڈیجیٹل ٹیسٹ کاغذ اور اساتذہ کے دستی کام کی فوری بچت کرتا ہے۔',
      suggestionsHeading: 'منتخب تشخیصی موضوعات:',
      suggestedTopic1: 'پودوں میں خوراک اور فوٹوسنتھیسز',
      suggestedTopic2: 'خلیاتی ساخت اور آرگنیلز',
      suggestedTopic3: 'نیوٹن کے حرکتی قوانین اور قوت',
      suggestedTopic4: 'کسر، تناسب اور ریاضیاتی فارمولے',
      suggestedTopic5: 'پانی کا چکر اور موسمیاتی نظام',
      createTitle: 'نیا تشخیصی ٹیسٹ تیار کریں',
      topicLabel: 'نصاب کا موضوع جس کی پیمائش کرنی ہے',
      topicPlaceholder: 'مثلاً: پودوں میں خوراک کا عمل، کسر اور اعشاریہ، نیوٹن کے قوانین...',
      subjectLabel: 'مضمون کا زمرہ',
      questionDepthLabel: 'تشخیصی سوالات کی تعداد',
      questionsWord: 'سوالات',
      generateButton: 'تشخیصی امتحان تیار کریں',
      generating: 'معیاری تشخیصی ٹیسٹ تیار ہو رہا ہے...',
      analyzingGaps: 'جیمینائی اے آئی آپ کے جوابات کا تجزیہ کر کے علمی کمزوریوں کی نشاندہی کر رہا ہے...',
      analyzingSubtext: 'جیمینائی اے آئی آپ کے ہر جواب کا تجزیہ کر کے مخصوص سائنسی خلاء اور اصلاحی پلان ترتیب دے رہا ہے...',
      activeTitle: 'امتحان جاری ہے',
      diagnosticCheckBadge: 'تشخیصی جانچ',
      questionNumber: 'سوال نمبر',
      skillTestedLabel: 'زیرِ پیمائش صلاحیت',
      subtopicLabel: 'ذیلی موضوع',
      submitAssessment: 'امتحان جمع کروائیں اور کمزوریاں جانیں',
      nextQuestion: 'اگلا سوال',
      prevQuestion: 'پچھلا سوال',
      resultTitle: 'تشخیصی پیمائش اور مہارت کی رپورٹ',
      measuredSkillLevel: 'پیمائش شدہ مہارت کی سطح',
      scoreSummary: 'مجموعی امتحانی اسکور',
      subtopicPerformance: 'ذیلی موضوعات میں کارکردگی',
      paperlessTestTitle: 'اس ڈیجیٹل امتحان کے ذریعے بچائے گئے وسائل:',
      schoolBaselineLabel: 'اسکول بیس لائن:',
      paperSheetsSaved: 'کاغذ کی بچت',
      waterFootprintSaved: 'پانی کا تحفظ',
      co2Averted: 'کاربن کا اخراج رکا',
      gradingLaborSaved: 'دستی چیکنگ کی بچت',
      gapAnalysisTitle: 'اے آئی کے ذریعے علمی کمزوریوں کی نشاندہی',
      strengthsHeading: 'آپ کے مضبوط پہلو اور مکمل سمجھے گئے تصورات',
      weaknessesHeading: 'وہ حصے جن پر مزید توجہ درکار ہے',
      knowledgeGapsHeading: 'نشاندہی شدہ مخصوص علمی خلاء',
      recommendedActionsHeading: 'اصلاح کے لیے تجویز کردہ تعلیمی اقدامات',
      studyPlanHeading: 'ذاتی مطالعہ کا مرحلہ وار لائحہ عمل',
      retakeButton: 'یہ امتحان دوبارہ حل کریں',
      createNewButton: 'نیا موضوع منتخب کریں',
      paperlessAlert: 'ڈیجیٹل خود پیمائش: کاغذی پرچوں اور دستی چیکنگ کے ضیاع سے مکمل پاک۔',
      detailedQuestionReview: 'ہر سوال کا تفصیلی تشخیصی جائزہ اور تجزیہ',
      reviewSubtitle: 'ہر سوال، آپ کا دیا گیا جواب، درست متبادل اور تفصیلی سائنسی تشریح:',
      correctCountLabel: 'درست جوابات',
      questionIndexLabel: 'سوال نمبر',
      weakSubtopicsTitle: 'اصلاح طلب کمزور ذیلی عنوانات',
      weakSubtopicsDesc: 'آپ کے درج ذیل ذیلی موضوعات کے جوابات غلط رہے جن کے لیے خصوصی دہرائی اور توجہ کی ضرورت ہے:',
      sevenDayPlanTitle: '۷ روزہ ذاتی تدریسی اصلاحی منصوبہ',
      sevenDayPlanSubtitle: 'آپ کے ناپے گئے علمی معیار اور غلط جوابات کی بنیاد پر تیار کردہ روزمرہ مطالعہ کا لائحہ عمل۔',
      studentSelectedAnswer: 'آپ کا منتخب کردہ جواب',
      correctAnswerLabel: 'درست جواب',
      explanationLabel: 'تدریسی وضاحت اور مغالطوں کا خاتمہ',
      statusCorrect: 'درست جواب دیا',
      statusIncorrect: 'توجہ درکار ہے',
      diagnosticOverviewPrefix: 'تشخیصی خلاصہ:',
      startRemedyNow: 'ابھی آغاز کریں',
      calibratedFor: 'مہارت کی سطح:',
      dayLabelPrefix: 'دن',
      coreConceptFocus: 'تصور کی تفہیم:',
      dailyPracticeActivity: 'آج کی مشقی سرگرمی:',
      launchActivity: 'یہ سرگرمی ابھی شروع کریں',
      viewNextDay: 'اگلا دن دیکھیں',
      errorEmptyTopic: 'براہ کرم تشخیصی امتحان کا موضوع درج کریں!',
      errorOffline: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      errorGenerateFailed: 'تشخیصی امتحان تیار کرنے میں خرابی پیش آئی۔',
    },
    tutor: {
      title: 'ذاتی اے آئی اتالیق (ٹیوٹر)',
      subtitle: 'کوئی بھی تعلیمی سوال پوچھیں۔ آپ کا ٹیوٹر روزمرہ کی سادہ مثالوں اور مرحلہ وار طریقے سے وضاحت کرے گا۔',
      placeholder: 'اپنا تعلیمی سوال یہاں لکھیں (مثلاً: فوٹوسنتھیسز کیا ہے اور پودے خوراک کیسے بناتے ہیں؟)...',
      send: 'سوال پوچھیں',
      clearChat: 'گفتگو صاف کریں',
      languageNote: 'تدریس کی زبان منتخب کریں:',
      sampleQuestionsTitle: 'آزمائشی سوالات:',
      stepByStepBadge: 'مرحلہ وار وضاحت',
      copyAnswer: 'نقل کریں (کاپی)',
      copied: 'کاپی ہو گیا!',
      saveToNotes: 'نوٹس میں محفوظ کریں',
      savedSuccess: 'مواد میں محفوظ ہو گیا!',
      uncertaintyNotice:
        'درست اور مرحلہ وار وضاحت کے لیے ترتیب دیا گیا۔ اہم حقائق کی ہمیشہ تصدیق کریں۔ کوئی اکاؤنٹ یا ٹریکنگ نہیں؛ نوٹس اور اسکور آپ کے براؤزر میں محفوظ رہتے ہیں اور آپ کے سوالات جیمینائی اے پی آئی کو بھیجے جاتے ہیں۔',
      welcomeMessage:
        'خوش آمدید! میں ایجو برج اے آئی ٹیوٹر ہوں۔ آپ مجھ سے ریاضی، سائنس، انگریزی، تاریخ یا کسی بھی درسی مضمون کا سوال پوچھ سکتے ہیں۔ میں روزمرہ کی سادہ مثالوں کے ساتھ مرحلہ وار وضاحت کروں گا۔',
      welcomeResetMessage: 'گفتگو نیا رخ اختیار کر چکی ہے۔ آپ کون سا نیا تعلیمی موضوع سمجھنا چاہتے ہیں؟',
      prefillTemplate: 'براہ کرم اس موضوع کی سادہ مثال کے ساتھ مرحلہ وار وضاحت کریں:',
      offlineError: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      offlineInputNotice: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      requestFailed: 'سرور سے رابطہ کرنے میں دشواری ہوئی۔',
      preparingExplanation: 'ٹیوٹر آسان الفاظ میں تفصیلی وضاحت تیار کر رہا ہے...',
      defaultLessonTitle: 'ٹیوٹر رہنمائی نوٹ',
      defaultSubject: 'عمومی تعلیم',
      transcriptBullet1: 'ذاتی ٹیوٹر کی مرحلہ وار تدریسی گفتگو',
      transcriptBullet2: 'روزمرہ کی مثالوں سے سائنسی فہم',
      lessonHeading: 'مکمل تدریسی سبق',
      reviewQuestionDefault: 'اس تصور کا اہم ترین نکتہ کیا ہے؟',
      sampleQ1: 'فوٹوسنتھیسز کیا ہے اور پودے خوراک کیسے بناتے ہیں؟',
      sampleQ2: 'نیوٹن کا تیسرا حرکتی قانون روزمرہ مثالوں سے سمجھائیں۔',
      sampleQ3: 'کسر (Fractions) روٹی یا کھانوں کی مثال سے سمجھائیں۔',
      sampleQ4: 'بارش کیسے بنتی ہے اور پانی کا چکر کیا ہے؟',
      sampleQ5: 'خلیہ (Cell) کیا ہے اور یہ کیسے کام کرتا ہے؟',
      voiceStart: 'بول کر سوال پوچھیں',
      voiceStop: 'ریکارڈنگ روکیں',
      voiceListening: 'سنا جا رہا ہے... اپنا سوال واضح طور پر بولیں',
      voiceTranscribing: 'آپ کی آواز کو تحریر میں بدلا جا رہا ہے...',
      voiceAutoSend: 'خودکار ارسال',
      voicePermissionDenied: 'مائیکروفون کی اجازت نہیں ملی۔ براہ کرم براؤزر کی ترتیبات سے مائیکروفون کی اجازت دیں۔',
      voiceUnsupported: 'اس براؤزر میں وائس ان پٹ دستیاب نہیں ہے۔ براہ کرم اپنا سوال ٹائپ کریں۔',
      voiceNoSpeech: 'کوئی آواز سنائی نہیں دی۔ براہ کرم مائیک دبا کر دوبارہ بولیں۔',
      voiceFailed: 'آواز کو تحریر میں نہیں بدلا جا سکا۔ دوبارہ کوشش کریں یا سوال ٹائپ کریں۔',
    },
    notes: {
      title: 'سمارٹ نوٹس جنریٹر',
      subtitle: 'درسی کتاب کے کسی بھی موضوع یا مواد کو جامع، منظم اور آسان امتحانی نوٹس میں تبدیل کریں۔',
      topicLabel: 'موضوع یا سبق کا عنوان',
      topicPlaceholder: 'مثلاً: پانی کا چکر (Water Cycle)، خلیے کی تقسیم، کسر (Fractions)، تاریخ...',
      subjectLabel: 'مضمون کا زمرہ',
      textLabel: 'مطالعہ کا مواد (اختیاری: کتاب کا پیراگراف درج کریں)',
      textPlaceholder: 'درسی کتاب سے پیراگراف یہاں چسپاں کریں، یا صرف عنوان لکھ کر نوٹس حاصل کریں...',
      generateButton: 'منظم نوٹس تیار کریں',
      generating: 'تعلیمی نوٹس تیار کیے جا رہے ہیں...',
      summaryHeading: 'سبق کا جامع خلاصہ',
      keyPointsHeading: 'اہم تعلیمی نکات',
      detailedConcepts: 'تفصیلی وضاحت اور روزمرہ مثالیں',
      keyDefinitions: 'اہم اصطلاحات اور فارمولے',
      practiceQuestions: 'خود تشخیصی سوالات',
      copyNotes: 'تمام تحریر کاپی کریں',
      saveNotes: 'آف لائن محفوظ کریں',
      downloadText: 'فائل ڈاؤن لوڈ کریں',
      sampleTopics: 'نصاب کے منتخب اہم موضوعات:',
      autoSaveNote: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      savedLocalBadge: 'آف لائن محفوظ شدہ',
      realWorldExample: 'روزمرہ مثال:',
      errorEmptyTopic: 'براہ کرم کوئی عنوان درج کریں!',
      errorOffline: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      errorGenerateFailed: 'نوٹس بنانے میں خرابی پیش آئی۔',
      sampleTopic1: 'پانی کا قدرتی چکر (واٹر سائیکل)',
      sampleTopic2: 'فوٹوسنتھیسز اور پودوں میں سانس کا عمل',
      sampleTopic3: 'کسر اور ریاضیاتی فارمولے',
      sampleTopic4: 'نیوٹن کے حرکتی قوانین',
      sampleTopic5: 'مادے کی تین بنیادی حالتیں',
      sampleTopic6: 'انگریزی میں اجزائے کلام (Parts of Speech)',
    },
    quiz: {
      title: 'اے آئی کوئز جنریٹر',
      subtitle: 'فوری معروضی سوالات کے ذریعے اپنی فہم جانچیں اور ہر سوال کی تفصیلی وضاحت سے سیکھیں۔',
      suggestionsHeading: 'آزمائشی امتحانی موضوعات:',
      topicLabel: 'کوئز کا مضمون اور موضوع',
      topicPlaceholder: 'مثلاً: نیوٹن کے حرکتی قوانین، انسانی نظام انہضام، الجبرا، جیومیٹری...',
      subjectLabel: 'مضمون',
      difficultyLabel: 'مشکل کی سطح',
      numQuestionsLabel: 'سوالات کی تعداد',
      generateButton: 'انٹرایکٹو کوئز تیار کریں',
      generating: 'کوئز کے سوالات تیار ہو رہے ہیں...',
      questionProgress: 'سوال نمبر',
      submitQuiz: 'کوئز جمع کروائیں اور اسکور دیکھیں',
      nextQuestion: 'اگلا سوال',
      previousQuestion: 'پچھلا سوال',
      scoreTitle: 'کوئز کارکردگی کا نتیجہ',
      scoreSubtitle: 'اپنا حاصل کردہ اسکور دیکھیں اور نیچے ہر سوال کی تفصیلی وضاحت پڑھ کر سیکھیں۔',
      retakeQuiz: 'دوبارہ کوئز حل کریں',
      saveResult: 'نتیجہ محفوظ کریں',
      explanationsTitle: 'حل اور تفصیلی سائنسی وضاحت',
      yourAnswer: 'آپ کا جواب',
      correctAnswer: 'درست جواب',
      hintLabel: 'اشارہ',
      hintPrefix: 'معاون اشارہ:',
      masteryHigh: 'شاندار کارکردگی! آپ نے اس موضوع کے بنیادی تصورات کو بخوبی سمجھ لیا ہے۔',
      masteryMedium: 'اچھی کوشش! نیچے دیے گئے غلط جوابات کی وضاحت پڑھ کر دہرائی کریں۔',
      masteryLow: 'مسلسل مشق کامیابی کی کنجی ہے۔ نیچے دیے گئے حل کا مطالعہ کریں اور دوبارہ کوشش کریں۔',
      createAnother: 'نیا کوئز شروع کریں',
      stepByStepSolution: 'مرحلہ وار سائنسی وضاحت',
      whyCorrect: 'تفصیلی تدریسی وضاحت:',
      errorEmptyTopic: 'براہ کرم کوئز کا موضوع درج کریں!',
      errorOffline: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      errorGenerateFailed: 'کوئز تیار کرنے میں خرابی پیش آئی۔',
      suggestedTopic1: 'پودوں میں خوراک اور فوٹوسنتھیسز',
      suggestedTopic2: 'نیوٹن کے حرکتی قوانین',
      suggestedTopic3: 'کسر اور فیصد کے بنیادی سوالات',
      suggestedTopic4: 'نظامِ شمسی اور سیارے',
      suggestedTopic5: 'پانی کا چکر اور بادل',
      difficultyLevels: {
        beginner: 'ابتدائی (بنیادی اسکول)',
        intermediate: 'درمیانی (معیاری نصاب)',
        advanced: 'اعلیٰ (مشکل و گہرا فہم)',
      },
    },
    saved: {
      title: 'میرا محفوظ کردہ مواد',
      subtitle: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      savedLocallyBadge: 'ڈیوائس پر مقامی طور پر محفوظ',
      offlinePackBadge: 'بنیادی آف لائن گائیڈ',
      readFullGuide: 'مکمل سبق پڑھیں',
      readNotes: 'نوٹس پڑھیں',
      questionsCountSuffix: 'سوالات کا کوئز',
      takeQuiz: 'کوئز حل کریں',
      filterAll: 'تمام مواد',
      filterNotes: 'دہرائی کے نوٹس',
      filterQuizzes: 'محفوظ امتحانات و کوئز',
      filterOfflineGuides: 'بنیادی آف لائن گائیڈز',
      searchPlaceholder: 'محفوظ نوٹس یا موضوع تلاش کریں...',
      emptyMessage: 'کوئی محفوظ شدہ مواد نہیں ملا۔ نوٹس بنا کر یا ٹیوٹر کے جوابات محفوظ کر کے یہاں جمع کریں!',
      emptyHint: 'کوئی نتائج نہیں ملے۔ سرچ تبدیل کریں یا ٹیوٹر سے نیا مواد محفوظ کریں۔',
      deleteConfirm: 'کیا آپ واقعی اس مواد کو اپنی ڈیوائس سے حذف کرنا چاہتے ہیں؟',
      offlineGuaranteed: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      summaryLabel: 'خلاصہ',
      coreTakeaways: 'اہم ترین نکات',
      detailedExplanation: 'تفصیلی تدریسی سبق',
      closeModal: 'بند کریں',
    },
    progress: {
      title: 'تعلیمی پیش رفت اور مہارت کی پیمائش',
      subtitle: 'اپنی پیمائش شدہ مہارت کی سطح، علمی کمزوریوں کا حل اور کاغذ کی بچت کا ماحولیاتی ریکارڈ دیکھیں۔',
      localActualDataBadge: 'مقامی براؤزر اسٹوریج (کوئی فرضی ڈیٹا نہیں)',
      analyticsHeading: 'مہارت اور تعلیمی تجزیہ',
      quizHistoryHeading: 'مشقی کوئز کی تاریخ',
      assessmentHistoryHeading: 'تشخیصی خود امتحانات کی تاریخ',
      subjectBreakdown: 'مضامین کے لحاظ سے مستند کارکردگی',
      emptyHistory: 'ابھی تک کوئی امتحان نہیں دیا گیا۔ اپنی صلاحیت ناپنے کے لیے پہلا ٹیسٹ شروع کریں!',
      localNote:
        'کوئی اکاؤنٹ یا ٹریکنگ نہیں۔ نوٹس اور اسکور آپ کے براؤزر میں محفوظ رہتے ہیں۔ آپ کے سوالات جیمینائی اے پی آئی کو بھیجے جاتے ہیں۔',
      skillMeasurementHeading: 'مہارت میں بہتری کا تسلسل',
      paperlessImpactHeading: 'کاغذ کے ضیاع کی روک تھام کا ریکارڈ',
      paperlessIntro:
        'ہر ڈیجیٹل تشخیصی ٹیسٹ اور کوئز روایتی پرنٹ شدہ پرچوں کا متبادل ہے۔ اس سے نہ صرف کاغذ، پانی اور سیاہی کی بچت ہوتی ہے بلکہ اساتذہ کا وقت بھی بچتا ہے۔',
      digitalTestsTaken: 'ڈیجیٹل ٹیسٹ مکمل',
      sheetsSavedLabel: 'کاغذ کے صفحات کی بچت',
      waterSavedLabel: 'پانی کی بچت (لیٹر)',
      carbonSavedLabel: 'کاربن کا اخراج رکا (گرام)',
      gradingHoursLabel: 'دستی چیکنگ کے وقت کی بچت (منٹ)',
      baselinePerTestSuffix: 'صفحات فی روایتی امتحان',
      waterAssumptionShort: '۱۰ لیٹر فی کاغذی صفحہ',
      carbonAssumptionShort: '۴.۵ گرام کاربن فی صفحہ',
      laborAssumptionShort: '۳.۵ منٹ فی ٹیسٹ دستی چیکنگ',
      schoolBaselineHeading: 'اسکول کے روایتی امتحانی کاغذات کا بنیادی تخمینہ (Baseline)',
      schoolBaselineDesc:
        'اپنے اسکول یا کلاس روم میں فی امتحانی پرچہ استعمال ہونے والے کاغذی صفحات کی تعداد مقرر کریں (سوالیہ پرچہ + جوابی شیٹ + مارکنگ شیٹ)۔',
      baselineSheetsLabel: 'روایتی پرنٹ شدہ ٹیسٹ کے صفحات کی تعداد',
      baselineSheetsHelp: 'معیاری اسکولوں میں اوسط ۳ صفحات (۲ سوالیہ پرچہ + ۱ جوابی شیٹ) استعمال ہوتے ہیں۔ ۱ سے ۱۰ تک ایڈجسٹ کریں۔',
      sheetsLabel: 'صفحات',
      quickPresetsLabel: 'فوری پری سیٹس:',
      preset2: 'مختصر کوئز (۲ صفحات)',
      preset3: 'معیاری امتحان (۳ صفحات - ڈیفالٹ)',
      preset5: 'جامع سمیسٹر ٹیسٹ (۵ صفحات)',
      documentedAssumptionsTitle: 'ماحولیاتی بچت کے مستند مفروضات و حوالہ جات',
      waterCardTitle: 'پانی کی کھپت',
      carbonCardTitle: 'کاربن کا اخراج',
      laborCardTitle: 'اساتذہ کی جانچ',
      assumptionWater: 'پانی: ~۱۰ لیٹر پانی کی بچت فی A4 کاغذی صفحہ (انٹرنیشنل پیپر نیٹ ورک کے مطابق معیاری کاغذ کی تیاری میں استعمال)۔',
      assumptionCarbon: 'کاربن: ~۴.۵ گرام کاربن کا اخراج رکا فی صفحہ (کاغذ سازی اور نقل و حمل کا تخمینہ)۔',
      assumptionLabor: 'تدریسی وقت: ~۳.۵ منٹ فی طالب علم استاد کے دستی پرچہ چیک کرنے کے وقت کی بچت۔',
      assumptionCitation:
        'یہ تمام ماحولیاتی اعداد و شمار آپ کے حل شدہ ڈیجیٹل ٹیسٹوں اور منتخب کردہ کاغذی بیس لائن کی بنیاد پر لگائے گئے مستند تخمینے ہیں۔',
      assessmentComparisonHeading: 'متعدد امتحانات کی باہمی پیش رفت اور موازنہ',
      assessmentComparisonDesc:
        'ایک ہی نصابی موضوع پر دیے گئے پے در پے ٹیسٹوں کے نتائج کا موازنہ کریں تاکہ حقیقی علمی بہتری یا نئے خلاء کی نشاندہی ہو سکے۔',
      verifiedAttemptsBadge: 'حقیقی ریکارڈ شدہ تقابل',
      attemptSingular: 'امتحان مکمل',
      attemptPlural: 'امتحانات مکمل',
      initialBaseline: 'بنیادی پیمائش ریکارڈ شدہ',
      takeReAssessment: 'دوبارہ ٹیسٹ دیں',
      previousAttempt: 'سابقہ امتحان',
      firstBenchmark: 'پہلا امتحانی ریکارڈ',
      latestAttempt: 'تازہ ترین امتحان',
      gainedLabel: 'بہتری',
      shiftLabel: 'تبدیلی',
      maintainedLabel: 'برقرار',
      improvementDelta: 'اسکور میں بہتری آئی',
      declineDelta: 'اسکور میں کمی واقع ہوئی',
      noChangeDelta: 'اسکور برقرار رہا',
      comparisonSubtopicShift: 'ذیلی موضوعات میں تبدیلی',
      fullReviewModalTitle: 'مکمل تشخیصی امتحان اور سوالات کا تفصیلی جائزہ',
      avgDiagnosticScore: 'اوسط تشخیصی اسکور',
      gapsDetected: 'نشاندہی شدہ کمزوریاں',
      subjectMeasuredSub: 'حقیقی تشخیصی امتحانات پر مبنی علمی صلاحیت:',
      standardsCalibrated: 'معیاری پیمائش (درجہ ۱ تا ۵)',
      scoreLabel: 'اسکور:',
      assessmentsWord: 'امتحانات',
      recordedTestsWord: 'ریکارڈ شدہ امتحانات',
      colDate: 'تاریخ',
      colTopic: 'موضوع',
      colSubject: 'مضمون',
      colSkillLevel: 'مہارت کی سطح',
      colScore: 'اسکور',
      colAction: 'تفصیل',
      viewGaps: 'کمزوریاں دیکھیں',
      badgesTitle: 'تعلیمی سنگ میل اور اعزازات',
      milestone1Title: 'پہلی خود پیمائش',
      milestone1Desc: 'پہلا تشخیصی امتحان مکمل کیا',
      milestone2Title: 'کاغذ کا محافظ',
      milestone2Desc: 'ڈیجیٹل ٹیسٹنگ سے کاغذ بچایا',
      milestone3Title: 'اعلیٰ صلاحیت',
      milestone3Desc: 'امتحان میں ۷۵٪ یا زائد اسکور',
      milestone4Title: 'مستقل مزاج',
      milestone4Desc: 'مطالعہ کا تسلسل برقرار رکھا',
      exportData: 'ڈیٹا ڈاؤن لوڈ کریں',
      resetHistory: 'ریکارڈ ری سیٹ',
      resetConfirm: 'کیا آپ واقعی اپنا تمام تعلیمی ریکارڈ اور ہسٹری ری سیٹ کرنا چاہتے ہیں؟',
      tabQuestions: 'سوالات کا تفصیلی جائزہ',
      tabGaps: 'اے آئی تشخیصی رپورٹ',
      tabStudyPlan: '۷ روزہ اسٹڈی پلان',
      noArchivedQuestions: 'اس امتحان کے سوالات محفوظ نہیں تھے۔',
      noGapReport: 'اس امتحان کے لیے اے آئی رپورٹ دستیاب نہیں ہے۔',
      noStudyPlan: 'کوئی ۷ روزہ اسٹڈی پلان محفوظ نہیں ہے۔',
      practicePrefix: 'مشق:',
    },
    about: {
      title: 'ایجو برج اے آئی کے متعلق',
      missionBadge: 'تعلیمی مشن اور منشور',
      missionHeading: 'پسماندہ اور دیہی طلباء کے لیے ہمارا مشن',
      missionBody:
        'ایجو برج اے آئی کا مقصد دیہی، دور دراز اور پسماندہ علاقوں کے طلباء کو بااختیار بنانا ہے جنہیں معیاری درسی کتب، ذاتی اتالیق یا اچھے اسکولوں تک رسائی حاصل نہیں ہوتی۔ ہم جدید ترین مصنوعی ذہانت کو انتہائی آسان اور قابلِ فہم انداز میں ہر طالب علم کی دہلیز تک لاتے ہیں۔',
      accessibilityHeading: 'کمزور اور سست انٹرنیٹ کی حقیقت کے مطابق ڈیزائن',
      offlineBody:
        'دیہی علاقوں میں انٹرنیٹ کے سگنل اکثر کمزور یا غیر مستقل ہوتے ہیں۔ محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      pedagogyHeading: 'روزمرہ اور دیہی مثالوں سے تدریس',
      pedagogyBody:
        'سائنس اور ریاضی کے تصورات مشکل محسوس ہو سکتے ہیں اگر انہیں صرف خشک فارمولوں سے پڑھایا جائے۔ ہمارا ٹیوٹر دیہی زراعت، روٹی بنانے، پانی کے بہاؤ، شمسی حرارت اور روزمرہ مشاہدات سے مثالیں دے کر بات سمجھاتا ہے۔',
      aiEthicsHeading: 'تدریسی درستگی اور علمی دیانت داری',
      honestyBody:
        'درست اور مرحلہ وار وضاحت کے لیے ترتیب دیا گیا۔ اہم حقائق کی ہمیشہ تصدیق کریں۔ اگر کسی علمی سوال میں کوئی ابہام ہو تو ایجو برج اے آئی اس کا واضح اظہار کرتا ہے۔',
      multilingualHeading: 'ہر زبان میں یکساں تعلیمی رسائی',
      multilingualBody:
        'لاکھوں باصلاحیت طلباء صرف اس لیے پیچھے رہ جاتے ہیں کیونکہ درسی مواد ان کی اپنی زبان میں نہیں ہوتا۔ ایجو برج اے آئی آپ کی منتخب کردہ کسی بھی زبان میں تعلیم فراہم کرتا ہے۔',
      howToUseOfflineHeading: 'انٹرنیٹ کے بغیر مطالعہ کا طریقہ کار',
      paperlessHeading: 'کوڈ فار ہیومینٹی: امتحانی ضیاع کا تدارک',
      wasteBody:
        'روایتی تعلیمی نظام میں جانچ کے لیے لاکھوں ٹن کاغذ پرنٹ کیا جاتا ہے جو ایک بار استعمال ہو کر کچرے کا ڈھیر بن جاتا ہے۔ ایجو برج اے آئی پر ڈیجیٹل خود تشخیصی نظام سے کاغذ کے ضیاع کو روکنے اور فوری ذاتی رپورٹ حاصل کرنے میں مدد ملتی ہے۔',
      wasteCard1Val: '۳ صفحات',
      wasteCard1Desc: 'فی امتحان تخمینی بیس لائن',
      wasteCard2Val: '۳۰ لیٹر',
      wasteCard2Desc: 'تخمینی پانی کی بچت',
      wasteCard3Val: '۱۳.۵ گرام',
      wasteCard3Desc: 'تخمینی کاربن بچت',
      wasteCard4Val: 'فوری',
      wasteCard4Desc: 'خودکار اے آئی رہنمائی',
      studyFlowHeading: 'کم رفتار انٹرنیٹ پر پڑھنے کا طریقہ:',
      flowStep1Title: '۱. آن لائن ہوں تو نوٹس بنائیں',
      flowStep1Desc: 'جب آپ کے پاس انٹرنیٹ سگنل ہوں تو اپنے درسی اسباق کے نوٹس اور کوئز تیار کر لیں۔',
      flowStep2Title: '۲. آف لائن دہرائی کریں',
      flowStep2Desc: 'محفوظ شدہ نوٹس اور نتائج آف لائن کام کرتے ہیں۔ اے آئی خصوصیات کے لیے انٹرنیٹ کنکشن ضروری ہے۔',
      flowStep3Title: '۳. خود کو کوئز سے جانچیں',
      flowStep3Desc: 'کوئز حل کر کے اپنا اسکور اور سائنسی وضاحتیں دیکھ کر فہم کو مضبوط کریں۔',
      privacyHeading: 'رازداری اور ڈیٹا اسٹوریج',
      privacyLine:
        'کوئی اکاؤنٹ یا ٹریکنگ نہیں۔ نوٹس اور اسکور آپ کے براؤزر میں محفوظ رہتے ہیں۔ آپ کے سوالات جیمینائی اے پی آئی کو بھیجے جاتے ہیں۔',
    },
  },
};

// Compatibility export in case anything references translations.en / translations.ur directly
export const translations = builtInTranslations;

export function mergeWithEnglishFallback(candidate: any, fallback: any = builtInTranslations.en): TranslationDictionary {
  if (!candidate || typeof candidate !== 'object') {
    return fallback;
  }
  const result: Record<string, any> = {};
  for (const key of Object.keys(fallback)) {
    const fbVal = fallback[key];
    const candVal = candidate[key];
    if (fbVal && typeof fbVal === 'object' && !Array.isArray(fbVal)) {
      result[key] = mergeWithEnglishFallback(candVal, fbVal);
    } else if (typeof candVal === 'string' && candVal.trim().length > 0) {
      result[key] = candVal;
    } else {
      result[key] = fbVal;
    }
  }
  return result as TranslationDictionary;
}
