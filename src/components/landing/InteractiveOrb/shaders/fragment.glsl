varying vec3 vColor;
varying float vFresnel;

void main()
{
    // Body opaque; rim brightens via fresnel-driven contribution from vColor.
    float alpha = vFresnel * 0.25 + 0.85;
    gl_FragColor = vec4(vColor, alpha);
}
