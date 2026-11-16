import React from 'react';
import { Link } from 'react-router-dom';

export default function SupportHelpSection({ className = '' }) {
  const cards = [
    {
      id: 'property',
      title: 'A question about a property',
      desc: 'Open the property\'s details page and use “Request Documents on WhatsApp” to reach the bank/branch directly.',
      image: '/images/help-property.jpg',
      alt: 'A question about a bank auction property',
      actionText: 'Find the property',
      link: '/search'
    },
    {
      id: 'guide',
      title: 'How bank auctions work',
      desc: 'SARFAESI, EMD, possession, title — the auction guide covers what first-time bidders ask most.',
      image: '/images/help-auctions-guide.jpg',
      alt: 'How bank auctions work - Legal Guide',
      actionText: 'Read the auction guide',
      link: '/guides'
    },
    {
      id: 'plans',
      title: 'Plans, credits & payments',
      desc: 'What Free, Pro, Gold and Diamond open, and how unlock credits work.',
      image: '/images/help-plans.jpg',
      alt: 'Subscription plans, credits and payments',
      actionText: 'See plans',
      link: '/pricing'
    },
    {
      id: 'lawyer',
      title: 'Talk to a lawyer',
      desc: 'Advocates who have argued auction titles, for a paid consultation on a specific property.',
      image: '/images/help-lawyer.jpg',
      alt: 'Talk to a lawyer - Legal consultation',
      actionText: 'Meet the legal bench',
      link: '/legal'
    }
  ];

  return (
    <section className={`w-full text-slate-100 ${className}`} aria-label="How can we help?">
      {/* Top Header Block: Headline + Support Hero Image */}
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-8">
        {/* Left: Typography exactly matching reference */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/60 border border-slate-700/60 text-[11px] font-semibold uppercase tracking-wider text-slate-300 w-fit mb-5">
            SUPPORT
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-white leading-[1.08]">
            How can we help?
          </h2>

          <p className="text-slate-400 text-sm sm:text-base mt-4 max-w-xl font-normal leading-relaxed">
            Most answers are one click away. Pick what your question is about.
          </p>
        </div>

        {/* Right: Support Associate Consultation Photo */}
        <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
          <div className="rounded-3xl overflow-hidden border border-white/[0.08] shadow-2xl max-w-lg w-full bg-[#0a0f1d]">
            <img
              src="/images/help-support-hero.jpg"
              alt="How can we help - Customer Support"
              className="w-full h-auto object-cover rounded-3xl select-none"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Bottom 4-Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div
            key={card.id}
            className="bg-[#0b1120] border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-slate-600/80 hover:-translate-y-0.5 group"
          >
            <div>
              <div className="rounded-2xl overflow-hidden mb-5 h-40 w-full bg-slate-950 border border-white/5">
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              <h3 className="text-[17px] font-bold text-white mb-2.5 tracking-tight">
                {card.title}
              </h3>

              <p className="text-[13px] text-slate-400 leading-relaxed font-normal min-h-[56px]">
                {card.desc}
              </p>
            </div>

            <div className="mt-5 pt-2">
              <Link
                to={card.link}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-300 transition-colors"
              >
                <span>{card.actionText}</span>
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Note */}
      <p className="text-[12px] text-slate-500 mt-6 px-1">
        For anything about the platform itself, this section is a placeholder for now — a real contact/FAQ flow can be built out in a future module.
      </p>
    </section>
  );
}
