import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  type BouquetConfig,
  sizeById,
  stemLengthById,
  flowerById,
} from "@/lib/catalog";

// The bouquet is built around a "gather point" at the origin: the spot where
// the ribbon ties the stems together. Heads form a full, rounded mass above and
// around it; the wrap flares from it; a short bundle of stems shows below.

export type StemPlacement = {
  position: THREE.Vector3;
  direction: THREE.Vector3;
  /** final head scale, already including the normalization factor */
  scale: number;
  isAccent: boolean;
};

export type BouquetLayout = {
  stems: StemPlacement[];
  /** horizontal spread of the flower mass, drives wrap sizing */
  spread: number;
  /** highest head, drives camera framing */
  height: number;
  stemGeometry: THREE.BufferGeometry;
};

/** Deterministic PRNG so the same config always renders the same bouquet. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashConfig(config: BouquetConfig): number {
  const s = `${config.flower}|${config.size}|${config.shape}|${config.stemLength}|${config.accentFlower}`;
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const GOLDEN = Math.PI * (3 - Math.sqrt(5));

// Every flower head is scaled so its visual radius lands near this value, which
// keeps mixed bouquets looking even and, more importantly, full.
const TARGET_HEAD_RADIUS = 0.27;

/** Unit directions for each stem, by bouquet shape. */
function stemDirections(
  shape: BouquetConfig["shape"],
  count: number,
  rand: () => number
): THREE.Vector3[] {
  const dirs: THREE.Vector3[] = [];

  if (shape === "sheaf") {
    // a flat-backed fan: stems spread in a plane facing the viewer
    for (let i = 0; i < count; i++) {
      const row = i % 3;
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = (t - 0.5) * 1.7;
      const d = new THREE.Vector3(
        Math.sin(angle) * (0.85 + row * 0.06),
        Math.cos(angle) * 0.95 + 0.15,
        0.35 + row * 0.16 + (rand() - 0.5) * 0.1
      );
      dirs.push(d.normalize());
    }
    return dirs;
  }

  // Dome wraps furthest down the sides; posy is the tightest ball.
  const maxPolar = shape === "posy" ? 1.05 : shape === "dome" ? 1.5 : 1.3;
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const polar = maxPolar * Math.sqrt(t);
    const azimuth = i * GOLDEN;
    const d = new THREE.Vector3(
      Math.sin(polar) * Math.cos(azimuth),
      Math.cos(polar),
      Math.sin(polar) * Math.sin(azimuth)
    );
    if (shape === "cascade") {
      // pull the outer-lower stems forward and down into a trailing tail
      const pull = Math.max(0, t - 0.45) / 0.55;
      d.z += pull * pull * 1.5;
      d.y -= pull * pull * 1.3;
      d.normalize();
    }
    dirs.push(d);
  }
  return dirs;
}

export function buildLayout(config: BouquetConfig): BouquetLayout {
  const size = sizeById(config.size);
  const stemLen = stemLengthById(config.stemLength);
  const flower = flowerById(config.flower);
  const rand = mulberry32(hashConfig(config));

  const dirs = stemDirections(config.shape, size.stems, rand);

  // Normalize every flower to a consistent, generous head size.
  const headScale = TARGET_HEAD_RADIUS / flower.headRadius;

  // Dome radius grows slowly with stem count. Kept deliberately tight so the
  // heads overlap and read as a full mass rather than scattered dots.
  const shapeFactor =
    config.shape === "posy" ? 0.82 : config.shape === "sheaf" ? 1.0 : 0.95;
  const R = (0.74 + 0.2 * Math.sqrt(size.stems / 20)) * shapeFactor;

  const stems: StemPlacement[] = [];
  const stemTubes: THREE.BufferGeometry[] = [];
  const gather = new THREE.Vector3(0, -0.1, 0);
  let maxR = 0;
  let maxY = 0;

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    // layered radii (inner + outer) so heads fill the gaps between each other
    const rFactor = 0.7 + rand() * 0.32;
    const pos = dir.clone().multiplyScalar(R * rFactor);
    const isAccent = config.accentFlower !== null && i % 3 === 2;

    stems.push({
      position: pos,
      direction: dir.clone(),
      scale: headScale * (0.9 + rand() * 0.25),
      isAccent,
    });

    maxR = Math.max(maxR, Math.hypot(pos.x, pos.z));
    maxY = Math.max(maxY, pos.y);

    // short, gently curved stem from the gather point to each head; mostly
    // hidden inside the flower mass and the wrap
    const mid = dir
      .clone()
      .multiplyScalar(R * rFactor * 0.5)
      .add(new THREE.Vector3((rand() - 0.5) * 0.05, gather.y * 0.5, (rand() - 0.5) * 0.05));
    const curve = new THREE.CatmullRomCurve3([gather.clone(), mid, pos]);
    stemTubes.push(new THREE.TubeGeometry(curve, 6, 0.02, 5, false));
  }

  // A short, tight bundle of bare stems below the gather point. Box wraps hide
  // the stems entirely.
  const tailLen = Math.min(0.5, stemLen.sceneLength * 0.22);
  const tailCount = config.wrap === "box" ? 0 : 9;
  for (let i = 0; i < tailCount; i++) {
    const a = (i / tailCount) * Math.PI * 2;
    const r = 0.015 + rand() * 0.04;
    const top = new THREE.Vector3(Math.cos(a) * r, gather.y, Math.sin(a) * r);
    const bottom = new THREE.Vector3(
      Math.cos(a) * (r + 0.03),
      gather.y - tailLen,
      Math.sin(a) * (r + 0.03)
    );
    stemTubes.push(
      new THREE.TubeGeometry(new THREE.CatmullRomCurve3([top, bottom]), 3, 0.022, 5, false)
    );
  }

  const stemGeometry = mergeGeometries(stemTubes, false)!;
  stemTubes.forEach((t) => t.dispose());

  return { stems, spread: maxR, height: maxY, stemGeometry };
}

/** Sprigs of greenery peeking out between and just past the flowers. */
export function greeneryDirections(
  config: BouquetConfig,
  layout: BouquetLayout
): StemPlacement[] {
  if (config.greenery === "none") return [];
  const size = sizeById(config.size);
  const rand = mulberry32(hashConfig(config) ^ 0x9e3779b9);
  const count = Math.round(size.stems * 0.35);
  const reach = layout.spread * 0.96 + 0.04;

  const sprigs: StemPlacement[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const isSheaf = config.shape === "sheaf";
    let dir: THREE.Vector3;
    if (isSheaf) {
      const angle = (t - 0.5) * 1.9;
      dir = new THREE.Vector3(Math.sin(angle) * 0.9, Math.cos(angle) * 0.95 + 0.1, 0.2).normalize();
    } else {
      const maxPolar = config.shape === "posy" ? 1.2 : 1.55;
      const polar = maxPolar * Math.sqrt(t);
      const azimuth = i * GOLDEN + 1.7;
      dir = new THREE.Vector3(
        Math.sin(polar) * Math.cos(azimuth),
        Math.cos(polar),
        Math.sin(polar) * Math.sin(azimuth)
      );
      if (config.shape === "cascade") {
        const pull = Math.max(0, t - 0.5) / 0.5;
        dir.z += pull * pull * 1.3;
        dir.y -= pull * pull * 1.0;
        dir.normalize();
      }
    }
    sprigs.push({
      position: dir.clone().multiplyScalar(reach * (0.9 + rand() * 0.25)),
      direction: dir,
      scale: 0.9 + rand() * 0.4,
      isAccent: false,
    });
  }
  return sprigs;
}
