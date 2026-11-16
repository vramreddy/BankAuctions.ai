import React from 'react';

export function GlassCard({ children, className = '', hover = false, onClick, ...props }) {
  return (
    <div
      onClick={onClick}
      className={`rounded-2xl backdrop-blur-xl border transition-all duration-300 ${
        hover ? 'glass-panel-interactive cursor-pointer' : 'glass-panel'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;
