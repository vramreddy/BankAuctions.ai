import React, { useState } from 'react';
import { Scale, Lock, Mail, ArrowRight, AlertCircle, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';

export default function AdvocateLoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('advocate@bankauctions.ai');
  const [password, setPassword] = useState('Advocate@123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login({ email: email.trim(), password });
      if (!res.success || !res.token) {
        throw new Error(res.message || 'Authentication failed');
      }
      localStorage.setItem('ba_advocate_token', res.token);
      onLoginSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Invalid credentials or non-advocate account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-600 to-amber-700 flex items-center justify-center shadow-xl shadow-amber-500/30 border-t border-white/40 mx-auto mb-4">
            <Scale className="w-7 h-7 text-slate-950" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Advocate Legal Bench Login</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Dedicated portal for SARFAESI 12B scrutiny, title verification, and legal opinion clearance.
          </p>
        </div>

        <div className="glass-panel p-7 sm:p-8 rounded-3xl shadow-2xl border border-white/10 space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Advocate Bar Council Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
                  placeholder="advocate@bankauctions.ai"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Passcode
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 transition-all flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In to Advocate Panel'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-white/[0.08] text-center">
            <a
              href="http://localhost:5173"
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              ← Back to Application Overview
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
