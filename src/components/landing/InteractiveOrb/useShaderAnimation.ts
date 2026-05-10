import type { RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type * as THREE from "three";
import type { DeskSignal } from "@/lib/use-desk-signal";
import { ORB_RANGES, SPHERE_CONFIG } from "./config";

function lerp(current: number, target: number, factor: number): number {
  return current + (target - current) * factor;
}

function targets(signal: DeskSignal) {
  const meanSeverity = clamp01(signal.meanSeverity);
  const highShare = clamp01(signal.highShare);
  const processing = signal.processingCount;
  const r = ORB_RANGES;
  return {
    displacementStrength:
      r.displacementStrength.idle +
      (r.displacementStrength.hot - r.displacementStrength.idle) * meanSeverity,
    distortionFrequency:
      r.distortionFrequencyBase +
      r.distortionFrequencyPerProcessing *
        Math.min(processing, r.distortionFrequencyMaxProcessing),
    distortionStrength:
      processing > 0 ? r.distortionStrengthBusy : r.distortionStrengthIdle,
    fresnelMultiplier:
      r.fresnelMultiplier.idle +
      (r.fresnelMultiplier.hot - r.fresnelMultiplier.idle) * highShare,
  };
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

// Submission "ping": brief boost to the time-advance multiplier when a new
// filing arrived in the last `pingDurationMs`. Linear decay back to 1.
function pingFactor(lastFilingAgeMs: number): number {
  if (!Number.isFinite(lastFilingAgeMs)) return 1;
  const dur = ORB_RANGES.pingDurationMs;
  if (lastFilingAgeMs >= dur) return 1;
  const t = lastFilingAgeMs / dur;
  return 1 + ORB_RANGES.pingBoost * (1 - t);
}

export function useShaderAnimation(
  materialRef: RefObject<THREE.ShaderMaterial | null>,
  reducedMotion: boolean,
  signal: DeskSignal,
) {
  useFrame((state, delta) => {
    const mat = materialRef.current;
    if (!mat) return;
    const u = mat.uniforms;

    const t = targets(signal);
    const factor = ORB_RANGES.lerp;

    if (reducedMotion) {
      // Snap to a static, calm baseline. No lerp; no time advance.
      u.uDisplacementStrength.value = ORB_RANGES.displacementStrength.idle;
      u.uDistortionStrength.value = 0;
      u.uFresnelMultiplier.value = ORB_RANGES.fresnelMultiplier.idle;
      return;
    }

    u.uDisplacementStrength.value = lerp(
      u.uDisplacementStrength.value,
      t.displacementStrength,
      factor,
    );
    u.uDistortionFrequency.value = lerp(
      u.uDistortionFrequency.value,
      t.distortionFrequency,
      factor,
    );
    u.uDistortionStrength.value = lerp(
      u.uDistortionStrength.value,
      t.distortionStrength,
      factor,
    );
    u.uFresnelMultiplier.value = lerp(
      u.uFresnelMultiplier.value,
      t.fresnelMultiplier,
      factor,
    );

    const ping = pingFactor(signal.lastFilingAgeMs);
    u.uTime.value += delta * SPHERE_CONFIG.timeScale * ping;
  });
}
