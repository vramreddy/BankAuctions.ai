import React, { useState } from 'react';
import { api } from '../services/api';
import { GlassCard } from '../components/common/GlassCard';
import { Button } from '../components/common/Button';
import { SpecularBadge } from '../components/common/SpecularBadge';
import { UploadCloud, CheckCircle2, AlertTriangle, FileJson, ArrowRight } from 'lucide-react';

export function ImportManagementPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  const sampleAldrinFeed = [
    {
      sourceRef: `ALD-CHE-${Math.floor(10000 + Math.random() * 90000)}`,
      title: '3BHK luxury apartment, 1,750 sq ft · Anna Nagar West',
      shortTitle: '3BHK luxury flat',
      city: 'chennai',
      locality: 'Anna Nagar West',
      address: 'Plot 42, 7th Main Road, Anna Nagar West Extension, Chennai',
      pincode: '600101',
      bankCode: 'SBI',
      catCode: 'flat',
      reservePrice: 18500000,
      emdAmount: 1850000,
      bidIncrement: 50000,
      auctionStartDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      possession: 'Physical possession',
      encumbrances: 'None known',
      attributes: {
        bhk: '3BHK',
        built_up_area_sqft: 1750,
        floor_number: 3,
        society_name: 'Metro Haven'
      }
    },
    {
      sourceRef: `ALD-BEN-${Math.floor(10000 + Math.random() * 90000)}`,
      title: 'Industrial Warehouse with container dock, 14,000 sq ft · Peenya',
      shortTitle: 'Industrial Warehouse, 14,000 sq ft',
      city: 'bengaluru',
      locality: 'Peenya',
      address: 'Plot No. 12/A, Peenya 2nd Stage, Industrial Estate, Bengaluru',
      pincode: '560058',
      bankCode: 'CANARA',
      catCode: 'warehouse',
      reservePrice: 22000000,
      emdAmount: 2200000,
      bidIncrement: 100000,
      auctionStartDate: new Date(Date.now() + 20 * 86400000).toISOString(),
      possession: 'Physical possession',
      encumbrances: 'None',
      attributes: {
        covered_area_sqft: 14000,
        power_load_kva: 200,
        highway_frontage: true
      }
    }
  ];

  const handleLoadSample = () => {
    setJsonInput(JSON.stringify(sampleAldrinFeed, null, 2));
  };

  const handleImport = async (e) => {
    e.preventDefault();
    setImporting(true);
    setResult(null);

    try {
      const parsed = JSON.parse(jsonInput);
      const records = Array.isArray(parsed) ? parsed : [parsed];

      const res = await api.importBatch({ records });
      if (res.success) {
        setResult(res);
        setJsonInput('');
      }
    } catch (err) {
      alert(err.message || 'Invalid JSON format or ingestion failed');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <UploadCloud className="w-5 h-5 text-brand-cyan" />
          Batch Auction Data Ingestion Pipeline
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Authorized feed ingestion from BAANKNET extraction notices. Imported records undergo schema validation, deduplication, and are staged for Quality Checker audit.
        </p>
      </div>

      {result && (
        <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-200 text-xs space-y-2">
          <div className="flex items-center gap-2 font-bold text-sm text-emerald-300">
            <CheckCircle2 className="w-4 h-4" />
            {result.message}
          </div>
          <p>
            Staged <strong className="text-white">{result.importedCount} new lots</strong> directly into the Quality Checker Exception Queue.
          </p>
        </div>
      )}

      <GlassCard className="p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <h3 className="font-bold text-sm text-white uppercase tracking-wider flex items-center gap-2">
            <FileJson className="w-4 h-4 text-brand-cyan" />
            Paste Structured JSON Records
          </h3>
          <Button variant="outline" size="sm" onClick={handleLoadSample} className="text-xs">
            Load Sample Feed (Aldrin Schema)
          </Button>
        </div>

        <form onSubmit={handleImport} className="space-y-4">
          <textarea
            rows={12}
            required
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[ { "sourceRef": "BNK-CHE-47019", "title": "2BHK Flat...", "city": "chennai", "reservePrice": 6500000, ... } ]'
            className="w-full p-4 rounded-2xl glass-input font-mono text-xs text-white"
          />

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-400">
              Duplicate `sourceRef` values are automatically identified and safely skipped.
            </span>
            <Button
              type="submit"
              variant="primary"
              loading={importing}
              disabled={!jsonInput.trim()}
              className="text-xs"
            >
              <UploadCloud className="w-4 h-4" /> Ingest &amp; Dispatch to Checkers
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}


export default ImportManagementPage;
