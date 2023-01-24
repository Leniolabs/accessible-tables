import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/service-worker.ts"),
      name: "MyLib",
      // the proper extensions will be added
      fileName: "service-worker",
      formats: ["iife"],
    },
    rollupOptions: {},
  },
  mode: "production",
});
