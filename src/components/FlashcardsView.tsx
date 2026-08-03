import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  Layers,
  Sparkles,
  RotateCw,
  CheckCircle2,
  XCircle,
  Plus,
  Filter,
  Brain,
  Volume2,
  Loader2,
  ThumbsUp,
  Award
} from 'lucide-react';
import { Flashcard } from '../types';

export const FlashcardsView: React.FC = () => {
  const {
    flashcards,
    toggleFlashcardMastered,
    addFlashcards,
    materials,
    activeMaterial,
    generateFlashcardsFromMaterial,
    isAiLoading
  } = useStudy();

  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New custom card state
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [newSubject, setNewSubject] = useState('Artificial Intelligence');

  const filteredCards = flashcards.filter(c =>
    selectedSubject === 'All' ? true : c.subject === selectedSubject
  );

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev + 1) % Math.max(1, filteredCards.length));
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCurrentIndex(prev => (prev - 1 + filteredCards.length) % Math.max(1, filteredCards.length));
  };

  const handleConfidenceRating = (rating: 'hard' | 'medium' | 'easy') => {
    if (currentCard && rating === 'easy') {
      if (!currentCard.mastered) {
        toggleFlashcardMastered(currentCard.id);
      }
    }
    handleNextCard();
  };

  const handleAddCustomCard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFront.trim() || !newBack.trim()) return;

    const newFc: Flashcard = {
      id: `fc_custom_${Date.now()}`,
      subject: newSubject,
      front: newFront,
      back: newBack,
      difficulty: 'medium',
      mastered: false,
      boxNumber: 1
    };

    addFlashcards([newFc]);
    setNewFront('');
    setNewBack('');
    setShowAddModal(false);
  };

  const handleGenerateAiDeck = async () => {
    if (!activeMaterial) return;
    await generateFlashcardsFromMaterial(activeMaterial.id, 5);
  };

  const subjects = ['All', ...Array.from(new Set(flashcards.map(c => c.subject)))];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Layers className="w-7 h-7 text-purple-600" />
            <span>Active Recall Flashcards</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Spaced repetition memory deck with Leitner Box tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="fc-gen-ai-btn"
            onClick={handleGenerateAiDeck}
            disabled={isAiLoading || !activeMaterial}
            className="px-4 py-2 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
            <span>Generate AI Deck</span>
          </button>
          <button
            id="fc-add-custom-btn"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 font-bold text-xs sm:text-sm hover:bg-slate-50 transition-all cursor-pointer"
          >
            + Add Card
          </button>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <Filter className="w-4 h-4 text-slate-400 shrink-0" />
        {subjects.map((subj, i) => (
          <button
            key={i}
            id={`fc-filter-${i}-btn`}
            onClick={() => {
              setSelectedSubject(subj);
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedSubject === subj
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* Main Flashcard Interactive Player Box */}
      {filteredCards.length > 0 && currentCard ? (
        <div className="space-y-6">
          
          {/* Card Frame */}
          <div className="perspective-1000 w-full min-h-[320px] sm:min-h-[380px] flex flex-col justify-center">
            <div
              id="flashcard-flip-target"
              onClick={() => setIsFlipped(!isFlipped)}
              className={`relative w-full h-full min-h-[320px] sm:min-h-[380px] rounded-3xl p-8 bg-white dark:bg-slate-900 border-2 ${
                currentCard.mastered
                  ? 'border-emerald-500/50 shadow-emerald-500/10'
                  : 'border-purple-500/30 hover:border-purple-500/60'
              } shadow-2xl transition-all duration-500 transform-gpu cursor-pointer flex flex-col justify-between select-none`}
            >
              {/* Card Top Meta */}
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-extrabold uppercase tracking-wider">
                  {currentCard.subject}
                </span>
                <div className="flex items-center gap-2">
                  {currentCard.mastered && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> Mastered
                    </span>
                  )}
                  <span className="text-xs font-mono font-bold text-slate-400">
                    Card {currentIndex + 1} of {filteredCards.length}
                  </span>
                </div>
              </div>

              {/* Card Main Body Content */}
              <div className="my-auto py-6 text-center space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                  {isFlipped ? 'Answer / Explanation' : 'Question / Prompt'}
                </p>

                <h3 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-slate-100 leading-snug max-w-2xl mx-auto">
                  {isFlipped ? currentCard.back : currentCard.front}
                </h3>

                {!isFlipped && currentCard.hint && (
                  <p className="text-xs text-amber-500 font-medium italic">
                    💡 Hint: {currentCard.hint}
                  </p>
                )}
              </div>

              {/* Card Bottom Click Indicator */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                <span>Leitner Box #{currentCard.boxNumber || 1}</span>
                <span className="flex items-center gap-1 font-semibold text-purple-600 dark:text-purple-400">
                  <RotateCw className="w-3.5 h-3.5" /> Click anywhere to flip
                </span>
              </div>
            </div>
          </div>

          {/* Confidence Assessment Rating Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="text-xs font-bold text-slate-500">
              How well did you recall this card?
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="rate-hard-btn"
                onClick={() => handleConfidenceRating('hard')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold text-xs transition-all cursor-pointer"
              >
                🔴 Hard (Box 1)
              </button>
              <button
                id="rate-medium-btn"
                onClick={() => handleConfidenceRating('medium')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs transition-all cursor-pointer"
              >
                🟡 Medium
              </button>
              <button
                id="rate-easy-btn"
                onClick={() => handleConfidenceRating('easy')}
                className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition-all cursor-pointer"
              >
                🟢 Easy (Mastered)
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <Layers className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold">No Flashcards in this Category</h3>
          <p className="text-sm text-slate-500">Generate a new deck using Gemini AI or add manual cards.</p>
        </div>
      )}

      {/* Add Custom Card Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Create New Flashcard</h3>
            <form onSubmit={handleAddCustomCard} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Front (Question)</label>
                <textarea
                  rows={2}
                  value={newFront}
                  onChange={e => setNewFront(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs resize-none"
                  placeholder="Enter card prompt..."
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-1">Back (Answer)</label>
                <textarea
                  rows={2}
                  value={newBack}
                  onChange={e => setNewBack(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs resize-none"
                  placeholder="Enter detailed answer..."
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
