import React, { useState } from 'react';

const STAFF_MEMBERS = [
  { role: 'admin', label: 'Admin', id: 'A1', name: 'Rahul D.', email: 'rahul.d@bankauctions.ai' },
  { role: 'checker', label: 'Checker', id: 'C1', name: 'Latha M.', email: 'latha.m@bankauctions.ai' },
  { role: 'lawyer', label: 'Advocate', id: 'L1', name: 'Adv. K. Ramesh', email: 'k.ramesh@bar.bankauctions.ai' },
  { role: 'field', label: 'Field engineer', id: 'F1', name: 'Karthik S.', email: 'karthik.s@bankauctions.ai' },
  { role: 'marketing', label: 'Marketing', id: 'M1', name: 'Meera N.', email: 'meera.n@bankauctions.ai' },
  { role: 'leadership', label: 'Leadership', id: 'LD1', name: 'Sanjay K.', email: 'sanjay.k@bankauctions.ai' },
];

export default function AdminLoginPage({ onLoginSuccess }) {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [selectedMemberId, setSelectedMemberId] = useState('A1');
  const [password, setPassword] = useState('demo');
  const [error, setError] = useState(null);

  const availableMembers = STAFF_MEMBERS.filter((m) => m.role === selectedRole);
  const currentMember =
    availableMembers.find((m) => m.id === selectedMemberId) || availableMembers[0] || STAFF_MEMBERS[0];

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    const members = STAFF_MEMBERS.filter((m) => m.role === role);
    if (members.length > 0) {
      setSelectedMemberId(members[0].id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    const user = {
      id: currentMember.id,
      name: currentMember.name,
      email: currentMember.email,
      role: currentMember.role === 'admin' ? 'ADMIN' : currentMember.role.toUpperCase(),
      roleKey: currentMember.role,
    };
    localStorage.setItem('ba_admin_token', 'demo-staff-token');
    localStorage.setItem(
      'ba3_staff',
      JSON.stringify({
        id: currentMember.id,
        name: currentMember.name,
        email: currentMember.email,
        role: currentMember.role,
      })
    );

    // Write to prototype audit log
    try {
      const audits = JSON.parse(localStorage.getItem('ba3_audit') || '[]');
      audits.push({
        who: currentMember.name,
        role: currentMember.label,
        what: 'Signed in',
        at: Date.now(),
      });
      localStorage.setItem('ba3_audit', JSON.stringify(audits));
    } catch (_) {}

    onLoginSuccess(user);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="sthd">
        <div className="w">
          <a className="logo" href="/" aria-label="BankAuctions.ai home">
            <svg className="lg" viewBox="0 0 48 48" aria-hidden="true" style={{ width: 34, height: 34 }}>
              <defs>
                <linearGradient id="lgg" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#2DD4BF" />
                  <stop offset="1" stopColor="#0B5D57" />
                </linearGradient>
              </defs>
              <rect width="48" height="48" rx="13" fill="url(#lgg)" />
              <path d="M10 23 24 11l14 12v14a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2z" fill="#fff" />
              <rect x="15" y="27" width="4.5" height="10" rx="1" fill="#0F766E" />
              <rect x="21.8" y="23" width="4.5" height="14" rx="1" fill="#0F766E" />
              <rect x="28.6" y="19" width="4.5" height="18" rx="1" fill="#0F766E" />
            </svg>
            <span className="lt">
              <span className="wm">
                bank<span>auctions</span>.ai
              </span>
            </span>
          </a>
          <span className="stl">Staff workspace</span>
          <div className="right" style={{ marginLeft: 'auto' }}>
            <a className="btn wh sm" href="http://localhost:5173" target="_blank" rel="noreferrer">
              Public site
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="stbox" style={{ width: '100%', maxWidth: '460px', margin: '0 auto' }}>
          <span className="pill">STAFF ONLY</span>
          <h2 style={{ margin: '12px 0 6px', fontSize: '28px', fontWeight: 800 }}>Staff login</h2>
          <p style={{ color: 'var(--mute)', margin: '0 0 18px', fontSize: '14px' }}>
            For BankAuctions.ai staff and empanelled advocates. Not for customers. Prototype: any password works.
          </p>

          {error && (
            <div className="ok" style={{ background: '#FFE9EE', color: '#9B1C47', padding: '10px 14px', borderRadius: '10px', marginBottom: '14px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="form" style={{ maxWidth: 'none', display: 'grid', gap: '14px' }}>
            <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
              Role
              <select
                value={selectedRole}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="cs"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px' }}
              >
                <option value="admin">Admin</option>
                <option value="checker">Checker</option>
                <option value="lawyer">Advocate</option>
                <option value="field">Field engineer</option>
                <option value="marketing">Marketing</option>
                <option value="leadership">Leadership</option>
              </select>
            </label>

            <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
              Staff member
              <select
                value={currentMember.id}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                className="cs"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px' }}
              >
                {availableMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </label>

            <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
              Registered email
              <input
                type="email"
                readOnly
                value={currentMember.email}
                className="cs"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px', background: '#F6F6F8' }}
              />
            </label>

            <label style={{ display: 'grid', gap: '4px', fontSize: '13px', fontWeight: 700 }}>
              Password
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cs"
                style={{ width: '100%', padding: '10px 14px', borderRadius: '12px' }}
              />
            </label>

            <button type="submit" className="btn" style={{ width: '100%', marginTop: '6px' }}>
              Sign in
            </button>
          </form>

          <p style={{ color: 'var(--mute)', fontSize: '13px', marginTop: '18px', lineHeight: 1.5 }}>
            Each role opens its own workspace: checkers verify exceptions and field reports, advocates run consultations, field engineers verify sites, marketing runs campaigns, admin runs the platform and leadership reads the numbers. Field engineers can also use the Android field app with their mobile number and OTP.
          </p>
        </div>
      </main>
    </div>
  );
}
