import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, FileText, CheckCircle2, AlertTriangle, 
  ShieldCheck, FileSearch, ArrowRight, Clock, Building2 
} from 'lucide-react';
import { api } from '../services/api';

export default function AdvocateDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pendingTitleChecks: 8,
    active12BReviews: 3,
    clearedOpinions: 24,
    drtStayChecks: 2
  });

  useEffect(() => {
    // simulated initial legal workload fetch
    setTimeout(() => setLoading(false), 300);
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel relative overflow-hidden border-amber-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[11px] uppercase font-mono tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5" />
                SARFAESI Advocate Legal Scrutiny Bench
              </span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-semibold font-mono">
                Active Bar Panel
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Advocate Legal Clearance &amp; Section 12B Audit
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
              Conduct 30-year Encumbrance Certificate (EC) scrutiny, verify Section 13(2)/13(4) notices, track DRT stay orders, and issue digital Title Clearance Certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/sarfaesi-12b"
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 hover:scale-[1.02] transition-transform flex items-center gap-2"
            >
              <span>Audit Section 12B Notices</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl glass-panel border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Title Checks Pending</span>
            <FileSearch className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats.pendingTitleChecks}</div>
          <span className="text-[10px] text-amber-400 font-mono">30-Year EC Audit Needed</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Section 12B Scrutiny</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats.active12BReviews}</div>
          <span className="text-[10px] text-cyan-400 font-mono">Statutory Notice Checks</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Cleared Legal Opinions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats.clearedOpinions}</div>
          <span className="text-[10px] text-emerald-400 font-mono">Marketable Clear Title</span>
        </div>

        <div className="p-5 rounded-2xl glass-panel border-amber-500/20">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">DRT / High Court Stays</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono">{stats.drtStayChecks}</div>
          <span className="text-[10px] text-rose-400 font-mono">Under Scrutiny</span>
        </div>
      </div>

      {/* Active Work Modules */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-3xl border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Section 12B &amp; SARFAESI Compliance Pipeline</span>
            </h2>
            <Link to="/sarfaesi-12b" className="text-xs text-amber-400 hover:underline">View All →</Link>
          </div>
          <p className="text-xs text-slate-400">
            Verify lender symbolic/physical possession compliance under SARFAESI Section 13(4) and statutory Rule 8(6) 30-day notice proofs prior to asset bidding.
          </p>
          <div className="space-y-2.5 pt-2">
            {[
              { bank: 'Indian Overseas Bank', lot: 'M-94 Plot Kancheepuram', status: 'Possession 13(4) Confirmed', date: '2026-12-10' },
              { bank: 'State Bank of India', lot: 'Flat S-2 Shri Sai Homes Adhanur', status: 'CERSAI ID Verified', date: '2026-11-27' },
              { bank: 'Canara Bank', lot: '2277 sq ft Site Rajapalayam', status: 'Rule 8(6) Proof Attached', date: '2026-12-16' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{item.lot}</div>
                  <div className="text-[10px] text-slate-400">{item.bank} · Auction Date: {item.date}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 rounded-3xl border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-base text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Encumbrance &amp; Title Verification Desk</span>
            </h2>
            <Link to="/title-scrutiny" className="text-xs text-amber-400 hover:underline">Open Desk →</Link>
          </div>
          <p className="text-xs text-slate-400">
            Inspect Sub-Registrar 30-year Encumbrance Certificates (Form 15), Parent Sale Deeds, Patta/Chitta mutation, and local revenue records.
          </p>
          <div className="space-y-2.5 pt-2">
            {[
              { lot: 'Kancheepuram Neighbourhood Scheme', ecYears: '32 Years Scrutinized', risk: 'LOW RISK' },
              { lot: 'Sai Homes Apartment Adhanur', ecYears: '30 Years Scrutinized', risk: 'CLEAR TITLE' },
              { lot: 'Inam Thoppupatti Rajapalayam', ecYears: '34 Years Scrutinized', risk: 'CLEAR TITLE' },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-white/[0.06] flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-white">{item.lot}</div>
                  <div className="text-[10px] text-slate-400">{item.ecYears}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  {item.risk}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
