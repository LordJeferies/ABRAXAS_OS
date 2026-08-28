import {defineConfig} from "vitest/config";

export default defineConfig({
  test: {
    include: [
      "apps/**/*.test.ts",
      "apps/**/*.test.tsx",
      "packages/**/*.test.ts",
      "packages/**/*.test.tsx",
      "services/**/*.test.ts",
      "services/**/*.test.tsx"
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
