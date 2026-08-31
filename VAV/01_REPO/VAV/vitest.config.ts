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
      "../../../ABRAXAS_CORE/HE/06_TASKS_AND_TEAMS/tests/**/*.test.tsx"
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
