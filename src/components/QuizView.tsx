import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  HelpCircle,
  Sparkles,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  Clock,
  ArrowRight,
  Brain,
  Loader2
} from 'lucide-react';
import { QuizSet } from '../types';

export const QuizView: React.FC = () => {
  const {
    quizzes,
    activeQuiz,
    setActiveQuizId,
    recordQuizScore,
    activeMaterial,
    generateQuizFromMaterial,
    isAiLoading,
    setViewMode
  } = useStudy();

  const [currentQuiz, setCurrentQuiz] = useState<QuizSet | null>(activeQuiz || quizzes[0] || null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleSelectOption = (questionIdx: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
    setShowExplanation(true);
  };

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIdx < currentQuiz.questions.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setShowExplanation(false);
    } else {
      handleCalculateScore();
    }
  };

  const handleCalculateScore = () => {
    if (!currentQuiz) return;
    let correctCount = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    const percentage = (correctCount / currentQuiz.questions.length) * 100;
    recordQuizScore(currentQuiz.id, percentage);
    setIsSubmitted(true);
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  const handleCreateNewQuiz = async () => {
    if (!activeMaterial) return;
    const newQuiz = await generateQuizFromMaterial(activeMaterial.id, 4);
    if (newQuiz) {
      setCurrentQuiz(newQuiz);
      handleRestartQuiz();
    }
  };

  if (!currentQuiz) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 max-w-2xl mx-auto">
        <HelpCircle className="w-12 h-12 text-purple-600 mx-auto" />
        <h3 className="text-lg font-bold">No Practice Quizzes Available</h3>
        <p className="text-sm text-slate-500">Generate an AI Quiz directly from your uploaded material.</p>
        <button
          id="gen-quiz-empty-btn"
          onClick={handleCreateNewQuiz}
          disabled={isAiLoading || !activeMaterial}
          className="px-6 py-3 rounded-2xl bg-purple-600 text-white font-bold text-sm shadow-md cursor-pointer"
        >
          {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Generate AI Quiz'}
        </button>
      </div>
    );
  }

  const activeQuestion = currentQuiz.questions[currentQuestionIdx];
  const userSelected = selectedAnswers[currentQuestionIdx];
  const isSelectedCorrect = userSelected === activeQuestion?.correctAnswer;

  // Calculate score for final modal
  let totalScoreCount = 0;
  if (isSubmitted) {
    currentQuiz.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) totalScoreCount++;
    });
  }
  const scorePercent = Math.round((totalScoreCount / currentQuiz.questions.length) * 100);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-fade-in">
      
      {/* Quiz Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <span className="text-xs font-extrabold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
            Practice MCQ Exam
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-1">
            {currentQuiz.title}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{currentQuiz.subject}</p>
        </div>

        <div className="flex items-center gap-2">
          {quizzes.length > 1 && (
            <select
              value={currentQuiz.id}
              onChange={e => {
                const found = quizzes.find(q => q.id === e.target.value);
                if (found) {
                  setCurrentQuiz(found);
                  handleRestartQuiz();
                }
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-xs font-bold cursor-pointer"
            >
              {quizzes.map(q => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
          )}

          <button
            id="quiz-gen-new-btn"
            onClick={handleCreateNewQuiz}
            disabled={isAiLoading || !activeMaterial}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-300" />}
            <span>New AI Quiz</span>
          </button>
        </div>
      </div>

      {/* Main Quiz Test Mode or Results Summary */}
      {!isSubmitted ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          
          {/* Progress Bar & Question Counter */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-slate-400">
              <span>Question {currentQuestionIdx + 1} of {currentQuiz.questions.length}</span>
              <span>Topic: {activeQuestion?.topic || currentQuiz.subject}</span>
            </div>
            <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                style={{
                  width: `${((currentQuestionIdx + 1) / currentQuiz.questions.length) * 100}%`
                }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="py-2 space-y-2">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
              {activeQuestion?.question}
            </h3>
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {activeQuestion?.options.map((opt, optIdx) => {
              const isSelected = userSelected === optIdx;
              const isCorrect = optIdx === activeQuestion.correctAnswer;

              let optionStyle =
                'border-slate-200 dark:border-slate-800 hover:border-purple-500/50 hover:bg-purple-500/5';

              if (userSelected !== undefined) {
                if (isCorrect) {
                  optionStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold';
                }
              }

              return (
                <button
                  key={optIdx}
                  id={`opt-${optIdx}-btn`}
                  onClick={() => handleSelectOption(currentQuestionIdx, optIdx)}
                  className={`w-full text-left p-4 rounded-2xl border-2 text-sm font-semibold transition-all cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{opt}</span>
                  </div>

                  {userSelected !== undefined && (
                    <div>
                      {isCorrect ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : isSelected ? (
                        <XCircle className="w-5 h-5 text-rose-500" />
                      ) : null}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* AI Explanation Card */}
          {userSelected !== undefined && (
            <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-2 animate-fade-in">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Brain className="w-4 h-4" />
                <span>AI Tutor Explanation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {activeQuestion?.explanation}
              </p>
            </div>
          )}

          {/* Next Button */}
          <div className="flex justify-end pt-2">
            <button
              id="quiz-next-btn"
              onClick={handleNextQuestion}
              disabled={userSelected === undefined}
              className="px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>{currentQuestionIdx < currentQuiz.questions.length - 1 ? 'Next Question' : 'Complete Quiz'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Final Score & Review Card */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Quiz Completed!</h3>
            <p className="text-sm text-slate-500">Here is your performance breakdown for {currentQuiz.title}</p>
          </div>

          <div className="p-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 max-w-sm mx-auto space-y-2">
            <div className="text-5xl font-extrabold text-purple-600 dark:text-purple-400">
              {scorePercent}%
            </div>
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              {totalScoreCount} out of {currentQuiz.questions.length} Questions Correct
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              id="quiz-retake-btn"
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retake Quiz</span>
            </button>
            <button
              id="quiz-return-dash-btn"
              onClick={() => setViewMode('dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-white dark:bg-slate-800 border text-slate-800 dark:text-slate-100 font-bold text-sm hover:bg-slate-50 cursor-pointer"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
