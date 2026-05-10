import * as THREE from "three";

export const SPHERE_CONFIG = {
  radius: 2,
  segments: 64,

  timeScale: 0.3,
  rotationSpeed: 1.5,

  cameraPosition: [0, 0, 5] as [number, number, number],
  cameraFov: 50,

  yOffset: -0.5,
};

export const SHADER_UNIFORMS = {
  uTime: { value: 0 },
  uLightAColor: { value: new THREE.Color("#f7f7f7") },
  uLightAPosition: { value: new THREE.Vector3(1, 1, 0) },
  uLightAIntensity: { value: 2.0 },
  uLightBColor: { value: new THREE.Color("#a5a5a5") },
  uLightBPosition: { value: new THREE.Vector3(-1, -1, 0) },
  uLightBIntensity: { value: 1.8 },
  uBaseColor: { value: new THREE.Color("#191919") },
  uSubdivision: { value: new THREE.Vector2(64, 64) },
  uOffset: { value: new THREE.Vector3(0, 0, 0) },
  uDistortionFrequency: { value: 0.8 },
  uDistortionStrength: { value: 0.15 },
  uDisplacementFrequency: { value: 0.8 },
  uDisplacementStrength: { value: 0.1 },
  uFresnelOffset: { value: -1.6 },
  uFresnelMultiplier: { value: 3.587 },
  uFresnelPower: { value: 2.5 },
};
