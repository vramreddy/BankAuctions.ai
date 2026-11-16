import React from 'react';
import GlassCard from '../../../components/common/GlassCard';
import SpecularBadge from '../../../components/common/SpecularBadge';
import { BookOpen, Scale, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuidesPage() {
  const guides = [
    {
      title: 'The Complete SARFAESI Act Auction Guide for Buyers',
      tag: 'Legal Process',
      desc: 'Understand Section 13(2) demand notices, Section 13(4) possession notices, 30-day statutory sale notice rules, and how physical possession is handed over.'
    },
    {
      title: 'How to Submit EMD (Earnest Money Deposit) Safely',
      tag: 'Financial Due Diligence',
      desc: 'Step-by-step guidance on RTGS/NEFT transfers to bank escrow accounts, IBAPI and MSTC tender bidding portals, and refund timelines if outbid.'
    },
    {
      title: 'Title Verification Checklist Before Bidding',
      tag: 'Risk Mitigation',
      desc: 'Key encumbrances to check: 30-year Encumbrance Certificate (EC), property tax arrears, electricity board dues, and ongoing civil court litigations.'
    },
    {
      title: 'Physical vs Symbolic Possession: Realities on the Ground',
      tag: 'Field Operations',
      desc: 'Why banks conduct symbolic possession auctions, how Chief Metropolitan Magistrate (CMM) warrants work under Section 14, and realistic timelines to secure keys.'
    },
    {
      title: 'Sale Certificate Registration & Stamp Duty Norms',
      tag: 'Post-Auction Conveyance',
      desc: 'Legal nuances of registering the Authorized Officer sale certificate under Indian Stamp Act, Section 89(4) registration exemptions, and sub-registrar procedures.'
    },
    {
      title: 'Participating in Commercial DRT Auctions',
      tag: 'Recovery Tribunal',
      desc: 'Differences between SARFAESI bank auctions and Debt Recovery Tribunal (DRT) auctions conducted by Recovery Officers under RDB Act.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <SpecularBadge variant="cyan" icon={BookOpen}>Knowledge Base</SpecularBadge>
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl">
          Bank Auction Buyer's <span className="text-brand-cyan">Field Manual</span>
        </h1>
        <p className="text-lg text-slate-300">
          Essential legal frameworks, financial due diligence protocols, and ground reality playbooks for buying auction properties safely in India.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides.map((g, idx) => (
          <GlassCard key={idx} className="p-6 flex flex-col justify-between hover:border-brand-cyan/40 transition-all">
            <div className="space-y-3">
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-brand-cyan border border-brand-cyan/20">
                {g.tag}
              </span>
              <h2 className="text-lg font-bold text-white pt-1">{g.title}</h2>
              <p className="text-sm text-slate-400 leading-relaxed">{g.desc}</p>
            </div>
            <div className="pt-6 border-t border-slate-800/80 mt-4 flex items-center text-xs font-semibold text-brand-cyan hover:text-white transition-colors">
              <span>Read Full Regulatory Playbook</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
