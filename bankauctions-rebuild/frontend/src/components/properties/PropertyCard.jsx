import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Clock, Building, ShieldCheck, Sparkles } from 'lucide-react';
import { formatINR, getDaysRemaining } from '../../utils/formatters';
import AiRankPill from './AiRankPill';
import SpecularBadge from '../common/SpecularBadge';
import { api } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

export function PropertyCard({ auction, isSaved: initialSaved = false, onSaveToggle }) {
  const { user } = useAuth();
  const [saved, setSaved] = useState(initialSaved);
  const [saving, setSaving] = useState(false);

  const daysLeft = getDaysRemaining(auction.auctionStartDate);

  const handleHeartClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      alert('Please sign in to save properties to your archive.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post(`/auctions/${auction.id}/save`);
      setSaved(res.data?.data?.saved ?? !saved);
      if (onSaveToggle) onSaveToggle(auction.id, res.data?.data?.saved ?? !saved);
    } catch (err) {
      console.error('Failed to toggle save:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link
      to={`/lot/${auction.id}`}
      className="group block relative rounded-2xl overflow-hidden glass-panel-interactive transition-all duration-300"
    >
      {/* Property Thumbnail with Overlays */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
        <img
          src={auction.primaryImageUrl || '/images/chennai-flat-1.jpg'}
          alt={auction.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.src = '/images/chennai-flat-1.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5 flex-wrap">
            {auction.aiRankOverall ? (
              <AiRankPill
                rank={auction.aiRankOverall}
                score={auction.aiCompositeScore}
              />
            ) : null}
            {auction.isVerifiedByChecker ? (
              <SpecularBadge variant="emerald" size="sm">
                <ShieldCheck className="w-3 h-3" />
                Audited
              </SpecularBadge>
            ) : null}
          </div>

          <button
            onClick={handleHeartClick}
            disabled={saving}
            className={`p-2 rounded-xl backdrop-blur-md transition-colors ${saved
              ? 'bg-rose-500/80 text-white'
              : 'bg-slate-900/60 text-slate-300 hover:text-white hover:bg-slate-900/90'
              }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Days Left Tag */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-mono font-medium text-amber-400 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-amber-500/30">
          <Clock className="w-3.5 h-3.5" />
          <span>{daysLeft !== null && daysLeft >= 0 ? `${daysLeft} Days to Bid` : 'Auction Live'}</span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Building className="w-3.5 h-3.5 text-accent-cyan" />
          <span>{auction.bankName}</span>
          <span>•</span>
          <span>{auction.city}</span>
        </div>

        <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-accent-cyan transition-colors">
          {auction.title}
        </h3>

        <div className="pt-3 border-t border-slate-800 flex items-end justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block">
              Reserve Price
            </span>
            <div className="text-xl font-extrabold text-white font-mono">
              {formatINR(auction.reservePrice)}
            </div>
          </div>

          {auction.aiDiscountPct ? (
            <div className="text-right">
              <span className="inline-block text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-lg">
                {auction.aiDiscountPct}% below market
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default PropertyCard;
