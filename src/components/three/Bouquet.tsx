import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  type BouquetConfig,
  shadeHex,
  wrapColorHex,
  ribbonHex,
  greeneryById,
} from "@/lib/catalog";
import { getFlowerGeometry, makeLeafGeometry } from "./geometry/flowers";
import { buildLayout, greeneryDirections, type StemPlacement } from "./geometry/layout";
import {
  buildWrapGeometry,
  buildRibbonGeometry,
  buildCardGeometry,
  buildCardStickGeometry,
} from "./geometry/wrap";
import { getCardTexture } from "./geometry/cardTexture";
import { useFlowerHeads, type HeadAsset } from "./geometry/flowerModels";
import type { FlowerId } from "@/lib/catalog";

const UP = new THREE.Vector3(0, 1, 0);

/** Marks resources this build created so cleanup disposes only those, never the
 *  shared (loaded glTF / cached procedural) head geometry and textures. */
function own<T extends THREE.BufferGeometry | THREE.Material>(x: T): T {
  x.userData.amraDisposable = true;
  return x;
}

function headMatrix(p: StemPlacement): THREE.Matrix4 {
  const q = new THREE.Quaternion().setFromUnitVectors(UP, p.direction);
  return new THREE.Matrix4().compose(
    p.position,
    q,
    new THREE.Vector3(p.scale, p.scale, p.scale)
  );
}

function instanced(
  geometry: THREE.BufferGeometry,
  material: THREE.Material,
  placements: StemPlacement[],
  color?: THREE.Color
): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(geometry, material, placements.length);
  placements.forEach((p, i) => mesh.setMatrixAt(i, headMatrix(p)));
  if (color) {
    for (let i = 0; i < placements.length; i++) mesh.setColorAt(i, color);
    mesh.instanceColor!.needsUpdate = true;
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Resolves a flower's head to either a loaded glTF model or procedural fallback. */
function resolveHead(
  flowerId: FlowerId,
  heads: Partial<Record<FlowerId, HeadAsset>>
): { geometry: THREE.BufferGeometry; material: THREE.Material; fixed: HeadAsset | null } {
  const loaded = heads[flowerId];
  if (loaded) {
    // clone the (cached) material per build so primary/accent tint independently
    return { geometry: loaded.geometry, material: own(loaded.material.clone()), fixed: null };
  }
  const proc = getFlowerGeometry(flowerId);
  const material = own(
    new THREE.MeshStandardMaterial({ roughness: 0.62, metalness: 0, side: THREE.DoubleSide })
  );
  const fixed = proc.fixed
    ? {
        geometry: proc.fixed.geometry,
        material: own(
          new THREE.MeshStandardMaterial({ color: proc.fixed.color, roughness: 0.7 })
        ),
      }
    : null;
  return { geometry: proc.tinted, material, fixed };
}

function buildBouquetGroup(
  config: BouquetConfig,
  heads: Partial<Record<FlowerId, HeadAsset>>
): THREE.Group {
  const group = new THREE.Group();
  const layout = buildLayout(config);
  const primary = layout.stems.filter((s) => !s.isAccent);
  const accents = layout.stems.filter((s) => s.isAccent);

  // --- Stems ---
  const stemMat = own(
    new THREE.MeshStandardMaterial({ color: "#5b7146", roughness: 0.8, metalness: 0 })
  );
  const stemMesh = new THREE.Mesh(own(layout.stemGeometry), stemMat);
  stemMesh.castShadow = true;
  group.add(stemMesh);

  // --- Primary heads ---
  const ph = resolveHead(config.flower, heads);
  group.add(
    instanced(ph.geometry, ph.material, primary, new THREE.Color(shadeHex(config.flower, config.shade)))
  );
  if (ph.fixed) group.add(instanced(ph.fixed.geometry, ph.fixed.material, primary));

  // --- Accent heads ---
  if (config.accentFlower && config.accentShade && accents.length) {
    const ah = resolveHead(config.accentFlower, heads);
    group.add(
      instanced(
        ah.geometry,
        ah.material,
        accents,
        new THREE.Color(shadeHex(config.accentFlower, config.accentShade))
      )
    );
    if (ah.fixed) group.add(instanced(ah.fixed.geometry, ah.fixed.material, accents));
  }

  // --- Greenery ---
  if (config.greenery !== "none") {
    const kind = greeneryById(config.greenery).id as "eucalyptus" | "fern" | "babys-breath";
    const sprigs = greeneryDirections(config, layout);
    const leafColor =
      kind === "babys-breath" ? "#f3f1e8" : kind === "eucalyptus" ? "#8fa389" : "#4f6b3c";
    const leafMat = own(
      new THREE.MeshStandardMaterial({ color: leafColor, roughness: 0.8, side: THREE.DoubleSide })
    );
    group.add(instanced(own(makeLeafGeometry(kind)), leafMat, sprigs));
  }

  // --- Wrap ---
  const wrapMat = own(
    new THREE.MeshStandardMaterial({
      color: wrapColorHex(config.wrap, config.wrapColor),
      roughness: config.wrap === "satin" ? 0.35 : config.wrap === "box" ? 0.5 : 0.85,
      metalness: config.wrap === "satin" ? 0.1 : 0,
      side: THREE.DoubleSide,
    })
  );
  const wrapMesh = new THREE.Mesh(own(buildWrapGeometry(config, layout.spread, layout.height)), wrapMat);
  wrapMesh.castShadow = true;
  wrapMesh.receiveShadow = true;
  group.add(wrapMesh);

  // --- Ribbon ---
  if (config.wrap !== "box") {
    const ribbonMat = own(
      new THREE.MeshStandardMaterial({
        color: ribbonHex(config.ribbon),
        roughness: 0.45,
        metalness: 0.05,
        side: THREE.DoubleSide,
      })
    );
    group.add(new THREE.Mesh(own(buildRibbonGeometry(layout.spread)), ribbonMat));
  }

  // --- Message card ---
  if (config.cardShape) {
    const cardGroup = new THREE.Group();
    const texture = getCardTexture(config.message);
    const card = new THREE.Mesh(
      own(buildCardGeometry(config.cardShape)),
      own(new THREE.MeshStandardMaterial({ map: texture, roughness: 0.85 }))
    );
    card.castShadow = true;
    cardGroup.add(card);

    const stick = new THREE.Mesh(
      own(buildCardStickGeometry()),
      own(new THREE.MeshStandardMaterial({ color: "#caa86a", roughness: 0.6 }))
    );
    stick.position.y = -0.42;
    cardGroup.add(stick);

    const r = Math.max(0.5, layout.spread * 0.75);
    cardGroup.position.set(r * 0.55, layout.height * 0.15, r * 0.9);
    cardGroup.rotation.set(0.18, -0.5, 0.05);
    group.add(cardGroup);
  }

  return group;
}

export function Bouquet({ config }: { config: BouquetConfig }) {
  const heads = useFlowerHeads();
  const group = useMemo(() => buildBouquetGroup(config, heads), [config, heads]);

  // Dispose only the resources this build created (tagged amraDisposable).
  useEffect(() => {
    return () => {
      group.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (!mesh.isMesh) return;
        if (mesh.geometry?.userData.amraDisposable) mesh.geometry.dispose();
        const mat = mesh.material as THREE.Material | THREE.Material[];
        const mats = Array.isArray(mat) ? mat : [mat];
        mats.forEach((m) => m?.userData.amraDisposable && m.dispose());
      });
    };
  }, [group]);

  return <primitive object={group} />;
}
