export type SearchDocument = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  text: string;
};

/**
 * Rank documents against a query using case-insensitive term matching.
 *
 * Every whitespace-separated term must appear somewhere in a document for it to
 * match (AND semantics). Matches are weighted by field — title over tags over
 * body — and results are returned highest score first.
 */
export function searchDocuments(
  documents: SearchDocument[],
  query: string,
): SearchDocument[] {
  const normalized = query.trim().toLowerCase();
  if (normalized === "") {
    return [];
  }

  const terms = normalized.split(/\s+/);

  return documents
    .map((doc) => {
      const title = doc.title.toLowerCase();
      const tags = doc.tags.map((tag) => tag.toLowerCase());
      const body = `${doc.description} ${doc.text}`.toLowerCase();

      let score = 0;
      for (const term of terms) {
        if (title.includes(term)) {
          score += 3;
        } else if (tags.some((tag) => tag.includes(term))) {
          score += 2;
        } else if (body.includes(term)) {
          score += 1;
        } else {
          return null;
        }
      }

      return { doc, score };
    })
    .filter(
      (entry): entry is { doc: SearchDocument; score: number } =>
        entry !== null,
    )
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.doc);
}
