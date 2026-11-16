import React from 'react';

export function GlassCard({
  children,
  className = '',
  hover = false,
  variant = 'default',
  accentGlow = false,
  onClick,
  ...props
}) {
  const variantClasses = {
    default: 'glass-panel',
    interactive: 'glass-panel-interactive',
    card: 'glass-card',
    surface: 'glass-surface'
  };

  const selectedClass = hover
    ? variantClasses.interactive
    : variantClasses[variant] || variantClasses.default;

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl relative overflow-hidden ${selectedClass} ${
        hover ? 'cursor-pointer' : ''
      } ${
        accentGlow ? 'before:absolute before:inset-0 before:bg-gradient-to-br before:from-cyan-500/10 before:via-transparent before:to-indigo-500/10 before:pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;
