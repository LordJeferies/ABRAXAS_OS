import {readFileSync} from "node:fs";
import {extname} from "node:path";
import type {ContentCandidate, MotionContext} from "./full-alpha-types.ts";

const timeToUs = (value: string): number => {
  const text = value.trim();
  if (/^\d+(?:\.\d+)?$/.test(text)) return Math.round(Number(text) * 1_000_000);
  const parts = text.split(":").map(Number);
  if (parts.some((n) => !Number.isFinite(n))) return 0;
  if (parts.length === 2) return Math.round((parts[0]! * 60 + parts[1]!) * 1_000_000);
  if (parts.length === 3) return Math.round((parts[0]! * 3600 + parts[1]! * 60 + parts[2]!) * 1_000_000);
  return 0;
};

const normalizeRole = (value: string): ContentCandidate["role"] => {
  const x = value.toLowerCase();
  if (x.includes("hook") || x.includes("gancho")) return "hook";
  if (x.includes("develop") || x.includes("desarrollo")) return "development";
  if (x.includes("proof") || x.includes("prueba")) return "proof";
  if (x.includes("close") || x.includes("cierre")) return "close";
  if (x.includes("cta")) return "cta";
  return "other";
};

export const parseContentText = (text: string): ContentCandidate[] => {
  const clean = text.replace(/<[^>]+>/g, " ");
  const lines = clean.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const range = /(\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?|\d+(?:\.\d+)?)\s*(?:-|–|—|→|to)\s*(\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?|\d+(?:\.\d+)?)\s*(.*)/i;
  const out: ContentCandidate[] = [];

  for (const line of lines) {
    const m = line.match(range);
    if (!m) continue;
    const rest = (m[3] ?? "").trim();
    const roleToken = rest.match(/^(hook|gancho|development|desarrollo|proof|prueba|close|cierre|cta|other)\s*:?\s*/i)?.[1] ?? "other";
    const label = rest.replace(/^(hook|gancho|development|desarrollo|proof|prueba|close|cierre|cta|other)\s*:?\s*/i, "").trim() || rest;
    const motionHint = rest.match(/(?:motion|motion_hint)\s*[:=]\s*([A-Z0-9_-]+)/i)?.[1] ?? null;

    out.push({
      id: `content-${out.length + 1}`,
      startUs: timeToUs(m[1]!),
      endUs: timeToUs(m[2]!),
      role: normalizeRole(roleToken),
      label,
      motionHint
    });
  }

  return out.filter((item) => item.endUs > item.startUs);
};

const policy = (family: string) => {
  if (family === "ABRAXAS_MOTION_03") return {
    textOwnership: "visual-motion" as const,
    captionVisibility: "suppress" as const,
    sceneSmartMode: "restricted" as const
  };
  if (family === "ABRAXAS_MOTION_02") return {
    textOwnership: "hybrid" as const,
    captionVisibility: "adaptive" as const,
    sceneSmartMode: "restricted" as const
  };
  if (family === "GENERIC_BROLL") return {
    textOwnership: "caption-engine" as const,
    captionVisibility: "visible" as const,
    sceneSmartMode: "required" as const
  };
  return {
    textOwnership: "caption-engine" as const,
    captionVisibility: "visible" as const,
    sceneSmartMode: "normal" as const
  };
};

export const parseMotionText = (text: string): MotionContext[] => {
  const clean = text.replace(/<[^>]+>/g, " ");
  const lines = clean.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const range = /(\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?|\d+(?:\.\d+)?)\s*(?:-|–|—|→|to)\s*(\d{1,2}:\d{2}(?::\d{2}(?:\.\d+)?)?|\d+(?:\.\d+)?)\s+([A-Z][A-Z0-9_-]*)(?:\s+(.*))?/i;
  const out: MotionContext[] = [];

  for (const line of lines) {
    const m = line.match(range);
    if (!m) continue;
    const family = (m[3] ?? "CUSTOM").toUpperCase();
    out.push({
      id: `motion-${out.length + 1}`,
      startUs: timeToUs(m[1]!),
      endUs: timeToUs(m[2]!),
      family,
      visualMode: (m[4] ?? "default").trim(),
      ...policy(family)
    });
  }

  return out.filter((item) => item.endUs > item.startUs);
};

export const importContentFile = (path: string): ContentCandidate[] => {
  const text = readFileSync(path, "utf8");
  if (extname(path).toLowerCase() === ".json") {
    const raw = JSON.parse(text);
    const items = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.segments)
        ? raw.segments
        : Array.isArray(raw?.candidates)
          ? raw.candidates
          : [];

    return items.map((item: any, index: number) => ({
      id: String(item.id ?? item.candidateId ?? `content-${index + 1}`),
      startUs: Number(item.startUs ?? item.sourceStartUs ?? 0),
      endUs: Number(item.endUs ?? item.sourceEndUs ?? 0),
      role: normalizeRole(String(item.role ?? "other")),
      label: String(item.label ?? item.text ?? item.title ?? `Segment ${index + 1}`),
      motionHint: item.motionHint ? String(item.motionHint) : null
    })).filter((item: ContentCandidate) => item.endUs > item.startUs);
  }
  return parseContentText(text);
};

export const importMotionFile = (path: string): MotionContext[] => {
  const text = readFileSync(path, "utf8");
  if (extname(path).toLowerCase() === ".json") {
    const raw = JSON.parse(text);
    const items = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.motions)
        ? raw.motions
        : Array.isArray(raw?.motionContexts)
          ? raw.motionContexts
          : [];

    return items.map((item: any, index: number) => {
      const family = String(item.family ?? item.motionFamily ?? "CUSTOM").toUpperCase();
      const fallback = policy(family);
      return {
        id: String(item.id ?? item.motionInstanceId ?? `motion-${index + 1}`),
        startUs: Number(item.startUs ?? item.timelineStartUs ?? item.sourceStartUs ?? 0),
        endUs: Number(item.endUs ?? item.timelineEndUs ?? item.sourceEndUs ?? 0),
        family,
        visualMode: String(item.visualMode ?? "default"),
        textOwnership: item.textOwnership ?? fallback.textOwnership,
        captionVisibility: item.captionVisibility ?? item.captionPolicy?.standardCaptionVisibility ?? fallback.captionVisibility,
        sceneSmartMode: item.sceneSmartMode ?? item.captionPolicy?.sceneSmartMode ?? fallback.sceneSmartMode
      } satisfies MotionContext;
    }).filter((item: MotionContext) => item.endUs > item.startUs);
  }
  return parseMotionText(text);
};
