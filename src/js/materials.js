import glsl from 'glslify';
import { ShaderMaterial, Vector3 } from 'three';

export const ArcadeRetro = function(config = {}){
    let color = config.color ? config.color : new Vector3(0.0, 1.0, 0.0);
    let fog = parseFloat(config.fog);

    let material = new ShaderMaterial({
        uniforms: {
            color: { type: 'v3', value: color },
            fog: { type: 'f', value: fog },
            peak: { type: 'f', value: 1.0 }
        },

        vertexShader: glsl`
            attribute vec3 center;
            varying vec3 vCenter;

            uniform float peak;

            vec2 normalCartesianToPolar(vec2 st){
                vec2 toCenter = vec2(0.5)-st;
                float angle = atan(toCenter.y,toCenter.x) / 6.28;
                float radius = length(toCenter)*2.0;

                return vec2(radius, angle);
            }

            void main() {
                vCenter = center;
                vec4 pos = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
                pos.x *= peak;
                pos.y *= peak;
                gl_Position = pos;
            }
        `,
        fragmentShader: glsl`
            uniform vec3 color;
            uniform float fog;

            varying vec3 vCenter;

            float edgeFactorTri() {
                vec3 d = fwidth(vCenter.xyz);
                vec3 a3 = smoothstep(vec3(0.0), d * 1.5, vCenter.xyz);
                return min(min(a3.x, a3.y), a3.z);
            }

            void main() {
                vec3 face = mix(vec3(0.0), color, 0.15);
                vec3 color = mix(color, face, edgeFactorTri());
                float line = gl_FragCoord.y - (2.0 * floor(gl_FragCoord.y/2.0));
                color = color * line;

                gl_FragColor.rgb = mix(color, color * gl_FragCoord.w, fog);
            }
        `
    });
    material.extensions.derivatives = true;

    return material;
}
