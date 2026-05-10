"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import fragmentShader from "./shaders/fragment.glsl";
import vertexShader from "./shaders/vertex.glsl";
import { SHADER_UNIFORMS } from "./config";
import { useSphereGeometry } from "./geometry";
import { useShaderAnimation } from "./useShaderAnimation";

interface ShaderSphereProps {
  segments?: number;
  isDark?: boolean;
}

export function ShaderSphere({ segments, isDark = false }: ShaderSphereProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useSphereGeometry(segments);

  const uniforms = useMemo(
    () => ({
      ...SHADER_UNIFORMS,
      uLightAColor: { value: new THREE.Color("#e0e0e0") },
      uLightBColor: { value: new THREE.Color(isDark ? "#ffffff" : "#292929") },
      uLightAIntensity: { value: 2.2 },
      uLightBIntensity: { value: 1.8 },
      uBaseColor: { value: new THREE.Color(isDark ? "#e0e0e0" : "#292929") },
    }),
    [isDark],
  );

  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uLightBColor.value.set(
      isDark ? "#ffffff" : "#292929",
    );
    materialRef.current.uniforms.uBaseColor.value.set(
      isDark ? "#e0e0e0" : "#292929",
    );
  }, [isDark]);

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
