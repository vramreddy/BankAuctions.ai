import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  ShieldAlert, 
  CheckCircle2, 
  Scale, 
  HardHat, 
  ChevronDown, 
  ExternalLink,
  Layers
} from 'lucide-react';

const WORKSPACES = [
  {
    id: 'overview',
    name: 'Overview & Buyer Portal',
    shortName: 'Buyer Overview',
    port: 5173,
    url: 'http://localhost:5173',
    icon: Building2,
    color: 'from-cyan-400 to-blue-600',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    desc: 'Public Discovery, AI Ranking & Investor Due Diligence'
  },
  {
    id: 'admin',
    name: 'Bank Auction Admin Console',
    shortName: 'Admin Panel',
    port: 5174,
    url: 'http://localhost:5174',
    icon: ShieldAlert,
    color: 'from-purple-600 to-indigo-600',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    desc: 'Inventory Ingestion, Staff Management & System Audits'
  },
  {
    id: 'checker',
    name: 'Quality Checker Workspace',
    shortName: 'Checker Desk',
    port: 5175,
    url: 'http://localhost:5175',
    icon: CheckCircle2,
    color: 'from-emerald-400 to-teal-600',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    desc: 'SARFAESI Notice QC, Exception Queue & Publishing Gate'
  },
  {
    id: 'advocate',
    name: 'Advocate & Legal Bench',
    shortName: 'Advocate Panel',
    port: 5176,
    url: 'http://localhost:5176',
    icon: Scale,
    color: 'from-amber-400 to-orange-600',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    desc: 'Section 12B Scrutiny, 30-Yr Title Search & Legal Opinions'
  },
  {
    id: 'engineer',
    name: 'Field Valuation Desk',
    shortName: 'Field Engineer',
    port: 5177,
    url: 'http://localhost:5177',
    icon: HardHat,
    color: 'from-orange-500 to-red-600',
    badgeColor: 'bg-orange-500/20 text-orange-300 border-orange-500/40',
    desc: 'Physical Geo-inspections, Valuation & Structural Reports'
  }
];

export default function WorkspaceSwitcher({ currentWorkspace = 'admin' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeWs = WORKSPACES.find(w => w.id === currentWorkspace) || WORKSPACES[1];
  const ActiveIcon = activeWs.icon;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-white/10 hover:border-purple-400/50 hover:bg-white/[0.06] text-xs font-semibold text-slate-200 transition-all shadow-md group"
        aria-label="Switch Workspace"
      >
        <div className={`w-5 h-5 rounded-lg bg-gradient-to-tr ${activeWs.color} flex items-center justify-center text-white font-bold shadow-sm`}>
          <ActiveIcon className="w-3 h-3 text-white" />
        </div>
        <div className="flex flex-col text-left hidden sm:block">
          <span className="text-[10px] text-slate-400 font-mono leading-none">Workspace</span>
          <span className="text-xs font-bold text-white group-hover:text-purple-300 leading-tight">
            {activeWs.shortName} <span className="text-[10px] text-slate-400 font-mono">(:{activeWs.port})</span>
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-950/95 border border-white/15 p-2 shadow-2xl backdrop-blur-2xl z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-2 border-b border-white/10 mb-1 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                Platform Workspaces
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">5 Standalone Portals</span>
          </div>

          <div className="space-y-1">
            {WORKSPACES.map((ws) => {
              const Icon = ws.icon;
              const isCurrent = ws.id === currentWorkspace;

              return (
                <a
                  key={ws.id}
                  href={ws.url}
                  className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                    isCurrent
                      ? 'bg-white/[0.08] border border-white/20'
                      : 'hover:bg-white/[0.05] border border-transparent hover:border-white/10'
                  }`}
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${ws.color} flex items-center justify-center text-slate-950 flex-shrink-0 mt-0.5 shadow-sm`}>
                    <Icon className="w-4 h-4 text-slate-950" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold truncate ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                        {ws.name}
                      </span>
                      {isCurrent ? (
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full border ${ws.badgeColor}`}>
                          Current
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-400 flex items-center gap-0.5">
                          :{ws.port} <ExternalLink className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-normal">
                      {ws.desc}
                    </p>
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mt-2 pt-2 border-t border-white/10 px-3 py-1 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Auth: Isolated per panel</span>
            <span className="text-purple-400">bankauctions.ai</span>
          </div>
        </div>
      )}
    </div>
  );
}
