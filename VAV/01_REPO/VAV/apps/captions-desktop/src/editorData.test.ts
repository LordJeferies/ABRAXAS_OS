import {describe, expect, it} from "vitest";
import {captionAtFrame, frameToClock, getCaptionById} from "./editorData.ts";

describe("desktop editor demo mapping", () => {
  it("maps frame selection to the correct caption", () => {
    expect(captionAtFrame(150)?.id).toBe("cap-002");
    expect(captionAtFrame(550)?.id).toBe("cap-005");
  });

  it("maps ids and frames deterministically", () => {
    expect(getCaptionById("cap-003")?.startFrame).toBe(270);
    expect(frameToClock(150, 30)).toBe("00:05.00");
  });
});
