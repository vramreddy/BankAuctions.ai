import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCity } from '../../contexts/CityContext';
import {
  Search,
  Bookmark,
  User,
  Shield,
  LogOut,
  ChevronDown,
  Sparkles,
  BookOpen,
  HelpCircle,
  Menu,
  X,
  CreditCard,
  Scale,
  MapPin,
  Briefcase,
  Compass,
  FileText,
  SlidersHorizontal,
  FolderArchive
} from 'lucide-react';

function getUserDisplay(user) {
  if (!user) return { username: 'Sign in', shortName: 'Sign in', initials: 'SI' };

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
  const { selectedCity, setCity, allCities } = useCity();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { username, shortName, initials } = getUserDisplay(user);

  // Exact nav links from Sajith Atlas prototype overview
  const navLinks = [
    { name: 'Search', path: '/search', isPremium: false },
    { name: 'Premium', path: '/premium', isPremium: true },
    { name: 'Pricing', path: '/pricing', isPremium: false },
    { name: 'Data & intelligence', path: '/data', isPremium: false },
    { name: 'Learn', path: '/learn', isPremium: false },
    { name: 'Concierge', path: '/concierge', isPremium: false },
    { name: 'Talk to a lawyer', path: '/legal', isPremium: false },
  ];

  const handleSignOut = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* 1. Prototype Top Disclaimer Strip */}
      <div className="border-b border-white/[0.08] bg-[#0c1222] text-[12.5px] text-slate-300 py-1.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <b className="text-white font-bold">What we do, and don’t.</b>
            <span className="hidden sm:inline text-slate-400">
              We provide intelligence and data on auction properties and prices. We are not an auctioneer, agent or intermediary.
            </span>
            <span className="sm:hidden text-slate-400">
              Auction data & intelligence. Not an intermediary.
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-400 font-mono">
            <span>DRT & SARFAESI Bench</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Live in 5 South India Metros</span>
          </div>
        </div>
      </div>

      {/* 2. Main Sticky Header */}
      <header className="sticky top-0 z-40 w-full border-b border-white/[0.08] bg-[#060a17]/90 backdrop-blur-2xl shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px] gap-3">
            {/* Logo */}
            <div className="flex items-center gap-4 shrink-0">
              <Link to="/" className="flex items-center gap-3 group" aria-label="BankAuctions.ai home">
                {/* SVG Icon matching prototype */}
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF5A8A] to-[#B80F4B] p-0.5 flex items-center justify-center shadow-lg shadow-rose-950/40 group-hover:scale-105 transition-all">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 48 48" aria-hidden="true">
                    <rect width="48" height="48" rx="13" fill="none" />
                    <path d="M10 23 24 11l14 12v14a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z" fill="#fff" />
                    <rect x="15" y="27" width="4.5" height="10" rx="1" fill="#D61F5C" />
                    <rect x="21.8" y="23" width="4.5" height="14" rx="1" fill="#D61F5C" />
                    <rect x="28.6" y="19" width="4.5" height="18" rx="1" fill="#D61F5C" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-extrabold text-xl text-white tracking-tight flex items-baseline leading-none">
                    bank<span className="text-rose-500 font-black">auctions</span><span className="text-xs text-rose-400 font-mono">.ai</span>
                  </span>
                  <span className="text-[10px] text-slate-400 tracking-tight font-medium mt-1">
                    Know the real value before you bid.
                  </span>
                </div>
              </Link>

              {/* Header City Selector Dropdown */}
              <div className="hidden sm:flex items-center pl-2">
                <select
                  value={selectedCity}
                  onChange={(e) => setCity(e.target.value)}
                  className="rounded-full border border-white/15 bg-white/[0.06] text-white px-3.5 py-1.5 text-xs font-bold tracking-tight hover:border-white/30 focus:outline-none focus:ring-1 focus:ring-rose-500 cursor-pointer transition-all"
                  aria-label="Filter city"
                >
                  {Object.entries(allCities || {}).map(([key, val]) => (
                    <option key={key} value={key} className="bg-slate-900 text-white">
                      {val.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const active = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));

                if (link.isPremium) {
                  return (
                    <Link
                      key={link.name}
                      to={link.path}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                        active
                          ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                          : 'text-rose-400 hover:text-white hover:bg-rose-500/20'
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      active
                        ? 'bg-white text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Account & Demo Area */}
            <div className="flex items-center gap-2.5 shrink-0">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-white text-xs font-bold transition-all"
                  aria-expanded={dropdownOpen}
                >
                  {user ? (
                    <>
                      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-rose-500 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center font-mono">
                        {initials}
                      </div>
                      <span className="hidden sm:inline font-semibold">{shortName}</span>
                    </>
                  ) : (
                    <span>Sign in</span>
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Account Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-white/15 shadow-2xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {user ? (
                      <div className="px-4 py-2.5 border-b border-white/[0.08]">
                        <p className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Signed in as</p>
                        <p className="text-xs font-bold text-white truncate">{username}</p>
                        <p className="text-[11px] text-rose-400 font-mono truncate">{shortName} · {user.email || 'active'}</p>
                      </div>
                    ) : (
                      <div className="px-4 py-2 border-b border-white/[0.08]">
                        <p className="text-xs text-slate-300 font-medium">Welcome to BankAuctions.ai</p>
                      </div>
                    )}

                    <div className="py-1">
                      <Link
                        to={user ? "/account" : "/login"}
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <User className="w-3.5 h-3.5 text-rose-400" />
                        <span className="font-semibold">My account</span>
                      </Link>

                      <Link
                        to="/archive"
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <FolderArchive className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-semibold">My archive</span>
                      </Link>

                      <Link
                        to="/preferences"
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="font-semibold">Set preferences</span>
                      </Link>

                      <Link
                        to="/account#saved"
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="font-semibold">Saved searches</span>
                      </Link>

                      <Link
                        to="/legal"
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <Scale className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-semibold">Talk to a lawyer</span>
                      </Link>

                      <Link
                        to="/support"
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
                        <span className="font-semibold">Help &amp; support</span>
                      </Link>

                      <Link
                        to="/staff"
                        className="flex items-center gap-2.5 px-4 py-2 text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-purple-400" />
                        <span className="font-semibold">Staff login</span>
                      </Link>
                    </div>

                    {user && (
                      <div className="border-t border-white/[0.08] pt-1">
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left font-semibold"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="xl:hidden p-2 rounded-full border border-white/10 bg-white/[0.06] text-slate-300 hover:text-white"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-white/[0.08] bg-[#070b16] px-4 py-4 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <span className="text-xs text-slate-400 font-semibold">Select City:</span>
              <select
                value={selectedCity}
                onChange={(e) => setCity(e.target.value)}
                className="rounded-lg border border-white/20 bg-white/10 text-white px-3 py-1 text-xs font-bold"
              >
                {Object.entries(allCities || {}).map(([key, val]) => (
                  <option key={key} value={key} className="bg-slate-900 text-white">
                    {val.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                      link.isPremium
                        ? 'bg-rose-600/30 border border-rose-500/50 text-rose-300'
                        : active
                        ? 'bg-white text-slate-950 font-bold'
                        : 'bg-white/[0.04] text-slate-300'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/[0.08] grid grid-cols-2 gap-2 text-xs">
              <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 py-1.5">My account</Link>
              <Link to="/archive" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 py-1.5">My archive</Link>
              <Link to="/preferences" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 py-1.5">Preferences</Link>
              <Link to="/staff" onClick={() => setMobileMenuOpen(false)} className="text-slate-300 py-1.5">Staff portal</Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

export default Navbar;
