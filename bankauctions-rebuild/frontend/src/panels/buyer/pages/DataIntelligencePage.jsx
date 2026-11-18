import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Percent,
  FileCheck,
  MapPin,
  TrendingUp,
  Layers
} from 'lucide-react';

export default function DataIntelligencePage() {
  const pillars = [
    {
      title: 'Discount to market',
      points: 'up to 40 pts',
      desc: 'Reserve price rigorously indexed against our micro-locality market estimates.'
    },
    {
      title: 'Possession status',
      points: 'up to 25 pts',
      desc: 'Physical possession orders (Sec 14 CMM/DM) score substantially higher than symbolic possession (Sec 13(4)).'
    },
    {
      title: 'Location & liquidity',
      points: 'up to 20 pts',
      desc: 'Road frontage, arterial connectivity, commercial catchment and historic resale velocity.'
    },
    {
      title: 'Documents & photographs',
      points: 'up to 15 pts',
      desc: 'Published Sec 13(2) notices, title scrutiny records, and certified ground inspection photos.'
    }
  ];

  const categoryDiscounts = [
    { name: 'Plots & land', discount: 30, width: '100%' },
    { name: 'Vehicles & machinery', discount: 27, width: '90%' },
    { name: 'Warehouses & industrial', discount: 26, width: '87%' },
    { name: 'Flats & apartments', discount: 23, width: '76%' },
    { name: 'Houses & villas', discount: 21, width: '71%' },
    { name: 'Offices', discount: 21, width: '69%' },
    { name: 'Shops & showrooms', discount: 19, width: '62%' }
  ];

  const cityCoverage = [
    { city: 'Chennai', live: '1,528', newWeek: '184', discount: '31%', lenders: '214' },
    { city: 'Hyderabad', live: '833', newWeek: '119', discount: '31%', lenders: '186' },
    { city: 'Bengaluru', live: '2,004', newWeek: '236', discount: '31%', lenders: '228' },
    { city: 'Coimbatore', live: '511', newWeek: '68', discount: '31%', lenders: '148' },
    { city: 'Kerala', live: '4,860', newWeek: '412', discount: '31%', lenders: '196' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Data & intelligence</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          The numbers behind every rank.
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
          How we collect auction data, score each property, and keep rankings fair across categories without bias.
        </p>
      </div>

      {/* 4 Pillars of AI Rank */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white">How AI Rank works</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Every property receives an objective quantitative score out of 100 before being ranked.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pil, i) => (
            <div key={i} className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
              <span className="text-rose-400 font-mono text-xs font-bold uppercase">{pil.points}</span>
              <h3 className="text-lg font-bold text-white">{pil.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{pil.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Average Discount by Category */}
      <section className="rounded-3xl bg-slate-900/80 border border-white/10 p-8 sm:p-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-3">
            <h2 className="text-2xl font-extrabold text-white">Average discount by category</h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Mean discount to current prevailing market benchmark values across verified auction notices. Land parcels and industrial units frequently offer the deepest discounts.
            </p>
          </div>

          <div className="lg:col-span-7 space-y-3">
            {categoryDiscounts.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-3 items-center text-xs">
                <span className="col-span-4 font-semibold text-slate-300">{item.name}</span>
                <div className="col-span-6 bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-rose-400 h-full rounded-full"
                    style={{ width: item.width }}
                  />
                </div>
                <span className="col-span-2 text-right font-bold text-white">{item.discount}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coverage by City Table */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Coverage by city</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time verified listings, new additions, average discounts and covered financial institutions.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-slate-900/60">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.04] text-slate-400 font-mono uppercase text-[11px] border-b border-white/10">
              <tr>
                <th className="py-4 px-6 font-bold">City / Metro</th>
                <th className="py-4 px-6 font-bold">Live properties</th>
                <th className="py-4 px-6 font-bold">New this week</th>
                <th className="py-4 px-6 font-bold">Avg. discount</th>
                <th className="py-4 px-6 font-bold">Lenders tracked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06] text-slate-200">
              {cityCoverage.map((row, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-bold text-white text-sm">{row.city}</td>
                  <td className="py-4 px-6">{row.live}</td>
                  <td className="py-4 px-6 text-emerald-400 font-semibold">{row.newWeek}</td>
                  <td className="py-4 px-6 font-bold text-rose-400">{row.discount}</td>
                  <td className="py-4 px-6">{row.lenders}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3 Core Methodology Pillars */}
      <section className="grid md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <h3 className="text-base font-bold text-white">Primary Sources</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bank and financial-institution SARFAESI sale notices, official DRT e-auction gazettes, and Debt Recovery Tribunal orders.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <h3 className="text-base font-bold text-white">Ground Verification</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Certified field engineers inspect selected physical properties, taking geo-tagged, dated photographs of occupancy and access.
          </p>
        </div>
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <h3 className="text-base font-bold text-white">Category-Isolated Ranking</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ranks are computed exclusively within each property category and city. A residential flat is never benchmarked against a commercial godown.
          </p>
        </div>
      </section>
    </div>
  );
}
