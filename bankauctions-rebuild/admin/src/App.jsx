import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminNavbar from './components/AdminNavbar';
import ScrollToTop from './components/ScrollToTop';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ba3_staff');
      if (stored) {
        return JSON.parse(stored);
      }
      const token = localStorage.getItem('ba_admin_token');
      if (token) {
        return { name: 'Rahul D.', email: 'rahul.d@bankauctions.ai', role: 'ADMIN' };
      }
    } catch (_) {}
    return { name: 'Rahul D.', email: 'rahul.d@bankauctions.ai', role: 'ADMIN' };
  });

  const handleLogout = () => {
    localStorage.removeItem('ba_admin_token');
    localStorage.removeItem('ba3_staff');
    setUser(null);
  };

  if (!user) {
    return <AdminLoginPage onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-white text-[var(--ink)] flex flex-col">
      <ScrollToTop />
      <AdminNavbar user={user} onLogout={handleLogout} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<AdminDashboardPage />} />
          <Route path="/overview" element={<AdminDashboardPage />} />
          <Route path="/customers" element={<AdminDashboardPage />} />
          <Route path="/staff" element={<AdminDashboardPage />} />
          <Route path="/field" element={<AdminDashboardPage />} />
          <Route path="/listings" element={<AdminDashboardPage />} />
          <Route path="/advocates" element={<AdminDashboardPage />} />
          <Route path="/payments" element={<AdminDashboardPage />} />
          <Route path="/audit" element={<AdminDashboardPage />} />
          <Route path="/settings" element={<AdminDashboardPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
