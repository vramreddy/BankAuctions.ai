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
    <div className="flex min-h-screen bg-brand-obsidian text-slate-100 selection:bg-purple-500/30 selection:text-purple-300">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/[0.08] bg-slate-950/80 backdrop-blur-2xl flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto shadow-2xl">
        {/* Brand */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-600/30 border-t border-white/30">
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

          <Link
            to="/"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Public Discovery"
          >
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
              <div className="space-y-1 pt-1.5">
                {sec.items.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 relative group ${
                        isActive
                          ? 'bg-gradient-to-r from-purple-600/25 via-indigo-600/15 to-transparent text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                          : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-purple-400 to-indigo-500 rounded-r-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                      )}
                      <item.icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-purple-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-slate-950/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center font-bold text-xs text-purple-300 font-mono">
              {user?.fullName ? user.fullName[0].toUpperCase() : 'A'}
            </div>
            <div className="truncate">
              <div className="text-xs font-bold text-white truncate">{user?.fullName || 'Administrator'}</div>
              <div className="text-[10px] text-purple-400 font-mono">SUPERUSER</div>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;
