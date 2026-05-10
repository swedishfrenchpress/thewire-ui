"use client";

import { Box } from "@chakra-ui/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";
import { ShaderSphere } from "./ShaderSphere";
import { SPHERE_CONFIG } from "./config";

interface InteractiveOrbProps {
  width?: string;
  height?: string;
  segments?: number;
}

function RotatingGroup({ children }: { children: React.ReactNode }) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += SPHERE_CONFIG.rotationSpeed * delta;
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
}: InteractiveOrbProps) {
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
        style={{
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "block",
        }}
      >
        <RotatingGroup>
          <ShaderSphere segments={segments} />
        </RotatingGroup>
      </Canvas>
    </Box>
  );
}
