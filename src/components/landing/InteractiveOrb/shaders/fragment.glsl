varying vec3 vColor;
varying float vFresnel;
varying float vSmoothFresnel;

void main()
{
    // Mild bloom — lifts the rim green without clamping to white.
    vec3 glowColor = vColor * 1.6;

    // Smooth fresnel keeps the silhouette clean: center stays fully
    // transparent (page shows through as the light middle), rim alone
    // picks up the green rim glow.
    float alpha = vSmoothFresnel * 0.65;

    gl_FragColor = vec4(glowColor, alpha);
}
