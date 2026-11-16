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
      <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent-cyan via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-accent-cyan/20 group-hover:scale-105 transition-transform">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl text-white tracking-tight flex items-baseline">
                    Bank<span className="text-accent-cyan">Auctions</span>
                    <span className="text-xs text-accent-cyan font-mono ml-0.5">.ai</span>
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 -mt-1">
                    SARFAESI Discovery
                  </span>
                </div>
              </Link>
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = link.path === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${active
                      ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.name}</span>
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
                    className="flex items-center gap-2 p-1.5 pl-3 rounded-2xl bg-slate-900 border border-slate-700/60 hover:border-accent-cyan/40 transition-all text-left"
                  >
                    <div className="w-7 h-7 rounded-xl bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan flex items-center justify-center font-bold text-xs font-mono">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
                      <div className="text-[10px] text-accent-cyan font-mono">{user.role}</div>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400 mr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 rounded-2xl glass-panel shadow-2xl border border-slate-700/60 py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-slate-800">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-xs font-bold text-white truncate">{user.email}</p>
                      </div>

                      <Link
                        to={getWorkspacePath()}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/5"
                      >
                        <User className="w-4 h-4 text-accent-cyan" />
                        <span>Workspace Panel</span>
                      </Link>

                      {user.role === 'BUYER' && (
                        <Link
                          to="/buyer/saved"
                          className="flex items-center gap-2.5 px-4 py-2.5 text-slate-200 hover:text-white hover:bg-white/5"
                        >
                          <Bookmark className="w-4 h-4 text-amber-400" />
                          <span>Saved Lots</span>
                        </Link>
                      )}

                      <div className="border-t border-slate-800 my-1" />

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex items-center justify-center rounded-xl bg-accent-cyan px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300">
                  Login
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-800 bg-slate-950 p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5"
              >
                <link.icon className="w-4 h-4 text-accent-cyan" />
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
