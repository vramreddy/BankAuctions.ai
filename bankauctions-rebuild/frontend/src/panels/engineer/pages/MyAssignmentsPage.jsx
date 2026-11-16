import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';
import { GlassCard } from '../../../components/common/GlassCard';
import { Button } from '../../../components/common/Button';
import { SpecularBadge } from '../../../components/common/SpecularBadge';
import { Modal } from '../../../components/common/Modal';
import { Compass, Calendar, Clock, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { formatDate, formatINR } from '../../../utils/formatters';

export function MyAssignmentsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('todo'); // 'todo', 'sch', 'sub'
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Scheduling Modal State
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledSlot, setScheduledSlot] = useState('Morning (10:00 AM - 1:00 PM)');
  const [scheduling, setScheduling] = useState(false);

  useEffect(() => {
    async function loadAssignments() {
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
    loadAssignments();
  }, []);

  const todoList = assignments.filter((a) => a.status === 'ASSIGNED');
  const schList = assignments.filter((a) => a.status === 'SCHEDULED');
  const subList = assignments.filter((a) => a.status === 'SUBMITTED' || a.status === 'APPROVED');

  const currentList = tab === 'todo' ? todoList : tab === 'sch' ? schList : subList;

  const handleOpenSchedule = (item) => {
    setSelectedAssignment(item);
    setScheduledDate(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
    setScheduleModalOpen(true);
  };

  const handleConfirmSchedule = async (e) => {
    e.preventDefault();
    if (!selectedAssignment) return;
    setScheduling(true);
    try {
      const res = await api.scheduleVisit(selectedAssignment.id, {
        date: scheduledDate,
        slot: scheduledSlot
      });
      if (res.success) {
        setAssignments((prev) =>
          prev.map((a) => (a.id === selectedAssignment.id ? { ...a, status: 'SCHEDULED', scheduledDate, scheduledSlot } : a))
        );
        setScheduleModalOpen(false);
        setTab('sch');
      }
    } catch (err) {
      alert(err.message || 'Failed to schedule inspection');
    } finally {
      setScheduling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            Field Verification Assignments
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Properties requiring on-site civil observation, physical possession audit, and photos.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-brand-900/60 border border-slate-700/60">
          <button
            onClick={() => setTab('todo')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'todo'
                ? 'bg-amber-500/20 text-amber-300 shadow-glow-amber border border-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            To Visit ({todoList.length})
          </button>
          <button
            onClick={() => setTab('sch')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'sch'
                ? 'bg-brand-cyan/20 text-brand-cyan shadow-glow-cyan border border-brand-cyan/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Scheduled ({schList.length})
          </button>
          <button
            onClick={() => setTab('sub')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              tab === 'sub'
                ? 'bg-emerald-500/20 text-emerald-400 shadow-glow-emerald border border-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Submitted ({subList.length})
          </button>
        </div>
      </div>

      {/* Task List Rendering */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : currentList.length === 0 ? (
        <div className="p-16 rounded-3xl glass-card text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No tasks in this tab</h3>
          <p className="text-xs text-slate-400">All caught up for this stage.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {currentList.map((item) => {
            const auc = item.auction;
            return (
              <GlassCard key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan">
                      {auc?.sourceRef}
                    </span>
                    <span className="text-xs text-slate-400 capitalize">{auc?.category?.short} · {auc?.locality}</span>
                    {item.status === 'SCHEDULED' && (
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Visit: {formatDate(item.scheduledDate)}
                      </span>
                    )}
                  </div>
                  <h4 className="text-base font-bold text-white">{auc?.title}</h4>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    {auc?.address}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {item.status === 'ASSIGNED' && (
                    <Button variant="outline" size="sm" onClick={() => handleOpenSchedule(item)}>
                      <Calendar className="w-3.5 h-3.5" /> Book Visit Slot
                    </Button>
                  )}

                  <Link to={`/engineer/assignments/${item.id}`}>
                    <Button variant="primary" size="sm">
                      {item.status === 'SUBMITTED' ? 'View Inspection Report' : 'Start Inspection'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}

      {/* Schedule Modal */}
      <Modal isOpen={scheduleModalOpen} onClose={() => setScheduleModalOpen(false)} title="Schedule Site Inspection">
        <form onSubmit={handleConfirmSchedule} className="space-y-4 text-xs">
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

          <div>
            <label className="font-bold text-slate-300 block mb-1">Time Window / Slot</label>
            <select
              value={scheduledSlot}
              onChange={(e) => setScheduledSlot(e.target.value)}
              className="w-full px-3 py-2 rounded-xl glass-input text-white"
            >
              <option value="Morning (10:00 AM - 1:00 PM)" className="bg-brand-950">Morning (10:00 AM - 1:00 PM)</option>
              <option value="Afternoon (1:00 PM - 4:00 PM)" className="bg-brand-950">Afternoon (1:00 PM - 4:00 PM)</option>
              <option value="Late Afternoon (4:00 PM - 6:00 PM)" className="bg-brand-950">Late Afternoon (4:00 PM - 6:00 PM)</option>
            </select>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
            <Button variant="outline" size="sm" onClick={() => setScheduleModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" loading={scheduling} type="submit">Confirm Schedule</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}


export default MyAssignmentsPage;
