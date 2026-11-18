import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../../../services/api";
export default function InformationPage() {
  const { slug } = useParams(),
    [item, setItem] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setItem(null);
    setError("");
    api
      .management(`/public/${slug}`)
      .then((r) => {
        if (active) setItem(r.data);
      })
      .catch((e) => {
        if (active) setError(e.message);
      });
    return () => {
      active = false;
    };
  }, [slug]);
  return (
    <main className="max-w-4xl mx-auto px-5 py-12">
      <Link to="/" className="text-cyan-300 text-sm">
        Back to home
      </Link>
      {item ? (
        <article className="glass-panel rounded-3xl p-6 sm:p-10 mt-6">
          <h1 className="text-3xl font-bold">{item.title}</h1>
          <p className="text-xs text-slate-500 mt-3">
            Published {new Date(item.publishedAt).toLocaleDateString()}
          </p>
          <div className="whitespace-pre-wrap break-words text-slate-300 leading-8 mt-8">
            {item.body}
          </div>
        </article>
      ) : (
        <p role="status" className="mt-8">
          {error || "Loading information…"}
        </p>
      )}
      <Link to="/buyer/requests" className="text-cyan-300 inline-block mt-8">
        Contact checker support
      </Link>
    </main>
  );
}
