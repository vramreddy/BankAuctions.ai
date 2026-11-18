import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import { useCity } from "../../../contexts/CityContext";
import { capabilities } from "@shared/constants/entitlements.js";
import { PropertyCard } from "../../../components/properties/PropertyCard";
import { downloadJson } from "../../../components/workflow/WorkflowUI";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const { user } = useAuth();
  const { selectedCity, allCities } = useCity();
  const caps = capabilities(user);
  const [items, setItems] = useState([]),
    [categories, setCategories] = useState([]),
    [banks, setBanks] = useState([]);
  const [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [meta, setMeta] = useState({});
  const key = params.toString();
  const filters = Object.fromEntries(params);
  if (!filters.city) filters.city = selectedCity;
  if (!caps.bankFilters) delete filters.bankId;
  if (!caps.dateFilters) delete filters.days;
  if (!caps.possessionFilters) {
    delete filters.possession;
    delete filters.prem;
  }
  if (!caps.valueFilters) delete filters.minMarketValue;
  useEffect(() => {
    let active = true;
    Promise.all([api.getCategories(), api.getBanks()])
      .then(([c, b]) => {
        if (active) {
          setCategories(c.data);
          setBanks(b.data);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    const timer = setTimeout(
      () =>
        api
          .getAuctions({ ...filters, limit: 24 })
          .then((res) => {
            if (active) {
              setItems(res.data);
              setMeta(res.meta);
            }
          })
          .catch((e) => {
            if (active) {
              setError(e.message);
              setItems([]);
            }
          })
          .finally(() => {
            if (active) setLoading(false);
          }),
      200,
    );
    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [key, selectedCity, user?.planTier, user?.role]);
  function change(name, value) {
    const next = new URLSearchParams(params);
    value ? next.set(name, value) : next.delete(name);
    if (name !== "page") next.delete("page");
    setParams(next, { replace: true });
  }
  const selectClass =
    "w-full rounded-xl bg-slate-900 border border-slate-700 p-3 text-sm text-white";
  const select = (name, label, options) => (
    <label className="text-xs text-slate-400 space-y-2">
      <span>{label}</span>
      <select
        aria-label={label}
        className={selectClass}
        value={filters[name] || ""}
        onChange={(e) => change(name, e.target.value)}
      >
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </label>
  );
  async function exportResults() {
    try {
      setError("");
      const res = await api.exportAuctions(filters);
      downloadJson(res.data, "approved-auctions.json");
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap justify-between gap-4">
        <div>
          <p className="text-cyan-300 text-xs uppercase tracking-widest">
            {(user?.planTier || "FREE").replaceAll("_", " ")} access
          </p>
          <h1 className="text-3xl font-bold mt-2">Explore verified auctions</h1>
          <p className="text-slate-400 mt-2">
            Every listed asset has been reviewed and approved by a checker.
          </p>
        </div>
        <Link to="/buyer/requests" className="text-cyan-300 self-center">
          Ask your checker
        </Link>
      </div>
      <section className="glass-panel rounded-3xl p-5 space-y-5">
        <input
          aria-label="Search assets"
          className={selectClass}
          placeholder="Search locality, asset or bank name"
          value={filters.search || ""}
          onChange={(e) => change("search", e.target.value)}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {select("city", "Location", [
            ["all", "All locations"],
            ...Object.entries(allCities).map(([id, c]) => [id, c.name]),
          ])}
          {select("cat", "Asset category", [
            ["", "All assets"],
            ...categories.map((c) => [c.slug, c.name]),
          ])}
          {select("maxBudget", "Maximum reserve price", [
            ["", "Any budget"],
            ["2500000", "INR 25 lakh"],
            ["5000000", "INR 50 lakh"],
            ["10000000", "INR 1 crore"],
          ])}
          {select("sort", "Sort by", [
            ["", "Recently approved"],
            ["days", "Auction date"],
            ["price_asc", "Lowest reserve price"],
            ["price_desc", "Highest reserve price"],
          ])}
          {caps.bankFilters &&
            select("bankId", "Lender", [
              ["", "All lenders"],
              ...banks.map((b) => [b.id, b.name]),
            ])}
          {caps.dateFilters &&
            select("days", "Auction scheduled within", [
              ["", "Any date"],
              ["7", "7 days"],
              ["30", "30 days"],
              ["90", "90 days"],
            ])}
          {caps.possessionFilters &&
            select("possession", "Possession", [
              ["", "Any possession"],
              ["Physical possession", "Physical possession"],
              ["Symbolic possession", "Symbolic possession"],
            ])}
          {caps.valueFilters && (
            <label className="text-xs text-slate-400 space-y-2">
              <span>Minimum verified market value (INR)</span>
              <input
                aria-label="Minimum market value"
                type="number"
                min="0"
                className={selectClass}
                value={filters.minMarketValue || ""}
                onChange={(e) => change("minMarketValue", e.target.value)}
              />
            </label>
          )}
        </div>
        <div className="flex flex-wrap gap-5 text-sm">
          <button
            onClick={() => setParams({ city: filters.city })}
            className="text-slate-300"
          >
            Clear filters
          </button>
          {caps.export && (
            <button onClick={exportResults} className="text-cyan-300">
              Export results (up to 1,000)
            </button>
          )}
          {!caps.bankFilters && (
            <Link to="/buyer/requests" className="text-cyan-300">
              Ask about Pro search filters
            </Link>
          )}
        </div>
      </section>
      {error && (
        <p role="alert" className="p-4 rounded-xl bg-red-950 text-red-200">
          {error}
        </p>
      )}
      <p className="text-slate-400" aria-live="polite">
        {loading
          ? "Loading verified assets…"
          : `${meta.total || 0} approved assets`}
      </p>
      {!loading && !error && items.length === 0 && (
        <div className="glass-panel p-12 rounded-3xl text-center">
          <h2 className="text-xl font-semibold">
            No approved assets match these filters
          </h2>
          <p className="text-slate-400 mt-3">
            Try another location or check back after the next checker review.
          </p>
        </div>
      )}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          items.map((item) => <PropertyCard key={item.id} auction={item} />)}
      </div>
      {meta.totalPages > 1 && (
        <nav
          aria-label="Results pages"
          className="flex justify-center items-center gap-6"
        >
          <button
            disabled={meta.page <= 1 || loading}
            onClick={() => change("page", String(meta.page - 1))}
          >
            Previous
          </button>
          <span>
            Page {meta.page} of {meta.totalPages}
          </span>
          <button
            disabled={meta.page >= meta.totalPages || loading}
            onClick={() => change("page", String(meta.page + 1))}
          >
            Next
          </button>
        </nav>
      )}
    </main>
  );
}
