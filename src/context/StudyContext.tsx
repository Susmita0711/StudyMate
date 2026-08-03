import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  StudyMaterial,
  Flashcard,
  QuizSet,
  StudyTask,
  StudyStats,
  ViewMode,
  ChatMessage
} from '../types';
import {
  INITIAL_MATERIALS,
  INITIAL_FLASHCARDS,
  INITIAL_QUIZZES,
  INITIAL_TASKS,
  INITIAL_STATS
} from '../data/mockData';

interface StudyContextType {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  materials: StudyMaterial[];
  activeMaterial: StudyMaterial | null;
  setActiveMaterialId: (id: string | null) => void;
  addMaterial: (material: StudyMaterial) => void;
  deleteMaterial: (id: string) => void;
  updateMaterialProgress: (id: string, progress: number) => void;

  flashcards: Flashcard[];
  toggleFlashcardMastered: (id: string) => void;
  addFlashcards: (cards: Flashcard[]) => void;

  quizzes: QuizSet[];
  activeQuiz: QuizSet | null;
  setActiveQuizId: (id: string | null) => void;
  addQuiz: (quiz: QuizSet) => void;
  recordQuizScore: (quizId: string, score: number) => void;

  tasks: StudyTask[];
  toggleTaskCompleted: (id: string) => void;
  addTask: (task: Omit<StudyTask, 'id'>) => void;
  deleteTask: (id: string) => void;

  stats: StudyStats;

  // AI helper action state & triggers
  isAiLoading: boolean;
  aiError: string | null;

  // AI Methods
  generateSummary: (materialId: string) => Promise<any>;
  explainConcept: (concept: string, mode?: string, context?: string) => Promise<any>;
  generateFlashcardsFromMaterial: (materialId: string, count?: number) => Promise<Flashcard[]>;
  generateQuizFromMaterial: (materialId: string, count?: number) => Promise<QuizSet | null>;
  generateResearchGaps: (materialId: string) => Promise<any>;
  sendChatMessage: (materialId: string, messages: ChatMessage[], newText: string) => Promise<ChatMessage | null>;
  uploadAndProcessFile: (fileName: string, fileType: string, contentText: string, subject?: string) => Promise<StudyMaterial | null>;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');

  const [materials, setMaterials] = useState<StudyMaterial[]>(() => {
    const saved = localStorage.getItem('studymate_materials');
    return saved ? JSON.parse(saved) : INITIAL_MATERIALS;
  });

  const [activeMaterialId, setActiveMaterialIdState] = useState<string | null>(() => {
    return materials[0]?.id || null;
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem('studymate_flashcards');
    return saved ? JSON.parse(saved) : INITIAL_FLASHCARDS;
  });

