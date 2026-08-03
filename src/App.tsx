import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { DocumentWorkspace } from './components/DocumentWorkspace';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { PlannerView } from './components/PlannerView';
import { ProgressView } from './components/ProgressView';
import { SettingsView } from './components/SettingsView';
import { UploadModal } from './components/UploadModal';
import { AuthModal } from './components/AuthModal';

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { viewMode } = useStudy();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // If view is explicitly landing, show landing page layout
  if (viewMode === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
        <Header
          onOpenUpload={() => setIsUploadOpen(true)}
          onOpenAuth={() => setIsAuthOpen(true)}
        />
        <LandingPage onOpenAuth={() => setIsAuthOpen(true)} />
        <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors">
      <Header
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <div className="flex max-w-7xl mx-auto min-h-[calc(100vh-4rem)]">
        <Sidebar onOpenUpload={() => setIsUploadOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8">
          {viewMode === 'dashboard' && (
            <DashboardView onOpenUpload={() => setIsUploadOpen(true)} />
          )}
          {viewMode === 'workspace' && <DocumentWorkspace />}
          {viewMode === 'flashcards' && <FlashcardsView />}
          {viewMode === 'quizzes' && <QuizView />}
          {viewMode === 'planner' && <PlannerView />}
          {viewMode === 'progress' && <ProgressView />}
          {viewMode === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Modals */}
      <UploadModal isOpen={isUploadOpen} onClose={() => setIsUploadOpen(false)} />
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyProvider>
          <AppContent />
        </StudyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
