import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/navigation/Footer';
import { useAuth } from '../contexts/AuthContext';
import { User, Bookmark, Sliders, CreditCard } from 'lucide-react';

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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* User Greeting Header */}
        <div className="mb-8 p-6 rounded-3xl glass-panel flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-mono tracking-wider text-accent-cyan font-bold">
                Buyer Workspace
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent-cyan/20 text-accent-cyan font-semibold">
                {user?.membershipTier || 'PRO'} Investor
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Welcome back, {user?.name || 'Investor'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage your saved auction watchlist, tracked banks, and personalized search filters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-slate-900 border border-slate-700/60 text-right">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Available Unlocks</span>
              <span className="text-lg font-extrabold text-accent-cyan font-mono">
                {user?.remainingUnlocks ?? 12}
              </span>
            </div>
            <Link
              to="/pricing"
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-accent-cyan to-blue-600 text-slate-950 font-bold text-xs shadow-glow-cyan hover:shadow-cyan-500/50 transition-all"
            >
              Get More Unlocks
            </Link>
          </div>
        </div>

        {/* Workspace Body with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <div className="sticky top-28 p-3 rounded-2xl glass-panel space-y-1">
              {links.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
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
