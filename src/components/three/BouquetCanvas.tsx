"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Center } from "@react-three/drei";
import type { BouquetConfig } from "@/lib/catalog";
import { Bouquet } from "./Bouquet";

export type CaptureFn = () => string | null;

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

  // The canvas can mount before its container is measured (dynamic import +
  // flex/percentage layout), leaving it at the default 300x150. Nudging a
  // resize on the next frame forces R3F to remeasure and size correctly.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      window.dispatchEvent(new Event("resize"))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 2]}
      resize={{ debounce: 0 }}
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      camera={{ position: [0, 0.3, 3.2], fov: 42 }}
    >
      <color attach="background" args={["#fdf6f3"]} />
      <hemisphereLight args={["#fff6f0", "#e9e0d6", 0.9]} />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[3.5, 6, 4]}
        intensity={2.0}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0003}
      />
      <directionalLight position={[-4, 2.5, -3]} intensity={0.6} color="#ffe6d8" />

      <Suspense fallback={null}>
        {/* Re-mounting on any config change guarantees a clean rebuild and
            re-frames the bouquet every time. */}
        <Center key={JSON.stringify(config)} position={[0, 0.15, 0]}>
          <Bouquet config={config} />
        </Center>
      </Suspense>

      <ContactShadows
        position={[0, -1.35, 0]}
        opacity={0.32}
        scale={7}
        blur={2.8}
        far={3}
        color="#7a5a52"
      />

      <OrbitControls
        makeDefault
        enablePan={false}
        autoRotate={autoRotate}
        autoRotateSpeed={0.85}
        minDistance={2.6}
        maxDistance={7}
        minPolarAngle={0.35}
        maxPolarAngle={Math.PI / 1.85}
        target={[0, 0.15, 0]}
      />

      {captureRef && <CaptureBridge captureRef={ref} />}
    </Canvas>
  );
}
