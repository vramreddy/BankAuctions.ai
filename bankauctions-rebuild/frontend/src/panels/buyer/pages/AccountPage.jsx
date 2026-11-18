import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  User,
  SlidersHorizontal,
  Bookmark,
  Bell,
  Receipt,
  Scale,
  FolderArchive,
  ArrowRight,
  LogOut,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function AccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [alerts, setAlerts] = useState({
    whatsapp: true,
    email: true,
    sms: false
  });

  const [selectedLangs, setSelectedLangs] = useState(['English', 'Tamil']);

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const receipts = [
    { item: 'Pro pack · 5 property unlocks', date: '14 Nov 2026', amount: '₹499' },
    { item: 'Title Opinion · DRT Advocate Consultation', date: '08 Nov 2026', amount: '₹1,500' }
  ];

  const savedSearches = [
    { title: '2BHK flats under ₹60 L', city: 'Chennai', hits: '12 hits' },
    { title: 'Commercial plots on highway', city: 'Hyderabad', hits: '4 hits' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">My account</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              My account
            </h1>
            <p className="text-slate-400 text-sm sm:text-base mt-1">
              Your plan, preferences, saved properties, alerts and receipts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/preferences"
              className="px-4 py-2 rounded-full border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              Set preferences
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-full bg-slate-900 border border-rose-500/30 text-rose-300 hover:text-white hover:bg-rose-600/30 text-xs font-semibold transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* 3 Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: Current Plan */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Current Plan
          </span>
          <div className="text-2xl font-black text-white">
            Pro Plan Active
          </div>
          <p className="text-xs text-slate-300">
            <b>4 property unlocks</b> remaining in your pack. Unlocks never expire.
          </p>

          <div className="space-y-1 text-xs pt-2 border-t border-white/[0.08]">
            <b className="text-slate-300 block mb-1">Languages I speak:</b>
            <div className="flex flex-wrap gap-1.5">
              {['English', 'Tamil', 'Telugu', 'Hindi'].map((l) => (
                <button
                  key={l}
                  onClick={() => {
                    setSelectedLangs(prev =>
                      prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]
                    );
                  }}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    selectedLangs.includes(l)
                      ? 'bg-rose-600 text-white'
                      : 'bg-white/10 text-slate-300'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center gap-4 text-xs font-bold text-rose-400">
            <Link to="/archive" className="hover:underline flex items-center gap-1">
              Open My archive <ArrowRight size={12} />
            </Link>
            <Link to="/pricing" className="hover:underline">
              Upgrade
            </Link>
          </div>
        </div>

        {/* Card 2: Your Preferences */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
              Preferences
            </span>
            <Link to="/preferences" className="text-xs text-rose-400 font-bold hover:underline">
              Edit
            </Link>
          </div>
          <div className="text-2xl font-black text-white">
            Chennai &amp; Hyderabad
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Flats, Plots, and High Commercial value assets under ₹1.5 Cr with Physical possession preference.
          </p>
          <div className="pt-4 border-t border-white/[0.08] text-xs text-slate-400">
            Preference filter active across all live search feeds.
          </div>
        </div>

        {/* Card 3: Alert Channels */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Alert Channels
          </span>
          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] cursor-pointer">
              <span className="text-slate-200 font-semibold">WhatsApp Alerts</span>
              <input
                type="checkbox"
                checked={alerts.whatsapp}
                onChange={(e) => setAlerts({ ...alerts, whatsapp: e.target.checked })}
                className="w-4 h-4 accent-rose-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] cursor-pointer">
              <span className="text-slate-200 font-semibold">Email Summary Digest</span>
              <input
                type="checkbox"
                checked={alerts.email}
                onChange={(e) => setAlerts({ ...alerts, email: e.target.checked })}
                className="w-4 h-4 accent-rose-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between p-2 rounded-xl bg-white/[0.04] cursor-pointer">
              <span className="text-slate-200 font-semibold">SMS Flash Deadlines</span>
              <input
                type="checkbox"
                checked={alerts.sms}
                onChange={(e) => setAlerts({ ...alerts, sms: e.target.checked })}
                className="w-4 h-4 accent-rose-600 rounded"
              />
            </label>
          </div>
        </div>
      </div>

      {/* Saved Searches & Watchlist */}
      <section className="grid lg:grid-cols-2 gap-8" id="saved">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
          <h2 className="text-xl font-bold text-white">Saved searches</h2>
          <div className="space-y-3">
            {savedSearches.map((s, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-xs">{s.title}</h4>
                  <p className="text-[11px] text-slate-400">{s.city}</p>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold">
                  {s.hits}
                </span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            Saved searches and WhatsApp auction alert dispatches are free and unlimited.
          </p>
        </div>

        {/* Consultations */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-4">
          <h2 className="text-xl font-bold text-white">My consultations</h2>
          <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex items-start gap-4">
            <Scale className="w-8 h-8 text-rose-400 shrink-0" />
            <div className="space-y-1">
              <h4 className="font-bold text-white text-xs">Adv. R. Venkatesan (Madras High Court)</h4>
              <p className="text-[11px] text-slate-400">Section 13(2) &amp; EC Scrutiny · DRT Chennai</p>
              <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                Completed
              </span>
            </div>
          </div>
          <Link
            to="/legal"
            className="inline-block text-xs font-bold text-rose-400 hover:underline pt-2"
          >
            Book a new lawyer consultation →
          </Link>
        </div>
      </section>

      {/* Receipts Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">Payments and receipts</h2>
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-slate-400 font-mono uppercase text-[11px] border-b border-white/10">
              <tr>
                <th className="py-4 px-6 font-bold">Item</th>
                <th className="py-4 px-6 font-bold">Date</th>
                <th className="py-4 px-6 font-bold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-slate-200">
              {receipts.map((r, i) => (
                <tr key={i}>
                  <td className="py-4 px-6 font-semibold text-white">{r.item}</td>
                  <td className="py-4 px-6 text-slate-400">{r.date}</td>
                  <td className="py-4 px-6 text-right font-bold text-rose-400">{r.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
