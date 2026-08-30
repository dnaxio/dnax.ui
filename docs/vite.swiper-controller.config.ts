import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { fileURLToPath } from "node:url"

const ui = fileURLToPath(new URL("../packages/ui", import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { "@ui": ui },
  },
  build: {
    lib: {
      entry: "scripts/swiper-controller-harness.ts",
      formats: ["es"],
      fileName: () => "swiper-controller-harness.mjs",
    },
    outDir: "dist/harness",
    minify: false,
    sourcemap: false,
    rollupOptions: {
      external: [
        /^node:/,
        "fs", "path", "url", "util", "os", "stream", "crypto", "events", "vm",
        "assert", "buffer", "constants", "child_process", "module", "perf_hooks",
        "process", "querystring", "string_decoder", "timers", "tty", "worker_threads",
        "zlib", "http", "https", "net", "tls", "dns", "dgram", "readline", "punycode",
        "async_hooks", "diagnostics_channel", "inspector", "repl", "trace_events", "wasi",
      ],
    },
  },
})
