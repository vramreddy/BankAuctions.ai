import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  Building,
  CheckCircle2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { api } from '../../../services/api';
import { useCity } from '../../../contexts/CityContext';
import { PropertyCard } from '../../../components/properties/PropertyCard';
import { Button } from '../../../components/common/Button';
import { formatINR } from '../../../utils/formatters';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCity, cityDetails } = useCity();

  // Filters state from URL params
  const [city, setCity] = useState(searchParams.get('city') || selectedCity);
  const [cat, setCat] = useState(searchParams.get('cat') || '');
  const [bankId, setBankId] = useState(searchParams.get('bankId') || '');
  const [maxBudget, setMaxBudget] = useState(searchParams.get('maxBudget') || '');
  const [days, setDays] = useState(searchParams.get('days') || '');
  const [prem, setPrem] = useState(searchParams.get('prem') === '1');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rank');
  const [search, setSearch] = useState(searchParams.get('search') || '');

  // Data state
  const [auctions, setAuctions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Load Categories
  useEffect(() => {
    async function loadCats() {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCats();
  }, []);

  // Fetch Auctions when filters change
  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      try {
        const params = {
          city: city || selectedCity,
          cat: cat || undefined,
          bankId: bankId || undefined,
          maxBudget: maxBudget || undefined,
          days: days || undefined,
          prem: prem ? '1' : undefined,
          sort,
          search: search || undefined
        };

        const res = await api.getAuctions(params);
        if (res.success) {
          setAuctions(res.data);
          setTotalCount(res.meta?.total || res.data.length);
        }
      } catch (err) {
        console.error('Failed to query auctions:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchResults();

    // Sync with URL params
    const nextParams = new URLSearchParams();
    if (city) nextParams.set('city', city);
    if (cat) nextParams.set('cat', cat);
    if (bankId) nextParams.set('bankId', bankId);
    if (maxBudget) nextParams.set('maxBudget', maxBudget);
    if (days) nextParams.set('days', days);
    if (prem) nextParams.set('prem', '1');
    if (sort !== 'rank') nextParams.set('sort', sort);
    if (search) nextParams.set('search', search);
    setSearchParams(nextParams, { replace: true });
  }, [city, selectedCity, cat, bankId, maxBudget, days, prem, sort, search]);

  const handleResetFilters = () => {
    setCat('');
    setBankId('');
    setMaxBudget('');
    setDays('');
    setPrem(false);
    setSort('rank');
    setSearch('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Filter Bar */}
      <div className="p-4 sm:p-5 rounded-3xl glass-panel space-y-4">
        {/* Main Search Input & Category Pills */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by locality or keyword (e.g. Velachery, Sholinganallur)"
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-input text-sm text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Category Horizontal Filter Dock */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setCat('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              cat === ''
                ? 'bg-brand-cyan text-slate-950 shadow-glow-cyan'
                : 'glass-card text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            All Asset Types
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.slug)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                cat === c.slug
                  ? 'bg-brand-cyan text-slate-950 shadow-glow-cyan'
                  : 'glass-card text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Secondary Filter Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-slate-800/80">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Max Budget
            </label>
            <select
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
            >
              <option value="" className="bg-brand-950 text-white">Any Budget</option>
              <option value="2500000" className="bg-brand-950 text-white">Under ₹25 L</option>
              <option value="5000000" className="bg-brand-950 text-white">Under ₹50 L</option>
              <option value="10000000" className="bg-brand-950 text-white">Under ₹1 Cr</option>
              <option value="30000000" className="bg-brand-950 text-white">Under ₹3 Cr</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Closing Date
            </label>
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
            >
              <option value="" className="bg-brand-950 text-white">Any Date</option>
              <option value="3" className="bg-brand-950 text-white">Closing in 3 days</option>
              <option value="7" className="bg-brand-950 text-white">Closing in 7 days</option>
              <option value="14" className="bg-brand-950 text-white">Closing in 14 days</option>
              <option value="30" className="bg-brand-950 text-white">Closing in 30 days</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Sorting Criteria
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-xs text-white"
            >
              <option value="rank" className="bg-brand-950 text-white">Highest AI Rank</option>
              <option value="days" className="bg-brand-950 text-white">Closing Soonest</option>
              <option value="price_asc" className="bg-brand-950 text-white">Lowest Reserve Price</option>
              <option value="price_desc" className="bg-brand-950 text-white">Highest Reserve Price</option>
            </select>
          </div>

          <div className="flex items-center gap-2 self-end pb-2">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={prem}
                onChange={(e) => setPrem(e.target.checked)}
                className="w-4 h-4 rounded text-brand-cyan focus:ring-brand-cyan"
              />
              <span>Premium Highway / Corner</span>
            </label>
          </div>

          <div className="self-end pb-1 text-right">
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-brand-cyan flex items-center gap-1 justify-end"
            >
              <RotateCcw className="w-3 h-3" /> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {totalCount} Verified Bank Auctions in{' '}
          <span className="text-brand-cyan capitalize">{city || selectedCity}</span>
        </h2>
        <span className="text-xs text-slate-400 font-mono">
          Updated directly from SARFAESI notices
        </span>
      </div>

      {/* Results Rendering */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[16/11] rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : auctions.length === 0 ? (
        <div className="p-16 rounded-3xl glass-card text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">No properties match your current filters</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Try adjusting your budget range, clearing category filters, or selecting another city.
          </p>
          <Button variant="outline" onClick={handleResetFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => (
            <PropertyCard key={auction.id} auction={auction} />
          ))}
        </div>
      )}
    </div>
  );
}


export default SearchPage;
