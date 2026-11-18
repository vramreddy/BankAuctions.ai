import React, { useState, useMemo } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useCity } from '../../../contexts/CityContext';
import { PROTOTYPE_DATA } from '../../../data/prototypeData';
import { CATEGORY_DETAILS } from '@shared/constants/categories.js';
import {
  Building2,
  ArrowLeft,
  Filter,
  Sparkles,
  Heart,
  ArrowRight
} from 'lucide-react';

export function CategoryPage({ explicitCat }) {
  const { slug } = useParams();
  const location = useLocation();
  const { selectedCity, setCity, allCities } = useCity();

  // Determine category slug from explicit prop, param, or pathname
  const activeSlug = explicitCat || slug || location.pathname.replace(/^\//, '');

  // Map slug to category code in prototype data
  const slugToCat = {
    flats: 'flat',
    flat: 'flat',
    houses: 'house',
    house: 'house',
    plots: 'land',
    land: 'land',
    shops: 'shop',
    shop: 'shop',
    offices: 'office',
    office: 'office',
    warehouses: 'warehouse',
    warehouse: 'warehouse',
    vehicles: 'vehicle',
    vehicle: 'vehicle'
  };

  const catCode = slugToCat[activeSlug] || 'flat';
  const meta = Object.values(CATEGORY_DETAILS).find((c) => c.slug === activeSlug) || {
    name: 'Flats & apartments',
    short: 'Flat',
    slug: 'flats',
    description: 'Apartments and flats sold under SARFAESI and DRT orders, from compact 1BHKs to premium towers.'
  };

  const activeCityKey = selectedCity.toLowerCase();
  const cityInfo = PROTOTYPE_DATA.cities[activeCityKey] || PROTOTYPE_DATA.cities.chennai;
  const cityName = cityInfo.label;

  // Filter prototype listings for this category and selected city
  const listings = useMemo(() => {
    return PROTOTYPE_DATA.props
      .filter(p => p.cat === catCode && p.city === activeCityKey)
      .sort((a, b) => a.rank - b.rank);
  }, [catCode, activeCityKey]);

  const otherCategories = [
    { name: 'Flats & apartments', slug: 'flats', img: '/img/chennai-flat-1.jpg' },
    { name: 'Houses & villas', slug: 'houses', img: '/img/chennai-house-1.jpg' },
    { name: 'Plots & land', slug: 'plots', img: '/img/chennai-land-1.jpg' },
    { name: 'Shops & showrooms', slug: 'shops', img: '/img/chennai-shop-1.jpg' },
    { name: 'Offices', slug: 'offices', img: '/img/chennai-office-1.jpg' },
    { name: 'Warehouses & industrial', slug: 'warehouses', img: '/img/chennai-warehouse-1.jpg' },
    { name: 'Vehicles & machinery', slug: 'vehicles', img: '/img/chennai-vehicle-1.jpg' }
  ].filter(c => c.slug !== activeSlug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Hero Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white flex items-center gap-1">
            <ArrowLeft size={13} /> Home
          </Link>
          <span>/</span>
          <span className="text-white">{meta.name}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          {meta.name} on bank auction
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
          {meta.description} Each listing is ranked only against others in this category, within its city.
        </p>

        {/* City Filter Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {Object.entries(allCities || {}).map(([k, v]) => (
            <button
              key={k}
              onClick={() => setCity(k)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                activeCityKey === k
                  ? 'bg-white text-slate-950 font-bold border-white shadow-md'
                  : 'bg-white/[0.05] border-white/10 text-slate-300 hover:border-white/25'
              }`}
            >
              {v.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Listings */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white">
            {meta.name} in <span className="text-rose-400">{cityName}</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {listings.length} live properties, ranked 1 to {listings.length} within {meta.short.toLowerCase()}s only.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((p) => {
            const hasHighway = p.flags?.includes('highway');
            const hasCorner = p.flags?.includes('corner');
            const hasCommercial = p.flags?.includes('commercial');

            return (
              <Link
                key={p.id}
                to={`/lot/${p.id}`}
                className="group block rounded-2xl overflow-hidden bg-slate-900/60 border border-white/10 hover:border-rose-500/40 transition-all hover:shadow-2xl"
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
                    {p.premium && (
                      <span className="bg-slate-950/90 text-white border border-white/20 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                        🔒 Premium
                      </span>
                    )}
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
                    {p.short} · {p.loc}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {p.bank} · closes in {p.days} days
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

      {/* Other Categories Carousel */}
      <section className="space-y-4 pt-6">
        <h3 className="text-xl font-bold text-white">Other categories</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {otherCategories.map((c) => (
            <Link
              key={c.slug}
              to={`/${c.slug}`}
              className="flex items-center gap-3 p-2.5 pr-5 rounded-full bg-slate-900 border border-white/10 hover:border-rose-500/40 hover:bg-white/[0.04] shrink-0 text-xs font-bold text-white transition-all"
            >
              <img src={c.img} alt={c.name} className="w-10 h-10 rounded-full object-cover" />
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CategoryPage;
