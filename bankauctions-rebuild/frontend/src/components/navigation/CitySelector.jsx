import React from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useCity } from '../../contexts/CityContext';

export function CitySelector({ className = '' }) {
  const { selectedCity, setCity, allCities } = useCity();

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/70 border border-slate-700/60 hover:border-accent-cyan/40 transition-colors">
        <MapPin className="w-4 h-4 text-accent-cyan shrink-0" />
        <select
          value={selectedCity}
          onChange={(e) => setCity(e.target.value)}
          className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer pr-4 appearance-none"
        >
          {Object.entries(allCities).map(([key, item]) => (
            <option key={key} value={key} className="bg-slate-950 text-white">
              {item.name}
            </option>
          ))}
        </select>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-3" />
      </div>
    </div>
  );
}

export default CitySelector;
