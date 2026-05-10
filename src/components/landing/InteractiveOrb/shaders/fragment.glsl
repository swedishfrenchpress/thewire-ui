varying vec3 vColor;
varying float vFresnel;

void main()
{
    // Mild bloom keeps grays as grays (5.5x saturates everything to white).
    vec3 glowColor = vColor * 2.0;

    // Fresnel-driven alpha: translucent body, opaque rim — restores the
    // ghosty sphere silhouette from the cyan demo.
    float alpha = vFresnel * 0.85 + 0.05;

    gl_FragColor = vec4(glowColor, alpha);
}
