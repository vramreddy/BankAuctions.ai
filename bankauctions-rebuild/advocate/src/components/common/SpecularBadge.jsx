import React from 'react';

export function SpecularBadge({ children, variant = 'cyan', size = 'md', className = '' }) {
  const variants = {
    cyan: 'bg-brand-cyan/10 text-brand-cyan border-brand-cyan/30 shadow-[0_0_12px_rgba(0,229,255,0.2)]',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.2)]',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.2)]',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.2)]',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.2)]',
    slate: 'bg-slate-700/30 text-slate-300 border-slate-600/40',
    neutral: 'bg-slate-800 text-slate-300 border-slate-700'
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border backdrop-blur-md uppercase tracking-wider ${variants[variant] || variants.cyan} ${sizes[size] || sizes.md} ${className}`}>
      {children}
    </span>
  );
}

export default SpecularBadge;
