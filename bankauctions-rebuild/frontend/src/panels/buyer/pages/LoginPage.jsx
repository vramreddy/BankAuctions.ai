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


  if (sessionLoading) return <p className="p-12 text-center" role="status">Checking your session...</p>;
  if (currentUser) return <Navigate to={loginDestination(currentUser.role, from)} replace />;

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
          <h2 className="text-2xl font-extrabold text-white">Login to your account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Enter your email and password to access your workspace.
          </p>
        </div>

        {/* Card Form */}
        <GlassCard className="p-8">
          {error && (
            <div role="alert" className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form aria-busy={loading} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="login-email" className="block text-xs font-mono uppercase text-slate-400 mb-2">
                Registered Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-email" name="email" autoComplete="username" type="email"
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
                <label htmlFor="login-password" className="block text-xs font-mono uppercase text-slate-400">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  id="login-password" name="password" autoComplete="current-password" type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
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
              Login
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-sm text-slate-400">
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
