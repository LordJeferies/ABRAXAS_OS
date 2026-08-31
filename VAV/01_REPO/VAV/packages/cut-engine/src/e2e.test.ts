import {describe, expect, it} from "vitest";
import {execFileSync} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import crypto from "node:crypto";
import {assembleCutPlan, buildFfmpegCutPlanCommand} from "./index.ts";
import type {CutCandidate, CutDecision, SourceMediaRef} from "@vav/cut-domain";

const computeFileSha256 = (filePath: string): string => {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
};

describe("VAV Cuts V1 Hardened Synthetic E2E", () => {
  it("executes a non-destructive multi-segment cut with local FFmpeg, verifies immutability and ffprobe streams", () => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "vav_cuts_e2e_"));
    const syntheticSource = path.join(tmpDir, "synth_source.mp4");
    const syntheticOutput = path.join(tmpDir, "synth_output.mp4");

    try {
      // 1. Generate 5-second synthetic test source with test tone and color bars using array exec
      execFileSync("ffmpeg", [
        "-y",
        "-f", "lavfi", "-i", "testsrc=duration=5:size=320x240:rate=30",
        "-f", "lavfi", "-i", "sine=frequency=440:duration=5",
        "-c:v", "libx264", "-preset", "ultrafast",
        "-c:a", "aac",
        syntheticSource
      ], {stdio: "ignore"});

      expect(fs.existsSync(syntheticSource)).toBe(true);
      const sourceHashBefore = computeFileSha256(syntheticSource);

      const sourceMedia: [SourceMediaRef] = [{
        sourceAssetId: "src_synthetic_001",
        pathOrUri: syntheticSource,
        durationUs: 5_000_000,
        timebase: {fpsRational: "30/1", fpsNominal: 30, width: 320, height: 240}
      }];

      const candidates: CutCandidate[] = [
        {
          candidateId: "c1",
          sourceAssetId: "src_synthetic_001",
          sourceRange: {startUs: 500_000, endUs: 2_000_000}, // 0.5s to 2.0s (1.5s)
          editorialRole: "HOOK",
          confidence: 0.99
        },
        {
          candidateId: "c2",
          sourceAssetId: "src_synthetic_001",
          sourceRange: {startUs: 3_000_000, endUs: 4_500_000}, // 3.0s to 4.5s (1.5s)
          editorialRole: "PAYOFF",
          confidence: 0.99
        }
      ];

      const decisions: CutDecision[] = [
        {decisionId: "d1", candidateId: "c1", decisionType: "KEEP", decisionOrigin: "USER"},
        {decisionId: "d2", candidateId: "c2", decisionType: "KEEP", decisionOrigin: "USER"}
      ];

      // 2. Assemble CutPlan
      const cutPlan = assembleCutPlan({
        contentId: "cnt_synthetic_test",
        deliverableId: "deliv_synth_01",
        formatId: "FMT_SHORT_VERTICAL_VIDEO",
        sourceMedia,
        candidates,
        decisions
      });

      expect(cutPlan.timelineTarget.totalDurationUs).toBe(3_000_000); // 1.5s + 1.5s = 3.0s

      // 3. Build FFmpeg command
      const {commandArgs} = buildFfmpegCutPlanCommand(cutPlan, {
        outputPath: syntheticOutput,
        useVideoToolbox: false
      });

      // 4. Run FFmpeg command using array execution (no shell string)
      execFileSync("ffmpeg", commandArgs, {stdio: "ignore"});

      expect(fs.existsSync(syntheticOutput)).toBe(true);
      const stat = fs.statSync(syntheticOutput);
      expect(stat.size).toBeGreaterThan(1000);

      // 5. Verify source media immutability
      const sourceHashAfter = computeFileSha256(syntheticSource);
      expect(sourceHashAfter).toBe(sourceHashBefore);

      // 6. Run ffprobe inspection against output video
      const ffprobeRaw = execFileSync("ffprobe", [
        "-v", "error",
        "-show_streams",
        "-show_format",
        "-print_format", "json",
        syntheticOutput
      ], {encoding: "utf-8"});

      const probeData = JSON.parse(ffprobeRaw);
      const videoStream = probeData.streams?.find((s: any) => s.codec_type === "video");
      const audioStream = probeData.streams?.find((s: any) => s.codec_type === "audio");

      expect(videoStream).toBeDefined();
      expect(videoStream.codec_name).toBe("h264");
      expect(videoStream.width).toBe(320);
      expect(videoStream.height).toBe(240);

      expect(audioStream).toBeDefined();
      expect(audioStream.codec_name).toBe("aac");

      const durationSec = parseFloat(probeData.format?.duration ?? "0");
      expect(durationSec).toBeGreaterThanOrEqual(2.9);
      expect(durationSec).toBeLessThanOrEqual(3.2);
    } finally {
      fs.rmSync(tmpDir, {recursive: true, force: true});
    }
  });
});
