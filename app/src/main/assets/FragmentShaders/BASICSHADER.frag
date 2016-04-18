precision mediump float;

uniform vec2 uScreen;
uniform vec2 uMousePos;
uniform float uTime;

vec3 color;

void main() {
    vec2 uv = gl_FragCoord.xy / uScreen.xy;
    color = vec3(uv, 0.5 + 0.5 * sin(uTime));
    gl_FragColor = vec4(color,1);
}
