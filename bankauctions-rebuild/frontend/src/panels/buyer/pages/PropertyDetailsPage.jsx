import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { useAuth } from '../../../contexts/AuthContext';
import { formatINR, formatDate, getDaysRemaining } from '../../../utils/formatters';
import { Button } from '../../../components/common/Button';
import { GlassCard } from '../../../components/common/GlassCard';
import { SpecularBadge } from '../../../components/common/SpecularBadge';
import { Modal } from '../../../components/common/Modal';
import {
  ArrowLeft,
  Heart,
  Share2,
  Lock,
  Unlock,
  ShieldCheck,
  Building,
  Calendar,
  Clock,
  Compass,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Phone,
  Sparkles
} from 'lucide-react';
import { PROTOTYPE_DATA } from '../../../data/prototypeData';

export function PropertyDetailsPage() {
  const { id } = useParams();
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [userState, setUserState] = useState({ isUnlocked: false, isSaved: false });
  const [loading, setLoading] = useState(true);
  const [unlockModalOpen, setUnlockModalOpen] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  useEffect(() => {
    async function loadAuction() {
      setLoading(true);
      try {
        const res = await api.getAuctionById(id);
        if (res && res.success && res.data) {
          setAuction(res.data);
          if (res.userState) setUserState(res.userState);
          return;
        }
      } catch (err) {
        console.warn('API auction lookup fallback to prototype catalogue:', err.message);
      }

      // Check prototype catalogue fallback
      const proto = PROTOTYPE_DATA.properties?.find((p) => p.id === id);
      if (proto) {
        const mappedAuction = {
          id: proto.id,
          title: proto.title,
          propertyType: (proto.cat || 'FLAT').toUpperCase(),
          city: proto.city,
          locality: proto.loc,
          address: `${proto.title}, ${proto.loc}, ${proto.city.toUpperCase()}`,
          reservePrice: proto.reserve * 100000,
          estimatedMarketValue: proto.guide * 100000,
          emdAmount: proto.emd * 100000,
          discountPercentage: proto.disc,
          possessionType: proto.poss.includes('Physical') ? 'PHYSICAL' : 'SYMBOLIC',
          bankName: proto.bank,
          branchName: `${proto.loc} Special Asset Recovery Branch`,
          auctionStartDate: new Date(Date.now() + (proto.days || 3) * 86400000).toISOString(),
          aiRankScore: proto.score,
          aiRank: proto.rank,
          primaryImageUrl: `/img/${proto.img}`,
          additionalImages: [`/img/${proto.img}`, '/img/living.jpg', '/img/stairs.jpg', '/img/lounge.jpg'],
          bankPhotographs: proto.bank_photos,
          fieldVerified: true,
          highwayFrontage: (proto.flags || []).includes('highway'),
          cornerPlot: (proto.flags || []).includes('corner'),
          commercialValue: (proto.flags || []).includes('commercial'),
          inspectionAssignments: [
            {
              report: {
                summaryText: `Field verified by empaneled structural engineer. Road width: 40 ft asphalt road. Verified boundary stones and occupancy status on site.`,
                overallCondition: 'GOOD',
                estimatedValuation: proto.guide * 100000,
                accessRoadWidth: '40 ft',
                occupancyStatus: proto.poss
              }
            }
          ]
        };
        setAuction(mappedAuction);
        setUserState({
          isUnlocked: localStorage.getItem('ba3_mode') === 'pro' || localStorage.getItem('ba3_mode') === 'both',
          isSaved: false
        });
      }

      setLoading(false);
    }
    loadAuction();
  }, [id]);

  const handleToggleSave = async () => {
    if (!user) {
      alert('Please sign in to save this property.');
      return;
    }
    try {
      const res = await api.saveAuction(id);
      setUserState((prev) => ({ ...prev, isSaved: res.saved }));
    } catch (err) {
      console.error('Save toggle failed:', err);
    }
  };

  const handleUnlockDossier = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.unlocksRemaining <= 0) {
      navigate('/pricing');
      return;
    }
    setUnlocking(true);
    try {
      const res = await api.unlockAuction(id);
      if (res.success) {
        setUserState((prev) => ({ ...prev, isUnlocked: true }));
        await refreshUser();
        setUnlockModalOpen(false);
      }
    } catch (err) {
      alert(err.message || 'Failed to unlock dossier');
    } finally {
      setUnlocking(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-8 h-8 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading comprehensive auction dossier...</p>
      </div>
    );
  }

  if (!auction) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Property Not Found</h2>
        <p className="text-slate-400 text-sm">This auction listing may have expired, been stayed by the DRT, or unpublished.</p>
        <Link to="/search">
          <Button variant="outline">Browse Live Auctions</Button>
        </Link>
      </div>
    );
  }

  const daysLeft = getDaysRemaining(auction.auctionStartDate);
  const photos = [auction.primaryImageUrl, ...(auction.additionalImages || [])].filter(Boolean);
  const inspectionAssignment = auction.inspectionAssignments?.find((ia) => ia.report);
  const inspectionReport = inspectionAssignment?.report;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {auction.attributes?.attributes&&<GlassCard className="p-6 space-y-4"><h2 className="text-lg font-semibold">Verified asset details</h2><p className="text-sm text-slate-300 whitespace-pre-wrap">{auction.attributes.attributes.propertyDescription}</p><dl className="grid sm:grid-cols-3 gap-4 text-sm">{Object.entries({...auction.attributes.attributes.propertyDetails,...(auction.attributes.attributes.assetType==='VEHICLE'?auction.attributes.attributes.vehicle:auction.attributes.attributes.machinery)}).filter(([,value])=>value).map(([key,value])=><div key={key}><dt className="text-xs text-slate-500 capitalize">{key.replace(/([A-Z])/g,' $1')}</dt><dd className="text-slate-200 mt-1">{String(value)}</dd></div>)}</dl></GlassCard>}
      {!userState.isUnlocked && <GlassCard className="p-5 flex flex-wrap gap-4 items-center justify-between"><div><h2 className="font-semibold">Property-specific access</h2><p className="text-sm text-slate-400 mt-1">{auction.accessPricePaise ? formatINR(auction.accessPricePaise / 100) : 'Ask the checker about access pricing'}</p></div><Link to={`/buyer/purchase/${id}`} className="text-cyan-300">View access purchase</Link></GlassCard>}
      {/* Top Breadcrumb & Action Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link to="/search" className="text-xs font-semibold text-slate-400 hover:text-brand-cyan flex items-center gap-1.5 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Search Results
        </Link>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleToggleSave} className="flex items-center gap-1.5">
            <Heart className={`w-4 h-4 ${userState.isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{userState.isSaved ? 'Saved to Archive' : 'Save Property'}</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert('Property link copied to clipboard!');
              }
            }}
          >
            <Share2 className="w-4 h-4" /> Share
          </Button>
        </div>
      </div>

      {/* Main Title Banner & Key Metrics */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel space-y-4 border border-brand-cyan/20 shadow-2xl">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
            {auction.sourceRef}
          </span>
          <SpecularBadge variant="cyan" size="md">
            AI Rank #{auction.aiRank} · {auction.category?.short || auction.category?.name}
          </SpecularBadge>
          {auction.isPremium && <SpecularBadge variant="amber" size="md"><Sparkles className="w-3.5 h-3.5" /> Premium Curated</SpecularBadge>}
          <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Auction in <strong className="text-white">{daysLeft} days</strong> ({formatDate(auction.auctionStartDate)})
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {auction.title}
        </h1>

        <div className="flex items-center gap-2 text-sm text-slate-300 flex-wrap">
          <MapPin className="w-4 h-4 text-brand-cyan shrink-0" />
          <span>{auction.address}</span>
          <span>•</span>
          <span className="font-semibold text-white capitalize">{auction.city}</span>
          {auction.pincode && <span className="font-mono text-slate-400">PIN: {auction.pincode}</span>}
        </div>
      </div>

      {/* Two Column Layout: Visuals & Financials */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col (7): Gallery & Full Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Photo Viewer */}
          <div className="rounded-3xl overflow-hidden glass-panel aspect-[16/10] bg-brand-900 relative">
            <img
              src={photos[selectedPhoto] || '/images/asset-placeholder.svg'}
              alt={auction.title}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/images/asset-placeholder.svg'; }}
            />
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
              <span>Photo {selectedPhoto + 1} of {photos.length}</span>
              <span className="text-brand-cyan">{auction.hasBankPhotos ? 'Lender Sourced Image' : 'Representative Asset Photo'}</span>
            </div>
          </div>

          {/* Photo Thumbnails */}
          {photos.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {photos.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedPhoto(idx)}
                  className={`aspect-video rounded-xl overflow-hidden border-2 transition-all ${
                    selectedPhoto === idx ? 'border-brand-cyan scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={p} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Category-Specific Physical Specifications */}
          <GlassCard className="p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-brand-cyan" />
              Physical Asset Specifications ({auction.category?.name})
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              {auction.attributes?.attributes &&
                Object.entries(auction.attributes.attributes)
                  .filter(([k]) => k !== 'flag_reason')
                  .map(([key, value]) => (
                    <div key={key} className="p-3 rounded-xl bg-brand-900/60 border border-slate-800">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                        {key.replace(/_/g, ' ')}
                      </span>
                      <span className="font-bold text-white font-mono text-sm">
                        {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}
                      </span>
                    </div>
                  ))}
              <div className="p-3 rounded-xl bg-brand-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Possession State</span>
                <span className="font-bold text-white text-sm">{auction.possession}</span>
              </div>
              <div className="p-3 rounded-xl bg-brand-900/60 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Encumbrance Check</span>
                <span className="font-bold text-emerald-400 text-sm">{auction.encumbrances || 'None Disclosed'}</span>
              </div>
            </div>
          </GlassCard>

          {/* Chartered Engineer Physical Site Verification Dossier */}
          <GlassCard className={`p-6 relative overflow-hidden ${!userState.isUnlocked ? 'border-amber-500/30' : ''}`}>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-lg font-bold text-white">Chartered Engineer Site Inspection</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Physical property inspection by empanelled civil engineer</p>
              </div>

              {userState.isUnlocked ? (
                <SpecularBadge variant="emerald" size="sm">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked
                </SpecularBadge>
              ) : (
                <SpecularBadge variant="amber" size="sm">
                  <Lock className="w-3.5 h-3.5" /> Pro Dossier Gated
                </SpecularBadge>
              )}
            </div>

            {inspectionReport ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-brand-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Occupancy Status</span>
                    <strong className="text-white text-sm">{inspectionReport.occupancyStatus}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Access Road</span>
                    <strong className="text-white text-sm">{inspectionReport.accessRoadType}</strong>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Boundary Match</span>
                    <strong className="text-emerald-400 text-sm">
                      {inspectionReport.boundaryMatches ? 'Matches Title Deed' : 'Discrepancy Reported'}
                    </strong>
                  </div>
                  <div className="p-3 rounded-xl bg-brand-900/60 border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Engineer Market Valuation</span>
                    <strong className="text-brand-cyan text-sm font-mono">
                      {formatINR(inspectionReport.engineerValuationEstimate)}
                    </strong>
                  </div>
                </div>

                {/* If Dossier is Unlocked, show detailed observations and GPS */}
                {userState.isUnlocked ? (
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div>
                      <span className="text-xs font-bold text-slate-300 block mb-1">Civil Engineer Observations:</span>
                      <p className="text-xs text-slate-300 leading-relaxed bg-brand-950/60 p-3 rounded-xl border border-slate-800">
                        {inspectionReport.engineerNotes}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs p-3 rounded-xl bg-brand-950/60 border border-slate-800">
                      <span><strong>GPS Coordinates:</strong> {inspectionReport.gpsCoordinates}</span>
                      <span><strong>Proximity:</strong> {inspectionReport.landmarkDistanceKm} km from {inspectionReport.landmarkName}</span>
                    </div>

                    {inspectionReport.photos?.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-300 block mb-2">On-Site Photos by Engineer:</span>
                        <div className="grid grid-cols-3 gap-2">
                          {inspectionReport.photos.map((ph, idx) => (
                            <img key={idx} src={ph} alt="" className="rounded-xl aspect-video object-cover border border-slate-700/60" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-center space-y-2 mt-4">
                    <p className="text-xs text-amber-200">
                      The full engineer valuation breakdown, GPS coordinates, boundary report, and site photographs are available to Pro pack members.
                    </p>
                    <Button variant="primary" size="sm" onClick={() => setUnlockModalOpen(true)}>
                      <Unlock className="w-3.5 h-3.5" /> Unlock with 1 Credit
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 text-center text-xs text-slate-400 bg-brand-900/40 rounded-2xl">
                No approved inspection report is available to view. Contact your checker to request a report.
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Col (5): Commercial Financials & Notice Contacts */}
        <div className="lg:col-span-5 space-y-6">
          {/* Price Box */}
          <GlassCard className="p-6 sm:p-8 space-y-6 border-brand-cyan/30 shadow-2xl">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Reserve Price (Starting Bid)
              </span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono">
                {formatINR(auction.reservePrice)}
              </div>
              {auction.aiDiscountPct ? (
                <div className="mt-2 text-xs font-bold text-emerald-400 inline-block px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
                  {auction.aiDiscountPct}% below estimated market value
                </div>
              ) : null}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Earnest Money Deposit (EMD 10%):</span>
                <span className="font-bold text-white font-mono">{formatINR(auction.emdAmount)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Minimum Bid Increment:</span>
                <span className="font-bold text-white font-mono">{formatINR(auction.bidIncrement)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Auction Start Date &amp; Time:</span>
                <span className="font-bold text-amber-400">{formatDate(auction.auctionStartDate)} · 11:00 AM</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Inspection Window:</span>
                <span className="font-medium text-slate-200">{auction.inspectionDate || 'Ask your checker'}</span>
              </div>
            </div>

            {/* Action CTA */}
            {!userState.isUnlocked ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => setUnlockModalOpen(true)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Unlock className="w-4 h-4" /> Unlock Full Intelligence Dossier
              </Button>
            ) : (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Dossier Unlocked &amp; Saved in My Archive
              </div>
            )}
          </GlassCard>

          {/* Bank & Authorized Officer Contact */}
          <GlassCard className="p-6 space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Building className="w-4 h-4 text-brand-cyan" />
              Lender &amp; Checker Support
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Secured Creditor</span>
                <strong className="text-white text-sm">{auction.bank?.name}</strong>
              </div>
              <p className="text-slate-400">Your checker coordinates property questions, callbacks, legal assistance and additional reports.</p>
              <Link className="btn-primary inline-flex px-4 py-3 rounded-xl" to={`/buyer/requests?auctionId=${auction.id}`}>Contact checker</Link>
              <Link className="block text-cyan-300 py-2" to={`/buyer/requests?auctionId=${auction.id}&kind=DOCUMENT`}>Request documents or a report</Link>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              Submit your EMD directly through the respective lender portal (e.g. IBAPI, MSTC, or designated bank account) as specified in the original SARFAESI sale notice.
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Unlock Confirmation Modal */}
      <Modal isOpen={unlockModalOpen} onClose={() => setUnlockModalOpen(false)} title="Unlock Property Dossier">
        <div className="space-y-4 text-sm text-slate-300">
          <p>
            Unlocking uses <strong className="text-white">1 of your {user?.unlocksRemaining || 0} remaining property credits</strong>.
          </p>
          <ul className="space-y-2 text-xs text-slate-300 p-3 rounded-xl bg-brand-900/60 border border-slate-800">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full Chartered Engineer inspection report &amp; photos</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>GPS site coordinates &amp; landmark proximity breakdown</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Permanent storage in your personal archive</span>
            </li>
          </ul>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setUnlockModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" loading={unlocking} onClick={handleUnlockDossier}>
              Confirm Unlock (1 Credit)
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


export default PropertyDetailsPage;
