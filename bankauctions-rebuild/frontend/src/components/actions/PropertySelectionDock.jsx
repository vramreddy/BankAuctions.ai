import React, { useState } from 'react';
import {
  Layers,
  ArrowRight,
  X,
  FileSpreadsheet,
  Calculator,
  Building2,
  MapPin,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export default function PropertySelectionDock({ selectedLots = [], onClearSelection }) {
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [showEmdModal, setShowEmdModal] = useState(false);

  if (!selectedLots.length) return null;

  const totalReserve = selectedLots.reduce((acc, curr) => acc + (curr.reservePrice || 0), 0);
  const totalEmd = totalReserve * 0.10;

  const exportCsv = () => {
    const headers = ['Lot ID', 'Title', 'City', 'Locality', 'Bank', 'Reserve Price (INR)', 'Auction Date'];
    const rows = selectedLots.map(item => [
      `"${item.id}"`,
      `"${item.title.replace(/"/g, '""')}"`,
      `"${item.city}"`,
      `"${item.locality || ''}"`,
      `"${item.bankName || ''}"`,
      item.reservePrice || 0,
      `"${item.auctionStartDate ? new Date(item.auctionStartDate).toISOString().split('T')[0] : ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `BankAuctions_Shortlist_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Floating Dock at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-4xl">
        <div className="bg-[#0b101e]/95 backdrop-blur-xl border border-brand-cyan/40 shadow-2xl shadow-cyan-950/40 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center text-brand-cyan shrink-0">
              <Layers size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {selectedLots.length} {selectedLots.length === 1 ? 'Property' : 'Properties'} Selected
                </span>
                <span className="px-2 py-0.5 rounded-full bg-brand-cyan/20 text-brand-cyan text-[10px] font-mono">
                  Active Shortlist
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Combined Reserve: <span className="text-white font-mono font-semibold">{formatINR(totalReserve)}</span> · Total EMD: <span className="text-brand-cyan font-mono font-semibold">{formatINR(totalEmd)}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowCompareModal(true)}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
            >
              Compare ({selectedLots.length})
            </button>

            <button
              onClick={() => setShowEmdModal(true)}
              className="px-3.5 py-2 rounded-xl bg-brand-cyan/20 hover:bg-brand-cyan/30 text-xs font-semibold text-brand-cyan border border-brand-cyan/30 transition-colors flex items-center gap-1.5"
            >
              <Calculator size={14} />
              <span>Joint EMD</span>
            </button>

            <button
              onClick={exportCsv}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-1.5"
              title="Download CSV file of selected properties"
            >
              <FileSpreadsheet size={14} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>

            <button
              onClick={onClearSelection}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors ml-1"
              title="Clear selection"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Compare Modal */}
      {showCompareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-4xl rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 sticky top-0 bg-[#0b0f19] z-10">
              <div className="flex items-center gap-2">
                <Layers size={20} className="text-brand-cyan" />
                <h3 className="text-lg font-bold text-white">
                  Side-by-Side Comparison ({selectedLots.length})
                </h3>
              </div>
              <button
                onClick={() => setShowCompareModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {selectedLots.map((lot) => (
                <div key={lot.id} className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-brand-cyan block mb-1">
                      {lot.bankName || 'Bank Property'}
                    </span>
                    <h4 className="text-sm font-bold text-white mb-2 line-clamp-2">{lot.title}</h4>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mb-4">
                      <MapPin size={12} /> {lot.locality || lot.city}
                    </p>

                    <div className="space-y-2 text-xs pt-3 border-t border-white/10">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Reserve:</span>
                        <span className="text-white font-mono font-bold">{formatINR(lot.reservePrice)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">10% EMD:</span>
                        <span className="text-brand-cyan font-mono font-bold">{formatINR(lot.reservePrice * 0.10)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Auction Date:</span>
                        <span className="text-slate-300 font-mono">
                          {lot.auctionStartDate ? new Date(lot.auctionStartDate).toLocaleDateString('en-IN') : 'See Notice'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={`/lot/${lot.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 w-full py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-center text-white block transition-colors"
                  >
                    Open Lot Details
                  </a>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCompareModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 text-xs text-white"
            >
              Close Comparison
            </button>
          </div>
        </div>
      )}

      {/* Joint EMD Modal */}
      {showEmdModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-5">
            <div className="flex justify-between items-center pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Calculator size={20} className="text-brand-cyan" />
                <h3 className="text-lg font-bold text-white">Portfolio EMD Calculation</h3>
              </div>
              <button
                onClick={() => setShowEmdModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                <span className="text-slate-400">Total Properties</span>
                <span className="text-white font-mono font-bold text-sm">{selectedLots.length}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                <span className="text-slate-400">Total Reserve Value</span>
                <span className="text-white font-mono font-bold text-sm">{formatINR(totalReserve)}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-brand-cyan/15 border border-brand-cyan/30 flex justify-between items-center">
                <span className="text-slate-200">Total 10% EMD to Submit</span>
                <span className="text-brand-cyan font-mono font-bold text-base">{formatINR(totalEmd)}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 flex justify-between items-center">
                <span className="text-slate-400">Total 15% Day-of-Sale Deposit</span>
                <span className="text-slate-200 font-mono font-bold text-sm">{formatINR(totalReserve * 0.15)}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">
              Ensure separate Demand Drafts (DD) or RTGS challans are created per property, referencing the individual lot numbers and respective branch IFSC codes.
            </p>

            <button
              onClick={() => setShowEmdModal(false)}
              className="w-full py-2.5 rounded-xl bg-white/10 text-xs text-white"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}
