import React from 'react';
import { formatINR } from '../../utils/formatters';

export function SchematicMapView({ auctions = [], onSelectPin }) {
  // Deterministic 2D position for each auction ID
  function getCoordinates(id) {
    let hash = 2166136261;
    for (let i = 0; i < id.length; i++) {
      hash ^= id.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    hash ^= hash >>> 13;
    hash = Math.imul(hash, 1274126177);
    hash ^= hash >>> 16;
    hash >>>= 0;
    const x = 10 + ((hash % 1000) / 1000) * 80;
    const y = 15 + ((Math.floor(hash / 1000) % 1000) / 1000) * 70;
    return [x, y];
  }

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden glass-panel border border-slate-700/60 shadow-2xl">
      {/* Schematic Geographic Topology Background */}
      <svg className="w-full h-full object-cover" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect width="100" height="100" fill="#070D1F" />
        <path d="M0 70 Q30 60 55 75 T100 66 V100 H0Z" fill="#0F1A34" />
        <ellipse cx="18" cy="24" rx="14" ry="10" fill="#16264E" />
        <ellipse cx="82" cy="52" rx="12" ry="14" fill="#16264E" />
        <g stroke="rgba(0, 229, 255, 0.12)" strokeWidth="0.8" fill="none">
          <path d="M0 40 Q40 32 100 44" />
          <path d="M52 0 L48 100" />
          <path d="M0 85 Q40 80 100 90" />
          <path d="M80 0 L70 100" />
          <path d="M20 0 L28 100" />
        </g>
        <path d="M0 30 Q50 26 100 34" stroke="rgba(245, 158, 11, 0.25)" strokeWidth="1.2" fill="none" />
      </svg>

      {/* Floating Property Price Pins */}
      {auctions.map((auction) => {
        const [left, top] = getCoordinates(auction.id);
        return (
          <button
            key={auction.id}
            onClick={() => onSelectPin && onSelectPin(auction)}
            style={{ left: `${left}%`, top: `${top}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition-all duration-200 z-10 shadow-lg ${
              auction.isFeatured
                ? 'bg-amber-500 text-slate-950 shadow-amber-500/40 hover:scale-110 ring-2 ring-amber-300'
                : 'bg-slate-900/90 text-accent-cyan border border-accent-cyan/40 hover:bg-accent-cyan hover:text-slate-950 hover:scale-110 shadow-glow-cyan'
            }`}
          >
            {formatINR(auction.reservePrice)}
          </button>
        );
      })}

      <div className="absolute bottom-4 left-4 glass-panel px-4 py-2 rounded-xl text-xs text-slate-300 flex items-center gap-4 z-20">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent-cyan shadow-glow-cyan" />
          Standard Reserve
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
          Featured Mega Auction
        </span>
      </div>
    </div>
  );
}

export default SchematicMapView;
