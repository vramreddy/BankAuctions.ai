import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api";
import {
  Panel,
  Feedback,
  Status,
  inputClass,
} from "../../components/workflow/WorkflowUI";
export default function BuyerActivityPage() {
  const { id } = useParams(),
    [items, setItems] = useState([]),
    [detail, setDetail] = useState(null),
    [meta, setMeta] = useState({}),
    [page, setPage] = useState(1),
    [search, setSearch] = useState(""),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");
    setDetail(null);
    api
      .management(
        id
          ? `/buyers/${id}`
          : `/buyers?page=${page}&search=${encodeURIComponent(search)}`,
      )
      .then((r) => {
        if (active) {
          if (id) setDetail(r.data);
          else {
            setItems(r.data);
            setMeta(r.meta);
          }
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id, page, search]);
  const date = (value) =>
    value ? new Date(value).toLocaleString() : "Not recorded";
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Buyer activity</h1>
        <p className="text-slate-400 mt-2">
          Recorded account activity for support and follow-up. Access to a
          buyer's activity is audited.
        </p>
      </header>
      <Feedback error={error} />
      {loading && <p role="status">Loading buyer activity…</p>}
      {!id ? (
        <>
          <input
            aria-label="Search buyers"
            className={inputClass}
            placeholder="Search buyer name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <Panel>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr>
                    <th className="p-3">Buyer</th>
                    <th>Plan</th>
                    <th>Last login</th>
                    <th>Account</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((u) => (
                    <tr key={u.id} className="border-t border-slate-800">
                      <td className="p-3">
                        <Link
                          className="text-cyan-300"
                          to={`/checker/buyers/${u.id}`}
                        >
                          {u.fullName}
                        </Link>
                        <p className="text-slate-500 mt-1">{u.email}</p>
                      </td>
                      <td>{u.planTier}</td>
                      <td>{date(u.lastLoginAt)}</td>
                      <td>{u.isActive ? "Active" : "Suspended"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!loading && !items.length && (
                <p className="py-8 text-slate-400">
                  No matching buyer accounts.
                </p>
              )}
            </div>
          </Panel>
          {meta.totalPages > 1 && (
            <div className="flex gap-6 justify-center">
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
        </>
      ) : (
        detail && (
          <>
            <Link to="/checker/buyers" className="text-cyan-300">
              Back to buyers
            </Link>
            <Panel>
              <h2 className="text-2xl font-bold">{detail.buyer.fullName}</h2>
              <p className="text-slate-400 mt-2">
                {detail.buyer.email} · {detail.buyer.phone}
              </p>
              <p className="text-sm text-slate-400 mt-2">
                {detail.buyer.city} · {detail.buyer.planTier}
              </p>
            </Panel>
            <div className="grid lg:grid-cols-2 gap-5">
              <Panel>
                <h2 className="font-semibold mb-4">Recent successful logins</h2>
                {detail.logins.map((e) => (
                  <p key={e.id} className="text-sm text-slate-400 py-2">
                    {date(e.createdAt)}
                  </p>
                ))}
                {!detail.logins.length && <p>No recorded logins.</p>}
              </Panel>
              {["saved", "unlocked"].map((key) => (
                <Panel key={key}>
                  <h2 className="font-semibold mb-4 capitalize">
                    {key} assets
                  </h2>
                  {detail[key].map((e, i) => (
                    <div key={i} className="py-3 border-t border-slate-800">
                      <p>{e.auction.title}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {e.auction.city} · {e.auction.status} ·{" "}
                        {date(e.savedAt || e.unlockedAt)}
                      </p>
                    </div>
                  ))}
                  {!detail[key].length && (
                    <p className="text-slate-400 text-sm">No records.</p>
                  )}
                </Panel>
              ))}
              <Panel>
                <h2 className="font-semibold mb-4">
                  Enquiries and report requests
                </h2>
                {detail.requests.map((r) => (
                  <Link
                    key={r.id}
                    className="block py-3 border-t border-slate-800"
                    to={`/checker/requests/${r.id}`}
                  >
                    <p className="text-cyan-300 mb-2">{r.subject}</p>
                    <Status value={r.status} />
                  </Link>
                ))}
                {!detail.requests.length && (
                  <p className="text-slate-400 text-sm">No requests.</p>
                )}
              </Panel>
              <Panel>
                <h2 className="font-semibold mb-4">Plan recommendations</h2>
                {detail.recommendations.map((r) => (
                  <div key={r.id} className="flex justify-between py-3">
                    <span>{r.plan}</span>
                    <Status value={r.status} />
                  </div>
                ))}
                {!detail.recommendations.length && (
                  <p className="text-slate-400 text-sm">No recommendations.</p>
                )}
              </Panel>
              <Panel>
                <h2 className="font-semibold mb-4">Property purchases</h2>
                {detail.purchases.map((p) => (
                  <div key={p.id} className="border-t border-slate-800 py-3">
                    <p className="text-sm">
                      INR {(p.amountPaise / 100).toLocaleString()} ?{" "}
                      {date(p.createdAt)}
                    </p>
                    <Status value={p.status} />
                  </div>
                ))}
                {!detail.purchases.length && (
                  <p className="text-slate-400 text-sm">No purchases.</p>
                )}
              </Panel>
            </div>
          </>
        )
      )}
    </div>
  );
}
