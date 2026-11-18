import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  Panel,
  Field,
  Feedback,
  inputClass,
} from "../components/workflow/WorkflowUI";
import { PLAN_CAPABILITIES } from "@shared/constants/entitlements.js";
export default function BuyerManagementPage() {
  const [items, setItems] = useState([]),
    [selected, setSelected] = useState(""),
    [plan, setPlan] = useState("FREE"),
    [notes, setNotes] = useState(""),
    [count, setCount] = useState(3),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    try {
      setItems((await api.admin("/users?role=BUYER")).data);
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function run(action) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
      await load();
      setMessage("Buyer account updated.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Buyer accounts &amp; access</h1>
      <Feedback error={error} message={message} />
      <Panel>
        <Field label="Select buyer">
          <select
            className={inputClass}
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setPlan(
                items.find((u) => u.id === e.target.value)?.planTier || "FREE",
              );
            }}
          >
            <option value="">Choose an account</option>
            {items.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName} — {u.email}
              </option>
            ))}
          </select>
        </Field>
        {selected && (
          <div className="mt-5 grid sm:grid-cols-2 gap-5">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                run(() =>
                  api.workflow(`/buyers/${selected}/plan`, {
                    method: "PATCH",
                    body: JSON.stringify({ plan, notes }),
                  }),
                );
              }}
            >
              <Field label="Confirmed plan">
                <select
                  className={inputClass}
                  value={plan}
                  onChange={(e) => setPlan(e.target.value)}
                >
                  {Object.keys(PLAN_CAPABILITIES).map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </Field>
              <Field label="Authorization or payment reference">
                <textarea
                  className={inputClass}
                  required
                  minLength={10}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </Field>
              <button
                disabled={busy}
                className="btn-primary rounded-xl px-4 py-3"
              >
                Apply confirmed plan
              </button>
            </form>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                run(() =>
                  api.admin(`/users/${selected}/gift-unlocks`, {
                    method: "POST",
                    body: JSON.stringify({ count: Number(count) }),
                  }),
                );
              }}
            >
              <Field label="Additional unlock credits">
                <input
                  className={inputClass}
                  type="number"
                  min="1"
                  max="1000"
                  required
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                />
              </Field>
              <p className="text-sm text-slate-400">
                Credit grants do not change the buyer's plan.
              </p>
              <button
                disabled={busy}
                className="btn-secondary px-4 py-3 rounded-xl"
              >
                Grant credits
              </button>
            </form>
          </div>
        )}
      </Panel>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="p-3">Buyer</th>
                <th>Email</th>
                <th>Plan</th>
                <th>Credits</th>
                <th>Last login</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-t border-slate-800">
                  <td className="p-3">{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.planTier}</td>
                  <td>{u.unlocksRemaining}</td>
                  <td>
                    {u.lastLoginAt
                      ? new Date(u.lastLoginAt).toLocaleString()
                      : "Never logged in"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
