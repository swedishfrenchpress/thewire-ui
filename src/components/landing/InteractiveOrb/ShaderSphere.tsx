"use client";

import { useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import { SHADER_UNIFORMS } from "./config";
import { useSphereGeometry } from "./geometry";
import { useShaderAnimation } from "./useShaderAnimation";

interface ShaderSphereProps {
  segments?: number;
}

export function ShaderSphere({ segments }: ShaderSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useSphereGeometry(segments);

  useShaderAnimation(materialRef);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={SHADER_UNIFORMS}
        transparent={true}
      />
    </mesh>
  );
}
