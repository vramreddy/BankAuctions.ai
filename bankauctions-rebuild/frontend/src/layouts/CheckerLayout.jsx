import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle2, ListFilter, History, Shield, LogOut, ArrowLeft, LayoutDashboard } from 'lucide-react';

export function CheckerLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/checker', icon: LayoutDashboard },
    { name: 'Exception Queue', path: '/checker/queue', icon: ListFilter },
    { name: 'Audit History', path: '/checker/history', icon: History }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-obsidian">
      {/* High-Precision Checker Topbar */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 rounded-xl glass-card text-slate-400 hover:text-white" title="Back to Public Site">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan flex items-center justify-center font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-base text-white tracking-tight">
                  Quality <span className="text-accent-cyan">Checker Workspace</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  Two-Tier SARFAESI Notice Data Verification
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Signout */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-white">{user?.name}</div>
              <div className="text-[10px] text-accent-cyan font-mono">STAFF CHECKER</div>
            </div>
            <button
              onClick={() => logout()}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default CheckerLayout;
