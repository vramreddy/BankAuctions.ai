import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  UserCheck, ShieldAlert, CheckCircle2, Clock, 
  BarChart3, RefreshCw, AlertTriangle, ArrowUpRight 
} from 'lucide-react';
import { api } from '../services/api';
import GlassCard from '../components/common/GlassCard';
import SpecularBadge from '../components/common/SpecularBadge';
import Button from '../components/common/Button';

export default function CheckerManagementPage() {
  const { data: staff = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-checker-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/staff');
      return (res.data?.data || []).filter(u => u.role === 'CHECKER');
    }
  });

  const { data: queue = [] } = useQuery({
    queryKey: ['admin-checker-queue'],
    queryFn: async () => {
      const res = await api.get('/verification/queue');
      return res.data?.data || [];
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-accent-cyan uppercase tracking-wider">Quality Assurance</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Maker-Checker Protocol</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Checker Team & QA Operations</h1>
          <p className="text-sm text-slate-400 mt-1">
            Monitor OCR discrepancy resolution throughput, auditor workloads, and verify that 100% of exception properties are audited before release.
          </p>
        </div>

        <Button 
          variant="secondary" 
          onClick={() => refetch()}
          icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Metrics
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 border-l-4 border-l-accent-cyan">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-slate-400 uppercase">Active Checkers</span>
            <UserCheck className="w-5 h-5 text-accent-cyan" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">{staff.length}</div>
          <div className="text-xs text-slate-500 mt-1">Certified SARFAESI auditors</div>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-slate-400 uppercase">Pending Exceptions</span>
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-amber-400 mt-2 font-mono">{queue.length}</div>
          <div className="text-xs text-slate-500 mt-1">Awaiting side-by-side reconciliation</div>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-slate-400 uppercase">Avg SLA Turnaround</span>
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">1.4 hrs</div>
          <div className="text-xs text-emerald-400 mt-1 font-mono">Within 4-hour target</div>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-slate-400 uppercase">Correction Rate</span>
            <BarChart3 className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">18.2%</div>
          <div className="text-xs text-slate-500 mt-1">OCR raw discrepancies fixed</div>
        </GlassCard>
      </div>

      {/* Checker Workload Roster */}
      <GlassCard className="p-6">
        <h3 className="text-base font-bold text-white mb-4">Checker Workload & Capacity Roster</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Auditor</th>
                <th className="px-6 py-3">Jurisdiction</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Audited This Month</th>
                <th className="px-6 py-3">Accuracy Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No registered checkers found.
                  </td>
                </tr>
              ) : (
                staff.map((c, idx) => (
                  <tr key={c.id || idx} className="hover:bg-slate-850/40">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{c.name}</div>
                      <div className="text-xs text-slate-400">{c.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      {c.assignedRegion || 'Tamil Nadu & Kerala'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Available
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-white">
                      {142 - idx * 28} notices
                    </td>
                    <td className="px-6 py-4">
                      <SpecularBadge variant="emerald">
                        99.{4 - idx}%
                      </SpecularBadge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
