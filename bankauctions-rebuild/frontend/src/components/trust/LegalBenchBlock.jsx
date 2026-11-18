import React from 'react';
import { Link } from 'react-router-dom';

/**
 * LegalBenchBlock: Exact 1-to-1 visual implementation of the
 * "The legal bench behind the portal" institutional reference graphic.
 */
export default function LegalBenchBlock({ className = '' }) {
  return (
    <section className={`w-full text-slate-100 ${className}`} aria-label="The legal bench behind the portal">
      {/* Top Header Block: Headline + Lady Justice Image */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
        {/* Left: Typography exactly matching reference */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.12]">
            The legal bench<br />
            behind the portal
          </h2>
          <p className="text-slate-400 text-base sm:text-lg mt-4 max-w-xl font-normal leading-relaxed">
            Advocates who have argued auction titles, not read about them.
          </p>
        </div>

        {/* Right: Lady of Justice Statue with rounded-3xl container */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
          <div className="rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl max-w-md w-full bg-[#0a0f1d]">
            <img
              src="/images/legal-justice.jpg"
              alt="The legal bench behind the portal - Lady Justice"
              className="w-full h-auto object-cover rounded-3xl select-none"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Bottom 3-Card Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Card 1: Independent legal opinion */}
        <div className="bg-[#0b101e] border border-white/[0.08] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-white/20">
          <div>
            <div className="rounded-2xl overflow-hidden mb-6 h-44 w-full bg-slate-950">
              <img
                src="/images/legal-library.jpg"
                alt="Classical law library with statues and archives"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-3 tracking-tight">
              An independent legal opinion on every report
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Every ₹4,999 research report carries an independent legal opinion, and behind each opinion is a named practitioner enrolled with a State Bar Council. You can speak to one of them directly about any property listed here — a paid consultation from 30 to 90 minutes, in the language you think in.
            </p>
          </div>
        </div>

        {/* Card 2: How a consultation runs */}
        <div className="bg-[#0b101e] border border-white/[0.08] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-white/20">
          <div>
            <div className="rounded-2xl overflow-hidden mb-6 h-44 w-full bg-slate-950">
              <img
                src="/images/legal-consult.jpg"
                alt="Encrypted portal bridge legal consultation"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-3 tracking-tight">
              How a consultation runs
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Neither side ever sees the other's phone number or email address. The call is placed over a portal bridge and the chat thread lives on the portal.
            </p>
          </div>
        </div>

        {/* Card 3: Not sure where to start? */}
        <div className="bg-[#0b101e] border border-white/[0.08] rounded-3xl p-6 sm:p-7 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-white/20">
          <div>
            <div className="rounded-2xl overflow-hidden mb-6 h-44 w-full bg-slate-950">
              <img
                src="/images/legal-court.jpg"
                alt="Debts Recovery Tribunal and High Court Neoclassical Pillars"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mb-3 tracking-tight">
              Not sure where to start?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
              Read the auction guide first — most questions a first-time bidder has about title, possession and process are covered there before you ever need a paid consultation.
            </p>
          </div>

          <div className="mt-6 pt-2">
            <Link
              to="/learn"
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-slate-600 hover:border-slate-300 text-slate-200 hover:text-white text-xs sm:text-sm font-medium transition-colors"
            >
              Open the auction guide
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
