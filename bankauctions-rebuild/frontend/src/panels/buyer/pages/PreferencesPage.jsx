import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useCity } from '../../../contexts/CityContext';
import { SlidersHorizontal, CheckCircle2, RotateCcw } from 'lucide-react';

export default function PreferencesPage() {
  const { allCities } = useCity();

  const [cities, setCities] = useState(['chennai', 'hyderabad']);
  const [cats, setCats] = useState(['flat', 'land']);
  const [maxBudget, setMaxBudget] = useState('100');
  const [possession, setPossession] = useState('Physical possession');
  const [closingDays, setClosingDays] = useState('14');
  const [alertLang, setAlertLang] = useState('English');
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [channels, setChannels] = useState({ whatsapp: true, email: true, sms: false });
  const [saved, setSaved] = useState(false);

  const toggleCity = (c) => {
    setCities(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const toggleCat = (c) => {
    setCats(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setCities(['chennai']);
    setCats(['flat']);
    setMaxBudget('0');
    setPossession('');
    setClosingDays('0');
    setAlertLang('English');
    setPremiumOnly(false);
    setChannels({ whatsapp: true, email: false, sms: false });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Set preferences</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Set your preferences.
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Tell us what you look for. We put matching properties first and alert you when new ones are listed.
        </p>
      </div>

      <form onSubmit={handleSave} className="p-8 sm:p-10 rounded-3xl bg-slate-900/80 border border-white/10 space-y-8 shadow-xl">
        {/* Cities */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Target Metros</h3>
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'chennai', label: 'Chennai' },
              { id: 'hyderabad', label: 'Hyderabad' },
              { id: 'bengaluru', label: 'Bengaluru' },
              { id: 'coimbatore', label: 'Coimbatore' },
              { id: 'kerala', label: 'Kerala' }
            ].map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => toggleCity(c.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  cities.includes(c.id)
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300 font-bold'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/25'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Property Types */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Property Types</h3>
          <div className="flex flex-wrap gap-2.5">
            {[
              { id: 'flat', label: 'Flats & apartments' },
              { id: 'house', label: 'Houses & villas' },
              { id: 'land', label: 'Plots & land' },
              { id: 'shop', label: 'Shops & showrooms' },
              { id: 'office', label: 'Offices' },
              { id: 'warehouse', label: 'Warehouses & industrial' },
              { id: 'vehicle', label: 'Vehicles & machinery' }
            ].map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => toggleCat(t.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  cats.includes(t.id)
                    ? 'bg-rose-600/20 border-rose-500 text-rose-300 font-bold'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:border-white/25'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget & Possession */}
        <div className="grid sm:grid-cols-2 gap-6">
          <label className="block text-xs">
            <span className="text-slate-300 font-semibold block mb-1.5">Maximum Budget</span>
            <select
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white"
            >
              <option value="0">No limit</option>
              <option value="25">Under ₹25 L</option>
              <option value="50">Under ₹50 L</option>
              <option value="100">Under ₹1 Cr</option>
              <option value="300">Under ₹3 Cr</option>
            </select>
          </label>

          <label className="block text-xs">
            <span className="text-slate-300 font-semibold block mb-1.5">Possession Requirement</span>
            <select
              value={possession}
              onChange={(e) => setPossession(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white"
            >
              <option value="">Any possession</option>
              <option value="Physical possession">Physical possession only</option>
              <option value="Symbolic possession">Symbolic possession acceptable</option>
            </select>
          </label>
        </div>

        {/* Closing Window & Language */}
        <div className="grid sm:grid-cols-2 gap-6">
          <label className="block text-xs">
            <span className="text-slate-300 font-semibold block mb-1.5">Closing Window</span>
            <select
              value={closingDays}
              onChange={(e) => setClosingDays(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white"
            >
              <option value="0">Any closing date</option>
              <option value="7">Within 7 days</option>
              <option value="14">Within 14 days</option>
            </select>
          </label>

          <label className="block text-xs">
            <span className="text-slate-300 font-semibold block mb-1.5">Language for Alerts</span>
            <select
              value={alertLang}
              onChange={(e) => setAlertLang(e.target.value)}
              className="w-full rounded-xl bg-slate-800 border border-white/20 p-3 text-white"
            >
              <option>English</option>
              <option>Tamil</option>
              <option>Telugu</option>
              <option>Kannada</option>
              <option>Malayalam</option>
            </select>
          </label>
        </div>

        {/* Premium Only Toggle */}
        <label className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.04] border border-white/10 cursor-pointer">
          <div>
            <b className="text-white text-xs block">Premium properties only</b>
            <span className="text-[11px] text-slate-400">Highway, corner and high-commercial-value listings only</span>
          </div>
          <input
            type="checkbox"
            checked={premiumOnly}
            onChange={(e) => setPremiumOnly(e.target.checked)}
            className="w-4 h-4 accent-rose-600 rounded"
          />
        </label>

        {/* Alert Channels */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">Alert Me By</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            {['whatsapp', 'email', 'sms'].map((ch) => (
              <label key={ch} className="flex items-center gap-2 cursor-pointer text-slate-300 font-semibold">
                <input
                  type="checkbox"
                  checked={channels[ch]}
                  onChange={(e) => setChannels({ ...channels, [ch]: e.target.checked })}
                  className="w-4 h-4 accent-rose-600 rounded"
                />
                <span className="capitalize">{ch}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/[0.08]">
          <button
            type="submit"
            className="px-7 py-3 rounded-full bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
          >
            Save preferences
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="px-5 py-3 rounded-full border border-white/20 text-slate-300 hover:text-white hover:bg-white/10 text-xs font-semibold transition-all flex items-center gap-1.5"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
          {saved && (
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Saved. On Search, tick "Match my preferences" to apply them.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
