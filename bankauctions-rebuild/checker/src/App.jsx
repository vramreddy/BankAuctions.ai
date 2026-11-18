import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';
import CheckerNavbar from './components/CheckerNavbar';
import CheckerLoginPage from './pages/CheckerLoginPage';
import ScrollToTop from './components/ScrollToTop';

import CheckerOverviewPage from './pages/CheckerOverviewPage';
import CatalogManagementPage from './pages/CatalogManagementPage';
import BuyerContentPage from './pages/BuyerContentPage';
import BuyerActivityPage from './pages/BuyerActivityPage';
import NoticeQueuePage from './pages/NoticeQueuePage';
import NewNoticePage from './pages/NewNoticePage';
import NoticeReviewPage from './pages/NoticeReviewPage';
import RequestsPage from './pages/RequestsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import FieldReviewsPage from './pages/FieldReviewsPage';
import VerificationHistoryPage from './pages/VerificationHistoryPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ba_checker_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.getMe()
      .then((res) => {
        if (res.success && res.user && res.user.role === 'CHECKER') {
          setUser(res.user);
        } else {
          localStorage.removeItem('ba_checker_token');
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('ba_checker_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ba_checker_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-obsidian flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <CheckerLoginPage onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-brand-obsidian text-slate-100 flex flex-col">
      <ScrollToTop />
      <CheckerNavbar user={user} onLogout={handleLogout} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<CheckerOverviewPage />} />
          <Route path="/queue" element={<NoticeQueuePage />} />
          <Route path="/new-asset" element={<NewNoticePage />} />
          <Route path="/verify/:id" element={<NoticeReviewPage />} />
          <Route path="/catalog" element={<CatalogManagementPage />} />
          <Route path="/content" element={<BuyerContentPage />} />
          <Route path="/buyers" element={<BuyerActivityPage />} />
          <Route path="/buyers/:id" element={<BuyerActivityPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/requests/:id" element={<RequestsPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/inspections" element={<FieldReviewsPage />} />
          <Route path="/history" element={<VerificationHistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
