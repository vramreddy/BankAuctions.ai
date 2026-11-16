import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

import UtilityBar from './UtilityBar';
import {
  Home,
  Search,
  Bookmark,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Layers,
  Sparkles,
  BookOpen,
  HelpCircle,
  Menu,
  X,
  Building2,
  CreditCard,
  Scale
} from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'AI Rank', path: '/ai-rank', icon: Sparkles },
    { name: 'Subscription Plans', path: '/pricing', icon: CreditCard },
    { name: 'Talk to a Lawyer', path: '/legal', icon: Scale },
    { name: 'Guides', path: '/guides', icon: BookOpen }
  ];

  const handleSignOut = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getWorkspacePath = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'CHECKER') return '/checker';
    if (user.role === 'ENGINEER') return '/engineer';
    return '/buyer/dashboard';
  };

  return (
    <>
      <UtilityBar />
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-slate-950/80 backdrop-blur-2xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo with Gradient Glow */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border-t border-white/40 group-hover:scale-105 group-hover:shadow-cyan-400/40 transition-all">
                  <Building2 className="w-5 h-5 text-slate-950" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl text-white tracking-tight flex items-baseline">
                    Bank<span className="text-accent-cyan">Auctions</span>
                    <span className="text-xs text-accent-cyan font-mono ml-0.5">.ai</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 -mt-1 font-semibold">
                    SARFAESI Discovery
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links with Enhanced Active States & Micro-interactions */}
            <nav className="hidden md:flex items-center gap-1.5" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 relative group ${
                      active
                        ? 'bg-gradient-to-r from-cyan-500/15 via-blue-500/10 to-transparent text-cyan-300 border border-cyan-500/35 shadow-sm shadow-cyan-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {active && (
                      <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-slate-900/80 border border-slate-700/70 hover:border-accent-cyan/50 backdrop-blur-md shadow-sm transition-all text-left"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 border border-white/20 text-slate-950 flex items-center justify-center font-bold text-xs font-mono shadow-sm">
                      {user.name || user.fullName ? (user.name || user.fullName)[0].toUpperCase() : 'U'}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-xs font-bold text-white leading-tight">{user.fullName || user.name}</div>
                      <div className="text-[10px] text-cyan-400 font-mono font-semibold">{user.role}</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 mr-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown Menu with Advanced Glassmorphism */}
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-60 rounded-2xl glass-panel shadow-2xl border border-white/[0.12] py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2.5 border-b border-white/[0.08]">
                        <p className="text-[11px] text-slate-400 font-mono uppercase">Signed in as</p>
                        <p className="text-xs font-bold text-white truncate">{user.email}</p>
                      </div>

                      <Link
                        to={getWorkspacePath()}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <User className="w-4 h-4 text-cyan-400" />
                        <span className="font-semibold text-xs">Workspace Panel</span>
                      </Link>

                      {user.role === 'BUYER' && (
                        <Link
                          to="/buyer/saved"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/[0.06] transition-colors"
                        >
                          <Bookmark className="w-4 h-4 text-amber-400" />
                          <span className="font-semibold text-xs">Watchlist & Dossiers</span>
                        </Link>
                      )}

                      <div className="border-t border-white/[0.08] my-1" />

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-300 hover:text-rose-200 hover:bg-rose-500/10 transition-colors text-left font-semibold text-xs"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/[0.06] transition-all"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="btn-gradient-cyan px-4 py-2 rounded-xl text-xs font-bold shadow-glow-cyan transition-transform active:scale-95"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl glass-card text-slate-300 hover:text-white"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl px-4 py-4 space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = link.path === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
