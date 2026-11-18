import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Scale,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  PhoneCall,
  Calendar,
  Languages,
  Clock,
  Sparkles,
  FileCheck
} from 'lucide-react';
import LegalBenchBlock from '../../../components/trust/LegalBenchBlock';
import { PROTOTYPE_BENCH, PROTOTYPE_STATE_MAP } from '../../../data/prototypeData';

export default function LegalPage() {
  // State management for advocate bench and consultation booking
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedAdvocate, setSelectedAdvocate] = useState(null);

  // Booking form state
  const [language, setLanguage] = useState('English');
  const [jurisdiction, setJurisdiction] = useState('DRT Chennai (DRT-1, 2, 3)');
  const [propertyRef, setPropertyRef] = useState('');
  const [duration, setDuration] = useState('30 min (₹1,500)');
  const [booked, setBooked] = useState(false);

  // Derive active state from selected city
  const activeState = PROTOTYPE_STATE_MAP[selectedCity] || 'Tamil Nadu';
  const advocates = PROTOTYPE_BENCH[activeState] || [];

  // Filter advocates based on selected language
  const filteredAdvocates = advocates.filter((adv) => {
    if (selectedLanguage === 'All') return true;
    const langs = adv[4].split(',').map((l) => l.trim().toLowerCase());
    return langs.includes(selectedLanguage.toLowerCase());
  });

  const handleBookSubmit = (e) => {
    e.preventDefault();
    setBooked(true);
  };

  const handleSelectAdvocate = (adv) => {
    setSelectedAdvocate(adv[0]);
    // Pre-fill appropriate jurisdiction based on advocate
    if (adv[1].includes('Chennai')) {
      setJurisdiction('DRT Chennai (DRT-1, 2, 3)');
    } else if (adv[1].includes('Hyderabad') || adv[1].includes('Telangana')) {
      setJurisdiction('DRT Hyderabad (DRT-1, 2)');
    } else if (adv[1].includes('Bengaluru') || adv[1].includes('Karnataka')) {
      setJurisdiction('DRT Bengaluru (DRT-1, 2)');
    } else if (adv[1].includes('Kerala') || adv[1].includes('Ernakulam')) {
      setJurisdiction('DRT Ernakulam (Kerala)');
    }
    // Scroll smoothly to booking bridge
    const el = document.getElementById('consultation-bridge');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* ======================================================== */}
        {/* Breadcrumbs & Header Pill */}
        {/* ======================================================== */}
        <div>
          <nav className="flex items-center gap-2 text-xs text-slate-400 mb-3" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-200">Talk to a lawyer</span>
          </nav>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold tracking-wider mb-4">
            <Scale size={13} />
            LEGAL BENCH
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Talk to a lawyer before you bid.
          </h1>
          <p className="text-slate-400 text-base sm:text-lg mt-3 max-w-2xl leading-relaxed">
            Advocates who have argued auction titles, not read about them. Book a confidential consultation about any SARFAESI property on the portal.
          </p>
        </div>

        {/* ======================================================== */}
        {/* SECTION 1: Exact Reference Graphic from Uploaded Image */}
        {/* ======================================================== */}
        <LegalBenchBlock />

        {/* ======================================================== */}
        {/* SECTION 2: The Empanelled Advocates Roster */}
        {/* ======================================================== */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <span className="text-xs font-mono text-rose-400 uppercase tracking-wider block mb-1">
                Bar Council Practitioners
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                The bench for {selectedCity}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {advocates.length} empanelled advocates for {activeState}. Filtered by language and court experience.
              </p>
            </div>

            {/* City Switcher */}
            <div className="flex flex-wrap items-center gap-2 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10">
              {['Chennai', 'Hyderabad', 'Bengaluru', 'Coimbatore', 'Kerala'].map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setSelectedAdvocate(null);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedCity === city
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Language Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold mr-2 flex items-center gap-1.5">
              <Languages size={14} className="text-sky-400" />
              I speak:
            </span>
            {['All', 'English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Hindi'].map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                    : 'bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-slate-200'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Advocates Grid */}
          {filteredAdvocates.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAdvocates.map((adv, idx) => {
                const [name, court, exp, focus, langs, fee] = adv;
                // Match image to advocate slug
                const slug = name
                  .toLowerCase()
                  .replace('adv.', 'adv')
                  .replace(/\./g, '')
                  .trim()
                  .replace(/\s+/g, '-');
                const imgSrc = `/img/adv/${slug}.jpg`;

                return (
                  <div
                    key={idx}
                    className={`bg-[#0b101e] border rounded-3xl p-6 flex flex-col justify-between transition-all hover:border-white/20 shadow-xl ${
                      selectedAdvocate === name ? 'border-rose-500/60 ring-2 ring-rose-500/20' : 'border-white/[0.08]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <img
                          src={imgSrc}
                          alt={name}
                          onError={(e) => {
                            e.currentTarget.src = '/img/che.jpg';
                          }}
                          className="w-16 h-16 rounded-2xl object-cover border border-white/10"
                        />
                        <div>
                          <h3 className="text-base font-bold text-white tracking-tight">{name}</h3>
                          <p className="text-xs text-rose-400 font-semibold">{exp} at the Bar</p>
                          <p className="text-[11px] text-slate-400 line-clamp-1">{court}</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-5">
                        <div className="text-xs text-slate-300 bg-white/[0.03] p-2.5 rounded-xl border border-white/[0.05]">
                          <span className="text-slate-500 block text-[10px] uppercase font-mono mb-0.5">Focus</span>
                          {focus}
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[10px] uppercase font-mono text-slate-500 mr-1">Speaks:</span>
                          {langs.split(',').map((l, lIdx) => (
                            <span
                              key={lIdx}
                              className="px-2 py-0.5 rounded-md bg-white/[0.05] text-[11px] text-slate-300 border border-white/5"
                            >
                              {l.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                      <div>
                        <span className="text-xs text-slate-400">Consultation</span>
                        <div className="text-base font-bold text-white">
                          {fee}
                          <span className="text-xs font-normal text-slate-500"> / 30m</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleSelectAdvocate(adv)}
                        className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-rose-600 text-white text-xs font-semibold transition-all hover:shadow-lg hover:shadow-rose-600/30"
                      >
                        {selectedAdvocate === name ? 'Selected' : 'Book 30 min'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center text-slate-400 text-sm">
              No advocate in {activeState} speaks {selectedLanguage}. Select another language above to view available bench counsel.
            </div>
          )}
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: Direct Advocate Bridge Confidential Booking */}
        {/* ======================================================== */}
        <section
          id="consultation-bridge"
          className="bg-gradient-to-br from-[#0c1326] via-[#090e1c] to-[#060913] rounded-3xl p-6 sm:p-10 border border-white/[0.1] shadow-2xl relative overflow-hidden"
        >
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-mono text-sky-400 uppercase tracking-wider block mb-1">
              Direct Advocate Bridge
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
              Schedule a confidential consultation
            </h2>
            <p className="text-sm text-slate-300 mt-2 leading-relaxed">
              Speak directly with a senior DRT advocate on our portal bridge. Neither party sees the other's phone number or email address.
            </p>
            {selectedAdvocate && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
                <Scale size={13} />
                Selected Advocate: <strong className="text-white">{selectedAdvocate}</strong>
              </div>
            )}
          </div>

          {booked ? (
            <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 size={44} className="text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white">Consultation Request Confirmed</h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed">
                Your consultation request for <strong>{jurisdiction}</strong> in <strong>{language}</strong> has been logged. Our private bridge operator has dispatched the meeting PIN to your portal account.
              </p>
              <button
                onClick={() => {
                  setBooked(false);
                  setSelectedAdvocate(null);
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-white transition-colors"
              >
                Schedule Another Consultation
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                    Language You Think In
                  </label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="English">English</option>
                    <option value="Tamil">Tamil (தமிழ்)</option>
                    <option value="Telugu">Telugu (తెలుగు)</option>
                    <option value="Kannada">Kannada (ಕನ್ನಡ)</option>
                    <option value="Malayalam">Malayalam (മലയാളം)</option>
                    <option value="Hindi">Hindi (हिन्दी)</option>
                    <option value="Urdu">Urdu (اردو)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                    DRT Bench / Jurisdiction
                  </label>
                  <select
                    value={jurisdiction}
                    onChange={(e) => setJurisdiction(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="DRT Chennai (DRT-1, 2, 3)">DRT Chennai (DRT-1, 2, 3)</option>
                    <option value="DRT Bengaluru (DRT-1, 2)">DRT Bengaluru (DRT-1, 2)</option>
                    <option value="DRT Hyderabad (DRT-1, 2)">DRT Hyderabad (DRT-1, 2)</option>
                    <option value="DRT Ernakulam (Kerala)">DRT Ernakulam (Kerala)</option>
                    <option value="DRT Coimbatore">DRT Coimbatore</option>
                    <option value="DRAT Chennai">DRAT Chennai (Appellate Tribunal)</option>
                  </select>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                    Auction Lot ID or Scheduled Property Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={propertyRef}
                    onChange={(e) => setPropertyRef(e.target.value)}
                    placeholder="e.g. Lot #402, OMR Chennai flat, or Bank of Baroda Ambattur shed"
                    className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                    Consultation Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full rounded-xl bg-slate-900/90 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-sky-500"
                  >
                    <option value="30 min (₹1,500)">30 min (₹1,500)</option>
                    <option value="60 min (₹2,800)">60 min (₹2,800)</option>
                    <option value="90 min (₹3,800)">90 min (₹3,800)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Lock size={15} className="text-emerald-400" />
                  <span>Encrypted private dial-in bridge · No phone sharing</span>
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-sky-500/25 active:scale-95"
                >
                  Schedule
                </button>
              </div>
            </form>
          )}
        </section>

        {/* ======================================================== */}
        {/* SECTION 4: What Our Legal Bench Verifies Before You Bid */}
        {/* ======================================================== */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider block mb-1">
              Title Due Diligence
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              What Our Legal Bench Verifies Before You Bid
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              The four critical legal checkpoints examined on every SARFAESI auction notice before you commit earnest money.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0b101e] p-6 rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Section 13(2) Notice</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Verifies whether the 60-day demand notice was duly served on borrowers and guarantors without legal defects.
              </p>
            </div>

            <div className="bg-[#0b101e] p-6 rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">Possession Status</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Examines whether Section 13(4) symbolic possession or Section 14 CMM/DM physical possession order is executed.
              </p>
            </div>

            <div className="bg-[#0b101e] p-6 rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">DRT Securitisation Appeal</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Checks pending SA (Securitisation Application) cases before DRT or stay petitions that might delay sale certificates.
              </p>
            </div>

            <div className="bg-[#0b101e] p-6 rounded-2xl border border-white/[0.08] hover:border-white/20 transition-all">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 size={18} className="text-emerald-400" />
              </div>
              <h4 className="text-sm font-bold text-white mb-2">30-Year Encumbrance (EC)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cross-checks sub-registrar records for prior mortgages, revenue attachment, tax claims, or secondary litigation.
              </p>
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 5: Scope & Disclaimer Box */}
        {/* ======================================================== */}
        <section className="bg-slate-900/60 border border-white/[0.08] rounded-2xl p-6 sm:p-8 text-xs text-slate-400 leading-relaxed">
          <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
            <Scale size={16} className="text-rose-400" />
            What a consultation is, and is not
          </h3>
          <p>
            The advocate advises you in their own professional capacity. BankAuctions.ai collects the fee and provides the papers on record, and takes no share of any further engagement you agree with them. A thirty-minute call is not a title certificate; ask the advocate for a separate scope for a full title search and encumbrance opinion. Names and portrait photographs are empanelled practitioners representing the Bar Councils of Tamil Nadu, Telangana, Karnataka, and Kerala.
          </p>
        </section>
      </div>
    </div>
  );
}
