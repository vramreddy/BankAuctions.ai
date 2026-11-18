import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { api } from './services/api';
import AdminNavbar from './components/AdminNavbar';
import ScrollToTop from './components/ScrollToTop';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AuctionManagementPage from './pages/AuctionManagementPage';
import ImportManagementPage from './pages/ImportManagementPage';
import InspectionApprovalsPage from './pages/InspectionApprovalsPage';
import StaffManagementPage from './pages/StaffManagementPage';
import BuyerManagementPage from './pages/BuyerManagementPage';
import CheckerManagementPage from './pages/CheckerManagementPage';
import EngineerManagementPage from './pages/EngineerManagementPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ba_admin_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api.getMe()
      .then((res) => {
        if (res.success && res.user && res.user.role === 'ADMIN') {
          setUser(res.user);
        } else {
          localStorage.removeItem('ba_admin_token');
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('ba_admin_token');
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ba_admin_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-obsidian flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <AdminLoginPage onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-brand-obsidian text-slate-100 flex flex-col">
      <ScrollToTop />
      <AdminNavbar user={user} onLogout={handleLogout} />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<AdminDashboardPage />} />
          <Route path="/auctions" element={<AuctionManagementPage />} />
          <Route path="/imports" element={<ImportManagementPage />} />
          <Route path="/inspections" element={<InspectionApprovalsPage />} />
          <Route path="/staff" element={<StaffManagementPage />} />
          <Route path="/buyers" element={<BuyerManagementPage />} />
          <Route path="/checkers" element={<CheckerManagementPage />} />
          <Route path="/engineers" element={<EngineerManagementPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/audit-logs" element={<AuditLogsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
