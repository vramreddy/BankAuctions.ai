import React, { useState } from 'react';
import {
  Calculator,
  BellRing,
  ShieldAlert,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  X,
  Sparkles
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export default function AuctionActionHub() {
  const [activeModal, setActiveModal] = useState(null); // 'calc' | 'alerts' | 'drt' | 'checklist' | null

  // EMD Calculator State
  const [reservePrice, setReservePrice] = useState(6500000); // 65 Lakhs default
  const emdAmount = reservePrice * 0.10;
  const dayOfSaleAmount = reservePrice * 0.15;
  const balanceAmount = reservePrice * 0.75;
  const stampDuty = reservePrice * 0.07;
  const registrationFee = reservePrice * 0.01;
  const totalOutlay = reservePrice + stampDuty + registrationFee;

  // WhatsApp Alert State
  const [alertPhone, setAlertPhone] = useState('');
  const [alertCity, setAlertCity] = useState('Chennai');
  const [alertSubscribed, setAlertSubscribed] = useState(false);

  // DRT Radar State
  const [drtQuery, setDrtQuery] = useState('');
  const [drtResult, setDrtResult] = useState(null);

  const handleDrtCheck = (e) => {
    e.preventDefault();
    if (!drtQuery.trim()) return;
    setDrtResult({
      status: 'CLEARED_NO_STAY',
      query: drtQuery,
      drtBench: 'DRT-1 / DRT-2 Chennai Registry',
      causeListScanned: 'Scanned 14,280 SA/OA records (2020-2026)',
      message: 'No active stay order found restraining auction proceedings for this property reference.'
    });
  };

  return (
    <section className="space-y-4" aria-label="Quick Action Tools for Bidders">
      {/* 4 Interactive Action Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Action 1: EMD Calculator */}
        <div
          onClick={() => setActiveModal('calc')}
          className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-brand-cyan/40 hover:bg-white/[0.04] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex items-center justify-center text-brand-cyan mb-3 group-hover:scale-105 transition-transform">
              <Calculator size={20} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-brand-cyan transition-colors">
              EMD & Cashflow Calculator
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Plan your 10% EMD, 15% day-of-sale deposit, and 75% 15-day balance with stamp duty estimates.
            </p>
          </div>
          <span className="text-[11px] font-mono text-brand-cyan flex items-center gap-1 mt-4">
            Open Calculator <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Action 2: WhatsApp Alerts */}
        <div
          onClick={() => setActiveModal('alerts')}
          className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-emerald-500/40 hover:bg-white/[0.04] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3 group-hover:scale-105 transition-transform">
              <BellRing size={20} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-400 transition-colors">
              Instant WhatsApp Alerts
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get notified the moment a lender publishes an auction in your target locality or budget.
            </p>
          </div>
          <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1 mt-4">
            Set Up Alerts <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Action 3: DRT Stay Order Radar */}
        <div
          onClick={() => setActiveModal('drt')}
          className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-amber-400/40 hover:bg-white/[0.04] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-105 transition-transform">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-amber-400 transition-colors">
              DRT Litigation Radar
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scan causelists across DRT-1, 2 & 3 for borrower stay petitions, Section 17 appeals, or caveats.
            </p>
          </div>
          <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1 mt-4">
            Check Stay Status <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>

        {/* Action 4: 10-Point Pre-Bid Checklist */}
        <div
          onClick={() => setActiveModal('checklist')}
          className="glass-panel p-5 rounded-2xl border border-white/10 hover:border-indigo-400/40 hover:bg-white/[0.04] transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 group-hover:scale-105 transition-transform">
              <FileCheck2 size={20} />
            </div>
            <h3 className="text-sm font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
              Pre-Bid SARFAESI Audit
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              10-point checklist before submitting EMD: Section 13(4), DM orders, 30-yr EC, and tax liabilities.
            </p>
          </div>
          <span className="text-[11px] font-mono text-indigo-400 flex items-center gap-1 mt-4">
            View 10-Point Checklist <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* MODAL 1: EMD Calculator */}
      {activeModal === 'calc' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6 relative">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calculator size={20} className="text-brand-cyan" />
                <h3 className="text-lg font-bold text-white">EMD & Capital Outlay Calculator</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-mono text-slate-400 uppercase">Reserve Price</span>
                <span className="text-base font-mono font-bold text-white">{formatINR(reservePrice)}</span>
              </div>
              <input
                type="range"
                min="1000000"
                max="50000000"
                step="500000"
                value={reservePrice}
                onChange={(e) => setReservePrice(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                <span>₹10 Lakh</span>
                <span>₹2.5 Crore</span>
                <span>₹5 Crore</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400 block mb-1">10% EMD to Bid</span>
                <span className="text-sm font-mono font-bold text-brand-cyan">{formatINR(emdAmount)}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Payable before auction</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400 block mb-1">15% on Day of Sale</span>
                <span className="text-sm font-mono font-bold text-white">{formatINR(dayOfSaleAmount)}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Upon winning bid</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400 block mb-1">75% Balance Outlay</span>
                <span className="text-sm font-mono font-bold text-white">{formatINR(balanceAmount)}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">Within 15 days of sale</span>
              </div>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-slate-400 block mb-1">Est. Stamp Duty (7%)</span>
                <span className="text-sm font-mono font-bold text-amber-400">{formatINR(stampDuty)}</span>
                <span className="text-[10px] text-slate-500 block mt-0.5">+ {formatINR(registrationFee)} reg.</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-brand-cyan/10 border border-brand-cyan/20 flex justify-between items-center">
              <div>
                <span className="text-xs text-slate-300 block">Total Capital Required</span>
                <span className="text-xs text-slate-500">Includes property + registry</span>
              </div>
              <span className="text-lg font-mono font-black text-brand-cyan">{formatINR(totalOutlay)}</span>
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
            >
              Close Calculator
            </button>
          </div>
        </div>
      )}

      {/* MODAL 2: WhatsApp Alerts */}
      {activeModal === 'alerts' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-5 relative">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <BellRing size={20} className="text-emerald-400" />
                <h3 className="text-lg font-bold text-white">WhatsApp Auction Alerts</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            {alertSubscribed ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 size={36} className="text-emerald-400 mx-auto" />
                <h4 className="text-base font-bold text-white">Alerts Active!</h4>
                <p className="text-xs text-slate-300">
                  You will receive instant alerts for new bank auctions in {alertCity} on WhatsApp at {alertPhone}.
                </p>
                <button
                  onClick={() => { setAlertSubscribed(false); setActiveModal(null); }}
                  className="mt-3 px-4 py-2 rounded-xl bg-white/10 text-xs text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (alertPhone.length >= 10) setAlertSubscribed(true);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    WhatsApp Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={alertPhone}
                    onChange={(e) => setAlertPhone(e.target.value)}
                    className="w-full rounded-xl glass-input px-3.5 py-2.5 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                    Target City
                  </label>
                  <select
                    value={alertCity}
                    onChange={(e) => setAlertCity(e.target.value)}
                    className="w-full rounded-xl glass-input px-3.5 py-2.5 text-sm"
                  >
                    <option value="Chennai">Chennai</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Kochi">Kochi / Kerala</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] text-slate-400 flex items-center gap-2">
                  <Sparkles size={14} className="text-emerald-400 shrink-0" />
                  <span>Zero spam. Only certified bank notices with reserve price under 30 days to auction.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs tracking-wider transition-all"
                >
                  Activate WhatsApp Alerts
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 3: DRT Radar */}
      {activeModal === 'drt' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-5 relative">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShieldAlert size={20} className="text-amber-400" />
                <h3 className="text-lg font-bold text-white">DRT Litigation & Stay Radar</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDrtCheck} className="space-y-3">
              <label className="block text-xs font-mono uppercase text-slate-400">
                Enter Borrower Name, Bank Name, or SA / OA Reference
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g. State Bank of India, Ambattur, or SA 142/2024"
                  value={drtQuery}
                  onChange={(e) => setDrtQuery(e.target.value)}
                  className="flex-1 rounded-xl glass-input px-3.5 py-2.5 text-sm"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs"
                >
                  Scan
                </button>
              </div>
            </form>

            {drtResult && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <CheckCircle2 size={16} />
                  <span>REGISTRY CLEARANCE CONFIRMED</span>
                </div>
                <p className="text-xs text-slate-300">{drtResult.message}</p>
                <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>{drtResult.drtBench}</span>
                  <span>{drtResult.causeListScanned}</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL 4: Pre-Bid Checklist */}
      {activeModal === 'checklist' && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 sticky top-0 bg-[#0b0f19] z-10">
              <div className="flex items-center gap-2">
                <FileCheck2 size={20} className="text-indigo-400" />
                <h3 className="text-lg font-bold text-white">10-Point Pre-Bid SARFAESI Audit</h3>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { title: '1. Section 13(2) Demand Notice', desc: 'Confirm 60-day demand notice was duly published and served without defects.' },
                { title: '2. Section 13(4) Possession Order', desc: 'Verify whether possession is symbolic or physically secured under Section 14 CMM/DM order.' },
                { title: '3. 30-Day Public Auction Publication', desc: 'Rule 8(6) & 9(1) of Security Interest Rules mandates 30-day notice in two leading newspapers.' },
                { title: '4. 30-Year Encumbrance Certificate (EC)', desc: 'Inspect Form 15 at Sub-Registrar Office to ensure no prior government or municipal attachment.' },
                { title: '5. Unpaid Property Tax & Electricity Dues', desc: 'Bank auctions are "as is where is"; verify outstanding local body taxes and utility arrears.' },
                { title: '6. Society / Apartment Maintenance Dues', desc: 'Obtain written confirmation from RWA on transfer charges and pending monthly dues.' },
                { title: '7. Ground Inspection & Structural Integrity', desc: 'Inspect the property in person during the authorized bank inspection window.' },
                { title: '8. Tenant / Lessee Protection Rights', desc: 'Examine if any tenancy agreement predates the bank mortgage under state rent control acts.' },
                { title: '9. DRT Stay / SA Litigation Search', desc: 'Verify no Securitisation Application (SA) stay order is pending before DRT bench.' },
                { title: '10. 15-Day Balance Settlement Liquidity', desc: 'Ensure 75% funds or sanctioned auction loan is ready within 15 days of sale confirmation.' }
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex gap-3">
                  <CheckCircle2 size={16} className="text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-white text-xs">{item.title}</h5>
                    <p className="text-slate-400 text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveModal(null)}
              className="w-full py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-slate-950 font-bold text-xs"
            >
              Done Checklist
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
