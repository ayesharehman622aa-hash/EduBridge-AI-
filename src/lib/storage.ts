import { 
  NoteItem, 
  Quiz, 
  QuizAttempt, 
  StudentStats, 
  Language, 
  DiagnosticAssessment, 
  AssessmentResult, 
  SkillLevel,
  PaperlessImpact,
  StudyReminderSetting 
} from '../types';
import { detectBrowserLanguage, getTranslationCacheKey } from './languages';

const STORAGE_KEYS = {
  LANGUAGE: 'edubridge_language',
  CUSTOM_LANGUAGES: 'edubridge_custom_languages',
  UI_CACHE_PREFIX: 'edubridge_ui_translations_v1_',
  NOTES: 'edubridge_saved_notes',
  QUIZZES: 'edubridge_saved_quizzes',
  QUIZ_ATTEMPTS: 'edubridge_quiz_attempts',
  ASSESSMENTS: 'edubridge_assessments',
  ASSESSMENT_RESULTS: 'edubridge_assessment_results',
  STATS: 'edubridge_student_stats',
  TUTOR_HISTORY: 'edubridge_tutor_history',
  REMINDER: 'edubridge_study_reminder',
  BASELINE_SHEETS: 'edubridge_school_baseline_sheets',
};

export const calculateSkillLevel = (percentage: number): { level: SkillLevel; labelEn: string; labelUr: string } => {
  if (percentage >= 90) {
    return { level: 'mastery', labelEn: 'Mastery (Level 5)', labelUr: 'ماہرانہ مہارت (درجہ ۵)' };
  } else if (percentage >= 75) {
    return { level: 'proficient', labelEn: 'Proficient (Level 4)', labelUr: 'قابلِ قدر مہارت (درجہ ۴)' };
  } else if (percentage >= 60) {
    return { level: 'competent', labelEn: 'Competent (Level 3)', labelUr: 'معیاری فہم (درجہ ۳)' };
  } else if (percentage >= 40) {
    return { level: 'developing', labelEn: 'Developing (Level 2)', labelUr: 'ابھرتی ہوئی تفہیم (درجہ ۲)' };
  } else {
    return { level: 'foundational', labelEn: 'Foundational (Level 1)', labelUr: 'بنیادی سطح / رہنمائی درکار (درجہ ۱)' };
  }
};

export const computePaperlessImpact = (
  quizzesCount: number, 
  assessmentsCount: number, 
  customBaselineSheets?: number
): PaperlessImpact => {
  const baseline = typeof customBaselineSheets === 'number' && customBaselineSheets >= 1
    ? Math.min(10, Math.max(1, Math.round(customBaselineSheets)))
    : storage.getBaselineSheets();

  const totalDigitalTests = quizzesCount + assessmentsCount;
  // School practice quiz saves ~2 sheets; full diagnostic assessment saves the configured school baseline sheets
  const paperSheetsSaved = (quizzesCount * Math.max(1, baseline - 1)) + (assessmentsCount * baseline);
  
  return {
    paperSheetsSaved,
    waterSavedLiters: paperSheetsSaved * 10, // ~10 liters of industrial water per A4 sheet (Environmental Paper Network)
    carbonSavedGrams: Math.round(paperSheetsSaved * 4.5), // ~4.5g CO2e per A4 sheet lifecycle average (EPN Paper Calculator)
    gradingMinutesSaved: Math.round(totalDigitalTests * 3.5), // ~3.5 minutes teacher grading labor saved per digital test
    digitalTestsCompleted: totalDigitalTests,
    baselineSheetsPerTest: baseline,
    assumptions: {
      waterPerSheetLiters: 10,
      carbonPerSheetGrams: 4.5,
      gradingMinsPerTest: 3.5,
      citation: 'Estimated conversions based on Environmental Paper Network (EPN) lifecycle data for standard 80gsm uncoated office paper, and average rural classroom grading benchmarks.',
    },
  };
};

