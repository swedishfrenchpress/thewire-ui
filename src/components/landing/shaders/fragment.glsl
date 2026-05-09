varying vec3 vColor;
varying float vFresnel;

void main()
{
    vec3 glowColor = vColor;

    // Body opaque; rim brightens via fresnel-driven contribution from vColor.
    float alpha = vFresnel * 0.25 + 0.85;

    gl_FragColor = vec4(glowColor, alpha);
}
