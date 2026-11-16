import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Compass, HardHat, ClipboardList, History, LogOut, ArrowLeft, LayoutDashboard } from 'lucide-react';

export function EngineerLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/engineer', icon: LayoutDashboard },
    { name: 'My Assignments', path: '/engineer/assignments', icon: ClipboardList },
    { name: 'Completed Visits', path: '/engineer/history', icon: History }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-obsidian">
      {/* Mobile-Optimized Field Header */}
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/" className="p-2 rounded-xl glass-card text-slate-400 hover:text-white" title="Back to Public Site">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
                <HardHat className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-base text-white tracking-tight">
                  Field <span className="text-amber-400">Valuation Engineer</span>
                </span>
                <span className="text-[10px] text-slate-400 block -mt-0.5">
                  GPS-Tagged On-Site Property Inspections
                </span>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2">
            {links.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-bold text-white">{user?.name}</div>
              <div className="text-[10px] text-amber-400 font-mono">VALUATION ENGINEER</div>
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

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default EngineerLayout;
