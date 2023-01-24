import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "src/content.ts"),
      name: "MyLib",
      // the proper extensions will be added
      fileName: "content",
      formats: ["es"],
    },
    rollupOptions: {},
  },
  mode: "production",
});
