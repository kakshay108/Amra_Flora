import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { BouquetConfig, CardShapeId } from "@/lib/catalog";

// Geometry for the parts that surround the flowers: the paper/box wrap, the
// ribbon tie, and the message card on its pick. All are built from the layout
// spread so they scale with the bouquet.

/**
 * A paper funnel that hugs the lower half of the bouquet: narrow at the gather
 * point, flaring open toward the heads. Faceted (low radial segments) so it
 * reads as folded paper rather than a smooth cone. Box wraps get a squared
 * sleeve instead.
 */
export function buildWrapGeometry(
  config: BouquetConfig,
  spread: number,
  height: number
): THREE.BufferGeometry {
  if (config.wrap === "box") {
    const w = Math.max(0.9, spread * 1.5);
    const h = Math.max(0.8, height * 0.55);
    const box = new THREE.BoxGeometry(w, h, w, 1, 1, 1);
    // open top: drop the top face by building from a slightly hollow shell.
    box.translate(0, -h / 2 + 0.05, 0);
    return box;
  }

  // The wrap sits low, beneath the bloom mass, so the flowers always dominate
  // and overhang its rim. A smooth, many-faceted cone reads as paper far better
  // than the old low-poly triangle did against realistic flower models.
  const topR = Math.max(0.5, spread * 0.78);
  const bottomR = 0.06;
  const top = Math.max(0.15, height * 0.18);
  const bottom = -0.62;
  const facets = 28;

  const cone = new THREE.CylinderGeometry(topR, bottomR, top - bottom, facets, 1, true);
  cone.translate(0, (top + bottom) / 2, 0);

  // A short outer collar flares slightly outward at the rim for a folded edge.
  const collar = new THREE.CylinderGeometry(topR * 1.16, topR * 0.92, top * 0.4, facets, 1, true);
  collar.translate(0, top - top * 0.12, 0);

  const merged = mergeGeometries([cone, collar], false)!;
  cone.dispose();
  collar.dispose();
  merged.computeVertexNormals();
  return merged;
}

/** The ribbon: a flattened torus tied at the gather point, with two tails. */
export function buildRibbonGeometry(spread: number): THREE.BufferGeometry {
  const r = Math.max(0.14, spread * 0.16);
  const knot = new THREE.TorusGeometry(r, 0.035, 8, 20);
  knot.rotateX(Math.PI / 2);
  knot.scale(1, 1, 0.6);
  knot.translate(0, -0.04, 0);

  const parts: THREE.BufferGeometry[] = [knot];
  // two trailing tails falling from the knot
  for (const side of [-1, 1]) {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -0.04, r * 0.6),
      new THREE.Vector3(side * 0.06, -0.22, r * 0.7),
      new THREE.Vector3(side * 0.12, -0.42, r * 0.5),
    ]);
    parts.push(new THREE.TubeGeometry(curve, 8, 0.02, 5, false));
  }
  const merged = mergeGeometries(parts, false)!;
  parts.forEach((p) => p.dispose());
  return merged;
}

/** A 2D outline for the message card, centered on the origin. */
function cardShapePath(shape: CardShapeId): THREE.Shape {
  const s = new THREE.Shape();
  const w = 0.42;
  const h = 0.3;
  if (shape === "circle") {
    s.absellipse(0, 0, w * 0.55, w * 0.55, 0, Math.PI * 2, false, 0);
    return s;
  }
  if (shape === "heart") {
    const x = 0;
    const y = -0.14;
    s.moveTo(x, y);
    s.bezierCurveTo(x, y + 0.06, x - 0.06, y + 0.18, x - 0.2, y + 0.18);
    s.bezierCurveTo(x - 0.42, y + 0.18, x - 0.42, y - 0.1, x - 0.42, y - 0.1);
    s.bezierCurveTo(x - 0.42, y - 0.26, x - 0.2, y - 0.4, x, y - 0.52);
    s.bezierCurveTo(x + 0.2, y - 0.4, x + 0.42, y - 0.26, x + 0.42, y - 0.1);
    s.bezierCurveTo(x + 0.42, y - 0.1, x + 0.42, y + 0.18, x + 0.2, y + 0.18);
    s.bezierCurveTo(x + 0.06, y + 0.18, x, y + 0.06, x, y);
    return s;
  }
  if (shape === "scalloped") {
    const bumps = 12;
    const rx = w * 0.6;
    const ry = h * 0.7;
    for (let i = 0; i <= bumps; i++) {
      const a = (i / bumps) * Math.PI * 2;
      const wobble = 1 + 0.08 * Math.cos(a * bumps);
      const px = Math.cos(a) * rx * wobble;
      const py = Math.sin(a) * ry * wobble;
      if (i === 0) s.moveTo(px, py);
      else s.lineTo(px, py);
    }
    return s;
  }
  // rectangle with rounded corners
  const r = 0.04;
  s.moveTo(-w + r, -h);
  s.lineTo(w - r, -h);
  s.quadraticCurveTo(w, -h, w, -h + r);
  s.lineTo(w, h - r);
  s.quadraticCurveTo(w, h, w - r, h);
  s.lineTo(-w + r, h);
  s.quadraticCurveTo(-w, h, -w, h - r);
  s.lineTo(-w, -h + r);
  s.quadraticCurveTo(-w, -h, -w + r, -h);
  return s;
}

export function buildCardGeometry(shape: CardShapeId): THREE.BufferGeometry {
  const geo = new THREE.ExtrudeGeometry(cardShapePath(shape), {
    depth: 0.01,
    bevelEnabled: false,
  });
  geo.center();
  geo.computeVertexNormals();
  return geo;
}

/** A thin pick/stick that holds the card up out of the bouquet. */
export function buildCardStickGeometry(): THREE.BufferGeometry {
  const stick = new THREE.CylinderGeometry(0.008, 0.008, 0.55, 5);
  stick.translate(0, 0.275, 0);
  return stick;
}
