import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../services/api';
import { formatINR, formatDate, getDaysRemaining } from '../../../utils/formatters';
import { Button } from '../../../components/common/Button';
import {
  Building2,
  Unlock,
  Lock,
  Bookmark,
  ShieldCheck,
  Search,
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Filter,
  Layers,
  CreditCard,
  X,
  ExternalLink
} from 'lucide-react';
import { CATEGORY_DETAILS } from '@shared/constants/categories.js';

export function BuyerDashboardPage() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // State
  const [auctions, setAuctions] = useState([]);
  const [unlockedIds, setUnlockedIds] = useState(new Set());
  const [savedIds, setSavedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Filters & Tabs
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'unlocked' | 'saved'
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedCat, setSelectedCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Unlock Modal State
  const [targetLot, setTargetLot] = useState(null);
  const [unlocking, setUnlocking] = useState(false);
  const [unlockMessage, setUnlockMessage] = useState(null);

  // Load All Properties, Unlocked list, and Saved list
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [auctionsRes, unlockedRes, savedRes] = await Promise.all([
        api.getAuctions({ limit: 100 }),
        api.getUnlockedProperties().catch(() => ({ success: true, data: [] })),
        api.getSavedProperties().catch(() => ({ success: true, data: [] }))
      ]);

      if (auctionsRes.success && Array.isArray(auctionsRes.data)) {
        setAuctions(auctionsRes.data);
      }

      if (unlockedRes.success && Array.isArray(unlockedRes.data)) {
        const uSet = new Set(unlockedRes.data.map((item) => item.auctionId || item.auction?.id));
        setUnlockedIds(uSet);
      }

      if (savedRes.success && Array.isArray(savedRes.data)) {
        const sSet = new Set(savedRes.data.map((item) => item.auctionId || item.auction?.id));
        setSavedIds(sSet);
      }
    } catch (err) {
      console.error('Failed to load buyer dashboard properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle Unlocking
  const handleConfirmUnlock = async () => {
    if (!targetLot) return;
    if ((user?.unlocksRemaining || 0) <= 0) {
      navigate('/pricing');
      return;
    }

    setUnlocking(true);
    try {
      const res = await api.unlockAuction(targetLot.id);
      if (res.success) {
        setUnlockedIds((prev) => new Set([...prev, targetLot.id]));
        setUnlockMessage({
          type: 'success',
          text: `Dossier permanently unlocked! Full lender contacts, notice PDF, and engineer verification are now accessible.`
        });
        if (refreshUser) await refreshUser();
      }
    } catch (err) {
      setUnlockMessage({
        type: 'error',
        text: err.message || 'Failed to unlock dossier. Please try again.'
      });
    } finally {
      setUnlocking(false);
    }
  };

  // Filter listings
  const filteredAuctions = auctions.filter((item) => {
    // Tab filter
    if (activeTab === 'unlocked' && !unlockedIds.has(item.id)) return false;
    if (activeTab === 'saved' && !savedIds.has(item.id)) return false;

    // City filter
    if (selectedCity !== 'all' && item.city?.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    // Category filter
    if (selectedCat !== 'all') {
      const catSlug = item.category?.slug || item.category;
      if (catSlug !== selectedCat) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchLocality = item.locality?.toLowerCase().includes(q);
      const matchBank = (item.bankName || item.bank?.name || '').toLowerCase().includes(q);
      if (!matchTitle && !matchLocality && !matchBank) return false;
    }

    return true;
  });

  const cityOptions = [
    { value: 'all', label: 'All Cities' },
    { value: 'chennai', label: 'Chennai' },
    { value: 'bengaluru', label: 'Bengaluru' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'coimbatore', label: 'Coimbatore' },
    { value: 'kerala', label: 'Kerala / Kochi' }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* ======================================================== */}
      {/* 1. WELCOME & TIER INTELLIGENCE BANNER */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-[#0b101e] border border-white/[0.08] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-sky-400">
                Buyer Command Center
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 border border-sky-400/30 text-sky-300 text-xs font-bold font-mono uppercase">
                Plan: {user?.planTier || 'FREE ACCESS'}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold font-mono">
                {user?.unlocksRemaining ?? 3} Dossier Unlocks Available
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Welcome, {user?.fullName || 'Verified Buyer'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              You have full browsing access to every bank auction asset in India. All reserve prices, EMD deadlines, and asset types are open. Premium unlock credits reveal lender contacts, notice downloads, engineer inspection dossiers, and guideline valuation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/pricing">
              <Button
                variant="primary"
                className="bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold"
              >
                <CreditCard size={16} className="mr-1.5" />
                {user?.planTier === 'PRO' ? 'Get More Unlocks' : 'Upgrade to Pro Pack (₹699)'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. CATALOG TABS & FILTER TOOLBAR */}
      {/* ======================================================== */}
      <section className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'all'
                  ? 'bg-sky-400 text-slate-950 shadow-md shadow-sky-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              All Available Assets ({auctions.length})
            </button>

            <button
              onClick={() => setActiveTab('unlocked')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'unlocked'
                  ? 'bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <CheckCircle2 size={14} />
              <span>My Unlocked Dossiers ({unlockedIds.size})</span>
            </button>

            <button
              onClick={() => setActiveTab('saved')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'saved'
                  ? 'bg-indigo-400 text-slate-950 shadow-md shadow-indigo-500/20'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Bookmark size={14} />
              <span>Saved Lots ({savedIds.size})</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing <strong className="text-white">{filteredAuctions.length}</strong> matching properties
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid sm:grid-cols-12 gap-3 items-center">
          {/* City Selector */}
          <div className="sm:col-span-3">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full rounded-xl glass-input px-3 py-2.5 text-xs text-slate-200"
            >
              {cityOptions.map((c) => (
                <option key={c.value} value={c.value} className="bg-slate-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div className="sm:col-span-3">
            <select
              value={selectedCat}
              onChange={(e) => setSelectedCat(e.target.value)}
              className="w-full rounded-xl glass-input px-3 py-2.5 text-xs text-slate-200"
            >
              <option value="all" className="bg-slate-900 text-white">All Asset Classes</option>
              {Object.values(CATEGORY_DETAILS).map((cat) => (
                <option key={cat.slug} value={cat.slug} className="bg-slate-900 text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Keyword Search */}
          <div className="sm:col-span-6 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locality, property title, or bank..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. PROPERTY CATALOG GRID */}
      {/* ======================================================== */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-slate-900/60 border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : filteredAuctions.length === 0 ? (
        <div className="rounded-3xl glass-panel p-12 text-center space-y-4 border border-white/[0.08]">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto text-slate-400">
            <Search size={24} />
          </div>
          <h3 className="text-base font-bold text-white">No Properties Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {activeTab === 'unlocked'
              ? 'You have not unlocked any property dossiers yet. Browse all available assets and unlock complete dossiers using your credits.'
              : activeTab === 'saved'
              ? 'No properties bookmarked yet. Tap the bookmark icon on any auction to save it.'
              : 'No published auctions match your current city, category, or search filters.'}
          </p>
          <button
            onClick={() => { setSelectedCity('all'); setSelectedCat('all'); setSearchQuery(''); setActiveTab('all'); }}
            className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white font-medium"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((lot) => {
            const isUnlocked = unlockedIds.has(lot.id);
            const daysLeft = getDaysRemaining(lot.auctionStartDate);

            return (
              <div
                key={lot.id}
                className={`group rounded-3xl bg-[#0b101e] border flex flex-col justify-between overflow-hidden shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  isUnlocked ? 'border-emerald-500/40 hover:border-emerald-400' : 'border-white/[0.08] hover:border-sky-400/30'
                }`}
              >
                <div>
                  {/* Photo & Top Badges */}
                  <div className="relative h-48 overflow-hidden bg-slate-950">
                    <img
                      src={lot.primaryImageUrl || '/images/chennai-flat-1.jpg'}
                      alt={lot.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/images/chennai-flat-1.jpg'; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    {/* Top Status Badge */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                      {isUnlocked ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 backdrop-blur-md text-slate-950 font-mono text-[10px] font-bold flex items-center gap-1 shadow-lg">
                          <CheckCircle2 size={12} />
                          <span>DOSSIER UNLOCKED</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-400/40 text-amber-300 font-mono text-[10px] font-bold flex items-center gap-1 shadow-lg">
                          <Lock size={12} />
                          <span>PRO GATED</span>
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-mono border border-white/10">
                        {daysLeft > 0 ? `${daysLeft}d left` : 'Auction today'}
                      </span>
                    </div>

                    {/* Bottom Photo Info */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <span className="font-semibold text-xs drop-shadow truncate">
                        {isUnlocked ? (lot.bankName || lot.bank?.name || 'Bank Auction') : (lot.bankName ? `${lot.bankName} (Lender)` : 'Verified Lender')}
                      </span>
                      <span className="text-[11px] font-mono text-sky-400 uppercase">
                        {lot.category?.short || lot.category?.name || 'Asset'}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-4">
                    {/* Location & Title */}
                    <div>
                      <p className="flex items-center gap-1 text-[11px] text-slate-400 capitalize mb-1">
                        <MapPin size={12} className="text-sky-400 shrink-0" />
                        <span>{lot.locality ? `${lot.locality}, ` : ''}{lot.city}</span>
                      </p>
                      <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug group-hover:text-sky-400 transition-colors">
                        {lot.title}
                      </h3>
                    </div>

                    {/* Financial Metrics */}
                    <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">Reserve Price</span>
                        <span className="text-sm font-mono font-bold text-white">
                          {lot.reservePrice ? formatINR(lot.reservePrice) : 'See Notice'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">10% EMD Required</span>
                        <span className="text-sm font-mono font-bold text-sky-400">
                          {lot.reservePrice ? formatINR(lot.reservePrice * 0.10) : 'See Notice'}
                        </span>
                      </div>
                    </div>

                    {/* Information Masking Demonstration Box */}
                    <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2 text-xs">
                      {/* Notice PDF status */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <FileText size={12} /> Original Notice PDF:
                        </span>
                        {isUnlocked ? (
                          <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                            <CheckCircle2 size={11} /> Ready to Download
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px] font-mono flex items-center gap-1">
                            <Lock size={10} /> Masked (Unlock)
                          </span>
                        )}
                      </div>

                      {/* Bank Officer Contact */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <Building2 size={12} /> Lender Officer Contact:
                        </span>
                        {isUnlocked ? (
                          <span className="text-emerald-400 text-[11px] font-semibold">
                            Full Phone & Branch Access
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px] font-mono tracking-wider">
                            •••••••••• (Locked)
                          </span>
                        )}
                      </div>

                      {/* Civil Engineer Ground Survey */}
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[11px] flex items-center gap-1">
                          <ShieldCheck size={12} /> Ground Survey & Photos:
                        </span>
                        {isUnlocked ? (
                          <span className="text-emerald-400 text-[11px] font-semibold">
                            Verified on Foot
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px] font-mono">
                            Available in Dossier
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 pt-0 border-t border-white/[0.06] flex items-center gap-2">
                  <Link
                    to={`/lot/${lot.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-center text-white font-semibold transition-colors"
                  >
                    {isUnlocked ? 'View Unlocked Dossier' : 'Inspect Details'}
                  </Link>

                  {!isUnlocked && (
                    <button
                      onClick={() => { setTargetLot(lot); setUnlockMessage(null); }}
                      className="py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-sky-500/20 active:scale-95"
                      title="Unlock complete lender dossier using 1 credit"
                    >
                      <Unlock size={14} />
                      <span>Unlock</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. UNLOCK DOSSIER MODAL */}
      {/* ======================================================== */}
      {targetLot && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0b101e] border border-white/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 relative">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Unlock size={20} className="text-sky-400" />
                <h3 className="text-lg font-bold text-white">Unlock Comprehensive Dossier</h3>
              </div>
              <button
                onClick={() => setTargetLot(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {unlockMessage ? (
              <div className={`p-5 rounded-2xl space-y-3 ${
                unlockMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                  : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {unlockMessage.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                  <span>{unlockMessage.type === 'success' ? 'Unlock Successful!' : 'Unlock Failed'}</span>
                </div>
                <p className="text-xs leading-relaxed">{unlockMessage.text}</p>
                <div className="flex gap-2 pt-2">
                  <Link
                    to={`/lot/${targetLot.id}`}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-center font-bold text-xs"
                  >
                    Open Dossier Page Now →
                  </Link>
                  <button
                    onClick={() => setTargetLot(null)}
                    className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Property Summary */}
                <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-1">
                  <span className="text-[10px] font-mono uppercase text-sky-400 block">
                    {targetLot.city} · {targetLot.category?.name || 'Property'}
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-2">{targetLot.title}</h4>
                  <p className="text-xs font-mono text-slate-300 pt-1">
                    Reserve: <strong className="text-white">{formatINR(targetLot.reservePrice)}</strong>
                  </p>
                </div>

                {/* What gets unlocked */}
                <div className="space-y-2">
                  <span className="text-xs font-mono uppercase text-slate-400 block">
                    What You Will Unlock Permanently:
                  </span>
                  <ul className="text-xs text-slate-300 space-y-2 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Original Lender Notice PDF download link</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Authorized Recovery Officer phone, email & branch address</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Chartered Civil Engineer physical site survey & valuation estimate</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>Ground photographs shot by on-foot inspection team</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      <span>30-Year Encumbrance Certificate (EC) title scrutiny report</span>
                    </li>
                  </ul>
                </div>

                {/* Credit balance check */}
                <div className="p-3.5 rounded-2xl bg-sky-500/10 border border-sky-400/20 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-300 block">Your Unlock Balance:</span>
                    <span className="text-slate-400 text-[11px]">Cost for this property: 1 Credit</span>
                  </div>
                  <span className="text-base font-mono font-bold text-sky-400">
                    {user?.unlocksRemaining ?? 0} Credits
                  </span>
                </div>

                {(user?.unlocksRemaining || 0) <= 0 ? (
                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-amber-300 flex items-center gap-1.5">
                      <AlertTriangle size={14} /> You have 0 unlocks remaining. Get a Pro Pack to unlock 5 properties.
                    </p>
                    <Link to="/pricing" className="block">
                      <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-bold text-xs tracking-wider transition-all">
                        Get Pro Pack (₹699 for 5 properties)
                      </button>
                    </Link>
                  </div>
                ) : (
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setTargetLot(null)}
                      className="flex-1 py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-xs text-white font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmUnlock}
                      disabled={unlocking}
                      className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold text-xs tracking-wider transition-all shadow-lg shadow-sky-500/20 active:scale-95 disabled:opacity-50"
                    >
                      {unlocking ? 'Unlocking...' : 'Confirm Unlock (1 Credit)'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyerDashboardPage;
