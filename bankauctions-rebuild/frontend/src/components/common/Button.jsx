import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  icon = null,
  ...props
}) {
  const variants = {
    primary:
      'bg-gradient-to-r from-accent-cyan via-blue-500 to-indigo-600 text-slate-950 font-bold shadow-glow-cyan hover:shadow-[0_0_30px_rgba(0,229,255,0.6)] border-t border-white/40',
    secondary:
      'bg-slate-800/80 hover:bg-slate-700/80 text-white border border-slate-700/60 hover:border-accent-cyan/40',
    outline:
      'bg-transparent hover:bg-white/5 text-slate-200 border border-white/15 hover:border-accent-cyan/50',
    ghost:
      'bg-transparent hover:bg-white/5 text-slate-300 hover:text-white',
    danger:
      'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg',
    md: 'text-sm px-4 py-2 rounded-xl',
    lg: 'text-base px-6 py-3 rounded-xl'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        icon
      ) : null}
      {children}
    </button>
  );
}

export default Button;
