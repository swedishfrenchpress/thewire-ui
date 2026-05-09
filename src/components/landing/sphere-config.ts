import * as THREE from "three";

export const SPHERE_CONFIG = {
  radius: 2,
  segments: 64,

  timeScale: 0.3,
  intensityDecay: 0.9,
  rotationSpeed: 5.0,

  cameraPosition: [0, 0, 5] as [number, number, number],
  cameraFov: 50,

  yOffset: -0.5,
};

export const ANIMATION_INTENSITY = {
  baseDistortion: 0.15,
  baseDisplacement: 0.1,
  baseLightIntensity: 2.0,
};

export const SHADER_UNIFORMS = {
  uTime: { value: 0 },
  uLightAColor: { value: new THREE.Color("#191919") },
  uLightAPosition: { value: new THREE.Vector3(1, 1, 0) },
  uLightAIntensity: { value: ANIMATION_INTENSITY.baseLightIntensity },
  uLightBColor: { value: new THREE.Color("#4a4a4a") },
  uLightBPosition: { value: new THREE.Vector3(-1, -1, 0) },
  uLightBIntensity: { value: 1.8 },
  uBaseColor: { value: new THREE.Color("#e5e5e5") },
  uSubdivision: { value: new THREE.Vector2(64, 64) },
  uOffset: { value: new THREE.Vector3(0, 0, 0) },
  uDistortionFrequency: { value: 0.8 },
  uDistortionStrength: { value: ANIMATION_INTENSITY.baseDistortion },
  uDisplacementFrequency: { value: 0.8 },
  uDisplacementStrength: { value: ANIMATION_INTENSITY.baseDisplacement },
  uFresnelOffset: { value: -1.6 },
  uFresnelMultiplier: { value: 3.587 },
  uFresnelPower: { value: 2.5 },
};