// Initial sample diagnostic assessment (curriculum aligned)
const INITIAL_SAMPLE_ASSESSMENTS: DiagnosticAssessment[] = [
  {
    id: 'sample-assessment-photosynthesis',
    title: 'Diagnostic: Plant Physiology & Photosynthesis Mechanics',
    subject: 'Biology',
    topic: 'Photosynthesis & Leaf Anatomy',
    language: 'en',
    createdAt: Date.now() - 86400000 * 2,
    questions: [
      {
        id: 'q-diag-1',
        question: 'Which specific pigment inside the chloroplast is directly responsible for trapping photon energy from sunlight?',
        subtopic: 'Chloroplast Structure',
        skillTested: 'Factual Recall',
        options: ['Mitochondria', 'Chlorophyll', 'Ribosome', 'Vacuole'],
        correctAnswerIndex: 1,
        explanation: 'Chlorophyll molecules inside the thylakoid membranes absorb light wavelengths (primarily blue and red) to drive the light reactions.',
      },
      {
        id: 'q-diag-2',
        question: 'Through which microscopic leaf structures does carbon dioxide (CO2) enter the leaf tissue from the surrounding air?',
        subtopic: 'Gaseous Exchange & Stomata',
        skillTested: 'Conceptual Understanding',
        options: ['Root hairs', 'Xylem tubes', 'Stomata pores', 'Bark cuticle'],
        correctAnswerIndex: 2,
        explanation: 'Stomata are tiny specialized openings on leaves regulated by guard cells that control gas exchange and transpiration.',
      },
      {
        id: 'q-diag-3',
        question: 'If a plant is kept in total darkness for 72 hours, which product of photosynthesis will immediately cease to be synthesized?',
        subtopic: 'Light Reactions',
        skillTested: 'Real-world Application',
        options: ['Glucose and Oxygen', 'Soil minerals', 'Cellulose cell walls', 'Nitrogen gas'],
        correctAnswerIndex: 0,
        explanation: 'Without photon energy from light, the light-dependent reactions cannot produce ATP and NADPH required to fix carbon dioxide into glucose, and water cannot be split to release oxygen.',
      },
      {
        id: 'q-diag-4',
        question: 'What happens to the rate of photosynthesis if the ambient temperature exceeds 45°C (113°F)?',
        subtopic: 'Enzymatic Activity',
        skillTested: 'Critical Reasoning',
        options: [
          'It continues increasing infinitely',
          'It drops drastically because essential photosynthetic enzymes become denatured',
          'It turns all water into hydrogen fuel',
          'The plant replaces chlorophyll with melanin',
        ],
        correctAnswerIndex: 1,
        explanation: 'Enzymes such as RuBisCO are proteins that lose their three-dimensional catalytic structure (denature) at extreme temperatures, halting photosynthesis.',
      },
    ],
  },
];

