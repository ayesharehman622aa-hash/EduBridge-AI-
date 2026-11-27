export type Language = string;

export type FontScript =
  | 'latin'
  | 'urdu'
  | 'arabic'
  | 'devanagari'
  | 'bengali'
  | 'gurmukhi'
  | 'hebrew'
  | 'chinese'
  | 'japanese'
  | 'korean';

export interface LanguageOption {
  code: string;
  nativeName: string;
  englishName: string;
  rtl: boolean;
  script: FontScript;
}

export type ActiveTab = 
  | 'landing'
  | 'dashboard'
  | 'assessment'
  | 'tutor'
  | 'notes'
  | 'quiz'
  | 'saved'
  | 'progress'
  | 'about';

export type SkillLevel = 'foundational' | 'developing' | 'competent' | 'proficient' | 'mastery';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: number;
  language: Language;
  topic?: string;
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  language: Language;
  createdAt: number;
  summary: string;
  keyPoints: string[];
  detailedSections: {
    heading: string;
    content: string;
    examples?: string[];
  }[];
  definitions: {
    term: string;
    definition: string;
  }[];
  quickReviewQuestions: string[];
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  hint?: string;
}

export interface Quiz {
  id: string;
  topic: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: Language;
  createdAt: number;
  questions: QuizQuestion[];
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  topic: string;
  subject: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: Language;
  timestamp: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  answers: {
    questionIndex: number;
    selectedOptionIndex: number;
    isCorrect: boolean;
  }[];
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  subtopic: string;
  skillTested: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface DiagnosticAssessment {
  id: string;
  title: string;
  subject: string;
  topic: string;
  targetGrade?: string;
  language: Language;
  createdAt: number;
  questions: AssessmentQuestion[];
}

export interface LearningGapAnalysis {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  knowledgeGaps: string[];
  recommendedRemedies: {
    actionType: 'tutor' | 'notes' | 'quiz' | 'guide';
    title: string;
    description: string;
    prefillTopic: string;
    prefillSubject: string;
  }[];
  studyPlan: {
    stepNumber: number;
    estimatedMinutes: number;
    goal: string;
    method: string;
  }[];
  sevenDayPlan?: {
    day: number;
    dayLabel: string;
    topic: string;
    shortExplanation: string;
    practiceActivity: string;
    estimatedMinutes: number;
    actionType: 'tutor' | 'notes' | 'quiz' | 'guide';
  }[];
}

export interface AssessmentResult {
  id: string;
  assessmentId: string;
  title: string;
  topic: string;
  subject: string;
  language: Language;
  timestamp: number;
  score: number;
  totalQuestions: number;
  percentage: number;
  skillLevel: SkillLevel;
  skillLevelLabel: string;
  answers: {
    questionIndex: number;
    selectedOptionIndex: number;
    isCorrect: boolean;
    subtopic: string;
    skillTested: string;
  }[];
  subtopicBreakdown: {
    subtopic: string;
    correct: number;
    total: number;
    percentage: number;
  }[];
  weakSubtopics?: string[];
  questions?: AssessmentQuestion[];
  aiGapAnalysis?: LearningGapAnalysis;
}

export interface PaperlessImpact {
  paperSheetsSaved: number;
  waterSavedLiters: number;
  carbonSavedGrams: number;
  gradingMinutesSaved: number;
  digitalTestsCompleted: number;
  baselineSheetsPerTest: number;
  assumptions: {
    waterPerSheetLiters: number;
    carbonPerSheetGrams: number;
    gradingMinsPerTest: number;
    citation: string;
  };
}

export interface OfflineGuide {
  id: string;
  title: string;
  titleUrdu: string;
  subject: string;
  subjectUrdu: string;
  summary: string;
  summaryUrdu: string;
  keyTakeaways: string[];
  keyTakeawaysUrdu: string[];
  content: string;
  contentUrdu: string;
}

export interface StudentStats {
  totalQuizzesTaken: number;
  averageScore: number;
  notesGenerated: number;
  tutorQuestionsAsked: number;
  studyStreakDays: number;
  lastActiveDate: string;
  assessmentsCompleted: number;
  averageAssessmentScore: number;
  identifiedGapsCount: number;
  paperlessMetrics: PaperlessImpact;
  subjectMastery: {
    [subject: string]: {
      quizzesTaken: number;
      averageScore: number;
      assessmentsTaken?: number;
      latestSkillLevel?: SkillLevel;
    };
  };
}

export interface StudyReminderSetting {
  enabled: boolean;
  time: string; // HH:mm format, e.g. "18:00"
  subjectFocus: string;
  soundEnabled: boolean;
  lastTriggeredDate?: string;
}

