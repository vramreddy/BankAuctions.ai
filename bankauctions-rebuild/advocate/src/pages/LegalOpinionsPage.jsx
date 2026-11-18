import React from 'react';
import { FileSignature, CheckCircle2, Download, ShieldCheck } from 'lucide-react';

export default function LegalOpinionsPage() {
  const opinions = [
    {
      id: 'OP-2026-081',
      property: 'Plot M-94 Pappankuzhi Village Kancheepuram',
      advocateName: 'Adv. S. Ramachandran, B.A., B.L. (Enrollment: MS/1429/2004)',
      date: '2026-11-12',
      finding: 'Marketable Clear Title. Symbolic possession under Sec 13(4) valid. No prior lis pendens.',
      riskLevel: 'LOW LEGAL RISK'
    },
    {
      id: 'OP-2026-082',
      property: 'Flat S-2 Shri Sai Homes Adhanur Chennai South',
      advocateName: 'Adv. K. Meenakshi Sundaram, B.Sc., M.L. (Enrollment: MS/892/1998)',
      date: '2026-11-14',
      finding: 'Undivided Share (364 sq ft UDS) and 799 sq ft built-up verified. CERSAI registered without conflicting charges.',
      riskLevel: 'CLEAR TITLE'
    },
    {
      id: 'OP-2026-083',
      property: '2277 sq ft Site Inam Thoppupatti Rajapalayam',
      advocateName: 'Adv. M. Jayakumar, B.A., B.L. (Enrollment: MS/2104/2009)',
      date: '2026-11-15',
      finding: 'Layout boundaries match survey boundaries on four directions. No civil court injunctions.',
      riskLevel: 'CLEAR TITLE'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Title Clearance Certificates &amp; Legal Opinions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Formal legal opinions issued by empanelled High Court advocates for prospective bank auction bidders and financial institutions.
        </p>
      </div>

      <div className="space-y-4">
        {opinions.map((op) => (
          <div key={op.id} className="glass-panel p-6 rounded-3xl border-white/10 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-base text-white">{op.property}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {op.id}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                {op.riskLevel}
              </span>
            </div>

            <p className="text-xs text-slate-300">
              <strong className="text-white">Legal Opinion Summary: </strong>
              {op.finding}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-200">{op.advocateName}</span>
                <span>· Issued: {op.date}</span>
              </div>
              <button
                onClick={() => alert(`Downloading Title Clearance Opinion PDF for ${op.id}`)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-amber-400 hover:text-white hover:border-amber-400/50 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Signed Opinion PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
