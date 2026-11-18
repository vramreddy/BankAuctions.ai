import React from 'react';
import { Link } from 'react-router-dom';
import { PROTOTYPE_DATA } from '../../../data/prototypeData';
import {
  FolderArchive,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Heart,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

export default function ArchivePage() {
  // Sample unlocked dossier properties from prototype data
  const unlocked = PROTOTYPE_DATA.props.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">My archive</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          My archive.
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
          Every property you have unlocked with your Pro pack, kept for you to review again whenever you sign in — even after the bank auction concludes.
        </p>
      </div>

      {/* Pro Pack Status Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-white/15 flex flex-wrap items-center justify-between gap-6 shadow-xl">
        <div>
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-bold block mb-1">
            Pro Pack Status
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white">
            4 of 5 property unlocks remaining
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pack has no expiration date. Unlocks end only after 5 dossiers are accessed.
          </p>
        </div>

        <Link
          to="/pricing"
          className="px-6 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
        >
          Buy a Pro Pack · ₹499
        </Link>
      </div>

      {/* Unlocked Properties Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">Unlocked dossiers ({unlocked.length})</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {unlocked.map((p) => (
            <Link
              key={p.id}
              to={`/lot/${p.id}`}
              className="group block rounded-2xl overflow-hidden bg-slate-900/60 border border-white/10 hover:border-rose-500/40 transition-all shadow-lg hover:shadow-2xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-950">
                <img
                  src={`/img/${p.img}`}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 bg-white text-slate-950 rounded-xl px-2.5 py-1 text-xs font-extrabold flex items-center gap-1.5 shadow-lg">
                  <span className="text-rose-600 font-black">#{p.rank}</span>
                  <span className="text-[10px] text-slate-600 font-mono uppercase tracking-wider leading-none">
                    AI rank<br />{p.cat}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 bg-emerald-500/90 text-slate-950 rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                  ✓ Full Dossier Unlocked
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-rose-400 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {p.bank} · {p.loc}
                </p>

                <div className="flex items-baseline justify-between pt-2 border-t border-white/[0.08]">
                  <span className="text-base font-extrabold text-white">
                    {p.reserve >= 100 ? `₹${(p.reserve / 100).toFixed(2)} Cr` : `₹${p.reserve.toFixed(1)} L`}
                  </span>
                  <span className="text-xs font-semibold text-rose-400">
                    {p.disc}% below market
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-slate-400 pt-4">
          Properties are preserved as they were when you unlocked them. If an auction lot has concluded or was withdrawn, you can still view the title opinion and verified valuation reports.
        </p>
      </section>
    </div>
  );
}
