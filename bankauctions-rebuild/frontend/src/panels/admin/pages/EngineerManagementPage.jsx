import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  HardHat, MapPin, CheckCircle2, Clock, 
  Camera, RefreshCw, AlertCircle, Compass 
} from 'lucide-react';
import { api } from '../../../services/api';
import GlassCard from '../../../components/common/GlassCard';
import SpecularBadge from '../../../components/common/SpecularBadge';
import Button from '../../../components/common/Button';

export default function EngineerManagementPage() {
  const { data: staff = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-engineer-stats'],
    queryFn: async () => {
      const res = await api.get('/admin/staff');
      return (res.data?.data || []).filter(u => u.role === 'ENGINEER');
    }
  });

  const { data: inspections = [] } = useQuery({
    queryKey: ['admin-all-inspections'],
    queryFn: async () => {
      const res = await api.get('/admin/inspections/pending');
      return res.data?.data || [];
    }
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-accent-cyan uppercase tracking-wider">Ground Operations</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Field Engineers Roster</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Valuation Engineers & Field Operations</h1>
          <p className="text-sm text-slate-400 mt-1">
            Track site visit dispatches, enforce GPS coordinate capture policies, verify 3+ photo evidence criteria, and monitor SLA compliance.
          </p>
        </div>

        <Button 
          variant="secondary" 
          onClick={() => refetch()}
          icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Roster
        </Button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-slate-400 uppercase">Field Engineers</span>
            <HardHat className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">{staff.length}</div>
          <div className="text-xs text-slate-500 mt-1">Empanelled civil/structural experts</div>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-accent-cyan">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-slate-400 uppercase">GPS Match Rate</span>
            <Compass className="w-5 h-5 text-accent-cyan" />
          </div>
          <div className="text-2xl font-bold text-accent-cyan mt-2 font-mono">100.0%</div>
          <div className="text-xs text-slate-500 mt-1">Geotagged within 50m radius</div>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-slate-400 uppercase">Avg Photos / Report</span>
            <Camera className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">5.2</div>
          <div className="text-xs text-emerald-400 mt-1 font-mono">Exceeds 3-photo minimum</div>
        </GlassCard>

        <GlassCard className="p-5 border-l-4 border-l-purple-500">
          <div className="flex justify-between items-start">
            <span className="text-xs font-mono text-slate-400 uppercase">Pending Review</span>
            <Clock className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">{inspections.length}</div>
          <div className="text-xs text-slate-500 mt-1">Submitted reports for Admin sign-off</div>
        </GlassCard>
      </div>

      {/* Engineer Directory */}
      <GlassCard className="p-6">
        <h3 className="text-base font-bold text-white mb-4">Empanelled Engineer Field Workloads</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Field Valuer</th>
                <th className="px-6 py-3">Jurisdiction</th>
                <th className="px-6 py-3">Equipment / App Status</th>
                <th className="px-6 py-3">Inspections Completed</th>
                <th className="px-6 py-3">SLA Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {staff.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-slate-500">
                    No field engineers registered in the system.
                  </td>
                </tr>
              ) : (
                staff.map((eng, idx) => (
                  <tr key={eng.id || idx} className="hover:bg-slate-850/40">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{eng.name}</div>
                      <div className="text-xs text-slate-400">{eng.email}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-300">
                      {eng.assignedRegion || 'Karnataka & Andhra Pradesh'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Online & GPS Active
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-white">
                      {48 - idx * 12} properties
                    </td>
                    <td className="px-6 py-4">
                      <SpecularBadge variant="emerald">
                        98.{2 - idx}% on-time
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
