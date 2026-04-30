"use client";

import { Html, Preload } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { FallbackTunnel } from "@/components/FallbackTunnel";
import { focusFeatureCards } from "@/lib/site-data";

type SceneProps = {
  progress: number;
};

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

function flightDepth(progress: number) {
  return progress * 0.42 + THREE.MathUtils.smoothstep(progress, 0, 1) * 0.58;
}

function CameraRig({ progress }: SceneProps) {
  const target = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera }) => {
    const perspective = camera as THREE.PerspectiveCamera;
    const eased = flightDepth(progress);
    const z = 10 - eased * 84;
    const x = Math.sin(progress * Math.PI * 4.8) * (0.35 + progress * 0.95);
    const y = Math.sin(progress * Math.PI * 3.3 + 0.5) * (0.14 + progress * 0.48);
    const lookAhead = 14 + progress * 24;

    camera.position.lerp(target.set(x, y, z), 0.075);
    camera.lookAt(
      lookTarget.set(
        Math.sin(progress * Math.PI * 5.4) * 0.64,
        Math.cos(progress * Math.PI * 3.2) * 0.32,
        z - lookAhead
      )
    );
    camera.rotation.z = THREE.MathUtils.lerp(
      camera.rotation.z,
      Math.sin(progress * Math.PI * 5.6) * (0.035 + progress * 0.1),
      0.08
    );
    perspective.fov = THREE.MathUtils.lerp(
      perspective.fov,
      56 + Math.sin(progress * Math.PI) * 16 - THREE.MathUtils.smoothstep(progress, 0.72, 1) * 7,
      0.07
    );
    perspective.updateProjectionMatrix();
  });

  return null;
}

function ParticleField() {
  const group = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const count = 1500;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 1.7 + Math.random() * 8.5;
      const angle = Math.random() * Math.PI * 2;
      array[i * 3] = Math.cos(angle) * radius;
      array[i * 3 + 1] = Math.sin(angle) * radius * 0.78;
      array[i * 3 + 2] = -Math.random() * 98 + 9;
    }
    return array;
  }, []);

  useFrame(({ clock }) => {
    if (!group.current) {
      return;
    }
    group.current.rotation.z = clock.elapsedTime * 0.015;
  });

  return (
    <points ref={group}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.8}
        depthWrite={false}
      />
    </points>
  );
}

