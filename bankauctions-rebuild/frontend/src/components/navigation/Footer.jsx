import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="ft mt-24 bg-[#0B1B30] text-[#c9c9d4] text-sm pt-0 pb-20">
      <div className="w max-w-[1360px] mx-auto px-6">
        {/* Top CTA Banner */}
        <div className="fcta flex items-center justify-between gap-6 flex-wrap py-10 border-b border-white/10">
          <div>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-1">
              Ready to find your next auction property?
            </h4>
            <p className="text-[#9a9aa8] text-sm m-0">
              Browse free. Unlock the details when you are serious.
            </p>
          </div>
          <div className="fbt flex gap-3 flex-wrap">
            <Link
              to="/search"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-sm text-white bg-[var(--rose,#0F766E)] hover:brightness-105 transition-all shadow-md"
            >
              Search properties
            </Link>
            <Link
              to="/pricing"
              className="inline-flex items-center justify-center px-6 py-3 rounded-full font-bold text-sm text-white border border-white/40 hover:border-white transition-all"
            >
              See plans
            </Link>
          </div>
        </div>

        {/* 4 Footer Columns */}
        <div className="cols grid grid-cols-2 md:grid-cols-4 gap-8 py-11 border-b border-white/10">
          {/* Col 1: Browse */}
          <div>
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-white mb-3">
              Browse
            </h5>
            <div className="flex flex-col space-y-2 text-xs text-[#b4b4c0]">
              <Link to="/search" className="hover:text-white transition-colors">All properties</Link>
              <Link to="/flats" className="hover:text-white transition-colors">Flats &amp; apartments</Link>
              <Link to="/houses" className="hover:text-white transition-colors">Houses &amp; villas</Link>
              <Link to="/plots" className="hover:text-white transition-colors">Plots &amp; land</Link>
              <Link to="/shops" className="hover:text-white transition-colors">Shops &amp; showrooms</Link>
              <Link to="/offices" className="hover:text-white transition-colors">Offices</Link>
              <Link to="/warehouses" className="hover:text-white transition-colors">Warehouses &amp; industrial</Link>
              <Link to="/vehicles" className="hover:text-white transition-colors">Vehicles &amp; machinery</Link>
            </div>
          </div>

          {/* Col 2: Plans and services */}
          <div>
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-white mb-3">
              Plans and services
            </h5>
            <div className="flex flex-col space-y-2 text-xs text-[#b4b4c0]">
              <Link to="/premium" className="text-[#2DD4BF] font-semibold hover:text-white transition-colors">Premium properties</Link>
              <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
              <Link to="/concierge" className="hover:text-white transition-colors">Concierge</Link>
              <Link to="/property-management" className="hover:text-white transition-colors">Property management</Link>
              <Link to="/nri-services" className="hover:text-white transition-colors">NRI services</Link>
              <Link to="/lawyers" className="hover:text-white transition-colors">Talk to a lawyer</Link>
            </div>
          </div>

          {/* Col 3: Resources */}
          <div>
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-white mb-3">
              Resources
            </h5>
            <div className="flex flex-col space-y-2 text-xs text-[#b4b4c0]">
              <Link to="/data" className="hover:text-white transition-colors">Data &amp; intelligence</Link>
              <Link to="/learn" className="hover:text-white transition-colors">Learn</Link>
              <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
              <Link to="/support" className="hover:text-white transition-colors">Support</Link>
              <Link to="/careers" className="hover:text-white transition-colors">Careers</Link>
              <Link to="/contact" className="hover:text-white transition-colors">Contact us</Link>
            </div>
          </div>

          {/* Col 4: Your account */}
          <div>
            <h5 className="font-extrabold text-xs uppercase tracking-wider text-white mb-3">
              Your account
            </h5>
            <div className="flex flex-col space-y-2 text-xs text-[#b4b4c0]">
              <Link to="/account" className="hover:text-white transition-colors">My account</Link>
              <Link to="/archive" className="hover:text-white transition-colors">My archive</Link>
              <Link to="/preferences" className="hover:text-white transition-colors">User preference</Link>
              <Link to="/staff" className="hover:text-white transition-colors">Staff login</Link>
              <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Admin Console ↗</a>
              <a href="http://localhost:5175" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Checker Console ↗</a>
              <a href="http://localhost:5176" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Advocate Console ↗</a>
              <a href="http://localhost:5177" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Engineer Console ↗</a>
            </div>
          </div>
        </div>

        {/* Fine print */}
        <div className="fine pt-6 text-xs text-[#8a8a98] flex justify-between items-center flex-wrap gap-4 leading-relaxed">
          <span>
            © 2026 BankAuctions.ai. We provide intelligence and data and are not an auctioneer, agent or intermediary.
          </span>
          <span>
            Prototype data is illustrative. Photographs: Wikimedia Commons contributors and Pexels.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
