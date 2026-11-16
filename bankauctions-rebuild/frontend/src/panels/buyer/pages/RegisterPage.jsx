import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { loginDestination } from '../../../utils/workspace';
import {
  Building2, Mail, Lock, User, Phone, ArrowRight,
  CheckCircle2, AlertCircle, Sparkles, Shield
} from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import GlassCard from '../../../components/common/GlassCard';
import Button from '../../../components/common/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: location.state?.email || '',
    password: '',
    phone: '',
    preferredCity: 'Chennai'
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const cleanPhone = formData.phone.replace(/[\s()-]/g, '').replace(/^\+91(?=\d{10}$)/, '');
      const response = await register({
        ...formData,
        fullName: formData.name,
        phone: cleanPhone
      });
      if (!response.success || !response.user || !response.token) throw new Error(response.message || 'Registration failed. Please try again.');
      navigate(loginDestination(response.user.role, location.state?.from), { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-accent-cyan via-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-accent-cyan/20">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Bank<span className="text-accent-cyan">Auctions</span><span className="text-xs text-accent-cyan font-mono ml-1">.ai</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-white">Create Investor Account</h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign up now and receive <strong className="text-accent-cyan">3 complimentary property unlocks</strong> to start discovering bank distress sales.
          </p>
        </div>

        <GlassCard className="p-8">
          {location.state?.loginFailed && (
            <div role="status" className="mb-6 rounded-xl border border-sky-400/25 bg-sky-400/10 p-4 text-sm text-slate-200">
              <p>We couldn’t sign you in with those credentials. New here? Create an account below.</p>
              <Link to="/login" state={{ email: formData.email, from: location.state?.from }} className="mt-2 inline-block font-semibold text-accent-cyan hover:underline">
                Already registered? Try login again
              </Link>
            </div>
          )}
          {error && (
            <div role="alert" className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  minLength={2}
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Krishnan"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ramesh@example.com"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Mobile Contact</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Primary Investment City</label>
              <select
                value={formData.preferredCity}
                onChange={(e) => setFormData({ ...formData, preferredCity: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-accent-cyan"
              >
                <option value="Chennai">Chennai, Tamil Nadu</option>
                <option value="Bengaluru">Bengaluru, Karnataka</option>
                <option value="Hyderabad">Hyderabad, Telangana</option>
                <option value="Coimbatore">Coimbatore, Tamil Nadu</option>
                <option value="Kochi">Kochi, Kerala</option>
                <option value="Madurai">Madurai, Tamil Nadu</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  minLength={6}
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="At least 6 characters"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                className="w-full justify-center"
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Create Account & Claim Free Credits
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-800 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-cyan font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
