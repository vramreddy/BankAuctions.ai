import React, { useRef } from 'react';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

const PROMOTER_BANKS = [
  {
    id: 'sbi',
    name: 'State Bank of India',
    short: 'SBI',
    type: 'Public Sector Bank',
    searchQuery: 'SBI',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <circle cx="50" cy="50" r="48" fill="#0082c9" />
        <circle cx="50" cy="50" r="16" fill="#ffffff" />
        <rect x="44" y="50" width="12" height="36" fill="#ffffff" />
      </svg>
    )
  },
  {
    id: 'bob',
    name: 'Bank of Baroda',
    short: 'BOB',
    type: 'Public Sector Bank',
    searchQuery: 'Baroda',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <rect width="100" height="100" rx="20" fill="#f26522" />
        <path d="M26 22 h20 c12 0 18 5 18 14 c0 6 -4 11 -9 12 c8 2 12 7 12 14 c0 11 -8 16 -21 16 H26 Z M40 34 H35 v12 h5 c5 0 8 -2 8 -6 s-3 -6 -8 -6 Z M42 56 H35 v14 h7 c6 0 9 -2 9 -7 s-3 -7 -9 -7 Z" fill="#ffffff" />
      </svg>
    )
  },
  {
    id: 'canara',
    name: 'Canara Bank',
    short: 'Canara',
    type: 'Public Sector Bank',
    searchQuery: 'Canara',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <rect width="100" height="100" rx="20" fill="#0091df" />
        <polygon points="20,80 50,20 80,80" fill="#fbb034" />
        <polygon points="35,74 50,45 65,74" fill="#0091df" />
        <polygon points="50,28 64,54 36,54" fill="#ffffff" opacity="0.9" />
      </svg>
    )
  },
  {
    id: 'pnb',
    name: 'Punjab National Bank',
    short: 'PNB',
    type: 'Public Sector Bank',
    searchQuery: 'PNB',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <rect width="100" height="100" rx="20" fill="#a20032" />
        <circle cx="50" cy="50" r="30" fill="#fed100" />
        <circle cx="50" cy="50" r="16" fill="#a20032" />
        <rect x="45" y="20" width="10" height="60" fill="#a20032" />
      </svg>
    )
  },
  {
    id: 'hdfc',
    name: 'HDFC Bank',
    short: 'HDFC',
    type: 'Private Scheduled Bank',
    searchQuery: 'HDFC',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <rect width="100" height="100" rx="20" fill="#004c8f" />
        <rect x="22" y="22" width="56" height="56" fill="#ed1c24" />
        <rect x="36" y="36" width="28" height="28" fill="#ffffff" />
        <rect x="44" y="22" width="12" height="56" fill="#004c8f" />
      </svg>
    )
  },
  {
    id: 'icici',
    name: 'ICICI Bank',
    short: 'ICICI',
    type: 'Private Scheduled Bank',
    searchQuery: 'ICICI',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <rect width="100" height="100" rx="20" fill="#a82329" />
        <circle cx="50" cy="50" r="28" fill="#f58220" />
        <path d="M42 32 h16 v36 H42 Z" fill="#ffffff" />
      </svg>
    )
  },
  {
    id: 'indianbank',
    name: 'Indian Bank',
    short: 'Indian Bank',
    type: 'Public Sector Bank',
    searchQuery: 'Indian Bank',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <rect width="100" height="100" rx="20" fill="#1b365d" />
        <circle cx="50" cy="50" r="26" fill="#e31837" />
        <polygon points="50,30 65,65 35,65" fill="#fed100" />
      </svg>
    )
  },
  {
    id: 'unionbank',
    name: 'Union Bank of India',
    short: 'UBI',
    type: 'Public Sector Bank',
    searchQuery: 'Union Bank',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <rect width="100" height="100" rx="20" fill="#00529b" />
        <path d="M28 25 v30 c0 15 10 22 22 22 s22 -7 22 -22 V25 H58 v30 c0 6 -4 9 -8 9 s-8 -3 -8 -9 V25 Z" fill="#d71920" />
      </svg>
    )
  },
  {
    id: 'axis',
    name: 'Axis Bank',
    short: 'Axis',
    type: 'Private Scheduled Bank',
    searchQuery: 'Axis',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <rect width="100" height="100" rx="20" fill="#97144d" />
        <polygon points="50,22 80,78 60,78 50,60 40,78 20,78" fill="#ffffff" />
      </svg>
    )
  },
  {
    id: 'kotak',
    name: 'Kotak Mahindra Bank',
    short: 'Kotak',
    type: 'Private Scheduled Bank',
    searchQuery: 'Kotak',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <rect width="100" height="100" rx="20" fill="#ed1c24" />
        <circle cx="50" cy="50" r="28" fill="#003366" />
        <path d="M38 32 h10 v36 H38 Z M52 32 l16 18 -16 18 h12 l10 -12 -10 -12 10 -12 Z" fill="#ffffff" />
      </svg>
    )
  },
  {
    id: 'boi',
    name: 'Bank of India',
    short: 'BOI',
    type: 'Public Sector Bank',
    searchQuery: 'Bank of India',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <rect width="100" height="100" rx="20" fill="#005baa" />
        <polygon points="50,15 62,38 85,38 66,54 73,78 50,64 27,78 34,54 15,38 38,38" fill="#f7941d" />
      </svg>
    )
  },
  {
    id: 'central',
    name: 'Central Bank of India',
    short: 'Central Bank',
    type: 'Public Sector Bank',
    searchQuery: 'Central Bank',
    logo: (
      <svg viewBox="0 0 100 100" className="w-8 h-8 shrink-0 drop-shadow">
        <rect width="100" height="100" rx="20" fill="#d2232a" />
        <circle cx="50" cy="50" r="26" fill="#0054a6" />
        <rect x="42" y="30" width="16" height="40" fill="#ffffff" />
      </svg>
    )
  }
];

export default function PromoterBanksCarousel({ onSelectBank }) {
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 320;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <section className="relative my-6" aria-label="Promoter Banks and Authorized Lenders">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-sky-400 block mb-1">
            Empanelled Lenders & Asset Reconstruction Companies
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Building2 size={20} className="text-sky-400" />
            <span>Promoter Banks</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/30 hover:bg-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
            aria-label="Previous bank"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 hover:border-white/30 hover:bg-white/[0.08] text-slate-300 hover:text-white flex items-center justify-center transition-all active:scale-95"
            aria-label="Next bank"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollContainerRef}
        className="flex items-center gap-3 overflow-x-auto no-scrollbar scroll-smooth py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {PROMOTER_BANKS.map((bank) => (
          <div
            key={bank.id}
            onClick={() => onSelectBank && onSelectBank(bank.searchQuery)}
            className="group shrink-0 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0b101e] border border-white/[0.08] hover:border-sky-400/40 hover:bg-white/[0.04] transition-all cursor-pointer shadow-md select-none w-60"
            title={`Browse auctions from ${bank.name}`}
          >
            {bank.logo}
            <div className="overflow-hidden flex-1">
              <h3 className="text-xs font-bold text-white truncate group-hover:text-sky-400 transition-colors">
                {bank.name}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                {bank.type}
              </p>
            </div>
            <ArrowUpRight size={14} className="text-slate-600 group-hover:text-sky-400 shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
        ))}
      </div>
    </section>
  );
}

