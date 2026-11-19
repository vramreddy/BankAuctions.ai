import React from 'react';

export default function AdminNavbar({ user, onLogout }) {
  const staffName = user?.name || 'Rahul D.';
  const staffRole = user?.role === 'ADMIN' ? 'Admin' : (user?.role || 'Admin');

  return (
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

        <nav className="stnav" id="stnav" aria-label="Staff">
          <a href="http://localhost:5174" className="on">
            Admin
          </a>
          <a href="http://localhost:5175">
            Exception queue
          </a>
          <a href="http://localhost:5176">
            Consultations
          </a>
          <a href="http://localhost:5177">
            Site visits
          </a>
        </nav>

        <div className="right">
          <span id="stwho" className="stwho">
            {staffName} · {staffRole}
          </span>
          <a className="btn wh sm" href="http://localhost:5173" target="_blank" rel="noreferrer">
            Public site
          </a>
          <button className="btn sm" id="stout" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </div>
    </header>
  );
}
