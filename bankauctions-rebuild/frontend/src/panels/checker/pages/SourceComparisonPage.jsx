import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { GlassCard } from '../../../components/common/GlassCard';
import { Button } from '../../../components/common/Button';
import { SpecularBadge } from '../../../components/common/SpecularBadge';
import {
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileText,
  ShieldCheck,
  Eye,
  ZoomIn
} from 'lucide-react';
import { formatINR } from '../../../utils/formatters';

export function SourceComparisonPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Editable Form Fields
  const [reservePrice, setReservePrice] = useState('');
  const [emdAmount, setEmdAmount] = useState('');
  const [auctionDate, setAuctionDate] = useState('');
  const [possession, setPossession] = useState('Symbolic possession');
  const [correctionNotes, setCorrectionNotes] = useState('');

  useEffect(() => {
    async function loadNotice() {
      setLoading(true);
      try {
        const res = await api.getReviewDetails(id);
        if (res.success && res.data) {
          const a = res.data;
          setAuction(a);
          setReservePrice(a.reservePrice || '');
          setEmdAmount(a.emdAmount || '');
          setAuctionDate(a.auctionStartDate ? a.auctionStartDate.slice(0, 10) : '');
          setPossession(a.possession || 'Symbolic possession');
        }
      } catch (err) {
        console.error('Failed to load review details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadNotice();
  }, [id]);

  const handleSubmitDecision = async (decision) => {
    setSubmitting(true);
    try {
      const payload = {
        decision,
        correctionNotes: correctionNotes || `Quality audit decision: ${decision}`,
        corrections: {
          reservePrice: Number(reservePrice),
          emdAmount: Number(emdAmount),
          auctionStartDate: auctionDate,
          possession
        }
      };

      const res = await api.submitReview(id, payload);
      if (res.success) {
        alert(`Notice verified successfully with decision: ${decision}. Moved to Admin Review Desk.`);
        navigate('/checker/queue');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-xs text-slate-400">
        Loading side-by-side audit workspace...
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="py-16 text-center text-xs text-slate-400">
        Notice not found or already verified.
      </div>
    );
  }

  const maker = auction.attributes?.makerExtraction || {};
  const flagReason = auction.attributes?.attributes?.flag_reason;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link to="/checker/queue" className="text-xs font-semibold text-slate-400 hover:text-brand-cyan flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Exception Queue
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-cyan/20 text-brand-cyan">
            REF: {auction.sourceRef}
          </span>
          <SpecularBadge variant="amber" size="sm">
            Auditing Quality Exception
          </SpecularBadge>
        </div>
      </div>

      {/* Flag Notice Warning */}
      {flagReason && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <strong className="block font-bold">Maker Pipeline Flag Reason:</strong>
            <span>{flagReason}</span>
          </div>
        </div>
      )}

      {/* 2-Column Side-by-Side Review Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side (6): Original Scanned Notice Document */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard className="p-4 sm:p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3 text-xs">
                <span className="font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-brand-cyan" /> Original Scanned Notice Document
                </span>
                <span className="font-mono text-slate-400">Page 1 of 1</span>
              </div>

              {/* Simulated Notice Preview */}
              <div className="aspect-[3/4] bg-slate-900 rounded-2xl border border-slate-700/80 p-5 overflow-y-auto space-y-3 font-mono text-[11px] leading-relaxed text-slate-300 relative shadow-inner">
                {/* Bank Header Stamp */}
                <div className="text-center pb-3 border-b border-slate-700">
                  <h4 className="font-bold text-sm text-white uppercase tracking-wider">{auction.bank?.name}</h4>
                  <p className="text-[10px] text-slate-400">SARFAESI ACT 2002 · RULE 8(6) SALE NOTICE FOR SALE OF IMMOVABLE PROPERTY</p>
                </div>

                <p>
                  Notice is hereby given to the public in general that the below described immovable asset mortgaged to the Secured Creditor, the physical/constructive possession of which has been taken by the Authorised Officer of <strong>{auction.bank?.name}</strong>, will be sold on "As is where is", "As is what is", and "Whatever there is" basis.
                </p>

                <div className="p-3 bg-brand-950/80 rounded-xl border border-slate-700/60 space-y-1">
                  <div><strong>Description:</strong> {auction.title}</div>
                  <div><strong>Location:</strong> {auction.address}</div>
                  <div><strong>Survey / RS No:</strong> {auction.attributes?.attributes?.survey_number || '221/3B'}</div>
                </div>

                <div className="p-3 bg-brand-950/80 rounded-xl border border-amber-500/40 relative space-y-1">
                  <div className="text-amber-400 font-bold text-[10px] uppercase">Lender Auction Terms:</div>
                  <div><strong>Reserve Price:</strong> ₹{reservePrice || '8,750,000'} (Rupees Eighty Seven Lakh Fifty Thousand only)</div>
                  <div><strong>EMD Amount (10%):</strong> ₹{emdAmount || '875,000'}</div>
                  <div><strong>Auction Date:</strong> {auctionDate || '2026-12-04'} between 11:00 AM to 4:00 PM</div>
                </div>

                <div className="pt-2 text-[10px] text-slate-400">
                  Authorised Officer: <strong>{auction.contactOfficerName || 'Authorised Officer'}</strong> · Contact: <strong>{auction.contactOfficerPhone || '044 2499 4423'}</strong>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Ground truth matches lender paper publication</span>
              <button onClick={() => alert('Viewing high-res scan at full zoom')} className="text-brand-cyan hover:underline font-bold flex items-center gap-1">
                <ZoomIn className="w-3.5 h-3.5" /> Open Full Resolution
              </button>
            </div>
          </GlassCard>
        </div>

        {/* Right Side (6): Extracted Field Corrections */}
        <div className="lg:col-span-6 space-y-4">
          <GlassCard className="p-5 sm:p-6 space-y-5">
            <div className="pb-3 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Extracted Data Quality Audit
              </h3>
              <span className="text-[10px] text-slate-400">Edit fields to resolve discrepancies</span>
            </div>

            <div className="space-y-4">
              {/* Reserve Price Field with Confidence Indicator */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Reserve Price (INR)
                  </label>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Maker: {maker.reserve_price?.status || 'low'} ({maker.reserve_price?.confidence || 0}%)
                  </span>
                </div>
                <input
                  type="number"
                  value={reservePrice}
                  onChange={(e) => setReservePrice(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono text-white"
                />
              </div>

              {/* EMD Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    EMD Amount (10%)
                  </label>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Maker: {maker.emd_amount?.status || 'low'} ({maker.emd_amount?.confidence || 0}%)
                  </span>
                </div>
                <input
                  type="number"
                  value={emdAmount}
                  onChange={(e) => setEmdAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm font-mono text-white"
                />
              </div>

              {/* Auction Date Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Auction Sale Date
                  </label>
                  <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Confidence: 90%
                  </span>
                </div>
                <input
                  type="date"
                  value={auctionDate}
                  onChange={(e) => setAuctionDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                />
              </div>

              {/* Possession Dropdown */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Possession Status
                </label>
                <select
                  value={possession}
                  onChange={(e) => setPossession(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-sm text-white"
                >
                  <option value="Physical possession" className="bg-brand-950">Physical possession</option>
                  <option value="Symbolic possession" className="bg-brand-950">Symbolic possession</option>
                  <option value="Constructive possession" className="bg-brand-950">Constructive possession</option>
                </select>
              </div>

              {/* Quality Audit Notes */}
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Checker Audit &amp; Correction Notes
                </label>
                <textarea
                  value={correctionNotes}
                  onChange={(e) => setCorrectionNotes(e.target.value)}
                  placeholder="Notes explaining your corrections (e.g. Obscured reserve price verified against lender text schedule)"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white"
                />
              </div>
            </div>

            {/* Decision Submission Buttons */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <Button
                variant="primary"
                loading={submitting}
                onClick={() => handleSubmitDecision('VERIFIED')}
                className="w-full py-3 text-xs"
              >
                <CheckCircle2 className="w-4 h-4" /> Verify Data &amp; Submit to Admin Desk
              </Button>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={submitting}
                  onClick={() => handleSubmitDecision('NEEDS_CORRECTION')}
                  className="text-xs text-amber-300 border-amber-500/30"
                >
                  <AlertTriangle className="w-3.5 h-3.5" /> Re-Scan Notice
                </Button>

                <Button
                  variant="danger"
                  size="sm"
                  disabled={submitting}
                  onClick={() => handleSubmitDecision('REJECTED')}
                  className="text-xs"
                >
                  <XCircle className="w-3.5 h-3.5" /> Reject Notice
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}


export default SourceComparisonPage;
