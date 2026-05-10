varying vec3 vColor;
varying float vFresnel;

void main()
{
    // Mild bloom keeps grays as grays (5.5x saturates everything to white).
    vec3 glowColor = vColor * 2.0;

    // Fresnel-driven alpha: ghostly body, soft rim. Lower than the original
    // 0.85 + 0.05 so the orb reads as a faded outline against the white page
    // rather than a dark silhouette.
    float alpha = vFresnel * 0.5 + 0.03;

    gl_FragColor = vec4(glowColor, alpha);
}
