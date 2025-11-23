import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/lib/calendar/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  format: ["esm", "cjs"],
  target: "es2019",
  external: ["react", "react-dom"],
  tsconfig: "./tsconfig.lib.json",
});

