import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  ShieldAlert,
  Lock,
  Mail,
  UserCheck,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Scale,
  HardHat,
  FileCheck,
  TrendingUp,
  Settings,
  Shield
} from 'lucide-react';
import { PROTOTYPE_BENCH, PROTOTYPE_DATA } from '../../../data/prototypeData';

const STAFF_ROLES = [
  {
    id: 'checker',
    label: 'Checker',
    role: 'CHECKER',
    name: 'Latha M.',
    email: 'latha.m@bankauctions.ai',
    path: '/checker',
    portUrl: 'http://localhost:5175'
  },
  {
    id: 'lawyer',
    label: 'Advocate',
    role: 'ADVOCATE',
    name: 'Adv. R. Venkatesan',
    email: 'r.venkatesan@bar.bankauctions.ai',
    path: '/advocate',
    portUrl: 'http://localhost:5176'
  },
  {
    id: 'field',
    label: 'Field engineer',
    role: 'ENGINEER',
    name: 'Karthik S.',
    email: 'karthik.s@bankauctions.ai',
    path: '/engineer',
    portUrl: 'http://localhost:5177'
  },
  {
    id: 'marketing',
    label: 'Marketing',
    role: 'MARKETING',
    name: 'Meera N.',
    email: 'meera.n@bankauctions.ai',
    path: '/marketing'
  },
  {
    id: 'admin',
    label: 'Admin',
    role: 'ADMIN',
    name: 'Rahul D.',
    email: 'rahul.d@bankauctions.ai',
    path: '/admin',
    portUrl: 'http://localhost:5174'
  },
  {
    id: 'leadership',
    label: 'Leadership',
    role: 'ADMIN',
    name: 'Sanjay K.',
    email: 'sanjay.k@bankauctions.ai',
    path: '/leadership'
  }
];

export default function StaffLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRoleId, setSelectedRoleId] = useState('checker');
  const [selectedSubItem, setSelectedSubItem] = useState('');
  const [email, setEmail] = useState('latha.m@bankauctions.ai');
  const [password, setPassword] = useState('demo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract all advocates for the Advocate dropdown
  const allAdvocates = Object.values(PROTOTYPE_BENCH).flatMap((bench) =>
    bench.map((adv) => adv[0])
  );

  const allCities = Object.keys(PROTOTYPE_DATA.cities || {
    chennai: { label: 'Chennai' },
    hyderabad: { label: 'Hyderabad' },
    bengaluru: { label: 'Bengaluru' },
    coimbatore: { label: 'Coimbatore' },
    kerala: { label: 'Kerala' }
  });

  // Handle role change
  const handleRoleChange = (roleId) => {
    setSelectedRoleId(roleId);
    const r = STAFF_ROLES.find((x) => x.id === roleId);

    if (roleId === 'lawyer') {
      const firstAdv = allAdvocates[0] || 'Adv. R. Venkatesan';
      setSelectedSubItem(firstAdv);
      const advSlug = firstAdv
        .replace(/^Adv\.\s*/, '')
        .toLowerCase()
        .replace(/[^a-z ]/g, '')
        .trim()
        .split(/\s+/)
        .join('.');
      setEmail(`${advSlug}@bar.bankauctions.ai`);
    } else if (roleId === 'field') {
      setSelectedSubItem('chennai');
      setEmail(r.email);
    } else {
      setSelectedSubItem('');
      setEmail(r ? r.email : '');
    }
  };

  const handleSubItemChange = (val) => {
    setSelectedSubItem(val);
    if (selectedRoleId === 'lawyer') {
      const advSlug = val
        .replace(/^Adv\.\s*/, '')
        .toLowerCase()
        .replace(/[^a-z ]/g, '')
        .trim()
        .split(/\s+/)
        .join('.');
      setEmail(`${advSlug}@bar.bankauctions.ai`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const targetRole = STAFF_ROLES.find((x) => x.id === selectedRoleId);

    try {
      if (login) {
        await login({
          email: email.trim(),
          password: password || 'demo',
          role: targetRole?.role || 'ADMIN'
        });
      }

      // Save prototype staff state to localStorage
      const staffProfile = {
        name: selectedRoleId === 'lawyer' ? selectedSubItem : targetRole?.name || 'Staff Member',
        email: email.trim(),
        role: selectedRoleId,
        city: selectedRoleId === 'field' ? selectedSubItem : undefined
      };
      localStorage.setItem('ba3_staff', JSON.stringify(staffProfile));

      navigate(targetRole?.path || '/admin');
    } catch (err) {
      // In prototype: any password works
      const staffProfile = {
        name: selectedRoleId === 'lawyer' ? selectedSubItem : targetRole?.name || 'Staff Member',
        email: email.trim(),
        role: selectedRoleId,
        city: selectedRoleId === 'field' ? selectedSubItem : undefined
      };
      localStorage.setItem('ba3_staff', JSON.stringify(staffProfile));
      navigate(targetRole?.path || '/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <span className="text-white">Staff login</span>
        </div>

        {/* Prototype Login Card */}
        <div className="bg-[#0b101e] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono font-bold tracking-wider mb-3">
              STAFF ONLY
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Staff login
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              For BankAuctions.ai staff and empanelled advocates. Not for customers. In this prototype, any password works.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selector */}
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                Role
              </label>
              <select
                value={selectedRoleId}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                {STAFF_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Secondary Selector (Advocate or Home City) */}
            {selectedRoleId === 'lawyer' && (
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Empanelled Advocate
                </label>
                <select
                  value={selectedSubItem}
                  onChange={(e) => handleSubItemChange(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  {allAdvocates.map((adv) => (
                    <option key={adv} value={adv}>
                      {adv}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {selectedRoleId === 'field' && (
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
                  Home City
                </label>
                <select
                  value={selectedSubItem}
                  onChange={(e) => handleSubItemChange(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-white/10 px-3.5 py-3 text-sm text-white focus:outline-none focus:border-rose-500"
                >
                  {allCities.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Work Email */}
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

            {/* Password */}
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm tracking-wide transition-all shadow-lg shadow-rose-600/30 active:scale-95 flex items-center justify-center gap-2"
            >
              <UserCheck size={16} />
              <span>{loading ? 'Signing in...' : 'Sign in'}</span>
            </button>
          </form>

          {/* Subtext describing workspaces */}
          <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/[0.08]">
            Each role opens its own dedicated workspace: checkers verify exceptions, advocates run consultations, field engineers verify sites, marketing runs campaigns, admin runs the platform, and leadership reads the numbers.
          </p>
        </div>

        {/* Dedicated Port Shortcuts */}
        <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-slate-400 flex flex-wrap items-center justify-between gap-3">
          <span className="font-semibold text-slate-300">Dedicated Portal Ports:</span>
          <div className="flex flex-wrap gap-2 text-[11px] font-mono">
            <a href="http://localhost:5174" target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-white/[0.05] hover:text-white transition-colors">Admin :5174</a>
            <a href="http://localhost:5175" target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-white/[0.05] hover:text-white transition-colors">Checker :5175</a>
            <a href="http://localhost:5176" target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-white/[0.05] hover:text-white transition-colors">Advocate :5176</a>
            <a href="http://localhost:5177" target="_blank" rel="noreferrer" className="px-2 py-1 rounded-md bg-white/[0.05] hover:text-white transition-colors">Engineer :5177</a>
          </div>
        </div>
      </div>
    </div>
  );
}
