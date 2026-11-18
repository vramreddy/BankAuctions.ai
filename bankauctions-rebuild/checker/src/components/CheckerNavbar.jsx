import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  CheckCircle2, ListFilter, History, Database, 
  Users, FileText, CheckSquare, LogOut, ExternalLink, HardHat, LogIn 
} from 'lucide-react';

export default function CheckerNavbar({ user, onLogout }) {
  const location = useLocation();

  const links = [
    { name: 'Overview', path: '/', icon: CheckCircle2 },
    { name: 'Exception Queue', path: '/queue', icon: ListFilter },
    { name: 'Auction Catalog', path: '/catalog', icon: Database },
    { name: 'Buyer Content', path: '/content', icon: FileText },
    { name: 'Field Inspections', path: '/inspections', icon: HardHat },
    { name: 'Audit History', path: '/history', icon: History },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-slate-950/85 backdrop-blur-2xl shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/25 border-t border-white/30">
                <CheckCircle2 className="w-5 h-5 text-slate-950" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-tight">
                  BankAuctions<span className="text-cyan-400">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-400 font-semibold -mt-1">
                  Quality Checker Workspace
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const active = link.path === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] border border-white/10 transition-all"
              title="Open Buyer View (Port 5173)"
            >
              <span>Buyer View</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </a>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-white leading-tight">{user.fullName || user.email}</div>
                  <div className="text-[10px] text-cyan-400 font-mono font-semibold">QUALITY CHECKER</div>
                </div>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all shadow-sm"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 transition-all shadow-md shadow-cyan-500/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Checker Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
