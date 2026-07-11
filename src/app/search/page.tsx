import type { Metadata } from "next";
import { Search } from "@/components/Search";
import { getSearchDocuments } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Search",
  description: "Search all posts by title, tag, or content.",
};

export default function SearchPage() {
  const documents = getSearchDocuments();

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 text-3xl font-bold tracking-tight">Search</h1>
      <Search documents={documents} />
    </div>
  );
}
