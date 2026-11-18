import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import Button from "../../components/common/Button";
import {
  Panel,
  Status,
  Feedback,
  Empty,
  inputClass,
} from "../../components/workflow/WorkflowUI";
export default function NoticeQueuePage() {
  const [items, setItems] = useState([]),
    [status, setStatus] = useState(""),
    [query, setQuery] = useState(""),
    [loading, setLoading] = useState(true),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function load() {
    setLoading(true);
    try {
      const res = await api.workflow(
        `/notices${status ? "?status=" + status : ""}`,
      );
      setItems(res.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, [status]);
  async function upload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (file.size > 10 * 1024 * 1024)
        throw new Error("JSON upload must be smaller than 10 MB.");
      const records = JSON.parse(await file.text());
      const res = await api.workflow("/notices/import", {
        method: "POST",
        body: JSON.stringify({ records, sourceName: file.name }),
      });
      setMessage(
        `${res.data.imported.length} notice(s) queued for review; ${res.data.duplicates.length} duplicate(s) skipped. None are published yet.`,
      );
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
      event.target.value = "";
    }
  }
  const filtered = items.filter((item) =>
    JSON.stringify([
      item.reviewed.bankName,
      item.reviewed.city,
      item.reviewed.propertyAddress,
      item.sourceName,
    ])
      .toLowerCase()
      .includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-cyan-400">
            Checker / Notice registry
          </p>
          <h1 className="mt-2 text-3xl font-bold">Review before publication</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Import the extracted JSON, verify the source and resolve conflicts.
            Only approved auctions reach buyers.
          </p>
        </div>
        <label className="cursor-pointer rounded-xl bg-cyan-400 px-4 py-3 text-sm font-bold text-slate-950">
          {busy ? "Importing…" : "Import notice JSON"}
          <input
            aria-label="Import notice JSON"
            className="sr-only"
            type="file"
            accept=".json,application/json"
            disabled={busy}
            onChange={upload}
          />
        </label>
      </div>
      <Link
        to="/checker/new-asset"
        className="inline-flex rounded-xl border border-cyan-400/40 px-4 py-3 text-cyan-300"
      >
        Enter a new asset manually
      </Link>
      <Feedback error={error} message={message} />
      <Panel>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            aria-label="Search notice registry"
            className={inputClass}
            placeholder="Bank, address, city or source file"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            aria-label="Review status"
            className={inputClass}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All review statuses</option>
            {[
              "PENDING_CHECKER",
              "NEEDS_CORRECTION",
              "APPROVED",
              "REJECTED",
            ].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </div>
      </Panel>
      {loading ? (
        <p role="status">Loading notices…</p>
      ) : !filtered.length ? (
        <Empty>
          No notices found. Import a JSON extraction to start the checker
          workflow.
        </Empty>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Panel key={item.id}>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="mb-2 flex flex-wrap gap-2">
                    <Status value={item.status} />
                    <Status
                      value={item.reviewed.noticeType || "Unclassified"}
                    />
                  </div>
                  <h2 className="font-semibold">
                    {item.reviewed.bankName || "Bank requires review"} ·{" "}
                    {item.reviewed.assetType || "Asset type missing"}
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm text-slate-400">
                    {item.reviewed.propertyAddress ||
                      "Property address missing"}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {item.sourceName} · Revision {item.version}
                  </p>
                </div>
                <Link
                  className="rounded-xl border border-cyan-400/30 px-4 py-2 text-sm text-cyan-300 hover:bg-cyan-400/10"
                  to={`/checker/verify/${item.id}`}
                >
                  Open review
                </Link>
              </div>
            </Panel>
          ))}
        </div>
      )}
    </div>
  );
}
