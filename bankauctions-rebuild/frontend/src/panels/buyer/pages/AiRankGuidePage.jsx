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
      color: 'text-brand-cyan',
      desc: 'Compares the reserve price fixed by the authorized banking officer against prevailing registrar guideline values and secondary market sale deeds in the immediate micro-market.'
    },
    {
      title: 'Possession Security',
      weight: '25% of Score',
      icon: ShieldCheck,
      color: 'text-emerald-400',
      desc: 'Physical possession under Section 14 with bank seal intact scores highest. Symbolic possession lots carry a calculated risk discount reflecting the required court warrant application.'
    },
    {
      title: 'Location & Road Access',
      weight: '20% of Score',
      icon: MapPin,
      color: 'text-purple-400',
      desc: 'Proximity to arterial ring roads, metro lines, commercial hubs, and verified front road width based on registrar layout plans and engineer on-site field visits.'
    },
    {
      title: 'Clear Title & Document Readiness',
      weight: '15% of Score',
      icon: FileCheck,
      color: 'text-amber-400',
      desc: 'Completeness of 30-year Encumbrance Certificate, mutation registers, nil pending litigation in High Court/DRT records, and prompt bank officer responsiveness.'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <SpecularBadge variant="cyan" icon={Sparkles}>Proprietary Intelligence</SpecularBadge>
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
          How the <span className="text-brand-cyan">AI Rank</span> Works
        </h1>
        <p className="text-lg text-slate-300">
          BankAuctions.ai employs an algorithmic multi-factor valuation and risk engine to grade bank distress properties from 1 to 100, filtering out encumbered traps from genuine multi-bagger auction opportunities.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <GlassCard key={idx} className="p-6 space-y-3">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 ${p.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {p.weight}
                </span>
              </div>
              <h2 className="text-xl font-bold text-white pt-2">{p.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{p.desc}</p>
            </GlassCard>
          );
        })}
      </div>

      <GlassCard className="p-8 text-center space-y-4 border border-brand-cyan/30">
        <h2 className="text-2xl font-bold text-white">Ready to Discover High-Scoring Assets?</h2>
        <p className="text-slate-300 max-w-2xl mx-auto text-sm">
          Browse vetted auction lots sorted dynamically by highest AI investment score across major metros.
        </p>
        <div className="pt-2">
          <Link to="/search">
            <Button variant="primary" size="lg">Explore Top AI-Ranked Lots</Button>
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
