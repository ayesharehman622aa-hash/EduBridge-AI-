import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Initialize Google Gen AI client on the server only
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

const QUOTA_EXCEEDED_MESSAGE =
  'Daily AI free-tier quota reached. Built-in languages (English, Urdu, Arabic, Hindi, Spanish, French) and saved materials continue working offline, or you can attach a billing-enabled API key in Settings > Secrets.';

const uiTranslationCache = new Map<string, Record<string, unknown>>();

function extractApiErrorMessage(err: any, fallback = 'An unexpected error occurred.'): string {
  try {
    if (typeof err?.message === 'string') {
      const trimmed = err.message.trim();
      if (trimmed.startsWith('{')) {
        const parsed = JSON.parse(trimmed);
        return parsed?.error?.message || trimmed;
      }
      return trimmed;
    }
  } catch {
    if (typeof err?.message === 'string') return err.message;
  }
  return fallback;
}

function isQuotaExhaustedError(err: any): boolean {
  const status = err?.status;
  const msg = typeof err?.message === 'string' ? err.message : '';
  return (
    status === 429 ||
    msg.includes('"code":429') ||
    msg.includes('RESOURCE_EXHAUSTED') ||
    msg.includes('Quota exceeded') ||
    msg.includes('rate-limit')
  );
}

