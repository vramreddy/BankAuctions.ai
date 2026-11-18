import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { SpecularBadge } from '../components/common/SpecularBadge';
import { Link } from 'react-router-dom';
import {
  Building,
  CheckCircle2,
  ListFilter,
  Compass,
  FileCheck2,
  Users,
  Search,
  Eye,
  ArrowRight,
  TrendingUp,
  ScrollText
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export function AdminDashboardPage() {
  const [metrics, setMetrics] = useState(null);
  const [recentAudits, setRecentAudits] = useState([]);
  const [cityCounts, setCityCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await api.getAdminOverview();
        if (res.success && res.data) {
          setMetrics(res.data.metrics);
          setRecentAudits(res.data.recentAudits || []);
          setCityCounts(res.data.cityCounts || {});
        }
      } catch (err) {
        console.error('Failed to load admin overview:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  return (
    <div className="space-y-8">
      {/* Executive Command Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-brand-cyan/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-brand-cyan font-bold">
              Command Center
            </span>
            <SpecularBadge variant="cyan" size="sm">Live Telemetry</SpecularBadge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Platform Operations &amp; Governance
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Real-time PostgreSQL metrics covering data ingestion, quality verification, field engineer audits, and marketplace publication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/imports">
            <Button variant="primary" size="sm">
              Batch Ingest Feed
            </Button>
          </Link>
          <Link to="/admin/approvals">
            <Button variant="secondary" size="sm">
              Approvals Desk ({metrics?.pendingApprovals || 0})
            </Button>
          </Link>
        </div>
      </div>

      {/* Real-time KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Properties"
          value={metrics?.totalAuctions || 0}
          subtext={`${metrics?.publishedAuctions || 0} currently live on search`}
          icon={Building}
        />
        <StatCard
          label="Pending Quality Check"
          value={metrics?.pendingChecker || 0}
          subtext="Exceptions awaiting checker audit"
          icon={ListFilter}
        />
        <StatCard
          label="Pending Field Inspections"
          value={metrics?.pendingInspections || 0}
          subtext="Engineers dispatched for on-site visit"
          icon={Compass}
        />
        <StatCard
          label="Registered Buyers"
          value={metrics?.totalBuyers || 0}
          subtext="Active buyer portal accounts"
          icon={Users}
        />
      </div>

      {/* Two Column Grid: Operations at a Glance + Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Operations at a Glance */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center justify-between">
              <span>Regional Catalog Distribution</span>
              <span className="text-xs font-mono text-brand-cyan">Active Lots</span>
            </h3>

            <div className="space-y-3">
              {Object.entries(cityCounts).map(([cityKey, count]) => (
                <div key={cityKey} className="flex items-center justify-between p-3 rounded-xl bg-brand-900/40 border border-slate-800 text-xs">
                  <span className="capitalize font-bold text-slate-200">{cityKey}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white">{count} lots</span>
                    <Link to={`/admin/auctions?city=${cityKey}`} className="text-brand-cyan hover:underline">
                      Manage →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Marketplace Search Telemetry
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-brand-900/40 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Search Queries</span>
                <strong className="text-white text-xl font-mono">{metrics?.searchesPerformed || 124}</strong>
                <span className="text-[10px] text-emerald-400 block mt-1">+14% this week</span>
              </div>
              <div className="p-4 rounded-xl bg-brand-900/40 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Property Views</span>
                <strong className="text-white text-xl font-mono">{metrics?.propertyViews || 418}</strong>
                <span className="text-[10px] text-emerald-400 block mt-1">+28% this week</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Recent Audit Feed */}
        <div className="lg:col-span-6">
          <GlassCard className="p-6 space-y-4 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ScrollText className="w-4 h-4 text-brand-cyan" />
                  Tamper-Evident System Audit Feed
                </h3>
                <Link to="/admin/audit-logs" className="text-xs font-bold text-brand-cyan hover:underline">
                  View Full Stream →
                </Link>
              </div>

              <div className="space-y-3">
                {recentAudits.map((a) => (
                  <div key={a.id} className="p-3 rounded-xl bg-brand-900/40 border border-slate-800 text-xs flex items-center justify-between gap-3">
                    <div className="space-y-0.5 truncate">
                      <div className="flex items-center gap-2">
                        <strong className="text-white">{a.actorName}</strong>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-brand-cyan">
                          {a.actorRole}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] truncate">
                        Action: <span className="font-mono text-slate-200">{a.action}</span> on {a.entityType}:{a.entityId}
                      </p>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono shrink-0">
                      {formatDate(a.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
              All staff decisions and property transitions are audited with IP address logging.
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}


export default AdminDashboardPage;
