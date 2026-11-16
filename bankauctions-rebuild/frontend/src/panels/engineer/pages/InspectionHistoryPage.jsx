import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { GlassCard } from '../../../components/common/GlassCard';
import { History, CheckCircle2, MapPin } from 'lucide-react';
import { formatDate, formatINR } from '../../../utils/formatters';
import { Link } from 'react-router-dom';

export function InspectionHistoryPage() {
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      try {
        const res = await api.getEngineerAssignments();
        if (res.success) {
          const finished = res.data.filter((a) => a.status === 'SUBMITTED' || a.status === 'APPROVED');
          setCompleted(finished);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <History className="w-5 h-5 text-emerald-400" />
          Field Inspection History
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Historical log of physical site visits and valuation dossiers submitted by this chartered engineer.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : completed.length === 0 ? (
        <div className="p-16 rounded-3xl glass-card text-center space-y-3">
          <History className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">No Completed Inspections Recorded</h3>
          <p className="text-xs text-slate-400">Submitted inspection dossiers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {completed.map((item) => (
            <GlassCard key={item.id} className="p-5 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                    {item.auction?.sourceRef}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">
                    {item.status}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{item.auction?.title}</h4>
                <p className="text-xs text-slate-400">{item.auction?.address}</p>
              </div>

              <div className="text-right shrink-0">
                <Link
                  to={`/engineer/assignments/${item.id}`}
                  className="text-xs font-bold text-emerald-400 hover:underline block"
                >
                  View Dossier →
                </Link>
                <span className="text-[10px] text-slate-500 font-mono">
                  {formatDate(item.updatedAt || item.createdAt)}
                </span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}


export default InspectionHistoryPage;
