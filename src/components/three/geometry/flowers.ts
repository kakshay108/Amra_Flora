import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { FlowerId } from "@/lib/catalog";

// Procedurally built flower heads. Each builder returns geometry with the
// stem-attachment point at the origin and petals opening toward +Y, so the
// renderer can orient heads with a single quaternion. "tinted" geometry is
// colored per-instance from the chosen shade; "fixed" parts (flower centers)
// keep their natural color.

export type FlowerGeometry = {
  tinted: THREE.BufferGeometry;
  fixed: { geometry: THREE.BufferGeometry; color: string } | null;
};

/**
 * A single petal: a subdivided plane, bent backward along its length and
 * cupped across its width. Base sits at the origin, tip points to +Y.
 */
function makePetal(
  length: number,
  width: number,
  bend: number,
  cup: number
): THREE.BufferGeometry {
  const geo = new THREE.PlaneGeometry(width, length, 4, 8);
  geo.translate(0, length / 2, 0);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const t = y / length;
    // taper the petal toward base and tip
    const taper = Math.sin(Math.PI * Math.min(t * 1.15, 1)) * 0.85 + 0.15;
    const nx = x * taper;
    // bend backward along length, cup across width
    const z = -bend * t * t + cup * (nx / (width / 2)) ** 2;
    pos.setX(i, nx);
    pos.setZ(i, z);
  }
  geo.computeVertexNormals();
  return geo;
}

/** Place a petal at a tilt from vertical (radians) and an azimuth rotation. */
function placePetal(
  petal: THREE.BufferGeometry,
  tilt: number,
  azimuth: number,
  radialOffset = 0,
  scale = 1
): THREE.BufferGeometry {
  const g = petal.clone();
  const m = new THREE.Matrix4();
  m.makeScale(scale, scale, scale);
  g.applyMatrix4(m);
  m.makeRotationX(tilt);
  g.applyMatrix4(m);
  m.makeTranslation(0, 0, radialOffset);
  g.applyMatrix4(m);
  m.makeRotationY(azimuth);
  g.applyMatrix4(m);
  return g;
}

function buildRose(): FlowerGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  // tight inner bud
  const bud = new THREE.SphereGeometry(0.045, 10, 8);
  bud.scale(1, 1.25, 1);
  bud.translate(0, 0.1, 0);
  parts.push(bud);
  // spiral of petals, inner ones nearly closed, outer ones open
  const count = 14;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const tilt = 0.25 + t * 1.05; // 14deg -> 74deg from vertical
    const scale = 0.55 + t * 0.65;
    const petal = makePetal(0.16, 0.13, 0.10, 0.045);
    parts.push(placePetal(petal, tilt, i * golden, 0.012 + t * 0.03, scale));
    petal.dispose();
  }
  const tinted = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  tinted.scale(1.1, 1.1, 1.1);
  return { tinted, fixed: null };
}

function buildTulip(): FlowerGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (let ring = 0; ring < 2; ring++) {
    for (let i = 0; i < 3; i++) {
      const petal = makePetal(0.2, 0.13, -0.05, 0.075);
      const azimuth = (i / 3) * Math.PI * 2 + (ring === 1 ? Math.PI / 3 : 0);
      parts.push(placePetal(petal, 0.32 + ring * 0.14, azimuth, 0.02, 1));
      petal.dispose();
    }
  }
  const tinted = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  return { tinted, fixed: null };
}

function buildLily(): FlowerGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 6; i++) {
    const petal = makePetal(0.3, 0.1, 0.22, 0.035);
    const tilt = i % 2 === 0 ? 1.0 : 1.15;
    parts.push(placePetal(petal, tilt, (i / 6) * Math.PI * 2, 0.01, 1));
    petal.dispose();
  }
  const tinted = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  // stamens as the fixed center
  const stamenParts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 5; i++) {
    const s = new THREE.CylinderGeometry(0.005, 0.005, 0.16, 4);
    s.translate(0, 0.08, 0);
    const tipBall = new THREE.SphereGeometry(0.012, 6, 5);
    tipBall.translate(0, 0.16, 0);
    const stamen = mergeGeometries([s, tipBall], false)!;
    s.dispose();
    tipBall.dispose();
    const m = new THREE.Matrix4().makeRotationX(0.28);
    stamen.applyMatrix4(m);
    stamen.applyMatrix4(new THREE.Matrix4().makeRotationY((i / 5) * Math.PI * 2));
    stamenParts.push(stamen);
  }
  const fixedGeo = mergeGeometries(stamenParts, false)!;
  stamenParts.forEach((p) => p.dispose());
  return { tinted, fixed: { geometry: fixedGeo, color: "#b5651d" } };
}

