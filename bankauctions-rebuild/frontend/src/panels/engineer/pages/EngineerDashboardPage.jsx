import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../../services/api';
import { StatCard } from '../../../components/common/StatCard';
import { GlassCard } from '../../../components/common/GlassCard';
import { Button } from '../../../components/common/Button';
import { Compass, Calendar, CheckSquare, Clock, ArrowRight } from 'lucide-react';

export function EngineerDashboardPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const res = await api.getEngineerAssignments();
        if (res.success) setAssignments(res.data);
      } catch (err) {
        console.error('Failed to load assignments:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const toVisit = assignments.filter((a) => a.status === 'ASSIGNED');
  const scheduled = assignments.filter((a) => a.status === 'SCHEDULED');
  const submitted = assignments.filter((a) => a.status === 'SUBMITTED' || a.status === 'APPROVED');

  return (
    <div className="space-y-8">
      {/* Engineer Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-mono tracking-wider text-emerald-400 font-bold">
              Field Operations
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
              Empanelled Engineer
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Field Inspection Schedule
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Visit assigned SARFAESI properties, verify physical boundaries, capture GPS coordinates and on-site photographs, and submit valuation assessments.
          </p>
        </div>

        <Link to="/engineer/assignments">
          <Button variant="primary" size="lg" className="flex items-center gap-2 bg-gradient-to-r from-emerald-400 to-teal-600 text-slate-950 font-bold shadow-glow-emerald">
            View Assigned Tasks ({assignments.length}) <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          label="Pending Visits"
          value={toVisit.length}
          subtext="Awaiting on-site scheduling"
          icon={Compass}
        />
        <StatCard
          label="Scheduled Site Visits"
          value={scheduled.length}
          subtext="Dates booked with borrowers/officers"
          icon={Calendar}
        />
        <StatCard
          label="Completed Inspections"
          value={submitted.length}
          subtext="Dossiers submitted to Admin desk"
          icon={CheckSquare}
        />
      </div>

      {/* Quick Action List */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          Immediate Action Assignments
        </h3>

        {toVisit.length === 0 ? (
          <p className="text-xs text-slate-400">All current site visits have been scheduled or submitted.</p>
        ) : (
          <div className="space-y-3">
            {toVisit.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-brand-900/40 border border-slate-800 flex items-center justify-between gap-4">
                <div>
                  <strong className="text-sm font-bold text-white block">{item.auction?.title}</strong>
                  <span className="text-xs text-slate-400">{item.auction?.address}</span>
                </div>
                <Link to={`/engineer/assignments/${item.id}`}>
                  <Button variant="outline" size="sm" className="text-xs">
                    Inspect Property
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}


export default EngineerDashboardPage;
