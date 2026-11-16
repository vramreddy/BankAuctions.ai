import React from 'react';
import GlassCard from './GlassCard';

export function StatCard({ label, value, subtext, icon: Icon, trend, className = '' }) {
  return (
    <GlassCard className={`p-5 relative overflow-hidden group ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-1">
            {label}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2">
            {value}
            {trend && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-slate-400 mt-2">{subtext}</p>}
        </div>
        {Icon && (
          <div className="p-3 rounded-2xl bg-brand-cyan/10 border border-brand-cyan/20 text-brand-cyan group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export default StatCard;
