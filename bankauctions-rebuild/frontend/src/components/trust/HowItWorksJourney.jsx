import React from 'react';
import {
  Search,
  KeyRound,
  Landmark,
  CheckCircle2,
  FileSpreadsheet,
  Building,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';

export default function HowItWorksJourney() {
  const steps = [
    {
      num: '01',
      title: 'Search every auction',
      desc: 'Notices from newspapers and lender sites, read and structured into one searchable list — by locality, budget or plain words.',
      icon: <Search size={22} className="text-sky-400" />,
      accentGradient: 'from-sky-500/20 via-sky-500/5 to-transparent',
      borderColor: 'hover:border-sky-500/40',
      badge: 'Aggregated & Structured',
      badgeColor: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
      tagline: 'Newspapers, e-gazettes & DRT registries scanned daily'
    },
    {
      num: '02',
      title: 'Unlock the facts',
      desc: "Lender, address, documents and our field team's verification for the properties you are serious about.",
      icon: <KeyRound size={22} className="text-indigo-400" />,
      accentGradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent',
      borderColor: 'hover:border-indigo-500/40',
      badge: 'Ground Verified',
      badgeColor: 'text-indigo-400 border-indigo-400/30 bg-indigo-400/10',
      tagline: 'Field engineer photo/video + advocate title review'
    },
    {
      num: '03',
      title: 'Bid with the bank',
      desc: "Register and pay EMD on the lender's own e-auction portal. We never touch bid money.",
      icon: <Landmark size={22} className="text-emerald-400" />,
      accentGradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent',
      borderColor: 'hover:border-emerald-500/40',
      badge: 'Zero Custody Risk',
      badgeColor: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
      tagline: 'Direct payment to bank official RTGS/MSTC portal'
    }
  ];

  return (
    <section className="relative my-10" aria-label="How BankAuctions works in three steps">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-brand-cyan block mb-1">
            Simplified Auction Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Three steps from discovery to winning bid
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          A transparent bridge built for real buyers. No hidden brokerage, zero custody of bidder funds.
        </p>
      </div>

      {/* 3 Step Cards Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className={`group relative rounded-3xl bg-[#0b101e] border border-white/[0.08] p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:-translate-y-1 ${step.borderColor} overflow-hidden`}
          >
            {/* Subtle Gradient Glow in Corner */}
            <div
              className={`absolute -top-16 -right-16 w-44 h-44 rounded-full bg-gradient-to-br ${step.accentGradient} blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-100 opacity-60`}
            />

            <div>
              {/* Top Row: Number & Icon */}
              <div className="flex items-center justify-between mb-6">
                <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-white/30 group-hover:text-white/80 transition-colors">
                  {step.num}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 group-hover:bg-white/[0.08] transition-all">
                  {step.icon}
                </div>
              </div>

              {/* Step Title */}
              <h3 className="text-xl font-bold text-white mb-3 tracking-tight group-hover:text-white transition-colors">
                {step.title}
              </h3>

              {/* Step Description */}
              <p className="text-sm text-slate-400 leading-relaxed font-normal">
                {step.desc}
              </p>
            </div>

            {/* Bottom Accent Highlight */}
            <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono border ${step.badgeColor}`}>
                <CheckCircle2 size={12} className="shrink-0" />
                <span>{step.badge}</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
