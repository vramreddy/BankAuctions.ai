import React, { useState, useEffect } from 'react';
import {
  CITIES,
  STATES,
  ROLES_CONFIG,
  RAW_PROPERTIES,
  INITIAL_AUDIT_LOGS,
  getLocalItem,
  setLocalItem,
  logAudit,
  formatINR,
  timeAgo,
} from '../services/prototypeData';

const SEED_CUSTOMERS = [
  { id: 'U2001', name: 'Anitha Raghavan', phone: '9840123456', city: 'chennai', plan: 'Pro pack', unl: 3, joined: Date.now() - 86400000 * 35, status: 'active' },
  { id: 'U2002', name: 'Vikram Shah', phone: '9820123456', city: 'bengaluru', plan: 'Free', unl: 0, joined: Date.now() - 86400000 * 42, status: 'active' },
  { id: 'U2003', name: 'Divya Menon', phone: '9845123456', city: 'kerala', plan: 'Pro + Premium property', unl: 5, joined: Date.now() - 86400000 * 12, status: 'active' },
  { id: 'U2004', name: 'Arjun Reddy', phone: '9848123456', city: 'hyderabad', plan: 'Pro used up', unl: 5, joined: Date.now() - 86400000 * 80, status: 'active' },
  { id: 'U2005', name: 'Fatima Khan', phone: '9822123456', city: 'chennai', plan: 'Free', unl: 0, joined: Date.now() - 86400000 * 15, status: 'active' },
  { id: 'U2006', name: 'Suresh Kumar', phone: '9841123456', city: 'coimbatore', plan: 'Premium property', unl: 1, joined: Date.now() - 86400000 * 95, status: 'suspended' },
  { id: 'U2007', name: 'Lakshmi Iyer', phone: '9844123456', city: 'bengaluru', plan: 'Pro pack', unl: 4, joined: Date.now() - 86400000 * 20, status: 'active' },
  { id: 'U2008', name: 'Rohan Das', phone: '9811123456', city: 'hyderabad', plan: 'Free', unl: 0, joined: Date.now() - 86400000 * 6, status: 'active' },
];

const SEED_PAYMENTS = [
  { id: 'P5001', who: 'Anitha Raghavan', what: 'Pro pack · 5 properties', amt: 499, at: Date.now() - 86400000 * 3, refunded: false },
  { id: 'P5002', who: 'Divya Menon', what: 'Premium · Kerala · 1 month', amt: 1499, at: Date.now() - 86400000 * 5, refunded: false },
  { id: 'P5003', who: 'Arjun Reddy', what: 'Pro pack · 5 properties', amt: 499, at: Date.now() - 86400000 * 18, refunded: true },
  { id: 'P5004', who: 'Lakshmi Iyer', what: 'Pro pack · 5 properties', amt: 499, at: Date.now() - 86400000 * 20, refunded: false },
  { id: 'P5005', who: 'Suresh Kumar', what: 'Premium · Coimbatore · 1 month', amt: 1499, at: Date.now() - 86400000 * 25, refunded: true },
  { id: 'P5006', who: 'Rajesh V.', what: 'Consultation · Adv. K. Ramesh', amt: 1500, at: Date.now() - 86400000 * 2, refunded: false },
];

