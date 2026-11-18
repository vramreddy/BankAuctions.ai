import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/[0.08] bg-[#070b16] pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#FF5A8A] to-[#B80F4B] p-0.5 flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" viewBox="0 0 48 48" aria-hidden="true">
                  <path d="M10 23 24 11l14 12v14a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z" fill="#fff" />
                  <rect x="15" y="27" width="4.5" height="10" rx="1" fill="#D61F5C" />
                  <rect x="21.8" y="23" width="4.5" height="14" rx="1" fill="#D61F5C" />
                  <rect x="28.6" y="19" width="4.5" height="18" rx="1" fill="#D61F5C" />
                </svg>
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                bank<span className="text-rose-500">auctions</span><span className="text-xs text-rose-400 font-mono">.ai</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed">
              Ranked intelligence on bank auction properties across South India.
            </p>
          </div>

          {/* Column 1: Browse */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Browse</h5>
            <ul className="space-y-2">
              <li><Link to="/search" className="hover:text-rose-400 transition-colors">All properties</Link></li>
              <li><Link to="/flats" className="hover:text-rose-400 transition-colors">Flats &amp; apartments</Link></li>
              <li><Link to="/houses" className="hover:text-rose-400 transition-colors">Houses &amp; villas</Link></li>
              <li><Link to="/plots" className="hover:text-rose-400 transition-colors">Plots &amp; land</Link></li>
              <li><Link to="/shops" className="hover:text-rose-400 transition-colors">Shops &amp; showrooms</Link></li>
              <li><Link to="/offices" className="hover:text-rose-400 transition-colors">Offices</Link></li>
              <li><Link to="/warehouses" className="hover:text-rose-400 transition-colors">Warehouses &amp; industrial</Link></li>
              <li><Link to="/vehicles" className="hover:text-rose-400 transition-colors">Vehicles &amp; machinery</Link></li>
            </ul>
          </div>

          {/* Column 2: Plans */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Plans</h5>
            <ul className="space-y-2">
              <li><Link to="/premium" className="hover:text-rose-400 transition-colors text-rose-400 font-semibold">Premium</Link></li>
              <li><Link to="/pricing" className="hover:text-rose-400 transition-colors">Pricing</Link></li>
              <li><Link to="/concierge" className="hover:text-rose-400 transition-colors">Concierge</Link></li>
              <li><Link to="/legal" className="hover:text-rose-400 transition-colors">Talk to a lawyer</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Resources</h5>
            <ul className="space-y-2">
              <li><Link to="/data" className="hover:text-rose-400 transition-colors">Data &amp; intelligence</Link></li>
              <li><Link to="/learn" className="hover:text-rose-400 transition-colors">Learn</Link></li>
              <li><Link to="/faq" className="hover:text-rose-400 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 4: You */}
          <div className="space-y-3 text-xs">
            <h5 className="font-bold text-white text-xs uppercase tracking-wider font-mono">You</h5>
            <ul className="space-y-2">
              <li><Link to="/account" className="hover:text-rose-400 transition-colors">My account</Link></li>
              <li><Link to="/archive" className="hover:text-rose-400 transition-colors">My archive</Link></li>
              <li><Link to="/preferences" className="hover:text-rose-400 transition-colors">Set preferences</Link></li>
              <li><Link to="/support" className="hover:text-rose-400 transition-colors">Support</Link></li>
              <li><Link to="/careers" className="hover:text-rose-400 transition-colors">Careers</Link></li>
              <li><Link to="/contact" className="hover:text-rose-400 transition-colors">Contact us</Link></li>
              <li><Link to="/staff" className="hover:text-rose-400 transition-colors">Staff login</Link></li>
            </ul>
          </div>
        </div>

        {/* Fine Print Disclaimer */}
        <div className="pt-8 border-t border-white/[0.08] text-[11px] text-slate-500 leading-relaxed space-y-2">
          <p>
            © 2026 BankAuctions.ai. We provide intelligence and data and are not an auctioneer, agent or intermediary. Prototype data is illustrative. Photographs: Wikimedia Commons contributors and Pexels.
          </p>
          <div className="flex flex-wrap gap-4 text-slate-400 text-[11px]">
            <Link to="/information/terms" className="hover:underline">Terms of Service</Link>
            <Link to="/information/privacy" className="hover:underline">Privacy Policy</Link>
            <Link to="/information/refunds" className="hover:underline">Refund Policy</Link>
            <Link to="/checker/login" className="hover:underline">Checker Console</Link>
            <Link to="/admin/login" className="hover:underline">Admin Console</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
