varying vec3 vColor;
varying float vFresnel;

void main()
{
    // Restrained halation — editorial ink halo, not neon glow.
    // Reference uses 5.5x; we use 2.0x to fit a monochromatic palette.
    vec3 glowColor = vColor * 2.0;

    // Fresnel-driven alpha: rim lights, center recedes.
    float alpha = vFresnel * 0.9 + 0.02;

    gl_FragColor = vec4(glowColor, alpha);
}
