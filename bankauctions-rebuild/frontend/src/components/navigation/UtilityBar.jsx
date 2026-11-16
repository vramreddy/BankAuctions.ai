import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock3, Mail, Phone, Globe2, CircleHelp } from 'lucide-react';
import { LANGUAGES } from '../../i18n/translation';
import { useLanguage } from '../../i18n/LanguageContext';

export default function UtilityBar() {
  const { language, setLanguage, locale } = useLanguage();
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric'
  });
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
  });
  const [now, setNow] = useState(() => new Date());
  const email = import.meta.env.VITE_SUPPORT_EMAIL?.trim() || 'bankauction@gmail.com';
  const phone = import.meta.env.VITE_SUPPORT_PHONE?.trim();
  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="border-t-2 border-t-cyan-400 border-b border-b-slate-300/70 bg-[#dce6ef] text-slate-800">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-5 gap-y-2 px-4 py-2 text-[11px] sm:px-6 sm:text-xs lg:px-8">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <time dateTime={now.toISOString()} className="inline-flex items-center gap-2 whitespace-nowrap tabular-nums" aria-label="Current date and time in India">
            <Clock3 size={14} aria-hidden="true" className="shrink-0" />
            {dateFormatter.format(now).replaceAll(' ', '-')} {timeFormatter.format(now)}
            <span className="text-[10px] text-slate-500">IST</span>
          </time>
          {email && <a href={`mailto:${email}`} className="inline-flex items-center gap-2 break-all hover:text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700">
            <Mail size={14} aria-hidden="true" className="shrink-0" />{email}
          </a>}
          {phone && <a href={`tel:${phone.replace(/[^+\d]/g, '')}`} className="inline-flex items-center gap-2 whitespace-nowrap hover:text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700">
            <Phone size={14} aria-hidden="true" />{phone}
          </a>}
          {!email && !phone && <Link to="/guides" className="inline-flex items-center gap-2 hover:text-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700">
            <CircleHelp size={14} aria-hidden="true" />Buyer help &amp; guides
          </Link>}
        </div>
        <label className="inline-flex items-center gap-2 whitespace-nowrap">
          <Globe2 size={14} aria-hidden="true" />
          <span className="sr-only">Language</span>
          <select value={language} onChange={event => setLanguage(event.target.value)} aria-label="Language"
            className="max-w-36 cursor-pointer rounded-md border border-slate-400/50 bg-white/40 py-1 pl-2 pr-6 text-xs text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-700">
            {LANGUAGES.map(item => <option key={item.code} value={item.code} lang={item.code} translate="no">{item.name}</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}
