import {existsSync} from "node:fs";
import {homedir} from "node:os";
import {join} from "node:path";
import {spawnSync} from "node:child_process";

const commandPath = (command: string): string | null => {
  const result = spawnSync("which", [command], {encoding: "utf8"});
  return result.status === 0 ? result.stdout.trim() : null;
};

export const collectHealth = () => {
  const modelPath = join(
    homedir(),
    "Library",
    "Application Support",
    "VAV",
    "models",
    "whisper",
    "ggml-large-v3-turbo.bin"
  );

  return {
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    ffmpeg: commandPath("ffmpeg"),
    ffprobe: commandPath("ffprobe"),
    whisperCli: commandPath("whisper-cli"),
    whisperModel: existsSync(modelPath) ? modelPath : null
  };
};