// Initial sample assessment result for immediate demonstration of skill measurement
const INITIAL_SAMPLE_ASSESSMENT_RESULTS: AssessmentResult[] = [
  {
    id: 'result-sample-1',
    assessmentId: 'sample-assessment-photosynthesis',
    title: 'Diagnostic: Plant Physiology & Photosynthesis Mechanics',
    topic: 'Photosynthesis & Leaf Anatomy',
    subject: 'Biology',
    language: 'en',
    timestamp: Date.now() - 86400000 * 1.5,
    score: 3,
    totalQuestions: 4,
    percentage: 75,
    skillLevel: 'proficient',
    skillLevelLabel: 'Proficient (Level 4)',
    questions: INITIAL_SAMPLE_ASSESSMENTS[0].questions,
    weakSubtopics: ['Enzymatic Activity'],
    answers: [
      { questionIndex: 0, selectedOptionIndex: 1, isCorrect: true, subtopic: 'Chloroplast Structure', skillTested: 'Factual Recall' },
      { questionIndex: 1, selectedOptionIndex: 2, isCorrect: true, subtopic: 'Gaseous Exchange & Stomata', skillTested: 'Conceptual Understanding' },
      { questionIndex: 2, selectedOptionIndex: 0, isCorrect: true, subtopic: 'Light Reactions', skillTested: 'Real-world Application' },
      { questionIndex: 3, selectedOptionIndex: 0, isCorrect: false, subtopic: 'Enzymatic Activity', skillTested: 'Critical Reasoning' },
    ],
    subtopicBreakdown: [
      { subtopic: 'Chloroplast Structure', correct: 1, total: 1, percentage: 100 },
      { subtopic: 'Gaseous Exchange & Stomata', correct: 1, total: 1, percentage: 100 },
      { subtopic: 'Light Reactions', correct: 1, total: 1, percentage: 100 },
      { subtopic: 'Enzymatic Activity', correct: 0, total: 1, percentage: 0 },
    ],
    aiGapAnalysis: {
      summary: 'Strong foundational grasp of chloroplast anatomy and gas exchange, but critical reasoning regarding enzymatic denaturation at high temperatures requires remediation.',
      strengths: [
        'Recognizes chlorophyll as the primary photon-absorbing pigment.',
        'Accurately identifies stomata pores as the portal for atmospheric CO2 intake.',
        'Understands dependence of glucose and oxygen production on ambient light.',
      ],
      weaknesses: [
        'Misunderstands how extreme heat alters protein enzyme active sites in biological systems.',
      ],
      knowledgeGaps: [
        'Enzyme temperature denaturation limits (RuBisCO functioning above 40°C).',
      ],
      recommendedRemedies: [
        {
          actionType: 'tutor',
          title: 'Ask AI Tutor about Enzyme Denaturation',
          description: 'Explore why enzymes break down in high heat using an egg-white cooking analogy.',
          prefillTopic: 'Why do photosynthetic enzymes denature at high temperatures?',
          prefillSubject: 'Biology',
        },
        {
          actionType: 'notes',
          title: 'Generate Revision Notes on Photosynthetic Factors',
          description: 'Synthesize quick bullet points on Light, CO2, and Temperature curves.',
          prefillTopic: 'Limiting Factors of Photosynthesis: Temperature, Light, and Carbon Dioxide',
          prefillSubject: 'Biology',
        },
        {
          actionType: 'quiz',
          title: 'Retest Enzymatic Mechanics',
          description: 'Practice 3 targeted questions on biological catalysts and temperature thresholds.',
          prefillTopic: 'Enzymes and Temperature in Photosynthesis',
          prefillSubject: 'Biology',
        },
      ],
      studyPlan: [
        { stepNumber: 1, estimatedMinutes: 10, goal: 'Master the lock-and-key enzyme model', method: 'Review analogy with AI Tutor' },
        { stepNumber: 2, estimatedMinutes: 8, goal: 'Graph temperature vs reaction rate curve', method: 'Generate and review Smart Notes' },
        { stepNumber: 3, estimatedMinutes: 5, goal: 'Verify retention', method: 'Complete 3-question follow-up test' },
      ],
      sevenDayPlan: [
        {
          day: 1,
          dayLabel: 'Day 1: Root Cause Diagnosis',
          topic: 'Enzymes as Biological Catalysts',
          shortExplanation: 'Enzymes are protein catalysts with specific 3D active sites. Extreme heat (above 40°C) shakes their chemical bonds until they lose their shape (denature).',
          practiceActivity: 'Discuss with AI Tutor: "Explain how boiling an egg relates to enzyme denaturation."',
          estimatedMinutes: 15,
          actionType: 'tutor',
        },
        {
          day: 2,
          dayLabel: 'Day 2: Concept Mapping',
          topic: 'RuBisCO & The Dark Reactions',
          shortExplanation: 'RuBisCO fixes atmospheric CO2 into sugars. When midday temperatures rise excessively, stomata close and enzymes denature, slowing photosynthesis.',
          practiceActivity: 'Generate Smart Notes on "RuBisCO and Limiting Factors in Photosynthesis".',
          estimatedMinutes: 12,
          actionType: 'notes',
        },
        {
          day: 3,
          dayLabel: 'Day 3: Targeted Practice',
          topic: 'Temperature vs Photosynthetic Rate Curves',
          shortExplanation: 'Reaction rate rises with kinetic temperature until the optimum (around 25-35°C), then plummets vertically toward zero as active sites denature.',
          practiceActivity: 'Take a 3-question practice quiz on "Enzymes and Temperature".',
          estimatedMinutes: 10,
          actionType: 'quiz',
        },
        {
          day: 4,
          dayLabel: 'Day 4: Stomata & Water Conservation',
          topic: 'Guard Cells and Transpiration Trade-offs',
          shortExplanation: 'On hot dry days, plants close stomata to conserve water, which starves the chloroplasts of CO2 even if sunlight is plentiful.',
          practiceActivity: 'Ask AI Tutor: "Why do desert plants keep stomata closed during midday?"',
          estimatedMinutes: 12,
          actionType: 'tutor',
        },
        {
          day: 5,
          dayLabel: 'Day 5: Synthesis & Flashcard Review',
          topic: 'The 3 Limiting Factors: Light, CO2, and Temperature',
          shortExplanation: 'Blackman’s Law states that the rate of a physiological process is limited by the factor in shortest supply.',
          practiceActivity: 'Review the Smart Notes definitions and test yourself on the 3 limiting factors.',
          estimatedMinutes: 15,
          actionType: 'notes',
        },
        {
          day: 6,
          dayLabel: 'Day 6: Critical Application Challenge',
          topic: 'Agricultural Greenhouse Climate Control',
          shortExplanation: 'Greenhouses use fans and misting to keep temperatures below 35°C while pumping CO2, maximizing enzyme productivity.',
          practiceActivity: 'Take a 4-question Intermediate Quiz on "Photosynthesis in Agriculture".',
          estimatedMinutes: 12,
          actionType: 'quiz',
        },
        {
          day: 7,
          dayLabel: 'Day 7: Full Mastery Re-Assessment',
          topic: 'Diagnostic Re-Measurement',
          shortExplanation: 'Retake the Plant Physiology diagnostic test to verify that your Enzymatic Activity score improves to 100%.',
          practiceActivity: 'Retake the Photosynthesis Diagnostic Self-Assessment to verify skill improvement.',
          estimatedMinutes: 15,
          actionType: 'guide',
        },
      ],
    },
  },
];

