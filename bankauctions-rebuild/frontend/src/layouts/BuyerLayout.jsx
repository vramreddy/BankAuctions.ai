import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { useAuth } from '../contexts/AuthContext';
import { User, Bookmark, Sliders, CreditCard, Sparkles, ShieldCheck } from 'lucide-react';

export function BuyerLayout() {
  const { user } = useAuth();
  const location = useLocation();

  const links = [
    { name: 'Dashboard Overview', path: '/buyer/dashboard', icon: User },
    { name: 'Saved & Unlocked', path: '/buyer/saved', icon: Bookmark },
    { name: 'Preferences & Alerts', path: '/buyer/preferences', icon: Sliders },
    { name: 'Plan & Billing', path: '/pricing', icon: CreditCard }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-brand-obsidian">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* User Greeting Header with Premium Gradient Glass Surface */}
        <div className="mb-8 p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border-white/[0.09] shadow-2xl">
          {/* Subtle background ambient gradient glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-indigo-500/10 to-transparent pointer-events-none rounded-full blur-3xl -z-10" />

          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="text-[11px] uppercase font-mono tracking-wider text-accent-cyan font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Buyer Workspace
              </span>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-semibold font-mono">
                {user?.planTier || 'PRO'} Investor
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.fullName || user?.name || 'Investor'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl font-normal leading-relaxed">
              Manage your saved auction watchlist, unlock legal dossiers, and monitor scheduled SARFAESI bids across South India.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <div className="px-5 py-3 rounded-2xl bg-slate-900/80 border border-slate-700/70 text-right backdrop-blur-md shadow-inner">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block">Available Unlocks</span>
              <span className="text-xl font-black text-cyan-400 font-mono tracking-tight">
                {user?.unlocksRemaining ?? 5}
              </span>
            </div>
            <Link
              to="/pricing"
              className="btn-gradient-cyan px-5 py-3 rounded-2xl text-xs font-bold inline-flex items-center gap-1.5 shadow-glow-cyan transition-transform active:scale-95"
            >
              <span>Get More Unlocks</span>
              <span>→</span>
            </Link>
          </div>
        </div>

        {/* Workspace Body with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-28 p-3 rounded-2xl glass-panel space-y-1.5 border-white/[0.08] shadow-xl">
              <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold border-b border-white/[0.06] mb-1">
                Navigation
              </div>
              {links.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 relative group ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 via-blue-500/10 to-transparent text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                    )}
                    <item.icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </aside>

          <section className="lg:col-span-3">
            <Outlet />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default BuyerLayout;
