import React, { useEffect, useRef, useState } from 'react';
import { Building2 } from 'lucide-react';
import './PromoterBanksMarquee.css';

const PROMOTER_BANKS = [
  ['sbi', 'State Bank of India', 'SBI'],
  ['bob', 'Bank of Baroda', 'Baroda'],
  ['canara', 'Canara Bank', 'Canara'],
  ['pnb', 'Punjab National Bank', 'PNB'],
  ['hdfc', 'HDFC Bank', 'HDFC'],
  ['icici', 'ICICI Bank', 'ICICI'],
  ['indianbank', 'Indian Bank', 'Indian Bank'],
  ['unionbank', 'Union Bank of India', 'Union Bank'],
  ['axis', 'Axis Bank', 'Axis'],
  ['kotak', 'Kotak Mahindra Bank', 'Kotak'],
  ['boi', 'Bank of India', 'Bank of India'],
  ['central', 'Central Bank of India', 'Central Bank']
];

function BankLogo({ id, name, short }) {
  const [failed, setFailed] = useState(false);
  return (
    <span className="lender-logo">
      {failed ? <span className="text-xs font-bold text-slate-700">{short}</span> : (
        <img src={`/images/banks/${id}.svg`} alt="" width="144" height="48"
          onError={() => setFailed(true)} title={`${name} logo`} draggable="false" />
      )}
    </span>
  );
}

export default function PromoterBanksMarquee() {
  const viewportRef = useRef(null);
  const groupRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [touching, setTouching] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (hovered || focused || touching || reducedMotion) return;
    const viewport = viewportRef.current;
    let frame;
    let previous;
    let position = viewport.scrollLeft;
    const tick = (time) => {
      const width = groupRef.current?.getBoundingClientRect().width || 0;
      if (previous !== undefined && width && !document.hidden) {
        // Retain fractional pixels for equally smooth movement on all displays.
        position = (position + Math.min(time - previous, 50) * 0.035) % width;
        viewport.scrollLeft = position;
      }
      previous = time;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hovered, focused, touching, reducedMotion]);

  const renderBanks = (duplicate = false) => (
    <div className="lender-group" ref={duplicate ? undefined : groupRef} aria-hidden={duplicate || undefined}>
      {PROMOTER_BANKS.map(([id, name, query]) => (
        <div key={id} className="lender-card">
          <span className="lender-logo-wrap">
            <BankLogo id={id} name={name} short={query} />
          </span>
          <span className="lender-name">{name}</span>
        </div>
      ))}
    </div>
  );

  return (
    <section className="lender-section" aria-labelledby="promoter-banks-title">
      <div className="lender-header">
        <div className="max-w-xl">
          <p className="lender-eyebrow">
            Empanelled Lenders &amp; Asset Reconstruction Companies
          </p>
          <h2 id="promoter-banks-title" className="lender-title">
            <Building2 size={24} className="text-sky-400" aria-hidden="true" /> Promoter Banks
          </h2>
          <p className="lender-description">Explore auction opportunities by bank.</p>
        </div>
      </div>
      <div className="lender-viewport" ref={viewportRef} tabIndex={0} role="region" aria-label="Bank logos"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
        onTouchStart={() => setTouching(true)} onTouchEnd={() => setTouching(false)}
        onTouchCancel={() => setTouching(false)}>
        <div className="lender-track">{renderBanks()}{renderBanks(true)}</div>
      </div>
    </section>
  );
}



