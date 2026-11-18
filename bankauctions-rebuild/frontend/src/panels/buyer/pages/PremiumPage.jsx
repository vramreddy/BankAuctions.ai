import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCity } from '../../../contexts/CityContext';
import { PROTOTYPE_DATA } from '../../../data/prototypeData';
import {
  Sparkles,
  CheckCircle2,
  Lock,
  ArrowRight,
  Heart,
  ShieldCheck,
  Building2,
  Compass,
  MapPin
} from 'lucide-react';

export default function PremiumPage() {
  const { selectedCity, setCity, allCities } = useCity();
  const [selectedPlan, setSelectedPlan] = useState(2); // 1, 2, or 3 months
  const [isSubscribed, setIsSubscribed] = useState(false);

  const activeCityKey = selectedCity.toLowerCase();
  const cityInfo = PROTOTYPE_DATA.cities[activeCityKey] || PROTOTYPE_DATA.cities.chennai;
  const cityName = cityInfo.label;

  // Filter premium properties for selected city
  const premiumListings = useMemo(() => {
    return PROTOTYPE_DATA.props.filter(p => p.city === activeCityKey && p.premium);
  }, [activeCityKey]);

  const plans = [
    { months: 1, price: '₹1,499', discount: null, popular: false },
    { months: 2, price: '₹2,699', discount: 'Save 10%', popular: true },
    { months: 3, price: '₹3,499', discount: 'Save 22%', popular: false }
  ];

  const handleSubscribe = () => {
    setIsSubscribed(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Premium</span>
        </div>

        <span className="inline-block px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-black tracking-wider uppercase">
          PREMIUM
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Premium properties, curated for your city.
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
          A separate plan from Pro. It opens a hand-curated list of highway, corner and high-commercial-value properties from every category, for the one city where you are located.
        </p>
      </div>

      {/* 3 Value Pillars */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <h3 className="text-lg font-bold text-white">Highway frontage</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Plots, showrooms and warehouses on national and state highways with verified road clearances.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <h3 className="text-lg font-bold text-white">Corner properties</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Two-side-open flats, plots and shops that enjoy superior light, ventilation and resell faster.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <h3 className="text-lg font-bold text-white">High commercial value</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Offices, retail and industrial assets in established enterprise corridors and growth centers.
          </p>
        </div>
      </div>

      {/* Plan Selection Box */}
      <section className="rounded-3xl bg-slate-900/80 border border-white/15 p-8 sm:p-10 space-y-8 shadow-2xl">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Choose your plan</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Premium covers one city. Pro is a separate pack and can be combined.
          </p>
        </div>

        {/* 3 Duration Cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((pl) => (
            <div
              key={pl.months}
              onClick={() => setSelectedPlan(pl.months)}
              className={`p-6 rounded-2xl border cursor-pointer transition-all relative ${
                selectedPlan === pl.months
                  ? 'bg-rose-500/10 border-rose-500 shadow-lg shadow-rose-950/30'
                  : 'bg-white/[0.04] border-white/10 hover:border-white/25'
              }`}
            >
              {pl.discount && (
                <span className="absolute top-4 right-4 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase">
                  {pl.discount}
                </span>
              )}

              <h4 className="text-base font-bold text-white">{pl.months} month{pl.months > 1 ? 's' : ''}</h4>
              <div className="text-2xl font-black text-white mt-1 mb-4">
                {pl.price} <small className="text-xs text-slate-400 font-normal">total</small>
              </div>

              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Curated list for {cityName}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Prices, EMD and rank breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                  <span>Field verification photographs</span>
                </li>
              </ul>
            </div>
          ))}
        </div>

        {/* Subscribe Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold text-slate-300">
              City:
              <select
                value={selectedCity}
                onChange={(e) => setCity(e.target.value)}
                className="ml-2 rounded-xl bg-slate-800 border border-white/20 px-3 py-1.5 text-xs text-white"
              >
                {Object.entries(allCities || {}).map(([k, v]) => (
                  <option key={k} value={k}>{v.name}</option>
                ))}
              </select>
            </label>
            <div className="text-xs text-slate-400">
              Selected: <b className="text-white">{selectedPlan} Month Plan ({plans.find(p => p.months === selectedPlan)?.price})</b>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSubscribe}
              className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
            >
              {isSubscribed ? 'Premium Unlocked (Active)' : 'Unlock Premium Access'}
            </button>
            <span className="text-[11px] text-slate-400">
              Instant activation
            </span>
          </div>
        </div>

        {isSubscribed && (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Premium is active for {cityName}. All lenders, exact micro-localities, and field verification photographs below are unlocked.</span>
          </div>
        )}
      </section>

      {/* Curated Grid of Properties in this City */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white">
            Premium properties in <span className="text-rose-400">{cityName}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isSubscribed
              ? `Displaying full verified details for all ${premiumListings.length} premium properties in ${cityName}.`
              : 'The price is shown. The lender and exact locality unlock with Premium for this city.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiumListings.map((p) => {
            const hasHighway = p.flags?.includes('highway');
            const hasCorner = p.flags?.includes('corner');
            const hasCommercial = p.flags?.includes('commercial');

            return (
              <Link
                key={p.id}
                to={`/lot/${p.id}`}
                className="group block rounded-2xl overflow-hidden bg-slate-900/60 border border-white/10 hover:border-rose-500/40 transition-all hover:shadow-2xl hover:shadow-rose-950/20"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img
                    src={`/img/${p.img}`}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-white text-slate-950 rounded-xl px-2.5 py-1 text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
                    <span className="text-rose-600 font-black">#{p.rank}</span>
                    <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider leading-none">
                      AI rank<br />{p.cat}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-rose-400">
                    <Heart size={15} />
                  </div>

                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="bg-slate-950/90 text-white border border-white/20 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                      {isSubscribed ? '✓ Premium Unlocked' : '🔒 Premium'}
                    </span>
                    {p.bank_photos ? (
                      <span className="bg-white/90 text-slate-900 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                        Bank supplied
                      </span>
                    ) : (
                      <span className="bg-white/80 text-slate-900 rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                        Representative
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-rose-400 transition-colors">
                    {p.short} · {isSubscribed ? p.loc : 'Premium location'}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {isSubscribed ? p.bank : 'Lender shown on Premium'} · closes in {p.days} days
                  </p>

                  {(hasHighway || hasCorner || hasCommercial) && (
                    <div className="text-[11.5px] font-bold text-rose-400">
                      ★ {hasHighway ? 'Highway frontage' : ''}
                      {hasHighway && hasCommercial ? ' · ' : ''}
                      {hasCorner ? 'Corner property' : ''}
                      {hasCorner && hasCommercial ? ' · ' : ''}
                      {hasCommercial && !hasHighway && !hasCorner ? 'High commercial value' : ''}
                    </div>
                  )}

                  <div className="flex items-baseline justify-between pt-2 border-t border-white/[0.08]">
                    <span className="text-base font-extrabold text-white">
                      {p.reserve >= 100 ? `₹${(p.reserve / 100).toFixed(2)} Cr` : `₹${p.reserve.toFixed(1)} L`}
                    </span>
                    <span className="text-xs font-semibold text-rose-400">
                      {p.disc}% below market
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
