export type ViewMode = 
  | 'landing'
  | 'dashboard'
  | 'upload'
  | 'workspace'
  | 'flashcards'
  | 'quizzes'
  | 'planner'
  | 'progress'
  | 'settings'
  | 'login';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  college?: string;
  major?: string;
  studyGoalHours?: number;
  streakDays?: number;
}

export interface StudyMaterial {
  id: string;
  title: string;
  subject: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'txt' | 'note';
  fileSize?: string;
  uploadDate: string;
  content: string;
  summary?: string;
  keyPoints?: string[];
  concepts?: { term: string; definition: string; simpleExplanation: string }[];
  researchGaps?: string[];
  tags: string[];
  readProgress: number; // 0-100
  pageCount?: number;
}

export interface Flashcard {
  id: string;
  materialId?: string;
  subject: string;
  front: string;
  back: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  mastered: boolean;
  boxNumber?: number; // Leitner box 1-5
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index 0-3
  explanation: string;
  topic?: string;
}

export interface QuizSet {
  id: string;
  title: string;
  materialId?: string;
  subject: string;
  questions: QuizQuestion[];
  createdDate: string;
  lastScore?: number;
  attemptsCount?: number;
}

export interface StudyTask {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  estimatedMinutes: number;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  materialId?: string;
  aiSuggested?: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  citationPage?: number;
  suggestedPrompts?: string[];
}

export interface StudyStats {
  totalHoursStudied: number;
  cardsMastered: number;
  totalCards: number;
  quizzesCompleted: number;
  averageQuizScore: number;
  activeStreak: number;
  weeklyHours: { day: string; hours: number }[];
  subjectProgress: { subject: string; progress: number; color: string }[];
}