// Retry wrapper with model fallback on 429 quota limits and exponential backoff for transient 503 spikes
async function generateWithRetry(
  ai: GoogleGenAI,
  params: any,
  options: { maxRetries?: number; fallbackModel?: string } = {}
) {
  const { maxRetries = 3, fallbackModel } = options;
  let currentParams = { ...params };
  let triedFallback = false;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      return await ai.models.generateContent(currentParams);
    } catch (err: any) {
      if (isQuotaExhaustedError(err) && fallbackModel && !triedFallback && currentParams.model !== fallbackModel) {
        triedFallback = true;
        console.warn(`Quota limit on ${currentParams.model}, falling back to ${fallbackModel}...`);
        currentParams = { ...currentParams, model: fallbackModel };
        continue;
      }

      attempt++;
      const isQuota = isQuotaExhaustedError(err);
      const isTransient =
        !isQuota &&
        (err?.status === 503 ||
          (err?.message && (err.message.includes('503') || err.message.includes('high demand') || err.message.includes('UNAVAILABLE'))));

      if (isTransient && attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 800;
        console.warn(`Transient Gemini API error (attempt ${attempt}/${maxRetries}), retrying in ${delay}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
  throw new Error('Failed to generate content after retries.');
}

// Helper to resolve preset code or custom language into a clear language name for Gemini
const PRESET_LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ur: 'Urdu (اردو)',
  hi: 'Hindi (हिन्दी)',
  bn: 'Bengali (বাংলা)',
  ar: 'Arabic (العربية)',
  fa: 'Persian (فارسی)',
  ps: 'Pashto (پښتو)',
  sd: 'Sindhi (سنڌي)',
  pa: 'Punjabi (ਪੰਜਾਬੀ)',
  es: 'Spanish (Español)',
  fr: 'French (Français)',
  pt: 'Portuguese (Português)',
  tr: 'Turkish (Türkçe)',
  id: 'Indonesian (Bahasa Indonesia)',
  sw: 'Swahili (Kiswahili)',
  zh: 'Chinese (中文)',
  ja: 'Japanese (日本語)',
  ko: 'Korean (한국어)',
  ru: 'Russian (Русский)',
  he: 'Hebrew (עברית)',
};

function resolveLanguageName(language?: string, languageName?: string): string {
  if (languageName && typeof languageName === 'string' && languageName.trim().length > 0) {
    return languageName.trim();
  }
  if (!language || typeof language !== 'string') {
    return 'English';
  }
  const trimmed = language.trim();
  if (PRESET_LANGUAGE_NAMES[trimmed]) {
    return PRESET_LANGUAGE_NAMES[trimmed];
  }
  if (trimmed.startsWith('custom:')) {
    return trimmed.slice('custom:'.length).trim() || 'English';
  }
  return trimmed || 'English';
}

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    appName: 'EduBridge AI',
  });
});

// 0. Translate Full UI Strings Dictionary Endpoint (1 Gemini Call, Cached on Server & Client)
app.post('/api/translate-ui', async (req: Request, res: Response) => {
  try {
    const { language, targetLanguage, strings } = req.body;
    const resolvedLanguage = resolveLanguageName(language, targetLanguage);

    if (!strings || typeof strings !== 'object') {
      res.status(400).json({ error: 'Strings dictionary object is required.' });
      return;
    }

    const serverCacheKey = resolvedLanguage.trim().toLowerCase();
    const cachedDict = uiTranslationCache.get(serverCacheKey);
    if (cachedDict) {
      res.json({
        language: language || resolvedLanguage,
        targetLanguage: resolvedLanguage,
        translations: cachedDict,
        cached: true,
      });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
      return;
    }

    const systemInstruction = `You are a skilled educational localization translator for EduBridge AI.
Translate all string values in the provided JSON object into ${resolvedLanguage}.
Rules:
1. Return valid JSON ONLY, preserving the exact same nested object structure and exact same English keys.
2. Never translate, rename, add, or omit any JSON keys.
3. Use natural, student-friendly, idiomatic wording suitable for school and college students—avoid stiff word-for-word literal translation.
4. Keep brand and technical names like "EduBridge AI", "Gemini AI", "Gemini API", "CO2e", and "localStorage" recognizable in context.
5. Keep numbers, units, and punctuation natural for ${resolvedLanguage}.`;

    const response = await generateWithRetry(
      ai,
      {
        model: 'gemini-3.1-flash-lite',
        contents: `Translate this UI strings JSON object into ${resolvedLanguage}:\n${JSON.stringify(strings)}`,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
        },
      },
      { fallbackModel: 'gemini-4-hydrogen' }
    );

    const rawText = (response.text || '{}').trim();
    const cleaned = rawText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
    const parsed = JSON.parse(cleaned);

    if (parsed && typeof parsed === 'object') {
      uiTranslationCache.set(serverCacheKey, parsed);
    }

    res.json({
      language: language || resolvedLanguage,
      targetLanguage: resolvedLanguage,
      translations: parsed,
    });
  } catch (error: any) {
    if (isQuotaExhaustedError(error)) {
      console.warn('UI translation skipped due to Gemini free-tier quota limit.');
      res.status(429).json({
        error: QUOTA_EXCEEDED_MESSAGE,
        code: 'QUOTA_EXCEEDED',
      });
      return;
    }
    console.warn('UI translation warning:', extractApiErrorMessage(error, 'Failed to translate UI strings.'));
    res.status(500).json({ error: extractApiErrorMessage(error, 'Failed to translate UI strings.') });
  }
});

// 1. AI Tutor Chat Endpoint
app.post('/api/tutor/chat', async (req: Request, res: Response) => {
  try {
    const { message, language = 'en', languageName, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please ensure the API key is set in AI Studio Secrets.',
      });
      return;
    }

    const targetLanguage = resolveLanguageName(language, languageName);

    const systemInstruction = `You are EduBridge AI Personal Tutor, an encouraging, highly pedagogical teacher dedicated to educating underserved and rural students who may not have access to private tutors or well-resourced libraries.

Core pedagogical guidelines:
1. Explain concepts step by step with zero unneeded jargon. Always provide concrete, real-world examples (e.g. farming, cooking, village crafts, nature cycles, market calculations, daily household items).
2. Language Rules:
   - Respond entirely in ${targetLanguage}, in simple, student-friendly wording. Keep numbers, formulas and code unchanged.
   - IMPORTANT: If the student writes their current message in a different language than ${targetLanguage}, answer in the language the student wrote in.
   - You may include key English scientific terms in parentheses where helpful for exams.
3. Academic Honesty: Never fabricate facts or pretend certainty where none exists. If a theory has nuances, limitations, or if something is unknown, acknowledge it directly and honestly.
4. Structure: Use markdown with clear headings, bullet points, numbered steps, and a short summary tip at the end.
5. Tone: Warm, patient, respectful, empowering, and beginner-friendly. Encourage follow-up questions.`;

    // Build contents array including previous turns
    const contents: Array<{ role?: string; parts: Array<{ text: string }> }> = [];

    if (Array.isArray(history) && history.length > 0) {
      for (const turn of history.slice(-6)) {
        if (turn && turn.text) {
          contents.push({
            role: turn.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: turn.text }],
          });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [{ text: message.trim() }],
    });

    const response = await generateWithRetry(
      ai,
      {
        model: 'gemini-4-hydrogen',
        contents,
        config: {
          systemInstruction,
        },
      },
      { fallbackModel: 'gemini-3.1-flash-lite' }
    );

    const replyText = response.text || 'Sorry, I could not generate a response at this time.';

    res.json({
      text: replyText,
      language,
    });
  } catch (error: any) {
    if (isQuotaExhaustedError(error)) {
      console.warn('Tutor chat quota limit reached.');
      res.status(429).json({ error: QUOTA_EXCEEDED_MESSAGE, code: 'QUOTA_EXCEEDED' });
      return;
    }
    console.warn('Tutor chat API error:', extractApiErrorMessage(error));
    res.status(500).json({ error: extractApiErrorMessage(error) });
  }
});

// 1b. AI Tutor Voice Transcription Endpoint (gemini-3.5-transcribe fallback for universal browser/language support)
app.post('/api/tutor/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm', language = 'en', languageName } = req.body;

    if (!audioBase64 || typeof audioBase64 !== 'string' || audioBase64.trim().length === 0) {
      res.status(400).json({ error: 'Audio data cannot be empty.' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
      return;
    }

    const targetLanguage = resolveLanguageName(language, languageName);
    const cleanMime = typeof mimeType === 'string' && mimeType.includes(';') ? mimeType.split(';')[0] : mimeType;

    const response = await generateWithRetry(
      ai,
      {
        model: 'gemini-3.5-transcribe',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: cleanMime || 'audio/webm',
                data: audioBase64,
              },
            },
            {
              text: `Transcribe the student's spoken question accurately into plain text. Expected language context: ${targetLanguage} (if the student speaks in another language, transcribe in the language they actually spoke). Return only the transcribed text with no extra commentary.`,
            },
          ],
        },
      },
      { fallbackModel: 'gemini-3.1-flash-lite' }
    );

    const transcript = (response.text || '').trim();
    res.json({ text: transcript });
  } catch (error: any) {
    if (isQuotaExhaustedError(error)) {
      console.warn('Voice transcription quota limit reached.');
      res.status(429).json({ error: QUOTA_EXCEEDED_MESSAGE, code: 'QUOTA_EXCEEDED' });
      return;
    }
    console.warn('Voice transcription API error:', extractApiErrorMessage(error, 'Failed to transcribe audio.'));
    res.status(500).json({ error: extractApiErrorMessage(error, 'Failed to transcribe audio.') });
  }
});

