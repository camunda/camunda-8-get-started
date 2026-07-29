import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The order-process example, running in the browser.
//
// The nanobpm engine ships as a wasm-pack `--target web` module
// (`@nanobpm/engine-wasm`) that resolves its binary via
// `new URL('nanobpmn_engine_bg.wasm', import.meta.url)`. We exclude the
// `@nanobpm/*` packages from esbuild's dependency pre-bundling so that
// `import.meta.url` reference survives and Vite emits the `.wasm` as a hashed
// asset instead of esbuild rewriting the URL and dropping the binary.
export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    exclude: [
      "@nanobpm/engine-wasm",
      "@nanobpm/bojtos-kit",
      "@nanobpm/bojtos-react",
    ],
  },
});
