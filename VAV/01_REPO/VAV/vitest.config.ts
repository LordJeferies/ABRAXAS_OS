import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 20000,
    include: [
      "apps/**/*.test.ts",
      "apps/**/*.test.tsx",
      "packages/**/*.test.ts",
      "packages/**/*.test.tsx",
      "services/**/*.test.ts",
      "services/**/*.test.tsx",
      "../../../ABRAXAS_CORE/HE/06_TASKS_AND_TEAMS/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/HE/06_TASKS_AND_TEAMS/tests/**/*.test.tsx",
      "../../../ABRAXAS_CORE/LIENZO/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/backbone/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/YOD/runtime/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/SHIM/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/vav-bridge/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/ARQUITECTO/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/ai-runtime/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/intake/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/pipeline/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/publishing/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/metrics/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/learning/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/automation/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/jobs/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/health/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/recovery/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/scale-projections/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/contracts/container-readiness/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/contracts/pipeline/tests/**/*.test.ts",
      "../../../ABRAXAS_CORE/tests/**/*.test.ts",
      "../../../apps/public-status/tests/**/*.test.ts"
    ],
    exclude: [
      "**/.vav-backups/**",
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/target/**"
    ]
  }
});
