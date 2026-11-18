import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import {
  Panel,
  Field,
  Feedback,
  inputClass,
} from "../../components/workflow/WorkflowUI";
export default function BuyerContentPage() {
  const loadSequence = useRef(0);
  const [pages, setPages] = useState([]),
    [slug, setSlug] = useState("terms"),
    [draft, setDraft] = useState({ title: "", body: "" }),
    [notes, setNotes] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const item = pages.find((p) => p.slug === slug);
  async function load() {
    const sequence = ++loadSequence.current;
    try {
      const res = await api.management("/pages");
      if (sequence !== loadSequence.current) return;
      setPages(res.data);
      setDraft(
        res.data.find((p) => p.slug === slug)?.draft || { title: "", body: "" },
      );
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, [slug]);
  async function save(action) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await api.management(`/pages/${slug}`, {
        method: "PATCH",
        body: JSON.stringify({
          ...draft,
          notes,
          action,
          version: item.version,
        }),
      });
      await load();
      setMessage(
        action === "PUBLISH"
          ? "Published for buyers."
          : action === "WITHDRAW"
            ? "Public page withdrawn."
            : "Draft saved. Buyers still see the published version.",
      );
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold">Buyer-facing content</h1>
        <p className="text-slate-400 mt-2">
          Manage reviewed terms, privacy, payment instructions and refund
          information. Saving a draft does not publish it.
        </p>
      </header>
      <Feedback error={error} message={message} />
      <div className="flex flex-wrap gap-3">
        {pages.map((p) => (
          <button
            key={p.slug}
            className={`px-4 py-2 rounded-xl ${slug === p.slug ? "bg-cyan-400 text-slate-950" : "bg-slate-800"}`}
            disabled={busy}
            onClick={() => { setDraft(p.draft); setNotes(''); setSlug(p.slug); }}
          >
            {p.draft.title}
          </button>
        ))}
      </div>
      {item && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Panel>
            <div className="space-y-4">
              <Field label="Page title">
                <input
                  className={inputClass}
                  value={draft.title}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                />
              </Field>
              <Field label="Page text">
                <textarea
                  rows={16}
                  className={inputClass}
                  value={draft.body}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                />
              </Field>
              <Field label="Reason for this change">
                <textarea
                  className={inputClass}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Field>
              <p className="text-xs text-slate-400">
                Publish only text approved by your organization. Payment
                instructions do not process a charge or change payment-provider
                credentials.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  disabled={busy}
                  className="btn-secondary px-4 py-3 rounded-xl"
                  onClick={() => save("SAVE")}
                >
                  Save draft
                </button>
                <button
                  disabled={busy}
                  className="btn-primary px-4 py-3 rounded-xl"
                  onClick={() => save("PUBLISH")}
                >
                  Publish page
                </button>
                {item.published && (
                  <button
                    disabled={busy}
                    className="text-rose-300 px-4"
                    onClick={() => save("WITHDRAW")}
                  >
                    Withdraw page
                  </button>
                )}
              </div>
            </div>
          </Panel>
          <Panel>
            <p className="text-xs uppercase tracking-wider text-cyan-300">
              Draft preview · revision {item.version}
            </p>
            <h2 className="text-2xl font-bold mt-4">{draft.title}</h2>
            <div className="mt-5 whitespace-pre-wrap break-words text-sm leading-7 text-slate-300">
              {draft.body || "Add the reviewed text to preview it here."}
            </div>
            <div className="mt-8 border-t border-slate-700 pt-5">
              <p className="text-sm text-slate-400">
                {item.publishedAt
                  ? `Last published ${new Date(item.publishedAt).toLocaleString()}`
                  : "Not published"}
              </p>
              {item.published && (
                <Link
                  className="text-cyan-300 inline-block mt-3"
                  target="_blank"
                  to={`/information/${slug}`}
                >
                  Open published buyer page
                </Link>
              )}
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}
