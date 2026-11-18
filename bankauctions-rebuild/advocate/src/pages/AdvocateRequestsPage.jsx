import React, { useState } from 'react';
import { MessageSquare, CheckCircle, Clock, Send, ShieldAlert } from 'lucide-react';

export default function AdvocateRequestsPage() {
  const [requests, setRequests] = useState([
    {
      id: 'REQ-LEG-001',
      buyerName: 'Commercial Investor (Ram)',
      property: 'Plot M-94 Pappankuzhi Kancheepuram',
      query: 'Can borrower challenge symbolic possession under Section 17 DRT appeal? Please verify time limitation.',
      status: 'ANSWERED',
      response: 'Under SARFAESI Section 17(1), any application before DRT must be filed within 45 days from date of possession notice. Here, Sec 13(4) was issued on 14-Aug-2026. The 45-day limitation has expired with no pending DRT case numbers.'
    },
    {
      id: 'REQ-LEG-002',
      buyerName: 'Anand Kumar',
      property: 'Flat S-2 Shri Sai Homes Adhanur',
      query: 'Does the flat have local body building plan sanction and Completion Certificate (CC)?',
      status: 'IN_REVIEW',
      response: null
    }
  ]);

  const [replyText, setReplyText] = useState('');
  const [selectedId, setSelectedId] = useState('REQ-LEG-002');

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    setRequests(requests.map(r => r.id === selectedId ? { ...r, status: 'ANSWERED', response: replyText } : r));
    setReplyText('');
    alert('Legal response delivered to buyer workspace.');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Buyer Legal Consultation &amp; Inquiry Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Direct legal enquiries raised by verified buyers regarding SARFAESI statutory timelines, DRT jurisdiction, revenue records, and encumbrances.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          {requests.map((req) => (
            <div
              key={req.id}
              onClick={() => setSelectedId(req.id)}
              className={`p-5 rounded-2xl glass-panel border transition-all cursor-pointer space-y-2 ${
                selectedId === req.id
                  ? 'border-amber-400/50 bg-amber-500/[0.04]'
                  : 'border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{req.buyerName}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  req.status === 'ANSWERED'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                }`}>
                  {req.status}
                </span>
              </div>
              <div className="text-[11px] text-amber-400 font-mono">{req.property}</div>
              <p className="text-xs text-slate-300">{req.query}</p>
              {req.response && (
                <div className="mt-2 p-2.5 rounded-xl bg-slate-900/80 border border-emerald-500/20 text-xs text-emerald-200">
                  <strong className="text-emerald-400 block mb-0.5">Advocate Response:</strong>
                  {req.response}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 rounded-3xl border-white/10 space-y-4">
          <h2 className="font-bold text-base text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Submit Advocate Legal Reply ({selectedId})</span>
          </h2>
          <textarea
            rows={5}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="w-full p-3.5 rounded-xl glass-input text-xs text-white"
            placeholder="Type legal advice, statutory citations, or document findings..."
          />
          <button
            onClick={handleSendReply}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:scale-[1.01] transition-transform flex items-center justify-center gap-2"
          >
            <span>Deliver Legal Opinion to Buyer Workspace</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
