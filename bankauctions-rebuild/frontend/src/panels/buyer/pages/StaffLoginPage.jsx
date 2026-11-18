import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import {
  Shield,
  FileCheck,
  CheckCircle2,
  HardHat,
  Scale,
  Settings,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

export default function StaffLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRoleQuickLogin = async (role, targetPath) => {
    try {
      const email = `${role.toLowerCase()}@bankauctions.ai`;
      await login({ email, password: 'password123' });
      navigate(targetPath);
    } catch (e) {
      navigate(targetPath);
    }
  };

  const staffRoles = [
    {
      title: 'Checker Portal',
      desc: 'Verify maker exceptions, side-by-side legal notice review and OCR extraction.',
      path: '/checker',
      role: 'CHECKER',
      icon: FileCheck,
      color: 'text-amber-400'
    },
    {
      title: 'Field Engineer Portal',
      desc: 'On-site physical inspection, geo-tagged photographs and occupancy reporting.',
      path: '/engineer',
      role: 'ENGINEER',
      icon: HardHat,
      color: 'text-emerald-400'
    },
    {
      title: 'Advocate Workspace',
      desc: 'Section 13(2) notice validation, DRT stay checks, and title opinion dossiers.',
      path: '/advocate',
      role: 'ADVOCATE',
      icon: Scale,
      color: 'text-indigo-400'
    },
    {
      title: 'Administrator Console',
      desc: 'Platform governance, user management, audit logs, and catalog control.',
      path: '/admin',
      role: 'ADMIN',
      icon: Settings,
      color: 'text-rose-400'
    },
    {
      title: 'Marketing & Analytics',
      desc: 'Campaign management, category demand trends, and regional auction heatmaps.',
      path: '/marketing',
      role: 'MARKETING',
      icon: TrendingUp,
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white">Home</Link>
          <span>/</span>
          <span className="text-white">Staff login</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Staff Operational Workspace
        </h1>

        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Authorized personnel access for catalog exception checkers, chartered field engineers, empanelled advocates, and platform administrators.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {staffRoles.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-slate-900/70 border border-white/10 hover:border-white/30 space-y-4 transition-all shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.05] border border-white/10 flex items-center justify-center">
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <h3 className="text-lg font-bold text-white">{s.title}</h3>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                <button
                  onClick={() => handleRoleQuickLogin(s.role, s.path)}
                  className="px-4 py-2 rounded-full bg-white/[0.08] hover:bg-white/[0.16] border border-white/15 text-white text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <span>One-click Sign In</span>
                  <ArrowRight size={13} />
                </button>
                <Link
                  to={`/${s.role.toLowerCase()}/login`}
                  className="text-xs text-slate-400 hover:text-white font-medium"
                >
                  Password Login
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
