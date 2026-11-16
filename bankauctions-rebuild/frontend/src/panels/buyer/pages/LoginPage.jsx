import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { loginDestination } from '../../../utils/workspace';
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
  const { login, user: currentUser, loading: sessionLoading } = useAuth();

  const [email, setEmail] = useState(location.state?.email || '');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(email.trim(), password);
      if (!response.success || !response.user || !response.token) {
        throw new Error(response.message || 'Unable to sign in. Please try again.');
      }
      navigate(loginDestination(response.user.role, from), { replace: true });
    } catch (err) {
      if (err.status === 401) {
        navigate('/register', { state: { email: email.trim(), from, loginFailed: true } });
        return;
      }
      setError(err.response?.data?.message || err.message || 'Invalid login credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = (roleEmail, rolePass) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setError(null);
  };

  if (sessionLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-400 text-sm font-mono">
          <span className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <span>Verifying active session...</span>
        </div>
      </div>
    );
  }

  if (currentUser) {
    return <Navigate to={loginDestination(currentUser.role, from)} replace />;
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Intro */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 border-t border-white/40 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-slate-950" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Bank<span className="text-accent-cyan">Auctions</span><span className="text-xs text-accent-cyan font-mono ml-1">.ai</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Login to your account</h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Sign in to access your role workspace and confidential auction dossiers.
          </p>
        </div>

        {/* Card Form */}
        <GlassCard className="p-7 sm:p-8 border-white/[0.1] shadow-2xl">
          {error && (
            <div role="alert" className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-xs sm:text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form aria-busy={loading} onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-email"
                  name="email"
                  autoComplete="username"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="login-password" className="block text-[11px] font-mono uppercase tracking-wider text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-password"
                  name="password"
                  autoComplete="current-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
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
              Sign In
            </Button>
          </form>

          {/* Quick Demo Autofill Chips */}
          <div className="mt-6 pt-5 border-t border-white/[0.08]">
            <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-3 text-center">
              Quick Demo Fill (Click any role to autofill)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => autofillDemo('buyer@bankauctions.ai', 'Buyer@123')}
                className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-cyan-400/60 text-left transition-all text-xs group hover:bg-cyan-500/[0.05]"
              >
                <div className="font-bold text-white group-hover:text-cyan-400 flex items-center justify-between">
                  <span>Buyer</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Fill →</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">buyer@bankauctions.ai</div>
              </button>

              <button
                type="button"
                onClick={() => autofillDemo('checker@bankauctions.ai', 'Checker@123')}
                className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-amber-400/60 text-left transition-all text-xs group hover:bg-amber-500/[0.05]"
              >
                <div className="font-bold text-white group-hover:text-amber-400 flex items-center justify-between">
                  <span>Checker</span>
                  <span className="text-[10px] text-amber-400 font-mono">Fill →</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">checker@bankauctions.ai</div>
              </button>

              <button
                type="button"
                onClick={() => autofillDemo('engineer@bankauctions.ai', 'Engineer@123')}
                className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-emerald-400/60 text-left transition-all text-xs group hover:bg-emerald-500/[0.05]"
              >
                <div className="font-bold text-white group-hover:text-emerald-400 flex items-center justify-between">
                  <span>Engineer</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Fill →</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">engineer@bankauctions.ai</div>
              </button>

              <button
                type="button"
                onClick={() => autofillDemo('admin@bankauctions.ai', 'Admin@123')}
                className="px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-purple-400/60 text-left transition-all text-xs group hover:bg-purple-500/[0.05]"
              >
                <div className="font-bold text-white group-hover:text-purple-400 flex items-center justify-between">
                  <span>Admin</span>
                  <span className="text-[10px] text-purple-400 font-mono">Fill →</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono truncate">admin@bankauctions.ai</div>
              </button>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center text-xs text-slate-400">
            Don't have an investor account?{' '}
            <Link to="/register" state={{ email: email.trim(), from }} className="text-accent-cyan font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