const INITIAL_SAMPLE_NOTES: NoteItem[] = [
  {
    id: 'sample-note-1',
    title: 'Cell Biology & Plant vs Animal Cells',
    subject: 'Biology',
    language: 'en',
    createdAt: Date.now() - 86400000 * 2,
    summary: 'Essential comparison of plant and animal cell organelles, cell walls, and chloroplast functions.',
    keyPoints: [
      'The cell is the basic structural and functional unit of all living organisms.',
      'Plant cells have rigid cell walls made of cellulose; animal cells only have flexible cell membranes.',
      'Chloroplasts conduct photosynthesis and are unique to plant cells.',
      'Mitochondria are the powerhouses of both plant and animal cells, generating ATP energy.',
      'Vacuoles in plant cells are large and central, providing turgor pressure for standing tall.'
    ],
    detailedSections: [
      {
        heading: '1. Cell Membrane vs Cell Wall',
        content: 'While both plant and animal cells have an outer cell membrane, plant cells possess an extra outer jacket called the cell wall. This allows trees and plants to remain rigid and tall even without an internal bone skeleton.',
        examples: ['Cellulose in celery creates the crunch when bitten.']
      },
      {
        heading: '2. The Role of the Nucleus',
        content: 'The nucleus acts as the command center or brain of the cell, protecting genetic DNA instructions and commanding cellular reproduction and protein creation.'
      }
    ],
    definitions: [
      { term: 'Chloroplast', definition: 'Organelle containing green chlorophyll where photosynthesis produces sugars.' },
      { term: 'Mitochondria', definition: 'Cellular powerhouse producing ATP energy through cellular respiration.' }
    ],
    quickReviewQuestions: [
      'Why do plants need a cell wall while animals do not?',
      'Which organelle converts food into usable ATP energy?'
    ],
    tags: ['Biology', 'Cells', 'School Science', 'Sample']
  },
  {
    id: 'sample-note-urdu',
    title: 'پودوں کے خلیے اور حیوانی خلیے میں فرق',
    subject: 'سائنس / حیاتیات',
    language: 'ur',
    createdAt: Date.now() - 86400000,
    summary: 'نباتاتی (پودوں کے) اور حیوانی خلیوں کے مابین بنیادی فرق اور خلیاتی دیوار کی اہمیت۔',
    keyPoints: [
      'خلیہ تمام جانداروں کی ساخت اور کام کی بنیادی اکائی ہے۔',
      'پودوں کے خلیوں میں سیلولوز سے بنی مضبوط دیوار (Cell Wall) ہوتی ہے۔',
      'کلوروفل صرف پودوں میں پایا جاتا ہے جو خوراک بنانے میں مدد دیتا ہے۔',
      'مائٹوکونڈریا خلیے کا پاور ہاؤس کہلاتا ہے جو توانائی پیدا کرتا ہے۔'
    ],
    detailedSections: [
      {
        heading: '۱. خلیاتی دیوار اور جھلی',
        content: 'پودوں کے پاس ہڈیاں نہیں ہوتیں، اس لیے ان کے خلیوں کی بیرونی سخت دیوار انہیں سیدھا کھڑا رہنے میں مدد دیتی ہے۔',
        examples: ['درختوں کے تنوں کی مضبوطی سیلولوز کی بدولت ہے۔']
      }
    ],
    definitions: [
      { term: 'خلیہ (Cell)', definition: 'زندگی کی بنیادی ساختی و فعلیاتی اکائی۔' },
      { term: 'مائٹوکونڈریا', definition: 'خلیے کا بجلی گھر جو توانائی بناتا ہے۔' }
    ],
    quickReviewQuestions: [
      'پودوں کے خلیے میں سیل وال کا کیا کردار ہے؟',
      'خلیے کا کون سا حصہ اس کے تمام کاموں کو کنٹرول کرتا ہے؟'
    ],
    tags: ['حیاتیات', 'خلیہ', 'سائنس', 'نمونہ']
  }
];