function buildSunflower(): FlowerGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (let ring = 0; ring < 2; ring++) {
    const n = ring === 0 ? 15 : 13;
    for (let i = 0; i < n; i++) {
      const petal = makePetal(0.2, 0.055, 0.04, 0.02);
      const azimuth = (i / n) * Math.PI * 2 + ring * 0.21;
      parts.push(placePetal(petal, 1.35 + ring * 0.12, azimuth, 0.085, 1));
      petal.dispose();
    }
  }
  const tinted = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  const center = new THREE.SphereGeometry(0.1, 16, 10);
  center.scale(1, 0.45, 1);
  center.translate(0, 0.025, 0);
  return { tinted, fixed: { geometry: center, color: "#4a2c12" } };
}

function buildCarnation(): FlowerGeometry {
  const parts: THREE.BufferGeometry[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  const count = 22;
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const tilt = 0.2 + t * 1.0;
    // heavily cupped, crinkled little petals
    const petal = makePetal(0.11, 0.1, 0.05 + (i % 3) * 0.02, 0.07);
    parts.push(placePetal(petal, tilt, i * golden, 0.012, 0.7 + t * 0.45));
    petal.dispose();
  }
  const tinted = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  return { tinted, fixed: null };
}

function buildGerbera(): FlowerGeometry {
  const parts: THREE.BufferGeometry[] = [];
  for (let ring = 0; ring < 2; ring++) {
    const n = ring === 0 ? 16 : 14;
    for (let i = 0; i < n; i++) {
      const petal = makePetal(0.17, 0.04, 0.03, 0.012);
      const azimuth = (i / n) * Math.PI * 2 + ring * 0.2;
      parts.push(placePetal(petal, 1.28 + ring * 0.16, azimuth, 0.05, 1));
      petal.dispose();
    }
  }
  const tinted = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  const center = new THREE.SphereGeometry(0.055, 12, 8);
  center.scale(1, 0.5, 1);
  center.translate(0, 0.02, 0);
  return { tinted, fixed: { geometry: center, color: "#3d2417" } };
}

function buildOrchid(): FlowerGeometry {
  const parts: THREE.BufferGeometry[] = [];
  // two upper petals
  for (const az of [-0.55, 0.55]) {
    const petal = makePetal(0.18, 0.13, 0.05, 0.03);
    parts.push(placePetal(petal, 0.95, az + Math.PI, 0.01, 1));
    petal.dispose();
  }
  // three sepals fanned behind
  for (const az of [0, -1.9, 1.9]) {
    const petal = makePetal(0.17, 0.075, 0.07, 0.02);
    parts.push(placePetal(petal, 1.05, az, 0.01, 1));
    petal.dispose();
  }
  // the lip, hanging forward
  const lip = makePetal(0.12, 0.1, -0.09, 0.06);
  parts.push(placePetal(lip, 1.7, Math.PI, 0.02, 1));
  lip.dispose();
  const tinted = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  const column = new THREE.SphereGeometry(0.028, 8, 6);
  column.translate(0, 0.045, 0);
  return { tinted, fixed: { geometry: column, color: "#e8c54a" } };
}

// Orchid heads read best tilted toward the viewer rather than straight up.
const BUILDERS: Record<FlowerId, () => FlowerGeometry> = {
  rose: buildRose,
  tulip: buildTulip,
  lily: buildLily,
  sunflower: buildSunflower,
  carnation: buildCarnation,
  gerbera: buildGerbera,
  orchid: buildOrchid,
};

const cache = new Map<FlowerId, FlowerGeometry>();

export function getFlowerGeometry(id: FlowerId): FlowerGeometry {
  let geo = cache.get(id);
  if (!geo) {
    geo = BUILDERS[id]();
    cache.set(id, geo);
  }
  return geo;
}

/** A simple leaf for greenery, base at origin, tip toward +Y. */
export function makeLeafGeometry(
  kind: "eucalyptus" | "fern" | "babys-breath"
): THREE.BufferGeometry {
  if (kind === "babys-breath") {
    // a sprig: tiny spheres scattered around a short stalk
    const parts: THREE.BufferGeometry[] = [];
    for (let i = 0; i < 7; i++) {
      const ball = new THREE.SphereGeometry(0.02, 6, 5);
      const a = (i / 7) * Math.PI * 2;
      ball.translate(Math.cos(a) * 0.07, 0.16 + (i % 3) * 0.045, Math.sin(a) * 0.07);
      parts.push(ball);
    }
    const merged = mergeGeometries(parts, false)!;
    parts.forEach((p) => p.dispose());
    return merged;
  }
  if (kind === "fern") {
    const leaf = makePetal(0.5, 0.09, 0.16, -0.02);
    return leaf;
  }
  // eucalyptus: pairs of round leaves along a stalk
  const parts: THREE.BufferGeometry[] = [];
  for (let i = 0; i < 4; i++) {
    for (const side of [-1, 1]) {
      const disc = new THREE.CircleGeometry(0.05, 10);
      disc.rotateX(-Math.PI / 2.4);
      disc.translate(side * 0.05, 0.1 + i * 0.1, 0);
      parts.push(disc);
    }
  }
  const merged = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  return merged;
}