// 2. Smart Notes Generator Endpoint
app.post('/api/notes/generate', async (req: Request, res: Response) => {
  try {
    const { topic, subject = 'General Science', sourceText = '', language = 'en', languageName, depth = 'standard' } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      res.status(400).json({ error: 'Topic cannot be empty.' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
      return;
    }

    const targetLanguage = resolveLanguageName(language, languageName);

    const systemInstruction = `You are an expert curriculum educator for EduBridge AI.
Generate structured, clean, highly readable educational revision notes for students.
Respond entirely in ${targetLanguage}, in simple, student-friendly wording. Keep numbers, formulas and code unchanged.
Keep all JSON object property keys strictly in English matching the schema; write all field values in ${targetLanguage}.

Return JSON with exact structure:
- title: string (descriptive title of notes)
- subject: string (subject category)
- summary: string (2-3 concise sentences summarizing the whole topic)
- keyPoints: string[] (5-7 crucial bullet points every student must remember)
- detailedSections: array of { heading: string, content: string, examples: string[] } (2-4 organized sections explaining core mechanisms, steps, or principles with daily analogies)
- definitions: array of { term: string, definition: string } (3-5 essential vocabulary words or formulas)
- quickReviewQuestions: string[] (3-4 self-check review questions)
- tags: string[] (3-5 relevant keywords)`;

    const prompt = `Topic: "${topic.trim()}"
Subject: "${subject}"
Study Depth: "${depth}"
Target Language: ${targetLanguage}
${sourceText ? `Source Material/Text to summarize:\n${sourceText.slice(0, 4000)}` : 'Synthesize comprehensive curriculum notes for this topic from fundamental principles.'}

Please generate the structured educational notes JSON.`;

    const response = await generateWithRetry(
      ai,
      {
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              summary: { type: Type.STRING },
              keyPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              detailedSections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    heading: { type: Type.STRING },
                    content: { type: Type.STRING },
                    examples: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                  },
                  required: ['heading', 'content'],
                },
              },
              definitions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    term: { type: Type.STRING },
                    definition: { type: Type.STRING },
                  },
                  required: ['term', 'definition'],
                },
              },
              quickReviewQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              tags: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
            },
            required: ['title', 'subject', 'summary', 'keyPoints', 'detailedSections', 'definitions', 'quickReviewQuestions'],
          },
        },
      },
      { fallbackModel: 'gemini-3.1-flash-lite' }
    );

    const rawJson = response.text || '{}';
    const parsedData = JSON.parse(rawJson);

    res.json({
      ...parsedData,
      id: 'note-' + Date.now(),
      createdAt: Date.now(),
      language,
    });
  } catch (error: any) {
    if (isQuotaExhaustedError(error)) {
      console.warn('Notes generator quota limit reached.');
      res.status(429).json({ error: QUOTA_EXCEEDED_MESSAGE, code: 'QUOTA_EXCEEDED' });
      return;
    }
    console.warn('Notes generator API error:', extractApiErrorMessage(error, 'Failed to generate study notes.'));
    res.status(500).json({ error: extractApiErrorMessage(error, 'Failed to generate study notes.') });
  }
});

