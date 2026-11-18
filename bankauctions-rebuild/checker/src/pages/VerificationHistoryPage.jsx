import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { History, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/formatters';

export function VerificationHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      try {
        const res = await api.getCheckerHistory();
        if (res.success) setHistory(res.data);
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-brand-cyan" />
          Audit &amp; Verification History
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Historical log of exception notices verified, corrected, or rejected by this quality desk.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : history.length === 0 ? (
        <div className="p-16 rounded-3xl glass-card text-center space-y-3">
          <History className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Audited Notices Recorded</h3>
          <p className="text-xs text-slate-400">Notices you verify in the queue will appear here in the audit log.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((rev) => (
            <GlassCard key={rev.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    rev.decision === 'VERIFIED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {rev.decision}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Lot: {rev.auctionId}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium">{rev.correctionNotes}</p>
              </div>
              <span className="text-[11px] text-slate-400 font-mono shrink-0">
                {formatDate(rev.createdAt)}
              </span>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}


export default VerificationHistoryPage;
