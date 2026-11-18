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

function getUserDisplay(user) {
  if (!user) return { username: 'User', shortName: 'User', initials: 'U' };

  // Login credentials username (e.g., "buyer" from "buyer@bankauctions.ai")
  const username = user.username || (user.email ? user.email.split('@')[0] : (user.fullName || user.name || 'user'));

  // Short form of their name (e.g. "Commercial I." or first name)
  let shortName = user.fullName || user.name || username;
  if (user.fullName) {
    const parts = user.fullName.trim().split(/\s+/);
    if (parts.length > 1) {
      shortName = `${parts[0]} ${parts[1][0]}.`;
    } else {
      shortName = parts[0];
    }
  }

  // 2-letter initials for avatar badge (e.g. "CI" for Commercial Investor, or "BU" for buyer)
  let initials = 'U';
  if (user.fullName) {
    const parts = user.fullName.trim().split(/\s+/);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      initials = (parts[0][0] + parts[1][0]).toUpperCase();
    } else if (parts[0]) {
      initials = parts[0].slice(0, 2).toUpperCase();
    }
  } else if (user.name) {
    initials = user.name.slice(0, 2).toUpperCase();
  } else if (username) {
    initials = username.slice(0, 2).toUpperCase();
  }

  return { username, shortName, initials };
}

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { username, shortName, initials } = getUserDisplay(user);

  const buyerLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Search', path: '/search', icon: Search },
    { name: 'AI Rank', path: '/ai-rank', icon: Sparkles },
    { name: 'Help', path: '/buyer/requests', icon: HelpCircle },
    { name: 'Subscription Plans', path: '/pricing', icon: CreditCard },
    { name: 'Talk to a Lawyer', path: '/legal', icon: Scale },
    { name: 'Guides', path: '/guides', icon: BookOpen }
  ];

  const staffPaths = { ADMIN: '/admin', CHECKER: '/checker', ENGINEER: '/engineer', MARKETING: '/marketing' };
  const navLinks = staffPaths[user?.role] ? [
    { name: 'Workspace', path: staffPaths[user.role], icon: Shield },
    { name: 'Published auctions', path: '/search', icon: Search },
    { name: 'AI Rank', path: '/ai-rank', icon: Sparkles },
    { name: 'Home', path: '/', icon: Home }
  ] : buyerLinks;

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
    if (user.role === 'MARKETING') return '/marketing';
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
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-slate-900/80 border border-slate-700/70 hover:border-accent-cyan/50 backdrop-blur-md shadow-sm transition-all text-left"
                      aria-expanded={dropdownOpen}
                    >
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 border border-white/20 text-slate-950 flex items-center justify-center font-bold text-xs font-mono shadow-sm">
                        {initials}
                      </div>
                      <div className="hidden sm:block">
                        <div className="text-xs font-bold text-white leading-tight">{username}</div>
                        <div className="text-[10px] text-cyan-400 font-mono font-semibold">{shortName}</div>
                      </div>
                      <ChevronDown className={`w-4 h-4 text-slate-400 mr-1 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown Menu with Advanced Glassmorphism */}
                    {dropdownOpen && (
                      <div
                        className="absolute right-0 mt-2 w-64 rounded-2xl glass-panel shadow-2xl border border-white/[0.12] py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <div className="px-4 py-2.5 border-b border-white/[0.08]">
                          <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Signed in as</p>
                          <p className="text-xs font-bold text-white truncate">{username}</p>
                          <p className="text-[11px] text-cyan-400 font-mono truncate">{shortName} · {user.email}</p>
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
                            <span className="font-semibold text-xs">Watchlist &amp; Dossiers</span>
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

                  {/* Prominent Direct Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 transition-all shadow-sm"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/20"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Login</span>
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
            {user && (
              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center justify-center font-mono">
                    {initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white leading-tight">{username}</div>
                    <div className="text-[10px] text-cyan-400 font-mono font-semibold">{shortName}</div>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-300 bg-rose-500/10 border border-rose-500/30"
                >
                  Sign Out
                </button>
              </div>
            )}
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
