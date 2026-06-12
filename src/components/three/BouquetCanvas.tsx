"use client";

import { Suspense, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Center,
} from "@react-three/drei";
import type { BouquetConfig } from "@/lib/catalog";
import { Bouquet } from "./Bouquet";

export type CaptureFn = () => string | null;

/** Bridges a thumbnail-capture function up to the parent via a ref. */
function CaptureBridge({ captureRef }: { captureRef: React.RefObject<CaptureFn | null> }) {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  captureRef.current = () => {
    try {
      gl.render(scene, camera);
      return gl.domElement.toDataURL("image/png");
    } catch {
      return null;
    }
  };
  return null;
}

export function BouquetCanvas({
  config,
  autoRotate = true,
  captureRef,
  className,
}: {
  config: BouquetConfig;
  autoRotate?: boolean;
  captureRef?: React.RefObject<CaptureFn | null>;
  className?: string;
}) {
  const internalRef = useRef<CaptureFn | null>(null);
  const ref = captureRef ?? internalRef;

  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 2]}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      camera={{ position: [0, 1.2, 6], fov: 38 }}
    >
      <color attach="background" args={["#f1f3ee"]} />
      <ambientLight intensity={0.55} />
      <directionalLight
        position={[4, 7, 5]}
        intensity={2.1}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0003}
      />
      <directionalLight position={[-5, 3, -4]} intensity={0.7} color="#cfe0ff" />

      <Suspense fallback={null}>
        <Center key={cacheKey(config)} position={[0, 0.3, 0]}>
          <Bouquet config={config} />
        </Center>
        <Environment preset="apartment" />
      </Suspense>

      <ContactShadows
        position={[0, -1.9, 0]}
        opacity={0.4}
        scale={10}
        blur={2.6}
        far={4}
        color="#2c3a2e"
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.8}
        minDistance={3.5}
        maxDistance={9}
        minPolarAngle={0.3}
        maxPolarAngle={Math.PI / 1.8}
        target={[0, 0.3, 0]}
      />

      {captureRef && <CaptureBridge captureRef={ref} />}
    </Canvas>
  );
}

// Re-center whenever the silhouette could change so the bouquet stays framed.
function cacheKey(c: BouquetConfig): string {
  return `${c.flower}-${c.size}-${c.shape}-${c.stemLength}-${c.wrap}-${c.accentFlower}-${c.cardShape}`;
}
