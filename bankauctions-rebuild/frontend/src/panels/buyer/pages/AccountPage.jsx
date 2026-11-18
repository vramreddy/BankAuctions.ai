import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  Smartphone,
  Sparkles,
  UserCheck
} from 'lucide-react';

const PRESET_USERS = [
  {
    name: 'Demo user',
    phone: '9000000000',
    plan: 'Free',
    langs: ['English'],
    credits: 0
  },
  {
    name: 'Anitha Raghavan',
    phone: '9876543210',
    plan: 'Pro pack · 5 properties',
    langs: ['English', 'Tamil'],
    credits: 4
  },
  {
    name: 'Suresh Kumar',
    phone: '9840123456',
    plan: 'Premium · Chennai',
    langs: ['English', 'Tamil', 'Telugu'],
    credits: 5
  }
];

export default function AccountPage() {
  const { user: authUser, logout, login } = useAuth();
  const navigate = useNavigate();

  // Retrieve prototype local user if present
  const [localUser, setLocalUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ba3_user') || 'null');
    } catch {
      return null;
    }
  });

  // Login form state (shown when not logged in)
  const [name, setName] = useState('Anitha Raghavan');
  const [phone, setPhone] = useState('9876543210');
  const [selectedLangs, setSelectedLangs] = useState(['English', 'Tamil']);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);

  const [alerts, setAlerts] = useState({
    whatsapp: true,
    email: true,
    sms: false
  });

  const currentUser = authUser || localUser;

  const handleSignOut = async () => {
    localStorage.removeItem('ba3_user');
    localStorage.removeItem('ba3_user_name');
    setLocalUser(null);
    if (logout) {
      await logout();
    }
    navigate('/account');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userObj = {
      name: name.trim() || 'Valued Buyer',
      phone: phone.trim(),
      role: 'BUYER',
      languages: selectedLangs,
      plan: phone === '9876543210' ? 'Pro pack · 5 properties' : phone === '9840123456' ? 'Premium · Chennai' : 'Free',
      credits: phone === '9876543210' ? 4 : 5
    };

    localStorage.setItem('ba3_user', JSON.stringify(userObj));
    localStorage.setItem('ba3_user_name', userObj.name);
    setLocalUser(userObj);

    if (login) {
      try {
        await login({
          email: `${phone}@bankauctions.ai`,
          password: 'password123',
          role: 'BUYER'
        });
      } catch (err) {
        // Prototype fallback
      }
    }
    setLoading(false);
  };

  const toggleLanguage = (lang) => {
    setSelectedLangs((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
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
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
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

            {currentUser && (
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
            )}
          </div>
        </div>

        {/* IF NOT LOGGED IN: Render Prototype Sign in or register Box (account.html line 7) */}
        {!currentUser ? (
          <div className="max-w-lg bg-[#0b101e] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Sign in or register
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                Use your mobile number. In this prototype, the OTP is always <strong>123456</strong>.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Your name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Anitha Raghavan"
                  className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Mobile number
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase text-slate-400">
                    Languages you speak
                  </label>
                  <span className="text-[11px] text-slate-500">For advocate matching</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Hindi'].map((l) => (
                    <button
                      type="button"
                      key={l}
                      onClick={() => toggleLanguage(l)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        selectedLangs.includes(l)
                          ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/30'
                          : 'bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-slate-200'
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={() => setOtpSent(true)}
                  className="w-full py-3.5 rounded-xl border border-rose-500/50 hover:bg-rose-600 text-white font-bold text-sm tracking-wide transition-all active:scale-95 mt-2"
                >
                  Send OTP
                </button>
              ) : (
                <div className="space-y-4 pt-2">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-mono uppercase text-slate-400">
                        OTP (Demo is 123456)
                      </label>
                      <span className="text-[11px] text-emerald-400">Code Sent</span>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="123456"
                      className="w-full rounded-xl bg-slate-900 border border-emerald-500/50 px-3.5 py-3 text-sm text-white font-mono tracking-widest text-center focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-rose-600/30 active:scale-95 flex items-center justify-center gap-2"
                  >
                    <UserCheck size={16} />
                    <span>{loading ? 'Verifying...' : 'Verify and continue'}</span>
                  </button>
                </div>
              )}
            </form>

            <div className="pt-4 border-t border-white/[0.08] space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
                Quick Test Personas
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {PRESET_USERS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setName(p.name);
                      setPhone(p.phone);
                      setSelectedLangs(p.langs);
                      setOtpSent(true);
                      setOtp('123456');
                    }}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-left transition-colors"
                  >
                    <div className="font-bold text-white truncate">{p.name}</div>
                    <div className="text-[10px] text-rose-400 truncate">{p.plan}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* IF LOGGED IN: Render Dashboard */
          <>
            {/* User Info Strip */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-[#0b101e] border border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-600/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-xl">
                  {currentUser.name ? currentUser.name.charAt(0) : 'U'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">{currentUser.name}</h2>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {currentUser.phone || currentUser.email} · Member since November 2026
                  </p>
                </div>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 size={14} />
                <span>Verified Buyer Session</span>
              </div>
            </div>

            {/* 3 Overview Cards */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Card 1: Current Plan */}
              <div className="p-6 rounded-3xl bg-[#0b101e] border border-white/10 space-y-4 shadow-xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Current Plan
                </span>
                <div className="text-2xl font-black text-white">
                  {currentUser.plan || 'Pro Pack · 5 Properties'}
                </div>
                <p className="text-xs text-slate-300">
                  <b>{currentUser.credits ?? 4} property unlocks</b> remaining in your pack. Unlocks never expire.
                </p>

                <div className="space-y-1 text-xs pt-2 border-t border-white/[0.08]">
                  <b className="text-slate-300 block mb-1">Languages I speak:</b>
                  <div className="flex flex-wrap gap-1.5">
                    {['English', 'Tamil', 'Telugu', 'Hindi'].map((l) => (
                      <button
                        key={l}
                        onClick={() => toggleLanguage(l)}
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
                    Pricing
                  </Link>
                </div>
              </div>

              {/* Card 2: Your Preferences */}
              <div className="p-6 rounded-3xl bg-[#0b101e] border border-white/10 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Preferences
                  </span>
                  <Link to="/preferences" className="text-xs text-rose-400 font-semibold hover:underline">
                    Edit
                  </Link>
                </div>
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Search city:</span>
                    <span className="font-semibold text-white">Chennai</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Property types:</span>
                    <span className="font-semibold text-white">Flats, Plots</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Max budget:</span>
                    <span className="font-semibold text-white">₹1.50 Cr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Possession:</span>
                    <span className="font-semibold text-emerald-400">Physical only</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.08]">
                  <Link
                    to="/search"
                    className="block text-center py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-white transition-colors"
                  >
                    View Matching Lots
                  </Link>
                </div>
              </div>

              {/* Card 3: Alert Channels */}
              <div className="p-6 rounded-3xl bg-[#0b101e] border border-white/10 space-y-4 shadow-xl">
                <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
                  Auction Alerts
                </span>
                <p className="text-xs text-slate-400">
                  Receive instant alerts when new bank auctions matching your criteria are catalogued.
                </p>

                <div className="space-y-2.5 text-xs">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">WhatsApp Instant Alerts</span>
                    <input
                      type="checkbox"
                      checked={alerts.whatsapp}
                      onChange={(e) => setAlerts({ ...alerts, whatsapp: e.target.checked })}
                      className="accent-rose-500 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">Email Digest (Daily 8am)</span>
                    <input
                      type="checkbox"
                      checked={alerts.email}
                      onChange={(e) => setAlerts({ ...alerts, email: e.target.checked })}
                      className="accent-rose-500 rounded"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">SMS Outbid & Notice Alerts</span>
                    <input
                      type="checkbox"
                      checked={alerts.sms}
                      onChange={(e) => setAlerts({ ...alerts, sms: e.target.checked })}
                      className="accent-rose-500 rounded"
                    />
                  </label>
                </div>

                <div className="pt-2 text-[11px] text-slate-500">
                  Configured for: {currentUser.phone || '+91 98765 43210'}
                </div>
              </div>
            </div>

            {/* Saved Searches */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0b101e] border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Saved Searches</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Quick access to custom filtered auction feeds</p>
                </div>
                <Link to="/search" className="text-xs font-semibold text-rose-400 hover:underline">
                  + New search
                </Link>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {savedSearches.map((s, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-white">{s.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{s.city} · {s.hits}</p>
                    </div>
                    <Link
                      to="/search"
                      className="px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-white transition-colors"
                    >
                      Search
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Receipts Table */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0b101e] border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-base font-bold text-white tracking-tight">Purchase Receipts & Invoices</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-slate-400 font-mono uppercase text-[11px]">
                      <th className="pb-3 font-semibold">Description</th>
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {receipts.map((r, idx) => (
                      <tr key={idx} className="hover:bg-white/[0.02]">
                        <td className="py-3.5 font-bold text-white">{r.item}</td>
                        <td className="py-3.5 text-slate-400">{r.date}</td>
                        <td className="py-3.5 text-right font-mono text-emerald-400 font-semibold">{r.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
