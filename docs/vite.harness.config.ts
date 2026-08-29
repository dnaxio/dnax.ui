import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import { fileURLToPath } from "node:url"

const ui = fileURLToPath(new URL("../packages/ui", import.meta.url))
const vm = (p: string) => fileURLToPath(new URL(p, import.meta.url))

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@ui": ui,
      vue: vm("./node_modules/vue/dist/vue.runtime.esm-bundler.js"),
      "@vue/runtime-core": vm("./node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js"),
      "@vue/runtime-dom": vm("./node_modules/@vue/runtime-dom/dist/runtime-dom.esm-bundler.js"),
      "@vue/reactivity": vm("./node_modules/@vue/reactivity/dist/reactivity.esm-bundler.js"),
      "@vue/shared": vm("./node_modules/@vue/shared/dist/shared.esm-bundler.js"),
    },
    dedupe: ["vue", "@vue/runtime-core", "@vue/runtime-dom", "@vue/reactivity", "@vue/shared"],
  },
  build: {
    lib: {
      entry: "scripts/tooltip-harness.ts",
      formats: ["es"],
      fileName: () => "tooltip-harness.mjs",
    },
    outDir: "dist/harness",
    minify: false,
    sourcemap: false,
    rollupOptions: {
      // les builtins node restent des imports node (résolus au runtime)
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
