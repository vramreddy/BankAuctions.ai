import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { PropertyCard } from '../../../components/properties/PropertyCard';
import { Bookmark, Unlock, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/common/Button';

export function SavedPropertiesPage() {
  const [tab, setTab] = useState('saved'); // 'saved' or 'unlocked'
  const [savedList, setSavedList] = useState([]);
  const [unlockedList, setUnlockedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [savedRes, unlockedRes] = await Promise.all([
          api.getSavedProperties(),
          api.getUnlockedProperties()
        ]);
        if (savedRes.success) setSavedList(savedRes.data);
        if (unlockedRes.success) setUnlockedList(unlockedRes.data);
      } catch (err) {
        console.error('Failed to load archive:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSaveToggle = (id, isSaved) => {
    if (!isSaved) {
      setSavedList((prev) => prev.filter((item) => item.auctionId !== id && item.auction?.id !== id));
    }
  };

  const activeList = tab === 'saved' ? savedList : unlockedList;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Personal Property Archive</h2>
          <p className="text-xs text-slate-400 mt-1">Bookmarked auction listings and permanently unlocked dossiers</p>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-brand-900/60 border border-slate-700/60">
          <button
            onClick={() => setTab('saved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              tab === 'saved'
                ? 'bg-brand-cyan/20 text-brand-cyan shadow-glow-cyan'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Bookmarks ({savedList.length})</span>
          </button>
          <button
            onClick={() => setTab('unlocked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              tab === 'unlocked'
                ? 'bg-emerald-500/20 text-emerald-400 shadow-glow-emerald'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Unlocked Dossiers ({unlockedList.length})</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="aspect-[16/11] rounded-2xl glass-card animate-pulse" />
          ))}
        </div>
      ) : activeList.length === 0 ? (
        <div className="p-16 rounded-3xl glass-card text-center space-y-4">
          <FileText className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-base font-bold text-white">
            {tab === 'saved' ? 'No saved bookmarks yet' : 'No unlocked dossiers yet'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {tab === 'saved'
              ? 'Click the heart icon on any auction card to bookmark it for quick access.'
              : 'Unlock detailed engineer inspection reports and GPS landmarks using Pro pack credits.'}
          </p>
          <Link to="/search">
            <Button variant="outline" size="sm">Explore Public Auctions</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {activeList.map((item) => {
            const auction = item.auction;
            if (!auction) return null;
            return (
              <PropertyCard
                key={item.id}
                auction={auction}
                isSaved={tab === 'saved'}
                onSaveToggle={handleSaveToggle}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}


export default SavedPropertiesPage;