const INITIAL_QUIZ_ATTEMPTS: QuizAttempt[] = [
  {
    id: 'sample-attempt-1',
    quizId: 'sample-quiz-photosynthesis',
    topic: 'Photosynthesis & Plant Biology',
    subject: 'Biology',
    difficulty: 'beginner',
    language: 'en',
    timestamp: Date.now() - 86400000 * 3,
    score: 4,
    totalQuestions: 5,
    percentage: 80,
    answers: [
      { questionIndex: 0, selectedOptionIndex: 1, isCorrect: true },
      { questionIndex: 1, selectedOptionIndex: 0, isCorrect: true },
      { questionIndex: 2, selectedOptionIndex: 2, isCorrect: true },
      { questionIndex: 3, selectedOptionIndex: 1, isCorrect: false },
      { questionIndex: 4, selectedOptionIndex: 3, isCorrect: true },
    ]
  }
];

export const storage = {
  getLanguage(): Language {
    try {
      const lang = localStorage.getItem(STORAGE_KEYS.LANGUAGE);
      if (lang && lang.trim().length > 0) {
        return lang.trim();
      }
      return detectBrowserLanguage();
    } catch {
      return 'en';
    }
  },

  setLanguage(lang: Language) {
    try {
      localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (e) {
      console.warn('Failed to save language in localStorage', e);
    }
  },

  getCustomLanguages(): string[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_LANGUAGES);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },

  addCustomLanguage(langId: string) {
    try {
      const existing = this.getCustomLanguages();
      if (!existing.includes(langId)) {
        localStorage.setItem(STORAGE_KEYS.CUSTOM_LANGUAGES, JSON.stringify([langId, ...existing].slice(0, 10)));
      }
    } catch (e) {
      console.warn('Failed to save custom language list', e);
    }
  },

  getCachedTranslations<T>(lang: Language): T | null {
    try {
      const key = STORAGE_KEYS.UI_CACHE_PREFIX + getTranslationCacheKey(lang);
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  setCachedTranslations<T>(lang: Language, data: T): void {
    try {
      const key = STORAGE_KEYS.UI_CACHE_PREFIX + getTranslationCacheKey(lang);
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to cache UI translations', e);
    }
  },

  getSavedNotes(): NoteItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(INITIAL_SAMPLE_NOTES));
        return INITIAL_SAMPLE_NOTES;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SAMPLE_NOTES;
    }
  },

  saveNote(note: NoteItem): boolean {
    try {
      const existing = this.getSavedNotes();
      const filtered = existing.filter(n => n.id !== note.id);
      const updated = [note, ...filtered];
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
      this.incrementStat('notesGenerated');
      return true;
    } catch (e) {
      console.error('Failed to save note', e);
      return false;
    }
  },

  deleteNote(id: string): boolean {
    try {
      const existing = this.getSavedNotes();
      const updated = existing.filter(n => n.id !== id);
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('Failed to delete note', e);
      return false;
    }
  },

  getSavedQuizzes(): Quiz[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveQuiz(quiz: Quiz): boolean {
    try {
      const existing = this.getSavedQuizzes();
      const filtered = existing.filter(q => q.id !== quiz.id);
      const updated = [quiz, ...filtered];
      localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('Failed to save quiz', e);
      return false;
    }
  },

  getQuizAttempts(): QuizAttempt[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(INITIAL_QUIZ_ATTEMPTS));
        return INITIAL_QUIZ_ATTEMPTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_QUIZ_ATTEMPTS;
    }
  },

  saveQuizAttempt(attempt: QuizAttempt): boolean {
    try {
      const existing = this.getQuizAttempts();
      const updated = [attempt, ...existing];
      localStorage.setItem(STORAGE_KEYS.QUIZ_ATTEMPTS, JSON.stringify(updated));
      this.recordQuizResult(attempt);
      return true;
    } catch (e) {
      console.error('Failed to save quiz attempt', e);
      return false;
    }
  },

  getAssessments(): DiagnosticAssessment[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(INITIAL_SAMPLE_ASSESSMENTS));
        return INITIAL_SAMPLE_ASSESSMENTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SAMPLE_ASSESSMENTS;
    }
  },

  saveAssessment(assessment: DiagnosticAssessment): boolean {
    try {
      const existing = this.getAssessments();
      const filtered = existing.filter(a => a.id !== assessment.id);
      const updated = [assessment, ...filtered];
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('Failed to save assessment', e);
      return false;
    }
  },

  getAssessmentResults(): AssessmentResult[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ASSESSMENT_RESULTS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.ASSESSMENT_RESULTS, JSON.stringify(INITIAL_SAMPLE_ASSESSMENT_RESULTS));
        return INITIAL_SAMPLE_ASSESSMENT_RESULTS;
      }
      return JSON.parse(data);
    } catch {
      return INITIAL_SAMPLE_ASSESSMENT_RESULTS;
    }
  },

  saveAssessmentResult(result: AssessmentResult): boolean {
    try {
      // Calculate weak subtopics from incorrect responses if not already set
      if (!result.weakSubtopics) {
        const incorrectSubs = result.answers
          .filter(a => !a.isCorrect && a.subtopic)
          .map(a => a.subtopic);
        result.weakSubtopics = Array.from(new Set(incorrectSubs));
      }

      const existing = this.getAssessmentResults();
      const filtered = existing.filter(r => r.id !== result.id);
      const updated = [result, ...filtered];
      localStorage.setItem(STORAGE_KEYS.ASSESSMENT_RESULTS, JSON.stringify(updated));
      this.recordAssessmentResult(result);
      return true;
    } catch (e) {
      console.error('Failed to save assessment result', e);
      return false;
    }
  },

  getStudentStats(): StudentStats {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      const quizAttempts = this.getQuizAttempts();
      const assessmentResults = this.getAssessmentResults();
      const baseline = this.getBaselineSheets();

      const totalQuizzes = quizAttempts.length;
      const avgQuizScore = totalQuizzes > 0
        ? Math.round(quizAttempts.reduce((acc, a) => acc + a.percentage, 0) / totalQuizzes)
        : 0;

      const totalAssessments = assessmentResults.length;
      const avgAssessmentScore = totalAssessments > 0
        ? Math.round(assessmentResults.reduce((acc, a) => acc + a.percentage, 0) / totalAssessments)
        : 0;

      const paperless = computePaperlessImpact(totalQuizzes, totalAssessments, baseline);

      // Count identified gaps
      let gapsCount = 0;
      assessmentResults.forEach(r => {
        if (r.aiGapAnalysis?.knowledgeGaps) {
          gapsCount += r.aiGapAnalysis.knowledgeGaps.length;
        }
      });

      if (!data) {
        const defaultStats: StudentStats = {
          totalQuizzesTaken: totalQuizzes,
          averageScore: avgQuizScore,
          notesGenerated: 2,
          tutorQuestionsAsked: 0,
          studyStreakDays: 3,
          lastActiveDate: new Date().toISOString().slice(0, 10),
          assessmentsCompleted: totalAssessments,
          averageAssessmentScore: avgAssessmentScore,
          identifiedGapsCount: gapsCount,
          paperlessMetrics: paperless,
          subjectMastery: {
            Biology: { 
              quizzesTaken: 1, 
              averageScore: 80, 
              assessmentsTaken: 1, 
              latestSkillLevel: 'proficient' 
            }
          }
        };
        localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(defaultStats));
        return defaultStats;
      }

      const parsed: StudentStats = JSON.parse(data);
      parsed.totalQuizzesTaken = totalQuizzes;
      parsed.averageScore = avgQuizScore;
      parsed.assessmentsCompleted = totalAssessments;
      parsed.averageAssessmentScore = avgAssessmentScore;
      parsed.identifiedGapsCount = gapsCount;
      parsed.paperlessMetrics = paperless;
      return parsed;
    } catch {
      return {
        totalQuizzesTaken: 0,
        averageScore: 0,
        notesGenerated: 0,
        tutorQuestionsAsked: 0,
        studyStreakDays: 1,
        lastActiveDate: new Date().toISOString().slice(0, 10),
        assessmentsCompleted: 0,
        averageAssessmentScore: 0,
        identifiedGapsCount: 0,
        paperlessMetrics: computePaperlessImpact(0, 0),
        subjectMastery: {}
      };
    }
  },

  recordQuizResult(attempt: QuizAttempt) {
    try {
      const stats = this.getStudentStats();
      const subject = attempt.subject || 'General';
      const existingSubj = stats.subjectMastery[subject] || { quizzesTaken: 0, averageScore: 0 };
      const newSubjTotal = existingSubj.quizzesTaken + 1;
      const newSubjAvg = Math.round(((existingSubj.averageScore * existingSubj.quizzesTaken) + attempt.percentage) / newSubjTotal);

      const today = new Date().toISOString().slice(0, 10);
      let streak = stats.studyStreakDays;
      if (stats.lastActiveDate !== today) {
        streak += 1;
      }

      stats.studyStreakDays = streak;
      stats.lastActiveDate = today;
      stats.subjectMastery[subject] = {
        ...existingSubj,
        quizzesTaken: newSubjTotal,
        averageScore: newSubjAvg,
      };

      stats.paperlessMetrics = computePaperlessImpact(stats.totalQuizzesTaken + 1, stats.assessmentsCompleted);
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Error updating quiz stats', e);
    }
  },

  recordAssessmentResult(result: AssessmentResult) {
    try {
      const stats = this.getStudentStats();
      const subject = result.subject || 'General';
      const existingSubj = stats.subjectMastery[subject] || { quizzesTaken: 0, averageScore: 0 };
      const prevAssessments = existingSubj.assessmentsTaken || 0;

      stats.subjectMastery[subject] = {
        ...existingSubj,
        assessmentsTaken: prevAssessments + 1,
        latestSkillLevel: result.skillLevel,
      };

      stats.paperlessMetrics = computePaperlessImpact(stats.totalQuizzesTaken, stats.assessmentsCompleted + 1);
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Error recording assessment result', e);
    }
  },

  incrementStat(key: 'tutorQuestionsAsked' | 'notesGenerated') {
    try {
      const stats = this.getStudentStats();
      stats[key] = (stats[key] || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Error incrementing stat', e);
    }
  },

  clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEYS.NOTES);
      localStorage.removeItem(STORAGE_KEYS.QUIZZES);
      localStorage.removeItem(STORAGE_KEYS.QUIZ_ATTEMPTS);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENTS);
      localStorage.removeItem(STORAGE_KEYS.ASSESSMENT_RESULTS);
      localStorage.removeItem(STORAGE_KEYS.STATS);
      localStorage.removeItem(STORAGE_KEYS.TUTOR_HISTORY);
      localStorage.removeItem(STORAGE_KEYS.REMINDER);
    } catch (e) {
      console.warn('Error clearing localStorage', e);
    }
  },

  getStudyReminder(): StudyReminderSetting {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REMINDER);
      if (!data) {
        return {
          enabled: false,
          time: '18:00',
          subjectFocus: 'All Subjects',
          soundEnabled: true,
        };
      }
      return JSON.parse(data);
    } catch {
      return {
        enabled: false,
        time: '18:00',
        subjectFocus: 'All Subjects',
        soundEnabled: true,
      };
    }
  },

  saveStudyReminder(setting: StudyReminderSetting): void {
    try {
      localStorage.setItem(STORAGE_KEYS.REMINDER, JSON.stringify(setting));
    } catch (e) {
      console.warn('Error saving study reminder', e);
    }
  },

  getBaselineSheets(): number {
    try {
      const val = localStorage.getItem(STORAGE_KEYS.BASELINE_SHEETS);
      if (val !== null) {
        const parsed = parseInt(val, 10);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 10) {
          return parsed;
        }
      }
      return 3; // Default 3 paper sheets per traditional printed test booklet
    } catch {
      return 3;
    }
  },

  setBaselineSheets(sheets: number): void {
    try {
      const clamped = Math.min(10, Math.max(1, Math.round(sheets)));
      localStorage.setItem(STORAGE_KEYS.BASELINE_SHEETS, clamped.toString());
      // Update cached stats paperless metrics
      const stats = this.getStudentStats();
      stats.paperlessMetrics = computePaperlessImpact(stats.totalQuizzesTaken, stats.assessmentsCompleted, clamped);
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Error saving baseline sheets', e);
    }
  }
};
