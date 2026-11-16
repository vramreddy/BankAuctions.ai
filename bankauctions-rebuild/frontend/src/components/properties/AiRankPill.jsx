import React from 'react';

export function AiRankPill({ rank, categoryName, score }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 backdrop-blur-md border border-accent-cyan/40 text-accent-cyan shadow-sm">
      <span className="font-extrabold text-sm tracking-tight text-white">#{rank}</span>
      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-300">
        AI Rank {categoryName ? `· ${categoryName}` : ''}
      </span>
      {score ? (
        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-accent-cyan/20 text-accent-cyan rounded">
          {score}
        </span>
      ) : null}
    </div>
  );
}

export default AiRankPill;
