import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { SpecularBadge } from '../components/common/SpecularBadge';
import { CheckCircle2, AlertTriangle, Clock, ListFilter, ArrowRight } from 'lucide-react';

export function CheckerDashboardPage() {
  const [queueCount, setQueueCount] = useState(0);
  const [historyCount, setHistoryCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const [qRes, hRes] = await Promise.all([
          api.getCheckerQueue(),
          api.getCheckerHistory()
        ]);
        if (qRes.success) setQueueCount(qRes.count);
        if (hRes.success) setHistoryCount(hRes.data.length);
      } catch (err) {
        console.error('Failed to load checker stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-brand-cyan/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-brand-cyan font-bold">
              Quality Gatekeeper
            </span>
            <SpecularBadge variant="cyan" size="sm">Active Session</SpecularBadge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Exception Verification Queue
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            The automated Maker pipeline ingests public bank auction notices. High-confidence listings pass through; ambiguous or obscured notices arrive here for mandatory human audit.
          </p>
        </div>

        <Link to="/checker/queue">
          <Button variant="primary" size="lg" className="flex items-center gap-2">
            Start Next in Queue <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          label="Pending Exception Lots"
          value={queueCount}
          subtext="Awaiting side-by-side human audit"
          icon={ListFilter}
        />
        <StatCard
          label="Audited by Quality Team"
          value={historyCount}
          subtext="Verified and routed to Admin desk"
          icon={CheckCircle2}
        />
        <StatCard
          label="Maker Ingestion Stream"
          value="75% / 25%"
          subtext="75% High Confidence · 25% Quality Gate"
          icon={AlertTriangle}
        />
      </div>

      {/* Workflow Guidance Card */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-brand-cyan" />
          Verification Operating Procedures
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-brand-900/40 border border-slate-800 space-y-1">
            <strong className="text-white block font-bold">1. Compare Source Notice</strong>
            <p className="text-slate-400">Inspect the original scanned image or PDF next to extracted JSON fields for any bank stamp obstructions.</p>
          </div>
          <div className="p-4 rounded-xl bg-brand-900/40 border border-slate-800 space-y-1">
            <strong className="text-white block font-bold">2. Correct Numbers Exactly</strong>
            <p className="text-slate-400">Verify Reserve Price, EMD, and Auction Date. Never extrapolate missing values without source notice grounding.</p>
          </div>
          <div className="p-4 rounded-xl bg-brand-900/40 border border-slate-800 space-y-1">
            <strong className="text-white block font-bold">3. Submit to Admin Review</strong>
            <p className="text-slate-400">Verified lots move to the Admin review desk. Checkers cannot publish directly to live buyer search.</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}


export default CheckerDashboardPage;
