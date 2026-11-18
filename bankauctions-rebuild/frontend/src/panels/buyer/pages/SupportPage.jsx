import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, Mail, MessageSquare, Phone, CheckCircle2 } from 'lucide-react';

export default function SupportPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Support</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          How can we help?
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Get prompt assistance with subscriptions, AI Rank explanations, listing verification queries, or advocate consultations.
        </p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <Mail className="w-6 h-6 text-rose-400 mb-1" />
          <h4 className="font-bold text-white text-sm">Email Support</h4>
          <p className="text-xs text-slate-400">support@bankauctions.ai</p>
          <p className="text-[11px] text-slate-500">Replies within 4 hours on business days</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <MessageSquare className="w-6 h-6 text-emerald-400 mb-1" />
          <h4 className="font-bold text-white text-sm">WhatsApp Desk</h4>
          <p className="text-xs text-slate-400">+91 98400 12345</p>
          <p className="text-[11px] text-slate-500">Fast assistance 9 AM - 7 PM IST</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-2">
          <Phone className="w-6 h-6 text-sky-400 mb-1" />
          <h4 className="font-bold text-white text-sm">Direct Phone</h4>
          <p className="text-xs text-slate-400">+91 44 4800 1200</p>
          <p className="text-[11px] text-slate-500">Chennai &amp; Bengaluru Central Desk</p>
        </div>
      </div>

      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-white/10 space-y-6 shadow-xl">
        <h3 className="text-xl font-bold text-white">Send us a message</h3>

        {sent ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={18} className="shrink-0" />
            <span>Thank you. Your support inquiry has been logged. A support specialist will respond shortly.</span>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-slate-300 font-semibold block mb-1">Your Name</span>
                <input required type="text" placeholder="e.g. Anitha Raghavan" className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white focus:outline-none" />
              </label>
              <label className="block">
                <span className="text-slate-300 font-semibold block mb-1">Email or Mobile</span>
                <input required type="text" placeholder="e.g. anitha@example.com" className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white focus:outline-none" />
              </label>
            </div>
            <label className="block">
              <span className="text-slate-300 font-semibold block mb-1">Issue Topic</span>
              <select className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white focus:outline-none">
                <option>Question about AI Rank score</option>
                <option>Pro Pack / Unlocking issue</option>
                <option>Premium plan access</option>
                <option>Advocate consultation query</option>
                <option>Reporting error in sale notice</option>
              </select>
            </label>
            <label className="block">
              <span className="text-slate-300 font-semibold block mb-1">Message</span>
              <textarea rows={4} placeholder="Describe the question or issue in detail..." className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white focus:outline-none" />
            </label>
            <button type="submit" className="px-7 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase tracking-wider transition-all">
              Submit Ticket
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
