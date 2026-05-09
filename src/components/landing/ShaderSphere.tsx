"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import { SHADER_UNIFORMS } from "./sphere-config";
import { useSphereGeometry } from "./sphere-geometry";
import { useShaderAnimation } from "./use-shader-animation";

interface ShaderSphereProps {
  segments?: number;
}

export function ShaderSphere({ segments }: ShaderSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useSphereGeometry(segments);

  const uniforms = useMemo(
    () => ({
      ...SHADER_UNIFORMS,
      uLightAColor: { value: new THREE.Color("#191919") },
      uLightBColor: { value: new THREE.Color("#4a4a4a") },
      uBaseColor: { value: new THREE.Color("#e5e5e5") },
    }),
    [],
  );

  useShaderAnimation(materialRef);

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
