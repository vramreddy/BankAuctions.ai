import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Building2, Mail, Lock, ArrowRight, ShieldCheck,
  Sparkles, AlertCircle, CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/buyer/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const user = await login(email, password);
      // Route based on role
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'CHECKER') navigate('/checker');
      else if (user.role === 'ENGINEER') navigate('/engineer');
      else navigate(from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid login credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const fillQuickDemo = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Intro */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-cyan via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-accent-cyan/20">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Bank<span className="text-accent-cyan">Auctions</span><span className="text-xs text-accent-cyan font-mono ml-1">.ai</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-white">Sign In to Your Account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Discover vetted bank foreclosures, unlock contact contacts, and track auctions.
          </p>
        </div>

        {/* Demo Fast Login Pills */}
        <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 text-center">
            One-Click Demo Credentials
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => fillQuickDemo('buyer@bankauctions.ai', 'Buyer@123')}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-accent-cyan border border-accent-cyan/30 text-left transition-colors"
            >
              <div className="font-bold">Investor / Buyer</div>
              <div className="text-[10px] text-slate-400 font-mono">buyer@bankauctions.ai</div>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('admin@bankauctions.ai', 'Admin@123')}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-purple-400 border border-purple-500/30 text-left transition-colors"
            >
              <div className="font-bold">System Admin</div>
              <div className="text-[10px] text-slate-400 font-mono">admin@bankauctions.ai</div>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('checker@bankauctions.ai', 'Checker@123')}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-amber-400 border border-amber-500/30 text-left transition-colors"
            >
              <div className="font-bold">Data Checker</div>
              <div className="text-[10px] text-slate-400 font-mono">checker@bankauctions.ai</div>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('engineer@bankauctions.ai', 'Engineer@123')}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-emerald-400 border border-emerald-500/30 text-left transition-colors"
            >
              <div className="font-bold">Field Engineer</div>
              <div className="text-[10px] text-slate-400 font-mono">engineer@bankauctions.ai</div>
            </button>
          </div>
        </div>

        {/* Card Form */}
        <GlassCard className="p-8">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-mono uppercase text-slate-400">
                  Password
                </label>
                <a href="#forgot" className="text-xs text-accent-cyan hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full justify-center"
              icon={<ArrowRight className="w-4 h-4" />}
            >
              Sign In Securely
            </Button>
          </form>

          {/* Quick Demo Access Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-800">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 text-center">
              Quick Demo Fill (Click to autofill)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('buyer@bankauctions.ai');
                  setPassword('Buyer@123');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/60 text-left transition-colors text-xs group"
              >
                <div className="font-semibold text-white group-hover:text-cyan-400 flex items-center justify-between">
                  <span>Buyer</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Fill →</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">buyer@bankauctions.ai</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('checker@bankauctions.ai');
                  setPassword('Checker@123');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-amber-500/60 text-left transition-colors text-xs group"
              >
                <div className="font-semibold text-white group-hover:text-amber-400 flex items-center justify-between">
                  <span>Checker</span>
                  <span className="text-[10px] text-amber-400 font-mono">Fill →</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">checker@bankauctions.ai</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('engineer@bankauctions.ai');
                  setPassword('Engineer@123');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 text-left transition-colors text-xs group"
              >
                <div className="font-semibold text-white group-hover:text-emerald-400 flex items-center justify-between">
                  <span>Engineer</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Fill →</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">engineer@bankauctions.ai</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('admin@bankauctions.ai');
                  setPassword('Admin@123');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-purple-500/60 text-left transition-colors text-xs group"
              >
                <div className="font-semibold text-white group-hover:text-purple-400 flex items-center justify-between">
                  <span>Admin</span>
                  <span className="text-[10px] text-purple-400 font-mono">Fill →</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">admin@bankauctions.ai</div>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-800 text-center text-sm text-slate-400">
            Don't have an investor account?{' '}
            <Link to="/register" className="text-accent-cyan font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