  const [quizzes, setQuizzes] = useState<QuizSet[]>(() => {
    const saved = localStorage.getItem('studymate_quizzes');
    return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
  });

  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  const [tasks, setTasks] = useState<StudyTask[]>(() => {
    const saved = localStorage.getItem('studymate_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [stats, setStats] = useState<StudyStats>(() => {
    const saved = localStorage.getItem('studymate_stats');
    return saved ? JSON.parse(saved) : INITIAL_STATS;
  });

  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('studymate_materials', JSON.stringify(materials));
  }, [materials]);

  useEffect(() => {
    localStorage.setItem('studymate_flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('studymate_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('studymate_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('studymate_stats', JSON.stringify(stats));
  }, [stats]);

  const activeMaterial = materials.find(m => m.id === activeMaterialId) || materials[0] || null;
  const activeQuiz = quizzes.find(q => q.id === activeQuizId) || null;

  const setActiveMaterialId = (id: string | null) => {
    setActiveMaterialIdState(id);
    if (id) {
      setViewMode('workspace');
    }
  };

  const addMaterial = (material: StudyMaterial) => {
    setMaterials(prev => [material, ...prev]);
    setActiveMaterialIdState(material.id);
  };

  const deleteMaterial = (id: string) => {
    setMaterials(prev => prev.filter(m => m.id !== id));
    if (activeMaterialId === id) {
      const remaining = materials.filter(m => m.id !== id);
      setActiveMaterialIdState(remaining[0]?.id || null);
    }
  };

  const updateMaterialProgress = (id: string, progress: number) => {
    setMaterials(prev =>
      prev.map(m => (m.id === id ? { ...m, readProgress: progress } : m))
    );
  };

  const toggleFlashcardMastered = (id: string) => {
    setFlashcards(prev => {
      const updated = prev.map(fc => {
        if (fc.id === id) {
          const nextMastered = !fc.mastered;
          return {
            ...fc,
            mastered: nextMastered,
            boxNumber: nextMastered ? Math.min(5, (fc.boxNumber || 1) + 1) : 1
          };
        }
        return fc;
      });

      // Update stats
      const masteredCount = updated.filter(c => c.mastered).length;
      setStats(st => ({
        ...st,
        cardsMastered: masteredCount,
        totalCards: updated.length
      }));

      return updated;
    });
  };

  const addFlashcards = (newCards: Flashcard[]) => {
    setFlashcards(prev => [...newCards, ...prev]);
    setStats(st => ({
      ...st,
      totalCards: st.totalCards + newCards.length
    }));
  };

  const addQuiz = (quiz: QuizSet) => {
    setQuizzes(prev => [quiz, ...prev]);
  };

  const recordQuizScore = (quizId: string, scorePercentage: number) => {
    setQuizzes(prev =>
      prev.map(q => {
        if (q.id === quizId) {
          return {
            ...q,
            lastScore: Math.round(scorePercentage),
            attemptsCount: (q.attemptsCount || 0) + 1
          };
        }
        return q;
      })
    );

    setStats(st => {
      const completedCount = st.quizzesCompleted + 1;
      const newAvg = Math.round((st.averageQuizScore * st.quizzesCompleted + scorePercentage) / completedCount);
      return {
        ...st,
        quizzesCompleted: completedCount,
        averageQuizScore: newAvg
      };
    });
  };

  const toggleTaskCompleted = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const addTask = (taskData: Omit<StudyTask, 'id'>) => {
    const newTask: StudyTask = {
      ...taskData,
      id: `task_${Date.now()}`
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // AI Calls
  const generateSummary = async (materialId: string) => {
    const mat = materials.find(m => m.id === materialId);
    if (!mat) return null;

    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: mat.content, title: mat.title }),
      });
      const data = await res.json();
      if (data.summary) {
        setMaterials(prev =>
          prev.map(m =>
            m.id === materialId
              ? { ...m, summary: data.summary, keyPoints: data.keyPoints }
              : m
          )
        );
      }
      return data;
    } catch (err: any) {
      console.error(err);
      setAiError('Failed to generate AI summary.');
      return null;
    } finally {
      setIsAiLoading(false);
    }
  };

  const explainConcept = async (concept: string, mode: string = 'eli5', context: string = '') => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ concept, mode, context }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error(err);
      setAiError('Failed to explain concept.');
      return null;
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateFlashcardsFromMaterial = async (materialId: string, count: number = 5) => {
    const mat = materials.find(m => m.id === materialId);
    if (!mat) return [];

    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: mat.content, subject: mat.subject, count }),
      });
      const rawCards = await res.json();
      if (Array.isArray(rawCards)) {
        const createdCards: Flashcard[] = rawCards.map((rc: any, idx: number) => ({
          id: `fc_${Date.now()}_${idx}`,
          materialId,
          subject: mat.subject,
          front: rc.front,
          back: rc.back,
          hint: rc.hint,
          difficulty: rc.difficulty || 'medium',
          mastered: false,
          boxNumber: 1
        }));
        addFlashcards(createdCards);
        return createdCards;
      }
      return [];
    } catch (err: any) {
      console.error(err);
      setAiError('Failed to generate flashcards.');
      return [];
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateQuizFromMaterial = async (materialId: string, count: number = 4) => {
    const mat = materials.find(m => m.id === materialId);
    if (!mat) return null;

    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: mat.content,
          title: mat.title.replace(/\.[^/.]+$/, ''),
          subject: mat.subject,
          count
        }),
      });
      const quizData = await res.json();
      if (quizData.questions) {
        const newQuizSet: QuizSet = {
          id: `quiz_${Date.now()}`,
          title: quizData.title || `AI Quiz: ${mat.title}`,
          materialId,
          subject: mat.subject,
          createdDate: new Date().toISOString().split('T')[0],
          questions: quizData.questions.map((q: any, i: number) => ({
            id: `q_${Date.now()}_${i}`,
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer ?? 0,
            explanation: q.explanation,
            topic: q.topic || mat.subject
          }))
        };
        addQuiz(newQuizSet);
        return newQuizSet;
      }
      return null;
    } catch (err: any) {
      console.error(err);
      setAiError('Failed to generate quiz.');
      return null;
    } finally {
      setIsAiLoading(false);
    }
  };

  const generateResearchGaps = async (materialId: string) => {
    const mat = materials.find(m => m.id === materialId);
    if (!mat) return null;

    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/research-gaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: mat.content, title: mat.title }),
      });
      const data = await res.json();
      if (data.researchGaps) {
        setMaterials(prev =>
          prev.map(m =>
            m.id === materialId
              ? { ...m, researchGaps: data.researchGaps }
              : m
          )
        );
      }
      return data;
    } catch (err: any) {
      console.error(err);
      setAiError('Failed to analyze research gaps.');
      return null;
    } finally {
      setIsAiLoading(false);
    }
  };

  const sendChatMessage = async (
    materialId: string,
    history: ChatMessage[],
    newText: string
  ): Promise<ChatMessage | null> => {
    const mat = materials.find(m => m.id === materialId) || activeMaterial;
    if (!mat) return null;

    setIsAiLoading(true);
    setAiError(null);
    try {
      const messagesPayload = [
        ...history,
        { id: `user_${Date.now()}`, sender: 'user', text: newText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ];

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messagesPayload,
          documentContext: mat.content,
          documentTitle: mat.title
        }),
      });
      const data = await res.json();
      const aiResponse: ChatMessage = {
        id: `ai_${Date.now()}`,
        sender: 'ai',
        text: data.text || 'I analyzed your document to address your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: data.suggestedPrompts || []
      };
      return aiResponse;
    } catch (err: any) {
      console.error(err);
      setAiError('Chat error.');
      return null;
    } finally {
      setIsAiLoading(false);
    }
  };

  const uploadAndProcessFile = async (
    fileName: string,
    fileType: string,
    contentText: string,
    subject: string = 'General'
  ): Promise<StudyMaterial | null> => {
    setIsAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch('/api/ai/parse-file', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileType, textContent: contentText, subject }),
      });
      const newMaterial = await res.json();
      if (newMaterial && newMaterial.id) {
        addMaterial(newMaterial);
        return newMaterial;
      }
      return null;
    } catch (err: any) {
      console.error(err);
      setAiError('File processing error.');
      return null;
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <StudyContext.Provider
      value={{
        viewMode,
        setViewMode,
        materials,
        activeMaterial,
        setActiveMaterialId,
        addMaterial,
        deleteMaterial,
        updateMaterialProgress,
        flashcards,
        toggleFlashcardMastered,
        addFlashcards,
        quizzes,
        activeQuiz,
        setActiveQuizId,
        addQuiz,
        recordQuizScore,
        tasks,
        toggleTaskCompleted,
        addTask,
        deleteTask,
        stats,
        isAiLoading,
        aiError,
        generateSummary,
        explainConcept,
        generateFlashcardsFromMaterial,
        generateQuizFromMaterial,
        generateResearchGaps,
        sendChatMessage,
        uploadAndProcessFile
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) throw new Error('useStudy must be used within StudyProvider');
  return context;
};
