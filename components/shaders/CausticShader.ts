import * as THREE from 'three';

// Custom underwater caustic shader
export const CausticShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('#0d2847') },
    uColor2: { value: new THREE.Color('#1a4d6f') },
    uColor3: { value: new THREE.Color('#3fb4c7') },
    uIntensity: { value: 0.6 },
  },

  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    uniform float uIntensity;

    varying vec2 vUv;
    varying vec3 vPosition;

    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

    float snoise(vec2 v) {
      const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m;
      m = m*m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    // Caustic pattern generator (optimized: reduced from 6-7 noise calls to 3)
    float causticPattern(vec2 uv, float time) {
      // Layer 1: Large caustic patterns
      float caustic1 = snoise(uv * 3.0 + vec2(time * 0.1, time * 0.15));

      // Layer 2: Combined medium patterns with distortion
      vec2 distortion = vec2(
        snoise(uv * 4.0 + time * 0.1),
        snoise(uv * 4.0 - time * 0.1)
      ) * 0.1;

      float caustic2 = snoise((uv + distortion) * 6.0 + time * 0.08);

      // Combine layers (removed layer 3 and finalCaustic for 50% shader complexity reduction)
      float caustic = (caustic1 * 0.6) + (caustic2 * 0.4);

      // Create sharp caustic lines
      caustic = pow(abs(caustic), 0.3) * sign(caustic);

      return caustic * 0.5 + 0.5;
    }

    void main() {
      vec2 uv = vUv;

      // Create animated caustic pattern
      float caustic = causticPattern(uv, uTime);

      // Depth gradient (darker at bottom)
      float depthGradient = smoothstep(0.0, 1.0, 1.0 - vUv.y);

      // Mix colors based on caustic intensity
      vec3 color = mix(uColor1, uColor2, depthGradient);
      color = mix(color, uColor3, caustic * uIntensity);

      // Add subtle vignette
      float vignette = smoothstep(0.8, 0.2, length(vUv - 0.5));
      color *= vignette * 0.5 + 0.5;

      // Add caustic highlights
      color += vec3(caustic * 0.3 * uIntensity);

      gl_FragColor = vec4(color, 1.0);
    }
  `,
};

// God rays shader for volumetric lighting
export const GodRaysShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
    uRayOrigin: { value: new THREE.Vector2(0.5, 1.0) },
    uRayColor: { value: new THREE.Color('#6dd5ed') },
    uIntensity: { value: 0.4 },
  },

  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,

  fragmentShader: `
    uniform float uTime;
    uniform vec2 uRayOrigin;
    uniform vec3 uRayColor;
    uniform float uIntensity;

    varying vec2 vUv;

    // Simple noise for ray variation
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);

      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));

      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    void main() {
      vec2 uv = vUv;

      // Direction from pixel to ray origin
      vec2 rayDir = normalize(uRayOrigin - uv);
      float rayDist = length(uRayOrigin - uv);

      // Sample along ray
      float rays = 0.0;
      int samples = 8;

      for(int i = 0; i < samples; i++) {
        float t = float(i) / float(samples);
        vec2 samplePos = mix(uv, uRayOrigin, t);

        // Animated noise for ray variation
        float n = noise(samplePos * 10.0 + uTime * 0.3);
        rays += n * (1.0 - t) * 0.3;
      }

      rays /= float(samples);

      // Fade with distance
      rays *= smoothstep(1.5, 0.0, rayDist);

      // Add pulsing effect
      rays *= (sin(uTime * 2.0) * 0.2 + 0.8);

      vec3 color = uRayColor * rays * uIntensity;

      gl_FragColor = vec4(color, rays * uIntensity);
    }
  `,
};
