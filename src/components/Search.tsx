"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { searchDocuments, type SearchDocument } from "@/lib/search";

export function Search({ documents }: { documents: SearchDocument[] }) {
  const [query, setQuery] = useState("");
  const results = useMemo(
    () => searchDocuments(documents, query),
    [documents, query],
  );
  const hasQuery = query.trim() !== "";

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search posts…"
        aria-label="Search posts"
        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-base outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900"
      />

      {hasQuery && (
        <p className="mt-3 text-sm text-zinc-500">
          {results.length} {results.length === 1 ? "result" : "results"}
        </p>
      )}

      {results.length > 0 && (
        <ul className="mt-4 space-y-6">
          {results.map((doc) => (
            <li key={doc.slug}>
              <h2 className="text-lg font-semibold">
                <Link href={`/posts/${doc.slug}`} className="hover:underline">
                  {doc.title}
                </Link>
              </h2>
              {doc.description !== "" && (
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                  {doc.description}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
