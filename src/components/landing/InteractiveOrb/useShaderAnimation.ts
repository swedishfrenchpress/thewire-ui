import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import { SPHERE_CONFIG } from "./config";

export function useShaderAnimation(
  materialRef: RefObject<THREE.ShaderMaterial | null>,
  reducedMotion = false,
) {
  useFrame((state) => {
    if (reducedMotion) return;
    if (!materialRef.current) return;
    materialRef.current.uniforms.uTime.value =
      state.clock.getElapsedTime() * SPHERE_CONFIG.timeScale;
  });
}
