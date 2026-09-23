// Builds the whole site for Vercel using the Build Output API:
//   .vercel/output/static/           the React client (client/dist)
//   .vercel/output/functions/api.func the Express API, bundled into one file
//   .vercel/output/config.json       routing between the two
// Run from the repo root: `node scripts/build-vercel.mjs`.
import { execSync } from "node:child_process";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const out = `${root}.vercel/output`;
const fn = `${out}/functions/api.func`;

// esbuild is a devDependency of the server package.
const { build } = createRequire(`${root}server/package.json`)("esbuild");

rmSync(out, { recursive: true, force: true });

console.log("› Building client");
execSync("npm run build --prefix client", { cwd: root, stdio: "inherit" });
cpSync(`${root}client/dist`, `${out}/static`, { recursive: true });

console.log("› Bundling API");
mkdirSync(fn, { recursive: true });
await build({
  entryPoints: [`${root}server/src/app.ts`],
  outfile: `${fn}/index.mjs`,
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node22",
  // Bundled CommonJS packages (Express...) still call require() for Node
  // built-ins; ESM output needs a real require for that.
  banner: {
    js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
  },
  // Optional MongoDB driver add-ons we don't use; the driver loads them lazily.
  external: [
    "kerberos",
    "snappy",
    "socks",
    "aws4",
    "gcp-metadata",
    "mongodb-client-encryption",
    "@mongodb-js/zstd",
    "@aws-sdk/credential-providers",
  ],
  logLevel: "warning",
});
writeFileSync(
  `${fn}/.vc-config.json`,
  JSON.stringify({
    runtime: "nodejs22.x",
    handler: "index.mjs",
    launcherType: "Nodejs",
    shouldAddHelpers: false,
  }),
);

writeFileSync(
  `${out}/config.json`,
  JSON.stringify({
    version: 3,
    routes: [
      // Real files first (JS, CSS, images, videos).
      { handle: "filesystem" },
      // Every /api/... request goes to the Express function.
      { src: "^/api(/.*)?$", dest: "/api" },
      // Anything else is a client-side route: let React Router handle it.
      { src: "^/(.*)$", dest: "/index.html" },
    ],
  }),
);

console.log("✓ Vercel output ready in .vercel/output");
