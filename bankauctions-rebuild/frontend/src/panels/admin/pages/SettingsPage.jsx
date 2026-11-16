import React, { useState } from 'react';
import { 
  Sliders, Shield, Bell, Database, CheckCircle2, 
  Save, AlertTriangle, Key, Cpu, Sparkles 
} from 'lucide-react';
import GlassCard from '../../../components/common/GlassCard';
import SpecularBadge from '../../../components/common/SpecularBadge';
import Button from '../../../components/common/Button';

export default function SettingsPage() {
  const [savedToast, setSavedToast] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    autoPublishThreshold: 98,
    requireEngineerPhotoMin: 3,
    enableSiteBanner: false,
    siteBannerText: 'Upcoming Mega E-Auction scheduled for Bank of Baroda assets this Saturday.',
    enableAiRankConfidenceScoring: true,
    maintenanceMode: false,
    sessionTimeoutMinutes: 60,
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold text-accent-cyan uppercase tracking-wider">System Configuration</span>
            <span className="text-slate-600">•</span>
            <span className="text-xs text-slate-400">Environment Controls</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings & Policies</h1>
          <p className="text-sm text-slate-400 mt-1">
            Fine-tune OCR auto-ingestion policies, verification constraints, security timeouts, and site-wide broadcast announcements.
          </p>
        </div>

        <Button 
          variant="primary" 
          icon={<Save className="w-4 h-4" />}
          onClick={handleSave}
        >
          Save Configuration
        </Button>
      </div>

      {savedToast && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>System configuration parameters updated and synced across all nodes.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Verification & AI Policies */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20">
              <Cpu className="w-5 h-5 text-accent-cyan" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Maker-Checker & AI Ingestion Governance</h3>
              <p className="text-xs text-slate-400">Control thresholds required before auction notices bypass manual auditor desks</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                OCR Straight-Through Processing (STP) Threshold (%)
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="90" 
                  max="100" 
                  value={settings.autoPublishThreshold} 
                  onChange={(e) => setSettings({...settings, autoPublishThreshold: parseInt(e.target.value)})}
                  className="w-full accent-accent-cyan"
                />
                <span className="font-mono text-white font-bold w-12 text-right">{settings.autoPublishThreshold}%</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Notices with extraction confidence below {settings.autoPublishThreshold}% are strictly queued for human checker reconciliation.
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Minimum On-Site Inspection Evidence Photos
              </label>
              <input 
                type="number" 
                min="1" 
                max="10"
                value={settings.requireEngineerPhotoMin}
                onChange={(e) => setSettings({...settings, requireEngineerPhotoMin: parseInt(e.target.value)})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-accent-cyan"
              />
              <p className="text-xs text-slate-500 mt-1">
                Field engineers cannot submit a report without attaching at least this many geotagged photographs.
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Public Announcement Broadcast */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Site-Wide Broadcast Announcement</h3>
              <p className="text-xs text-slate-400">Display an emergency or promotional notification banner across all buyer surfaces</p>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <input 
                type="checkbox" 
                id="enableBanner"
                checked={settings.enableSiteBanner}
                onChange={(e) => setSettings({...settings, enableSiteBanner: e.target.checked})}
                className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-accent-cyan focus:ring-accent-cyan"
              />
              <label htmlFor="enableBanner" className="text-sm font-semibold text-white cursor-pointer">
                Enable Alert Banner at top of Public & Buyer layouts
              </label>
            </div>

            {settings.enableSiteBanner && (
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Announcement Message Text</label>
                <input 
                  type="text"
                  value={settings.siteBannerText}
                  onChange={(e) => setSettings({...settings, siteBannerText: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-accent-cyan"
                />
              </div>
            )}
          </div>
        </GlassCard>

        {/* Security & Access Timers */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Security & Session Parameters</h3>
              <p className="text-xs text-slate-400">Enforce token expiration and idle logout policies</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Staff Session Idle Timeout (Minutes)
              </label>
              <input 
                type="number" 
                min="15" 
                max="480"
                value={settings.sessionTimeoutMinutes}
                onChange={(e) => setSettings({...settings, sessionTimeoutMinutes: parseInt(e.target.value)})}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white font-mono focus:outline-none focus:border-accent-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                Cryptographic Key Rotation
              </label>
              <div className="flex items-center gap-3 mt-2">
                <SpecularBadge variant="emerald">JWT Secret: Active (HS256)</SpecularBadge>
                <span className="text-xs text-slate-500 font-mono">Last rotated 14 days ago</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </form>
    </div>
  );
}
