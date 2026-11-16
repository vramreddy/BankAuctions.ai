import React from 'react';
import GlassCard from './GlassCard';

export function StatCard({
  label,
  value,
  subtext,
  icon: Icon,
  trend,
  color = 'cyan', // 'cyan', 'teal', 'violet', 'amber'
  className = ''
}) {
  const colorMap = {
    cyan: {
      iconBg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 group-hover:border-cyan-400/60 group-hover:shadow-[0_0_20px_rgba(0,229,255,0.35)]',
      gradientGlow: 'from-cyan-500/10 via-transparent to-transparent'
    },
    teal: {
      iconBg: 'bg-teal-500/10 border-teal-500/30 text-teal-300 group-hover:border-teal-400/60 group-hover:shadow-[0_0_20px_rgba(0,245,212,0.35)]',
      gradientGlow: 'from-teal-500/10 via-transparent to-transparent'
    },
    violet: {
      iconBg: 'bg-violet-500/10 border-violet-500/30 text-violet-300 group-hover:border-violet-400/60 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.35)]',
      gradientGlow: 'from-violet-500/10 via-transparent to-transparent'
    },
    amber: {
      iconBg: 'bg-amber-500/10 border-amber-500/30 text-amber-300 group-hover:border-amber-400/60 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.35)]',
      gradientGlow: 'from-amber-500/10 via-transparent to-transparent'
    }
  };

  const theme = colorMap[color] || colorMap.cyan;

  return (
    <GlassCard className={`p-5 sm:p-6 relative overflow-hidden group hover:border-white/20 transition-all duration-300 ${className}`}>
      {/* Subtle corner gradient light glow */}
      <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${theme.gradientGlow} pointer-events-none rounded-bl-full`} />

      <div className="flex items-start justify-between relative z-10">
        <div>
          <span className="text-[11px] uppercase tracking-wider font-mono font-semibold text-slate-400 block mb-1.5">
            {label}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-2.5">
            {value}
            {trend !== undefined && trend !== null && (
              <span
                className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                  trend > 0
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                }`}
              >
                {trend > 0 ? `+${trend}%` : `${trend}%`}
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-slate-400 mt-2 font-normal">{subtext}</p>}
        </div>

        {Icon && (
          <div className={`p-3 rounded-2xl border transition-all duration-300 group-hover:scale-105 ${theme.iconBg}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </GlassCard>
  );
}

export default StatCard;
