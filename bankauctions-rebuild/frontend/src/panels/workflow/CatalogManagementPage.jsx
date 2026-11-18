import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import {
  Panel,
  Feedback,
  Status,
  inputClass,
} from "../../components/workflow/WorkflowUI";
export default function CatalogManagementPage() {
  const navigate = useNavigate(),
    [items, setItems] = useState([]),
    [meta, setMeta] = useState({}),
    [page, setPage] = useState(1),
    [search, setSearch] = useState(""),
    [notes, setNotes] = useState({}),
    [fees, setFees] = useState({}),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    try {
      const res = await api.management(
        `/assets?page=${page}&search=${encodeURIComponent(search)}`,
      );
      setItems(res.data);
      setMeta(res.meta);
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, [page, search]);
  async function act(item, action, extra = {}) {
    setBusy(true);
    setError("");
    try {
      await api.management(`/assets/${item.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          action,
          version: item.extraction.version,
          notes: notes[item.id] || "",
          ...extra,
        }),
      });
      if (action === "REVISE")
        navigate(`/checker/verify/${item.extraction.id}`);
      else await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-6">
      <header className="flex flex-wrap justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Buyer asset catalog</h1>
          <p className="mt-2 text-slate-400">
            Control publication, premium placement and source-reviewed
            corrections.
          </p>
        </div>
        <Link
          to="/checker/queue"
          className="btn-primary rounded-xl px-4 py-3 self-center"
        >
          Add assets through notice registry
        </Link>
      </header>
      <Feedback error={error} />
      <input
        aria-label="Find catalog assets"
        className={inputClass}
        placeholder="Search asset title or city"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />
      <p className="text-sm text-slate-400">
        {meta.total || 0} reviewed assets
      </p>
      {items.map((item) => (
        <Panel key={item.id}>
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">{item.title}</h2>
              <p className="text-slate-400 capitalize mt-2">
                {item.city} · {item.locality}
              </p>
              <div className="flex gap-2 mt-3">
                <Status value={item.status} />
                {item.isPremium && <Status value="PREMIUM" />}
                {item.featured && <Status value="FEATURED" />}
              </div>
            </div>
            {item.status === "PUBLISHED" && (
              <Link
                target="_blank"
                className="text-cyan-300"
                to={`/lot/${item.id}`}
              >
                Preview buyer listing
              </Link>
            )}
          </div>
          <div className="mt-5 flex flex-wrap items-end gap-3">
            <label className="text-sm text-slate-400">
              Property access fee (INR)
              <input
                type="number"
                min="0.01"
                step="0.01"
                aria-label={`Access fee for ${item.title}`}
                className={inputClass}
                value={
                  fees[item.id] ??
                  (item.accessPricePaise ? item.accessPricePaise / 100 : "")
                }
                onChange={(e) =>
                  setFees({ ...fees, [item.id]: e.target.value })
                }
              />
            </label>
            <button
              disabled={busy || item.extraction?.status !== "APPROVED"}
              className="btn-secondary px-4 py-3 rounded-xl"
              onClick={() => {
                const value =
                  fees[item.id] ??
                  (item.accessPricePaise ? item.accessPricePaise / 100 : "");
                act(item, "ACCESS_PRICE", {
                  accessPricePaise:
                    value === "" ? null : Math.round(Number(value) * 100),
                });
              }}
            >
              Save access fee
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Separate from reserve price and EMD. Online collection remains
            disabled until a provider is configured.
          </p>
          <textarea
            aria-label={`Change reason for ${item.title}`}
            className={`${inputClass} mt-5`}
            placeholder="Record the reason before changing this asset"
            value={notes[item.id] || ""}
            onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })}
          />
          {item.extraction?.status === "APPROVED" ? (
            <div className="flex flex-wrap gap-3 mt-4">
              <button
                disabled={busy}
                className="btn-secondary px-4 py-2 rounded-xl"
                onClick={() =>
                  act(
                    item,
                    item.status === "PUBLISHED" ? "WITHDRAW" : "PUBLISH",
                  )
                }
              >
                {item.status === "PUBLISHED"
                  ? "Withdraw from buyers"
                  : "Publish approved asset"}
              </button>
              <button
                disabled={busy}
                className="btn-secondary px-4 py-2 rounded-xl"
                onClick={() =>
                  act(item, "PRESENTATION", {
                    isPremium: !item.isPremium,
                    featured: item.featured,
                  })
                }
              >
                {item.isPremium ? "Remove premium status" : "Mark premium"}
              </button>
              <button
                disabled={busy}
                className="btn-secondary px-4 py-2 rounded-xl"
                onClick={() =>
                  act(item, "PRESENTATION", {
                    isPremium: item.isPremium,
                    featured: !item.featured,
                  })
                }
              >
                {item.featured ? "Remove from featured" : "Mark featured"}
              </button>
              <button
                disabled={busy}
                className="text-cyan-300 px-4"
                onClick={() => act(item, "REVISE")}
              >
                Withdraw &amp; revise details
              </button>
            </div>
          ) : (
            <Link
              className="text-cyan-300 inline-block mt-4"
              to={`/checker/verify/${item.extraction?.id}`}
            >
              Continue pending source review
            </Link>
          )}
        </Panel>
      ))}
      {!items.length && (
        <Panel>
          No reviewed assets yet. Import fresh source data in the notice
          registry.
        </Panel>
      )}
      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-6">
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            {page} / {meta.totalPages}
          </span>
          <button
            disabled={page >= meta.totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
