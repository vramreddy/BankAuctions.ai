import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCity } from '../../../contexts/CityContext';
import {
  PROTOTYPE_DATA,
  PROTOTYPE_BENCH,
  PROTOTYPE_STATE_MAP
} from '../../../data/prototypeData';
import {
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Heart,
  Scale,
  Calendar,
  Layers,
  MapPin,
  Clock,
  Lock,
  MessageSquare
} from 'lucide-react';
import PromoterBanksMarquee from '../../../components/trust/PromoterBanksMarquee';

export default function HomePage() {
  const { selectedCity, setCity, allCities } = useCity();
  const navigate = useNavigate();

  // Search filter states
  const [searchCity, setSearchCity] = useState(selectedCity);
  const [cat, setCat] = useState('');
  const [budget, setBudget] = useState('0');
  const [closing, setClosing] = useState('0');
  const [naturalQuery, setNaturalQuery] = useState('');
  const [searchMode, setSearchMode] = useState('fields'); // 'fields', 'words', 'map'

  // Language filter for lawyer roster
  const [selectedLang, setSelectedLang] = useState('All');
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Synchronize city changes
  const activeCityKey = selectedCity.toLowerCase();
  const cityInfo = PROTOTYPE_DATA.cities[activeCityKey] || PROTOTYPE_DATA.cities.chennai;
  const cityName = cityInfo.label;
  const stateName = PROTOTYPE_STATE_MAP[activeCityKey] || 'Tamil Nadu';

  // Filter properties for current city
  const cityProperties = useMemo(() => {
    return PROTOTYPE_DATA.props.filter(p => p.city === activeCityKey);
  }, [activeCityKey]);

  // Premium properties for current city
  const premiumProperties = useMemo(() => {
    return cityProperties.filter(p => p.premium).slice(0, 4);
  }, [cityProperties]);

  // Top ranked properties by category in this city
  const topRankedProperties = useMemo(() => {
    const catsSeen = new Set();
    const result = [];
    // Sort by rank ascending
    const sorted = [...cityProperties].sort((a, b) => a.rank - b.rank);
    for (const p of sorted) {
      if (!catsSeen.has(p.cat)) {
        catsSeen.add(p.cat);
        result.push(p);
      }
      if (result.length >= 4) break;
    }
    return result;
  }, [cityProperties]);

  // Advocate bench for this state
  const advocates = useMemo(() => {
    const list = PROTOTYPE_BENCH[stateName] || [];
    if (selectedLang === 'All') return list;
    return list.filter(adv => adv[4].includes(selectedLang));
  }, [stateName, selectedLang]);

  // Handle Search submit
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchCity) params.set('city', searchCity);
    if (cat) params.set('cat', cat);
    if (budget && budget !== '0') params.set('maxBudget', budget);
    if (closing && closing !== '0') params.set('closing', closing);
    if (naturalQuery) params.set('q', naturalQuery);
    navigate(`/search?${params.toString()}`);
  };

  const handleBookAdvocate = (adv) => {
    setSelectedAdvocate(adv);
    setBookingSuccess(false);
    setConsultModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      setConsultModalOpen(false);
      setBookingSuccess(false);
    }, 2500);
  };

  const categoryCards = [
    { name: 'Flats & apartments', slug: 'flats', img: '/img/chennai-flat-1.jpg', desc: '7 rankings · 5 cities' },
    { name: 'Houses & villas', slug: 'houses', img: '/img/chennai-house-1.jpg', desc: '7 rankings · 5 cities' },
    { name: 'Plots & land', slug: 'plots', img: '/img/chennai-land-1.jpg', desc: '7 rankings · 5 cities' },
    { name: 'Shops & showrooms', slug: 'shops', img: '/img/chennai-shop-1.jpg', desc: '7 rankings · 5 cities' },
    { name: 'Offices', slug: 'offices', img: '/img/chennai-office-1.jpg', desc: '7 rankings · 5 cities' },
    { name: 'Warehouses & industrial', slug: 'warehouses', img: '/img/chennai-warehouse-1.jpg', desc: '7 rankings · 5 cities' },
    { name: 'Vehicles & machinery', slug: 'vehicles', img: '/img/chennai-vehicle-1.jpg', desc: '7 rankings · 5 cities' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* ======================================================== */}
      {/* 1. CURATED PREMIUM SHOWCASE BANNER                       */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 border border-white/10 shadow-2xl">
        <div className="grid lg:grid-cols-12 min-h-[440px] relative">
          {/* Background image & gradient overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="/img/lounge.jpg"
              alt="Premium properties"
              className="w-full h-full object-cover object-center opacity-40 lg:opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#120814]/95 via-[#120814]/85 to-transparent" />
          </div>

          {/* Banner content */}
          <div className="lg:col-span-8 z-10 p-8 sm:p-12 lg:p-14 flex flex-col justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-rose-600 text-xs font-black tracking-wider uppercase w-fit mb-5 shadow-md">
              <Sparkles size={13} />
              PREMIUM
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.12]">
              Highway, corner and high-value properties, curated for <span className="text-rose-400">{cityName}</span>.
            </h2>

            <p className="text-slate-300 text-base sm:text-lg mt-4 max-w-xl font-normal leading-relaxed">
              A separate plan from Pro. Pick 1, 2 or 3 months for the city you are in.
            </p>

            {/* Pricing Pills */}
            <div className="flex flex-wrap gap-3 mt-6">
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-5 py-3 text-white text-xs">
                <b className="block text-xl font-extrabold text-white">₹1,499</b>
                <span className="text-slate-300 font-medium">1 month</span>
              </div>
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-5 py-3 text-white text-xs">
                <b className="block text-xl font-extrabold text-white">₹2,699</b>
                <span className="text-slate-300 font-medium">2 months</span>
              </div>
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl px-5 py-3 text-white text-xs">
                <b className="block text-xl font-extrabold text-white">₹3,499</b>
                <span className="text-slate-300 font-medium">3 months</span>
              </div>
            </div>

            <div className="mt-8">
              <Link
                to="/premium"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-xl shadow-rose-900/40 transition-all hover:scale-[1.02]"
              >
                <span>See Premium</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. PREMIUM PICKS IN SELECTED CITY                        */}
      {/* ======================================================== */}
      <section>
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Premium picks in <span className="text-rose-400">{cityName}</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              You see the price and a distance from a known landmark. Premium unlocks the lender, exact locality and field photographs.
            </p>
          </div>
          <Link
            to="/premium"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white text-xs font-bold transition-all"
          >
            <span>All premium properties</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumProperties.map((p) => {
            const hasHighway = p.flags?.includes('highway');
            const hasCorner = p.flags?.includes('corner');
            const hasCommercial = p.flags?.includes('commercial');

            return (
              <Link
                key={p.id}
                to={`/lot/${p.id}`}
                className="group block rounded-2xl overflow-hidden bg-slate-900/60 border border-white/10 hover:border-rose-500/40 transition-all hover:shadow-2xl hover:shadow-rose-950/20"
              >
                {/* Image & Badges */}
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                  <img
                    src={`/img/${p.img}`}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* AI Rank Badge */}
                  <div className="absolute top-3 left-3 bg-white text-slate-950 rounded-xl px-2.5 py-1 text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
                    <span className="text-rose-600 font-black">#{p.rank}</span>
                    <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider leading-none">
                      AI rank<br />{p.cat}
                    </span>
                  </div>

                  {/* Favorite Heart */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-rose-400">
                    <Heart size={15} />
                  </div>

                  {/* Status Badges */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <span className="bg-slate-950/90 text-white border border-white/20 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                      🔒 Premium
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

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-rose-400 transition-colors">
                    {p.short} · Premium location
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    Lender shown on Premium · closes in {p.days} days
                  </p>

                  {/* Highlights */}
                  {(hasHighway || hasCorner || hasCommercial) && (
                    <div className="text-[11.5px] font-bold text-rose-400">
                      ★ {hasHighway ? 'Highway frontage' : ''}
                      {hasHighway && hasCommercial ? ' · ' : ''}
                      {hasCorner ? 'Corner property' : ''}
                      {hasCorner && hasCommercial ? ' · ' : ''}
                      {hasCommercial && !hasHighway && !hasCorner ? 'High commercial value' : ''}
                    </div>
                  )}

                  {/* Price & Discount */}
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

      {/* ======================================================== */}
      {/* 3. THREE REASONS SMART BUYERS START HERE                 */}
      {/* ======================================================== */}
      <section className="pt-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-extrabold uppercase tracking-wider mb-3">
            WHY BANKAUCTIONS.AI
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Three reasons smart buyers start here
          </h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3 leading-relaxed">
            Bank auction properties are priced below market, but the sale notices are hard to compare and easy to misread. This is how we make them useful.
          </p>
        </div>

        {/* 3 Reason Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Reason 01: Score Ring */}
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 flex flex-col justify-between shadow-xl">
            {/* Visual Header */}
            <div className="bg-[#0b1329] border border-white/10 rounded-2xl p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-white text-slate-950 rounded-xl px-2.5 py-1 text-xs font-extrabold flex items-center gap-1.5">
                  <span className="text-rose-600 font-black">#1</span>
                  <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider">
                    AI rank<br />Flat · Chennai
                  </span>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-rose-500 flex items-center justify-center font-black text-white text-base">
                  84<span className="text-[10px] text-slate-400 font-normal">/100</span>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11px] text-slate-300">
                  <span>Discount</span>
                  <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[85%]" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-300">
                  <span>Possession</span>
                  <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[88%]" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-300">
                  <span>Location</span>
                  <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[80%]" />
                  </div>
                </div>
                <div className="flex justify-between items-center text-[11px] text-slate-300">
                  <span>Documents</span>
                  <div className="w-32 bg-white/10 h-2 rounded-full overflow-hidden">
                    <div className="bg-rose-500 h-full w-[80%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-rose-400">01</span>
              <h3 className="text-lg font-bold text-white">Know what a property is really worth</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Each property gets an AI score out of 100 from its discount to market, possession, location and documents. It is ranked only against its own kind in its own city, so a flat is never compared with a warehouse.
              </p>
              <div className="pt-3 border-t border-white/[0.08] text-[11.5px] text-slate-300 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <b className="text-white">How it helps you:</b> Properties here are listed about 31% below market on average. The rank shows which ones are genuinely strong in minutes.
                </span>
              </div>
            </div>
          </div>

          {/* Reason 02: Field Verification */}
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 flex flex-col justify-between shadow-xl">
            {/* Visual Header */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 border border-white/10">
              <img
                src="/img/chennai-flat-1.jpg"
                alt="Field verified"
                className="w-full h-full object-cover"
              />
              <span className="absolute top-3 left-3 bg-emerald-600 text-white rounded-full px-2.5 py-0.5 text-xs font-bold shadow-md">
                ✓ Field verified
              </span>
              <div className="absolute bottom-2 inset-x-2 bg-slate-950/85 backdrop-blur-md rounded-xl p-2.5 flex justify-between text-[11px] text-slate-300">
                <span>Occupancy · <b className="text-white">Vacant</b></span>
                <span>Access · <b className="text-white">Wide, paved</b></span>
                <span>Boundaries · <b className="text-white">Match</b></span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-rose-400">02</span>
              <h3 className="text-lg font-bold text-white">See what the sale notice does not tell you</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Photographs released by the bank are tagged as such. Our field engineers visit and record occupancy, access, boundaries and condition. Anything our software could not read cleanly is checked by a person first.
              </p>
              <div className="pt-3 border-t border-white/[0.08] text-[11.5px] text-slate-300 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <b className="text-white">How it helps you:</b> You learn whether it is occupied, what condition it is in and what a fair value looks like before you commit an EMD.
                </span>
              </div>
            </div>
          </div>

          {/* Reason 03: Legal Advice */}
          <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 flex flex-col justify-between shadow-xl">
            {/* Visual Header */}
            <div className="bg-[#0b1329] border border-white/10 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <img src="/img/adv/adv-r-venkatesan.jpg" className="w-10 h-10 rounded-full object-cover border-2 border-white/20" alt="Advocate" />
                <img src="/img/adv/adv-s-meenakshi.jpg" className="w-10 h-10 rounded-full object-cover border-2 border-white/20 -ml-4" alt="Advocate" />
                <img src="/img/adv/adv-k-ramanathan.jpg" className="w-10 h-10 rounded-full object-cover border-2 border-white/20 -ml-4" alt="Advocate" />
              </div>

              {/* Chat bubble */}
              <div className="bg-white/10 rounded-2xl p-3 text-xs text-slate-200 mb-3 border border-white/10">
                💬 "Is the title clear? Any encumbrance on record?"
              </div>

              <div className="flex justify-between items-center text-[11px] text-slate-400">
                <span>🗣 Speaks <b>English · Tamil</b></span>
                <span>🔔 Closes in <b>2 days</b></span>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-rose-400">03</span>
              <h3 className="text-lg font-bold text-white">Bid with advice, not guesswork</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Book a 30 minute call with an advocate in your state who speaks your language, about the exact property you are considering. Save what you look for and get alerted before an auction closes.
              </p>
              <div className="pt-3 border-t border-white/[0.08] text-[11.5px] text-slate-300 flex items-start gap-2">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <b className="text-white">How it helps you:</b> You get an independent view on title, encumbrance and possession, and you never miss a closing date.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. HERO SEARCH SECTION                                   */}
      {/* ======================================================== */}
      <section className="text-center pt-8">
        <div className="max-w-3xl mx-auto space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
            LIVE IN {cityName}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Find the auction deal <em className="not-italic text-rose-500">before</em> everyone else.
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Every property sold by banks across South India, scored by AI within its own category, with the photographs to match.
          </p>
        </div>

        {/* Search Bar Form */}
        <div className="max-w-4xl mx-auto mt-8">
          {searchMode === 'fields' && (
            <form onSubmit={handleSearch} className="rounded-full bg-white p-2 shadow-2xl flex flex-wrap md:flex-nowrap items-center text-slate-900 border border-slate-200">
              <div className="px-5 py-2 border-r border-slate-200 text-left flex-1 min-w-[140px]">
                <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">City</label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
                >
                  {Object.entries(allCities || {}).map(([k, v]) => (
                    <option key={k} value={k}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div className="px-5 py-2 border-r border-slate-200 text-left flex-1 min-w-[160px]">
                <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">Type</label>
                <select
                  value={cat}
                  onChange={(e) => setCat(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="">All property types</option>
                  <option value="flat">Flats & apartments</option>
                  <option value="house">Houses & villas</option>
                  <option value="land">Plots & land</option>
                  <option value="shop">Shops & showrooms</option>
                  <option value="office">Offices</option>
                  <option value="warehouse">Warehouses & industrial</option>
                  <option value="vehicle">Vehicles & machinery</option>
                </select>
              </div>

              <div className="px-5 py-2 border-r border-slate-200 text-left flex-1 min-w-[130px]">
                <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">Budget</label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="0">Any budget</option>
                  <option value="25">Under ₹25 L</option>
                  <option value="50">Under ₹50 L</option>
                  <option value="100">Under ₹1 Cr</option>
                </select>
              </div>

              <div className="px-5 py-2 text-left flex-1 min-w-[140px]">
                <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">Closing</label>
                <select
                  value={closing}
                  onChange={(e) => setClosing(e.target.value)}
                  className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="0">All live properties</option>
                  <option value="7">Closing in 7 days</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
              >
                Search
              </button>
            </form>
          )}

          {searchMode === 'words' && (
            <form onSubmit={handleSearch} className="rounded-full bg-white p-2 shadow-2xl flex items-center text-slate-900 border border-slate-200">
              <div className="px-6 py-2 text-left flex-1">
                <label className="block text-[10px] font-bold tracking-wider text-slate-500 uppercase">Ask in your words</label>
                <input
                  type="text"
                  value={naturalQuery}
                  onChange={(e) => setNaturalQuery(e.target.value)}
                  placeholder="2BHK flat in Chennai under 60 lakh closing soon"
                  className="w-full bg-transparent text-xs font-semibold text-slate-900 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shrink-0"
              >
                Search
              </button>
            </form>
          )}

          {/* Search Modes Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-5">
            <button
              onClick={() => setSearchMode('fields')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                searchMode === 'fields'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.14]'
              }`}
            >
              Search fields
            </button>
            <button
              onClick={() => setSearchMode('words')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                searchMode === 'words'
                  ? 'bg-white text-slate-950 font-bold shadow-md'
                  : 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.14]'
              }`}
            >
              <span>✦ Ask in your words</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 font-bold">PRO</span>
            </button>
            <Link
              to="/search?mode=map"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.08] text-slate-300 hover:bg-white/[0.14] transition-all flex items-center gap-1.5"
            >
              <span>⌖ Pick on the map</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-400 font-bold">PRO</span>
            </Link>
            <Link
              to="/preferences"
              className="px-4 py-2 rounded-full text-xs font-semibold bg-white/[0.08] text-slate-300 hover:bg-white/[0.14] transition-all flex items-center gap-1.5"
            >
              <span>☰ Set preferences</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. TOP RANKED IN SELECTED CITY                           */}
      {/* ======================================================== */}
      <section>
        <div className="flex flex-wrap justify-between items-end gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Top ranked in <span className="text-rose-400">{cityName}</span>
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Highest AI score in each category.
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white text-xs font-bold transition-all"
          >
            <span>See all</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topRankedProperties.map((p) => (
            <Link
              key={p.id}
              to={`/lot/${p.id}`}
              className="group block rounded-2xl overflow-hidden bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 transition-all hover:shadow-2xl"
            >
              {/* Image & Badges */}
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

              {/* Content */}
              <div className="p-4 space-y-2">
                <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-cyan-400 transition-colors">
                  {p.short} · {p.loc}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-1">
                  {p.bank} · closes in {p.days} days
                </p>

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
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. BROWSE BY CATEGORY (7 CATEGORIES)                     */}
      {/* ======================================================== */}
      <section>
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Browse by category
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Seven separate rankings, one page each.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
          {categoryCards.map((cat) => (
            <Link
              key={cat.slug}
              to={`/${cat.slug}`}
              className="group block p-3 rounded-2xl bg-slate-900/40 border border-white/10 hover:border-rose-500/40 hover:bg-white/[0.04] transition-all"
            >
              <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-slate-800">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <h4 className="text-xs font-bold text-white group-hover:text-rose-400 transition-colors leading-tight">
                {cat.name}
              </h4>
              <small className="block text-[10px] text-slate-400 mt-1">
                {cat.desc}
              </small>
            </Link>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. TALK TO A LAWYER BEFORE YOU BID                       */}
      {/* ======================================================== */}
      <section className="pt-4">
        <div className="flex flex-wrap justify-between items-end gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Talk to a lawyer before you bid
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Advocates enrolled in <span className="text-white font-bold">{stateName}</span>, where you are searching. Only advocates who speak a language you do are shown.
            </p>
          </div>
          <Link
            to="/legal"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/15 text-white text-xs font-bold transition-all"
          >
            <span>See all advocates</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Language Filter Bar */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-bold text-slate-300 mr-2">I speak:</span>
          {['All', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Hindi'].map((lang) => (
            <button
              key={lang}
              onClick={() => setSelectedLang(lang)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                selectedLang === lang
                  ? 'bg-rose-600 text-white font-bold shadow-sm'
                  : 'bg-white/[0.08] text-slate-300 hover:bg-white/[0.14]'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Advocates Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {advocates.map((adv, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-slate-900/70 border border-white/10 p-6 flex flex-col justify-between hover:border-rose-500/30 transition-all shadow-xl"
            >
              <div className="flex items-start gap-4">
                <img
                  src={`/img/adv/${adv[0].toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`}
                  onError={(e) => { e.target.src = '/img/adv/adv-r-venkatesan.jpg'; }}
                  alt={adv[0]}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/15 shrink-0"
                />
                <div className="space-y-1">
                  <h4 className="font-bold text-white text-base leading-snug">{adv[0]}</h4>
                  <p className="text-xs text-rose-400 font-semibold">{adv[2]} at the Bar</p>
                  <p className="text-[11px] text-slate-400">{adv[1]}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-2.5">
                <p className="text-xs text-slate-300 line-clamp-1">
                  <b>Focus:</b> {adv[3]}
                </p>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {adv[4].split(',').map((l, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-white/10 text-slate-300">
                      {l.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between pt-3 border-t border-white/[0.08]">
                <div className="text-white font-extrabold text-sm">
                  {adv[5]} <small className="text-slate-400 font-normal">/ 30 min</small>
                </div>
                <button
                  onClick={() => handleBookAdvocate(adv)}
                  className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. PROMOTER BANKS CAROUSEL MARQUEE                       */}
      {/* ======================================================== */}
      <PromoterBanksMarquee />

      {/* ======================================================== */}
      {/* 9. LIVE STATS BAND                                       */}
      {/* ======================================================== */}
      <section className="rounded-3xl bg-slate-900/80 border border-white/10 py-10 px-6 sm:px-12 shadow-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <b className="block text-4xl sm:text-5xl font-black text-white tracking-tight">{cityInfo.live}</b>
            <span className="text-xs sm:text-sm text-slate-400 mt-1 block">live properties</span>
          </div>
          <div>
            <b className="block text-4xl sm:text-5xl font-black text-white tracking-tight">{cityInfo.newWeek}</b>
            <span className="text-xs sm:text-sm text-slate-400 mt-1 block">new this week</span>
          </div>
          <div>
            <b className="block text-4xl sm:text-5xl font-black text-white tracking-tight">{cityInfo.discount}</b>
            <span className="text-xs sm:text-sm text-slate-400 mt-1 block">average discount</span>
          </div>
          <div>
            <b className="block text-4xl sm:text-5xl font-black text-white tracking-tight">{cityInfo.lenders}</b>
            <span className="text-xs sm:text-sm text-slate-400 mt-1 block">lenders listed</span>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* DIRECT ADVOCATE BRIDGE BOOKING MODAL                     */}
      {/* ======================================================== */}
      {consultModalOpen && selectedAdvocate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-white/20 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setConsultModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-lg font-bold w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
            >
              ✕
            </button>

            {bookingSuccess ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-xl font-bold text-white">Consultation Bridge Scheduled!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Encrypted private dial-in bridge link generated. Neither party will see the other's phone or email address.
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[11px] font-mono text-rose-400 font-bold uppercase tracking-wider">
                    Direct Advocate Bridge
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Schedule Consultation with {selectedAdvocate[0]}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Speak directly with a senior DRT advocate on our portal bridge. Neither party sees the other's phone number or email address.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-slate-300 space-y-1">
                  <div><b>Court:</b> {selectedAdvocate[1]}</div>
                  <div><b>Experience:</b> {selectedAdvocate[2]} at Bar</div>
                  <div><b>Fee:</b> {selectedAdvocate[5]} for 30 minutes</div>
                </div>

                <div className="space-y-3 text-xs text-left">
                  <label className="block">
                    <span className="text-slate-300 font-semibold mb-1 block">Language You Think In</span>
                    <select className="w-full rounded-xl bg-slate-800 border border-white/20 p-2.5 text-white">
                      {selectedAdvocate[4].split(',').map((l, i) => (
                        <option key={i} value={l.trim()}>{l.trim()}</option>
                      ))}
                    </select>
                  </label>

                  <label className="block">
                    <span className="text-slate-300 font-semibold mb-1 block">DRT Bench / Jurisdiction</span>
                    <input
                      type="text"
                      defaultValue={`${selectedAdvocate[1]}`}
                      className="w-full rounded-xl bg-slate-800 border border-white/20 p-2.5 text-white"
                      readOnly
                    />
                  </label>

                  <label className="block">
                    <span className="text-slate-300 font-semibold mb-1 block">Auction Lot ID or Scheduled Property Note (Optional)</span>
                    <input
                      type="text"
                      placeholder="e.g. Lot #402, OMR Chennai flat, or Bank of Baroda Ambattur shed"
                      className="w-full rounded-xl bg-slate-800 border border-white/20 p-2.5 text-white"
                    />
                  </label>
                </div>

                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-300 flex items-center gap-2">
                  <Lock size={14} className="shrink-0" />
                  <span>Encrypted private dial-in bridge · No phone sharing</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  Schedule Consultation · {selectedAdvocate[5]}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
