import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { GlassCard } from '../../../components/common/GlassCard';
import { Button } from '../../../components/common/Button';
import { SpecularBadge } from '../../../components/common/SpecularBadge';
import {
  ArrowLeft,
  Camera,
  MapPin,
  CheckCircle2,
  Trash2,
  Upload,
  Compass,
  AlertTriangle,
  Building
} from 'lucide-react';
import { formatINR } from '../../../utils/formatters';

export function InspectionFormPage() {
  const { id } = useParams(); // assignmentId
  const navigate = useNavigate();

  const [assignment, setAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form Fields
  const [occupancyStatus, setOccupancyStatus] = useState('Vacant, under bank seal lock');
  const [accessRoadType, setAccessRoadType] = useState('40ft wide blacktopped municipal road');
  const [boundaryMatches, setBoundaryMatches] = useState(true);
  const [propertyCondition, setPropertyCondition] = useState('Good, structurally sound');
  const [utilitiesObserved, setUtilitiesObserved] = useState(['Three-phase EB', 'Metro Water', 'Drainage']);
  const [litigationObserved, setLitigationObserved] = useState('None seen on notice board or site entrance');
  const [engineerValuationEstimate, setEngineerValuationEstimate] = useState('');
  const [engineerNotes, setEngineerNotes] = useState('');
  const [gpsCoordinates, setGpsCoordinates] = useState('');
  const [landmarkName, setLandmarkName] = useState('');
  const [landmarkDistanceKm, setLandmarkDistanceKm] = useState('1.5');
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function loadAssignment() {
      setLoading(true);
      try {
        const res = await api.getAssignmentDetails(id);
        if (res.success && res.data) {
          const a = res.data;
          setAssignment(a);
          if (a.auction) {
            setEngineerValuationEstimate(a.auction.estimatedMarketValue || a.auction.reservePrice * 1.25);
            setLandmarkName(`${a.auction.locality} Junction`);
          }
          if (a.report) {
            const r = a.report;
            setOccupancyStatus(r.occupancyStatus);
            setAccessRoadType(r.accessRoadType);
            setBoundaryMatches(r.boundaryMatches);
            setPropertyCondition(r.propertyCondition);
            setUtilitiesObserved(r.utilitiesObserved || []);
            setLitigationObserved(r.litigationObserved || '');
            setEngineerValuationEstimate(r.engineerValuationEstimate);
            setEngineerNotes(r.engineerNotes);
            setGpsCoordinates(r.gpsCoordinates);
            setLandmarkName(r.landmarkName);
            setLandmarkDistanceKm(r.landmarkDistanceKm);
            setPhotos(r.photos || []);
          }
        }
      } catch (err) {
        console.error('Failed to load inspection task:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAssignment();
  }, [id]);

  const handleCaptureGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoordinates(`${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`);
        },
        () => {
          // Fallback realistic coordinates based on city
          setGpsCoordinates('13.08268, 80.27072');
        }
      );
    } else {
      setGpsCoordinates('13.08268, 80.27072');
    }
  };

  const handleAddSamplePhoto = () => {
    const samples = [
      '/images/chennai-flat-1.jpg',
      '/images/chennai-flat-2.jpg',
      '/images/chennai-flat-3.jpg',
      '/images/bengaluru-house-1.jpg',
      '/images/hyderabad-shop-1.jpg'
    ];
    const available = samples.filter((s) => !photos.includes(s));
    if (available.length > 0) {
      setPhotos((prev) => [...prev, available[0]]);
    } else {
      setPhotos((prev) => [...prev, samples[Math.floor(Math.random() * samples.length)]]);
    }
  };

  const handleRemovePhoto = (idx) => {
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotos((prev) => [...prev, event.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (photos.length < 3) {
      alert('Physical inspection protocol requires at least 3 on-site photographs.');
      return;
    }
    if (!gpsCoordinates) {
      alert('Please click "Capture GPS Location" to verify physical presence on site.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        occupancyStatus,
        accessRoadType,
        boundaryMatches,
        propertyCondition,
        utilitiesObserved,
        litigationObserved,
        engineerValuationEstimate: Number(engineerValuationEstimate),
        engineerNotes: engineerNotes || 'Physical site inspection completed. Boundaries verified against SARFAESI notice.',
        gpsCoordinates,
        landmarkName,
        landmarkDistanceKm: Number(landmarkDistanceKm),
        photos
      };

      const res = await api.submitInspection(id, payload);
      if (res.success) {
        alert('Inspection report submitted successfully! Forwarded to the Admin Approval Desk.');
        navigate('/engineer/assignments');
      }
    } catch (err) {
      alert(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="py-16 text-center text-xs text-slate-400">Loading inspection form...</div>;
  }

  const auc = assignment?.auction;
  const isSubmitted = assignment?.status === 'SUBMITTED' || assignment?.status === 'APPROVED';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <Link to="/engineer/assignments" className="text-xs font-semibold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5">
          <ArrowLeft className="w-4 h-4" /> Back to Assignments
        </Link>
        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400">
          LOT: {auc?.sourceRef}
        </span>
      </div>

      {/* Property Context Box */}
      <GlassCard className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
            Site Visit Inspection Target
          </span>
          <h2 className="text-lg font-bold text-white">{auc?.title}</h2>
          <p className="text-xs text-slate-300 mt-0.5">{auc?.address}</p>
        </div>
        <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6 shrink-0">
          <span className="text-[10px] uppercase font-bold text-slate-400 block">Bank Reserve</span>
          <span className="text-lg font-extrabold text-white font-mono">{formatINR(auc?.reservePrice)}</span>
        </div>
      </GlassCard>

      {/* Main Inspection Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Physical Observations */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-400" />
            1. Physical &amp; Possession Observations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Occupancy Observation
              </label>
              <select
                disabled={isSubmitted}
                value={occupancyStatus}
                onChange={(e) => setOccupancyStatus(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-white"
              >
                <option value="Vacant, under bank seal lock" className="bg-brand-950">Vacant, under bank seal lock</option>
                <option value="Occupied by borrower" className="bg-brand-950">Occupied by borrower</option>
                <option value="Occupied by tenant" className="bg-brand-950">Occupied by tenant</option>
                <option value="Open plot with boundary fencing" className="bg-brand-950">Open plot with boundary fencing</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Access Road Width &amp; Type
              </label>
              <input
                disabled={isSubmitted}
                type="text"
                value={accessRoadType}
                onChange={(e) => setAccessRoadType(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Boundary Markers Match Notice Schedule?
              </label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    disabled={isSubmitted}
                    type="radio"
                    name="boundary"
                    checked={boundaryMatches === true}
                    onChange={() => setBoundaryMatches(true)}
                    className="text-emerald-500 focus:ring-emerald-400"
                  />
                  <span>Matches Exactly</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    disabled={isSubmitted}
                    type="radio"
                    name="boundary"
                    checked={boundaryMatches === false}
                    onChange={() => setBoundaryMatches(false)}
                    className="text-rose-500 focus:ring-rose-400"
                  />
                  <span>Discrepancy Seen</span>
                </label>
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Overall Structure Condition
              </label>
              <input
                disabled={isSubmitted}
                type="text"
                value={propertyCondition}
                onChange={(e) => setPropertyCondition(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-white"
              />
            </div>
          </div>
        </GlassCard>

        {/* Valuation & Proximity */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-emerald-400" />
            2. Independent Market Valuation &amp; Proximity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Engineer Valuation Estimate (INR)
              </label>
              <input
                disabled={isSubmitted}
                type="number"
                required
                value={engineerValuationEstimate}
                onChange={(e) => setEngineerValuationEstimate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-white font-mono"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Nearest Landmark
              </label>
              <input
                disabled={isSubmitted}
                type="text"
                required
                value={landmarkName}
                onChange={(e) => setLandmarkName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-white"
              />
            </div>

            <div>
              <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider">
                Distance to Landmark (km)
              </label>
              <input
                disabled={isSubmitted}
                type="number"
                step="0.1"
                required
                value={landmarkDistanceKm}
                onChange={(e) => setLandmarkDistanceKm(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-white"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-300 block mb-1.5 uppercase tracking-wider text-xs">
              Civil Observations &amp; Buyer Notes
            </label>
            <textarea
              disabled={isSubmitted}
              rows={3}
              value={engineerNotes}
              onChange={(e) => setEngineerNotes(e.target.value)}
              placeholder="What a buyer should know after standing at the location (access width, neighborhood, lift, parking, maintenance state)"
              className="w-full px-4 py-2.5 rounded-xl glass-input text-xs text-white"
            />
          </div>
        </GlassCard>

        {/* GPS Capture & Photographs */}
        <GlassCard className="p-6 space-y-4">
          <h3 className="font-bold text-base text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-400" />
            3. On-Site GPS Coordinates &amp; Evidence Photos
          </h3>

          <div className="p-4 rounded-2xl bg-brand-900/60 border border-slate-800 flex items-center justify-between gap-4 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Verified GPS Position</span>
              <strong className="text-white font-mono text-sm">{gpsCoordinates || 'Not captured yet'}</strong>
            </div>

            {!isSubmitted && (
              <Button type="button" variant="outline" size="sm" onClick={handleCaptureGPS} className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-cyan" /> Capture Location
              </Button>
            )}
          </div>

          {/* Photo Grid */}
          <div>
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-300">
                Uploaded Evidence Photos ({photos.length} added · minimum 3 needed)
              </span>

              {!isSubmitted && (
                <div className="flex items-center gap-2">
                  <label className="px-3 py-1.5 rounded-xl glass-card text-slate-200 hover:text-white cursor-pointer font-bold flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" /> Upload File
                    <input type="file" accept="image/*" multiple onChange={handleFileUpload} className="hidden" />
                  </label>
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddSamplePhoto}>
                    + Add Sample Photo
                  </Button>
                </div>
              )}
            </div>

            {photos.length === 0 ? (
              <div className="p-8 rounded-2xl border-2 border-dashed border-slate-800 text-center text-xs text-slate-500">
                No inspection photos added yet. Upload from device or add a sample.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {photos.map((p, idx) => (
                  <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-700/80 group">
                    <img src={p} alt="" className="w-full h-full object-cover" />
                    {!isSubmitted && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(idx)}
                        className="absolute top-1.5 right-1.5 p-1 rounded-full bg-slate-950/80 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                        title="Remove photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Submit Controls */}
        {!isSubmitted ? (
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={submitting}
              className="w-full py-4 text-sm font-bold bg-gradient-to-r from-emerald-400 to-teal-600 text-slate-950 shadow-glow-emerald"
            >
              <CheckCircle2 className="w-4 h-4" /> Submit Completed Site Inspection to Admin Desk
            </Button>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center">
            This inspection report has been submitted and is currently locked under administrative review.
          </div>
        )}
      </form>
    </div>
  );
}


export default InspectionFormPage;
