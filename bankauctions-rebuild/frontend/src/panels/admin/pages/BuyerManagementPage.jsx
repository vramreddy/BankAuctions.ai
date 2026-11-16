import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, Search, Shield, Gift, AlertCircle, CheckCircle2, 
  Ban, RefreshCw, Eye, Sparkles, Filter 
} from 'lucide-react';
import { api } from '../../../services/api';
import GlassCard from '../../../components/common/GlassCard';
import SpecularBadge from '../../../components/common/SpecularBadge';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';

export default function BuyerManagementPage() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [tierFilter, setTierFilter] = useState('ALL');
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [giftCredits, setGiftCredits] = useState(5);
  const [giftReason, setGiftReason] = useState('Promotional incentive');
  const [toastMessage, setToastMessage] = useState(null);

  const { data: buyers = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-buyers', searchTerm, tierFilter],
    queryFn: async () => {
      const res = await api.get('/admin/buyers');
      let list = res.data?.data || [];
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        list = list.filter(b => 
          b.name?.toLowerCase().includes(q) || 
          b.email?.toLowerCase().includes(q) || 
          b.phone?.includes(q)
        );
      }
      if (tierFilter !== 'ALL') {
        list = list.filter(b => b.membershipTier === tierFilter);
      }
      return list;
    }
  });

  const giftMutation = useMutation({
    mutationFn: async ({ buyerId, amount, reason }) => {
      return api.post(`/admin/buyers/${buyerId}/gift-unlocks`, { amount, reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-buyers']);
      setSelectedBuyer(null);
      setToastMessage('Credits successfully credited to buyer account.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ buyerId, active }) => {
      return api.patch(`/admin/buyers/${buyerId}/status`, { active });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-buyers']);
      setToastMessage('Buyer status updated successfully.');
      setTimeout(() => setToastMessage(null), 4000);
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-accent-cyan uppercase tracking-wider">Customer Management</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Total Accounts: {buyers.length}</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Buyer Directory & Entitlements</h1>
          <p className="text-sm text-slate-400 mt-1">
            Oversee investor accounts, grant property unlock credits, review search subscriptions, and enforce platform security policies.
          </p>
        </div>

        <Button 
          variant="secondary" 
          onClick={() => refetch()}
          icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Directory
        </Button>
      </div>

      {toastMessage && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <GlassCard className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or mobile..."
              className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-xs text-slate-400">Plan:</span>
            {['ALL', 'FREE', 'PRO', 'ENTERPRISE'].map(tier => (
              <button
                key={tier}
                onClick={() => setTierFilter(tier)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  tierFilter === tier 
                    ? 'bg-accent-cyan/20 border border-accent-cyan/50 text-accent-cyan'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white border border-transparent'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Buyers Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Buyer Identity</th>
                <th className="px-6 py-4">Membership Plan</th>
                <th className="px-6 py-4">Unlock Balance</th>
                <th className="px-6 py-4">Saved Lots</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    Loading buyer profiles from database...
                  </td>
                </tr>
              ) : buyers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No buyer accounts found matching the criteria.
                  </td>
                </tr>
              ) : (
                buyers.map(buyer => (
                  <tr key={buyer.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-accent-cyan/20 border border-accent-cyan/30 flex items-center justify-center font-bold text-accent-cyan">
                          {buyer.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{buyer.name}</div>
                          <div className="text-xs text-slate-400">{buyer.email}</div>
                          {buyer.phone && (
                            <div className="text-xs font-mono text-slate-500">{buyer.phone}</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <SpecularBadge 
                        variant={buyer.membershipTier === 'ENTERPRISE' ? 'amber' : buyer.membershipTier === 'PRO' ? 'cyan' : 'neutral'}
                      >
                        {buyer.membershipTier || 'FREE'}
                      </SpecularBadge>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold text-white">
                      <span className="text-accent-cyan">{buyer.remainingUnlocks || 0}</span>
                      <span className="text-xs text-slate-500 ml-1">credits</span>
                    </td>
                    <td className="px-6 py-4 font-mono text-slate-400">
                      {buyer._count?.savedProperties || buyer.savedCount || 0} lots
                    </td>
                    <td className="px-6 py-4">
                      {buyer.active !== false ? (
                        <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-rose-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                          Suspended
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          icon={<Gift className="w-3.5 h-3.5 text-amber-400" />}
                          onClick={() => setSelectedBuyer(buyer)}
                        >
                          Gift
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={buyer.active !== false ? "text-rose-400 hover:text-rose-300" : "text-emerald-400 hover:text-emerald-300"}
                          onClick={() => toggleStatusMutation.mutate({ buyerId: buyer.id, active: buyer.active === false })}
                        >
                          {buyer.active !== false ? 'Suspend' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Gift Credits Modal */}
      {selectedBuyer && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedBuyer(null)} 
          title="Grant Unlock Credits"
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              Grant additional property detail unlocks to <strong className="text-white">{selectedBuyer.name}</strong> ({selectedBuyer.email}).
            </p>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Number of Credits</label>
              <input 
                type="number" 
                min="1" 
                max="100"
                value={giftCredits} 
                onChange={(e) => setGiftCredits(parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Administrative Note / Reason</label>
              <input 
                type="text" 
                value={giftReason} 
                onChange={(e) => setGiftReason(e.target.value)}
                placeholder="e.g., VIP onboarding, customer support credit"
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button variant="secondary" onClick={() => setSelectedBuyer(null)}>Cancel</Button>
              <Button 
                variant="primary" 
                icon={<Sparkles className="w-4 h-4" />}
                loading={giftMutation.isPending}
                onClick={() => giftMutation.mutate({ 
                  buyerId: selectedBuyer.id, 
                  amount: giftCredits, 
                  reason: giftReason 
                })}
              >
                Confirm Grant
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
