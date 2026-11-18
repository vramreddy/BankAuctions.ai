import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCity } from '../../../contexts/CityContext';
import {
  Sparkles,
  CheckCircle2,
  PhoneCall,
  Search,
  FileCheck,
  ShieldCheck,
  HelpCircle,
  Clock
} from 'lucide-react';

export default function ConciergePage() {
  const { selectedCity, allCities } = useCity();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: selectedCity,
    budget: 'Under ₹50 L',
    requirement: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Concierge</span>
        </div>

        <span className="inline-block px-3.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-black tracking-wider uppercase">
          CONCIERGE
        </span>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Concierge services for serious buyers.
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
          Hands-on help from shortlist to bid. We connect you with independent advisers, certified engineers, and DRT advocates. We do not act as your auctioneer or agent.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <Search className="w-8 h-8 text-rose-400 mb-2" />
          <h3 className="text-lg font-bold text-white">Property shortlisting</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            We turn your micro-locality, asset class, and budget criteria into a high-scoring ranked shortlist of live auctions.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <FileCheck className="w-8 h-8 text-rose-400 mb-2" />
          <h3 className="text-lg font-bold text-white">Document review</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Independent empanelled advocates cross-check Section 13(2), Section 13(4), sub-registrar EC records and pending DRT stays.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <ShieldCheck className="w-8 h-8 text-rose-400 mb-2" />
          <h3 className="text-lg font-bold text-white">Site verification</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our qualified field engineers visit on foot, verify actual physical occupancy vs symbolic notice, and photograph the site.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <PhoneCall className="w-8 h-8 text-rose-400 mb-2" />
          <h3 className="text-lg font-bold text-white">Bid support</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hands-on assistance through EMD deposit, portal bidder registration, digital signature (DSC) setup, and auction day process.
          </p>
        </div>
      </div>

      {/* Concierge Intake Form */}
      <section className="rounded-3xl bg-slate-900/80 border border-white/15 p-8 sm:p-12 shadow-2xl">
        <div className="grid lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Tell us what you are looking for
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              A dedicated concierge adviser will review your requirements and reach out within one business working day.
            </p>
            <div className="pt-4 space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Strict non-disclosure & confidential consultations</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Transparent pricing with zero auctioneer commission</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Active across Chennai, Bengaluru, Hyderabad, Coimbatore & Kerala</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-white">Request Received!</h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Thank you, {formData.name || 'Valued Buyer'}. A concierge specialist will contact you within one business working day.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-slate-300 font-semibold block mb-1">Your Full Name</span>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Ramesh Sundaram"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white focus:outline-none focus:border-rose-500"
                    />
                  </label>
                  <label className="block">
                    <span className="text-slate-300 font-semibold block mb-1">Contact Phone</span>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 98400 12345"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white focus:outline-none focus:border-rose-500"
                    />
                  </label>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-slate-300 font-semibold block mb-1">Target Metro</span>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white focus:outline-none focus:border-rose-500"
                    >
                      {Object.entries(allCities || {}).map(([k, v]) => (
                        <option key={k} value={k}>{v.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-slate-300 font-semibold block mb-1">Estimated Budget</span>
                    <select
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white focus:outline-none focus:border-rose-500"
                    >
                      <option>Under ₹50 L</option>
                      <option>₹50 L to ₹1 Cr</option>
                      <option>₹1 Cr to ₹3 Cr</option>
                      <option>Above ₹3 Cr</option>
                    </select>
                  </label>
                </div>

                <label className="block">
                  <span className="text-slate-300 font-semibold block mb-1">What property are you looking for?</span>
                  <textarea
                    rows={4}
                    placeholder="Describe desired location, property type (flat, villa, plot, warehouse), or specific bank auction notice details..."
                    value={formData.requirement}
                    onChange={(e) => setFormData({ ...formData, requirement: e.target.value })}
                    className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white focus:outline-none focus:border-rose-500"
                  />
                </label>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                >
                  Request a Concierge Call
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
