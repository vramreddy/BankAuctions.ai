import React, { useEffect, useState } from "react";
import {
  Link,
  useParams,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button";
import {
  Panel,
  Status,
  Feedback,
  Field,
  Empty,
  inputClass,
  filePayload,
  downloadProtectedFile,
} from "../../components/workflow/WorkflowUI";
export default function RequestsPage() {
  const { id } = useParams(),
    { user } = useAuth(),
    [params] = useSearchParams(),
    navigate = useNavigate();
  const checker = ["CHECKER", "ADMIN"].includes(user.role),
    engineer = user.role === "ENGINEER";
  const base = checker
    ? "/checker/requests"
    : engineer
      ? "/engineer/requests"
      : "/buyer/requests";
  const [items, setItems] = useState([]),
    [item, setItem] = useState(null),
    [staff, setStaff] = useState([]),
    [busy, setBusy] = useState(false),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  const [form, setForm] = useState({
    kind: params.get("kind") || "GENERAL",
    auctionId: params.get("auctionId") || params.get("asset") || "",
    subject: "",
    description: "",
    contactMethod: "FORM",
  });
  const [reply, setReply] = useState(""),
    [internal, setInternal] = useState(false),
    [notes, setNotes] = useState(""),
    [engineerId, setEngineerId] = useState("");
  const [report, setReport] = useState({
    summary: "",
    findings: "",
    limitations: "",
    visitedAt: "",
    fileIds: [],
  });
  async function load() {
    setLoading(true);
    try {
      if (id) {
        const res = await api.workflow(`/requests/${id}`);
        setItem(res.data);
        if (res.data.report) setReport(res.data.report);
      } else {
        setItems((await api.workflow("/requests")).data);
      }
      if (checker) setStaff((await api.workflow("/staff")).data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    setItem(null);
    setError("");
    setMessage("");
    load();
  }, [id]);
  async function run(fn) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await fn();
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function create(e) {
    e.preventDefault();
    await run(async () => {
      const res = await api.workflow("/requests", {
        method: "POST",
        body: JSON.stringify({ ...form, auctionId: form.auctionId || null }),
      });
      navigate(`${base}/${res.data.id}`);
    });
  }
  const update = (action) =>
    run(async () => {
      await api.workflow(`/requests/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          action,
          version: item.version,
          notes,
          engineerId,
        }),
      });
      setNotes("");
      setMessage("Request updated.");
    });
  const reportShown = checker || engineer ? item?.report : item?.approvedReport;
  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs uppercase tracking-wider text-cyan-400">
          {checker
            ? "Checker support desk"
            : engineer
              ? "Field report assignments"
              : "Buyer support"}
        </p>
        <h1 className="mt-2 text-2xl font-bold">
          {id
            ? item?.subject || "Request details"
            : checker
              ? "Enquiries & requested reports"
              : engineer
                ? "Your requested inspections"
                : "Contact your checker"}
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          {checker
            ? "Own the response, coordinate evidence and approve reports before delivery."
            : engineer
              ? "Only your assigned requests appear here. Submit findings for checker review."
              : "Ask about an asset, request documents or legal assistance, or arrange a callback. Your checker coordinates the next steps."}
        </p>
      </div>
      <Feedback error={error} message={message} />
      {id && (
        <Link className="inline-block text-sm text-cyan-300" to={base}>
          ← All requests
        </Link>
      )}
      {!id && !checker && !engineer && (
        <Panel>
          <h2 className="mb-4 font-semibold">New enquiry</h2>
          <form onSubmit={create} className="grid gap-4 sm:grid-cols-2">
            <Field label="Request type">
              <select
                className={inputClass}
                value={form.kind}
                onChange={(e) => setForm({ ...form, kind: e.target.value })}
              >
                {[
                  "GENERAL",
                  "CALLBACK",
                  "DOCUMENT",
                  "LEGAL",
                  "FIELD_REPORT",
                  "LOGIN_HELP",
                ].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </Field>
            <Field label="Preferred response">
              <select
                className={inputClass}
                value={form.contactMethod}
                onChange={(e) =>
                  setForm({ ...form, contactMethod: e.target.value })
                }
              >
                <option value="FORM">Workspace reply</option>
                <option value="EMAIL">Email</option>
                <option value="CALL">Request a phone call</option>
              </select>
            </Field>
            <Field label="Asset reference (optional)">
              <input
                className={inputClass}
                value={form.auctionId}
                onChange={(e) =>
                  setForm({ ...form, auctionId: e.target.value })
                }
                placeholder="Open an asset and choose Contact checker"
              />
            </Field>
            <Field label="Subject">
              <input
                required
                minLength={5}
                maxLength={160}
                className={inputClass}
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
              />
            </Field>
            <div className="sm:col-span-2">
              <Field label="What information do you need?">
                <textarea
                  required
                  minLength={10}
                  maxLength={6000}
                  rows={4}
                  className={inputClass}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Field>
            </div>
            <Button type="submit" loading={busy}>
              Send for check
            </Button>
          </form>
        </Panel>
      )}
      {loading ? (
        <p role="status" className="text-sm text-slate-400">
          Loading requests…
        </p>
      ) : !id ? (
        <div className="space-y-3">
          {!items.length ? (
            <Empty>No requests yet.</Empty>
          ) : (
            items.map((row) => (
              <Panel key={row.id}>
                <div className="flex flex-wrap justify-between gap-4">
                  <div>
                    <div className="flex gap-2">
                      <Status value={row.status} />
                      {row.priority && <Status value="PRIORITY" />}
                    </div>
                    <Link
                      className="mt-3 block font-semibold hover:text-cyan-300"
                      to={`${base}/${row.id}`}
                    >
                      {row.subject}
                    </Link>
                    <p className="mt-2 text-xs text-slate-400">
                      {row.kind} · {row.requester?.fullName} ·{" "}
                      {row.auction?.title || "General enquiry"}
                    </p>
                  </div>
                  <Link
                    className="text-sm text-cyan-300"
                    to={`${base}/${row.id}`}
                  >
                    Open request →
                  </Link>
                </div>
              </Panel>
            ))
          )}
        </div>
      ) : (
        item && (
          <>
            <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
              <div className="space-y-5">
                <Panel>
                  <div className="flex flex-wrap gap-2">
                    <Status value={item.status} />
                    <Status value={item.kind} />
                  </div>
                  <p className="mt-4 whitespace-pre-wrap text-sm text-slate-300">
                    {item.description}
                  </p>
                  {item.auction && (
                    <Link
                      to={`/lot/${item.auction.id}`}
                      className="mt-3 block text-sm text-cyan-300"
                    >
                      {item.auction.title}
                    </Link>
                  )}
                  <p className="mt-4 text-xs text-slate-400">
                    Preferred contact: {item.contactMethod} · Created{" "}
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </p>
                  {checker && (
                    <p className="mt-3 text-sm text-slate-400">
                      Requester: {item.requester.fullName} ·{" "}
                      {item.requester.email} · {item.requester.phone}
                    </p>
                  )}
                </Panel>
                <Panel>
                  <h2 className="font-semibold">Conversation</h2>
                  <div className="my-4 space-y-3">
                    {item.messages.map((entry) => (
                      <div
                        key={entry.id}
                        className="rounded-xl border border-white/5 bg-slate-950/60 p-3"
                      >
                        <p className="mb-1 text-[10px] text-slate-500">
                          {entry.authorId === user.id
                            ? "You"
                            : "Support team / requester"}{" "}
                          · {new Date(entry.createdAt).toLocaleString("en-IN")}
                          {entry.internal ? " · Internal note" : ""}
                        </p>
                        <p className="whitespace-pre-wrap text-sm text-slate-300">
                          {entry.body}
                        </p>
                      </div>
                    ))}
                    {!item.messages.length && (
                      <p className="text-sm text-slate-500">
                        Your request is recorded. Replies will appear here.
                      </p>
                    )}
                  </div>
                  {item.status !== "CLOSED" && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        run(async () => {
                          await api.workflow(`/requests/${id}/messages`, {
                            method: "POST",
                            body: JSON.stringify({ body: reply, internal }),
                          });
                          setReply("");
                        });
                      }}
                      className="space-y-3"
                    >
                      <textarea
                        aria-label="Reply to request"
                        required
                        rows={3}
                        className={inputClass}
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                      />
                      {(checker || engineer) && (
                        <label className="flex gap-2 text-xs">
                          <input
                            type="checkbox"
                            checked={internal}
                            onChange={(e) => setInternal(e.target.checked)}
                          />
                          Internal staff note
                        </label>
                      )}
                      <Button loading={busy} type="submit">
                        Send reply
                      </Button>
                    </form>
                  )}
                </Panel>
                {reportShown && (
                  <Panel>
                    <h2 className="font-semibold">
                      {checker || engineer
                        ? "Submitted report"
                        : "Checker-approved report"}
                    </h2>
                    {["summary", "findings", "limitations", "visitedAt"].map(
                      (key) => (
                        <div key={key} className="mt-4">
                          <p className="text-xs uppercase text-slate-500">
                            {key}
                          </p>
                          <p className="mt-1 whitespace-pre-wrap text-sm text-slate-300">
                            {reportShown[key]}
                          </p>
                        </div>
                      ),
                    )}
                  </Panel>
                )}
              </div>
              <div className="space-y-5">
                {checker && (
                  <Panel>
                    <h2 className="font-semibold">Checker actions</h2>
                    <div className="mt-4 space-y-4">
                      <Field label="Decision / response note">
                        <textarea
                          rows={3}
                          className={inputClass}
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        />
                      </Field>
                      <Field label="Field engineer">
                        <select
                          className={inputClass}
                          value={engineerId}
                          onChange={(e) => setEngineerId(e.target.value)}
                        >
                          <option value="">Choose engineer</option>
                          {staff
                            .filter((person) => person.role === "ENGINEER")
                            .map((person) => (
                              <option key={person.id} value={person.id}>
                                {person.fullName}
                              </option>
                            ))}
                        </select>
                      </Field>
                      <div className="flex flex-wrap gap-2">
                        {["OPEN", "IN_REVIEW"].includes(item.status) && (
                          <Button
                            disabled={busy}
                            variant="secondary"
                            onClick={() => update("CLAIM")}
                          >
                            Take ownership
                          </Button>
                        )}
                        {["OPEN", "IN_REVIEW", "REPORT_RETURNED"].includes(
                          item.status,
                        ) && (
                          <Button
                            disabled={busy || !engineerId}
                            onClick={() => update("ASSIGN")}
                          >
                            Assign engineer
                          </Button>
                        )}
                        {item.status === "REPORT_SUBMITTED" && (
                          <>
                            <Button
                              disabled={busy}
                              onClick={() => update("APPROVE_REPORT")}
                            >
                              Approve report
                            </Button>
                            <Button
                              disabled={busy}
                              variant="secondary"
                              onClick={() => update("RETURN_REPORT")}
                            >
                              Return for correction
                            </Button>
                          </>
                        )}
                        {["OPEN", "IN_REVIEW", "REPORT_APPROVED"].includes(
                          item.status,
                        ) && (
                          <Button
                            disabled={busy}
                            variant="secondary"
                            onClick={() => update("RESOLVE")}
                          >
                            Resolve
                          </Button>
                        )}
                        {["RESOLVED", "REPORT_APPROVED"].includes(
                          item.status,
                        ) && (
                          <Button
                            disabled={busy}
                            variant="secondary"
                            onClick={() => update("CLOSE")}
                          >
                            Close
                          </Button>
                        )}
                        {["RESOLVED", "CLOSED"].includes(item.status) && (
                          <Button
                            disabled={busy}
                            variant="secondary"
                            onClick={() => update("REOPEN")}
                          >
                            Reopen
                          </Button>
                        )}
                      </div>
                    </div>
                  </Panel>
                )}
                {engineer &&
                  ["ASSIGNED", "REPORT_RETURNED"].includes(item.status) && (
                    <Panel>
                      <h2 className="mb-4 font-semibold">
                        Submit field findings
                      </h2>
                      <form
                        className="space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          run(async () => {
                            await api.workflow(`/requests/${id}/report`, {
                              method: "POST",
                              body: JSON.stringify({
                                version: item.version,
                                report,
                              }),
                            });
                            setMessage(
                              "Submitted to checker. The buyer cannot see this draft.",
                            );
                          });
                        }}
                      >
                        {["summary", "findings", "limitations"].map((key) => (
                          <Field key={key} label={key}>
                            <textarea
                              required
                              minLength={key === "limitations" ? 5 : 20}
                              rows={4}
                              className={inputClass}
                              value={report[key]}
                              onChange={(e) =>
                                setReport({ ...report, [key]: e.target.value })
                              }
                            />
                          </Field>
                        ))}
                        <Field label="Actual inspection date">
                          <input
                            type="date"
                            required
                            className={inputClass}
                            value={report.visitedAt}
                            onChange={(e) =>
                              setReport({
                                ...report,
                                visitedAt: e.target.value,
                              })
                            }
                          />
                        </Field>
                        <p className="text-xs text-slate-400">
                          Select the attachments below to include in the report.
                        </p>
                        {item.files.map((file) => (
                          <label key={file.id} className="flex gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={report.fileIds.includes(file.id)}
                              onChange={(e) =>
                                setReport({
                                  ...report,
                                  fileIds: e.target.checked
                                    ? [...report.fileIds, file.id]
                                    : report.fileIds.filter(
                                        (value) => value !== file.id,
                                      ),
                                })
                              }
                            />
                            {file.name}
                          </label>
                        ))}
                        <Button type="submit" loading={busy}>
                          Submit for checker approval
                        </Button>
                      </form>
                    </Panel>
                  )}
                <Panel>
                  <h2 className="font-semibold">Documents</h2>
                  <div className="mt-3 space-y-2">
                    {item.files.map((file) => (
                      <button
                        key={file.id}
                        className="block text-left text-xs text-cyan-300 hover:underline"
                        onClick={() =>
                          run(() => downloadProtectedFile(file.id, file.name))
                        }
                      >
                        {file.name}
                      </button>
                    ))}
                    {!item.files.length && (
                      <p className="text-xs text-slate-500">
                        No approved documents available yet.
                      </p>
                    )}
                  </div>
                  {(checker || engineer) &&
                    !["CLOSED", "RESOLVED", "REPORT_APPROVED"].includes(
                      item.status,
                    ) && (
                      <input
                        aria-label="Attach report evidence"
                        className="mt-4 block w-full text-xs"
                        type="file"
                        accept="application/pdf,image/png,image/jpeg"
                        disabled={busy}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            run(() =>
                              filePayload(file).then((payload) =>
                                api.workflow("/files", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    ...payload,
                                    requestId: id,
                                  }),
                                }),
                              ),
                            );
                          e.target.value = "";
                        }}
                      />
                    )}
                </Panel>
                {item.approvedReport && (
                  <Panel>
                    <h2 className="font-semibold">Report delivery</h2>
                    <p className="mt-2 text-xs text-slate-400">
                      The approved report is available in the buyer workspace.
                      Email status is recorded separately.
                    </p>
                    {item.deliveries.map((delivery) => (
                      <div key={delivery.id} className="mt-3">
                        <Status value={delivery.status} />
                        {delivery.lastError && (
                          <p className="mt-1 text-xs text-rose-300">
                            {delivery.lastError}
                          </p>
                        )}
                      </div>
                    ))}
                    {checker && (
                      <Button
                        className="mt-4"
                        loading={busy}
                        onClick={() =>
                          run(async () => {
                            const res = await api.workflow(
                              `/requests/${id}/deliver`,
                              { method: "POST" },
                            );
                            setMessage(
                              res.data.message ||
                                `Email status: ${res.data.status}`,
                            );
                          })
                        }
                      >
                        Send / retry approved report
                      </Button>
                    )}
                  </Panel>
                )}
              </div>
            </div>
          </>
        )
      )}
    </div>
  );
}
