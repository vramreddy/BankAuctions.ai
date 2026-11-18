import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Scale, Compass, Building2, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-xl pt-16 pb-12 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav aria-label="Policies and staff access" className="flex flex-wrap gap-5 mb-8 text-sm">
          <Link to="/information/terms">Terms and conditions</Link>
          <Link to="/information/privacy">Privacy policy</Link>
          <Link to="/information/payments">Payment information</Link>
          <Link to="/information/refunds">Refund policy</Link>
          <Link to="/checker/login">Checker login</Link>
          <Link to="/admin/login">Administrator login</Link>
        </nav>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent-cyan to-blue-600 p-0.5">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-extrabold text-accent-cyan text-sm">B</span>
                </div>
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">
                Bank<span className="text-accent-cyan">Auctions</span>.ai
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-sm text-slate-400">
              India’s dedicated intelligence platform for commercial and residential bank auction properties. We analyze, verify, and track SARFAESI and DRT public auction notices.
            </p>
            <div className="pt-2 text-xs flex items-center gap-2 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-accent-cyan" />
              <span>Independent bank auction data aggregator &amp; analytics</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Discover</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search" className="hover:text-accent-cyan transition-colors">All Auctions</Link></li>
              <li><Link to="/category/flats" className="hover:text-accent-cyan transition-colors">Residential Apartments</Link></li>
              <li><Link to="/category/houses" className="hover:text-accent-cyan transition-colors">Independent Houses</Link></li>
              <li><Link to="/category/commercial" className="hover:text-accent-cyan transition-colors">Commercial &amp; Retail</Link></li>
              <li><Link to="/category/industrial" className="hover:text-accent-cyan transition-colors">Industrial Sheds</Link></li>
            </ul>
          </div>

          {/* Hubs */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Major Metros</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/search?city=Chennai" className="hover:text-accent-cyan transition-colors">Chennai Auctions</Link></li>
              <li><Link to="/search?city=Bengaluru" className="hover:text-accent-cyan transition-colors">Bengaluru Auctions</Link></li>
              <li><Link to="/search?city=Hyderabad" className="hover:text-accent-cyan transition-colors">Hyderabad Auctions</Link></li>
              <li><Link to="/search?city=Coimbatore" className="hover:text-accent-cyan transition-colors">Coimbatore Auctions</Link></li>
              <li><Link to="/search?city=Kochi" className="hover:text-accent-cyan transition-colors">Kerala Auctions</Link></li>
            </ul>
          </div>

          {/* Regulatory & Knowledge */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold">Knowledge</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/ai-rank" className="hover:text-accent-cyan transition-colors">AI Valuation Metric</Link></li>
              <li><Link to="/guides" className="hover:text-accent-cyan transition-colors">SARFAESI Buyer Guide</Link></li>
              <li><Link to="/legal" className="hover:text-accent-cyan transition-colors">Talk to a Lawyer</Link></li>
              <li><Link to="/pricing" className="hover:text-accent-cyan transition-colors">Subscription Tiers</Link></li>
              <li><span className="text-slate-600">DRT Tribunal Procedures</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BankAuctions.ai Technologies India Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/information/terms" className="hover:text-slate-400">Terms of Service</Link>
            <Link to="/information/privacy" className="hover:text-slate-400">Privacy Policy</Link>
            <span className="hover:text-slate-400 cursor-pointer">Disclaimer &amp; Due Diligence</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
