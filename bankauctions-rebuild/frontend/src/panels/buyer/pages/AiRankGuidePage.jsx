import React from 'react';
import GlassCard from '../../../components/common/GlassCard';
import SpecularBadge from '../../../components/common/SpecularBadge';
import { Sparkles, TrendingDown, ShieldCheck, MapPin, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../../components/common/Button';

export default function AiRankGuidePage() {
  const pillars = [
    {
      title: 'Discount to Market Valuation',
      weight: '40% of Score',
      icon: TrendingDown,
      color: 'text-cyan-400',
      border: 'border-cyan-500/30',
      bg: 'bg-cyan-500/10',
      desc: 'Compares the reserve price fixed by the authorized banking officer against prevailing registrar guideline values and secondary market sale deeds in the immediate micro-market.'
    },
    {
      title: 'Possession Security',
      weight: '25% of Score',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/10',
      desc: 'Physical possession under Section 14 with bank seal intact scores highest. Symbolic possession lots carry a calculated risk discount reflecting the required court warrant application.'
    },
    {
      title: 'Location & Road Access',
      weight: '20% of Score',
      icon: MapPin,
      color: 'text-purple-400',
      border: 'border-purple-500/30',
      bg: 'bg-purple-500/10',
      desc: 'Proximity to arterial ring roads, metro lines, commercial hubs, and verified front road width based on registrar layout plans and engineer on-site field visits.'
    },
    {
      title: 'Clear Title & Document Readiness',
      weight: '15% of Score',
      icon: FileCheck,
      color: 'text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      desc: 'Completeness of 30-year Encumbrance Certificate, mutation registers, nil pending litigation in High Court/DRT records, and prompt bank officer responsiveness.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <SpecularBadge variant="cyan" icon={Sparkles}>Proprietary Intelligence</SpecularBadge>
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
          How the <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">AI Rank</span> Works
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          BankAuctions.ai employs an algorithmic multi-factor valuation and risk engine to grade bank distress properties from 1 to 100, filtering out encumbered traps from genuine multi-bagger auction opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <GlassCard key={idx} className={`p-6 space-y-3 border ${p.border} hover:border-opacity-60 transition-all`}>
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${p.bg} border ${p.border} ${p.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-slate-800 text-cyan-300 border border-slate-700 font-bold">
                  {p.weight}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white pt-2">{p.title}</h2>
              <p className="text-sm text-slate-300 leading-relaxed">{p.desc}</p>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="p-8 text-center space-y-4 border border-cyan-500/30 bg-gradient-to-b from-slate-900/60 to-slate-950/80">
        <h2 className="text-2xl font-bold text-white">Ready to Discover High-Scoring Assets?</h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm leading-relaxed">
          Browse vetted auction lots sorted dynamically by highest AI investment score across major metros.
        </p>
        <div className="pt-2">
          <Link to="/search?sort=aiRank">
            <Button variant="primary" size="lg">Explore Top AI-Ranked Lots</Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
