import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { GlassCard } from '../../../components/common/GlassCard';
import { Button } from '../../../components/common/Button';
import { SpecularBadge } from '../../../components/common/SpecularBadge';
import { Modal } from '../../../components/common/Modal';
import { Building, Filter, CheckCircle2, Eye, Ban, Send, UserCheck } from 'lucide-react';
import { formatINR, formatDate } from '../../../utils/formatters';
import { Link } from 'react-router-dom';

export function AuctionManagementPage() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');

  // Dispatch Engineer Modal
  const [dispatchModalOpen, setDispatchModalOpen] = useState(false);
  const [selectedAuctionId, setSelectedAuctionId] = useState(null);
  const [engineers, setEngineers] = useState([]);
  const [selectedEngineerId, setSelectedEngineerId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [dispatching, setDispatching] = useState(false);

  useEffect(() => {
    async function loadAuctions() {
      setLoading(true);
      try {
        const res = await api.getAdminAuctions({
          status: statusFilter || undefined,
          city: cityFilter || undefined
        });
        if (res.success) setAuctions(res.data);
      } catch (err) {
        console.error('Failed to load admin auctions:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAuctions();
  }, [statusFilter, cityFilter]);

  const handlePublish = async (id) => {
    try {
      const res = await api.publishAuction(id);
      if (res.success) {
        setAuctions((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'PUBLISHED' } : a))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to publish lot');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      const res = await api.unpublishAuction(id);
      if (res.success) {
        setAuctions((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: 'ARCHIVED' } : a))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to unpublish lot');
    }
  };

  const handleOpenDispatch = async (id) => {
    setSelectedAuctionId(id);
    try {
      const res = await api.getUsers('ENGINEER');
      if (res.success) {
        setEngineers(res.data);
        if (res.data[0]) setSelectedEngineerId(res.data[0].id);
      }
      setScheduledDate(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
      setDispatchModalOpen(true);
    } catch (err) {
      alert(err.message || 'Failed to load staff list');
    }
  };

  const handleConfirmDispatch = async (e) => {
    e.preventDefault();
    if (!selectedAuctionId || !selectedEngineerId) return;
    setDispatching(true);
    try {
      const res = await api.assignEngineer({
        auctionId: selectedAuctionId,
        engineerId: selectedEngineerId,
        scheduledDate
      });
      if (res.success) {
        setAuctions((prev) =>
          prev.map((a) => (a.id === selectedAuctionId ? { ...a, status: 'ENGINEER_ASSIGNED' } : a))
        );
        setDispatchModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to dispatch engineer');
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Building className="w-5 h-5 text-brand-cyan" />
            Auction Inventory Management ({auctions.length})
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full lifecycle control across all imported, verified, inspected, and published auction lots.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl glass-input text-xs text-white"
          >
            <option value="" className="bg-brand-950">All Workflow Statuses</option>
            <option value="PUBLISHED" className="bg-brand-950">PUBLISHED (Live)</option>
            <option value="CHECKER_VERIFIED" className="bg-brand-950">CHECKER_VERIFIED</option>
            <option value="INSPECTION_SUBMITTED" className="bg-brand-950">INSPECTION_SUBMITTED</option>
            <option value="PENDING_CHECKER" className="bg-brand-950">PENDING_CHECKER</option>
            <option value="ENGINEER_ASSIGNED" className="bg-brand-950">ENGINEER_ASSIGNED</option>
            <option value="ARCHIVED" className="bg-brand-950">ARCHIVED</option>
          </select>

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
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : auctions.length === 0 ? (
        <div className="p-16 rounded-3xl glass-card text-center text-xs text-slate-400">
          No auction listings match this filter criteria.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl glass-panel border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-brand-900/60 border-b border-slate-800 uppercase tracking-wider font-mono text-[10px] text-slate-400">
              <tr>
                <th className="p-4">Ref</th>
                <th className="p-4">Title &amp; Locality</th>
                <th className="p-4">Bank</th>
                <th className="p-4">Reserve Price</th>
                <th className="p-4">Auction Date</th>
                <th className="p-4">Lifecycle Status</th>
                <th className="p-4 text-right">Admin Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {auctions.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono font-bold text-brand-cyan">
                    {item.sourceRef}
                  </td>
                  <td className="p-4">
                    <strong className="text-white block">{item.shortTitle || item.title}</strong>
                    <span className="text-slate-400 text-[11px] capitalize">{item.locality}, {item.city}</span>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">
                    {item.bank?.name}
                  </td>
                  <td className="p-4 font-mono font-bold text-white">
                    {formatINR(item.reservePrice)}
                  </td>
                  <td className="p-4 text-slate-300 font-mono">
                    {formatDate(item.auctionStartDate)}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                      item.status === 'PUBLISHED'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : item.status.includes('CHECKER')
                        ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        : item.status.includes('ENGINEER') || item.status.includes('INSPECTION')
                        ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {item.status !== 'PUBLISHED' ? (
                      <Button variant="primary" size="sm" onClick={() => handlePublish(item.id)} className="text-xs">
                        Publish
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleUnpublish(item.id)} className="text-xs text-rose-400 border-rose-500/30">
                        Unpublish
                      </Button>
                    )}

                    <Button variant="secondary" size="sm" onClick={() => handleOpenDispatch(item.id)} className="text-xs">
                      Dispatch Engineer
                    </Button>

                    <Link to={`/property/${item.id}`} target="_blank">
                      <Button variant="outline" size="sm" className="text-xs">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Dispatch Engineer Modal */}
      <Modal isOpen={dispatchModalOpen} onClose={() => setDispatchModalOpen(false)} title="Dispatch Field Engineer for Physical Site Audit">
        <form onSubmit={handleConfirmDispatch} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-300 block mb-1">Select Empanelled Field Engineer</label>
            <select
              value={selectedEngineerId}
              onChange={(e) => setSelectedEngineerId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-white"
            >
              {engineers.map((eng) => (
                <option key={eng.id} value={eng.id} className="bg-brand-950">
                  {eng.fullName} ({eng.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1">Target Inspection Date</label>
            <input
              type="date"
              required
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setDispatchModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" loading={dispatching} type="submit">Confirm Dispatch</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


export default AuctionManagementPage;
