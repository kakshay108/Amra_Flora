import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { useGLTF } from "@react-three/drei";
import { useMemo } from "react";
import type { FlowerId } from "@/lib/catalog";

// Real glTF flower-head models, GPU-instanced into the bouquet. Each entry is
// flipped to `present: true` once its optimized GLB lives in
// public/models/flowers/<id>.glb. Until then the renderer falls back to the
// procedural geometry, so the app always works.

export type FlowerModelDef = {
  url: string;
  present: boolean;
  /** multiply the chosen shade over the model's albedo (best for white/light models) */
  tint: boolean;
  /** normalized head radius in scene units */
  targetRadius: number;
  /** orientation tweaks so the bloom opens toward +Y (tuned per model on integration) */
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
};

const base = (id: FlowerId): FlowerModelDef => ({
  url: `/models/flowers/${id}.glb`,
  present: false,
  tint: true,
  targetRadius: 0.27,
});

export const FLOWER_MODELS: Record<FlowerId, FlowerModelDef> = {
  rose: base("rose"),
  tulip: base("tulip"),
  lily: { ...base("lily"), targetRadius: 0.3 },
  sunflower: { ...base("sunflower"), targetRadius: 0.32 },
  carnation: base("carnation"),
  gerbera: { ...base("gerbera"), targetRadius: 0.28 },
  orchid: base("orchid"),
};

/** Flower ids whose GLB is present — a constant list so hook order stays stable. */
export const PRESENT_MODELS = (Object.keys(FLOWER_MODELS) as FlowerId[]).filter(
  (id) => FLOWER_MODELS[id].present
);

export type HeadAsset = {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
};

/** Keep only the attributes that merge cleanly across meshes. */
function trimAttributes(geo: THREE.BufferGeometry): THREE.BufferGeometry {
  const keep = ["position", "normal", "uv"];
  for (const name of Object.keys(geo.attributes)) {
    if (!keep.includes(name)) geo.deleteAttribute(name);
  }
  if (!geo.attributes.normal) geo.computeVertexNormals();
  if (!geo.attributes.uv) {
    const count = geo.attributes.position.count;
    geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array(count * 2), 2));
  }
  return geo;
}

/**
 * Flattens a loaded glTF scene into one instanceable head: a single merged,
 * normalized, +Y-facing geometry plus a representative (white-based, tintable)
 * material that keeps the model's albedo/normal/roughness maps.
 */
export function processGltfHead(
  scene: THREE.Object3D,
  def: FlowerModelDef
): HeadAsset {
  scene.updateWorldMatrix(true, true);
  const geos: THREE.BufferGeometry[] = [];
  let mainMat: THREE.Material | null = null;
  let maxVerts = 0;

  scene.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    if (!mesh.isMesh) return;
    const g = mesh.geometry.clone();
    g.applyMatrix4(mesh.matrixWorld);
    trimAttributes(g);
    geos.push(g);
    const verts = g.attributes.position.count;
    if (verts > maxVerts) {
      maxVerts = verts;
      mainMat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
    }
  });

  let geometry = geos.length > 1 ? mergeGeometries(geos, false)! : geos[0];
  geos.forEach((g) => g !== geometry && g.dispose());

  if (def.rotateX) geometry.rotateX(def.rotateX);
  if (def.rotateY) geometry.rotateY(def.rotateY);
  if (def.rotateZ) geometry.rotateZ(def.rotateZ);

  // normalize size to the target head radius
  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox!.getSize(size);
  const radius = Math.max(size.x, size.y, size.z) * 0.5 || 1;
  const s = def.targetRadius / radius;
  geometry.scale(s, s, s);

  // recenter so the head sits on the origin (the layout positions it)
  geometry.computeBoundingBox();
  const center = new THREE.Vector3();
  geometry.boundingBox!.getCenter(center);
  geometry.translate(-center.x, -center.y, -center.z);
  geometry.computeVertexNormals();

  const src = (mainMat as THREE.MeshStandardMaterial | null) ?? null;
  const material = src
    ? src.clone()
    : new THREE.MeshStandardMaterial({ roughness: 0.6 });
  material.side = THREE.DoubleSide;
  // tint via per-instance color: a white base multiplies cleanly into the shade
  if (def.tint) (material as THREE.MeshStandardMaterial).color = new THREE.Color("#ffffff");

  return { geometry, material };
}

/**
 * Loads and processes every present flower model. Called once inside the Canvas;
 * returns a map the renderer reads from, falling back to procedural geometry for
 * any flower without a model.
 */
export function useFlowerHeads(): Partial<Record<FlowerId, HeadAsset>> {
  // useGLTF over a constant array keeps hook order stable across renders.
  const gltfs = PRESENT_MODELS.map((id) => useGLTF(FLOWER_MODELS[id].url));

  return useMemo(() => {
    const out: Partial<Record<FlowerId, HeadAsset>> = {};
    PRESENT_MODELS.forEach((id, i) => {
      out[id] = processGltfHead(gltfs[i].scene.clone(true), FLOWER_MODELS[id]);
    });
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltfs]);
}

export function preloadFlowerModels() {
  PRESENT_MODELS.forEach((id) => useGLTF.preload(FLOWER_MODELS[id].url));
}
