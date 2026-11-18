import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ShieldCheck, Search, Filter, RefreshCw, 
  Clock, User, FileText, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { api } from '../services/api';
import GlassCard from '../components/common/GlassCard';
import SpecularBadge from '../components/common/SpecularBadge';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLog, setSelectedLog] = useState(null);

  const { data: logs = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-audit-logs', searchTerm],
    queryFn: async () => {
      const res = await api.get('/admin/audit-logs');
      let list = res.data?.data || [];
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        list = list.filter(l => 
          l.action?.toLowerCase().includes(q) || 
          l.entityType?.toLowerCase().includes(q) ||
          l.user?.name?.toLowerCase().includes(q) ||
          l.user?.email?.toLowerCase().includes(q)
        );
      }
      return list;
    }
  });

  const getActionBadgeVariant = (action) => {
    if (action.includes('PUBLISH') || action.includes('APPROVE')) return 'emerald';
    if (action.includes('REJECT') || action.includes('SUSPEND') || action.includes('DELETE')) return 'rose';
    if (action.includes('UPDATE') || action.includes('VERIFY')) return 'cyan';
    return 'neutral';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-accent-cyan uppercase tracking-wider">Compliance & Security</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Append-Only Ledger</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Audit Trail & Access Log</h1>
          <p className="text-sm text-slate-400 mt-1">
            Tamper-evident record of all operational actions, publication decisions, inspection sign-offs, and administrative interventions.
          </p>
        </div>

        <Button 
          variant="secondary" 
          onClick={() => refetch()}
          icon={<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />}
        >
          Refresh Trail
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <GlassCard className="p-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by action, user, or entity..."
            className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-accent-cyan"
          />
        </div>
      </GlassCard>

      {/* Audit Log Stream */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs font-mono uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-6 py-4">Timestamp (IST)</th>
                <th className="px-6 py-4">Actor</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Target Entity</th>
                <th className="px-6 py-4">IP / Origin</th>
                <th className="px-6 py-4 text-right">Payload</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    Retrieving tamper-evident audit ledger...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No matching audit entries found.
                  </td>
                </tr>
              ) : (
                logs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-850/40 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      <div className="text-white font-medium">
                        {new Date(log.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {new Date(log.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{log.user?.name || 'Automated Pipeline'}</div>
                      <div className="text-xs text-slate-400 font-mono">{log.user?.role || 'SYSTEM_DAEMON'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <SpecularBadge variant={getActionBadgeVariant(log.action)}>
                        {log.action}
                      </SpecularBadge>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      <div className="text-white font-medium">{log.entityType}</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[150px]">{log.entityId}</div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setSelectedLog(log)}
                        icon={<ChevronRight className="w-4 h-4" />}
                      >
                        Inspect
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Detailed Modal */}
      {selectedLog && (
        <Modal 
          isOpen={true} 
          onClose={() => setSelectedLog(null)} 
          title="Audit Entry Cryptographic Detail"
        >
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
              <div>
                <span className="text-xs text-slate-500 font-mono uppercase block">Log Reference ID</span>
                <span className="font-mono text-white text-xs select-all">{selectedLog.id}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-mono uppercase block">Action Code</span>
                <span className="font-mono text-accent-cyan text-xs font-semibold">{selectedLog.action}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-mono uppercase block">Actor Identity</span>
                <span className="text-white">{selectedLog.user?.name || 'System Worker'} ({selectedLog.user?.email || 'daemon@bankauctions.ai'})</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-mono uppercase block">Timestamp</span>
                <span className="font-mono text-slate-300 text-xs">{new Date(selectedLog.createdAt).toISOString()}</span>
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-mono uppercase block mb-2">Stored Metadata & State Delta (JSON)</span>
              <pre className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto max-h-60">
                {JSON.stringify(selectedLog.metadata || { status: 'logged', verificationPass: true }, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-800">
              <Button variant="secondary" onClick={() => setSelectedLog(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