// 3. AI Quiz Generator Endpoint
app.post('/api/quiz/generate', async (req: Request, res: Response) => {
  try {
    const { topic, subject = 'General Science', difficulty = 'intermediate', numQuestions = 5, language = 'en', languageName } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      res.status(400).json({ error: 'Quiz topic cannot be empty.' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
      return;
    }

    const questionCount = Math.min(Math.max(parseInt(String(numQuestions), 10) || 5, 3), 10);
    const targetLanguage = resolveLanguageName(language, languageName);

    const systemInstruction = `You are a fair, pedagogical test creator for EduBridge AI.
Generate a high-quality educational multiple-choice quiz that tests genuine conceptual understanding, not mere memorization.
Difficulty: ${difficulty}.
Number of questions: ${questionCount}.
Respond entirely in ${targetLanguage}, in simple, student-friendly wording. Keep numbers, formulas and code unchanged.
Keep all JSON object property keys strictly in English matching the schema; write all questions, options, hints, and explanations in ${targetLanguage}.

Rules for questions:
- Exactly 4 distinct options per question.
- Exactly one unequivocally correct answer indicated by 0-based integer 'correctAnswerIndex' (0, 1, 2, or 3).
- Provide a helpful, constructive 'explanation' stating why the correct choice is right and pointing out common misconceptions in the other options.
- Provide a short 'hint' to assist students if they get stuck.`;

    const prompt = `Topic: "${topic.trim()}"
Subject: "${subject}"
Difficulty Level: "${difficulty}"
Count: ${questionCount} questions
Language: ${targetLanguage}

Generate the multiple-choice quiz JSON.`;

    const response = await generateWithRetry(
      ai,
      {
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              topic: { type: Type.STRING },
              subject: { type: Type.STRING },
              difficulty: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                    hint: { type: Type.STRING },
                  },
                  required: ['question', 'options', 'correctAnswerIndex', 'explanation'],
                },
              },
            },
            required: ['topic', 'questions'],
          },
        },
      },
      { fallbackModel: 'gemini-3.1-flash-lite' }
    );

    const rawJson = response.text || '{}';
    const parsedData = JSON.parse(rawJson);

    // Ensure questions have IDs
    const questionsWithIds = (parsedData.questions || []).map((q: any, idx: number) => ({
      ...q,
      id: `q-${Date.now()}-${idx}`,
    }));

    res.json({
      id: 'quiz-' + Date.now(),
      topic: parsedData.topic || topic,
      subject: parsedData.subject || subject,
      difficulty,
      language,
      createdAt: Date.now(),
      questions: questionsWithIds,
    });
  } catch (error: any) {
    if (isQuotaExhaustedError(error)) {
      console.warn('Quiz generator quota limit reached.');
      res.status(429).json({ error: QUOTA_EXCEEDED_MESSAGE, code: 'QUOTA_EXCEEDED' });
      return;
    }
    console.warn('Quiz generator API error:', extractApiErrorMessage(error, 'Failed to generate quiz.'));
    res.status(500).json({ error: extractApiErrorMessage(error, 'Failed to generate quiz.') });
  }
});

