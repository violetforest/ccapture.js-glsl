varying vec2 vUv;
uniform float time;
uniform vec2 resolution;

void main() {
    vec2 pos = gl_FragCoord.xy/resolution;
    float r = sin(pos.y * time);
    float g = 0.572 * cos(pos.x * time);
    float b = 0.164 + sin(pos.x * 3.252) + sin(pos.y + 5.348) * r;
    g = fract(500.0 - sin(b));
	gl_FragColor = vec4(r, g, b, 3.976);
}
