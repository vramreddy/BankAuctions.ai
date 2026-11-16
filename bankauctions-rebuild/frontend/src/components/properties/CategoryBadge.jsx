import React from 'react';
import { Building2, Home, MapPin, Store, Briefcase, Warehouse, Truck } from 'lucide-react';

const ICON_MAP = {
  flat: Building2,
  house: Home,
  land: MapPin,
  shop: Store,
  office: Briefcase,
  warehouse: Warehouse,
  vehicle: Truck
};

export function CategoryBadge({ categoryCode, categoryName, className = '' }) {
  const Icon = ICON_MAP[categoryCode] || Building2;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-200 ${className}`}>
      <Icon className="w-3.5 h-3.5 text-accent-cyan" />
      <span>{categoryName || categoryCode}</span>
    </span>
  );
}

export default CategoryBadge;
