import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import BuyerLayout from '../layouts/BuyerLayout';
import CheckerLayout from '../layouts/CheckerLayout';
import EngineerLayout from '../layouts/EngineerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Buyer & Public Pages
import HomePage from '../panels/buyer/pages/HomePage';
import SearchPage from '../panels/buyer/pages/SearchPage';
import CategoryPage from '../panels/buyer/pages/CategoryPage';
import PropertyDetailsPage from '../panels/buyer/pages/PropertyDetailsPage';
import SavedPropertiesPage from '../panels/buyer/pages/SavedPropertiesPage';
import BuyerDashboardPage from '../panels/buyer/pages/BuyerDashboardPage';
import PreferencesPage from '../panels/buyer/pages/PreferencesPage';
import PricingPage from '../panels/buyer/pages/PricingPage';
import LegalPage from '../panels/buyer/pages/LegalPage';
import PremiumPage from '../panels/buyer/pages/PremiumPage';
import DataIntelligencePage from '../panels/buyer/pages/DataIntelligencePage';
import LearnPage from '../panels/buyer/pages/LearnPage';
import ConciergePage from '../panels/buyer/pages/ConciergePage';
import NriServicesPage from '../panels/buyer/pages/NriServicesPage';
import PropertyManagementPage from '../panels/buyer/pages/PropertyManagementPage';
import AccountPage from '../panels/buyer/pages/AccountPage';
import ArchivePage from '../panels/buyer/pages/ArchivePage';
import FaqPage from '../panels/buyer/pages/FaqPage';
import SupportPage from '../panels/buyer/pages/SupportPage';
import CareersPage from '../panels/buyer/pages/CareersPage';
import ContactPage from '../panels/buyer/pages/ContactPage';
import StaffLoginPage from '../panels/buyer/pages/StaffLoginPage';
import LeadershipDashboardPage from '../panels/buyer/pages/LeadershipDashboardPage';
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
import NoticeQueuePage from '../panels/workflow/NoticeQueuePage';
import NoticeReviewPage from '../panels/workflow/NoticeReviewPage';
import CheckerOverviewPage from '../panels/workflow/CheckerOverviewPage';
import RequestsPage from '../panels/workflow/RequestsPage';
import RecommendationsPage from '../panels/workflow/RecommendationsPage';
import FieldReviewsPage from '../panels/workflow/FieldReviewsPage';
import NewNoticePage from '../panels/workflow/NewNoticePage';
import BuyerContentPage from '../panels/workflow/BuyerContentPage';
import BuyerActivityPage from '../panels/workflow/BuyerActivityPage';
import CatalogManagementPage from '../panels/workflow/CatalogManagementPage';
import PropertyPurchasePage from '../panels/buyer/pages/PropertyPurchasePage';
import InformationPage from '../panels/buyer/pages/InformationPage';
import MarketingLayout from '../layouts/MarketingLayout';

// Role Guard Component
function RequireAuth({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050814] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400 font-mono text-sm">Authenticating security session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/${(allowedRoles?.[0] || 'BUYER').toLowerCase()}/login`} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    if (user.role === 'ADMIN') return <Navigate to="/admin" replace />;
    if (user.role === 'CHECKER') return <Navigate to="/checker" replace />;
    if (user.role === 'ENGINEER') return <Navigate to="/engineer" replace />;
    if (user.role === 'MARKETING') return <Navigate to="/marketing" replace />;
    return <Navigate to="/buyer/dashboard" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Discovery & Buyer Routes - Matching Sajith Prototype Overview */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/premium" element={<PremiumPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/data" element={<DataIntelligencePage />} />
        <Route path="/ai-rank" element={<DataIntelligencePage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/guides" element={<LearnPage />} />
        <Route path="/concierge" element={<ConciergePage />} />
        <Route path="/nri-services" element={<NriServicesPage />} />
        <Route path="/property-management" element={<PropertyManagementPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="/lawyers" element={<LegalPage />} />
        <Route path="/talk-to-a-lawyer" element={<LegalPage />} />

        {/* 7 Dedicated Category Pages */}
        <Route path="/flats" element={<CategoryPage explicitCat="flats" />} />
        <Route path="/houses" element={<CategoryPage explicitCat="houses" />} />
        <Route path="/plots" element={<CategoryPage explicitCat="plots" />} />
        <Route path="/shops" element={<CategoryPage explicitCat="shops" />} />
        <Route path="/offices" element={<CategoryPage explicitCat="offices" />} />
        <Route path="/warehouses" element={<CategoryPage explicitCat="warehouses" />} />
        <Route path="/vehicles" element={<CategoryPage explicitCat="vehicles" />} />
        <Route path="/category/:slug" element={<CategoryPage />} />

        {/* Property Dossier Details */}
        <Route path="/lot/:id" element={<PropertyDetailsPage />} />
        <Route path="/property/:id" element={<PropertyDetailsPage />} />

        {/* Customer Account & Resources */}
        <Route path="/account" element={<AccountPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/support" element={<SupportPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Staff & Authentication */}
        <Route path="/staff" element={<StaffLoginPage />} />
        <Route path="/leadership" element={<LeadershipDashboardPage />} />
        <Route path="/login" element={<LoginPage />} />
        {['BUYER','CHECKER','ADMIN','ENGINEER','MARKETING'].map(role => (
          <Route key={role} path={`/${role.toLowerCase()}/login`} element={<LoginPage portal={role} />} />
        ))}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/information/:slug" element={<InformationPage />} />
      </Route>

      {/* 2. Authenticated Buyer Workspace */}
      <Route 
        path="/buyer" 
        element={
          <RequireAuth allowedRoles={['BUYER']}>
            <BuyerLayout />
          </RequireAuth>
        }
      >
        <Route index element={<Navigate to="/account" replace />} />
        <Route path="dashboard" element={<BuyerDashboardPage />} />
        <Route path="saved" element={<SavedPropertiesPage />} />
        <Route path="preferences" element={<PreferencesPage />} />
        <Route path="purchase/:id" element={<PropertyPurchasePage />} />
        <Route path="purchases" element={<ArchivePage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="requests/:id" element={<RequestsPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
      </Route>

      {/* 3. Checker Operational Workspace */}
      <Route 
        path="/checker" 
        element={
          <RequireAuth allowedRoles={['CHECKER']}>
            <CheckerLayout />
          </RequireAuth>
        }
      >
        <Route index element={<CheckerOverviewPage />} />
        <Route path="catalog" element={<CatalogManagementPage />} />
        <Route path="content" element={<BuyerContentPage />} />
        <Route path="buyers" element={<BuyerActivityPage />} />
        <Route path="buyers/:id" element={<BuyerActivityPage />} />
        <Route path="queue" element={<NoticeQueuePage />} />
        <Route path="new-asset" element={<NewNoticePage />} />
        <Route path="verify/:id" element={<NoticeReviewPage />} />
        <Route path="requests" element={<RequestsPage />} />
        <Route path="requests/:id" element={<RequestsPage />} />
        <Route path="recommendations" element={<RecommendationsPage />} />
        <Route path="inspections" element={<FieldReviewsPage />} />
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
        <Route path="requests" element={<RequestsPage />} />
        <Route path="requests/:id" element={<RequestsPage />} />
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

      {/* 6. Marketing Workspace */}
      <Route path="/marketing" element={<RequireAuth allowedRoles={['MARKETING','ADMIN']}><MarketingLayout /></RequireAuth>}>
        <Route index element={<RecommendationsPage />} />
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