const SEED_STAFF_LIST = [
  { id: 'S1001', role: 'admin', name: 'Rahul D.', phone: '9840112345', email: 'rahul.d@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: ['chennai'], manager: '' },
  { id: 'S1002', role: 'checker', name: 'Latha M.', phone: '9840223456', email: 'latha.m@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: ['chennai'], manager: '' },
  { id: 'S1003', role: 'marketing', name: 'Meera N.', phone: '9840334567', email: 'meera.n@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: ['chennai', 'coimbatore'], manager: '' },
  { id: 'S1004', role: 'marketing', name: 'Pooja V.', phone: '9840334588', email: 'pooja.v@bankauctions.ai', status: 'active', state: 'Karnataka', cities: ['bengaluru'], manager: '' },
  { id: 'S1005', role: 'field', name: 'Karthik S.', phone: '9840445678', email: 'karthik.s@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: ['chennai'], manager: 'S1003' },
  { id: 'S1006', role: 'field', name: 'Vignesh R.', phone: '9840556789', email: 'vignesh.r@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: ['chennai', 'coimbatore'], manager: 'S1003' },
  { id: 'S1007', role: 'field', name: 'Siddharth M.', phone: '9840667890', email: 'siddharth.m@bankauctions.ai', status: 'active', state: 'Karnataka', cities: ['bengaluru'], manager: 'S1004' },
  { id: 'S1008', role: 'lawyer', name: 'Adv. K. Ramesh', phone: '9840778901', email: 'k.ramesh@bar.bankauctions.ai', status: 'active', state: 'Tamil Nadu', advocate: 'Adv. K. Ramesh · Madras High Court', cities: [], manager: '' },
  { id: 'S1009', role: 'leadership', name: 'Sanjay K.', phone: '9840889012', email: 'sanjay.k@bankauctions.ai', status: 'active', state: 'Tamil Nadu', cities: [], manager: '' },
];

const SEED_ADVOCATE_APPS = [
  { id: 'A1', name: 'Adv. G. Prakash', court: 'Madras High Court', yrs: '9 yrs', focus: 'Property and DRT matters', st: 'pending' },
  { id: 'A2', name: 'Adv. Nandini Rao', court: 'Telangana High Court', yrs: '14 yrs', focus: 'SARFAESI', st: 'pending' },
  { id: 'A3', name: 'Adv. M. Joseph', court: 'Kerala High Court', yrs: '6 yrs', focus: 'Land records', st: 'pending' },
];

export function AdminDashboardPage() {
  const [tab, setTab] = useState('ov');
  const [toastMessage, setToastMessage] = useState(null);

  // Customers Tab state
  const [custQuery, setCustQuery] = useState('');
  const [custPlan, setCustPlan] = useState('');
  const [customers, setCustomers] = useState(() => getLocalItem('ba3_adm_users_list', SEED_CUSTOMERS));

  // Staff Tab state
  const [staffQuery, setStaffQuery] = useState('');
  const [staffRole, setStaffRole] = useState('');
  const [staffStatus, setStaffStatus] = useState('');
  const [staffState, setStaffState] = useState('');
  const [staffList, setStaffList] = useState(() => getLocalItem('ba3_staff_dir', SEED_STAFF_LIST));
  const [onboardModalOpen, setOnboardModalOpen] = useState(false);
  const [editingStaffId, setEditingStaffId] = useState(null);

  // Listings Tab state
  const [listQuery, setListQuery] = useState('');
  const [listCity, setListCity] = useState('');
  const [unpubList, setUnpubList] = useState(() => getLocalItem('ba3_unpub', []));
  const [docsModalProp, setDocsModalProp] = useState(null);
  const [docNameInput, setDocNameInput] = useState('');

  // Advocates Tab state
  const [advocateApps, setAdvocateApps] = useState(() => getLocalItem('ba3_lapps', SEED_ADVOCATE_APPS));
  const [advocatePayouts, setAdvocatePayouts] = useState(() => getLocalItem('ba3_pay', {}));

  // Payments Tab state
  const [payments, setPayments] = useState(() => getLocalItem('ba3_payments_ledger', SEED_PAYMENTS));

  // Audit Tab state
  const [auditQuery, setAuditQuery] = useState('');
  const [auditLogs, setAuditLogs] = useState(() => getLocalItem('ba3_audit', INITIAL_AUDIT_LOGS));

  // Site Settings Tab state
  const [flags, setFlags] = useState(() => getLocalItem('ba3_flags', { maker: true, chat: true, banner: '' }));

  // Field Operations State
  const [foCity, setFoCity] = useState('chennai');
  const [foEngineer, setFoEngineer] = useState('S1005');
  const [foCount, setFoCount] = useState(5);
  const [reassignModalProp, setReassignModalProp] = useState(null);
  const [reassignTargetEngineer, setReassignTargetEngineer] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const syncAuditLogs = () => {
    setAuditLogs(getLocalItem('ba3_audit', INITIAL_AUDIT_LOGS));
  };

  // Helper: Gift Unlocks
  const handleGiftUnlocks = (cust) => {
    const updated = customers.map((c) => {
      if (c.id === cust.id) {
        return { ...c, unl: c.unl + 5, plan: c.plan === 'Free' ? 'Pro pack' : c.plan };
      }
      return c;
    });
    setCustomers(updated);
    setLocalItem('ba3_adm_users_list', updated);
    logAudit(`Granted 5 unlocks to ${cust.name}`);
    syncAuditLogs();
    showToast(`5 unlocks granted to ${cust.name}`);
  };

  // Helper: Suspend / Reinstate customer
  const handleToggleCustomerStatus = (cust) => {
    const nextStatus = cust.status === 'active' ? 'suspended' : 'active';
    const updated = customers.map((c) => (c.id === cust.id ? { ...c, status: nextStatus } : c));
    setCustomers(updated);
    setLocalItem('ba3_adm_users_list', updated);
    const action = nextStatus === 'suspended' ? `Suspended ${cust.name}` : `Reinstated ${cust.name}`;
    logAudit(action);
    syncAuditLogs();
    showToast(`${cust.name}: ${nextStatus}`);
  };

  // Helper: Staff reporting manager change
  const handleManagerChange = (staffId, newMgrId) => {
    const staffMember = staffList.find((s) => s.id === staffId);
    const newMgr = staffList.find((s) => s.id === newMgrId);
    const updated = staffList.map((s) => (s.id === staffId ? { ...s, manager: newMgrId } : s));
    setStaffList(updated);
    setLocalItem('ba3_staff_dir', updated);
    const msg = `Changed reporting manager of ${staffMember.name} to ${newMgr ? newMgr.name : 'none'}`;
    logAudit(msg);
    syncAuditLogs();
    showToast(`${staffMember.name} now reports to ${newMgr ? newMgr.name : 'none'}`);
  };

  // Helper: Staff status change
  const handleStaffStatusChange = (staffId, newStatus) => {
    const staffMember = staffList.find((s) => s.id === staffId);
    const updated = staffList.map((s) => (s.id === staffId ? { ...s, status: newStatus } : s));
    setStaffList(updated);
    setLocalItem('ba3_staff_dir', updated);
    const msg = `${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}d ${staffMember.name} (${staffMember.role})`;
    logAudit(msg);
    syncAuditLogs();
    showToast(`${staffMember.name} is ${newStatus}`);
  };

  // Helper: Toggle listing unpublish
  const handleToggleUnpublish = (lotId) => {
    let nextUnpub = [...unpubList];
    const exists = nextUnpub.includes(lotId);
    if (exists) {
      nextUnpub = nextUnpub.filter((id) => id !== lotId);
    } else {
      nextUnpub.push(lotId);
    }
    setUnpubList(nextUnpub);
    setLocalItem('ba3_unpub', nextUnpub);
    const act = exists ? `Republished ${lotId}` : `Unpublished ${lotId}`;
    logAudit(act);
    syncAuditLogs();
    showToast(exists ? `Republished ${lotId}` : `Hidden ${lotId} from public site`);
  };

  // Helper: Add document to property
  const handleAddDocument = (propId) => {
    if (!docNameInput.trim()) {
      showToast('Give the document a name');
      return;
    }
    const docsStore = getLocalItem('ba3_docs', {});
    const existing = docsStore[propId] || [];
    existing.push({
      n: docNameInput.trim(),
      by: 'Rahul D. (Admin)',
      at: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
    });
    docsStore[propId] = existing;
    setLocalItem('ba3_docs', docsStore);
    logAudit(`Attached document "${docNameInput.trim()}" to ${propId}`);
    syncAuditLogs();
    showToast('Document attached');
    setDocNameInput('');
    setDocsModalProp(null);
  };

  // Helper: Advocate Application Decision
  const handleAdvocateDecision = (appId, decision) => {
    const updated = advocateApps.map((a) => (a.id === appId ? { ...a, st: decision } : a));
    setAdvocateApps(updated);
    setLocalItem('ba3_lapps', updated);
    logAudit(`${decision === 'approved' ? 'Approved' : 'Rejected'} advocate application ${appId}`);
    syncAuditLogs();
    showToast(`Advocate application ${decision}`);
  };

  // Helper: Release Payout
  const handleReleasePayout = (advocateName) => {
    const updated = { ...advocatePayouts, [advocateName]: true };
    setAdvocatePayouts(updated);
    setLocalItem('ba3_pay', updated);
    logAudit(`Released payout to ${advocateName}`);
    syncAuditLogs();
    showToast(`Payout released to ${advocateName} (demo)`);
  };

  // Helper: Refund Payment
  const handleRefundPayment = (payId) => {
    const updated = payments.map((p) => (p.id === payId ? { ...p, refunded: true } : p));
    setPayments(updated);
    setLocalItem('ba3_payments_ledger', updated);
    logAudit(`Refunded payment ${payId}`);
    syncAuditLogs();
    showToast(`Refund recorded for ${payId}`);
  };

  // Helper: Download CSV
  const handleDownloadCSV = () => {
    const rows = [
      ['Ref', 'Date', 'Customer', 'Item', 'Amount', 'Refunded'],
      ...payments.map((p) => [
        p.id,
        new Date(p.at).toISOString().slice(0, 10),
        p.who,
        p.what,
        p.amt,
        p.refunded ? 'yes' : 'no',
      ]),
    ];
    const csvContent = rows
      .map((r) =>
        r
          .map((c) => {
            const str = String(c);
            return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
          })
          .join(',')
      )
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'payments.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    showToast('Downloaded payments.csv');
  };

  // Helper: Save Settings
  const handleSaveSettings = () => {
    setLocalItem('ba3_flags', flags);
    setLocalItem('ba3_banner', flags.banner);
    logAudit('Changed site settings');
    syncAuditLogs();
    showToast('Saved. Open public site to see updates.');
  };

  // Helper: Remind / Nudge engineer
  const handleNudge = (lotId) => {
    logAudit(`Sent reminder for ${lotId}`);
    syncAuditLogs();
    showToast('Reminder sent to field engineer');
  };

  // Helper: Reassign engineer
  const handleReassign = () => {
    if (!reassignTargetEngineer) {
      showToast('Select a field engineer');
      return;
    }
    const eng = staffList.find((s) => s.id === reassignTargetEngineer);
    logAudit(`Reassigned ${reassignModalProp} to ${eng ? eng.name : reassignTargetEngineer}`);
    syncAuditLogs();
    showToast(`Reassigned to ${eng ? eng.name : 'engineer'}`);
    setReassignModalProp(null);
  };

  // Helper: Assign properties
  const handleAssignProperties = () => {
    const eng = staffList.find((s) => s.id === foEngineer);
    logAudit(`Assigned ${foCount} properties in ${foCity} to ${eng ? eng.name : 'engineer'}`);
    syncAuditLogs();
    showToast(`${foCount} properties assigned to ${eng ? eng.name : 'engineer'}`);
  };

  // Filtered Customers
  const filteredCustomers = customers.filter((c) => {
    const matchQ = !custQuery || (c.name + c.phone).toLowerCase().includes(custQuery.toLowerCase());
    const matchPlan = !custPlan || c.plan === custPlan;
    return matchQ && matchPlan;
  });

  // Filtered Staff
  const filteredStaff = staffList.filter((s) => {
    const matchQ = !staffQuery || (s.name + s.phone + s.email).toLowerCase().includes(staffQuery.toLowerCase());
    const matchRole = !staffRole || s.role === staffRole;
    const matchStatus = !staffStatus || s.status === staffStatus;
    const matchState = !staffState || s.state === staffState;
    return matchQ && matchRole && matchStatus && matchState;
  });

  // Filtered Listings
  const filteredListings = RAW_PROPERTIES.filter((p) => {
    const matchQ = !listQuery || (p.title + p.id + p.bank).toLowerCase().includes(listQuery.toLowerCase());
    const matchCity = !listCity || p.city === listCity;
    return matchQ && matchCity;
  });

  // Filtered Audit Logs
  const filteredAudit = auditLogs.filter((a) => {
    return !auditQuery || (a.who + a.what + a.role).toLowerCase().includes(auditQuery.toLowerCase());
  });

  return (
    <div className="stw" id="app">
      {/* Toast Notification */}
      {toastMessage && <div className="admin-toast">✓ {toastMessage}</div>}

      {/* Header Title & Subtitle */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', alignItems: 'end', marginBottom: '6px' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(26px,3vw,38px)', letterSpacing: '-.035em', fontWeight: 800 }}>
            Admin console
          </h1>
          <p style={{ color: 'var(--mute)', margin: '6px 0 0', maxWidth: '80ch', fontSize: '15px' }}>
            Run the platform: customers, staff, listings, advocates, payments and the audit trail. Every action here is written to the audit log.
          </p>
        </div>
      </div>

      {/* 9 Tabs Pill Row */}
      <div className="pf" id="tabs" style={{ margin: '18px 0 16px' }}>
        {[
          ['ov', 'Overview'],
          ['us', 'Customers'],
          ['sf', 'Staff'],
          ['fo', 'Field operations'],
          ['ls', 'Listings'],
          ['lw', 'Advocates'],
          ['pm', 'Payments'],
          ['au', 'Audit log'],
          ['sy', 'Site settings'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={tab === key ? 'on' : ''}
          >
            {label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {tab === 'ov' && (
        <div id="tb">
          <div className="kpis">
            <div className="kpi">
              <small>Registered users</small>
              <b>{(customers.length * 95).toLocaleString('en-IN')}</b>
              <span>{(customers.filter((x) => x.plan !== 'Free').length * 95).toLocaleString('en-IN')} paying</span>
            </div>
            <div className="kpi">
              <small>Live properties</small>
              <b>{RAW_PROPERTIES.length - unpubList.length}</b>
              <span>Maker 75% · exceptions 25%</span>
            </div>
            <div className="kpi">
              <small>Suspended accounts</small>
              <b>{customers.filter((x) => x.status === 'suspended').length}</b>
              <span>platform-wide</span>
            </div>
            <div className="kpi">
              <small>Refunds issued</small>
              <b>{payments.filter((x) => x.refunded).length}</b>
              <span>settled promptly</span>
            </div>
          </div>

          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: '0 0 16px' }}>
              Operations at a glance
            </h2>
            <div className="grid g4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              <div className="kpi">
                <small>Exception queue</small>
                <b style={{ fontSize: '26px' }}>2 open</b>
                <span>14 approved this week</span>
                <br />
                <a href="http://localhost:5175" style={{ color: 'var(--rose)', fontWeight: 700 }}>
                  Open →
                </a>
              </div>
              <div className="kpi">
                <small>Advocate requests</small>
                <b style={{ fontSize: '26px' }}>3 waiting</b>
                <span>across all advocates</span>
                <br />
                <a href="http://localhost:5176" style={{ color: 'var(--rose)', fontWeight: 700 }}>
                  Open →
                </a>
              </div>
              <div className="kpi">
                <small>Field visits</small>
                <b style={{ fontSize: '26px' }}>2 overdue</b>
                <span>1 urgent · 3 with checker</span>
                <br />
                <button
                  onClick={() => setTab('fo')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--rose)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Open →
                </button>
              </div>
              <div className="kpi">
                <small>Unpublished properties</small>
                <b style={{ fontSize: '26px' }}>{unpubList.length}</b>
                <span>hidden from the public site</span>
                <br />
                <button
                  onClick={() => setTab('ls')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--rose)', fontWeight: 700, cursor: 'pointer' }}
                >
                  Manage →
                </button>
              </div>
            </div>
          </section>

          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: 0 }}>
                Field visit alerts
              </h2>
              <button className="btn out sm" onClick={() => setTab('fo')}>
                Open field operations
              </button>
            </div>
            <div className="ov3">
              <table className="qt">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>When</th>
                    <th>Alert</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ whiteSpace: 'nowrap' }}>14 min ago</td>
                    <td>
                      <span style={{ color: '#A50E0E' }}>●</span> CHN-10430 · Anna Nagar field visit is overdue by 6 hours
                    </td>
                  </tr>
                  <tr>
                    <td style={{ whiteSpace: 'nowrap' }}>45 min ago</td>
                    <td>
                      <span style={{ color: '#A50E0E' }}>●</span> BLR-10204 · HSR Layout deadline approaching in 3 hours
                    </td>
                  </tr>
                  <tr>
                    <td style={{ whiteSpace: 'nowrap' }}>2 h ago</td>
                    <td>Karthik S. submitted physical inspection report for CHN-10283</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: '0 0 12px' }}>
              Latest activity
            </h2>
            <div className="ov3">
              <table className="qt">
                <thead>
                  <tr>
                    <th style={{ width: '120px' }}>When</th>
                    <th style={{ width: '180px' }}>Who</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.slice(0, 6).map((a, i) => (
                    <tr key={i}>
                      <td>{timeAgo(a.at)}</td>
                      <td>
                        <b>{a.who}</b> · {a.role}
                      </td>
                      <td>{a.what}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 2: CUSTOMERS */}
      {tab === 'us' && (
        <div id="tb">
          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: '0 0 14px' }}>
              Customers ({filteredCustomers.length} in this sample)
            </h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <input
                className="cs"
                style={{ color: 'var(--ink)', minWidth: '240px' }}
                placeholder="Search name or phone"
                value={custQuery}
                onChange={(e) => setCustQuery(e.target.value)}
              />
              <select
                className="cs"
                style={{ color: 'var(--ink)' }}
                value={custPlan}
                onChange={(e) => setCustPlan(e.target.value)}
              >
                <option value="">All plans</option>
                {['Free', 'Pro pack', 'Pro used up', 'Premium property', 'Pro + Premium property'].map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="ov3">
              <table className="qt">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>City</th>
                    <th>Plan</th>
                    <th>Unlocked</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((c) => (
                    <tr key={c.id}>
                      <td>
                        <b>{c.name}</b>
                        <br />
                        <small style={{ color: 'var(--mute)' }}>
                          +91 {c.phone.slice(0, 2)}••• •••{c.phone.slice(-3)}
                        </small>
                      </td>
                      <td>{CITIES[c.city]?.label || c.city}</td>
                      <td>{c.plan}</td>
                      <td>{c.unl}</td>
                      <td>{new Date(c.joined).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>
                        <span
                          className="pill"
                          style={{
                            background: c.status === 'active' ? '#E3F6EA' : '#FFE3EA',
                            color: c.status === 'active' ? '#176B3A' : '#A3123F',
                          }}
                        >
                          {c.status === 'active' ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        <button
                          className="btn out sm"
                          onClick={() => handleGiftUnlocks(c)}
                          style={{ marginRight: '6px' }}
                        >
                          +5 unlocks
                        </button>
                        <button
                          className="btn out sm"
                          onClick={() => handleToggleCustomerStatus(c)}
                        >
                          {c.status === 'active' ? 'Suspend' : 'Reinstate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 3: STAFF */}
      {tab === 'sf' && (
        <div id="tb">
          <div className="kpis">
            <div className="kpi">
              <small>Field engineers</small>
              <b>{staffList.filter((s) => s.role === 'field').length}</b>
              <span>{staffList.filter((s) => s.role === 'field' && s.status === 'active').length} active</span>
            </div>
            <div className="kpi">
              <small>Advocates</small>
              <b>{staffList.filter((s) => s.role === 'lawyer').length}</b>
              <span>empanelled</span>
            </div>
            <div className="kpi">
              <small>Checkers</small>
              <b>{staffList.filter((s) => s.role === 'checker').length}</b>
              <span>active quality desk</span>
            </div>
            <div className="kpi">
              <small>Marketing</small>
              <b>{staffList.filter((s) => s.role === 'marketing').length}</b>
              <span>state managers</span>
            </div>
          </div>

          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: 0 }}>
                Staff accounts ({filteredStaff.length})
              </h2>
              <button className="btn" onClick={() => { setEditingStaffId(null); setOnboardModalOpen(true); }}>
                + Onboard staff
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <input
                className="cs"
                style={{ color: 'var(--ink)', minWidth: '220px' }}
                placeholder="Search name, phone or email"
                value={staffQuery}
                onChange={(e) => setStaffQuery(e.target.value)}
              />
              <select
                className="cs"
                style={{ color: 'var(--ink)' }}
                value={staffRole}
                onChange={(e) => setStaffRole(e.target.value)}
              >
                <option value="">All roles</option>
                {Object.keys(ROLES_CONFIG).map((r) => (
                  <option key={r} value={r}>
                    {ROLES_CONFIG[r]}
                  </option>
                ))}
              </select>
              <select
                className="cs"
                style={{ color: 'var(--ink)' }}
                value={staffStatus}
                onChange={(e) => setStaffStatus(e.target.value)}
              >
                <option value="">Any status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="deactivated">Deactivated</option>
              </select>
              <select
                className="cs"
                style={{ color: 'var(--ink)' }}
                value={staffState}
                onChange={(e) => setStaffState(e.target.value)}
              >
                <option value="">All states</option>
                {STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div className="ov3">
              <table className="qt">
                <thead>
                  <tr>
                    <th>Person</th>
                    <th>Role</th>
                    <th>State and cities</th>
                    <th>Reports to</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStaff.map((m) => {
                    const managers = staffList.filter((x) => x.role === 'marketing' && x.state === m.state);
                    return (
                      <tr key={m.id}>
                        <td style={{ minWidth: '200px' }}>
                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '50%',
                                background: '#0F766E',
                                color: '#fff',
                                display: 'grid',
                                placeItems: 'center',
                                fontWeight: 800,
                                fontSize: '13px',
                              }}
                            >
                              {m.name
                                .split(' ')
                                .map((n) => n[0])
                                .slice(0, 2)
                                .join('')}
                            </div>
                            <span>
                              <b>{m.name}</b>
                              <br />
                              <small style={{ color: 'var(--mute)' }}>
                                +91 {m.phone.slice(0, 5)} {m.phone.slice(5)}
                              </small>
                            </span>
                          </div>
                        </td>
                        <td>{ROLES_CONFIG[m.role]}</td>
                        <td>
                          {m.state}
                          {m.cities && m.cities.length > 0 && ` · ${m.cities.join(', ')}`}
                          {m.advocate && <><br /><small style={{ color: 'var(--mute)' }}>{m.advocate}</small></>}
                        </td>
                        <td>
                          {m.role === 'field' ? (
                            <select
                              className="cs"
                              style={{ color: 'var(--ink)', minWidth: '150px', padding: '6px 10px', fontSize: '13px' }}
                              value={m.manager || ''}
                              onChange={(e) => handleManagerChange(m.id, e.target.value)}
                            >
                              <option value="">Select a manager</option>
                              {managers.map((mgr) => (
                                <option key={mgr.id} value={mgr.id}>
                                  {mgr.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td>
                          <span
                            className="pill"
                            style={{
                              background:
                                m.status === 'active'
                                  ? '#E3F6EA'
                                  : m.status === 'suspended'
                                  ? '#FFF1D6'
                                  : '#FFE3EA',
                              color:
                                m.status === 'active'
                                  ? '#176B3A'
                                  : m.status === 'suspended'
                                  ? '#8A5A00'
                                  : '#A3123F',
                            }}
                          >
                            {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <button
                            className="btn out sm"
                            onClick={() => { setEditingStaffId(m.id); setOnboardModalOpen(true); }}
                            style={{ marginRight: '6px' }}
                          >
                            Edit
                          </button>
                          {m.status === 'active' ? (
                            <>
                              <button
                                className="btn out sm"
                                onClick={() => handleStaffStatusChange(m.id, 'suspended')}
                                style={{ marginRight: '6px' }}
                              >
                                Suspend
                              </button>
                              <button
                                className="btn out sm"
                                onClick={() => handleStaffStatusChange(m.id, 'deactivated')}
                              >
                                Deactivate
                              </button>
                            </>
                          ) : (
                            <button
                              className="btn sm"
                              onClick={() => handleStaffStatusChange(m.id, 'active')}
                            >
                              Activate
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 4: FIELD OPERATIONS */}
      {tab === 'fo' && (
        <div id="tb">
          <div className="kpis">
            <div className="kpi">
              <small>Open site visits</small>
              <b>7</b>
              <span>Assigned to 3 active engineers</span>
            </div>
            <div className="kpi">
              <small>Urgent</small>
              <b>1</b>
              <span>Deadline within 6 hours</span>
            </div>
            <div className="kpi">
              <small>Overdue</small>
              <b>2</b>
              <span>Shown to managers and leadership</span>
            </div>
            <div className="kpi">
              <small>With checker</small>
              <b>3</b>
              <span>approved and published</span>
            </div>
          </div>

          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: '0 0 12px' }}>
              Needs attention (2)
            </h2>
            <div className="ov3">
              <table className="qt">
                <thead>
                  <tr>
                    <th>Property</th>
                    <th>Field engineer</th>
                    <th>Reports to</th>
                    <th>What is late</th>
                    <th>Late by</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>Independent house, 1,860 sq ft · Anna Nagar</b>
                      <br />
                      <small style={{ color: 'var(--mute)' }}>CHN-10430 · Chennai</small>
                    </td>
                    <td>Karthik S.</td>
                    <td>Meera N.</td>
                    <td>Inspection report missing after site visit</td>
                    <td><b style={{ color: '#A50E0E' }}>6h overdue</b></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn out sm" onClick={() => handleNudge('CHN-10430')} style={{ marginRight: '6px' }}>
                        Remind
                      </button>
                      <button className="btn sm" onClick={() => { setReassignModalProp('CHN-10430'); setReassignTargetEngineer('S1006'); }}>
                        Reassign
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>4BHK Villa · HSR Layout</b>
                      <br />
                      <small style={{ color: 'var(--mute)' }}>BLR-10204 · Bengaluru</small>
                    </td>
                    <td>Siddharth M.</td>
                    <td>Pooja V.</td>
                    <td>Visit not scheduled within 24 hours</td>
                    <td><b style={{ color: '#A50E0E' }}>2h overdue</b></td>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn out sm" onClick={() => handleNudge('BLR-10204')} style={{ marginRight: '6px' }}>
                        Remind
                      </button>
                      <button className="btn sm" onClick={() => { setReassignModalProp('BLR-10204'); setReassignTargetEngineer('S1007'); }}>
                        Reassign
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: '0 0 12px' }}>
              Field engineers
            </h2>
            <div className="ov3">
              <table className="qt">
                <thead>
                  <tr>
                    <th>Engineer</th>
                    <th>Cities</th>
                    <th>Reports to</th>
                    <th>Open</th>
                    <th>Urgent</th>
                    <th>Overdue</th>
                    <th>With checker</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {staffList
                    .filter((s) => s.role === 'field')
                    .map((eng) => {
                      const mgr = staffList.find((s) => s.id === eng.manager);
                      return (
                        <tr key={eng.id}>
                          <td>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <div
                                style={{
                                  width: '30px',
                                  height: '30px',
                                  borderRadius: '50%',
                                  background: '#0F766E',
                                  color: '#fff',
                                  display: 'grid',
                                  placeItems: 'center',
                                  fontWeight: 800,
                                  fontSize: '11px',
                                }}
                              >
                                {eng.name[0]}
                              </div>
                              <b>{eng.name}</b>
                            </div>
                          </td>
                          <td>{eng.cities.join(', ')}</td>
                          <td>{mgr ? mgr.name : '—'}</td>
                          <td>3</td>
                          <td><b style={{ color: '#8A5A00' }}>1</b></td>
                          <td><b style={{ color: '#A50E0E' }}>1</b></td>
                          <td>1</td>
                          <td>
                            <span className="pill" style={{ background: '#E3F6EA', color: '#176B3A' }}>
                              Active
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: '0 0 8px' }}>
              Assign more properties
            </h2>
            <p style={{ color: 'var(--mute)', margin: '0 0 14px', fontSize: '14px' }}>
              Hand the next unassigned properties in a city to a field engineer. Their 24 and 48 hour clocks start now.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                className="cs"
                style={{ color: 'var(--ink)' }}
                value={foCity}
                onChange={(e) => setFoCity(e.target.value)}
              >
                {Object.keys(CITIES).map((c) => (
                  <option key={c} value={c}>
                    {CITIES[c].label}
                  </option>
                ))}
              </select>
              <select
                className="cs"
                style={{ color: 'var(--ink)' }}
                value={foEngineer}
                onChange={(e) => setFoEngineer(e.target.value)}
              >
                {staffList
                  .filter((s) => s.role === 'field' && s.status === 'active')
                  .map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name}
                    </option>
                  ))}
              </select>
              <select
                className="cs"
                style={{ color: 'var(--ink)' }}
                value={foCount}
                onChange={(e) => setFoCount(Number(e.target.value))}
              >
                <option value={3}>3</option>
                <option value={5}>5</option>
                <option value={8}>8</option>
              </select>
              <button className="btn" onClick={handleAssignProperties}>
                Assign
              </button>
            </div>
          </section>
        </div>
      )}

      {/* TAB 5: LISTINGS */}
      {tab === 'ls' && (
        <div id="tb">
          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: '0 0 14px' }}>
              Listings ({filteredListings.length})
            </h2>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '14px' }}>
              <input
                className="cs"
                style={{ color: 'var(--ink)', minWidth: '240px' }}
                placeholder="Search property, title or lender"
                value={listQuery}
                onChange={(e) => setListQuery(e.target.value)}
              />
              <select
                className="cs"
                style={{ color: 'var(--ink)' }}
                value={listCity}
                onChange={(e) => setListCity(e.target.value)}
              >
                <option value="">All cities</option>
                {Object.keys(CITIES).map((c) => (
                  <option key={c} value={c}>
                    {CITIES[c].label}
                  </option>
                ))}
              </select>
            </div>

            <div className="ov3">
              <table className="qt">
                <thead>
                  <tr>
                    <th>Lot</th>
                    <th>Property</th>
                    <th>Lender</th>
                    <th>Reserve</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((p) => {
                    const isOff = unpubList.includes(p.id);
                    return (
                      <tr key={p.id}>
                        <td><b>{p.id}</b></td>
                        <td style={{ maxWidth: '260px' }}>
                          {p.short} · {p.loc}
                          <br />
                          <small style={{ color: 'var(--mute)' }}>
                            {CITIES[p.city]?.label}
                            {p.premium && ' · Premium'}
                          </small>
                        </td>
                        <td>{p.bank}</td>
                        <td>{formatINR(p.reserve)}</td>
                        <td>{p.exception ? 'Checker' : 'Maker'}</td>
                        <td>
                          <span
                            className="pill"
                            style={{
                              background: isOff ? '#FFE3EA' : '#E3F6EA',
                              color: isOff ? '#A3123F' : '#176B3A',
                            }}
                          >
                            {isOff ? 'Unpublished' : 'Live'}
                          </span>
                        </td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          <button
                            className="btn out sm"
                            onClick={() => setDocsModalProp(p)}
                            style={{ marginRight: '6px' }}
                          >
                            Documents (3)
                          </button>
                          <button
                            className="btn out sm"
                            onClick={() => handleToggleUnpublish(p.id)}
                            style={{ marginRight: '6px' }}
                          >
                            {isOff ? 'Republish' : 'Unpublish'}
                          </button>
                          <a
                            className="btn out sm"
                            href={`http://localhost:5173/search`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            View
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 6: ADVOCATES */}
      {tab === 'lw' && (
        <div id="tb">
          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: '0 0 14px' }}>
              Empanelment applications
            </h2>
            <div className="ov3">
              <table className="qt">
                <thead>
                  <tr>
                    <th>Advocate</th>
                    <th>Court</th>
                    <th>Experience</th>
                    <th>Focus</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {advocateApps.map((a) => (
                    <tr key={a.id}>
                      <td><b>{a.name}</b></td>
                      <td>{a.court}</td>
                      <td>{a.yrs}</td>
                      <td>{a.focus}</td>
                      <td>
                        <span
                          className="pill"
                          style={{
                            background:
                              a.st === 'pending'
                                ? '#FFF1D6'
                                : a.st === 'approved'
                                ? '#E3F6EA'
                                : '#FFE3EA',
                            color:
                              a.st === 'pending'
                                ? '#8A5A00'
                                : a.st === 'approved'
                                ? '#176B3A'
                                : '#A3123F',
                          }}
                        >
                          {a.st.charAt(0).toUpperCase() + a.st.slice(1)}
                        </span>
                      </td>
                      <td style={{ whiteSpace: 'nowrap' }}>
                        {a.st === 'pending' && (
                          <>
                            <button
                              className="btn sm"
                              onClick={() => handleAdvocateDecision(a.id, 'approved')}
                              style={{ marginRight: '6px' }}
                            >
                              Approve
                            </button>
                            <button
                              className="btn out sm"
                              onClick={() => handleAdvocateDecision(a.id, 'rejected')}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: '0 0 14px' }}>
              Payouts due to advocates
            </h2>
            <div className="ov3">
              <table className="qt">
                <thead>
                  <tr>
                    <th>Advocate</th>
                    <th>Pending payout</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Adv. K. Ramesh · Madras High Court</b></td>
                    <td>{advocatePayouts['Adv. K. Ramesh'] ? '₹0 (settled)' : '₹4,800'}</td>
                    <td>
                      {!advocatePayouts['Adv. K. Ramesh'] && (
                        <button
                          className="btn sm"
                          onClick={() => handleReleasePayout('Adv. K. Ramesh')}
                        >
                          Release payout
                        </button>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td><b>Adv. Nandini Rao · Telangana High Court</b></td>
                    <td>{advocatePayouts['Adv. Nandini Rao'] ? '₹0 (settled)' : '₹2,400'}</td>
                    <td>
                      {!advocatePayouts['Adv. Nandini Rao'] && (
                        <button
                          className="btn sm"
                          onClick={() => handleReleasePayout('Adv. Nandini Rao')}
                        >
                          Release payout
                        </button>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 7: PAYMENTS */}
      {tab === 'pm' && (
        <div id="tb">
          <div className="kpis">
            <div className="kpi">
              <small>Collected (sample)</small>
              <b>₹{payments.filter((p) => !p.refunded).reduce((acc, p) => acc + p.amt, 0).toLocaleString('en-IN')}</b>
              <span>Net of refunds</span>
            </div>
            <div className="kpi">
              <small>Payments</small>
              <b>{payments.length}</b>
              <span>total processed</span>
            </div>
            <div className="kpi">
              <small>Refunded</small>
              <b>{payments.filter((p) => p.refunded).length}</b>
              <span>reversed</span>
            </div>
            <div className="kpi">
              <small>Live from this browser</small>
              <b>1 ●</b>
              <span>active session</span>
            </div>
          </div>

          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
              <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: 0 }}>
                Payments and refunds
              </h2>
              <button className="btn out sm" onClick={handleDownloadCSV}>
                Download CSV
              </button>
            </div>
            <div className="ov3">
              <table className="qt">
                <thead>
                  <tr>
                    <th>Ref</th>
                    <th>When</th>
                    <th>Customer</th>
                    <th>Item</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((p) => (
                    <tr key={p.id}>
                      <td><b>{p.id}</b></td>
                      <td>{new Date(p.at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{p.who}</td>
                      <td>{p.what}</td>
                      <td>
                        {p.refunded ? <s>₹{p.amt.toLocaleString('en-IN')}</s> : `₹${p.amt.toLocaleString('en-IN')}`}
                      </td>
                      <td>
                        {p.refunded && (
                          <span className="pill" style={{ background: '#EDEDF0', color: '#55555e' }}>
                            Refunded
                          </span>
                        )}
                      </td>
                      <td>
                        {!p.refunded && (
                          <button
                            className="btn out sm"
                            onClick={() => handleRefundPayment(p.id)}
                          >
                            Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 8: AUDIT LOG */}
      {tab === 'au' && (
        <div id="tb">
          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px' }}>
            <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: '0 0 14px' }}>
              Audit log
            </h2>
            <input
              className="cs"
              style={{ color: 'var(--ink)', minWidth: '260px', marginBottom: '14px' }}
              placeholder="Filter by person or action"
              value={auditQuery}
              onChange={(e) => setAuditQuery(e.target.value)}
            />
            <div className="ov3">
              <table className="qt">
                <thead>
                  <tr>
                    <th style={{ width: '130px' }}>When</th>
                    <th style={{ width: '160px' }}>Who</th>
                    <th style={{ width: '130px' }}>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAudit.map((a, i) => (
                    <tr key={i}>
                      <td>{timeAgo(a.at)}</td>
                      <td><b>{a.who}</b></td>
                      <td>{a.role}</td>
                      <td>{a.what}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* TAB 9: SITE SETTINGS */}
      {tab === 'sy' && (
        <div id="tb">
          <section className="sc" style={{ padding: '20px', marginBottom: '18px', background: '#fff', border: '1px solid var(--line)', borderRadius: '20px', maxWidth: '640px' }}>
            <h2 style={{ font: '800 19px var(--f)', letterSpacing: '-.02em', margin: '0 0 18px' }}>
              Site settings
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <div>
                <b>Maker auto-publish</b>
                <br />
                <small style={{ color: 'var(--mute)' }}>When off, every property goes to the checker queue.</small>
              </div>
              <input
                type="checkbox"
                style={{ width: '20px', height: '20px', accentColor: 'var(--rose)' }}
                checked={flags.maker}
                onChange={(e) => setFlags({ ...flags, maker: e.target.checked })}
              />
            </div>

            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: '1px solid var(--line)',
              }}
            >
              <div>
                <b>Chat widget</b>
                <br />
                <small style={{ color: 'var(--mute)' }}>Show “Chat with us” to customers.</small>
              </div>
              <input
                type="checkbox"
                style={{ width: '20px', height: '20px', accentColor: 'var(--rose)' }}
                checked={flags.chat}
                onChange={(e) => setFlags({ ...flags, chat: e.target.checked })}
              />
            </div>

            <label style={{ display: 'grid', gap: '6px', margin: '18px 0 14px', fontSize: '13px', fontWeight: 700 }}>
              Site-wide notice
              <small style={{ color: 'var(--mute)', fontWeight: 400 }}>
                shown above the header for every visitor. Leave empty for none.
              </small>
              <input
                className="cs"
                style={{ color: 'var(--ink)', width: '100%', borderRadius: '12px', padding: '10px 14px' }}
                value={flags.banner || ''}
                onChange={(e) => setFlags({ ...flags, banner: e.target.value })}
                placeholder="Scheduled maintenance on Sunday, 2 to 3 am"
              />
            </label>

            <button className="btn" onClick={handleSaveSettings} style={{ marginTop: '10px' }}>
              Save settings
            </button>
          </section>
        </div>
      )}

      {/* MODAL: DOCUMENTS FOR LISTING */}
      {docsModalProp && (
        <div className="admin-modal-overlay" onClick={() => setDocsModalProp(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px' }}>
              Documents for {docsModalProp.short} · {docsModalProp.id}
            </h3>
            <p style={{ color: 'var(--mute)', fontSize: '14px', margin: '0 0 16px' }}>
              Advocates and buyers see these when they open a booking about this property.
            </p>

            <div style={{ display: 'grid', gap: '8px', marginBottom: '20px' }}>
              <div style={{ background: '#F6F6F8', padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <b>Sale notice</b>
                  <br />
                  <small style={{ color: 'var(--mute)' }}>Portal admin · {docsModalProp.id}</small>
                </span>
                <span className="pill" style={{ background: '#E3F6EA', color: '#176B3A', alignSelf: 'center' }}>Verified</span>
              </div>
              <div style={{ background: '#F6F6F8', padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <b>Valuation and encumbrance summary</b>
                  <br />
                  <small style={{ color: 'var(--mute)' }}>Portal admin · {docsModalProp.id}</small>
                </span>
                <span className="pill" style={{ background: '#E3F6EA', color: '#176B3A', alignSelf: 'center' }}>Verified</span>
              </div>
              <div style={{ background: '#F6F6F8', padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between' }}>
                <span>
                  <b>Possession and occupancy note</b>
                  <br />
                  <small style={{ color: 'var(--mute)' }}>Portal admin · {docsModalProp.id}</small>
                </span>
                <span className="pill" style={{ background: '#E3F6EA', color: '#176B3A', alignSelf: 'center' }}>Verified</span>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px' }}>
              <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '12px' }}>
                Add a document
                <input
                  className="cs"
                  style={{ width: '100%', borderRadius: '12px' }}
                  placeholder="e.g. Encumbrance certificate, 13 years"
                  value={docNameInput}
                  onChange={(e) => setDocNameInput(e.target.value)}
                />
              </label>

              <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '14px' }}>
                File (optional, up to 400 KB)
                <input type="file" className="cs" style={{ width: '100%', borderRadius: '12px' }} />
              </label>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn" onClick={() => handleAddDocument(docsModalProp.id)}>
                  Attach to this property
                </button>
                <button className="btn out" onClick={() => setDocsModalProp(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ONBOARD STAFF */}
      {onboardModalOpen && (
        <StaffOnboardModal
          staffId={editingStaffId}
          staffList={staffList}
          onClose={() => setOnboardModalOpen(false)}
          onSave={(newRecord) => {
            let nextList = [...staffList];
            const idx = nextList.findIndex((x) => x.id === newRecord.id);
            if (idx > -1) {
              nextList[idx] = newRecord;
              logAudit(`Updated ${newRecord.name} (${newRecord.role})`);
            } else {
              nextList.push(newRecord);
              logAudit(`Onboarded ${newRecord.name} (${newRecord.role})`);
            }
            setStaffList(nextList);
            setLocalItem('ba3_staff_dir', nextList);
            syncAuditLogs();
            showToast(idx > -1 ? 'Saved' : `${newRecord.name} onboarded`);
            setOnboardModalOpen(false);
          }}
        />
      )}

      {/* MODAL: REASSIGN ENGINEER */}
      {reassignModalProp && (
        <div className="admin-modal-overlay" onClick={() => setReassignModalProp(null)}>
          <div className="admin-modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 6px' }}>
              Reassign {reassignModalProp}
            </h3>
            <p style={{ color: 'var(--mute)', fontSize: '13px', margin: '0 0 14px' }}>
              The new engineer gets a fresh 24 hour and 48 hour clock.
            </p>
            <label style={{ display: 'grid', gap: '6px', fontSize: '13px', fontWeight: 700, marginBottom: '16px' }}>
              New field engineer
              <select
                className="cs"
                style={{ width: '100%', borderRadius: '12px' }}
                value={reassignTargetEngineer}
                onChange={(e) => setReassignTargetEngineer(e.target.value)}
              >
                {staffList
                  .filter((s) => s.role === 'field' && s.status === 'active')
                  .map((eng) => (
                    <option key={eng.id} value={eng.id}>
                      {eng.name}
                    </option>
                  ))}
              </select>
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn" onClick={handleReassign}>
                Reassign
              </button>
              <button className="btn out" onClick={() => setReassignModalProp(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-component: Staff Onboarding / Edit Modal
function StaffOnboardModal({ staffId, staffList, onClose, onSave }) {
  const existing = staffList.find((s) => s.id === staffId);
  const isNew = !existing;

  const [role, setRole] = useState(existing?.role || 'field');
  const [status, setStatus] = useState(existing?.status || 'active');
  const [name, setName] = useState(existing?.name || '');
  const [phone, setPhone] = useState(existing?.phone || '');
  const [dob, setDob] = useState(existing?.dob || '1995-05-12');
  const [emergency, setEmergency] = useState(existing?.emergency || '9840998877');
  const [personalEmail, setPersonalEmail] = useState(existing?.personalEmail || '');
  const [tempAddress, setTempAddress] = useState(existing?.tempAddress || '12 Cross St, Chennai');
  const [permAddress, setPermAddress] = useState(existing?.permAddress || '12 Cross St, Chennai');
  const [sameAddress, setSameAddress] = useState(true);
  const [state, setState] = useState(existing?.state || 'Tamil Nadu');
  const [manager, setManager] = useState(existing?.manager || '');
  const [advocateProfile, setAdvocateProfile] = useState(existing?.advocate || '');
  const [cities, setCities] = useState(existing?.cities || ['chennai']);
  const [errors, setErrors] = useState([]);

  const marketingManagers = staffList.filter((s) => s.role === 'marketing' && s.state === state);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = [];
    if (!name.trim()) errs.push('Enter the full name.');
    if (!/^[6-9]\d{9}$/.test(phone)) errs.push('Mobile number must be 10 digits starting with 6, 7, 8 or 9.');
    if (role === 'field' && !manager) errs.push('Choose a reporting manager.');
    if (role === 'field' && cities.length === 0) errs.push('Select at least one city.');
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    const baseEmail = name.toLowerCase().replace(/[^a-z]/g, '');
    const workEmail =
      role === 'lawyer'
        ? `${baseEmail.slice(0, 8)}@bar.bankauctions.ai`
        : `${baseEmail.slice(0, 8)}@bankauctions.ai`;

    const record = {
      id: existing?.id || `S${1000 + staffList.length + 1}`,
      role: role,
      status: status,
      name: name.trim(),
      phone: phone.trim(),
      email: existing?.email || workEmail,
      dob: dob,
      emergency: emergency,
      personalEmail: personalEmail,
      tempAddress: tempAddress,
      permAddress: sameAddress ? tempAddress : permAddress,
      state: state,
      manager: manager,
      advocate: advocateProfile,
      cities: cities,
    };

    onSave(record);
  };

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
        <h2 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 16px' }}>
          {isNew ? 'Onboard staff' : `Edit ${name}`}
        </h2>

        {errors.length > 0 && (
          <div style={{ background: '#FFE9EE', color: '#9B1C47', padding: '12px 16px', borderRadius: '12px', marginBottom: '14px', fontSize: '13px' }}>
            <b>Please fix:</b>
            <ul style={{ margin: '6px 0 0', paddingLeft: '18px' }}>
              {errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
              Role
              <select
                className="cs"
                style={{ width: '100%', borderRadius: '12px' }}
                disabled={!isNew}
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {Object.keys(ROLES_CONFIG).map((r) => (
                  <option key={r} value={r}>
                    {ROLES_CONFIG[r]}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
              Account status
              <select
                className="cs"
                style={{ width: '100%', borderRadius: '12px' }}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="deactivated">Deactivated</option>
              </select>
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
              Full name
              <input
                className="cs"
                style={{ width: '100%', borderRadius: '12px' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Anand Sharma"
                required
              />
            </label>

            <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
              Date of birth
              <input
                type="date"
                className="cs"
                style={{ width: '100%', borderRadius: '12px' }}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </label>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
              Mobile number
              <input
                className="cs"
                style={{ width: '100%', borderRadius: '12px' }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit mobile"
                maxLength={10}
                required
              />
            </label>

            <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
              Emergency contact
              <input
                className="cs"
                style={{ width: '100%', borderRadius: '12px' }}
                value={emergency}
                onChange={(e) => setEmergency(e.target.value)}
                maxLength={10}
              />
            </label>
          </div>

          <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
            Personal email
            <input
              type="email"
              className="cs"
              style={{ width: '100%', borderRadius: '12px' }}
              value={personalEmail}
              onChange={(e) => setPersonalEmail(e.target.value)}
              placeholder="anand@example.com"
            />
          </label>

          {/* Role specific assignment */}
          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 800, margin: '0 0 10px' }}>Assignment</h3>
            {role === 'field' && (
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
                    State
                    <select
                      className="cs"
                      style={{ width: '100%', borderRadius: '12px' }}
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    >
                      {STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
                    Reporting manager
                    <select
                      className="cs"
                      style={{ width: '100%', borderRadius: '12px' }}
                      value={manager}
                      onChange={(e) => setManager(e.target.value)}
                    >
                      <option value="">Select a manager</option>
                      {marketingManagers.map((mgr) => (
                        <option key={mgr.id} value={mgr.id}>
                          {mgr.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
            )}

            {role === 'lawyer' && (
              <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
                Advocate profile shown to customers
                <input
                  className="cs"
                  style={{ width: '100%', borderRadius: '12px' }}
                  value={advocateProfile}
                  onChange={(e) => setAdvocateProfile(e.target.value)}
                  placeholder="e.g. Adv. Anand Sharma · Madras High Court"
                />
              </label>
            )}

            {(role === 'marketing' || role === 'checker') && (
              <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
                Assigned state
                <select
                  className="cs"
                  style={{ width: '100%', borderRadius: '12px' }}
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  {STATES.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
            <button type="submit" className="btn">
              {isNew ? 'Create account' : 'Save changes'}
            </button>
            <button type="button" className="btn out" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default AdminDashboardPage;
