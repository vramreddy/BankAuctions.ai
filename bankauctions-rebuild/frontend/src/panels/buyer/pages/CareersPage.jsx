import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function CareersPage() {
  const roles = [
    { title: 'Senior Fullstack Engineer (React / Node)', location: 'Chennai / Hybrid', type: 'Full-time' },
    { title: 'Data Extraction & ML Engineer', location: 'Bengaluru / Remote', type: 'Full-time' },
    { title: 'Chartered Field Valuation Engineer', location: 'Hyderabad / On-site', type: 'Full-time' },
    { title: 'Legal Research Associate (SARFAESI & DRT)', location: 'Chennai / On-site', type: 'Full-time' },
    { title: 'Commercial Real Estate Analyst', location: 'Bengaluru / Hybrid', type: 'Full-time' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Careers</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Build the clearest view of India’s auction market.
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Open roles in engineering, data science, field valuation, and legal analytics at BankAuctions.ai.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Open Positions</h2>
        <div className="space-y-3">
          {roles.map((r, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-slate-900/70 border border-white/10 flex flex-wrap items-center justify-between gap-4 hover:border-rose-500/40 transition-all"
            >
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm sm:text-base">{r.title}</h4>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>{r.location}</span>
                  <span>•</span>
                  <span className="text-rose-400 font-semibold">{r.type}</span>
                </div>
              </div>
              <a
                href="mailto:careers@bankauctions.ai?subject=Job Application"
                className="px-4 py-2 rounded-full border border-white/20 text-white text-xs font-semibold hover:bg-white/10 transition-colors"
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
