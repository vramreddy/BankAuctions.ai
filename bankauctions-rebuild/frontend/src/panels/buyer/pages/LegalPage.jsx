import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import LegalBenchBlock from '../../../components/trust/LegalBenchBlock';

export default function LegalPage() {
  // Consultation booking state
  const [language, setLanguage] = useState('English');
  const [jurisdiction, setJurisdiction] = useState('DRT Chennai');
  const [propertyRef, setPropertyRef] = useState('');
  const [booked, setBooked] = useState(false);

  const handleBook = (e) => {
    e.preventDefault();
    setBooked(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* ======================================================== */}
      {/* SECTION 1: Exact Reference Layout from Uploaded Graphic */}
      {/* ======================================================== */}
      <LegalBenchBlock />

      {/* ======================================================== */}
      {/* SECTION 2: Confidential Advocate Portal Bridge Booking */}
      {/* ======================================================== */}
      <section className="bg-[#0b101e] rounded-3xl p-6 sm:p-10 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="max-w-3xl mb-8">
          <span className="text-xs font-mono text-sky-400 uppercase tracking-wider block mb-1">
            Direct Advocate Bridge
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Schedule a confidential consultation
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Speak directly with a senior DRT advocate on our portal bridge. Neither party sees the other's phone number or email address.
          </p>
        </div>

        {booked ? (
          <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
            <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Consultation Request Placed</h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Our legal coordinator will assign a Bar Council practitioner in {jurisdiction} fluent in {language}. You will receive a secure portal bridge invitation with dial-in and chat room details.
            </p>
            <button
              onClick={() => setBooked(false)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white transition-colors"
            >
              Book Another Consultation
            </button>
          </div>
        ) : (
          <form onSubmit={handleBook} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                  Language You Think In
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl glass-input px-3.5 py-3 text-xs sm:text-sm"
                >
                  <option value="English">English</option>
                  <option value="Tamil">Tamil (தமிழ்)</option>
                  <option value="Telugu">Telugu (తెలుగు)</option>
                  <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                  <option value="Malayalam">Malayalam (മലയാളം)</option>
                  <option value="Hindi">Hindi (हिन्दी)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                  DRT Bench / Jurisdiction
                </label>
                <select
                  value={jurisdiction}
                  onChange={(e) => setJurisdiction(e.target.value)}
                  className="w-full rounded-xl glass-input px-3.5 py-3 text-xs sm:text-sm"
                >
                  <option value="DRT Chennai">DRT Chennai (DRT-1, 2, 3)</option>
                  <option value="DRT Bengaluru">DRT Bengaluru (DRT-1, 2)</option>
                  <option value="DRT Hyderabad">DRT Hyderabad (DRT-1, 2)</option>
                  <option value="DRT Ernakulam">DRT Ernakulam (Kerala)</option>
                  <option value="DRT Coimbatore">DRT Coimbatore</option>
                  <option value="DRAT Chennai">DRAT (Appellate Tribunal)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                Auction Lot ID or Scheduled Property Note (Optional)
              </label>
              <input
                type="text"
                value={propertyRef}
                onChange={(e) => setPropertyRef(e.target.value)}
                placeholder="e.g. Lot #402, OMR Chennai flat, or Bank of Baroda Ambattur shed"
                className="w-full rounded-xl glass-input px-3.5 py-3 text-xs sm:text-sm"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Lock size={14} className="text-emerald-400" />
                <span>Encrypted private dial-in bridge · No phone sharing</span>
              </div>

              <button
                type="submit"
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-blue-600 hover:from-sky-300 hover:to-blue-500 text-slate-950 font-bold text-sm tracking-wider transition-all shadow-lg shadow-sky-500/20 active:scale-95"
              >
                Schedule
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: Key Title Scrutinies Handled by the Bench */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white tracking-tight text-center">
          What Our Legal Bench Verifies Before You Bid
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Section 13(2) Notice
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verifies whether the 60-day demand notice was duly served on borrowers and guarantors without legal defects.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Possession Status
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Examines whether Section 13(4) symbolic possession or Section 14 CMM/DM physical possession order is executed.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              DRT Securitisation Appeal
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Checks pending SA (Securitisation Application) cases before DRT or stay petitions that might delay sale certificates.
            </p>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-white/10">
            <h4 className="text-sm font-bold text-white mb-1.5 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              30-Year Encumbrance (EC)
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cross-checks sub-registrar records for prior mortgages, revenue attachment, tax claims, or secondary litigation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
