import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { ASSET_CATEGORY_MAP } from "@shared/notices/contract.js";
import {
  Panel,
  Field,
  Feedback,
  inputClass,
} from "../components/workflow/WorkflowUI";
export default function NewNoticePage() {
  const navigate = useNavigate(),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [form, setForm] = useState({
      noticeType: "AUCTION",
      bankName: "",
      loanReference: "",
      city: "",
      locality: "",
      propertyAddress: "",
      assetType: "PLOT",
    });
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const record = {
        ...form,
        assetCategory: [
          "VEHICLE",
          "MACHINERY",
          "PLANT_AND_MACHINERY",
          "EQUIPMENT",
        ].includes(form.assetType)
          ? "MOVABLE"
          : "IMMOBILE",
      };
      const res = await api.workflow("/notices/import", {
        method: "POST",
        body: JSON.stringify({
          records: [record],
          sourceName: "Checker manual entry",
        }),
      });
      const id = res.data.imported[0]?.id || res.data.duplicates[0];
      if (id) navigate(`/checker/verify/${id}`);
      else throw new Error("No draft was created.");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-6 max-w-4xl">
      <Link className="text-cyan-300" to="/checker/queue">
        Back to notice registry
      </Link>
      <h1 className="text-3xl font-bold">Add an asset for review</h1>
      <p className="text-slate-400">
        Enter the known source details. You will attach evidence and complete
        the full notice before approval makes it visible to buyers.
      </p>
      <Feedback error={error} />
      <Panel>
        <form className="grid sm:grid-cols-2 gap-5" onSubmit={submit}>
          {[
            "bankName",
            "loanReference",
            "city",
            "locality",
            "propertyAddress",
          ].map((key) => (
            <Field
              key={key}
              label={
                {
                  bankName: "Bank / lender",
                  loanReference: "Loan or notice reference (optional)",
                  city: "Asset city",
                  locality: "Locality",
                  propertyAddress: "Property or asset storage address",
                }[key]
              }
            >
              <input
                required={key !== "loanReference"}
                className={inputClass}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </Field>
          ))}
          <Field label="Asset type">
            <select
              className={inputClass}
              value={form.assetType}
              onChange={(e) => setForm({ ...form, assetType: e.target.value })}
            >
              {Object.keys(ASSET_CATEGORY_MAP).map((key) => (
                <option key={key}>{key}</option>
              ))}
            </select>
          </Field>
          <Field label="Notice type">
            <select
              className={inputClass}
              value={form.noticeType}
              onChange={(e) => setForm({ ...form, noticeType: e.target.value })}
            >
              <option>AUCTION</option>
              <option>POSSESSION</option>
            </select>
          </Field>
          <button
            disabled={busy}
            className="btn-primary px-5 py-3 rounded-xl self-end"
          >
            {busy ? "Creating draft…" : "Create private review draft"}
          </button>
        </form>
      </Panel>
    </div>
  );
}
