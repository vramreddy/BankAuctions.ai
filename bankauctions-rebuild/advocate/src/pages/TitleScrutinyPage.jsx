import React from 'react';
import { FileText, CheckCircle, Search, ExternalLink } from 'lucide-react';

export default function TitleScrutinyPage() {
  const records = [
    {
      lot: 'M-94 Plot Kancheepuram Scheme',
      subRegistrar: 'Joint-1 Sub Registrar Office Kancheepuram',
      period: '1994 - 2026 (32 Years)',
      surveyNo: 'Survey No. 1/1F(Part) Pappankuzhi',
      encumbranceStatus: 'Nil Encumbrance (Post SARFAESI)',
      guidelineValue: '₹14,50,000',
      parentDeeds: 'TNHB Allotment Order + Sale Deed 1994 Verified'
    },
    {
      lot: 'Flat S-2 Shri Sai Homes Adhanur',
      subRegistrar: 'Sub-district of Guduvancheri (Chennai South)',
      period: '1996 - 2026 (30 Years)',
      surveyNo: 'Old: 369/7, New: 369/19, Patta No: 5101',
      encumbranceStatus: 'Nil Encumbrance (Post SARFAESI)',
      guidelineValue: '₹22,10,000',
      parentDeeds: 'LPDM No. 612/93 Approved Layout + Joint Venture'
    },
    {
      lot: '2277 sq ft Site Inam Thoppupatti',
      subRegistrar: 'Rajapalayam Sub Registrar Jurisdiction',
      period: '1992 - 2026 (34 Years)',
      surveyNo: 'Old T.S.No: 57, New T.S.No: 17/1B2',
      encumbranceStatus: 'Nil Encumbrance (Post SARFAESI)',
      guidelineValue: '₹52,00,000',
      parentDeeds: 'G.R.No: 1291/1987 + Registered Sale Deed Verified'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          30-Year Encumbrance Certificate (EC) &amp; Title Deed Scrutiny
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Detailed title chain analysis covering Sub-Registrar Office Form 15 Encumbrance Certificates, parent document links, patta passbook revenue records, and SARFAESI charge registration.
        </p>
      </div>

      <div className="grid gap-4">
        {records.map((r, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl border-white/10 space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/[0.08] pb-3">
              <div>
                <h2 className="font-bold text-base text-white">{r.lot}</h2>
                <div className="text-xs text-amber-400 font-mono">{r.subRegistrar}</div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 self-start md:self-auto">
                {r.encumbranceStatus}
              </span>
            </div>

            <div className="grid sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Scrutiny Period</span>
                <span className="font-bold text-slate-200">{r.period}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Revenue / Survey Record</span>
                <span className="font-mono text-slate-200">{r.surveyNo}</span>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Registered Guideline Valuation</span>
                <span className="font-mono text-cyan-300 font-bold">{r.guidelineValue}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-white/[0.06] text-xs text-slate-300">
              <strong className="text-amber-400">Parent Title Documents: </strong>
              {r.parentDeeds}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
