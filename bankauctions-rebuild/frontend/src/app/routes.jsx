import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import BuyerLayout from '../layouts/BuyerLayout';
import CheckerLayout from '../layouts/CheckerLayout';
import EngineerLayout from '../layouts/EngineerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Buyer Pages
import HomePage from '../panels/buyer/pages/HomePage';
import SearchPage from '../panels/buyer/pages/SearchPage';
import CategoryPage from '../panels/buyer/pages/CategoryPage';
import PropertyDetailsPage from '../panels/buyer/pages/PropertyDetailsPage';
import SavedPropertiesPage from '../panels/buyer/pages/SavedPropertiesPage';
import BuyerDashboardPage from '../panels/buyer/pages/BuyerDashboardPage';
import PreferencesPage from '../panels/buyer/pages/PreferencesPage';
import PricingPage from '../panels/buyer/pages/PricingPage';
import LegalPage from '../panels/buyer/pages/LegalPage';
import AiRankGuidePage from '../panels/buyer/pages/AiRankGuidePage';
import GuidesPage from '../panels/buyer/pages/GuidesPage';
import LoginPage from '../panels/buyer/pages/LoginPage';
import RegisterPage from '../panels/buyer/pages/RegisterPage';

// Checker Pages
import CheckerDashboardPage from '../panels/checker/pages/CheckerDashboardPage';
import VerificationQueuePage from '../panels/checker/pages/VerificationQueuePage';
import SourceComparisonPage from '../panels/checker/pages/SourceComparisonPage';
import VerificationHistoryPage from '../panels/checker/pages/VerificationHistoryPage';

// Engineer Pages
import EngineerDashboardPage from '../panels/engineer/pages/EngineerDashboardPage';
import MyAssignmentsPage from '../panels/engineer/pages/MyAssignmentsPage';
import InspectionFormPage from '../panels/engineer/pages/InspectionFormPage';
import InspectionHistoryPage from '../panels/engineer/pages/InspectionHistoryPage';

// Admin Pages
import AdminDashboardPage from '../panels/admin/pages/AdminDashboardPage';
import AuctionManagementPage from '../panels/admin/pages/AuctionManagementPage';
import ImportManagementPage from '../panels/admin/pages/ImportManagementPage';
import InspectionApprovalsPage from '../panels/admin/pages/InspectionApprovalsPage';
import BuyerManagementPage from '../panels/admin/pages/BuyerManagementPage';
import StaffManagementPage from '../panels/admin/pages/StaffManagementPage';
import CheckerManagementPage from '../panels/admin/pages/CheckerManagementPage';
import EngineerManagementPage from '../panels/admin/pages/EngineerManagementPage';
import AnalyticsPage from '../panels/admin/pages/AnalyticsPage';
import AuditLogsPage from '../panels/admin/pages/AuditLogsPage';
import SettingsPage from '../panels/admin/pages/SettingsPage';

// Role Guard Component
function RequireAuth({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-obsidian flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-accent-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-mono text-sm">Authenticating security session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective authorized home
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'CHECKER') return <Navigate to="/checker" replace />;
    if (user.role === 'ENGINEER') return <Navigate to="/engineer" replace />;
    return <Navigate to="/buyer/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Discovery & Buyer Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/lot/:id" element={<PropertyDetailsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/talk-to-a-lawyer" element={<LegalPage />} />
        <Route path="/ai-rank" element={<AiRankGuidePage />} />
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* 2. Authenticated Buyer Workspace */}
      <Route 
        path="/buyer" 
        element={
          <RequireAuth allowedRoles={['BUYER', 'ADMIN']}>
            <BuyerLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/buyer/dashboard" replace />} />
        <Route path="dashboard" element={<BuyerDashboardPage />} />
        <Route path="saved" element={<SavedPropertiesPage />} />
        <Route path="preferences" element={<PreferencesPage />} />
      </Route>

      {/* 3. Checker Operational Workspace */}
      <Route 
        path="/checker" 
        element={
          <RequireAuth allowedRoles={['CHECKER', 'ADMIN']}>
            <CheckerLayout />
          </RequireAuth>
        }
      >
        <Route index element={<CheckerDashboardPage />} />
        <Route path="queue" element={<VerificationQueuePage />} />
        <Route path="verify/:id" element={<SourceComparisonPage />} />
        <Route path="history" element={<VerificationHistoryPage />} />
      </Route>

      {/* 4. Engineer On-Site Inspection Workspace */}
      <Route 
        path="/engineer" 
        element={
          <RequireAuth allowedRoles={['ENGINEER', 'ADMIN']}>
            <EngineerLayout />
          </RequireAuth>
        }
      >
        <Route index element={<EngineerDashboardPage />} />
        <Route path="assignments" element={<MyAssignmentsPage />} />
        <Route path="inspect/:id" element={<InspectionFormPage />} />
        <Route path="history" element={<InspectionHistoryPage />} />
      </Route>

      {/* 5. Central Administrator Workspace */}
      <Route 
        path="/admin" 
        element={
          <RequireAuth allowedRoles={['ADMIN']}>
            <AdminLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="auctions" element={<AuctionManagementPage />} />
        <Route path="imports" element={<ImportManagementPage />} />
        <Route path="inspections" element={<InspectionApprovalsPage />} />
        <Route path="buyers" element={<BuyerManagementPage />} />
        <Route path="staff" element={<StaffManagementPage />} />
        <Route path="checkers" element={<CheckerManagementPage />} />
        <Route path="engineers" element={<EngineerManagementPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="audit-logs" element={<AuditLogsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
