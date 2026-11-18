import React, { useEffect, useState } from "react";
import { api } from "../../services/api";
import Button from "../../components/common/Button";
import {
  Panel,
  Status,
  Feedback,
  Empty,
  inputClass,
} from "../../components/workflow/WorkflowUI";
export default function FieldReviewsPage() {
  const [items, setItems] = useState([]),
    [notes, setNotes] = useState({}),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function load() {
    try {
      setItems((await api.workflow("/inspections")).data);
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function review(id, action) {
    setBusy(true);
    setError("");
    try {
      await api.workflow(`/inspections/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ action, notes: notes[id] }),
      });
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Field verification review</h1>
      <p className="text-sm text-slate-400">
        Review engineer findings before they update a buyer-visible property
        dossier. This does not publish an unapproved notice.
      </p>
      <Feedback error={error} />
      {!items.length ? (
        <Empty>No submitted field reports are awaiting review.</Empty>
      ) : (
        items.map((item) => (
          <Panel key={item.id}>
            <h2 className="font-semibold">{item.auction.title}</h2>
            <p className="my-2 text-xs text-slate-400">
              Engineer: {item.engineer.fullName}
            </p>
            <Status value={item.status} />
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              {Object.entries(item.report || {})
                .filter(
                  ([key]) => !["id", "assignmentId", "photos"].includes(key),
                )
                .map(([key, value]) => (
                  <div key={key}>
                    <dt className="text-xs text-slate-500">
                      {key.replace(/([A-Z])/g, " $1")}
                    </dt>
                    <dd className="mt-1 whitespace-pre-wrap text-sm">
                      {Array.isArray(value) ? value.join(", ") : String(value)}
                    </dd>
                  </div>
                ))}
            </dl>
            <textarea
              aria-label="Field report review notes"
              className={`${inputClass} mt-5`}
              rows={3}
              placeholder="Evidence checked, corrections required and decision notes"
              value={notes[item.id] || ""}
              onChange={(e) =>
                setNotes({ ...notes, [item.id]: e.target.value })
              }
            />
            <div className="mt-3 flex gap-3">
              <Button
                disabled={busy}
                onClick={() => review(item.id, "APPROVE")}
              >
                Approve report
              </Button>
              <Button
                disabled={busy}
                variant="secondary"
                onClick={() => review(item.id, "RETURN")}
              >
                Return to engineer
              </Button>
            </div>
          </Panel>
        ))
      )}
    </div>
  );
}
