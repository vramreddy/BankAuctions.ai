import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { SpecularBadge } from '../components/common/SpecularBadge';
import { FileCheck2, CheckCircle2, XCircle, Building, MapPin, ArrowRight } from 'lucide-react';
import { formatINR, formatDate } from '../utils/formatters';

export function InspectionApprovalsPage() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApprovals() {
      setLoading(true);
      try {
        const res = await api.getAdminAuctions({
          status: 'CHECKER_VERIFIED'
        });
        const res2 = await api.getAdminAuctions({
          status: 'INSPECTION_SUBMITTED'
        });
        if (res.success && res2.success) {
          setPending([...res.data, ...res2.data]);
        }
      } catch (err) {
        console.error('Failed to load approvals queue:', err);
      } finally {
        setLoading(false);
      }
    }
    loadApprovals();
  }, []);

  const handleApprove = async (id) => {
    try {
      const res = await api.publishAuction(id);
      if (res.success) {
        alert('Auction approved and published to public search!');
        setPending((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      alert(err.message || 'Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await api.unpublishAuction(id);
      if (res.success) {
        alert('Auction returned for revision.');
        setPending((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      alert(err.message || 'Rejection failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <FileCheck2 className="w-5 h-5 text-brand-cyan" />
          Administrative Final Approval Desk ({pending.length})
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Four-eyes review gate: Final authority to verify quality audit logs and civil inspection evidence before publishing to public buyer search.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : pending.length === 0 ? (
        <div className="p-16 rounded-3xl glass-card text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">All Approval Queues Clear</h3>
          <p className="text-xs text-slate-400">No properties currently waiting for final administrative sign-off.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((item) => (
            <GlassCard key={item.id} className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">
                    {item.sourceRef}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    item.status === 'INSPECTION_SUBMITTED' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-blue-500/20 text-blue-300'
                  }`}>
                    {item.status}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  Auction Date: {formatDate(item.auctionStartDate)}
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <p className="text-xs text-slate-300 mt-0.5">{item.address} · <strong className="capitalize">{item.city}</strong></p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2">
                <div className="p-3 rounded-xl bg-brand-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Secured Creditor</span>
                  <strong className="text-white text-xs">{item.bank?.name}</strong>
                </div>
                <div className="p-3 rounded-xl bg-brand-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Reserve Price</span>
                  <strong className="text-white font-mono text-xs">{formatINR(item.reservePrice)}</strong>
                </div>
                <div className="p-3 rounded-xl bg-brand-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">EMD Deposit</span>
                  <strong className="text-white font-mono text-xs">{formatINR(item.emdAmount)}</strong>
                </div>
                <div className="p-3 rounded-xl bg-brand-900/60 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Possession</span>
                  <strong className="text-emerald-400 text-xs">{item.possession}</strong>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleReject(item.id)}
                  className="text-xs"
                >
                  <XCircle className="w-3.5 h-3.5" /> Return for Revision
                </Button>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleApprove(item.id)}
                  className="text-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" /> Final Approve &amp; Publish Live
                </Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}


export default InspectionApprovalsPage;