// 4. Student Self-Assessment Generator Endpoint
app.post('/api/assessment/generate', async (req: Request, res: Response) => {
  try {
    const { topic, subject = 'General Science', language = 'en', languageName, numQuestions = 5 } = req.body;

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      res.status(400).json({ error: 'Assessment topic cannot be empty.' });
      return;
    }

    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
      return;
    }

    const targetLanguage = resolveLanguageName(language, languageName);
    const qCount = Math.min(Math.max(parseInt(String(numQuestions), 10) || 5, 3), 8);

    const systemInstruction = `You are a diagnostic educational assessment specialist for EduBridge AI.
Generate a structured, calibrated diagnostic self-assessment that tests conceptual depth across specific subtopics and cognitive skill dimensions (such as Factual Recall, Conceptual Understanding, Real-world Application, and Critical Reasoning).
Respond entirely in ${targetLanguage}, in simple, student-friendly wording. Keep numbers, formulas and code unchanged.
Keep all JSON object property keys strictly in English matching the schema; write title, subject, topic, questions, subtopics, skillTested, options, and explanations in ${targetLanguage}.

Rules:
- Generate exactly ${qCount} questions.
- Each question must specify:
  * 'subtopic': the specific concept/mechanism being diagnosed in ${targetLanguage}
  * 'skillTested': cognitive skill dimension label in ${targetLanguage}
  * 'options': array of 4 distinct choices
  * 'correctAnswerIndex': 0-based integer (0-3)
  * 'explanation': educational rationale for why the correct option is right.`;

    const prompt = `Topic: "${topic.trim()}"
Subject: "${subject}"
Language: ${targetLanguage}
Generate ${qCount} diagnostic assessment questions measuring student mastery and identifying knowledge gaps.`;

    const response = await generateWithRetry(
      ai,
      {
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              subject: { type: Type.STRING },
              topic: { type: Type.STRING },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    question: { type: Type.STRING },
                    subtopic: { type: Type.STRING },
                    skillTested: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                    },
                    correctAnswerIndex: { type: Type.INTEGER },
                    explanation: { type: Type.STRING },
                  },
                  required: ['question', 'subtopic', 'skillTested', 'options', 'correctAnswerIndex', 'explanation'],
                },
              },
            },
            required: ['title', 'topic', 'questions'],
          },
        },
      },
      { fallbackModel: 'gemini-3.1-flash-lite' }
    );

    const rawJson = response.text || '{}';
    const parsedData = JSON.parse(rawJson);

    const questionsWithIds = (parsedData.questions || []).map((q: any, idx: number) => ({
      ...q,
      id: `diag-q-${Date.now()}-${idx}`,
    }));

    res.json({
      id: 'assessment-' + Date.now(),
      title: parsedData.title || `Diagnostic: ${topic}`,
      subject: parsedData.subject || subject,
      topic: parsedData.topic || topic,
      language,
      createdAt: Date.now(),
      questions: questionsWithIds,
    });
  } catch (error: any) {
    if (isQuotaExhaustedError(error)) {
      console.warn('Assessment generation quota limit reached.');
      res.status(429).json({ error: QUOTA_EXCEEDED_MESSAGE, code: 'QUOTA_EXCEEDED' });
      return;
    }
    console.warn('Assessment generation error:', extractApiErrorMessage(error, 'Failed to generate diagnostic assessment.'));
    res.status(500).json({ error: extractApiErrorMessage(error, 'Failed to generate diagnostic assessment.') });
  }
});

