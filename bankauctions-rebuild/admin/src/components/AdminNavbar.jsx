import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldAlert, LayoutDashboard, Database, UploadCloud, 
  CheckSquare, Users, BarChart3, ScrollText, Sliders, LogOut, ExternalLink, LogIn 
} from 'lucide-react';

export default function AdminNavbar({ user, onLogout }) {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Auction Inventory', path: '/auctions', icon: Database },
    { name: 'Import Ingestion', path: '/imports', icon: UploadCloud },
    { name: 'Inspection Approvals', path: '/inspections', icon: CheckSquare },
    { name: 'Staff & Buyers', path: '/staff', icon: Users },
    { name: 'Audit Logs', path: '/audit-logs', icon: ScrollText },
    { name: 'Settings', path: '/settings', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-slate-950/85 backdrop-blur-2xl shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-purple-600/30 border-t border-white/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl text-white tracking-tight">
                  BankAuctions<span className="text-purple-400">.ai</span>
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider text-purple-400 font-semibold -mt-1">
                  Admin Console
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
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
                      ? 'bg-purple-600/25 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-purple-400' : 'text-slate-400'}`} />
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
              <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
            </a>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <div className="hidden sm:block text-right">
                  <div className="text-xs font-bold text-white leading-tight">{user.fullName || user.email}</div>
                  <div className="text-[10px] text-purple-400 font-mono font-semibold">ADMINISTRATOR</div>
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
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 transition-all shadow-md shadow-purple-600/20"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
