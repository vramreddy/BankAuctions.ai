import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Lock,
  Sparkles,
  Shield,
  ArrowRight,
  HelpCircle,
  Building2,
  Home,
  MapPin,
  Truck,
  Store,
  Warehouse,
  FileCheck
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';

// Pricing tiers mapped by Asset Class — All 5 lots are standardized at ₹699
const ASSET_PRICING = {
  flats: {
    name: 'Flats & houses',
    desc: 'Residential apartments, builder floors, bungalows and independent villas.',
    icon: Home,
    pro: 699,
    gold: 1599,
    diamond: 2299,
    isDefault: true
  },
  plots: {
    name: 'Plots & land',
    desc: 'Residential layouts, commercial development parcels and agricultural farmland.',
    icon: MapPin,
    pro: 699,
    gold: 1599,
    diamond: 2299,
    isDefault: false
  },
  commercial: {
    name: 'Shops & offices',
    desc: 'High-street retail showrooms, IT park suites and corporate commercial floors.',
    icon: Store,
    pro: 699,
    gold: 1599,
    diamond: 2299,
    isDefault: false
  },
  industrial: {
    name: 'Warehouses & industrial',
    desc: 'Manufacturing facilities, logistics hubs, godowns and industrial sheds.',
    icon: Warehouse,
    pro: 699,
    gold: 1599,
    diamond: 2299,
    isDefault: false
  },
  vehicles: {
    name: 'Vehicles & machinery',
    desc: 'Commercial truck fleets, passenger cars, tractors, plant & heavy equipment.',
    icon: Truck,
    pro: 699,
    gold: 1599,
    diamond: 2299,
    isDefault: false
  }
};

