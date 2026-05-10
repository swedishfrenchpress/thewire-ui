import * as THREE from "three";

export const SPHERE_CONFIG = {
  radius: 2,
  segments: 64,

  // Time multiplier for the noise advance. Modulated by the signal "ping"
  // boost when a new filing arrives.
  timeScale: 0.3,

  // Idle baseline. Real rotation speed is derived per-frame from the desk
  // signal (still at rest; rotates only when work is in flight).
  rotationSpeedIdle: 0,
  rotationSpeedActive: 1.5,
  rotationProcessingScale: 0.3,

  cameraPosition: [0, 0, 5] as [number, number, number],
  cameraFov: 50,

  yOffset: -0.5,
};

// Uniform target ranges. Each frame, the live uniform value lerps toward
// the signal-derived target (see useShaderAnimation). Idle = empty desk.
export const ORB_RANGES = {
  displacementStrength: { idle: 0.04, hot: 0.18 },
  distortionFrequencyBase: 0.6,
  distortionFrequencyPerProcessing: 0.15,
  distortionFrequencyMaxProcessing: 4,
  distortionStrengthIdle: 0.1,
  distortionStrengthBusy: 0.18,
  fresnelMultiplier: { idle: 2.5, hot: 4.0 },
  // Lerp factor per frame. ~0.04 settles in roughly one second at 60fps.
  lerp: 0.04,
  // Submission ping: brief boost to time advance when a new filing arrived.
  pingDurationMs: 5000,
  pingBoost: 0.4,
};

export function makeShaderUniforms() {
  return {
    uTime: { value: 0 },
    uLightAColor: { value: new THREE.Color("#888888") },
    uLightAPosition: { value: new THREE.Vector3(1, 1, 0) },
    uLightAIntensity: { value: 0.6 },
    uLightBColor: { value: new THREE.Color("#000000") },
    uLightBPosition: { value: new THREE.Vector3(-1, -1, 0) },
    uLightBIntensity: { value: 0.3 },
    uBaseColor: { value: new THREE.Color("#1a1a1a") },
    uSubdivision: { value: new THREE.Vector2(64, 64) },
    uOffset: { value: new THREE.Vector3(0, 0, 0) },
    uDistortionFrequency: { value: ORB_RANGES.distortionFrequencyBase },
    uDistortionStrength: { value: ORB_RANGES.distortionStrengthIdle },
    uDisplacementFrequency: { value: 0.8 },
    uDisplacementStrength: { value: ORB_RANGES.displacementStrength.idle },
    uFresnelOffset: { value: -1.6 },
    uFresnelMultiplier: { value: ORB_RANGES.fresnelMultiplier.idle },
    uFresnelPower: { value: 2.5 },
  };
}
