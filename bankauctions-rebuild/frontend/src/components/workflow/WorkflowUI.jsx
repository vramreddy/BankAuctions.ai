import React from "react";
export const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-cyan-400 focus:outline-none";
export function Panel({ children, className = "" }) {
  return (
    <section
      className={`rounded-2xl border border-white/10 bg-slate-900/70 p-5 sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}
export function Status({ value }) {
  return (
    <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[11px] font-semibold text-cyan-200">
      {String(value || "").replaceAll("_", " ")}
    </span>
  );
}
export function Feedback({ error, message }) {
  return error ? (
    <div
      role="alert"
      className="rounded-xl border border-rose-400/30 bg-rose-400/10 p-4 text-sm text-rose-200"
    >
      {error}
    </div>
  ) : message ? (
    <div
      role="status"
      className="rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-200"
    >
      {message}
    </div>
  ) : null;
}
export function Field({ label, children }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-medium text-slate-300">{label}</span>
      {children}
    </label>
  );
}
export function Empty({ children }) {
  return (
    <Panel>
      <p className="py-8 text-center text-sm text-slate-400">{children}</p>
    </Panel>
  );
}
export function downloadJson(value, name) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export async function filePayload(file) {
  if (file.size > 8 * 1024 * 1024)
    throw new Error("Choose a PDF, PNG or JPG no larger than 8 MB.");
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
  return { name: file.name, mime: file.type, base64 };
}
export async function downloadProtectedFile(id, name) {
  const response = await fetch(
    `/api/v1/workflow/files/${encodeURIComponent(id)}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("ba_token") || ""}`,
      },
    },
  );
  if (!response.ok)
    throw new Error(
      "This attachment is unavailable or you do not have permission to download it.",
    );
  const url = URL.createObjectURL(await response.blob());
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
