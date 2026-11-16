import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Shield, CheckCircle2, Compass, Key } from 'lucide-react';

export function StaffPortalModal({ isOpen, onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const quickRoles = [
    { role: 'Admin', email: 'admin@bankauctions.ai', pass: 'Admin@123', icon: Shield, desc: 'Executive control & approvals' },
    { role: 'Checker', email: 'checker@bankauctions.ai', pass: 'Checker@123', icon: CheckCircle2, desc: 'Exception queue & notices' },
    { role: 'Engineer', email: 'engineer@bankauctions.ai', pass: 'Engineer@123', icon: Compass, desc: 'Field inspections & GPS' }
  ];

  const handleQuickSelect = (r) => {
    setEmail(r.email);
    setPassword(r.pass);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      onClose();
      if (user.role === 'ADMIN') navigate('/admin');
      else if (user.role === 'CHECKER') navigate('/checker');
      else if (user.role === 'ENGINEER') navigate('/engineer');
      else navigate('/buyer/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Staff & Operational Portal">
      <div className="space-y-6">
        <p className="text-xs text-slate-400">
          Authorized personnel only. Access to checker audit queues, field engineer valuation modules, and administrator configuration consoles.
        </p>

        {/* Quick Credentials Pills */}
        <div className="grid grid-cols-3 gap-2">
          {quickRoles.map((r) => {
            const Icon = r.icon;
            return (
              <button
                key={r.role}
                type="button"
                onClick={() => handleQuickSelect(r)}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 hover:border-accent-cyan/60 text-left transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white group-hover:text-accent-cyan">
                  <Icon className="w-3.5 h-3.5 text-accent-cyan" />
                  {r.role}
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-1">{r.email}</div>
              </button>
            );
          })}
        </div>

        {error ? (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Staff Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. checker@bankauctions.ai"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-white text-sm focus:border-accent-cyan focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/60 text-white text-sm focus:border-accent-cyan focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full justify-center"
            >
              Sign In to Staff Workspace
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default StaffPortalModal;