function SpiralRails({ progress }: SceneProps) {
  const rails = useMemo(
    () =>
      Array.from({ length: 6 }).map((_, railIndex) => {
        const points = Array.from({ length: 220 }).map((__, pointIndex) => {
          const t = pointIndex / 219;
          const angle = t * Math.PI * 18 + railIndex * ((Math.PI * 2) / 6);
          const radius = 2.05 + Math.sin(t * Math.PI * 9 + railIndex) * 0.28;
          return new THREE.Vector3(
            Math.cos(angle) * radius,
            Math.sin(angle) * radius * 0.66,
            5 - t * 96
          );
        });
        return new THREE.CatmullRomCurve3(points);
      }),
    []
  );

  return (
    <group rotation={[0, 0, progress * 2.1]}>
      {rails.map((curve, index) => (
        <mesh key={index}>
          <tubeGeometry args={[curve, 260, index % 2 === 0 ? 0.012 : 0.007, 7, false]} />
          <meshBasicMaterial
            color={index % 2 === 0 ? "#ffffff" : "#bfeaff"}
            transparent
            opacity={index % 2 === 0 ? 0.34 : 0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

function WarpLines({ progress }: SceneProps) {
  const geometry = useMemo(() => {
    const count = 160;
    const array = new Float32Array(count * 2 * 3);
    for (let i = 0; i < count; i += 1) {
      const radius = 2.4 + Math.random() * 6.2;
      const angle = Math.random() * Math.PI * 2;
      const z = -Math.random() * 88 + 7;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * 0.72;
      const idx = i * 6;
      array[idx] = x;
      array[idx + 1] = y;
      array[idx + 2] = z;
      array[idx + 3] = x * 1.04;
      array[idx + 4] = y * 1.04;
      array[idx + 5] = z - (1.2 + Math.random() * 2.6);
    }
    return array;
  }, []);

  return (
    <lineSegments rotation={[0, 0, progress * 3.8]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={geometry.length / 3}
          array={geometry}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffffff" transparent opacity={0.26 + progress * 0.2} />
    </lineSegments>
  );
}

function Tunnel({ progress }: SceneProps) {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(
    () =>
      Array.from({ length: 92 }).map((_, index) => ({
        z: -index * 1.04 + 4,
        radius: 2.08 + Math.sin(index * 0.58) * 0.26 + (index % 7 === 0 ? 0.18 : 0),
        rotate: index * 0.22,
        opacity: 0.12 + (index % 6) * 0.04,
        tube: index % 9 === 0 ? 0.02 : 0.009
      })),
    []
  );

  useFrame(({ clock }) => {
    if (!group.current) {
      return;
    }
    group.current.rotation.z = clock.elapsedTime * 0.075 + progress * 6.4;
    group.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.035;
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, 1.3]} rotation={[0, 0, Math.PI / 5]} scale={1 + progress * 0.48}>
        <torusKnotGeometry args={[1.78, 0.052, 320, 14, 2, 7]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0.7 - progress * 0.22}
        />
      </mesh>

      {rings.map((ring, index) => (
        <group key={ring.z} position={[0, 0, ring.z]} rotation={[0, 0, ring.rotate]}>
          <mesh>
            <torusGeometry args={[ring.radius, ring.tube, 8, 128]} />
            <meshBasicMaterial
              color={index % 3 === 0 ? "#d9f1ff" : "#ffffff"}
              transparent
              opacity={ring.opacity}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[ring.radius * 0.96, 0.006, 8, 80]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.16} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ExitPortal({ progress }: SceneProps) {
  const opacity = THREE.MathUtils.smoothstep(progress, 0.62, 0.95);

  return (
    <group position={[0, 0, -74]} scale={1 + progress * 1.1}>
      <mesh>
        <torusGeometry args={[3.2, 0.035, 12, 180]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.42} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, progress * Math.PI]}>
        <torusGeometry args={[2.2, 0.018, 8, 140]} />
        <meshBasicMaterial color="#a7ddff" transparent opacity={opacity * 0.36} />
      </mesh>
      <mesh>
        <circleGeometry args={[1.45, 96]} />
        <meshBasicMaterial color="#020712" transparent opacity={opacity * 0.82} />
      </mesh>
    </group>
  );
}

function FeaturePanel({
  index,
  progress
}: {
  index: number;
  progress: number;
}) {
  const card = focusFeatureCards[index];
  const Icon = card.icon;
  const z = -8.5 - index * 9.8;
  const angle = index * 1.28 + 0.55;
  const side = index % 2 === 0 ? 1 : -1;
  const radius = 1.42 + (index % 3) * 0.34;
  const position: [number, number, number] = [
    Math.cos(angle) * radius,
    Math.sin(angle) * radius * 0.7 + side * 0.22,
    z
  ];
  const cameraZ = 10 - flightDepth(progress) * 84;
  const ahead = cameraZ - z;
  const entryGate = THREE.MathUtils.smoothstep(progress, 0.08, 0.18);
  const opacity =
    THREE.MathUtils.smoothstep(ahead, -4, 3) *
    (1 - THREE.MathUtils.smoothstep(ahead, 16, 30)) *
    entryGate;
  const nearBoost = 1 - THREE.MathUtils.clamp(Math.abs(ahead - 4) / 18, 0, 1);
  const scale = 0.78 + nearBoost * 1.08;

  return (
    <group
      position={position}
      rotation={[0.09 * side, -angle * 0.32, side * 0.12]}
      scale={scale}
    >
      <Html transform center distanceFactor={2.35} zIndexRange={[30, 0]}>
        <div className="focus-3d-card" style={{ opacity }}>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-electric">
              <Icon size={18} />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/55">
                {card.eyebrow}
              </p>
              <h3 className="mt-1 text-lg font-black tracking-normal text-white">
                {card.title}
              </h3>
            </div>
          </div>
          <p className="mt-4 max-w-[15rem] text-sm leading-6 text-white/72">
            {card.detail}
          </p>
        </div>
      </Html>
    </group>
  );
}

function SceneInner({ progress }: SceneProps) {
  const darkness = THREE.MathUtils.smoothstep(progress, 0.58, 0.98);
  const bgColor = useMemo(
    () =>
      new THREE.Color("#006dff")
        .lerp(new THREE.Color("#020712"), darkness)
        .getStyle(),
    [darkness]
  );
  const fogColor = useMemo(
    () =>
      new THREE.Color("#006dff")
        .lerp(new THREE.Color("#020712"), Math.min(1, darkness + 0.14))
        .getStyle(),
    [darkness]
  );

  return (
    <>
      <color attach="background" args={[bgColor]} />
      <fog attach="fog" args={[fogColor, 9, 58]} />
      <CameraRig progress={progress} />
      <ParticleField />
      <WarpLines progress={progress} />
      <SpiralRails progress={progress} />
      <Tunnel progress={progress} />
      {focusFeatureCards.map((_, index) => (
        <FeaturePanel key={index} index={index} progress={progress} />
      ))}
      <ExitPortal progress={progress} />
      <Preload all />
    </>
  );
}

export default function FocusUniverseScene({ progress }: SceneProps) {
  if (typeof window !== "undefined" && !hasWebGL()) {
    return <FallbackTunnel />;
  }

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 58, near: 0.1, far: 115 }}
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance"
        }}
      >
        <SceneInner progress={progress} />
      </Canvas>
    </div>
  );
}
