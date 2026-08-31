import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

const heRoot = path.resolve(__dirname, "../../../ABRAXAS_CORE/HE/06_TASKS_AND_TEAMS");

export default defineConfig({
  root: heRoot,
  plugins: [react()],
  resolve: {
    alias: {
      "react-dom/server": path.resolve(__dirname, "node_modules/react-dom/server.node.js"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
      "react/jsx-dev-runtime": path.resolve(__dirname, "node_modules/react/jsx-dev-runtime.js"),
      "react/jsx-runtime": path.resolve(__dirname, "node_modules/react/jsx-runtime.js"),
      "react": path.resolve(__dirname, "node_modules/react")
    }
  },
  build: {
    outDir: path.resolve(heRoot, "dist"),
    emptyOutDir: true
  },
  server: {
    port: 5174
  }
});
