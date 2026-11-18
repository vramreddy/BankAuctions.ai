import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { formatINR } from "../../utils/formatters";
import {
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Calendar,
  Building2,
  TrendingDown,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

const DEFAULT_FEATURED = [
  {
    id: "sbi-omr-01",
    title: "3 BHK Sea-View Luxury Apartment (1,840 Sq.ft), OMR Corridor",
    locality: "OMR - Sholinganallur",
    city: "Chennai",
    bankName: "State Bank of India",
    reservePrice: 6850000,
    estimatedMarketValue: 10500000,
    emdAmount: 685000,
    auctionStartDate: "2026-11-28T11:00:00.000Z",
    possession: "Physical possession",
    aiScore: 95,
    aiRank: 1,
    aiDiscountPct: 34.8,
    primaryImageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "sbi-annanagar-02",
    title: "G+2 Independent Luxury Bungalow (3,200 Sq.ft), Anna Nagar West",
    locality: "Anna Nagar West Extension",
    city: "Chennai",
    bankName: "State Bank of India",
    reservePrice: 19500000,
    estimatedMarketValue: 29000000,
    emdAmount: 1950000,
    auctionStartDate: "2026-12-04T11:00:00.000Z",
    possession: "Physical possession",
    aiScore: 96,
    aiRank: 2,
    aiDiscountPct: 32.8,
    primaryImageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80"
  },
  {
    id: "sbi-adhanur-03",
    title: "2 BHK Residential Apartment (799 Sq.ft) in Shri Sai Homes, Adhanur",
    locality: "Kundrathur / Adhanur",
    city: "Chennai",
    bankName: "State Bank of India",
    reservePrice: 2300000,
    estimatedMarketValue: 3400000,
    emdAmount: 230000,
    auctionStartDate: "2026-11-27T10:00:00.000Z",
    possession: "Physical possession",
    aiScore: 92,
    aiRank: 3,
    aiDiscountPct: 32.4,
    primaryImageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
  }
];

export default function FeaturedAssets() {
  const [items, setItems] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    let active = true;
    api
      .getFeaturedAuctions()
      .then((r) => {
        if (active && Array.isArray(r.data) && r.data.length > 0) {
          setItems(r.data);
        } else if (active) {
          setItems(DEFAULT_FEATURED);
        }
      })
      .catch(() => {
        if (active) setItems(DEFAULT_FEATURED);
      });
    return () => {
      active = false;
    };
  }, []);

  const activeList = items.length > 0 ? items : DEFAULT_FEATURED;

  useEffect(() => {
    if (paused || activeList.length < 2) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % activeList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeList.length, paused]);

  const current = activeList[index] || activeList[0];
  const discount = current.aiDiscountPct || Math.round(
    (((current.estimatedMarketValue || current.reservePrice * 1.45) - current.reservePrice) /
      (current.estimatedMarketValue || current.reservePrice * 1.45)) * 100
  );

  return (
    <div
      className="w-full rounded-2xl overflow-hidden glass-panel border border-white/15 shadow-2xl relative group bg-slate-950/90"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid md:grid-cols-12 gap-0 items-stretch">
        {/* Left Column: Property Visual */}
        <div className="md:col-span-7 relative aspect-[16/10] md:aspect-auto overflow-hidden bg-slate-900 min-h-[260px]">
          <img
            src={current.primaryImageUrl}
            alt={current.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 z-10">
            <span className="px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              <span>AI Rank #{current.aiRank || index + 1} · {current.aiScore || 95}/100</span>
            </span>

            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-400/40 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>{current.possession || "Physical possession"}</span>
            </span>
          </div>

          {/* Bottom Overlay Bank Pill */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 z-10">
            <span className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs shadow-md">
              {current.bankName || current.bank?.name || "State Bank of India"}
            </span>
            <span className="px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>{discount}% Below Market</span>
            </span>
          </div>
        </div>

        {/* Right Column: Asset Details & Due Diligence */}
        <div className="md:col-span-5 p-5 sm:p-6 flex flex-col justify-between space-y-4 bg-slate-950/70">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="capitalize">{current.locality}, {current.city}</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
              {current.title}
            </h3>
          </div>

          {/* Valuation Details */}
          <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5">
                Reserve Price
              </span>
              <span className="text-base font-black text-white">
                {formatINR(current.reservePrice)}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5 font-medium">
                Est. Value: {formatINR(current.estimatedMarketValue || current.reservePrice * 1.45)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block mb-0.5">
                EMD (10%)
              </span>
              <span className="text-xs font-bold text-cyan-300">
                {formatINR(current.emdAmount || current.reservePrice * 0.1)}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>
                  {current.auctionStartDate
                    ? new Date(current.auctionStartDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short"
                      })
                    : "Nov 28"}
                </span>
              </span>
            </div>
          </div>

          {/* Legal Status Signals */}
          <div className="flex items-center gap-3 text-[11px] text-slate-300 font-medium">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> 30-Yr EC Clean
            </span>
            <span className="flex items-center gap-1 text-cyan-400">
              <ShieldCheck className="w-3.5 h-3.5" /> SARFAESI 8(6)
            </span>
          </div>

          {/* Bottom Navigation & CTA */}
          <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/10">
            {/* Slide Arrows & Indicator */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIndex((i) => (i - 1 + activeList.length) % activeList.length)}
                className="p-1.5 rounded-lg bg-slate-900 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                aria-label="Previous listing"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono text-slate-400 px-1">
                {index + 1}/{activeList.length}
              </span>
              <button
                type="button"
                onClick={() => setIndex((i) => (i + 1) % activeList.length)}
                className="p-1.5 rounded-lg bg-slate-900 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all"
                aria-label="Next listing"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              to={current.id ? `/lot/${current.id}` : "/search"}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 transition-all shadow-md shadow-cyan-500/20 group/btn"
            >
              <span>View Dossier</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
