import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return "vendor"; // All dependencies in one vendor chunk
          }

          // Example: split big libraries if you have them
          if (id.includes("react-router")) return "router";
          if (id.includes("chart.js")) return "charts";
          if (id.includes("lucide-react")) return "icons";

          return null;
        },
      },
    },

    // (Optional) Increase chunk warning limit
    chunkSizeWarningLimit: 1000, // from 500 KB → 1000 KB
  },
});
