import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';
import AdvocateNavbar from './components/AdvocateNavbar';
import AdvocateLoginPage from './pages/AdvocateLoginPage';
import ScrollToTop from './components/ScrollToTop';
import AdvocateDashboardPage from './pages/AdvocateDashboardPage';
import Sarfaesi12BPage from './pages/Sarfaesi12BPage';
import TitleScrutinyPage from './pages/TitleScrutinyPage';
import LegalOpinionsPage from './pages/LegalOpinionsPage';
import AdvocateRequestsPage from './pages/AdvocateRequestsPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ba_advocate_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.getMe()
      .then((res) => {
        if (res.success && res.user && res.user.role === 'ADVOCATE') {
          setUser(res.user);
        } else {
          localStorage.removeItem('ba_advocate_token');
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('ba_advocate_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ba_advocate_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-obsidian flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AdvocateLoginPage onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-brand-obsidian text-slate-100 flex flex-col">
      <ScrollToTop />
      <AdvocateNavbar user={user} onLogout={handleLogout} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<AdvocateDashboardPage />} />
          <Route path="/sarfaesi-12b" element={<Sarfaesi12BPage />} />
          <Route path="/title-scrutiny" element={<TitleScrutinyPage />} />
          <Route path="/legal-opinions" element={<LegalOpinionsPage />} />
          <Route path="/buyer-requests" element={<AdvocateRequestsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
