import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  ShieldAlert, LayoutDashboard, Database, UploadCloud, 
  CheckSquare, Users, UserCheck, HardHat, BarChart3, 
  ScrollText, Sliders, LogOut, ArrowLeft 
} from 'lucide-react';

export function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navSections = [
    {
      title: 'Operations & Pipeline',
      items: [
        { name: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard },
        { name: 'Auction Inventory', path: '/admin/auctions', icon: Database },
        { name: 'Import Ingestion Pipeline', path: '/admin/imports', icon: UploadCloud },
        { name: 'Inspection Approvals', path: '/admin/inspections', icon: CheckSquare },
      ]
    },
    {
      title: 'User & Staff Directory',
      items: [
        { name: 'Buyer Investors', path: '/admin/buyers', icon: Users },
        { name: 'Internal Staff Accounts', path: '/admin/staff', icon: Users },
        { name: 'Checker Workloads', path: '/admin/checkers', icon: UserCheck },
        { name: 'Field Engineer Fleet', path: '/admin/engineers', icon: HardHat },
      ]
    },
    {
      title: 'Telemetry & Platform Governance',
      items: [
        { name: 'Analytics & Intelligence', path: '/admin/analytics', icon: BarChart3 },
        { name: 'Tamper-Evident Audit Log', path: '/admin/audit-logs', icon: ScrollText },
        { name: 'System Settings & Policies', path: '/admin/settings', icon: Sliders },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-brand-obsidian text-slate-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-slate-800/80 bg-slate-950/90 backdrop-blur-2xl flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        {/* Brand */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-400 flex items-center justify-center font-bold">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-white tracking-tight block">
                BankAuctions<span className="text-purple-400">.ai</span>
              </span>
              <span className="text-[10px] font-mono uppercase text-slate-400 tracking-wider">
                Admin Console
              </span>
            </div>
          </div>

          <Link to="/" className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Public Discovery">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Section Links */}
        <div className="flex-1 p-4 space-y-6">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 font-semibold">
                {sec.title}
              </span>
              <div className="space-y-0.5 pt-1">
                {sec.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-white">{user?.name || 'Admin'}</div>
            <div className="text-[10px] font-mono text-purple-400">SUPER_ADMIN</div>
          </div>
          <button
            onClick={() => logout()}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