export function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Selected asset class
  const [selectedAsset, setSelectedAsset] = useState('flats');
  const currentPricing = ASSET_PRICING[selectedAsset] || ASSET_PRICING.flats;

  const handleSelectPlan = (planName, price) => {
    if (!user) {
      navigate('/login?redirect=/pricing');
      return;
    }
    alert(
      `Plan Selected: ${planName} for ${currentPricing.name} (${price}).\n\nIn production, this initiates the authorized payment gateway for immediate instant unlock.`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* ======================================================== */}
      {/* 1. Header Section */}
      {/* ======================================================== */}
      <div className="text-center max-w-4xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-mono text-brand-cyan uppercase tracking-wider mb-2">
          <Sparkles size={14} className="text-brand-cyan" />
          <span>Transparent Pricing · SARFAESI & DRT Foreclosures</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-[2.75rem] font-extrabold text-white tracking-tight leading-tight">
          Searching is free. ₹699 for five properties, ₹4,999 for the whole truth on one.
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl mx-auto">
          Pro at ₹699 opens the details on five properties in one city. The ₹4,999 research report brings the field engineer and an advocate to the one you will bid on. Concierge Services takes over after you win.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
          <span>Flat, transparent rate of <strong className="text-white">₹699</strong> across all asset classes.</span>
          <a href="#asset-class-pricing" className="text-brand-cyan hover:underline font-medium inline-flex items-center gap-1">
            Explore asset classes below <ArrowRight size={13} />
          </a>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. Primary Plans Comparison Grid (Free vs Pro) */}
      {/* ======================================================== */}
      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        {/* FREE CARD */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-white/10 flex flex-col justify-between relative shadow-xl hover:border-white/20 transition-all">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-2xl font-black text-white">Free</h3>
              <span className="px-3 py-1 rounded-full bg-white/5 text-slate-300 font-mono text-xs border border-white/10">
                Forever
              </span>
            </div>

            <div className="mb-4">
              <span className="text-4xl font-extrabold text-white">₹0</span>
            </div>

            <p className="text-sm font-medium text-slate-300 mb-6 pb-4 border-b border-white/10">
              Search every listing, no card needed
            </p>

            {/* Included in Free */}
            <div className="space-y-3 mb-6">
              <p className="text-xs font-mono uppercase tracking-wider text-slate-400">Included search access:</p>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-brand-cyan shrink-0 mt-0.5" />
                  <span>Search in your own words or by filters</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-brand-cyan shrink-0 mt-0.5" />
                  <span>Location, type, reserve price, EMD and auction date</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-brand-cyan shrink-0 mt-0.5" />
                  <span>Results on the map and the EMD closing countdown</span>
                </li>
              </ul>
            </div>

            {/* MASKED UNTIL PRO */}
            <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/10 space-y-2.5 mb-6">
              <p className="text-[11px] font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5 font-bold">
                <Lock size={13} className="text-amber-400" />
                MASKED UNTIL YOU TAKE PRO
              </p>
              <ul className="space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>Name of the lender, and the notice to download</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>The bank's photographs and the exact pincode</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>Guideline value, suggested bid and similar properties</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                  <span>Saved searches and alerts</span>
                </li>
              </ul>
            </div>
          </div>

          <Link
            to="/search"
            className="w-full py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-center text-sm transition-all block shadow-md"
          >
            Start searching · free
          </Link>
        </div>

        {/* PRO CARD (RECOMMENDED) */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-brand-900/90 via-slate-900 to-slate-950 border-2 border-brand-cyan shadow-2xl flex flex-col justify-between transition-all hover:shadow-brand-cyan/20">
          {/* Recommended Badge */}
          <div className="absolute -top-3.5 right-6">
            <span className="px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-brand-cyan text-slate-950 shadow-lg">
              Recommended
            </span>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <h3 className="text-2xl font-black text-white">Pro</h3>
              <span className="px-3 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan font-mono text-xs border border-brand-cyan/40">
                five properties · one city
              </span>
            </div>

            <div className="mb-4 flex items-baseline gap-2">
              <span className="text-4xl font-extrabold text-white">₹699</span>
              <span className="text-xs text-slate-400 font-mono">one-time pack</span>
            </div>

            <p className="text-sm font-semibold text-brand-cyan mb-6 pb-4 border-b border-white/10">
              Opens everything the bank provided on a property
            </p>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200 mb-8">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-brand-cyan shrink-0 mt-0.5" />
                <span className="font-medium">Full details of 5 properties in one city</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-brand-cyan shrink-0 mt-0.5" />
                <span>Lender name and the notice to download</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-brand-cyan shrink-0 mt-0.5" />
                <span>Bank photographs and documents on file</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-brand-cyan shrink-0 mt-0.5" />
                <span>Guideline value and suggested max bid</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-brand-cyan shrink-0 mt-0.5" />
                <span className="text-emerald-400 font-semibold">Stays unlocked permanently — use it anytime</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 size={18} className="text-brand-cyan shrink-0 mt-0.5" />
                <span>Receipt for every payment</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPlan('Pro', '₹699')}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-cyan to-blue-600 hover:from-cyan-300 hover:to-blue-500 text-slate-950 font-black text-center text-sm shadow-xl shadow-brand-cyan/25 transition-all active:scale-[0.98]"
          >
            Get Pro · ₹699
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. Multi-Property Bulk Packs: "More listings, one payment" */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            More listings, one payment
          </h2>
          <p className="text-sm text-slate-400">
            Same one-time unlock as Pro, sized for buyers comparing many properties in one city.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* GOLD PACK */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-amber-500/30 bg-gradient-to-b from-amber-500/10 to-slate-950 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
                  GOLD
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Save 25%
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  ₹1,599
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-200 mb-4">
                15 properties, one city
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Full dossier access for 15 properties including lender identity, original SARFAESI notices, valuation reports, and tax receipts.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('Gold', '₹1,599')}
              className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-amber-400/15"
            >
              Get Gold
            </button>
          </div>

          {/* DIAMOND PACK */}
          <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-indigo-500/30 bg-gradient-to-b from-indigo-500/10 to-slate-950 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono font-bold tracking-widest text-indigo-400 uppercase">
                  DIAMOND
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-400/20 text-indigo-300 border border-indigo-400/30">
                  Best Value · Save 35%
                </span>
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl sm:text-4xl font-black text-white">
                  ₹2,299
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-200 mb-4">
                25 properties, one city
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                Maximum exploration power for active investors and family offices looking across deep city-wide auction catalogs.
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan('Diamond', '₹2,299')}
              className="w-full py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/20"
            >
              Get Diamond
            </button>
          </div>
        </div>

        {/* Coverage explanation */}
        <p className="text-xs text-slate-400 text-center max-w-3xl mx-auto leading-relaxed pt-2">
          Packs cover one city, 90 days, and include everything Pro unlocks — lender name, notice download, photographs, tax receipts, price history — just across more properties. Add another city by buying a pack for it; each city is tracked separately.
        </p>
      </section>

      {/* ======================================================== */}
      {/* 4. Deep Research & Field Report Spotlight (₹4,999) */}
      {/* ======================================================== */}
      <section className="glass-panel rounded-3xl p-6 sm:p-10 border border-emerald-500/30 bg-gradient-to-r from-slate-950 via-emerald-950/20 to-slate-950 shadow-2xl relative overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-medium">
              <FileCheck size={14} className="text-emerald-400" />
              <span>Full On-Foot Due Diligence</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Research & Field Report · ₹4,999 per property
            </h3>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              The checker's verification, the field engineer's ground report with photographs and videos, the verified guideline value and a recommended bid range. Available once a property has been verified and published — open it from Search and buy it on its page.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Ground Engineer Visit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Physical Videos & Photos</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Empanelled Advocate Review</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:items-end justify-center">
            <Link
              to="/search"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 flex items-center gap-2 transition-transform active:scale-95 text-center"
            >
              <span>Explore Verified Lots</span>
              <ArrowRight size={16} />
            </Link>
            <span className="text-[11px] font-mono text-slate-400 mt-2">
              Purchase directly on any published property page
            </span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. Pricing by Asset Class (Standardized ₹699 for 5 lots) */}
      {/* ======================================================== */}
      <section id="asset-class-pricing" className="space-y-6 pt-4 border-t border-white/10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Pricing by asset class
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            All asset categories share the same transparent rate of ₹699 for a 5-lot Pro Pack. Select a card below to explore specifics for each category.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {Object.entries(ASSET_PRICING).map(([key, item]) => {
            const Icon = item.icon;
            const isSelected = selectedAsset === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedAsset(key)}
                className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'bg-brand-cyan/15 border-brand-cyan shadow-lg shadow-brand-cyan/15 -translate-y-1'
                    : 'glass-panel border-white/10 hover:border-white/20 hover:bg-white/[0.03]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <Icon className={`w-5 h-5 ${isSelected ? 'text-brand-cyan' : 'text-slate-400'}`} />
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-white mb-1">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">{item.desc}</p>
                </div>

                <div className="pt-2 border-t border-white/10 font-mono text-xs">
                  <span className="text-[10px] uppercase text-slate-500 block">Pro Pack (5 lots)</span>
                  <span className="text-base font-bold text-brand-cyan">
                    ₹699
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. Frequently Asked Questions */}
      {/* ======================================================== */}
      <div className="max-w-3xl mx-auto space-y-6 pt-8 border-t border-white/10">
        <h2 className="text-xl font-bold text-white text-center">Frequently Asked Questions</h2>
        <div className="space-y-4 text-xs text-slate-300">
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h4 className="font-bold text-white text-sm mb-1.5">Do my Pro pack unlocks ever expire?</h4>
            <p className="text-slate-400 leading-relaxed">
              No. Your 5 property unlocks in a Pro pack stay permanently in your account until you choose to unlock a lot. Once unlocked, every property dossier remains accessible forever in your account archive.
            </p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h4 className="font-bold text-white text-sm mb-1.5">What is the difference between Pro and the ₹4,999 Research Report?</h4>
            <p className="text-slate-400 leading-relaxed">
              Pro opens all the documents provided by the bank (SARFAESI notice, reserve price breakdown, bank photographs, and guideline values). The ₹4,999 Research Report sends our licensed civil engineer and advocate to the property physically to verify boundaries, road access, and occupancy status.
            </p>
          </div>
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h4 className="font-bold text-white text-sm mb-1.5">What happens after I win an auction?</h4>
            <p className="text-slate-400 leading-relaxed">
              Our Concierge Services team assists you with Sale Certificate registration, Sub-Registrar Office stamping, and liaison with the bank's Authorised Officer to ensure smooth physical handover.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PricingPage;
