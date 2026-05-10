"use client";

import { Box } from "@chakra-ui/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { useReducedMotion } from "@/lib/hooks/useReducedMotion";
import { IDLE_SIGNAL, type DeskSignal } from "@/lib/use-desk-signal";
import { ShaderSphere } from "./ShaderSphere";
import { SPHERE_CONFIG } from "./config";

interface InteractiveOrbProps {
  width?: string;
  height?: string;
  segments?: number;
  signal?: DeskSignal;
}

function targetRotationSpeed(signal: DeskSignal): number {
  if (signal.processingCount === 0) return SPHERE_CONFIG.rotationSpeedIdle;
  return (
    SPHERE_CONFIG.rotationSpeedActive *
    (1 + SPHERE_CONFIG.rotationProcessingScale * signal.processingCount)
  );
}

function RotatingGroup({
  reducedMotion,
  signal,
  children,
}: {
  reducedMotion: boolean;
  signal: DeskSignal;
  children: React.ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const speedRef = useRef(0);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const target = targetRotationSpeed(signal);
    speedRef.current += (target - speedRef.current) * 0.04;
    if (groupRef.current) {
      groupRef.current.rotation.y += speedRef.current * delta;
    }
  });

  return (
    <group ref={groupRef} position={[0, SPHERE_CONFIG.yOffset, 0]}>
      {children}
    </group>
  );
}

export function InteractiveOrb({
  width = "100%",
  height = "240px",
  segments,
  signal = IDLE_SIGNAL,
}: InteractiveOrbProps) {
  const reducedMotion = useReducedMotion();
  return (
    <Box width={width} height={height}>
      <Canvas
        camera={{
          position: SPHERE_CONFIG.cameraPosition,
          fov: SPHERE_CONFIG.cameraFov,
        }}
        gl={{
          alpha: true,
          antialias: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 2]}
        frameloop={reducedMotion ? "demand" : "always"}
        style={{
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <RotatingGroup reducedMotion={reducedMotion} signal={signal}>
          <ShaderSphere
            reducedMotion={reducedMotion}
            segments={segments}
            signal={signal}
          />
        </RotatingGroup>
      </Canvas>
    </Box>
  );
}
