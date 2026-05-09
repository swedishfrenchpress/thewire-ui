"use client";

import { Box } from "@chakra-ui/react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
import { ShaderSphere } from "./ShaderSphere";
import { SPHERE_CONFIG } from "./sphere-config";

interface InteractiveOrbProps {
  width?: string;
  height?: string;
  segments?: number;
  animationDelay?: number;
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
  height = "480px",
  segments,
  animationDelay = 300,
}: InteractiveOrbProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay);
    return () => clearTimeout(timer);
  }, [animationDelay]);

  return (
    <Box
      style={{
        opacity: isVisible ? 1 : 0,
        filter: isVisible ? "blur(0px)" : "blur(8px)",
        transition: "opacity 600ms ease-out, filter 600ms ease-out",
      }}
      width={width}
      height={height}
    >
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
        style={{ background: "transparent" }}
      >
        <RotatingGroup>
          <ShaderSphere segments={segments} />
        </RotatingGroup>
      </Canvas>
    </Box>
  );
}