// 5. AI Learning Gap Detector Endpoint
app.post('/api/assessment/analyze-gaps', async (req: Request, res: Response) => {
  try {
    const { 
      topic, 
      subject = 'General Science', 
      language = 'en', 
      languageName,
      score, 
      totalQuestions, 
      percentage, 
      answers = [], 
      questions = [] 
    } = req.body;

    const ai = getAiClient();
    if (!ai) {
      res.status(503).json({
        error: 'GEMINI_API_KEY is not configured on the server.',
      });
      return;
    }

    const targetLanguage = resolveLanguageName(language, languageName);

    const systemInstruction = `You are the EduBridge AI Learning Gap Detector and Curriculum Specialist.
Your objective is to perform a diagnostic analysis of a student's self-assessment test results:
1. Identify conceptual STRENGTHS (what the student genuinely understands well).
2. Identify WEAKNESSES and misconceptions (which subtopics or reasoning skills failed).
3. Specify exact KNOWLEDGE GAPS (the missing foundational pieces).
4. Recommend concrete REMEDIAL ACTIONS connecting to EduBridge AI features (actionType MUST stay strictly one of English literals: 'tutor', 'notes', 'quiz', or 'guide').
5. Provide a personalized 3-step immediate STUDY PLAN with estimated minutes.
6. Provide a personalized 7-DAY REMEDIAL STUDY PLAN ('sevenDayPlan') tailored specifically to the student's measured skill level and missed subtopics. Each day (Day 1 through Day 7) must have:
   - day: integer 1 to 7
   - dayLabel: localized day label in ${targetLanguage}
   - topic: focused remedial topic addressing their weak subtopics
   - shortExplanation: 2-3 sentence easy-to-understand concept explanation
   - practiceActivity: actionable daily learning task
   - estimatedMinutes: integer (10-25)
   - actionType: MUST stay strictly one of English literals: 'tutor', 'notes', 'quiz', or 'guide'

Respond entirely in ${targetLanguage}, in simple, student-friendly wording. Keep numbers, formulas and code unchanged.
Keep all JSON object property keys and actionType enum values strictly in English; write all text fields in ${targetLanguage}.`;

    const promptDetails = {
      topic,
      subject,
      score: `${score}/${totalQuestions} (${percentage}%)`,
      answersBreakdown: answers.map((ans: any, i: number) => {
        const q = questions[i] || {};
        return {
          questionNumber: i + 1,
          question: q.question,
          subtopic: ans.subtopic || q.subtopic,
          skillTested: ans.skillTested || q.skillTested,
          studentSelected: q.options?.[ans.selectedOptionIndex] || 'None',
          correctAnswer: q.options?.[q.correctAnswerIndex] || 'N/A',
          isCorrect: ans.isCorrect,
          explanation: q.explanation,
        };
      }),
    };

    const prompt = `Student Assessment Submission Details:\n${JSON.stringify(promptDetails, null, 2)}\n\nPlease perform the diagnostic AI learning gap analysis and generate the comprehensive 7-day remedial study plan JSON in ${targetLanguage}.`;

    const response = await generateWithRetry(
      ai,
      {
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              strengths: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              weaknesses: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              knowledgeGaps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              recommendedRemedies: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    actionType: { type: Type.STRING }, // 'tutor' | 'notes' | 'quiz' | 'guide'
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    prefillTopic: { type: Type.STRING },
                    prefillSubject: { type: Type.STRING },
                  },
                  required: ['actionType', 'title', 'description', 'prefillTopic', 'prefillSubject'],
                },
              },
              studyPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stepNumber: { type: Type.INTEGER },
                    estimatedMinutes: { type: Type.INTEGER },
                    goal: { type: Type.STRING },
                    method: { type: Type.STRING },
                  },
                  required: ['stepNumber', 'estimatedMinutes', 'goal', 'method'],
                },
              },
              sevenDayPlan: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    day: { type: Type.INTEGER },
                    dayLabel: { type: Type.STRING },
                    topic: { type: Type.STRING },
                    shortExplanation: { type: Type.STRING },
                    practiceActivity: { type: Type.STRING },
                    estimatedMinutes: { type: Type.INTEGER },
                    actionType: { type: Type.STRING },
                  },
                  required: ['day', 'dayLabel', 'topic', 'shortExplanation', 'practiceActivity', 'estimatedMinutes', 'actionType'],
                },
              },
            },
            required: ['summary', 'strengths', 'weaknesses', 'knowledgeGaps', 'recommendedRemedies', 'studyPlan', 'sevenDayPlan'],
          },
        },
      },
      { fallbackModel: 'gemini-3.1-flash-lite' }
    );

    const rawJson = response.text || '{}';
    const parsedData = JSON.parse(rawJson);

    res.json(parsedData);
  } catch (error: any) {
    if (isQuotaExhaustedError(error)) {
      console.warn('Gap analysis quota limit reached.');
      res.status(429).json({ error: QUOTA_EXCEEDED_MESSAGE, code: 'QUOTA_EXCEEDED' });
      return;
    }
    console.warn('Gap analysis API error:', extractApiErrorMessage(error, 'Failed to analyze learning gaps.'));
    res.status(500).json({ error: extractApiErrorMessage(error, 'Failed to analyze learning gaps.') });
  }
});

// Vite Middleware for Dev / Static Files for Prod
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EduBridge AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
