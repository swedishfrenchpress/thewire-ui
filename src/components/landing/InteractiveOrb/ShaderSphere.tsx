"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { DeskSignal } from "@/lib/use-desk-signal";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import { makeShaderUniforms } from "./config";
import { useSphereGeometry } from "./geometry";
import { useShaderAnimation } from "./useShaderAnimation";

interface ShaderSphereProps {
  segments?: number;
  reducedMotion?: boolean;
  signal: DeskSignal;
}

export function ShaderSphere({
  segments,
  reducedMotion = false,
  signal,
}: ShaderSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useSphereGeometry(segments);
  // Per-instance uniforms. Module-level singletons would couple multiple
  // mounts (e.g. nav back-and-forth) to the same shader state.
  const uniforms = useMemo(() => makeShaderUniforms(), []);

  useShaderAnimation(materialRef, reducedMotion, signal);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
      />
    </mesh>
  );
}
