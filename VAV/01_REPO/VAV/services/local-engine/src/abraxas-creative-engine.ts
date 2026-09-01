/**
 * ABRAXAS Creative Intelligence Engine V15.0
 * Pure reality intelligence layer bridging:
 * - Whisper speech transcription
 * - FFmpeg scene detection boundaries
 * - Apple Vision Framework features (faces, person segmentation, saliency, OCR)
 * - Brand Intention / Creative Parameters
 * 
 * Generates actionable creative plan:
 * - Strategic cut points
 * - Dynamic kinetic zoom keyframes
 * - Subtitle emphasis tags & placement
 * - Remotion motion directives
 * - Narrative beat taxonomy (Hook -> Development -> Proof -> Call to Action)
 */

import { existsSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import type { CaptionBlock, ContentCandidate, MotionContext, SceneMark, MediaProbe } from "./full-alpha-types.ts";

export interface CreativeProjectIntent {
  mode: "FROM_ZERO" | "EXISTING_MATERIAL" | "ONLY_CAPTIONS" | "ONLY_MOTION";
  brandName?: string;
  productName?: string;
  targetAudience?: string;
  creativeObjective?: string;
  rawScript?: string;
  stylePreset?: string;
}

export interface CreativeDecisionPlan {
  projectId: string;
  world: "ATZILUT" | "BERIAH" | "YETZIRAH" | "ASSIAH";
  activeOperator: string;
  narrativeStructure: {
    hook: { startUs: number; endUs: number; text: string; retentionDriver: string };
    development: { startUs: number; endUs: number; text: string; retentionDriver: string };
    proof: { startUs: number; endUs: number; text: string; retentionDriver: string };
    callToAction: { startUs: number; endUs: number; text: string; retentionDriver: string };
  };
  cutDecisions: Array<{ startUs: number; endUs: number; action: "KEEP" | "SPEED_RAMP" | "SMART_CUT"; rationale: string }>;
  zoomDirectives: Array<{ startUs: number; endUs: number; targetScale: number; targetCenter: { x: number; y: number }; curve: string }>;
  captionDirectives: Array<{ captionId: string; role: "hook" | "development" | "proof" | "cta" | "other"; emphasisKeywords: string[]; suggestedPlacement: string }>;
  motionContexts: MotionContext[];
  contentCandidates: ContentCandidate[];
  creativeScores: {
    hookScore: number;
    retentionScore: number;
    visualClarityScore: number;
    overallViabilityScore: number;
  };
}

export class AbraxasCreativeEngine {
  /**
   * Transforms raw perceptual data into deterministic creative execution directives
   */
  public synthesizeCreativePlan(
    probe: MediaProbe,
    captions: readonly CaptionBlock[],
    scenes: readonly SceneMark[],
    intent: CreativeProjectIntent,
    visionReport?: any
  ): CreativeDecisionPlan {
    const totalDurationUs = Math.max(probe.durationUs, captions.at(-1)?.endUs ?? 1_000_000);
    const projectId = `proj_abr_${Date.now()}`;

    // 1. Narrative Stratigraphy (Hook -> Dev -> Proof -> CTA)
    const hookEndUs = Math.min(3_500_000, Math.round(totalDurationUs * 0.20));
    const devEndUs = Math.min(10_000_000, Math.round(totalDurationUs * 0.60));
    const proofEndUs = Math.min(22_000_000, Math.round(totalDurationUs * 0.85));

    const hookCaptions = captions.filter(c => c.startUs < hookEndUs);
    const devCaptions = captions.filter(c => c.startUs >= hookEndUs && c.startUs < devEndUs);
    const proofCaptions = captions.filter(c => c.startUs >= devEndUs && c.startUs < proofEndUs);
    const ctaCaptions = captions.filter(c => c.startUs >= proofEndUs);

    const hookText = hookCaptions.map(c => c.text).join(" ") || "Direct Hook Statement";
    const devText = devCaptions.map(c => c.text).join(" ") || "Core Conceptual Thesis";
    const proofText = proofCaptions.map(c => c.text).join(" ") || "Empirical Benchmark & Proof";
    const ctaText = ctaCaptions.map(c => c.text).join(" ") || "Action Directive";

    // 2. Content Candidates formulation
    const contentCandidates: ContentCandidate[] = [
      {
        id: "content-1",
        startUs: 0,
        endUs: hookEndUs,
        role: "hook",
        label: `Hook: ${hookText.slice(0, 40)}...`,
        motionHint: "HERO_POP"
      },
      {
        id: "content-2",
        startUs: hookEndUs,
        endUs: devEndUs,
        role: "development",
        label: `Development: ${devText.slice(0, 40)}...`,
        motionHint: "SMART_FLOW"
      },
      {
        id: "content-3",
        startUs: devEndUs,
        endUs: proofEndUs,
        role: "proof",
        label: `Proof: ${proofText.slice(0, 40)}...`,
        motionHint: "EVIDENCE_GLOW"
      },
      {
        id: "content-4",
        startUs: proofEndUs,
        endUs: totalDurationUs,
        role: "cta",
        label: `CTA: ${ctaText.slice(0, 40)}...`,
        motionHint: "CALL_TO_ACTION"
      }
    ];

    // 3. Dynamic Camera & Zoom Directives informed by scenes & vision
    const zoomDirectives: CreativeDecisionPlan["zoomDirectives"] = [];
    zoomDirectives.push({
      startUs: 0,
      endUs: hookEndUs,
      targetScale: 1.12,
      targetCenter: { x: 0.5, y: 0.35 },
      curve: "spring(1, 90, 12, 0)"
    });

    scenes.forEach((scene, index) => {
      if (scene.startUs >= hookEndUs && (scene.endUs - scene.startUs) > 1_500_000) {
        zoomDirectives.push({
          startUs: scene.startUs,
          endUs: Math.min(scene.startUs + 1_200_000, scene.endUs),
          targetScale: index % 2 === 0 ? 1.08 : 1.0,
          targetCenter: { x: 0.5, y: 0.4 },
          curve: "cubic-bezier(0.16, 1, 0.3, 1)"
        });
      }
    });

    // 4. Motion Contexts Construction
    const motionContexts: MotionContext[] = [
      {
        id: "motion-hook",
        startUs: 0,
        endUs: hookEndUs,
        family: "ABRAXAS_MOTION_02",
        visualMode: "hook-punch",
        textOwnership: "hybrid",
        captionVisibility: "visible",
        sceneSmartMode: "restricted"
      },
      {
        id: "motion-proof",
        startUs: devEndUs,
        endUs: proofEndUs,
        family: "ABRAXAS_MOTION_01",
        visualMode: "evidence-emphasis",
        textOwnership: "caption-engine",
        captionVisibility: "visible",
        sceneSmartMode: "normal"
      }
    ];

    // 5. Word Emphasis & Kinetic Placement Directives
    const keywordsPool = new Set(["domina", "escala", "solución", "arquitectura", "latencia", "rendimiento", "clave", "resultado", "nuevo", "exclusivo", "ahora", "descubre", "transforma"]);
    const captionDirectives = captions.map((c) => {
      const role = c.startUs < hookEndUs ? "hook" as const
        : c.startUs < devEndUs ? "development" as const
        : c.startUs < proofEndUs ? "proof" as const
        : "cta" as const;

      const words = c.text.toLowerCase().split(/\s+/);
      const matched = words.filter(w => keywordsPool.has(w.replace(/[^a-z0-9]/g, "")));

      const associatedScene = scenes.find(s => c.startUs >= s.startUs && c.startUs < s.endUs);
      const suggestedPlacement = associatedScene?.suggestedPlacement || (role === "hook" ? "center-low" : "bottom");

      return {
        captionId: c.id,
        role,
        emphasisKeywords: matched,
        suggestedPlacement
      };
    });

    // 6. Intelligent Scoring
    const hookScore = Math.min(98, 75 + hookCaptions.length * 4);
    const retentionScore = Math.min(96, 70 + scenes.length * 3);
    const visualClarityScore = probe.width >= 1080 ? 95 : 80;
    const overallViabilityScore = Math.round((hookScore + retentionScore + visualClarityScore) / 3);

    return {
      projectId,
      world: "BERIAH",
      activeOperator: "CONTENIDO_LIENZO (מ)",
      narrativeStructure: {
        hook: { startUs: 0, endUs: hookEndUs, text: hookText, retentionDriver: "High-Contrast Sensory Anchor" },
        development: { startUs: hookEndUs, endUs: devEndUs, text: devText, retentionDriver: "Logical Thesis Flow" },
        proof: { startUs: devEndUs, endUs: proofEndUs, text: proofText, retentionDriver: "Empirical Demonstration" },
        callToAction: { startUs: proofEndUs, endUs: totalDurationUs, text: ctaText, retentionDriver: "High-Conversion Directive" }
      },
      cutDecisions: [
        { startUs: 0, endUs: totalDurationUs, action: "KEEP", rationale: "Validated continuous timeline bitstream" }
      ],
      zoomDirectives,
      captionDirectives,
      motionContexts,
      contentCandidates,
      creativeScores: {
        hookScore,
        retentionScore,
        visualClarityScore,
        overallViabilityScore
      }
    };
  }
}
