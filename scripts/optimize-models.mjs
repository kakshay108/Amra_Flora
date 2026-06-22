// Optimizes raw flower GLBs (e.g. heavy Sketchfab downloads) into web-ready,
// instanceable assets. Reads public/models/flowers/raw/*.glb and writes
// compressed versions to public/models/flowers/<name>.glb.
//
// Usage: pnpm models:optimize
//
// Each output is Draco-compressed with 1K textures and simplified geometry,
// targeting < 1 MB so 50 instances stay smooth.

import { readdirSync, mkdirSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, basename, extname } from "node:path";

const RAW = "public/models/flowers/raw";
const OUT = "public/models/flowers";

if (!existsSync(RAW)) {
  console.error(`No raw folder at ${RAW}. Create it and drop your GLBs there.`);
  process.exit(1);
}
mkdirSync(OUT, { recursive: true });

const files = readdirSync(RAW).filter((f) => f.toLowerCase().endsWith(".glb"));
if (files.length === 0) {
  console.log(`No .glb files in ${RAW}. Drop rose.glb, tulip.glb, ... there first.`);
  process.exit(0);
}

const bin = process.platform === "win32" ? "gltf-transform.cmd" : "gltf-transform";

for (const file of files) {
  const name = basename(file, extname(file));
  const input = join(RAW, file);
  const output = join(OUT, `${name}.glb`);
  console.log(`\n→ Optimizing ${file} ...`);
  try {
    execFileSync(
      bin,
      [
        "optimize",
        input,
        output,
        "--compress",
        "draco",
        "--texture-compress",
        "webp",
        "--texture-size",
        "1024",
        "--simplify",
        "true",
      ],
      { stdio: "inherit", shell: true }
    );
    console.log(`✓ Wrote ${output}`);
  } catch (err) {
    console.error(`✗ Failed on ${file}:`, err.message);
  }
}

console.log("\nDone. Flip `present: true` for each flower in src/components/three/geometry/flowerModels.ts");
