import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { GlassCard } from '../../../components/common/GlassCard';
import { Button } from '../../../components/common/Button';
import { SpecularBadge } from '../../../components/common/SpecularBadge';
import { Search, AlertCircle, CheckCircle2, ArrowRight, ShieldAlert, Lock } from 'lucide-react';
import { formatINR } from '../../../utils/formatters';

export function VerificationQueuePage() {
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchQueue() {
      setLoading(true);
      try {
        const res = await api.getCheckerQueue({
          city: cityFilter || undefined,
          search: search || undefined
        });
        if (res.success) setQueue(res.data);
      } catch (err) {
        console.error('Failed to load queue:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchQueue();
  }, [cityFilter, search]);

  const handleClaimAndReview = async (lotId) => {
    try {
      await api.claimLot(lotId);
      navigate(`/checker/reviews/${lotId}`);
    } catch (err) {
      alert(err.message || 'Failed to claim notice');
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            Exception Verification Work Queue ({queue.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Nothing in this queue appears in customer search until verified by a quality checker and approved by an administrator.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs text-white"
          >
            <option value="" className="bg-brand-950">All Cities</option>
            <option value="chennai" className="bg-brand-950">Chennai</option>
            <option value="hyderabad" className="bg-brand-950">Hyderabad</option>
            <option value="bengaluru" className="bg-brand-950">Bengaluru</option>
            <option value="coimbatore" className="bg-brand-950">Coimbatore</option>
            <option value="kerala" className="bg-brand-950">Kerala</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference..."
              className="pl-8 pr-3 py-2 rounded-xl glass-input text-xs text-white w-44"
            />
          </div>
        </div>
      </div>

      {/* Queue Data Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : queue.length === 0 ? (
        <div className="p-16 rounded-3xl glass-card text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">Exception Queue Clear</h3>
          <p className="text-xs text-slate-400">All imported notices for this region have been verified.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-900/60 border-b border-slate-800 uppercase tracking-wider font-mono text-[10px] text-slate-400">
              <tr>
                <th className="p-4">Source Ref</th>
                <th className="p-4">Property &amp; Location</th>
                <th className="p-4">Secured Creditor</th>
                <th className="p-4">Flag Reason (Audit Trigger)</th>
                <th className="p-4">Extracted Reserve</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {queue.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-cyan">
                    {item.sourceRef}
                  </td>
                  <td className="p-4">
                    <strong className="text-white block">{item.shortTitle || item.title}</strong>
                    <span className="text-slate-400 text-[11px] capitalize">{item.locality}, {item.city}</span>
                  </td>
                  <td className="p-4 font-medium text-slate-300">
                    {item.bank?.name}
                  </td>
                  <td className="p-4 max-w-xs">
                    <div className="flex items-center gap-1.5 text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-lg">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{item.attributes?.attributes?.flag_reason || 'Low extraction confidence'}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {item.reservePrice ? formatINR(item.reservePrice) : <span className="text-rose-400">Obscured</span>}
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleClaimAndReview(item.id)}
                      className="text-xs"
                    >
                      Audit Notice <ArrowRight className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


export default VerificationQueuePage;
