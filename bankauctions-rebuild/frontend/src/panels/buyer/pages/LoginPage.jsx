import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Smartphone,
  ShieldCheck,
  Languages,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  UserCheck
} from 'lucide-react';

const PRESET_USERS = [
  {
    name: 'Demo user',
    phone: '9000000000',
    plan: 'Free',
    langs: ['English'],
    credits: 0
  },
  {
    name: 'Anitha Raghavan',
    phone: '9876543210',
    plan: 'Pro pack · 5 properties',
    langs: ['English', 'Tamil'],
    credits: 4
  },
  {
    name: 'Suresh Kumar',
    phone: '9840123456',
    plan: 'Premium · Chennai',
    langs: ['English', 'Tamil', 'Telugu'],
    credits: 5
  }
];

export default function LoginPage({ portal = 'BUYER' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [name, setName] = useState('Anitha Raghavan');
  const [phone, setPhone] = useState('9876543210');
  const [selectedLangs, setSelectedLangs] = useState(['English', 'Tamil']);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('123456');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/account';

  const toggleLanguage = (lang) => {
    setSelectedLangs((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const handleSendOtp = () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    setError(null);
    setOtpSent(true);
  };

  const handleVerifyAndContinue = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userObj = {
        name: name.trim() || 'Valued Buyer',
        phone: phone.trim(),
        role: 'BUYER',
        languages: selectedLangs,
        plan: phone === '9876543210' ? 'Pro pack · 5 properties' : phone === '9840123456' ? 'Premium · Chennai' : 'Free',
        credits: phone === '9876543210' ? 4 : 5
      };

      // Persist in localStorage to match prototype `ba3_user`
      localStorage.setItem('ba3_user', JSON.stringify(userObj));
      localStorage.setItem('ba3_user_name', userObj.name);

      if (login) {
        try {
          await login({
            email: `${phone}@bankauctions.ai`,
            password: 'password123',
            role: 'BUYER'
          });
        } catch (authErr) {
          // Prototype fallback: Proceed to account
        }
      }

      navigate(from, { replace: true });
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPreset = (preset) => {
    setName(preset.name);
    setPhone(preset.phone);
    setSelectedLangs(preset.langs);
    setOtpSent(true);
    setOtp('123456');
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Sign in</span>
        </div>

        {/* Main Sign in Box matching prototype account.html */}
        <div className="bg-[#0b101e] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Sign in or register
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Use your mobile number. In this prototype, the OTP is always <strong>123456</strong>.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleVerifyAndContinue} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Your name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Anitha Raghavan"
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Mobile number */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Mobile number
              </label>
              <div className="relative">
                <input
                  type="tel"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>
            </div>

            {/* Languages you speak */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase text-slate-400">
                  Languages you speak
                </label>
                <span className="text-[11px] text-slate-500">For lawyer matching</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {['English', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Hindi'].map((l) => (
                  <button
                    type="button"
                    key={l}
                    onClick={() => toggleLanguage(l)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      selectedLangs.includes(l)
                        ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-600/30'
                        : 'bg-white/[0.04] text-slate-400 border border-white/[0.06] hover:bg-white/[0.08] hover:text-slate-200'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Send OTP or Verify Step */}
            {!otpSent ? (
              <button
                type="button"
                onClick={handleSendOtp}
                className="w-full py-3.5 rounded-xl border border-rose-500/50 hover:bg-rose-600 text-white font-bold text-sm tracking-wide transition-all active:scale-95 mt-2"
              >
                Send OTP
              </button>
            ) : (
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase text-slate-400">
                      OTP (Demo is 123456)
                    </label>
                    <span className="text-[11px] text-emerald-400">Code Sent</span>
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full rounded-xl bg-slate-900 border border-emerald-500/50 px-3.5 py-3 text-sm text-white font-mono tracking-widest text-center focus:outline-none focus:border-emerald-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-rose-600/30 active:scale-95 flex items-center justify-center gap-2"
                >
                  <UserCheck size={16} />
                  <span>{loading ? 'Verifying...' : 'Verify and continue'}</span>
                </button>
              </div>
            )}
          </form>

          {/* Quick Preset Selector */}
          <div className="pt-4 border-t border-white/[0.08] space-y-2">
            <span className="text-[11px] font-mono uppercase text-slate-400 block mb-1">
              Quick Test Personas
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              {PRESET_USERS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(p)}
                  className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-left transition-colors"
                >
                  <div className="font-bold text-white truncate">{p.name}</div>
                  <div className="text-[10px] text-rose-400 truncate">{p.plan}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Staff Login Link */}
        <div className="text-center pt-2">
          <Link
            to="/staff"
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>Are you a team member or advocate?</span>
            <span className="text-rose-400 font-semibold underline">Staff login →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
