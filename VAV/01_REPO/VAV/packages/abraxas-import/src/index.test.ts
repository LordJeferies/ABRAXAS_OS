import {describe, expect, it} from "vitest";
import {approveArtifact, forceCandidate, parseAbraxasArtifact} from "./index.ts";

const style = `VAV_STYLE_CARD_V1
[IDENTITY]
id=vav.test_editorial
family=test
name=Test Editorial
status=approved
confidence=0.91
[TYPOGRAPHY]
font_category=mixed
weight_default=900
italic_default=true
case=sentence
tracking_em=-0.02
line_height=0.95
[SIZE]
base_size_ratio_height=0.05
hero_scale=1.6
max_lines=3
max_width_ratio=0.8
[COLOR]
primary_fill=#FFFFFF
hero_fill=#FFCC00
stroke_color=#000000
shadow_opacity=0.5
[HIERARCHY]
hero_word_enabled=true
hero_word_count=1..2
[STRUCTURE]
preferred=hero_stack
alternatives=balanced,progressive
[PLACEMENT]
preferred_zone=center_low
scene_smart=required
[MOTION]
motion_family=slide_blur_lite
enter=blur_slide
enter_ms=280
exit=fade
[TIMING]
display_mode=hybrid
min_visible_ms=550
[NOTES]
human_description=Editorial test.`;

describe("ABRAXAS import", () => {
  it("parses an executable style card but can force it back to candidate", () => {
    const parsed = parseAbraxasArtifact(style, "test-style.txt");
    expect(parsed.kind).toBe("caption-style");
    expect(parsed.executable).toBe(true);
    expect(parsed.stylePreset?.sizing.heroScale).toBe(1.6);
    expect(parsed.stylePreset?.hierarchy.heroCount).toEqual({min: 1, max: 2});
    expect(forceCandidate(parsed).status).toBe("candidate");
  });

  it("maps canonical VAV style aliases onto built-in ids", () => {
    const parsed = parseAbraxasArtifact(style.replace("vav.test_editorial", "vav.hybrid_inspirational"), "hybrid.txt");
    expect(parsed.stylePreset?.id).toBe("hybrid-inspirational");
  });

  it("keeps deep JSON boards reference-only", () => {
    const parsed = parseAbraxasArtifact(JSON.stringify([{pattern_scope: "COMPONENT_PATTERN", visual_identity: "masked type"}]), "qvr.json");
    expect(parsed.kind).toBe("quick-reference");
    expect(parsed.executable).toBe(false);
    expect(parsed.status).toBe("reference-only");
  });

  it("requires executable artifacts before approval", () => {
    const parsed = parseAbraxasArtifact("ABRAXAS_SPATIAL_TRANSFORM_3D_V1\n[POSITION]\nx_norm=0.5\ny_norm=0.3\nz_norm=-0.2", "spatial.txt");
    expect(parsed.kind).toBe("spatial-transform");
    expect(() => approveArtifact(parsed)).toThrow();
  });
});
