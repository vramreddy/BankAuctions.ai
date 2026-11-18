import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, FileCheck, ArrowRight } from 'lucide-react';

export default function Sarfaesi12BPage() {
  const [items, setItems] = useState([
    {
      id: 'SARF-12B-001',
      bankName: 'Indian Overseas Bank',
      branch: 'Chinna Kancheepuram',
      property: 'Plot M-94 Pappankuzhi Village',
      borrower: 'SENTHILKUMAR M',
      sec13_2_Date: '2026-04-02',
      sec13_4_Date: '2026-08-14',
      rule8_6_Proof: true,
      cersaiRegistered: true,
      cersaiId: 'Pending SRO',
      complianceStatus: 'VERIFIED'
    },
    {
      id: 'SARF-12B-002',
      bankName: 'State Bank of India',
      branch: 'SARB Chennai',
      property: 'Flat S-2 Shri Sai Homes Adhanur',
      borrower: 'Mr Senthil Kumar',
      sec13_2_Date: '2026-06-11',
      sec13_4_Date: '2026-09-18',
      rule8_6_Proof: true,
      cersaiRegistered: true,
      cersaiId: '200058239319',
      complianceStatus: 'VERIFIED'
    },
    {
      id: 'SARF-12B-003',
      bankName: 'Canara Bank',
      branch: 'Srivilliputhur',
      property: '2277 sq ft Site Inam Thoppupatti',
      borrower: 'Mrs Chitra Kumaresan',
      sec13_2_Date: '2026-05-19',
      sec13_4_Date: '2026-09-02',
      rule8_6_Proof: true,
      cersaiRegistered: true,
      cersaiId: 'CERSAI-CAN-98214',
      complianceStatus: 'VERIFIED'
    }
  ]);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[11px] font-mono text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Statutory Compliance Desk
          </span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          SARFAESI Act Section 12B &amp; Rule 8 Scrutiny
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Verifies that the secured creditor has strictly complied with statutory SARFAESI provisions: 60-day Section 13(2) demand notice, Section 13(4) symbolic/physical possession notice, mandatory Rule 8(6) 30-day sale notice to borrower, paper publication in two leading newspapers, and Central Registry (CERSAI) security interest verification.
        </p>
      </div>

      <div className="glass-panel p-6 rounded-3xl border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <span className="text-xs font-mono uppercase text-slate-400">Statutory Notice Audit Ledger</span>
          <span className="text-xs text-amber-400 font-bold font-mono">3 Properties Audited</span>
        </div>

        <div className="divide-y divide-white/[0.06]">
          {items.map((row) => (
            <div key={row.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white">{row.property}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    {row.id}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  Secured Creditor: <strong className="text-slate-200">{row.bankName}</strong> ({row.branch}) · Borrower: <strong className="text-slate-200">{row.borrower}</strong>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400 pt-1">
                  <span>Sec 13(2): <strong className="text-slate-200">{row.sec13_2_Date}</strong></span>
                  <span>Sec 13(4): <strong className="text-slate-200">{row.sec13_4_Date}</strong></span>
                  <span>CERSAI ID: <strong className="text-cyan-300">{row.cersaiId}</strong></span>
                  <span className="text-emerald-400 font-semibold">Rule 8(6) Proof: Confirmed</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1.5 rounded-xl text-xs font-bold font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{row.complianceStatus}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
