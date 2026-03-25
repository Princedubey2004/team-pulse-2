import React, { useState, useEffect } from 'react';
import { FilterProvider } from './context/FilterContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './components/Toast/ToastContainer';
import { Header } from './components/Header/Header';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { ActivityPage } from './pages/ActivityPage';
import { SearchOverlay } from './components/Search/SearchOverlay';
import './App.css';

type Page = 'dashboard' | 'activity';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <ThemeProvider>
      <FilterProvider>
        <ToastProvider>
          <div className="app-layout">
            <Header onNavigate={(page) => setCurrentPage(page as Page)} />
            <div className="app-body">
              <Sidebar
                currentPage={currentPage}
                onNavigate={setCurrentPage}
                onOpenSearch={() => setSearchOpen(true)}
              />
              <main className="main-content">
                <div className="dashboard-content">
                  {currentPage === 'dashboard' && <Dashboard />}
                  {currentPage === 'activity' && <ActivityPage />}
                </div>
              </main>
            </div>
            <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
          </div>
        </ToastProvider>
      </FilterProvider>
    </ThemeProvider>
  );
};

export default App;
