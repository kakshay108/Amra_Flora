import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  type BouquetConfig,
  flowerById,
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

const UP = new THREE.Vector3(0, 1, 0);

/** Orientation that maps the geometry's +Y axis onto a stem direction. */
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

/**
 * Builds the entire bouquet as a disposable THREE.Group from a config. Memoized
 * by the component below so it only rebuilds when a choice actually changes.
 */
function buildBouquetGroup(config: BouquetConfig): THREE.Group {
  const group = new THREE.Group();
  const layout = buildLayout(config);

  const primary = layout.stems.filter((s) => !s.isAccent);
  const accents = layout.stems.filter((s) => s.isAccent);

  // --- Stems ---
  const stemMat = new THREE.MeshStandardMaterial({
    color: "#5b7146",
    roughness: 0.8,
    metalness: 0,
  });
  const stemMesh = new THREE.Mesh(layout.stemGeometry, stemMat);
  stemMesh.castShadow = true;
  group.add(stemMesh);

  // --- Flower heads (primary) ---
  // Per-instance color comes from InstancedMesh.setColorAt (the instanceColor
  // attribute); do NOT enable vertexColors or the heads render black.
  const headMat = new THREE.MeshStandardMaterial({
    roughness: 0.62,
    metalness: 0,
    side: THREE.DoubleSide,
  });
  const primaryGeo = getFlowerGeometry(config.flower);
  group.add(
    instanced(
      primaryGeo.tinted,
      headMat,
      primary,
      new THREE.Color(shadeHex(config.flower, config.shade))
    )
  );
  if (primaryGeo.fixed) {
    const fixedMat = new THREE.MeshStandardMaterial({
      color: primaryGeo.fixed.color,
      roughness: 0.7,
    });
    group.add(instanced(primaryGeo.fixed.geometry, fixedMat, primary));
  }

  // --- Flower heads (accent) ---
  if (config.accentFlower && config.accentShade && accents.length) {
    const accentGeo = getFlowerGeometry(config.accentFlower);
    const accentMat = new THREE.MeshStandardMaterial({
      roughness: 0.62,
      metalness: 0,
      side: THREE.DoubleSide,
    });
    group.add(
      instanced(
        accentGeo.tinted,
        accentMat,
        accents,
        new THREE.Color(shadeHex(config.accentFlower, config.accentShade))
      )
    );
    if (accentGeo.fixed) {
      const fixedMat = new THREE.MeshStandardMaterial({
        color: accentGeo.fixed.color,
        roughness: 0.7,
      });
      group.add(instanced(accentGeo.fixed.geometry, fixedMat, accents));
    }
  }

  // --- Greenery ---
  if (config.greenery !== "none") {
    const kind = greeneryById(config.greenery).id as
      | "eucalyptus"
      | "fern"
      | "babys-breath";
    const sprigs = greeneryDirections(config, layout);
    const leafGeo = makeLeafGeometry(kind);
    const leafColor =
      kind === "babys-breath" ? "#f3f1e8" : kind === "eucalyptus" ? "#8fa389" : "#4f6b3c";
    const leafMat = new THREE.MeshStandardMaterial({
      color: leafColor,
      roughness: 0.8,
      side: THREE.DoubleSide,
    });
    group.add(instanced(leafGeo, leafMat, sprigs));
  }

  // --- Wrap ---
  const wrapGeo = buildWrapGeometry(config, layout.spread, layout.height);
  const wrapMat = new THREE.MeshStandardMaterial({
    color: wrapColorHex(config.wrap, config.wrapColor),
    roughness: config.wrap === "satin" ? 0.35 : config.wrap === "box" ? 0.5 : 0.85,
    metalness: config.wrap === "satin" ? 0.1 : 0,
    side: THREE.DoubleSide,
  });
  const wrapMesh = new THREE.Mesh(wrapGeo, wrapMat);
  wrapMesh.castShadow = true;
  wrapMesh.receiveShadow = true;
  group.add(wrapMesh);

  // --- Ribbon ---
  if (config.wrap !== "box") {
    const ribbonGeo = buildRibbonGeometry(layout.spread);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: ribbonHex(config.ribbon),
      roughness: 0.45,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    group.add(new THREE.Mesh(ribbonGeo, ribbonMat));
  }

  // --- Message card ---
  if (config.cardShape) {
    const cardGroup = new THREE.Group();
    const cardGeo = buildCardGeometry(config.cardShape);
    const texture = getCardTexture(config.message);
    const frontMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.85,
    });
    const card = new THREE.Mesh(cardGeo, frontMat);
    card.castShadow = true;
    cardGroup.add(card);

    const stickGeo = buildCardStickGeometry();
    const stickMat = new THREE.MeshStandardMaterial({ color: "#caa86a", roughness: 0.6 });
    const stick = new THREE.Mesh(stickGeo, stickMat);
    stick.position.y = -0.42;
    cardGroup.add(stick);

    // tuck the card into the front-right of the arrangement, tilted out
    const r = Math.max(0.5, layout.spread * 0.75);
    cardGroup.position.set(r * 0.55, layout.height * 0.15, r * 0.9);
    cardGroup.rotation.set(0.18, -0.5, 0.05);
    group.add(cardGroup);
  }

  return group;
}

export function Bouquet({ config }: { config: BouquetConfig }) {
  const group = useMemo(() => buildBouquetGroup(config), [config]);

  // Dispose the previous group's geometry/materials when the config changes.
  useEffect(() => {
    return () => {
      group.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.isMesh) {
          // shared cached flower-head geometry is reused; only dispose the
          // per-build geometry (stems, wrap, ribbon, card, greenery clones)
          const g = mesh.geometry;
          const keepCached =
            g === getFlowerGeometry(config.flower).tinted ||
            (config.accentFlower &&
              g === getFlowerGeometry(config.accentFlower).tinted);
          if (!keepCached) g.dispose();
          const mat = mesh.material as THREE.Material | THREE.Material[];
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
          else mat.dispose();
        }
      });
    };
  }, [group, config.flower, config.accentFlower]);

  // flowerById call keeps the import used and validates the id early
  flowerById(config.flower);

  return <primitive object={group} />;
}
