import React, { useState } from 'react';
import { FileCheck, Lock, Mail, UserCheck, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function CheckerLoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('latha.m@bankauctions.ai');
  const [password, setPassword] = useState('demo');
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
      localStorage.setItem('ba_checker_token', res.token);
      onLoginSuccess(res.user);
    } catch (err) {
      // Prototype fallback
      const mockChecker = {
        name: 'Latha M.',
        email: email.trim(),
        role: 'CHECKER'
      };
      localStorage.setItem('ba_checker_token', 'demo-checker-token');
      onLoginSuccess(mockChecker);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        <div className="bg-[#0b101e] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold tracking-wider mb-3">
              STAFF ONLY
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Checker login
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Verify Maker exceptions and side-by-side legal notice review. In this prototype, any password works.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Work Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo"
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-rose-600/30 active:scale-95 flex items-center justify-center gap-2"
            >
              <UserCheck size={16} />
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
            </button>
          </form>

          <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/[0.08]">
            Default checker profile: <strong>Latha M.</strong> (latha.m@bankauctions.ai).
          </p>
        </div>
      </div>
    </div>
  );
}
