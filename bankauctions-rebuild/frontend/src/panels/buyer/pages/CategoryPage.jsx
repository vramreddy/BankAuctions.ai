import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { useCity } from '../../../contexts/CityContext';
import { PropertyCard } from '../../../components/properties/PropertyCard';
import { CATEGORY_DETAILS } from '@shared/constants/categories.js';
import { Building2, ArrowLeft, Filter, Sparkles } from 'lucide-react';

export function CategoryPage() {
  const { slug } = useParams();
  const { selectedCity, cityDetails } = useCity();

  const [category, setCategory] = useState(null);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  const meta = Object.values(CATEGORY_DETAILS).find((c) => c.slug === slug) || {
    name: 'Auction Category',
    description: 'Verified SARFAESI bank auction properties in this category.'
  };

  useEffect(() => {
    async function loadCategoryAuctions() {
      setLoading(true);
      try {
        const catRes = await api.getCategoryBySlug(slug);
        if (catRes.success) setCategory(catRes.data);

        const aucRes = await api.getAuctions({
          city: selectedCity,
          cat: slug
        });
        if (aucRes.success) setAuctions(aucRes.data);
      } catch (err) {
        console.error('Failed to load category auctions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryAuctions();
  }, [slug, selectedCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Hero Banner */}
      <div className="p-8 sm:p-12 rounded-3xl glass-panel relative overflow-hidden border border-brand-cyan/20">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-brand-cyan font-bold mb-3">
          <Link to="/" className="hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Link>
          <span>/</span>
          <span>{cityDetails?.name} Region</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          {meta.name} on Bank Auction
        </h1>
        <p className="mt-3 text-base text-slate-300 max-w-2xl leading-relaxed">
          {meta.description} Sourced directly from public lender sale notices with verified reserve prices and title disclosures.
        </p>

        {/* Category Key Fields Tag Strip */}
        {meta.specificFields && (
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 font-semibold mr-2">Key Tracked Attributes:</span>
            {meta.specificFields.map((f) => (
              <span
                key={f}
                className="text-xs px-2.5 py-1 rounded-xl bg-brand-900/80 border border-slate-700/60 text-slate-300 font-mono"
              >
                {f.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Listings Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white tracking-tight">
          {auctions.length} Live {meta.name} Available in {cityDetails?.name}
        </h2>
        <Link
          to={`/search?cat=${slug}&city=${selectedCity}`}
          className="text-xs font-bold text-brand-cyan hover:underline flex items-center gap-1"
        >
          Open in Advanced Filter Search →
        </Link>
      </div>

      {/* Grid of Category Properties */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-[16/11] rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : auctions.length === 0 ? (
        <div className="p-16 rounded-3xl glass-card text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No {meta.name} currently published in {cityDetails?.name}</h3>
          <p className="text-xs text-slate-400">Try checking other cities or search all auction assets.</p>
          <Link to="/search">
            <button className="mt-2 text-xs text-brand-cyan hover:underline font-bold">Browse all auction assets</button>
          </Link>
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


export default CategoryPage;
