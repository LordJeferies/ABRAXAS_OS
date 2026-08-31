import type {CutPlan} from "@vav/cut-domain";
import {parseRationalFps} from "@vav/timebase";

const usToTimecode = (us: number, fpsNominal: number = 30): string => {
  const totalSeconds = us / 1_000_000;
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = Math.floor(totalSeconds % 60);
  const frames = Math.floor((totalSeconds - Math.floor(totalSeconds)) * fpsNominal);

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(mins)}:${pad(secs)}:${pad(frames)}`;
};

export const exportCutPlanToEdl = (cutPlan: CutPlan): string => {
  const primarySource = cutPlan.sourceMedia[0];
  const fpsRational = cutPlan.timelineTarget.fpsRational;

  if (fpsRational === "30000/1001") {
    throw new Error(
      "EDL V1 does not support NTSC 30000/1001 (29.97 fps) drop-frame timecode math. " +
      "Supported frame rates for EDL V1 are non-drop rates (24/1, 25/1, 30/1, 24000/1001). " +
      "Please use FCPXML export for 30000/1001 timelines."
    );
  }

  const fps = parseRationalFps(fpsRational);
  const fpsNominal = fps.num / fps.den;

  const lines = [
    `TITLE: ${cutPlan.deliverableId.toUpperCase()}`,
    "FCM: NON-DROP FRAME",
    ""
  ];

  for (let i = 0; i < cutPlan.segments.length; i++) {
    const seg = cutPlan.segments[i]!;
    const trackNum = (i + 1).toString().padStart(3, "0");
    const srcIn = usToTimecode(seg.sourceRange.startUs, fpsNominal);
    const srcOut = usToTimecode(seg.sourceRange.endUs, fpsNominal);
    const edIn = usToTimecode(seg.editedRange.startUs, fpsNominal);
    const edOut = usToTimecode(seg.editedRange.endUs, fpsNominal);

    lines.push(`${trackNum}  AX       V     C        ${srcIn} ${srcOut} ${edIn} ${edOut}`);
    lines.push(`* FROM CLIP NAME: ${primarySource?.sourceAssetId ?? "SOURCE"}`);
    lines.push(`* ROLE: ${seg.editorialRole}`);
    lines.push("");
  }

  return lines.join("\n");
};

export const exportCutPlanToFcpxml = (cutPlan: CutPlan): string => {
  const primarySource = cutPlan.sourceMedia[0];
  const totalSec = (cutPlan.timelineTarget.totalDurationUs / 1_000_000).toFixed(4);
  const fps = parseRationalFps(cutPlan.timelineTarget.fpsRational);
  const frameDurationStr = `${fps.den}/${fps.num}s`;

  const clipElements = cutPlan.segments.map((seg) => {
    const srcStartSec = (seg.sourceRange.startUs / 1_000_000).toFixed(4);
    const durSec = ((seg.sourceRange.endUs - seg.sourceRange.startUs) / 1_000_000).toFixed(4);
    const edStartSec = (seg.editedRange.startUs / 1_000_000).toFixed(4);

    return `        <asset-clip name="${seg.segmentId}" offset="${edStartSec}s" ref="r1" duration="${durSec}s" start="${srcStartSec}s" />`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE fcpxml>
<fcpxml version="1.10">
  <resources>
    <format id="r0" name="FFVideoFormat" frameDuration="${frameDurationStr}" width="${cutPlan.timelineTarget.width}" height="${cutPlan.timelineTarget.height}" />
    <asset id="r1" name="${primarySource?.sourceAssetId ?? "source"}" src="${primarySource?.pathOrUri ?? ""}" />
  </resources>
  <library>
    <event name="${cutPlan.contentId}">
      <project name="${cutPlan.deliverableId}">
        <sequence format="r0" duration="${totalSec}s">
          <spine>
${clipElements}
          </spine>
        </sequence>
      </project>
    </event>
  </library>
</fcpxml>`;
};
