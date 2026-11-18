import React from 'react';
import {Outlet,Link} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import Button from '../components/common/Button';
export default function MarketingLayout(){const {logout,user}=useAuth();return <div className="min-h-screen bg-slate-950"><header className="border-b border-white/10 px-6 py-4"><div className="mx-auto flex max-w-7xl flex-wrap justify-between gap-4"><div><Link to="/" className="text-sm text-cyan-300">BankAuctions.ai</Link><h1 className="mt-1 font-semibold">Marketing workspace</h1></div><div className="flex items-center gap-4"><span className="text-sm text-slate-400">{user.fullName}</span><Button variant="secondary" onClick={logout}>Sign out</Button></div></div></header><main className="mx-auto max-w-7xl px-6 py-8"><Outlet/></main></div>;}
