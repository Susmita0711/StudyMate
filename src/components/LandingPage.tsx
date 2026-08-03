import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useStudy } from '../context/StudyContext';
import {
  Sparkles,
  ArrowRight,
  Brain,
  FileText,
  Layers,
  HelpCircle,
  Clock,
  CheckCircle2,
  Zap,
  GraduationCap,
  BookOpen,
  MessageSquare,
  ShieldCheck,
  Star
} from 'lucide-react';

interface LandingPageProps {
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenAuth }) => {
  const { loginAsDemo } = useAuth();
  const { setViewMode } = useStudy();

  const handleStartDemo = () => {
    loginAsDemo();
    setViewMode('dashboard');
  };

  const features = [
    {
      icon: <FileText className="w-6 h-6 text-purple-600 dark:text-purple-400" />,
      title: 'Smart PDF & Notes Parsing',
      desc: 'Upload PDFs, DOCX, PPTX, or lecture notes. Extract key concepts, formulas, and structural takeaways in seconds.'
    },
    {
      icon: <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      title: 'ELI5 & Analogy Explainer',
      desc: 'Stuck on complex quantum mechanics or biochemistry? Get instant ELI5 (Explain Like I\'m 5) breakdowns and real-world analogies.'
    },
    {
      icon: <Layers className="w-6 h-6 text-violet-600 dark:text-violet-400" />,
      title: '1-Click Flashcard Generator',
      desc: 'Transform dense textbook chapters into active-recall flashcard decks with Leitner box spaced repetition tracking.'
    },
    {
      icon: <HelpCircle className="w-6 h-6 text-amber-500" />,
      title: 'Interactive MCQ Quizzes',
      desc: 'Generate tailored practice exam questions with detailed answer explanations and immediate score diagnostics.'
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-emerald-500" />,
      title: 'Grounded AI Document Chat',
      desc: 'Chat directly with your notes. Ask specific questions and receive answers grounded in your uploaded materials with citations.'
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: 'Study Planner & Pomodoro',
      desc: 'Organize study tasks by exam priority, track daily study streaks, and boost focus with built-in Pomodoro timers.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-purple-500 selection:text-white">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Background Decorative Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/20 via-indigo-500/20 to-amber-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs sm:text-sm font-semibold shadow-sm animate-fade-in">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Powered by Google Gemini 3.6 Flash</span>
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1.15]">
            Master Any Subject <br />
            <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 bg-clip-text text-transparent">
              10x Faster with AI
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Upload PDFs, lecture slides, and research papers. StudyMate AI generates instant summaries, flashcards, MCQ quizzes, ELI5 explanations, and smart study plans.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="landing-hero-demo-btn"
              onClick={handleStartDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-base shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Demo Account</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              id="landing-hero-signin-btn"
              onClick={onOpenAuth}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold text-base shadow-sm transition-all cursor-pointer"
            >
              Sign In / Register
            </button>
          </div>

          {/* Trust Metrics */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>PDF, DOCX, PPTX & TXT Supported</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Instant AI MCQ Quiz Generation</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Built-in Spaced Repetition Flashcards</span>
            </div>
          </div>

          {/* Visual Showcase Card Preview */}
          <div className="pt-10 max-w-5xl mx-auto">
            <div className="p-4 sm:p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 text-left">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-bold text-slate-400">StudyMate Workspace Preview</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold">
                    Neural Networks & Deep Learning.pdf
                  </span>
                </div>
              </div>

              {/* Sample AI Workspace Panel Mock */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-purple-500/5 dark:bg-purple-500/10 border border-purple-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4" />
                    <span>AI Executive Summary</span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Backpropagation applies the calculus chain rule to compute gradients of loss functions with respect to neural weights, adjusting learning rate optimizing parameters.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider">
                    <Layers className="w-4 h-4" />
                    <span>Active Recall Flashcard</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    Q: What is the main advantage of Activation Functions?
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                    A: Introduces non-linear boundaries into network models.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    <span>Generated Practice MCQ</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    Which optimizer combines Momentum and RMSProp?
                  </p>
                  <div className="px-2 py-1 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-bold">
                    ✓ Adam Optimizer
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="py-20 bg-white dark:bg-slate-900 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Everything You Need to Ace Your Exams
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg">
              Designed for university students, researchers, and lifelong learners seeking effortless comprehension and active recall.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feat, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 hover:border-purple-500/50 transition-all hover:shadow-xl space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{feat.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial / University Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 text-center">
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400" />
              ))}
            </div>
            <h3 className="text-2xl font-bold">Loved by Students Worldwide</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                "StudyMate AI converted my 80-page biology syllabus into flashcards and practice quizzes in under 2 minutes. I scored an A on my finals!"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center text-sm">
                  SJ
                </div>
                <div>
                  <h4 className="text-sm font-bold">Sarah Jenkins</h4>
                  <p className="text-xs text-slate-400">Pre-Med Student</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                "The ELI5 concept explainer is legendary. Complex quantum physics equations make immediate intuitive sense now."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center text-sm">
                  MC
                </div>
                <div>
                  <h4 className="text-sm font-bold">Marcus Chen</h4>
                  <p className="text-xs text-slate-400">Engineering Major</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-300 italic">
                "Having research gaps identified automatically helped me write an outstanding literature review for my thesis."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500 text-white font-bold flex items-center justify-center text-sm">
                  EL
                </div>
                <div>
                  <h4 className="text-sm font-bold">Elena Rostova</h4>
                  <p className="text-xs text-slate-400">Computer Science Masters</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <div className="flex items-center justify-center gap-2 text-purple-600 font-bold">
            <Brain className="w-5 h-5" />
            <span>StudyMate AI</span>
          </div>
          <p>© 2026 StudyMate AI. Built with Google Gemini 3.6 Flash & React.</p>
        </div>
      </footer>
    </div>
  );
};
