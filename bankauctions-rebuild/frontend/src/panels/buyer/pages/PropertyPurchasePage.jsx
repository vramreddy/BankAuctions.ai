import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../services/api";
import {
  Panel,
  Feedback,
  Status,
} from "../../../components/workflow/WorkflowUI";
import { formatINR } from "../../../utils/formatters";
export default function PropertyPurchasePage() {
  const { id } = useParams(),
    [asset, setAsset] = useState(null),
    [unlocked, setUnlocked] = useState(false),
    [purchase, setPurchase] = useState(null),
    [items, setItems] = useState([]),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setAsset(null);
    setPurchase(null);
    setError("");
    (id ? api.getAuctionById(id) : api.getPurchases())
      .then((r) => {
        if (active) {
          if (id) {
            setAsset(r.data);
            setUnlocked(r.userState?.isUnlocked);
          } else setItems(r.data);
        }
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [id]);
  async function prepare() {
    setBusy(true);
    setError("");
    try {
      setPurchase((await api.preparePropertyPurchase(id)).data);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function refresh() {
    try {
      setPurchase((await api.getPurchase(purchase.id)).data);
      const result = await api.getAuctionById(id);
      setUnlocked(result.userState?.isUnlocked);
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-3xl font-bold">
        {id ? "Property access purchase" : "Property purchases"}
      </h1>
      <Feedback error={error} />
      {!id ? (
        <Panel>
          {items.map((p) => (
            <Link
              key={p.id}
              className="block border-b border-slate-800 py-4"
              to={`/buyer/purchase/${p.auctionId}`}
            >
              <p className="text-cyan-300">{p.auctionTitle}</p>
              <p className="my-2">{formatINR(p.amountPaise / 100)}</p>
              <Status value={p.status} />
            </Link>
          ))}
          {!items.length && (
            <p className="text-slate-400">No property purchase requests yet.</p>
          )}
        </Panel>
      ) : (
        asset && (
          <Panel>
            <h2 className="text-xl font-semibold">{asset.title}</h2>
            <p className="text-slate-400 mt-2 capitalize">
              {asset.locality}, {asset.city}
            </p>
            {unlocked ? (
              <div className="mt-6">
                <Status value="ACCESS AVAILABLE" />
                <Link className="block mt-5 text-cyan-300" to={`/lot/${id}`}>
                  Open property details
                </Link>
              </div>
            ) : (
              <>
                <p className="text-2xl font-bold mt-6">
                  {asset.accessPricePaise
                    ? formatINR(asset.accessPricePaise / 100)
                    : "Access fee not set"}
                </p>
                <p className="text-sm text-slate-400 mt-3">
                  This fee is for access to this property's information only. It
                  is separate from the auction reserve price, EMD, and any
                  payment to the lender.
                </p>
                <p className="text-sm text-amber-200 mt-5">
                  Online payment is not available yet. Preparing a purchase will
                  not collect money or unlock this property.
                </p>
                <button
                  disabled={busy || !asset.accessPricePaise}
                  className="btn-primary rounded-xl px-5 py-3 mt-5 disabled:opacity-50"
                  onClick={prepare}
                >
                  {busy ? "Preparing…" : "Prepare property purchase"}
                </button>
                {purchase && (
                  <div className="mt-6 space-y-3 border-t border-slate-700 pt-5">
                    <Status value={purchase.status} />
                    <p className="text-sm text-slate-400">
                      Reference: {purchase.id}
                    </p>
                    <p className="text-sm">
                      {purchase.message ||
                        "Access is granted only after a verified successful payment."}
                    </p>
                    <button className="text-cyan-300" onClick={refresh}>
                      Refresh status
                    </button>
                  </div>
                )}
              </>
            )}
            <div className="flex flex-wrap gap-5 mt-8 text-sm">
              <Link className="text-cyan-300" to="/information/payments">
                Payment information
              </Link>
              <Link className="text-cyan-300" to="/information/refunds">
                Refund policy
              </Link>
              <Link
                className="text-cyan-300"
                to={`/buyer/requests?auctionId=${id}`}
              >
                Ask checker
              </Link>
            </div>
          </Panel>
        )
      )}
    </div>
  );
}
