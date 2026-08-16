/**
 * Bundles the whole demo into one self-contained HTML file.
 *
 * The app is entirely client-side — seeded data, no API calls — so it can run
 * from a single static page with the JS and CSS inlined. That makes it
 * publishable as a shareable link with no server and no external requests,
 * which a strict content-security policy would block anyway.
 *
 *   node standalone/build.mjs
 */

import * as esbuild from "esbuild";
import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { promisify } from "node:util";

const run = promisify(execFile);
const root = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const out = path.join(root, "standalone", "out");

await mkdir(out, { recursive: true });

/* 1. JavaScript ---------------------------------------------------- */

const shims = path.join(root, "standalone", "next-shims.tsx");

const js = await esbuild.build({
  entryPoints: [path.join(root, "standalone", "main.tsx")],
  bundle: true,
  minify: true,
  format: "iife",
  target: ["es2021"],
  jsx: "automatic",
  tsconfig: path.join(root, "tsconfig.json"),
  alias: { "next/link": shims, "next/navigation": shims },
  define: { "process.env.NODE_ENV": '"production"' },
  write: false,
  legalComments: "none",
});

const bundle = js.outputFiles[0].text;

/* 2. CSS ----------------------------------------------------------- */

await run(
  "npx",
  [
    "@tailwindcss/cli",
    "-i",
    path.join(root, "standalone", "entry.css"),
    "-o",
    path.join(out, "app.css"),
    "--minify",
  ],
  { cwd: root },
);

const css = await readFile(path.join(out, "app.css"), "utf8");

/* 3. Assemble ------------------------------------------------------ */

// Written as body content: the host wraps it in its own document skeleton,
// so there is no <html>, <head> or <body> here.
const html = `<title>Rattib</title>
<style>
${css}
</style>

<div id="rattib-root"></div>

<noscript>
  <div style="max-width:40rem;margin:4rem auto;padding:0 1.5rem;font-family:system-ui,sans-serif;color:#17140f">
    <h1 style="font-weight:800">Rattib</h1>
    <p>This prototype needs JavaScript enabled.</p>
  </div>
</noscript>

<script>
// Arabic and RTL are the default, set before first paint to avoid a flash.
document.documentElement.lang = "ar";
document.documentElement.dir = "rtl";
</script>
<script>
${bundle}
</script>
`;

const target = path.join(out, "rattib.html");
await writeFile(target, html, "utf8");
await rm(path.join(out, "app.css"));

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
console.log(`js   ${kb(Buffer.byteLength(bundle))}`);
console.log(`css  ${kb(Buffer.byteLength(css))}`);
console.log(`html ${kb(Buffer.byteLength(html))}  →  ${target}`);
