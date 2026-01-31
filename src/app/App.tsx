import { useState, useEffect } from 'react';
import { Toaster } from '@/app/components/ui/sonner';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import ModernLanding from '@/app/components/ModernLanding';
import CitizenPortal from '@/app/components/CitizenPortal';
import CollaboratorPortal from '@/app/components/CollaboratorPortal';
import AuthorityLogin from '@/app/components/AuthorityLogin';
import AuthorityDashboard from '@/app/components/AuthorityDashboard';
import NGOLogin from '@/app/components/NGOLogin';
import NGOPortal from '@/app/components/NGOPortal';
import { getIssues, saveIssues, getCurrentUser, getNGOs, saveNGOs } from '@/utils/storage';
import { generateMockIssues, mockNGOs } from '@/utils/mockData';

type View = 'landing' | 'user' | 'collaborator' | 'authority-login' | 'authority-dashboard' | 'ngo-login' | 'ngo-portal';

function AppContent() {
  const [view, setView] = useState<View>('landing');
  const [ngoData, setNGOData] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    // Set document title
    document.title = 'JANMARG : One stop solution to all civic issues';
    
    // Initialize with mock data if no data exists
    const existingIssues = getIssues();
    if (existingIssues.length === 0) {
      const mockIssues = generateMockIssues();
      saveIssues(mockIssues);
    }

    // Initialize NGOs if not present
    const existingNGOs = getNGOs();
    if (existingNGOs.length === 0) {
      saveNGOs(mockNGOs);
    }

    // Check if user is already logged in
    const currentUser = getCurrentUser();
    if (currentUser) {
      if (currentUser.role === 'authority') {
        setView('authority-dashboard');
      } else if (currentUser.role === 'collaborator') {
        setView('collaborator');
      } else if (currentUser.role === 'citizen') {
        setView('user');
      } else if (currentUser.role === 'ngo') {
        setNGOData({ id: currentUser.id, name: currentUser.name });
        setView('ngo-portal');
      }
    }
  }, []);

  const handleSelectPortal = (portal: 'user' | 'collaborator' | 'authority' | 'ngo') => {
    if (portal === 'authority') {
      setView('authority-login');
    } else if (portal === 'ngo') {
      setView('ngo-login');
    } else {
      setView(portal);
    }
  };

  const handleAuthorityLoginSuccess = () => {
    setView('authority-dashboard');
  };

  const handleNGOLoginSuccess = (ngoId: string, ngoName: string) => {
    setNGOData({ id: ngoId, name: ngoName });
    setView('ngo-portal');
  };

  const handleBackToHome = () => {
    setView('landing');
  };

  const handleLogout = () => {
    setView('landing');
  };

  return (
    <>
      {view === 'landing' && (
        <ModernLanding onSelectPortal={handleSelectPortal} />
      )}

      {view === 'user' && (
        <CitizenPortal onBackToHome={handleBackToHome} />
      )}

      {view === 'collaborator' && (
        <CollaboratorPortal onBackToHome={handleBackToHome} />
      )}

      {view === 'authority-login' && (
        <AuthorityLogin 
          onLoginSuccess={handleAuthorityLoginSuccess}
          onBack={handleBackToHome}
        />
      )}

      {view === 'authority-dashboard' && (
        <AuthorityDashboard onLogout={handleLogout} />
      )}

      {view === 'ngo-login' && (
        <NGOLogin 
          onLoginSuccess={handleNGOLoginSuccess}
          onBack={handleBackToHome}
        />
      )}

      {view === 'ngo-portal' && ngoData && (
        <NGOPortal 
          ngoId={ngoData.id}
          ngoName={ngoData.name}
          onLogout={handleLogout}
        />
      )}

      <Toaster position="top-right" />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}