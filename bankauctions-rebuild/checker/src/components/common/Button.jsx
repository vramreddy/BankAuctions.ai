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
      'btn-gradient-cyan text-slate-950 font-bold',
    'gradient-cyan':
      'btn-gradient-cyan text-slate-950 font-bold',
    'gradient-teal':
      'btn-gradient-teal text-slate-950 font-bold',
    'gradient-violet':
      'btn-gradient-violet text-white font-bold',
    secondary:
      'bg-slate-900/80 hover:bg-slate-800/90 text-white border border-slate-700/70 hover:border-accent-cyan/50 backdrop-blur-md shadow-sm',
    outline:
      'bg-transparent hover:bg-white/10 text-slate-200 border border-white/20 hover:border-accent-cyan/60 backdrop-blur-sm',
    ghost:
      'bg-transparent hover:bg-white/10 text-slate-300 hover:text-white',
    danger:
      'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-semibold shadow-lg shadow-rose-950/40 border-t border-white/20'
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
    md: 'text-sm px-4 py-2 rounded-xl gap-2',
    lg: 'text-base px-6 py-3 rounded-xl gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed select-none focus-visible:ring-2 focus-visible:ring-brand-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-brand-obsidian ${
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
