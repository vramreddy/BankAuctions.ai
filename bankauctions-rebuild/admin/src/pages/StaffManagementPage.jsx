import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  Panel,
  Field,
  Feedback,
  inputClass,
} from "../components/workflow/WorkflowUI";
export default function StaffManagementPage() {
  const [items, setItems] = useState([]),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  const blank = {
    fullName: "",
    email: "",
    phone: "",
    password: "",
    role: "CHECKER",
  };
  const [form, setForm] = useState(blank);
  async function load() {
    try {
      setItems(
        (await api.admin("/users")).data.filter((u) => u.role !== "BUYER"),
      );
    } catch (e) {
      setError(e.message);
    }
  }
  useEffect(() => {
    load();
  }, []);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.admin("/staff", { method: "POST", body: JSON.stringify(form) });
      setForm(blank);
      setMessage("Staff account created.");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Staff accounts</h1>
      <Feedback error={error} message={message} />
      <Panel>
        <h2 className="text-xl font-semibold mb-4">Create staff access</h2>
        <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4">
          {["fullName", "email", "phone", "password"].map((key) => (
            <Field
              key={key}
              label={
                {
                  fullName: "Full name",
                  email: "Email",
                  phone: "Phone (10 digits)",
                  password: "Password (12+ characters)",
                }[key]
              }
            >
              <input
                className={inputClass}
                required
                type={
                  key === "password"
                    ? "password"
                    : key === "email"
                      ? "email"
                      : "text"
                }
                minLength={key === "password" ? 12 : undefined}
                autoComplete={key === "password" ? "new-password" : "off"}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              />
            </Field>
          ))}
          <Field label="Role">
            <select
              className={inputClass}
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {["CHECKER", "ENGINEER", "MARKETING", "ADMIN"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </select>
          </Field>
          <button
            className="btn-primary rounded-xl px-4 py-3 self-end"
            disabled={busy}
          >
            {busy ? "Creating…" : "Create account"}
          </button>
        </form>
      </Panel>
      <Panel>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr>
                <th className="p-3">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((u) => (
                <tr key={u.id} className="border-t border-slate-800">
                  <td className="p-3">{u.fullName}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>{u.isActive ? "Active" : "Suspended"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
