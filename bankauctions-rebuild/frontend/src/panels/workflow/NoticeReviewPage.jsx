import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";
import {
  NOTICE_FIELDS,
  PROPERTY_FIELDS,
  ASSET_CATEGORY_MAP,
} from "@shared/notices/contract.js";
import Button from "../../components/common/Button";
import {
  Panel,
  Status,
  Feedback,
  Field,
  inputClass,
  downloadJson,
  filePayload,
  downloadProtectedFile,
} from "../../components/workflow/WorkflowUI";
const label = (key) =>
  key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase());
const groups = [
  [
    "Notice & lender",
    [
      "noticeType",
      "saleNoticeType",
      "bankName",
      "branchName",
      "noticeDate",
      "auctionDate",
      "auctionTime",
      "inspectionDate",
    ],
  ],
  [
    "Financial terms",
    [
      "reservePrice",
      "emdAmount",
      "bidIncrementAmount",
      "totalDues",
      "loanReference",
      "guidelineValue",
    ],
  ],
  ["Borrower & contact", ["borrowerName", "borrowerAddress", "contactNumber"]],
  [
    "Asset & location",
    [
      "assetCategory",
      "assetType",
      "propertyAddress",
      "propertyAddressEvidence",
      "locality",
      "city",
      "propertyType",
      "propertyArea",
      "propertyDescription",
      "possessionStatus",
    ],
  ],
  ["Vehicles", NOTICE_FIELDS.filter((key) => key.startsWith("vehicle"))],
  ["Machinery", NOTICE_FIELDS.filter((key) => key.startsWith("machinery"))],
  ["Extraction notes", ["extractionNotes"]],
];
const choices = {
  noticeType: ["AUCTION", "POSSESSION"],
  saleNoticeType: [
    "SARFAESI_RULE_8_6",
    "POSSESSION_13_4",
    "DRT_COURT_SALE",
    "MOVABLE_ASSET_SALE",
  ],
  assetCategory: ["IMMOBILE", "MOVABLE"],
  assetType: Object.keys(ASSET_CATEGORY_MAP),
  possessionStatus: ["PHYSICAL", "SYMBOLIC"],
};
export default function NoticeReviewPage() {
  const { id } = useParams(),
    { user } = useAuth();
  const [item, setItem] = useState(null),
    [record, setRecord] = useState({}),
    [notes, setNotes] = useState(""),
    [confirmed, setConfirmed] = useState(false),
    [listing, setListing] = useState({
      isPremium: false,
      featured: false,
      photoId: null,
    }),
    [advanced, setAdvanced] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState("");
  async function load(preserveDraft = false) {
    try {
      const res = await api.workflow(`/notices/${id}`);
      setItem(res.data);
      if (!preserveDraft) {
        setRecord(res.data.reviewed);
        setListing(res.data.listing || {});
        setAdvanced(JSON.stringify(res.data.reviewed, null, 2));
      }
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, [id]);
  const editable =
    item?.claimedById === user.id &&
    ["PENDING_CHECKER", "NEEDS_CORRECTION"].includes(item.status);
  async function action(fn, preserveDraft = false) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await fn();
      await load(preserveDraft);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function submit(decision) {
    await action(async () => {
      await api.workflow(`/notices/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          version: item.version,
          decision,
          reviewed: record,
          listing,
          notes,
          evidenceConfirmed: confirmed,
        }),
      });
      setMessage(
        decision === "APPROVE"
          ? "Approved and published to the buyer catalog."
          : "Review saved.",
      );
      setConfirmed(false);
    });
  }
  const change = (key, value) => {
    const next = { ...record, [key]: value };
    setRecord(next);
    setAdvanced(JSON.stringify(next, null, 2));
  };
  return (
    <div className="space-y-5">
      <Link to="/checker/queue" className="text-sm text-cyan-300">
        ← Notice registry
      </Link>
      <Feedback error={error} message={message} />
      {!item ? (
        <p role="status">Loading review…</p>
      ) : (
        <>
          <div className="flex flex-wrap justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">
                Source verification & publication
              </h1>
              <div className="mt-3 flex gap-2">
                <Status value={item.status} />
                <span className="text-xs text-slate-400">
                  Revision {item.version}
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={() => downloadJson([record], "reviewed-notice.json")}
              >
                Export reviewed JSON
              </Button>
              {["PENDING_CHECKER", "NEEDS_CORRECTION"].includes(item.status) &&
                !editable && (
                  <Button
                    loading={busy}
                    onClick={() =>
                      action(() =>
                        api.workflow(`/notices/${id}/claim`, {
                          method: "POST",
                        }),
                      )
                    }
                  >
                    Claim review
                  </Button>
                )}
            </div>
          </div>
          <div className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
            <div className="space-y-5">
              <Panel>
                <h2 className="font-semibold">Original evidence</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Original extraction is read-only. A local path inside the JSON
                  is not an uploaded source document.
                </p>
                <div className="mt-4 space-y-2">
                  {item.files.length ? (
                    item.files.map((file) => (
                      <button
                        key={file.id}
                        className="block text-sm text-cyan-300 hover:underline"
                        onClick={() =>
                          action(() =>
                            downloadProtectedFile(file.id, file.name),
                          )
                        }
                      >
                        {file.name} · {Math.ceil(file.size / 1024)} KB
                      </button>
                    ))
                  ) : (
                    <p className="rounded-xl bg-amber-400/10 p-3 text-sm text-amber-200">
                      No source document attached. Approval is blocked.
                    </p>
                  )}
                </div>
                {["PENDING_CHECKER", "NEEDS_CORRECTION"].includes(
                  item.status,
                ) && (
                  <label className="mt-4 block text-xs text-slate-300">
                    Attach original PDF / image (8 MB max)
                    <input
                      className="mt-2 block w-full text-xs"
                      type="file"
                      accept="application/pdf,image/jpeg,image/png"
                      disabled={busy}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file)
                          action(
                            async () =>
                              api.workflow("/files", {
                                method: "POST",
                                body: JSON.stringify({
                                  ...(await filePayload(file)),
                                  extractionId: id,
                                }),
                              }),
                            true,
                          );
                        e.target.value = "";
                      }}
                    />
                  </label>
                )}
                <details className="mt-5">
                  <summary className="cursor-pointer text-sm">
                    View original extracted JSON
                  </summary>
                  <pre
                    translate="no"
                    className="mt-3 max-h-[32rem] overflow-auto whitespace-pre-wrap break-all rounded-xl bg-slate-950 p-3 text-xs text-slate-400"
                  >
                    {JSON.stringify(item.raw, null, 2)}
                  </pre>
                </details>
                <Button
                  variant="ghost"
                  className="mt-3"
                  onClick={() =>
                    downloadJson([item.raw], "original-notice.json")
                  }
                >
                  Download original JSON
                </Button>
              </Panel>
              <Panel>
                <h2 className="font-semibold">Review flags</h2>
                {[...item.warnings, ...item.publicationErrors].length ? (
                  <ul className="mt-3 space-y-2 text-sm text-amber-200">
                    {[...item.warnings, ...item.publicationErrors].map(
                      (warning, index) => (
                        <li key={index}>• {warning}</li>
                      ),
                    )}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-slate-400">
                    No automated flags. Human source verification is still
                    required.
                  </p>
                )}
                <p className="mt-3 text-xs text-slate-500">
                  Flags reflect the saved revision; save a draft to refresh
                  them.
                </p>
              </Panel>
              <Panel>
                <h2 className="font-semibold">Audit history</h2>
                <div className="mt-3 space-y-3">
                  {item.history.map((event) => (
                    <div
                      key={event.id}
                      className="border-l border-slate-600 pl-3 text-xs"
                    >
                      <p>{event.action.replaceAll("_", " ")}</p>
                      <p className="mt-1 text-slate-400">
                        {event.actorName} ·{" "}
                        {new Date(event.createdAt).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
            <div className="space-y-5">
              <Panel>
                <h2 className="font-semibold">Reviewed data</h2>
                <p className="mt-2 mb-4 text-sm text-slate-400">
                  Keep unknown values empty. Verify the property address
                  separately from borrower, bank and auction venue addresses.
                </p>
                <fieldset disabled={!editable || busy} className="space-y-5">
                  {groups.map(([title, fields]) => (
                    <details
                      key={title}
                      open={title === "Notice & lender"}
                      className="rounded-xl border border-white/10 p-4"
                    >
                      <summary className="cursor-pointer text-sm font-semibold">
                        {title}
                      </summary>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        {fields.map((key) => (
                          <Field
                            key={key}
                            label={`${label(key)}${record.fieldConfidence?.[key] ? " · " + record.fieldConfidence[key] : ""}`}
                          >
                            {choices[key] ? (
                              <select
                                className={inputClass}
                                value={record[key] || ""}
                                onChange={(e) => change(key, e.target.value)}
                              >
                                <option value="">Not confirmed</option>
                                {choices[key].map((value) => (
                                  <option key={value}>{value}</option>
                                ))}
                              </select>
                            ) : (
                              <textarea
                                rows={
                                  /Description|Address|Notes|Evidence/.test(key)
                                    ? 3
                                    : 1
                                }
                                className={inputClass}
                                value={record[key] ?? ""}
                                onChange={(e) => change(key, e.target.value)}
                              />
                            )}
                          </Field>
                        ))}
                      </div>
                    </details>
                  ))}
                  <details className="rounded-xl border border-white/10 p-4">
                    <summary className="cursor-pointer text-sm font-semibold">
                      Property identifiers & boundaries
                    </summary>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {PROPERTY_FIELDS.map((key) => (
                        <Field key={key} label={label(key)}>
                          <input
                            className={inputClass}
                            value={record.propertyDetails?.[key] || ""}
                            onChange={(e) =>
                              change("propertyDetails", {
                                ...record.propertyDetails,
                                [key]: e.target.value,
                              })
                            }
                          />
                        </Field>
                      ))}
                    </div>
                  </details>
                  <details className="rounded-xl border border-white/10 p-4">
                    <summary className="cursor-pointer text-sm font-semibold">
                      Full JSON editor: confidence, address candidates,
                      provenance & additional details
                    </summary>
                    <textarea
                      aria-label="Complete reviewed JSON"
                      translate="no"
                      rows={18}
                      className={`${inputClass} mt-4 font-mono text-xs`}
                      value={advanced}
                      onChange={(e) => setAdvanced(e.target.value)}
                    />
                    <Button
                      className="mt-3"
                      variant="secondary"
                      onClick={() => {
                        try {
                          const value = JSON.parse(advanced);
                          if (
                            !value ||
                            Array.isArray(value) ||
                            typeof value !== "object"
                          )
                            throw new Error("Enter one notice object.");
                          setRecord(value);
                          setError("");
                          setMessage(
                            "JSON applied to the editor. Save a draft to persist it.",
                          );
                        } catch (e) {
                          setError(e.message);
                        }
                      }}
                    >
                      Apply JSON to editor
                    </Button>
                  </details>
                  <div className="space-y-3 rounded-xl border border-white/10 p-4">
                    <h3 className="text-sm font-semibold">
                      Catalog presentation
                    </h3>
                    <label className="flex gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(listing.isPremium)}
                        onChange={(e) =>
                          setListing({
                            ...listing,
                            isPremium: e.target.checked,
                          })
                        }
                      />
                      Premium asset
                    </label>
                    <label className="flex gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(listing.featured)}
                        onChange={(e) =>
                          setListing({ ...listing, featured: e.target.checked })
                        }
                      />
                      Eligible for the top-five hero (premium assets with a
                      verified property photo)
                    </label>
                    <Field label="Verified property photo">
                      <select
                        className={inputClass}
                        value={listing.photoId || ""}
                        onChange={(e) =>
                          setListing({
                            ...listing,
                            photoId: e.target.value || null,
                          })
                        }
                      >
                        <option value="">No property photo available</option>
                        {item.files
                          .filter((file) => file.purpose === "PROPERTY_PHOTO")
                          .map((file) => (
                            <option key={file.id} value={file.id}>
                              {file.name}
                            </option>
                          ))}
                      </select>
                    </Field>
                    <label className="block text-xs text-slate-400">
                      Upload an actual property photo (not a notice scan)
                      <input
                        className="mt-2 block text-xs"
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file)
                            action(
                              async () =>
                                api.workflow("/files", {
                                  method: "POST",
                                  body: JSON.stringify({
                                    ...(await filePayload(file)),
                                    extractionId: id,
                                    purpose: "PROPERTY_PHOTO",
                                  }),
                                }),
                              true,
                            );
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  <Field label="Checker verification notes">
                    <textarea
                      required
                      rows={4}
                      className={inputClass}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Describe the evidence checked, corrections and how conflicts were resolved."
                    />
                  </Field>
                  <label className="flex items-start gap-3 text-sm text-slate-300">
                    <input
                      className="mt-1"
                      type="checkbox"
                      checked={confirmed}
                      onChange={(e) => setConfirmed(e.target.checked)}
                    />
                    I verified the original source, property address, notice
                    classification, amounts and dates, and resolved the review
                    flags.
                  </label>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="secondary"
                      loading={busy}
                      onClick={() => submit("SAVE")}
                    >
                      Save draft
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => submit("NEEDS_CORRECTION")}
                    >
                      Return for correction
                    </Button>
                    <Button variant="danger" onClick={() => submit("REJECT")}>
                      Reject
                    </Button>
                    <Button
                      disabled={!confirmed}
                      onClick={() => submit("APPROVE")}
                    >
                      Approve & publish
                    </Button>
                  </div>
                </fieldset>
                {!editable && (
                  <p className="mt-4 text-sm text-slate-400">
                    Claim a pending notice to edit it. Finalized records remain
                    read-only.
                  </p>
                )}
              </Panel>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
