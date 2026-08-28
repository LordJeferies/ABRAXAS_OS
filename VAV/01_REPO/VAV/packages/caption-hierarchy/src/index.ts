export type ContentRole = "hook" | "development" | "proof" | "close" | "cta" | "other";

export type HierarchyToken = Readonly<{
  index: number;
  text: string;
  normalized: string;
  score: number;
  role: "hero" | "primary" | "secondary" | "connector" | "number" | "negation";
}>;

const connectors = new Set([
  "a", "al", "and", "as", "at", "con", "de", "del", "e", "el", "en", "for", "from", "la", "las", "los",
  "of", "o", "or", "para", "por", "que", "the", "to", "un", "una", "y", "your", "you", "tu", "su", "es", "is",
  "pero", "but", "como", "how", "when", "cuando", "with", "sin", "without"
]);

const negations = new Set(["no", "not", "never", "nunca", "ni", "without", "sin"]);
const weak = new Set(["esto", "this", "that", "eso", "it", "lo", "ser", "be", "been", "being", "muy", "very"]);

const normalize = (word: string) => word.toLocaleLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9%$€£]+/gi, "");

const semanticScore = (word: string, index: number, count: number, role: ContentRole): number => {
  const n = normalize(word);
  if (!n) return 0;
  let score = .45;
  if (connectors.has(n)) score = .08;
  if (weak.has(n)) score -= .12;
  if (negations.has(n)) score = .42;
  if (/^(?:[$€£]?\d[\d.,]*%?)$/.test(n)) score = .92;
  if (word.length >= 7) score += .16;
  if (word.length >= 10) score += .08;
  if (/[!?]$/.test(word)) score += .08;
  if (index === count - 1) score += .12;
  if (role === "hook" || role === "cta") score += connectors.has(n) ? 0 : .08;
  if (role === "proof" && /\d/.test(n)) score += .12;
  return Math.max(0, Math.min(1, score));
};

export const analyzeHierarchy = (text: string, role: ContentRole = "other", maxHeroes = 1): readonly HierarchyToken[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const scored = words.map((text, index) => ({text, index, normalized: normalize(text), score: semanticScore(text, index, words.length, role)}));
  const allowedCount = Math.max(0, Math.min(3, Math.round(maxHeroes)));
  const candidates = [...scored]
    .filter((x) => x.normalized && !connectors.has(x.normalized) && !negations.has(x.normalized))
    .sort((a, b) => b.score - a.score || b.index - a.index);

  const heroIndices = new Set<number>();
  const seed = candidates[0];
  if (seed && allowedCount > 0) {
    heroIndices.add(seed.index);
    while (heroIndices.size < allowedCount) {
      const min = Math.min(...heroIndices);
      const max = Math.max(...heroIndices);
      const adjacent = [scored[min - 1], scored[max + 1]]
        .filter((x): x is NonNullable<typeof x> => Boolean(x))
        .filter((x) => x.normalized && !connectors.has(x.normalized) && !negations.has(x.normalized))
        .sort((a, b) => b.score - a.score || a.index - b.index)[0];
      if (!adjacent || adjacent.score < .50) break;
      heroIndices.add(adjacent.index);
    }
  }

  return scored.map((x) => ({
    ...x,
    role: heroIndices.has(x.index)
      ? "hero"
      : negations.has(x.normalized)
        ? "negation"
        : connectors.has(x.normalized)
          ? "connector"
          : /\d/.test(x.normalized)
            ? "number"
            : x.score >= .55 ? "primary" : "secondary"
  }));
};

export type CaptionHierarchyLayout = Readonly<{
  tokens: readonly HierarchyToken[];
  heroText: string;
  supportBefore: string;
  supportAfter: string;
  heroIndices: readonly number[];
}>;

export const buildCaptionHierarchy = (text: string, role: ContentRole = "other", maxHeroes = 1): CaptionHierarchyLayout => {
  const tokens = analyzeHierarchy(text, role, maxHeroes);
  const selectedHero = tokens.filter((x) => x.role === "hero").map((x) => x.index).sort((a, b) => a - b);

  // If the semantic hero is immediately negated, the negation is part of the visual hero.
  const heroSpan = new Set(selectedHero);
  for (const index of selectedHero) {
    const prev = tokens[index - 1];
    if (prev?.role === "negation") heroSpan.add(index - 1);
  }

  const heroIndices = [...heroSpan].sort((a, b) => a - b);
  if (!heroIndices.length) {
    return {tokens, heroText: "", supportBefore: tokens.map((x) => x.text).join(" "), supportAfter: "", heroIndices: []};
  }

  // Hero Stack uses one contiguous semantic span so no words disappear from the caption.
  const first = Math.min(...heroIndices);
  const last = Math.max(...heroIndices);
  const contiguousHeroIndices = Array.from({length: last - first + 1}, (_, offset) => first + offset);

  return {
    tokens,
    heroText: contiguousHeroIndices.map((i) => tokens[i]?.text ?? "").filter(Boolean).join(" "),
    supportBefore: tokens.filter((x) => x.index < first).map((x) => x.text).join(" "),
    supportAfter: tokens.filter((x) => x.index > last).map((x) => x.text).join(" "),
    heroIndices: contiguousHeroIndices
  };
};
