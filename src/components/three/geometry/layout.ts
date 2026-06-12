import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  type BouquetConfig,
  sizeById,
  stemLengthById,
  flowerById,
} from "@/lib/catalog";

// The bouquet is built around a "gather point" at the origin: the spot where
// the ribbon ties the stems together. Heads spread out above it, the wrap
// flares around it, bare stems continue below it.

export type StemPlacement = {
  /** world position of the flower head */
  position: THREE.Vector3;
  /** orientation: +Y of the head geometry maps onto this direction */
  direction: THREE.Vector3;
  scale: number;
  /** true if this stem carries the accent flower */
  isAccent: boolean;
};

export type BouquetLayout = {
  stems: StemPlacement[];
  /** horizontal spread of the arrangement, drives wrap sizing */
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
      const row = i % 3; // three loose rows of depth
      const t = count === 1 ? 0.5 : i / (count - 1);
      const angle = (t - 0.5) * 1.9; // -54deg .. 54deg fan
      const d = new THREE.Vector3(
        Math.sin(angle) * (0.8 + row * 0.08),
        Math.cos(angle),
        0.12 + row * 0.12 + (rand() - 0.5) * 0.08
      );
      dirs.push(d.normalize());
    }
    return dirs;
  }

  const maxPolar = shape === "posy" ? 0.72 : shape === "dome" ? 1.1 : 0.95;
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
      // pull the outer stems forward and down into a trailing tail
      const pull = Math.max(0, t - 0.35) / 0.65;
      d.z += pull * pull * 1.6;
      d.y -= pull * pull * 1.1;
      d.normalize();
    }
    dirs.push(d);
  }
  return dirs;
}

export function buildLayout(config: BouquetConfig): BouquetLayout {
  const size = sizeById(config.size);
  const stemLen = stemLengthById(config.stemLength);
  const rand = mulberry32(hashConfig(config));

  const dirs = stemDirections(config.shape, size.stems, rand);
  const headDist = stemLen.sceneLength * 0.55;
  const flower = flowerById(config.flower);
  // denser bouquets push heads slightly farther out so they don't overlap
  const density = Math.sqrt(size.stems / 20);
  const reach = headDist * (0.75 + 0.25 * density) + flower.headRadius;

  const stems: StemPlacement[] = [];
  const stemTubes: THREE.BufferGeometry[] = [];
  const gather = new THREE.Vector3(0, 0, 0);
  let maxR = 0;
  let maxY = 0;

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    const jitter = 0.9 + rand() * 0.25;
    const pos = dir.clone().multiplyScalar(reach * jitter);
    const isAccent = config.accentFlower !== null && i % 3 === 2;

    stems.push({
      position: pos,
      direction: dir.clone(),
      scale: 0.92 + rand() * 0.2,
      isAccent,
    });

    maxR = Math.max(maxR, Math.hypot(pos.x, pos.z));
    maxY = Math.max(maxY, pos.y);

    // gentle S-curve from the gather point up to the head
    const mid = dir
      .clone()
      .multiplyScalar(reach * jitter * 0.5)
      .add(new THREE.Vector3((rand() - 0.5) * 0.08, 0.05, (rand() - 0.5) * 0.08));
    const curve = new THREE.CatmullRomCurve3([
      gather.clone().add(new THREE.Vector3(0, -0.05, 0)),
      mid,
      pos,
    ]);
    stemTubes.push(new THREE.TubeGeometry(curve, 8, 0.016, 5, false));
  }

  // the bundle of bare stems below the gather point (hidden inside a box wrap)
  const tailLen = stemLen.sceneLength * 0.42;
  const tailCount = config.wrap === "box" ? 0 : Math.min(size.stems, 14);
  for (let i = 0; i < tailCount; i++) {
    const a = (i / tailCount) * Math.PI * 2;
    const r = 0.02 + rand() * 0.06;
    const top = new THREE.Vector3(Math.cos(a) * r, 0.02, Math.sin(a) * r);
    const bottom = new THREE.Vector3(
      Math.cos(a) * (r + 0.05 + rand() * 0.05),
      -tailLen,
      Math.sin(a) * (r + 0.05)
    );
    const curve = new THREE.CatmullRomCurve3([top, bottom]);
    stemTubes.push(new THREE.TubeGeometry(curve, 4, 0.016, 5, false));
  }

  const stemGeometry = mergeGeometries(stemTubes, false)!;
  stemTubes.forEach((t) => t.dispose());

  return {
    stems,
    spread: maxR,
    height: maxY,
    stemGeometry,
  };
}

/** Directions for greenery sprigs: interleaved between flowers, slightly lower. */
export function greeneryDirections(
  config: BouquetConfig,
  layout: BouquetLayout
): StemPlacement[] {
  if (config.greenery === "none") return [];
  const size = sizeById(config.size);
  const stemLen = stemLengthById(config.stemLength);
  const rand = mulberry32(hashConfig(config) ^ 0x9e3779b9);
  const count = Math.round(size.stems * 0.55);
  const reach = stemLen.sceneLength * 0.52;

  const sprigs: StemPlacement[] = [];
  for (let i = 0; i < count; i++) {
    const t = (i + 0.5) / count;
    const isSheaf = config.shape === "sheaf";
    let dir: THREE.Vector3;
    if (isSheaf) {
      const angle = (t - 0.5) * 2.1;
      dir = new THREE.Vector3(Math.sin(angle) * 0.9, Math.cos(angle), 0.05).normalize();
    } else {
      const maxPolar = config.shape === "posy" ? 0.85 : 1.2;
      const polar = maxPolar * Math.sqrt(t);
      const azimuth = i * GOLDEN + 1.7;
      dir = new THREE.Vector3(
        Math.sin(polar) * Math.cos(azimuth),
        Math.cos(polar),
        Math.sin(polar) * Math.sin(azimuth)
      );
      if (config.shape === "cascade") {
        const pull = Math.max(0, t - 0.4) / 0.6;
        dir.z += pull * pull * 1.4;
        dir.y -= pull * pull * 0.9;
        dir.normalize();
      }
    }
    sprigs.push({
      position: dir.clone().multiplyScalar(reach * (0.85 + rand() * 0.3)),
      direction: dir,
      scale: 0.85 + rand() * 0.4,
      isAccent: false,
    });
  }
  return sprigs;
}
