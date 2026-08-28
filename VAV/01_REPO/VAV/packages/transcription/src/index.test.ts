import {describe, expect, it} from "vitest";
import {
  DEFAULT_MODEL_ID,
  DEFAULT_PROVIDER_ID,
  isMlxSupportedPlatform
} from "./index.ts";

describe("transcription policy", () => {
  it("keeps Whisper.cpp Turbo as default", () => {
    expect(DEFAULT_PROVIDER_ID).toBe("whisper-cpp");
    expect(DEFAULT_MODEL_ID).toBe("large-v3-turbo");
  });

  it("enables MLX platform capability only on Apple Silicon macOS", () => {
    expect(isMlxSupportedPlatform("darwin", "arm64")).toBe(true);
    expect(isMlxSupportedPlatform("win32", "x64")).toBe(false);
    expect(isMlxSupportedPlatform("linux", "x64")).toBe(false);
  });
});
