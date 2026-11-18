import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Download,
  Copy,
  Building,
  BarChart3,
  Scale
} from 'lucide-react';

export default function LeadershipDashboardPage() {
  const [range, setRange] = useState('6');
  const [copied, setCopied] = useState(false);

  const monthsData = [
    { month: 'Jun', pro: 480000, prem: 310000, law: 85000 },
    { month: 'Jul', pro: 540000, prem: 380000, law: 98000 },
    { month: 'Aug', pro: 610000, prem: 440000, law: 112000 },
    { month: 'Sep', pro: 690000, prem: 520000, law: 134000 },
    { month: 'Oct', pro: 790000, prem: 610000, law: 156000 },
    { month: 'Nov', pro: 920000, prem: 740000, law: 182000 }
  ];

  const cityBreakdown = [
    { city: 'Chennai', lots: 1528, users: 14200, rev: '₹48.2 L', share: '34%' },
    { city: 'Hyderabad', lots: 833, users: 9800, rev: '₹34.6 L', share: '24%' },
    { city: 'Bengaluru', lots: 764, users: 11400, rev: '₹38.1 L', share: '27%' },
    { city: 'Coimbatore', lots: 342, users: 3800, rev: '₹12.4 L', share: '9%' },
    { city: 'Kerala', lots: 246, users: 2600, rev: '₹8.7 L', share: '6%' }
  ];

  const boardSummary = [
    'Revenue for the selected period reached ₹1.42 Cr, reflecting a 28% expansion over the previous cycle.',
    'Pro Pack activations account for 48% of total platform revenue, followed by Premium city subscriptions at 39% and DRT legal consultation commissions at 13%.',
    'Automated ingestion pipeline auto-publishes 75% of properties without intervention; 12 exceptions are currently pending in the human checker queue.',
    'On-site field verification now covers 64% of active lots with verified photos and geotagged perimeter measurements.'
  ];

  const handleCopySummary = () => {
    navigator.clipboard.writeText(boardSummary.join('\n\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Month,Pro Packs (INR),Premium Subscriptions (INR),Advocate Commission (INR),Total (INR)\n' +
      monthsData
        .map((m) => `${m.month},${m.pro},${m.prem},${m.law},${m.pro + m.prem + m.law}`)
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'leadership-revenue-report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-mono font-bold tracking-wider mb-2">
              EXECUTIVE INTELLIGENCE
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Leadership Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Consolidated view of platform growth, auction transaction volumes, checker throughput, and legal bridge revenue.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={range}
              onChange={(e) => setRange(e.target.value)}
              className="bg-slate-900 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-semibold text-white focus:outline-none"
            >
              <option value="1">Last month</option>
              <option value="3">Last 3 months</option>
              <option value="6">Last 6 months</option>
            </select>

            <button
              onClick={handleDownloadCsv}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-white border border-white/10 transition-colors"
            >
              <Download size={14} />
              Download CSV
            </button>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#0b101e] p-6 rounded-2xl border border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Gross Revenue</span>
              <DollarSign size={16} className="text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">₹1.42 Cr</div>
            <p className="text-xs text-emerald-400 mt-1 font-semibold flex items-center gap-1">
              ▲ 28% vs previous period
            </p>
          </div>

          <div className="bg-[#0b101e] p-6 rounded-2xl border border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Paying Customers</span>
              <Users size={16} className="text-sky-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">4,180</div>
            <p className="text-xs text-slate-400 mt-1">32% conversion from registered</p>
          </div>

          <div className="bg-[#0b101e] p-6 rounded-2xl border border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Maker Auto-Publish</span>
              <CheckCircle2 size={16} className="text-indigo-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">75%</div>
            <p className="text-xs text-slate-400 mt-1">Target 80% automated parsing</p>
          </div>

          <div className="bg-[#0b101e] p-6 rounded-2xl border border-white/[0.08] shadow-xl">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-mono uppercase">Field Verified</span>
              <ShieldCheck size={16} className="text-rose-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">64%</div>
            <p className="text-xs text-slate-400 mt-1">67 of 105 catalogue assets</p>
          </div>
        </div>

        {/* Charts & Operations Row */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Revenue by Month Bar Simulation */}
          <div className="lg:col-span-7 bg-[#0b101e] p-6 sm:p-7 rounded-3xl border border-white/[0.08] shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">Revenue Stream by Month</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Stacked breakdown across Pro packs, Premium, and Legal</p>
                </div>
                <BarChart3 size={18} className="text-slate-400" />
              </div>

              <div className="space-y-4">
                {monthsData.map((m, idx) => {
                  const tot = m.pro + m.prem + m.law;
                  const proPct = (m.pro / tot) * 100;
                  const premPct = (m.prem / tot) * 100;
                  const lawPct = (m.law / tot) * 100;

                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-300">{m.month}</span>
                        <span className="font-mono text-slate-400">₹{(tot / 100000).toFixed(1)} L</span>
                      </div>
                      <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden flex">
                        <div style={{ width: `${proPct}%` }} className="bg-rose-500 h-full" title="Pro Packs" />
                        <div style={{ width: `${premPct}%` }} className="bg-slate-300 h-full" title="Premium Subscriptions" />
                        <div style={{ width: `${lawPct}%` }} className="bg-amber-400 h-full" title="Legal Commission" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-6 mt-6 border-t border-white/[0.06]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Pro Packs (48%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-300" /> Premium Subscriptions (39%)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" /> Legal Bridge Commission (13%)
              </span>
            </div>
          </div>

          {/* Operations Health */}
          <div className="lg:col-span-5 bg-[#0b101e] p-6 sm:p-7 rounded-3xl border border-white/[0.08] shadow-xl flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight mb-1">Operations & Verification</h3>
              <p className="text-xs text-slate-400 mb-6">Workflow speed across Checker queue and Advocate roster</p>

              <div className="space-y-3.5 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-300">Checker queue open exceptions</span>
                  <span className="font-mono font-bold text-amber-400">12 pending</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-300">Approved by human checkers</span>
                  <span className="font-mono font-bold text-emerald-400">48 approved</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-300">Median verification turnaround</span>
                  <span className="font-mono font-bold text-white">6.4 hours</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-300">Advocate bridge response latency</span>
                  <span className="font-mono font-bold text-white">3.1 hours</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-300">Consultations completed</span>
                  <span className="font-mono font-bold text-sky-400">142 calls</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06] text-xs text-slate-400 flex items-center justify-between">
              <span>Platform SLA compliance:</span>
              <span className="text-emerald-400 font-bold">99.4%</span>
            </div>
          </div>
        </div>

        {/* By City Table */}
        <div className="bg-[#0b101e] p-6 sm:p-7 rounded-3xl border border-white/[0.08] shadow-xl overflow-hidden">
          <h3 className="text-base font-bold text-white tracking-tight mb-4">City Geographic Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] text-slate-400 font-mono uppercase text-[11px]">
                  <th className="pb-3 font-semibold">City</th>
                  <th className="pb-3 font-semibold">Live Lots</th>
                  <th className="pb-3 font-semibold">Registered Users</th>
                  <th className="pb-3 font-semibold">Period Revenue</th>
                  <th className="pb-3 font-semibold text-right">Revenue Share</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {cityBreakdown.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 font-bold text-white">{row.city}</td>
                    <td className="py-3.5 text-slate-300">{row.lots}</td>
                    <td className="py-3.5 text-slate-300">{row.users.toLocaleString()}</td>
                    <td className="py-3.5 font-mono text-emerald-400 font-semibold">{row.rev}</td>
                    <td className="py-3.5 text-right font-semibold text-slate-200">{row.share}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary for the Board */}
        <div className="bg-gradient-to-r from-slate-900 to-[#0c1428] p-6 sm:p-8 rounded-3xl border border-white/[0.08] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white tracking-tight">Executive Summary for the Board</h3>
            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-xs font-semibold text-slate-200 transition-colors"
            >
              <Copy size={13} />
              {copied ? 'Copied!' : 'Copy summary'}
            </button>
          </div>

          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc pl-5">
            {boardSummary.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
