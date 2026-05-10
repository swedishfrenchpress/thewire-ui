import { useMemo } from "react";
import * as THREE from "three";
import { SPHERE_CONFIG } from "./config";

export function useSphereGeometry(customSegments?: number) {
  const segments = customSegments ?? SPHERE_CONFIG.segments;

  return useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(SPHERE_CONFIG.radius, segments);

    const positionAttribute = geo.getAttribute("position");
    const normalAttribute = geo.getAttribute("normal");
    const count = positionAttribute.count;

    const tangents = new Float32Array(count * 4);

    for (let i = 0; i < count; i++) {
      const nx = normalAttribute.getX(i);
      const ny = normalAttribute.getY(i);
      const nz = normalAttribute.getZ(i);

      let tx, ty, tz;
      if (Math.abs(nx) > 0.9) {
        tx = 0;
        ty = 1;
        tz = 0;
      } else {
        tx = 1;
        ty = 0;
        tz = 0;
      }

      // Gram-Schmidt orthogonalization against the normal
      const dot = tx * nx + ty * ny + tz * nz;
      tx -= nx * dot;
      ty -= ny * dot;
      tz -= nz * dot;

      const len = Math.sqrt(tx * tx + ty * ty + tz * tz);
      tx /= len;
      ty /= len;
      tz /= len;

      tangents[i * 4] = tx;
      tangents[i * 4 + 1] = ty;
      tangents[i * 4 + 2] = tz;
      tangents[i * 4 + 3] = 1;
    }

    geo.setAttribute("tangent", new THREE.BufferAttribute(tangents, 4));

    return geo;
  }, [segments]);
}
