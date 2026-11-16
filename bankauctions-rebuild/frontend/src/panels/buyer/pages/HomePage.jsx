import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ArrowRight,
  MapPin,
  Clock,
  FileText,
  Sparkles,
  ArrowUpRight,
  CheckCircle2
} from 'lucide-react';
import { useCity } from '../../../contexts/CityContext';
import { api } from '../../../services/api';
import { Button } from '../../../components/common/Button';
import { CATEGORY_DETAILS } from '@shared/constants/categories.js';
import { formatINR } from '../../../utils/formatters';

// Modular Protected Trust & Action Components
import PromoterBanksMarquee from '../../../components/trust/PromoterBanksMarquee';
import HowItWorksJourney from '../../../components/trust/HowItWorksJourney';
import AuctionActionHub from '../../../components/actions/AuctionActionHub';
import PropertySelectionDock from '../../../components/actions/PropertySelectionDock';
import SupportHelpSection from '../../../components/trust/SupportHelpSection';

export default function HomePage() {
  const { selectedCity, allCities } = useCity();
  const navigate = useNavigate();

  const [city, setCity] = useState(selectedCity);
  const [cat, setCat] = useState('');
  const [budget, setBudget] = useState('');
  const [query, setQuery] = useState('');
  const [listings, setListings] = useState([]);
  const [status, setStatus] = useState('loading');
  const [retry, setRetry] = useState(0);

  // Multi-property selection state for selection actions
  const [selectedLots, setSelectedLots] = useState([]);

  useEffect(() => {
    let active = true;
    setStatus('loading');
    api.getAuctions({ city, limit: 3, sort: 'rank' })
      .then(res => {
        if (!res.success || !Array.isArray(res.data)) throw new Error('Unavailable');
        if (active) {
          setListings(res.data.slice(0, 3));
          setStatus('ready');
        }
      })
      .catch(() => {
        if (active) setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [city, retry]);

  const search = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({ city });
    if (cat) params.set('cat', cat);
    if (budget) params.set('maxBudget', budget);
    if (query.trim()) params.set('search', query.trim());
    navigate(`/search?${params}`);
  };

  const toggleSelectLot = (lot, e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedLots(prev => {
      const exists = prev.some(item => item.id === lot.id);
      if (exists) {
        return prev.filter(item => item.id !== lot.id);
      } else {
        return [...prev, lot];
      }
    });
  };

  const inputClass = 'w-full rounded-xl glass-input px-3.5 py-3 text-sm';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
      {/* ======================================================== */}
      {/* 1. HERO SECTION: Clean institutional matching graphic */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-[#070b16] border border-white/[0.08] p-6 sm:p-10 lg:p-12 shadow-2xl mt-4">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Typography & Verification Signals */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Live City Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.04] border border-emerald-500/30 text-xs font-medium text-emerald-400 w-fit mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>Live in {allCities[city]?.name || 'Chennai'}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.5rem] font-black tracking-tight text-white leading-[1.12]">
              Every bank<br />
              auction, and the<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#93c5fd] via-[#a5b4fc] to-[#c4b5fd]">
                data to bid right.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed mt-5 max-w-xl">
              Verified listings from banks, NBFCs, co-operatives and courts across {allCities[city]?.name || 'Chennai'} — each carrying fair value, confirmed clearing prices, possession risk and photographs shot by our own field team.
            </p>

            {/* 3 Verification Checkmarks */}
            <div className="flex flex-wrap items-center gap-y-2.5 gap-x-6 mt-7 text-xs font-medium text-slate-300">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Banks, NBFCs & courts</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Possession risk checked</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Field-verified on foot</span>
              </span>
            </div>
          </div>

          {/* Right Column: Hero Graphic */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <img
              src="/images/hero-grid-perfect.png"
              alt="Verified Bank Auction Properties - Villas, Commercial & Land"
              className="w-full max-w-md lg:max-w-none h-auto object-contain rounded-2xl select-none"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PROMOTER BANKS: Professional Carousel with Logos */}
      {/* ======================================================== */}
      <PromoterBanksMarquee />

      {/* ======================================================== */}
      {/* 3. SEARCH BANK AUCTIONS */}
      {/* ======================================================== */}
      <section id="property-search" className="glass-panel rounded-2xl p-5 sm:p-6 scroll-mt-24" aria-label="Search auction properties">
        <div className="flex flex-wrap gap-4 justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-white">Search bank auction properties</h2>
          <Link to="/search" className="text-xs text-brand-cyan flex items-center gap-1 hover:underline">
            All filters <ArrowUpRight size={14} />
          </Link>
        </div>

        <form onSubmit={search} className="grid sm:grid-cols-2 lg:grid-cols-12 gap-4 items-end">
          <label className="lg:col-span-2">
            <span className="block text-xs text-slate-400 mb-2">City / region</span>
            <select className={inputClass} value={city} onChange={e => setCity(e.target.value)}>
              {Object.entries(allCities).map(([key, value]) => (
                <option key={key} value={key}>{value.name}</option>
              ))}
            </select>
          </label>

          <label className="lg:col-span-3">
            <span className="block text-xs text-slate-400 mb-2">Property type</span>
            <select className={inputClass} value={cat} onChange={e => setCat(e.target.value)}>
              <option value="">All property types</option>
              {Object.values(CATEGORY_DETAILS).map(value => (
                <option key={value.slug} value={value.slug}>{value.name}</option>
              ))}
            </select>
          </label>

          <label className="lg:col-span-2">
            <span className="block text-xs text-slate-400 mb-2">Maximum budget</span>
            <select className={inputClass} value={budget} onChange={e => setBudget(e.target.value)}>
              <option value="">Any budget</option>
              <option value="2500000">₹25 lakh</option>
              <option value="5000000">₹50 lakh</option>
              <option value="10000000">₹1 crore</option>
              <option value="50000000">₹5 crore</option>
            </select>
          </label>

          <label className="lg:col-span-3">
            <span className="block text-xs text-slate-400 mb-2">Locality or keyword</span>
            <input
              className={inputClass}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Area, property, or bank name"
            />
          </label>

          <Button type="submit" className="lg:col-span-2 h-11" icon={<Search size={16} />}>
            Search
          </Button>
        </form>

        <div className="flex flex-wrap gap-x-5 gap-y-3 mt-5 pt-4 border-t border-white/10 text-xs">
          <span className="text-slate-500">Browse by type</span>
          {Object.values(CATEGORY_DETAILS).map(value => (
            <Link key={value.slug} className="text-slate-300 hover:text-brand-cyan" to={`/search?city=${city}&cat=${value.slug}`}>
              {value.short}
            </Link>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. ACTION HUB: EMD Calculator, Alerts & SARFAESI Audit */}
      {/* ======================================================== */}
      <AuctionActionHub />

      {/* ======================================================== */}
      {/* 6. EXPLORE AUCTIONS: Grid with multi-select dock support */}
      {/* ======================================================== */}
      <section className="mt-8">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Explore auctions in {allCities[city]?.name || city}
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Explore homes, land, commercial spaces and vehicles. Select assets to compare, calculate joint EMD, or export.
            </p>
          </div>
          <Link to={`/search?city=${city}`} className="text-sm text-brand-cyan flex items-center gap-2 hover:underline">
            View all assets <ArrowRight size={16} />
          </Link>
        </div>

        {/* City Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6" aria-label="Select listing location">
          {Object.entries(allCities).map(([key, value]) => (
            <button
              key={key}
              onClick={() => setCity(key)}
              aria-pressed={city === key}
              className={`px-4 py-2 rounded-lg border text-xs transition-colors ${
                city === key
                  ? 'border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan font-medium'
                  : 'border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {value.name}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        {status === 'loading' ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" role="status" aria-label="Loading properties">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-80 rounded-2xl bg-slate-900 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : status === 'error' ? (
          <div className="glass-panel rounded-2xl p-8 text-center" role="status">
            <p className="text-slate-300 mb-4">We couldn’t load properties. Please try again.</p>
            <Button onClick={() => setRetry(retry + 1)} variant="secondary">Retry</Button>
          </div>
        ) : !listings.length ? (
          <div className="glass-panel rounded-2xl p-8 text-slate-400">
            No published properties in this location yet. Select another city to continue exploring.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {listings.map(item => {
              const date = item.auctionStartDate ? new Date(item.auctionStartDate) : null;
              const validDate = date && !Number.isNaN(date.getTime());
              const isSelected = selectedLots.some(s => s.id === item.id);

              return (
                <div
                  key={item.id}
                  className={`group relative glass-panel-interactive rounded-2xl overflow-hidden transition-all duration-300 ${
                    isSelected ? 'ring-2 ring-brand-cyan border-brand-cyan/50' : ''
                  }`}
                >
                  {/* Select Checkbox for Selection-wise actions */}
                  <button
                    onClick={(e) => toggleSelectLot(item, e)}
                    className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur-md border border-white/20 text-xs font-mono text-white hover:bg-slate-900 transition-colors"
                    title={isSelected ? 'Deselect lot' : 'Select lot for comparison'}
                  >
                    <span className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-brand-cyan border-brand-cyan text-slate-950' : 'border-white/40'
                    }`}>
                      {isSelected && '✓'}
                    </span>
                    <span className="text-[11px]">{isSelected ? 'Selected' : 'Select'}</span>
                  </button>

                  <Link to={`/lot/${item.id}`} className="block focus-visible:outline-none">
                    <div className="relative h-48 overflow-hidden bg-slate-900">
                      <span className="absolute bottom-3 left-3 z-10 rounded-md bg-slate-950/85 px-2.5 py-1 text-[11px] font-medium text-white">
                        {item.isDemo ? 'Demo · ' : ''}{item.category?.name || 'Asset'}
                      </span>
                      <img
                        src={item.primaryImageUrl || '/images/chennai-flat-1.jpg'}
                        alt={item.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={e => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/images/chennai-flat-1.jpg';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                      <span className="absolute bottom-3 left-4 text-xs font-semibold text-white drop-shadow">
                        {item.bankName || item.bank?.name || 'View bank details'}
                      </span>
                    </div>

                    <div className="p-5">
                      <p className="flex gap-1 items-center text-xs text-slate-400 capitalize">
                        <MapPin size={13} />
                        {item.locality ? `${item.locality}, ` : ''}{allCities[item.city]?.name || item.city}
                      </p>
                      <h3 className="text-base font-semibold text-white mt-2 mb-5 line-clamp-2 min-h-12 group-hover:text-brand-cyan transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-end justify-between gap-2 border-t border-white/10 pt-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Reserve price</p>
                          <p className="font-mono text-xl font-bold text-white">
                            {item.reservePrice ? formatINR(item.reservePrice) : 'See notice'}
                          </p>
                        </div>
                        <ArrowUpRight size={20} className="text-brand-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                      <p className="flex gap-2 items-center text-[11px] text-slate-400 mt-4">
                        <Clock size={13} />
                        {validDate
                          ? `${date < new Date() ? 'Scheduled date' : 'Auction date'}: ${date.toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              timeZone: 'Asia/Kolkata'
                            })}`
                          : 'Check notice for auction date'}
                      </p>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* 7. SIMPLIFIED AUCTION JOURNEY (3 Steps: 01, 02, 03) */}
      {/* ======================================================== */}
      <div className="pt-4">
        <HowItWorksJourney />
      </div>

      {/* ======================================================== */}
      {/* 9. KNOWLEDGE HUBS: AI Rank & Due Diligence Guide */}
      {/* ======================================================== */}
      <section className="grid md:grid-cols-2 gap-5 pt-4">
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <Sparkles className="text-brand-cyan mb-4" size={24} />
          <h2 className="text-xl font-bold text-white">What’s behind an AI Rank?</h2>
          <p className="text-sm text-slate-400 leading-relaxed mt-3 mb-5">
            Understand how valuation, possession, location, and title information inform a property’s rank. Use the score to guide your research, then review the underlying details.
          </p>
          <Link to="/ai-rank" className="text-sm text-brand-cyan inline-flex items-center gap-2 hover:underline">
            Understand the ranking <ArrowRight size={15} />
          </Link>
        </div>

        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <FileText className="text-amber-400 mb-4" size={24} />
          <h2 className="text-xl font-bold text-white">Before you commit to a bid</h2>
          <ul className="text-sm text-slate-400 mt-3 mb-5 space-y-2 list-disc pl-4">
            <li>Read the original bank notice and deposit deadline.</li>
            <li>Check possession status and available documents.</li>
            <li>Arrange an inspection and independent legal review.</li>
          </ul>
          <Link to="/guides" className="text-sm text-brand-cyan inline-flex items-center gap-2 hover:underline">
            Read the buyer guide <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 10. SUPPORT & HELP: Exact Reference Implementation */}
      {/* ======================================================== */}
      <div className="pt-6">
        <SupportHelpSection />
      </div>

      {/* Floating Selection Dock when properties are checked */}
      <PropertySelectionDock
        selectedLots={selectedLots}
        onClearSelection={() => setSelectedLots([])}
      />
    </div>
  );
}
