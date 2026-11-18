import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import { Panel, Feedback } from "../../components/workflow/WorkflowUI";
export default function CheckerOverviewPage() {
  const [data, setData] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    api
      .workflow("/overview")
      .then((res) => setData(res.data))
      .catch((e) => setError(e.message));
  }, []);
  const cards = [
    ["notices", "Notices to verify", "/checker/queue"],
    ["requests", "Open buyer requests", "/checker/requests"],
    ["reports", "Requested reports to review", "/checker/requests"],
    ["recommendations", "Plan recommendations", "/checker/recommendations"],
    ["deliveries", "Email deliveries pending", "/checker/requests"],
  ];
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wider text-cyan-400">
          Quality control & buyer support
        </p>
        <h1 className="mt-2 text-3xl font-bold">Checker workspace</h1>
        <p className="mt-3 max-w-3xl text-sm text-slate-400">
          Your approval connects verified source data to buyers. Review notices,
          resolve enquiries and check field reports before they are released.
        </p>
      </div>
      <Feedback error={error} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([key, title, path]) => (
          <Link key={key} to={path}>
            <Panel className="h-full hover:border-cyan-400/40">
              <p className="text-xs text-slate-400">{title}</p>
              <p className="mt-4 text-3xl font-bold text-cyan-300">
                {data?.[key] ?? "—"}
              </p>
            </Panel>
          </Link>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          [
            "Asset catalog",
            "Publish, withdraw, revise and feature approved assets.",
            "/checker/catalog",
          ],
          [
            "Buyer activity",
            "Review recorded logins, saved assets, unlocks and requests.",
            "/checker/buyers",
          ],
          [
            "Policies & payments",
            "Draft and publish buyer-facing information.",
            "/checker/content",
          ],
        ].map(([title, description, path]) => (
          <Link key={path} to={path}>
            <Panel>
              <h2 className="font-semibold text-cyan-300">{title}</h2>
              <p className="text-sm text-slate-400 mt-3">{description}</p>
            </Panel>
          </Link>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Panel>
          <h2 className="text-lg font-semibold">1. Verify the notice</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Import the complete extraction, attach source pages, claim the
            record and check address, asset type, amounts and dates. Approval
            publishes the auction immediately.
          </p>
          <Link
            className="mt-5 inline-block text-sm text-cyan-300"
            to="/checker/queue"
          >
            Open notice registry →
          </Link>
        </Panel>
        <Panel>
          <h2 className="text-lg font-semibold">2. Support the buyer</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Reply to enquiries, arrange callbacks, assign document requests to
            an engineer, review findings and release the approved report.
          </p>
          <Link
            className="mt-5 inline-block text-sm text-cyan-300"
            to="/checker/requests"
          >
            Open support desk →
          </Link>
        </Panel>
        <Panel>
          <h2 className="text-lg font-semibold">
            3. Review field verification
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Submitted inspections remain private until a checker verifies them.
            Returned reports can be corrected by the assigned engineer.
          </p>
          <Link
            className="mt-5 inline-block text-sm text-cyan-300"
            to="/checker/inspections"
          >
            Review field submissions →
          </Link>
        </Panel>
        <Panel>
          <h2 className="text-lg font-semibold">
            4. Review plan recommendations
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Check the buyer’s stated preferences and marketing follow-up notes.
            Approval releases a recommendation, not a payment or automatic
            subscription change.
          </p>
          <Link
            className="mt-5 inline-block text-sm text-cyan-300"
            to="/checker/recommendations"
          >
            Review recommendations →
          </Link>
        </Panel>
      </div>
      {data && !data.mailConfigured && (
        <Panel>
          <p className="text-sm text-amber-200">
            Email delivery is not configured. Approved reports remain accessible
            in the buyer workspace; queued emails are not marked sent.
          </p>
        </Panel>
      )}
    </div>
  );
}
