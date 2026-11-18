import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Building } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Contact us</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Talk to us.
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Contact BankAuctions.ai about enterprise plans, institutional data access, DRT bench empanelment, partnerships or press.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
          <MapPin className="w-6 h-6 text-rose-400" />
          <h3 className="font-bold text-white text-base">Chennai Headquarters</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Level 4, Tidel Park Corridors, Rajiv Gandhi Salai, Taramani, Chennai, Tamil Nadu 600113.
          </p>
          <p className="text-xs text-slate-300 font-semibold">+91 44 4800 1200</p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/60 border border-white/10 space-y-3">
          <MapPin className="w-6 h-6 text-cyan-400" />
          <h3 className="font-bold text-white text-base">Bengaluru Operations</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Prestige Tech Park, Marathahalli Outer Ring Road, Kadubeesanahalli, Bengaluru, Karnataka 560103.
          </p>
          <p className="text-xs text-slate-300 font-semibold">+91 80 4900 3400</p>
        </div>
      </div>

      <div className="p-8 rounded-3xl bg-slate-900/80 border border-white/10 space-y-3">
        <h3 className="text-lg font-bold text-white">General Inquiries</h3>
        <p className="text-xs text-slate-400">
          For general queries, data partnerships, or enterprise subscription packages:
        </p>
        <div className="flex flex-wrap gap-4 pt-2 text-xs font-semibold">
          <a href="mailto:contact@bankauctions.ai" className="text-rose-400 hover:underline">
            contact@bankauctions.ai
          </a>
          <span className="text-slate-600">•</span>
          <a href="mailto:press@bankauctions.ai" className="text-rose-400 hover:underline">
            press@bankauctions.ai
          </a>
        </div>
      </div>
    </div>
  );
}
