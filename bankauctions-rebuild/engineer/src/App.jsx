import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';
import EngineerNavbar from './components/EngineerNavbar';
import EngineerLoginPage from './pages/EngineerLoginPage';
import ScrollToTop from './components/ScrollToTop';

import { EngineerDashboardPage } from './pages/EngineerDashboardPage';
import { MyAssignmentsPage } from './pages/MyAssignmentsPage';
import { InspectionFormPage } from './pages/InspectionFormPage';
import { InspectionHistoryPage } from './pages/InspectionHistoryPage';
import RequestsPage from './pages/RequestsPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ba_engineer_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.getMe()
      .then((res) => {
        if (res.success && res.user && res.user.role === 'ENGINEER') {
          setUser(res.user);
        } else {
          localStorage.removeItem('ba_engineer_token');
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('ba_engineer_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ba_engineer_token');
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
    return <EngineerLoginPage onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-brand-obsidian text-slate-100 flex flex-col">
      <ScrollToTop />
      <EngineerNavbar user={user} onLogout={handleLogout} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<EngineerDashboardPage />} />
          <Route path="/assignments" element={<MyAssignmentsPage />} />
          <Route path="/inspect/:id" element={<InspectionFormPage />} />
          <Route path="/history" element={<InspectionHistoryPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/requests/:id" element={<RequestsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
