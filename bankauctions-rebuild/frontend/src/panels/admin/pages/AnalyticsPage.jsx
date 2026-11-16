import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, BarChart3, Globe, DollarSign, Activity } from 'lucide-react';
import { api } from '../../../services/api';
import GlassCard from '../../../components/common/GlassCard';
import SpecularBadge from '../../../components/common/SpecularBadge';

export default function AnalyticsPage() {
  const { data: overview } = useQuery({
    queryKey: ['admin-overview-analytics'],
    queryFn: async () => {
      const res = await api.get('/admin/overview');
      return res.data?.data || {};
    }
  });

  // Analytics Datasets
  const monthlyTrendsData = [
    { month: 'Jun', lotsImported: 240, verified: 220, published: 210, searches: 4200 },
    { month: 'Jul', lotsImported: 310, verified: 295, published: 280, searches: 5800 },
    { month: 'Aug', lotsImported: 450, verified: 430, published: 415, searches: 8100 },
    { month: 'Sep', lotsImported: 580, verified: 560, published: 540, searches: 12400 },
    { month: 'Oct', lotsImported: 720, verified: 690, published: 660, searches: 18900 },
    { month: 'Nov', lotsImported: 910, verified: 880, published: 850, searches: 26500 },
  ];

  const categoryDistributionData = [
    { name: 'Residential', value: 45, color: '#00E5FF' },
    { name: 'Commercial', value: 25, color: '#3B82F6' },
    { name: 'Industrial', value: 15, color: '#F59E0B' },
    { name: 'Agricultural', value: 10, color: '#10B981' },
    { name: 'Vehicles', value: 5, color: '#8B5CF6' },
  ];

  const bankDistributionData = [
    { bank: 'State Bank of India', count: 184, volumeCr: 240 },
    { bank: 'HDFC Bank', count: 142, volumeCr: 310 },
    { bank: 'Bank of Baroda', count: 110, volumeCr: 165 },
    { bank: 'Punjab National Bank', count: 96, volumeCr: 120 },
    { bank: 'ICICI Bank', count: 88, volumeCr: 195 },
    { bank: 'Canara Bank', count: 74, volumeCr: 90 },
  ];

  const priceBracketData = [
    { bracket: '< 25L', percentage: 22 },
    { bracket: '25L - 50L', percentage: 34 },
    { bracket: '50L - 1Cr', percentage: 26 },
    { bracket: '1Cr - 5Cr', percentage: 14 },
    { bracket: '> 5Cr', percentage: 4 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-mono font-semibold text-accent-cyan uppercase tracking-wider">Business Intelligence</span>
          <span className="text-slate-600">•</span>
          <span className="text-xs text-slate-400">Platform Analytics</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Market Dynamics & Asset Metrics</h1>
        <p className="text-sm text-slate-400 mt-1">
          Comprehensive telemetry tracking inventory velocity, asset valuation distributions, SARFAESI resolution timelines, and search intent.
        </p>
      </div>

      {/* Top Level Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Cumulative Asset Book</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">₹ 1,120.4 Cr</div>
          <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last quarter
          </div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Monthly Search Volume</span>
            <Activity className="w-4 h-4 text-accent-cyan" />
          </div>
          <div className="text-2xl font-bold text-accent-cyan mt-2 font-mono">26,500+</div>
          <div className="text-xs text-slate-400 mt-1">High-intent investor queries</div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Avg Discount to Market</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">28.4%</div>
          <div className="text-xs text-slate-400 mt-1">Below prevailing market guideline</div>
        </GlassCard>

        <GlassCard className="p-5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-mono uppercase">Avg Days to Auction</span>
            <Globe className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2 font-mono">21 Days</div>
          <div className="text-xs text-slate-400 mt-1">From notice publication</div>
        </GlassCard>
      </div>

      {/* Chart Row 1: Pipeline Velocity & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline Trend */}
        <GlassCard className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Listing Pipeline & Publication Velocity</h3>
              <p className="text-xs text-slate-400">Monthly volume of raw notices ingested vs verified vs publicly discovered</p>
            </div>
            <SpecularBadge variant="cyan">6-Month Trend</SpecularBadge>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendsData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="month" stroke="#64748B" fontStyle="normal" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F1A34', 
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="lotsImported" name="Notices Ingested" stroke="#64748B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="verified" name="Checker Verified" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="published" name="Published Live" stroke="#00E5FF" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Category Share */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-white">Asset Class Share</h3>
            <PieIcon className="w-4 h-4 text-accent-cyan" />
          </div>
          <p className="text-xs text-slate-400 mb-4">Percentage breakdown by primary property category</p>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F1A34', 
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff' 
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {categoryDistributionData.map(item => (
              <div key={item.name} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300">{item.name}</span>
                <span className="font-mono text-slate-400 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Chart Row 2: Top Banks & Ticket Sizes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leading Banks Volume */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Leading Institutions by Lot Count</h3>
              <p className="text-xs text-slate-400">Total active auctions categorized by financial lender</p>
            </div>
            <SpecularBadge variant="emerald">Live Registry</SpecularBadge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bankDistributionData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={12} />
                <YAxis dataKey="bank" type="category" stroke="#94A3B8" fontSize={11} width={130} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F1A34', 
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff' 
                  }} 
                />
                <Bar dataKey="count" name="Auction Lots" fill="#3B82F6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Reserve Price Bracket Breakdown */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Reserve Price Distribution</h3>
              <p className="text-xs text-slate-400">Asset volume categorized by starting reserve price tier</p>
            </div>
            <SpecularBadge variant="purple">Ticket Sizes</SpecularBadge>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priceBracketData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis dataKey="bracket" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F1A34', 
                    borderColor: '#334155',
                    borderRadius: '8px',
                    color: '#fff' 
                  }} 
                />
                <Bar dataKey="percentage" name="Percentage of Catalog" fill="#00E5FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
