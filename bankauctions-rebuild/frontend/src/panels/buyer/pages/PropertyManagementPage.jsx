import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCity } from '../../../contexts/CityContext';

export default function PropertyManagementPage() {
  const { currentCity, cities, setCity } = useCity();
  const [name, setName] = useState('');
  const [country, setCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState(currentCity || 'chennai');
  const [needs, setNeeds] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="w-full">
      {/* Strip */}
      <div className="bg-[var(--soft,#F6F6F8)] border-b border-[var(--line,#E8E8EC)] text-[12.5px] text-[var(--mute,#6B6B76)] py-2">
        <div className="w max-w-[1360px] mx-auto px-6">
          <strong className="text-[var(--ink,#0F1E33)]">What we do, and don't.</strong> We provide intelligence and data on auction properties and prices. We are not an auctioneer, agent or intermediary.
        </div>
      </div>

      <main className="max-w-[1360px] mx-auto px-6 py-10">
        {/* Hero */}
        <div className="phero py-8">
          <div className="crumbs text-xs text-[var(--mute,#6B6B76)] mb-3">
            <Link to="/" className="hover:text-[var(--rose,#0F766E)]">Home</Link> / Property management
          </div>
          <span className="pill inline-block bg-[var(--rose-l,#ECF7F6)] text-[var(--rose2,#0B5D57)] font-bold text-xs px-3.5 py-1.5 rounded-full tracking-wider uppercase">
            PROPERTY MANAGEMENT
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[var(--ink,#0F1E33)] tracking-tight mt-4 mb-3">
            We look after the property, so you do not have to.
          </h1>
          <p className="lead text-lg text-[var(--mute,#6B6B76)] max-w-2xl">
            A separate service from Concierge, for owners who want their property let, kept in good order and the rent collected.
          </p>
        </div>

        {/* 5 Feature Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 my-10">
          <div className="bg-white border border-[var(--line,#E8E8EC)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[var(--rose-l,#ECF7F6)] text-2xl flex items-center justify-center mb-4">
              👥
            </div>
            <h3 className="text-lg font-extrabold text-[var(--ink,#0F1E33)] mb-2">
              Tenant management
            </h3>
            <p className="text-sm text-[var(--mute,#6B6B76)] leading-relaxed">
              Finding, onboarding and dealing with tenants on your behalf.
            </p>
          </div>

          <div className="bg-white border border-[var(--line,#E8E8EC)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[var(--rose-l,#ECF7F6)] text-2xl flex items-center justify-center mb-4">
              📄
            </div>
            <h3 className="text-lg font-extrabold text-[var(--ink,#0F1E33)] mb-2">
              Rental and lease agreements
            </h3>
            <p className="text-sm text-[var(--mute,#6B6B76)] leading-relaxed">
              We facilitate rental or lease agreements, drafted and registered properly.
            </p>
          </div>

          <div className="bg-white border border-[var(--line,#E8E8EC)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[var(--rose-l,#ECF7F6)] text-2xl flex items-center justify-center mb-4">
              🔍
            </div>
            <h3 className="text-lg font-extrabold text-[var(--ink,#0F1E33)] mb-2">
              Tenant background verification
            </h3>
            <p className="text-sm text-[var(--mute,#6B6B76)] leading-relaxed">
              Identity, employment and reference checks before anyone moves in.
            </p>
          </div>

          <div className="bg-white border border-[var(--line,#E8E8EC)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[var(--rose-l,#ECF7F6)] text-2xl flex items-center justify-center mb-4">
              💰
            </div>
            <h3 className="text-lg font-extrabold text-[var(--ink,#0F1E33)] mb-2">
              Rent collection
            </h3>
            <p className="text-sm text-[var(--mute,#6B6B76)] leading-relaxed">
              Rent collected on time and passed on to you, with a statement.
            </p>
          </div>

          <div className="bg-white border border-[var(--line,#E8E8EC)] rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[var(--rose-l,#ECF7F6)] text-2xl flex items-center justify-center mb-4">
              🛠️
            </div>
            <h3 className="text-lg font-extrabold text-[var(--ink,#0F1E33)] mb-2">
              Maintenance services
            </h3>
            <p className="text-sm text-[var(--mute,#6B6B76)] leading-relaxed">
              Repairs, upkeep, utilities and routine care handled through trusted vendors.
            </p>
          </div>
        </div>

        {/* Pricing Notice Card */}
        <section className="my-8">
          <div className="bg-white border-2 border-[var(--rose,#0F766E)] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-[var(--mute,#6B6B76)] font-bold">
                Pricing
              </span>
              <div className="text-2xl font-extrabold text-[var(--ink,#0F1E33)] mt-1">
                Discussed and agreed
              </div>
            </div>
            <p className="text-sm text-[var(--mute,#6B6B76)] max-w-xl m-0 leading-relaxed">
              We first understand your requirements, then agree a price with you. Nothing starts until you approve it.
            </p>
          </div>
        </section>

        {/* Intake Contact Form */}
        <section className="my-12 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink,#0F1E33)] tracking-tight">
                Talk to us about your needs
              </h2>
              <p className="text-base text-[var(--mute,#6B6B76)] mt-2 leading-relaxed">
                An adviser will call you back within one working day to understand your requirements.
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <Link
                  to="/concierge"
                  className="px-4 py-2 rounded-full border border-[var(--ink,#0F1E33)] text-xs font-bold text-[var(--ink,#0F1E33)] hover:bg-slate-100 transition-colors"
                >
                  Concierge services
                </Link>
                <Link
                  to="/nri-services"
                  className="px-4 py-2 rounded-full border border-[var(--ink,#0F1E33)] text-xs font-bold text-[var(--ink,#0F1E33)] hover:bg-slate-100 transition-colors"
                >
                  NRI services
                </Link>
                <Link
                  to="/pricing#services"
                  className="px-4 py-2 rounded-full border border-[var(--ink,#0F1E33)] text-xs font-bold text-[var(--ink,#0F1E33)] hover:bg-slate-100 transition-colors"
                >
                  All services and plans
                </Link>
              </div>
            </div>

            <div className="bg-white border border-[var(--line,#E8E8EC)] rounded-3xl p-6 sm:p-8 shadow-sm">
              {submitted ? (
                <div className="bg-[#ECF7F6] border border-[#2DD4BF]/40 text-[#0B5D57] p-6 rounded-2xl text-center">
                  <h3 className="font-extrabold text-lg mb-1">Request Received</h3>
                  <p className="text-sm">
                    Thanks. An adviser will call you back within one working day (demo only, nothing was sent).
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-4 py-2 rounded-full bg-[var(--rose,#0F766E)] text-white text-xs font-bold"
                  >
                    Send another request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink,#0F1E33)] mb-1">
                      Name
                    </label>
                    <input
                      required
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--line,#E8E8EC)] text-sm focus:outline-none focus:border-[var(--rose,#0F766E)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--ink,#0F1E33)] mb-1">
                      Where do you live?
                    </label>
                    <input
                      type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      placeholder="City and country"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--line,#E8E8EC)] text-sm focus:outline-none focus:border-[var(--rose,#0F766E)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--ink,#0F1E33)] mb-1">
                      Property city
                    </label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--line,#E8E8EC)] text-sm bg-white focus:outline-none focus:border-[var(--rose,#0F766E)]"
                    >
                      {Object.keys(cities || {}).map((c) => (
                        <option key={c} value={c}>
                          {cities[c].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--ink,#0F1E33)] mb-1">
                      What do you need?
                    </label>
                    <textarea
                      rows={3}
                      value={needs}
                      onChange={(e) => setNeeds(e.target.value)}
                      placeholder="e.g. Tenant onboarding, rental agreement registration, maintenance"
                      className="w-full px-4 py-3 rounded-xl border border-[var(--line,#E8E8EC)] text-sm focus:outline-none focus:border-[var(--rose,#0F766E)]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-[var(--rose,#0F766E)] hover:bg-[var(--rose2,#0B5D57)] text-white font-extrabold text-sm transition-colors"
                  >
                    Request a call back
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
