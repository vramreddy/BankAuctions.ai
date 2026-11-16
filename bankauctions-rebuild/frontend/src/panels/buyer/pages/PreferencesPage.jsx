import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useCity } from '../../../contexts/CityContext';
import { Button } from '../../../components/common/Button';
import { GlassCard } from '../../../components/common/GlassCard';
import { Sliders, Bell, MapPin, Check } from 'lucide-react';

export function PreferencesPage() {
  const { user } = useAuth();
  const { allCities } = useCity();

  const [selectedCities, setSelectedCities] = useState(['chennai', 'bengaluru']);
  const [selectedTypes, setSelectedTypes] = useState(['flat', 'house']);
  const [maxBudget, setMaxBudget] = useState('10000000');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [saved, setSaved] = useState(false);

  const toggleCity = (k) => {
    setSelectedCities((prev) =>
      prev.includes(k) ? prev.filter((c) => c !== k) : [...prev, k]
    );
  };

  const toggleType = (t) => {
    setSelectedTypes((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <GlassCard className="p-6 sm:p-8 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders className="w-5 h-5 text-brand-cyan" />
          Buyer Search &amp; Alert Preferences
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Customize target cities and auction property types to tailor your search feed and email updates.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cities Selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
            Target Auction Regions
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {Object.entries(allCities).map(([key, item]) => {
              const checked = selectedCities.includes(key);
              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleCity(key)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    checked
                      ? 'bg-brand-cyan/15 border-brand-cyan text-white shadow-glow-cyan'
                      : 'bg-brand-900/40 border-slate-700/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{item.name}</span>
                  {checked && <Check className="w-3.5 h-3.5 text-brand-cyan" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Property Categories Selection */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
            Asset Classes of Interest
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'flat', label: 'Flats & Apartments' },
              { id: 'house', label: 'Houses & Villas' },
              { id: 'land', label: 'Plots & Land' },
              { id: 'shop', label: 'Commercial Shops' },
              { id: 'office', label: 'Offices' },
              { id: 'warehouse', label: 'Industrial Sheds' },
              { id: 'vehicle', label: 'Vehicles' }
            ].map((t) => {
              const checked = selectedTypes.includes(t.id);
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => toggleType(t.id)}
                  className={`p-3 rounded-xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                    checked
                      ? 'bg-brand-cyan/15 border-brand-cyan text-white shadow-glow-cyan'
                      : 'bg-brand-900/40 border-slate-700/60 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{t.label}</span>
                  {checked && <Check className="w-3.5 h-3.5 text-brand-cyan" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Budget Cap */}
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-2">
            Maximum Reserve Price Budget
          </label>
          <select
            value={maxBudget}
            onChange={(e) => setMaxBudget(e.target.value)}
            className="w-full sm:w-72 px-4 py-2.5 rounded-xl glass-input text-sm text-white"
          >
            <option value="5000000" className="bg-brand-950">Under ₹50 Lakhs</option>
            <option value="10000000" className="bg-brand-950">Under ₹1 Crore</option>
            <option value="20000000" className="bg-brand-950">Under ₹2 Crores</option>
            <option value="50000000" className="bg-brand-950">Under ₹5 Crores</option>
          </select>
        </div>

        {/* Notifications Checkbox */}
        <div className="p-4 rounded-2xl bg-brand-900/40 border border-slate-800 flex items-center gap-3">
          <input
            type="checkbox"
            id="alerts"
            checked={emailAlerts}
            onChange={(e) => setEmailAlerts(e.target.checked)}
            className="w-4 h-4 rounded text-brand-cyan focus:ring-brand-cyan"
          />
          <label htmlFor="alerts" className="text-xs text-slate-300 cursor-pointer">
            <strong className="text-white block font-semibold">Weekly Auction Digest Alerts</strong>
            Receive immediate notifications whenever new SARFAESI notices match your city &amp; budget.
          </label>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" variant="primary">
            Save Preferences
          </Button>
          {saved && (
            <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
              <Check className="w-4 h-4" /> Preferences saved!
            </span>
          )}
        </div>
      </form>
    </GlassCard>
  );
}


export default PreferencesPage;
