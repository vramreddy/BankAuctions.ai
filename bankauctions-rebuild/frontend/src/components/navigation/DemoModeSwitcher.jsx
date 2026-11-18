import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Sparkles } from 'lucide-react';

export default function DemoModeSwitcher() {
  const { user } = useAuth();
  const [currentMode, setCurrentMode] = useState(() => {
    return localStorage.getItem('ba3_mode') || 'free';
  });

  const handleModeChange = (mode) => {
    setCurrentMode(mode);
    localStorage.setItem('ba3_mode', mode);

    if (mode === 'free') {
      localStorage.setItem('ba3_plan', 'Free');
    } else if (mode === 'pro') {
      localStorage.setItem('ba3_plan', 'Pro Pack (5 Unlocks)');
    } else if (mode === 'prem') {
      localStorage.setItem('ba3_plan', 'Premium Subscriber');
    } else if (mode === 'both') {
      localStorage.setItem('ba3_plan', 'Pro + Premium All Access');
    }

    // Dispatch custom event for reactive components
    window.dispatchEvent(new Event('ba3_mode_change'));
  };

  return (
    <aside 
      aria-label="Demo mode switcher"
      className="fixed left-4 bottom-5 z-40 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-white/10 shadow-xl backdrop-blur-md text-[11px]"
    >
      <span className="text-slate-400 font-semibold flex items-center gap-1 mr-1">
        <Sparkles size={11} className="text-rose-400" />
        Demo mode:
      </span>

      <div className="flex items-center gap-1">
        {[
          { id: 'free', label: 'Free' },
          { id: 'pro', label: 'Pro' },
          { id: 'prem', label: 'Premium' },
          { id: 'both', label: 'Pro+Prem' }
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id)}
            className={`px-2.5 py-1 rounded-full font-medium transition-all ${
              currentMode === m.id
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white hover:bg-white/[0.08]'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
