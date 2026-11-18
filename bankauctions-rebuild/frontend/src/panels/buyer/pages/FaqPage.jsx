import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'How does AI Rank calculate scores?',
      a: 'Each listing receives a quantitative score from 0 to 100 based on 4 criteria: Discount to micro-market value (up to 40 pts), Possession status physical vs symbolic (up to 25 pts), Location accessibility & road frontage (up to 20 pts), and Documentation clarity / photographs (up to 15 pts). Properties are benchmarked exclusively within their own asset class and city.'
    },
    {
      q: 'What is the difference between Pro and Premium plans?',
      a: 'Pro is a non-expiring pack (₹499 for 5 property unlocks) that provides full dossiers, AI rank breakdowns, and field photos across all categories. Premium is a dedicated 1, 2 or 3 month city plan (₹1,499 - ₹3,499) providing curated highway frontage, corner plots, and prime commercial assets with unlocked lenders and exact locations.'
    },
    {
      q: 'Are the photographs verified by real humans?',
      a: 'Yes. Where photographs are provided by the lender, they are clearly tagged "Bank supplied". In addition, our certified local field engineers visit assets on foot to inspect occupancy, check access roads, verify boundaries, and capture fresh geo-tagged photographs.'
    },
    {
      q: 'What happens to my EMD if I lose the auction?',
      a: 'If you are not the highest bidder, your 10% Earnest Money Deposit (EMD) is automatically refunded back to your source bank account within 2 to 4 working days with zero deduction by the lender.'
    },
    {
      q: 'What is the difference between Physical and Symbolic possession?',
      a: 'Symbolic possession (Section 13(4) SARFAESI) means the bank has legal claim, but the borrower, guarantor or tenant may still physically occupy the premises. Physical possession (often obtained via Section 14 CMM/DM court order) means the bank has physically padlocked the property and can hand over vacant keys immediately upon full payment.'
    },
    {
      q: 'How does the "Talk to a Lawyer" consultation work?',
      a: 'You can book a 30 to 90 minute consultation with an empanelled DRT advocate from your state. Consultations take place over our secure portal bridge without either party seeing the other\'s phone number or personal email address.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">FAQ</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Questions, answered.
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Answers about AI Rank, Pro and Premium plans, ground photographs, and how SARFAESI bank auctions operate across South India.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((f, i) => (
          <div
            key={i}
            className="rounded-2xl bg-slate-900/70 border border-white/10 overflow-hidden transition-colors"
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
              className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-white text-sm sm:text-base hover:text-rose-400 transition-colors"
            >
              <span>{f.q}</span>
              <ChevronDown
                size={18}
                className={`text-slate-400 shrink-0 transition-transform ${openIdx === i ? 'rotate-180 text-rose-400' : ''}`}
              />
            </button>

            {openIdx === i && (
              <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/[0.06]">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-8 rounded-3xl bg-slate-900 border border-white/10 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div>
          <h3 className="text-lg font-bold text-white">Still have questions?</h3>
          <p className="text-xs text-slate-400 mt-1">Our support team and legal bench are here to help.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/support" className="px-5 py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors">
            Support Desk
          </Link>
          <Link to="/legal" className="px-5 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-colors">
            Talk to a Lawyer
          </Link>
        </div>
      </div>
    </div>
  );
}
