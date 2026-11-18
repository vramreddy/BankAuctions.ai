import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button";
import {
  Panel,
  Status,
  Feedback,
  Empty,
  Field,
  inputClass,
} from "../../components/workflow/WorkflowUI";
export default function RecommendationsPage() {
  const { user } = useAuth();
  const marketing = user.role === "MARKETING",
    admin = user.role === "ADMIN",
    checker = ["CHECKER", "ADMIN"].includes(user.role);
  const [items, setItems] = useState([]),
    [buyers, setBuyers] = useState([]),
    [notes, setNotes] = useState({}),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    buyerId: "",
    plan: "PRO",
    reason: "",
    contactNotes: "",
    consentGiven: false,
  });
  async function load() {
    try {
      setItems((await api.workflow("/recommendations")).data);
      if (marketing || admin) setBuyers((await api.workflow("/buyers")).data);
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function run(fn) {
    setBusy(true);
    setError("");
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">
        {marketing
          ? "Buyer follow-up & plan recommendations"
          : checker
            ? "Review plan recommendations"
            : "Your plan recommendations"}
      </h1>
      <p className="text-sm text-slate-400">
        Recommendations follow buyer preferences and require checker review.
        They do not activate paid plans or charge the buyer.
      </p>
      <Feedback error={error} message={message} />
      {(marketing || admin) && (
        <Panel>
          <form
            className="grid gap-4 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api.workflow("/recommendations", {
                  method: "POST",
                  body: JSON.stringify(form),
                });
                setMessage("Recommendation submitted for checker review.");
                setForm({
                  ...form,
                  reason: "",
                  contactNotes: "",
                  consentGiven: false,
                });
              });
            }}
          >
            <Field label="Buyer">
              <select
                required
                className={inputClass}
                value={form.buyerId}
                onChange={(e) => setForm({ ...form, buyerId: e.target.value })}
              >
                <option value="">Choose buyer</option>
                {buyers.map((buyer) => (
                  <option key={buyer.id} value={buyer.id}>
                    {buyer.fullName} ·{" "}
                    {buyer.lastLoginAt
                      ? "Has logged in"
                      : "No successful login recorded"}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Recommended plan">
              <select
                className={inputClass}
                value={form.plan}
                onChange={(e) => setForm({ ...form, plan: e.target.value })}
              >
                {["FREE", "PRO", "PREMIUM", "PRO_PREMIUM"].map((plan) => (
                  <option key={plan}>{plan}</option>
                ))}
              </select>
            </Field>
            <Field label="Buyer preferences and reason">
              <textarea
                required
                minLength={10}
                rows={4}
                className={inputClass}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
              />
            </Field>
            <Field label="Follow-up / product explanation notes">
              <textarea
                required
                minLength={10}
                rows={4}
                className={inputClass}
                value={form.contactNotes}
                onChange={(e) =>
                  setForm({ ...form, contactNotes: e.target.value })
                }
              />
            </Field>
            <label className="flex gap-2 text-sm">
              <input
                required
                type="checkbox"
                checked={form.consentGiven}
                onChange={(e) =>
                  setForm({ ...form, consentGiven: e.target.checked })
                }
              />
              The buyer agreed to this follow-up.
            </label>
            <Button type="submit" loading={busy}>
              Submit recommendation
            </Button>
          </form>
          {form.buyerId && (
            <p className="mt-4 text-xs text-slate-400">
              Contact: {buyers.find((b) => b.id === form.buyerId)?.email} ·{" "}
              {buyers.find((b) => b.id === form.buyerId)?.phone}. Login activity
              does not prove why a user has not signed in; ask the buyer.
            </p>
          )}
        </Panel>
      )}
      {!items.length ? (
        <Empty>No recommendations yet.</Empty>
      ) : (
        items.map((item) => (
          <Panel key={item.id}>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-semibold">
                {item.buyer.fullName} · {item.plan}
              </h2>
              <Status value={item.status} />
            </div>
            <p className="mt-3 text-sm text-slate-300">{item.reason}</p>
            {checker || marketing ? (
              <p className="mt-3 text-sm text-slate-400">
                Follow-up: {item.contactNotes}
              </p>
            ) : null}
            {item.reviewNotes && (
              <p className="mt-3 text-sm text-slate-400">
                Review: {item.reviewNotes}
              </p>
            )}
            {checker &&
              item.status === "PENDING_CHECKER" &&
              item.proposedById !== user.id && (
                <div className="mt-4 space-y-3">
                  <textarea
                    aria-label="Recommendation review notes"
                    className={inputClass}
                    placeholder="Checker notes"
                    value={notes[item.id] || ""}
                    onChange={(e) =>
                      setNotes({ ...notes, [item.id]: e.target.value })
                    }
                  />
                  <div className="flex gap-3">
                    {["APPROVE", "REJECT"].map((action) => (
                      <Button
                        key={action}
                        disabled={busy}
                        variant={action === "APPROVE" ? "primary" : "secondary"}
                        onClick={() =>
                          run(() =>
                            api.workflow(`/recommendations/${item.id}`, {
                              method: "PATCH",
                              body: JSON.stringify({
                                action,
                                notes: notes[item.id],
                              }),
                            }),
                          )
                        }
                      >
                        {action === "APPROVE"
                          ? "Approve recommendation"
                          : "Reject"}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
          </Panel>
        ))
      )}
    </div>
  );
}
