import React, { useState } from 'react';
import { useStudy } from '../context/StudyContext';
import {
  FileText,
  Sparkles,
  MessageSquare,
  BookOpen,
  Brain,
  HelpCircle,
  Layers,
  Search,
  ChevronLeft,
  ChevronRight,
  Send,
  Loader2,
  Lightbulb,
  AlertCircle,
  Zap,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { ChatMessage } from '../types';

export const DocumentWorkspace: React.FC = () => {
  const {
    materials,
    activeMaterial,
    setActiveMaterialId,
    updateMaterialProgress,
    sendChatMessage,
    generateSummary,
    explainConcept,
    generateResearchGaps,
    generateFlashcardsFromMaterial,
    generateQuizFromMaterial,
    isAiLoading,
    setViewMode
  } = useStudy();

  const [activeTab, setActiveTab] = useState<'chat' | 'summary' | 'explain' | 'gaps' | 'generate'>('chat');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Chat tab state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_init',
      sender: 'ai',
      text: `Hello! I'm StudyMate AI. I've indexed "${activeMaterial?.title || 'your document'}". Ask me anything or try one of the suggested prompts below!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        'Summarize the top 3 key points.',
        'Explain the most difficult concept simply.',
        'What practice exam questions might appear on this?'
      ]
    }
  ]);
  const [inputPrompt, setInputPrompt] = useState('');

  // Explain concept tab state
  const [selectedConcept, setSelectedConcept] = useState('');
  const [explainMode, setExplainMode] = useState<'eli5' | 'analogy' | 'academic' | 'step_by_step'>('eli5');
  const [explainResult, setExplainResult] = useState<any>(null);

  // Generation success alerts
  const [genAlert, setGenAlert] = useState<string | null>(null);

  if (!activeMaterial) {
    return (
      <div className="p-8 text-center space-y-4">
        <FileText className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-lg font-bold">No Material Selected</h3>
        <p className="text-sm text-slate-500">Upload a study document or select one from the sidebar.</p>
        <button
          id="workspace-upload-empty-btn"
          onClick={() => setViewMode('upload')}
          className="px-4 py-2 rounded-xl bg-purple-600 text-white text-sm font-semibold cursor-pointer"
        >
          Upload Notes
        </button>
      </div>
    );
  }

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || inputPrompt;
    if (!messageText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedHistory = [...chatMessages, userMsg];
    setChatMessages(updatedHistory);
    setInputPrompt('');

    const aiRes = await sendChatMessage(activeMaterial.id, updatedHistory, messageText);
    if (aiRes) {
      setChatMessages(prev => [...prev, aiRes]);
    }
  };

  const handleRunExplain = async () => {
    if (!selectedConcept) return;
    const res = await explainConcept(selectedConcept, explainMode, activeMaterial.content);
    if (res) {
      setExplainResult(res);
    }
  };

  const handleGenerateFlashcards = async () => {
    const cards = await generateFlashcardsFromMaterial(activeMaterial.id, 5);
    if (cards.length > 0) {
      setGenAlert(`Successfully generated ${cards.length} new flashcards!`);
      setTimeout(() => setGenAlert(null), 4000);
    }
  };

  const handleGenerateQuiz = async () => {
    const quiz = await generateQuizFromMaterial(activeMaterial.id, 4);
    if (quiz) {
      setGenAlert(`Successfully created quiz: "${quiz.title}"!`);
      setTimeout(() => setGenAlert(null), 4000);
    }
  };

  const totalPages = activeMaterial.pageCount || 10;

  return (
    <div className="space-y-6">
      
      {/* Top Document Selection Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold uppercase text-xs">
            {activeMaterial.fileType}
          </div>
          <div className="min-w-0 flex-1">
            <select
              value={activeMaterial.id}
              onChange={e => setActiveMaterialId(e.target.value)}
              className="font-bold text-slate-900 dark:text-slate-100 bg-transparent text-base sm:text-lg focus:outline-none cursor-pointer truncate max-w-full"
            >
              {materials.map(m => (
                <option key={m.id} value={m.id} className="bg-white dark:bg-slate-900">
                  {m.title} ({m.subject})
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{activeMaterial.subject}</span>
              <span>•</span>
              <span>{activeMaterial.fileSize || '1.8 MB'}</span>
              <span>•</span>
              <span>Uploaded {activeMaterial.uploadDate}</span>
            </div>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            id="workspace-gen-fc-top-btn"
            onClick={handleGenerateFlashcards}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 text-xs font-semibold transition-all cursor-pointer"
          >
            <Layers className="w-4 h-4" />
            <span>Generate Flashcards</span>
          </button>
          <button
            id="workspace-gen-quiz-top-btn"
            onClick={handleGenerateQuiz}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-all cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
            <span>Generate Quiz</span>
          </button>
        </div>
      </div>

      {genAlert && (
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{genAlert}</span>
          </div>
          <button onClick={() => setGenAlert(null)} className="text-xs hover:underline">Dismiss</button>
        </div>
      )}

      {/* Main Workspace Dual Panel Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Panel: Document Reader View (7 Columns) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
            
            {/* Toolbar */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3 gap-2">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search in document..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                />
              </div>

              {/* Page Navigator */}
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <button
                  id="page-prev-btn"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  id="page-next-btn"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-1 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Document Content Display Box */}
            <div className="min-h-[480px] max-h-[600px] overflow-y-auto p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/60 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 text-sm leading-relaxed space-y-4 font-sans select-text">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-semibold flex items-center justify-between">
                <span>Page {currentPage} Reading View</span>
                <span>Select any word to explain with Gemini</span>
              </div>

              <div className="whitespace-pre-wrap">
                {activeMaterial.content}
              </div>

              {/* Extracted Concepts Pills */}
              {activeMaterial.concepts && activeMaterial.concepts.length > 0 && (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                  <h5 className="text-xs font-bold uppercase text-slate-400">Key Terms Identified:</h5>
                  <div className="flex flex-wrap gap-2">
                    {activeMaterial.concepts.map((c, idx) => (
                      <button
                        key={idx}
                        id={`term-pill-${idx}-btn`}
                        onClick={() => {
                          setSelectedConcept(c.term);
                          setActiveTab('explain');
                          handleRunExplain();
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-purple-500 text-xs font-semibold text-purple-600 dark:text-purple-400 shadow-sm cursor-pointer"
                      >
                        💡 {c.term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reading Progress Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>Reading Progress</span>
                <span>{activeMaterial.readProgress}% Completed</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={activeMaterial.readProgress}
                onChange={e => updateMaterialProgress(activeMaterial.id, parseInt(e.target.value))}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Panel: Gemini AI Assistant Workspace (5 Columns) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-4">
            
            {/* AI Workspace Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-2xl text-xs font-bold">
              <button
                id="tab-ai-chat-btn"
                onClick={() => setActiveTab('chat')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'chat'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Chat</span>
              </button>
              <button
                id="tab-ai-summary-btn"
                onClick={() => {
                  setActiveTab('summary');
                  if (!activeMaterial.summary) generateSummary(activeMaterial.id);
                }}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'summary'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Summary</span>
              </button>
              <button
                id="tab-ai-explain-btn"
                onClick={() => setActiveTab('explain')}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'explain'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                <span>ELI5</span>
              </button>
              <button
                id="tab-ai-gaps-btn"
                onClick={() => {
                  setActiveTab('gaps');
                  if (!activeMaterial.researchGaps) generateResearchGaps(activeMaterial.id);
                }}
                className={`py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'gaps'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Gaps</span>
              </button>
            </div>

            {/* Tab Content 1: AI Grounded Chat */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                <div className="h-[360px] overflow-y-auto space-y-3 p-2">
                  {chatMessages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed space-y-2 ${
                          msg.sender === 'user'
                            ? 'bg-purple-600 text-white rounded-br-none shadow-md'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/60 dark:border-slate-700/60'
                        }`}
                      >
                        <p>{msg.text}</p>

                        {/* Suggested Prompt Pills */}
                        {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                          <div className="pt-2 border-t border-slate-200/50 dark:border-slate-700/50 space-y-1.5">
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              Suggested follow-ups:
                            </span>
                            <div className="flex flex-col gap-1">
                              {msg.suggestedPrompts.map((prompt, pIdx) => (
                                <button
                                  key={pIdx}
                                  id={`suggested-prompt-${pIdx}-btn`}
                                  onClick={() => handleSendMessage(prompt)}
                                  className="text-left text-xs text-purple-600 dark:text-purple-300 hover:underline cursor-pointer"
                                >
                                  • {prompt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
                    </div>
                  ))}

                  {isAiLoading && (
                    <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500 font-medium">
                      <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                      <span>Gemini AI is analyzing document...</span>
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ask StudyMate AI about this note..."
                    value={inputPrompt}
                    onChange={e => setInputPrompt(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                  <button
                    id="send-chat-msg-btn"
                    type="submit"
                    disabled={isAiLoading || !inputPrompt.trim()}
                    className="p-2.5 rounded-2xl bg-purple-600 hover:bg-purple-700 disabled:opacity-40 text-white transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Tab Content 2: Summary & Key Takeaways */}
            {activeTab === 'summary' && (
              <div className="space-y-4 max-h-[420px] overflow-y-auto p-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                    Executive Summary
                  </span>
                  <button
                    id="regenerate-summary-btn"
                    onClick={() => generateSummary(activeMaterial.id)}
                    className="text-xs text-slate-400 hover:text-purple-600 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed p-4 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20">
                  {activeMaterial.summary || 'Click regenerate to trigger Gemini AI summary.'}
                </p>

                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase text-slate-400">Key Points & Takeaways:</h5>
                  <ul className="space-y-2">
                    {(activeMaterial.keyPoints || [
                      'Activation functions introduce required mathematical non-linearity.',
                      'Backpropagation computes loss gradients via chain rule.',
                      'Adam optimizer leverages momentum and adaptive learning rates.'
                    ]).map((pt, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Tab Content 3: ELI5 & Concept Explainer */}
            {activeTab === 'explain' && (
              <div className="space-y-4 max-h-[420px] overflow-y-auto p-1">
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase text-slate-400">
                    Concept / Term to Explain
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Backpropagation, Chemiosmosis, Quantum Superposition"
                    value={selectedConcept}
                    onChange={e => setSelectedConcept(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  />
                </div>

                {/* Explanation Mode */}
                <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
                  <button
                    id="mode-eli5-btn"
                    onClick={() => setExplainMode('eli5')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      explainMode === 'eli5'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-600 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    👶 ELI5 (5 yr old)
                  </button>
                  <button
                    id="mode-analogy-btn"
                    onClick={() => setExplainMode('analogy')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      explainMode === 'analogy'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-600 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    🎨 Real Analogy
                  </button>
                  <button
                    id="mode-academic-btn"
                    onClick={() => setExplainMode('academic')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      explainMode === 'academic'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-600 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    🎓 University Deep
                  </button>
                  <button
                    id="mode-step-btn"
                    onClick={() => setExplainMode('step_by_step')}
                    className={`py-1.5 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      explainMode === 'step_by_step'
                        ? 'border-purple-500 bg-purple-500/10 text-purple-600 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500'
                    }`}
                  >
                    🔢 Step-by-Step
                  </button>
                </div>

                <button
                  id="explain-concept-action-btn"
                  onClick={handleRunExplain}
                  disabled={isAiLoading || !selectedConcept.trim()}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                  <span>Explain Concept with Gemini</span>
                </button>

                {explainResult && (
                  <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-3">
                    <h5 className="font-bold text-xs uppercase text-indigo-600 dark:text-indigo-400">
                      Breakdown for "{explainResult.term}"
                    </h5>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                      {explainResult.explanation}
                    </p>
                    {explainResult.analogy && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200 font-medium">
                        💡 <strong>Analogy:</strong> {explainResult.analogy}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Tab Content 4: Research Gaps & Future Work */}
            {activeTab === 'gaps' && (
              <div className="space-y-4 max-h-[420px] overflow-y-auto p-1">
                <span className="text-xs font-bold uppercase text-purple-600 dark:text-purple-400 tracking-wider">
                  Critical Research Gaps & Future Work
                </span>

                <div className="space-y-3">
                  {(activeMaterial.researchGaps || [
                    'Interpretability of high-dimensional attention weights remains unresolved.',
                    'High computational memory footprint during long-context KV caching.',
                    'Catastrophic forgetting during continual domain fine-tuning.'
                  ]).map((gap, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Research Limit #{i + 1}</span>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300">{gap}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
