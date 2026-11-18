import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  FileText,
  ShieldAlert,
  Coins,
  Building
} from 'lucide-react';

export default function LearnPage() {
  const [activeGuide, setActiveGuide] = useState(null);

  const guides = [
    {
      id: 'step-by-step',
      badge: 'Guide',
      title: 'How a bank auction works, step by step',
      desc: 'From SARFAESI notice to final sale certificate and registry, in clear plain language.',
      img: '/img/che.jpg',
      content: `1. Demand Notice (Section 13(2)): Borrower is given 60 days to repay after default.
2. Possession Notice (Section 13(4)): Bank takes symbolic or physical possession if unpaid.
3. Auction Sale Notice: Published 30 days prior in two newspapers with Reserve Price and EMD.
4. EMD Submission: Bidder deposits 10% EMD via RTGS/NEFT to obtain auction portal login.
5. Live E-Auction: Real-time bidding above reserve price on designated government or bank portal.
6. 25% Payment: Highest bidder pays 25% (less EMD) on the same or next working day.
7. Balance 75%: Paid within 15 days (extendable up to 90 days with bank consent).
8. Sale Certificate: Issued free of all bank encumbrances upon full payment.`
    },
    {
      id: 'emd-reserve',
      badge: 'Guide',
      title: 'Understanding EMD and reserve price',
      desc: 'What you pay upfront, how bidding increments work, and when your deposit is refunded.',
      img: '/img/hyd.jpg',
      content: `• Reserve Price: The floor price set by the bank's approved valuer below which bids cannot be accepted.
• Earnest Money Deposit (EMD): Usually 10% of the reserve price, deposited upfront as commitment.
• Refund for Unsuccessful Bidders: Automatically credited back to your bank account within 2-4 working days without deductions.
• Forfeiture Risk: If you win the auction but fail to deposit the initial 25% or balance 75%, your EMD is liable to be forfeited.`
    },
    {
      id: 'due-diligence',
      badge: 'Checklist',
      title: 'Due diligence before you bid',
      desc: 'Title records, sub-registrar EC search, possession physical reality, and local utility dues.',
      img: '/img/blr.jpg',
      content: `1. Encumbrance Certificate (EC): Inspect last 30 years at local Sub-Registrar Office for secondary mortgages.
2. Revenue Records: Verify Patta / Khata / Mutation extracts in the name of the original mortgagor.
3. Property Tax & Utility Dues: Lenders sell "as is where is". Verify unpaid municipal taxes, electricity, and society maintenance.
4. Physical Site Inspection: Always inspect on foot. Confirm boundaries match schedule, road access exists, and unit is vacant.
5. DRT Litigation: Check whether borrowers filed Securitisation Application (SA) or obtained an interim stay.`
    },
    {
      id: 'possession-types',
      badge: 'Explainer',
      title: 'Physical vs symbolic possession',
      desc: 'Why possession classification drastically changes legal risk, clearing timeline, and discount.',
      img: '/img/kochi.jpg',
      content: `• Symbolic Possession: Bank possesses only legal papers (Sec 13(4)), but borrower or tenant still holds the keys and resides inside. Eviction requires Section 14 CMM/DM court petition, which may take 3 to 12 months.
• Physical Possession: Bank has taken actual vacant custody (frequently via Section 14 police assistance). The property is padlocked with bank seal. The buyer receives direct vacant handover upon final payment.`
    },
    {
      id: 'auction-financing',
      badge: 'Guide',
      title: 'Financing an auction purchase',
      desc: 'Mortgage loans, disbursement timelines and typical lender sanction prerequisites.',
      img: '/img/living.jpg',
      content: `• Timeline Challenge: Bank auctions require full 75% payment within 15 days of winning. Typical home loans take 20-30 days to process.
• Pre-Approved Loans: Buyers should secure in-principle sanction based on their income before auction day.
• Same-Bank Financing: The lender holding the auction is often the fastest to finance the purchase since they already possess title deeds.`
    },
    {
      id: 'reading-ai-rank',
      badge: 'Explainer',
      title: 'Reading an AI Rank',
      desc: 'What the 0-100 score metrics signify, how categories are segregated, and what to verify yourself.',
      img: '/img/stairs.jpg',
      content: `• 0-100 Score: Composed of Discount (35%), Possession (25%), Location/Liquidity (20%), and Documents (20%).
• In-Category Benchmarking: Flats are compared exclusively to other flats in that city. A #1 rank indicates the most favorable risk-reward deal in that category.
• What It Leaves Out: Personal layout preferences, Vaastu compliance, and subjective interior finishes.`
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Learn</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Learn how bank auctions work.
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
          Comprehensive guides, legal explainers and diligence checklists for first-time and returning bidders.
        </p>
      </div>

      {/* Guides Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {guides.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveGuide(activeGuide === item.id ? null : item.id)}
            className="group block rounded-3xl overflow-hidden bg-slate-900/60 border border-white/10 hover:border-rose-500/40 cursor-pointer transition-all shadow-xl hover:shadow-2xl hover:shadow-rose-950/20"
          >
            <div className="aspect-[16/10] overflow-hidden bg-slate-950 relative">
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <span className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-[11px] font-bold border border-white/20">
                {item.badge}
              </span>
            </div>

            <div className="p-6 space-y-3">
              <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                {item.desc}
              </p>

              {activeGuide === item.id ? (
                <div className="pt-3 border-t border-white/[0.08] text-xs text-slate-200 whitespace-pre-line leading-relaxed font-mono bg-white/[0.03] p-3 rounded-xl">
                  {item.content}
                </div>
              ) : (
                <div className="pt-3 border-t border-white/[0.08] text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <span>Read full guide</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Support CTA */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 border border-white/10 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <h3 className="text-xl font-bold text-white">Have a specific question about an auction lot?</h3>
          <p className="text-xs text-slate-400">
            Consult our empanelled DRT legal bench or review the full auction FAQ before submitting your EMD.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/faq"
            className="px-5 py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors"
          >
            View FAQ
          </Link>
          <Link
            to="/legal"
            className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-colors"
          >
            Talk to a Lawyer
          </Link>
        </div>
      </section>
    </div>
  );
}
