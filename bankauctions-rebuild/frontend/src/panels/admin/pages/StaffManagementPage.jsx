import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, UserPlus, Shield, UserCheck, HardHat, 
  Search, RefreshCw, Mail, Phone, Lock, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { api } from '../../../services/api';
import GlassCard from '../../../components/common/GlassCard';
import SpecularBadge from '../../../components/common/SpecularBadge';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';

export default function StaffManagementPage() {
  const queryClient = useQueryClient();
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CHECKER',
    phone: '',
    assignedRegion: 'Tamil Nadu'
  });

  const { data: staffList = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-staff', roleFilter, searchTerm],
    queryFn: async () => {
      const res = await api.get('/admin/staff');
      let list = res.data?.data || [];
      if (roleFilter !== 'ALL') {
        list = list.filter(u => u.role === roleFilter);
      }
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        list = list.filter(u => 
          u.name?.toLowerCase().includes(q) || 
          u.email?.toLowerCase().includes(q)
        );
      }
      return list;
    }
  });

  const createStaffMutation = useMutation({
    mutationFn: async (payload) => {
      return api.post('/admin/staff', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-staff']);
      setIsAddModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'CHECKER',
        phone: '',
        assignedRegion: 'Tamil Nadu'
      });
      setToastMessage('New staff member credentialed successfully.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  });

  const getRoleIcon = (role) => {
    switch(role) {
      case 'ADMIN': return <Shield className="w-4 h-4 text-purple-400" />;
      case 'CHECKER': return <UserCheck className="w-4 h-4 text-accent-cyan" />;
      case 'ENGINEER': return <HardHat className="w-4 h-4 text-amber-400" />;
      default: return <Users className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-accent-cyan uppercase tracking-wider">Access & Governance</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Total Staff: {staffList.length}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Internal Staff Directory</h1>
          <p className="text-sm text-slate-400 mt-1">
            Provision roles, manage verification authority, and assign operational jurisdictions for checkers and field engineers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="secondary" 
            onClick={() => refetch()}
            icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
          >
            Refresh
          </Button>
          <Button 
            variant="primary" 
            icon={<UserPlus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Staff Member
          </Button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search staff by name or email..."
              className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400">Filter Role:</span>
            {['ALL', 'CHECKER', 'ENGINEER', 'ADMIN'].map(role => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  roleFilter === role 
                    ? 'bg-accent-cyan/20 border border-accent-cyan/50 text-accent-cyan'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Staff Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Staff Member</th>
                <th className="px-6 py-4">Security Role</th>
                <th className="px-6 py-4">Assigned Jurisdiction</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Loading staff records...
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No staff members found matching the filter.
                  </td>
                </tr>
              ) : (
                staffList.map(member => (
                  <tr key={member.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                          {getRoleIcon(member.role)}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{member.name}</div>
                          <div className="text-xs text-slate-400 flex items-center gap-2">
                            <span>{member.email}</span>
                            {member.phone && <span>• {member.phone}</span>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <SpecularBadge 
                        variant={member.role === 'ADMIN' ? 'purple' : member.role === 'CHECKER' ? 'cyan' : 'amber'}
                      >
                        {member.role}
                      </SpecularBadge>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      {member.assignedRegion || 'All India (HQ)'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">
                      {new Date(member.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Add Staff Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Provision Internal Staff Account"
      >
        <form onSubmit={(e) => {
          e.preventDefault();
          createStaffMutation.mutate(formData);
        }} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Full Legal Name</label>
            <input 
              type="text" 
              required
              value={formData.name} 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Suresh Kumar"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Corporate Email</label>
              <input 
                type="email" 
                required
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="suresh@bankauctions.ai"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Mobile Contact</label>
              <input 
                type="text" 
                value={formData.phone} 
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Role Assignment</label>
              <select 
                value={formData.role} 
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
              >
                <option value="CHECKER">Data Quality Checker</option>
                <option value="ENGINEER">Valuation / Field Engineer</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Initial Password</label>
              <input 
                type="password" 
                required
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Jurisdiction / Region</label>
            <input 
              type="text" 
              value={formData.assignedRegion} 
              onChange={(e) => setFormData({...formData, assignedRegion: e.target.value})}
              placeholder="e.g. Tamil Nadu - Chennai Metro"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="secondary" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button 
              variant="primary" 
              type="submit" 
              loading={createStaffMutation.isPending}
            >
              Provision Account
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
