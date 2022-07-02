import svelte from "rollup-plugin-svelte";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import sveltePreprocess from "svelte-preprocess";
import typescript from "@rollup/plugin-typescript";
import css from "rollup-plugin-css-only";
import replace from "@rollup/plugin-replace";
import { config } from "dotenv";
import preprocess from 'svelte-preprocess';
config();

const production = !process.env.ROLLUP_WATCH;

export default {
  input: ["src/popup/popup.ts", "src/background/background.ts"],
  output: {
    sourcemap: true,
    format: "esm",
    name: "app",
    dir: "record-screen/build",
  },
  plugins: [
    svelte({
      preprocess: preprocess(),
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !production,
      },
    }),
    // we'll extract any component CSS out into
    // a separate file - better for performance,
    css({ output: "bundle.css" }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration -
    // consult the documentation for details:
    // https://github.com/rollup/plugins/tree/master/packages/commonjs
    replace({
      preventAssignment: true,
      values: {
        "process.env.SERVER": process.env.SERVER,
      },
    }),
    resolve({
      browser: true,
      dedupe: ["svelte"],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),

    // Watch the `record-screen` directory and refresh the
    // browser on changes when not in production
    !production && livereload("record-screen"),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
