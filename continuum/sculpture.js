/** A small, dependency-free kinetic sculpture. Rendering is driven by the page. */
export function createSculpture(canvas) {
  const gl = canvas.getContext('webgl', {
    alpha: true, antialias: true, premultipliedAlpha: false,
    depth: true, stencil: false, powerPreference: 'low-power',
  });
  if (!gl) return null;

  const vertex = `
    attribute vec3 aPosition;
    attribute vec3 aNormal;
    uniform mat4 uModel;
    uniform mat4 uViewProjection;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vec4 p = uModel * vec4(aPosition, 1.0);
      vPosition = p.xyz;
      vNormal = mat3(uModel) * aNormal;
      gl_Position = uViewProjection * p;
    }
  `;
  const fragment = `
    precision highp float;
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform vec3 uEye;
    uniform vec3 uColor;
    uniform float uAccent;
    uniform float uOpacity;
    vec3 environment(vec3 r) {
      float sky = smoothstep(-0.48, 0.8, r.y);
      vec3 c = mix(vec3(0.033, 0.052, 0.077), vec3(0.76, 0.83, 0.87), sky);
      // Broad studio cards and their dark boundaries articulate the curved metal.
      float upper = pow(max(dot(r, normalize(vec3(-0.75, 0.85, 0.35))), 0.0), 11.0);
      float strip = pow(max(dot(r, normalize(vec3(0.65, 0.22, 0.8))), 0.0), 75.0);
      float left = pow(max(dot(r, normalize(vec3(-0.9, -0.1, 0.4))), 0.0), 32.0);
      float horizon = smoothstep(0.0, 0.045, abs(r.y + 0.18));
      c *= mix(0.17, 1.0, horizon);
      c += vec3(1.7, 1.75, 1.8) * upper;
      c += vec3(2.4, 2.4, 2.25) * strip;
      c += vec3(0.33, 0.53, 0.72) * left;
      return c;
    }
    void main() {
      vec3 n = normalize(vNormal);
      vec3 v = normalize(uEye - vPosition);
      vec3 r = reflect(-v, n);
      float nv = max(dot(n, v), 0.0);
      float fresnel = pow(1.0 - nv, 4.0);
      vec3 reflected = environment(r);
      vec3 light = normalize(vec3(-0.5, 0.8, 1.3));
      float diffuse = max(dot(n, light), 0.0);
      float specular = pow(max(dot(n, normalize(light + v)), 0.0), 100.0);
      vec3 metal = reflected * uColor * (0.78 + fresnel * 0.32);
      metal += uColor * (0.055 + diffuse * 0.085) + specular * 0.38;
      vec3 enamel = uColor * (0.27 + diffuse * 0.77) + reflected * 0.085 + specular * 0.4;
      vec3 color = mix(metal, enamel, uAccent);
      color = color / (color + vec3(0.72));
      color = pow(color, vec3(0.4545));
      gl_FragColor = vec4(color, uOpacity);
    }
  `;
  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const error = gl.getShaderInfoLog(shader);
      gl.deleteShader(shader);
      throw new Error(error);
    }
    return shader;
  }
  let program, vs, fs;
  try {
    vs = compile(gl.VERTEX_SHADER, vertex);
    fs = compile(gl.FRAGMENT_SHADER, fragment);
    program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Sculpture shader could not link.');
  } catch {
    if (vs) gl.deleteShader(vs);
    if (fs) gl.deleteShader(fs);
    if (program) gl.deleteProgram(program);
    return null;
  }
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  const position = gl.getAttribLocation(program, 'aPosition');
  const normal = gl.getAttribLocation(program, 'aNormal');
  const uniforms = Object.fromEntries(['uModel', 'uViewProjection', 'uEye', 'uColor', 'uAccent', 'uOpacity'].map(n => [n, gl.getUniformLocation(program, n)]));
  const meshes = [];

  function mesh(data, indices) {
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
    const result = { buffer, indexBuffer, count: indices.length };
    meshes.push(result);
    return result;
  }

  // A solid, rounded metal plate. No transparency or wireframe substitutes.
  function plate() {
    const data = [], indices = [], steps = 48, profiles = [];
    const radius = 0.495, halfDepth = 0.0515, bevel = 0.022;
    profiles.push([0, -halfDepth, 0, -1]);
    for (let j = 0; j <= 5; j++) {
      const a = -Math.PI / 2 + j * Math.PI / 10;
      profiles.push([radius - bevel + bevel * Math.cos(a), -halfDepth + bevel + bevel * Math.sin(a), Math.cos(a), Math.sin(a)]);
    }
    for (let j = 0; j <= 5; j++) {
      const a = j * Math.PI / 10;
      profiles.push([radius - bevel + bevel * Math.cos(a), halfDepth - bevel + bevel * Math.sin(a), Math.cos(a), Math.sin(a)]);
    }
    profiles.push([0, halfDepth, 0, 1]);
    for (let j = 0; j < profiles.length; j++) {
      const [r, z, nr, nz] = profiles[j];
      for (let i = 0; i <= steps; i++) {
        const a = i / steps * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
        data.push(r * c, r * s, z, nr * c, nr * s, nz);
        if (j && i) {
          const b = j * (steps + 1) + i, a0 = b - steps - 1;
          indices.push(a0 - 1, a0, b, a0 - 1, b, b - 1);
        }
      }
    }
    return mesh(data, indices);
  }
  function sphere() {
    const data = [], indices = [], width = 48, height = 24;
    for (let j = 0; j <= height; j++) {
      const t = j / height * Math.PI;
      for (let i = 0; i <= width; i++) {
        const p = i / width * Math.PI * 2;
        const x = Math.sin(t) * Math.cos(p), y = Math.cos(t), z = Math.sin(t) * Math.sin(p);
        data.push(x, y, z, x, y, z);
        if (j && i) {
          const b = j * (width + 1) + i, a = b - width - 1;
          indices.push(a - 1, b, a, a - 1, b - 1, b);
        }
      }
    }
    return mesh(data, indices);
  }
  const rib = plate(), core = sphere();
  const identity = () => new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  function multiply(a, b) {
    const out = new Float32Array(16);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
      out[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
    }
    return out;
  }
  function rotation(x, y, z) {
    const sx = Math.sin(x), cx = Math.cos(x), sy = Math.sin(y), cy = Math.cos(y), sz = Math.sin(z), cz = Math.cos(z);
    return multiply(multiply(new Float32Array([cz, sz, 0, 0, -sz, cz, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), new Float32Array([cy, 0, -sy, 0, 0, 1, 0, 0, sy, 0, cy, 0, 0, 0, 0, 1])), new Float32Array([1, 0, 0, 0, 0, cx, sx, 0, 0, -sx, cx, 0, 0, 0, 0, 1]));
  }
  function bind(m) {
    gl.bindBuffer(gl.ARRAY_BUFFER, m.buffer);
    gl.enableVertexAttribArray(position);
    gl.enableVertexAttribArray(normal);
    gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 24, 0);
    gl.vertexAttribPointer(normal, 3, gl.FLOAT, false, 24, 12);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, m.indexBuffer);
  }
  function draw(model, color, accent = 0, opacity = 1, m = rib) {
    gl.uniformMatrix4fv(uniforms.uModel, false, model);
    gl.uniform3fv(uniforms.uColor, color);
    gl.uniform1f(uniforms.uAccent, accent);
    gl.uniform1f(uniforms.uOpacity, opacity);
    gl.drawElements(gl.TRIANGLES, m.count, gl.UNSIGNED_SHORT, 0);
  }
  const smooth = (a, b, t) => { const q = Math.min(1, Math.max(0, (t - a) / (b - a))); return q * q * (3 - 2 * q); };
  let aspect = 1, destroyed = false, lost = false;
  function resize() {
    if (destroyed) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.7);
    const w = Math.max(1, Math.round(rect.width * dpr)), h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    aspect = w / h;
    gl.viewport(0, 0, w, h);
  }
  function render(progress = 0, pointerX = 0, pointerY = 0) {
    if (destroyed || lost) return;
    const p = Math.min(1, Math.max(0, progress));
    const opening = smooth(0.12, 0.48, p) * (1 - smooth(0.62, 0.95, p));
    const ending = smooth(0.62, 0.97, p);
    const px = Math.min(1, Math.max(-1, pointerX)), py = Math.min(1, Math.max(-1, pointerY));
    const distance = (5.95 + opening * 1.2) / Math.min(1, aspect);
    const f = 1 / Math.tan(36 * Math.PI / 360), near = 0.1, far = 40;
    const projection = new Float32Array([f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (far + near) / (near - far), -1, 0, 0, 2 * far * near / (near - far), 0]);
    const view = identity(); view[14] = -distance;
    const root = rotation(0.39 + py * 0.09 + p * 0.28, -0.46 + px * 0.13 + opening * 0.20, -0.28 + p * 0.60);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);
    gl.disable(gl.BLEND);
    gl.useProgram(program);
    gl.uniformMatrix4fv(uniforms.uViewProjection, false, multiply(projection, view));
    gl.uniform3f(uniforms.uEye, 0, 0, distance);
    bind(rib);
    const count = 72;
    for (let i = 0; i < count; i++) {
      const theta = i / count * Math.PI * 2;
      const sector = Math.floor(i / 9), sectorTheta = (sector + 0.5) / 8 * Math.PI * 2;
      const c = Math.cos(theta), s = Math.sin(theta);
      const radius = 1.17 - ending * 0.06;
      const outward = opening * (0.45 + 0.08 * Math.sin(sector * 2.3));
      const depth = opening * (sector % 2 ? 0.46 : -0.37);
      const local = identity();
      const size = 1 + Math.sin(theta * 2 + 0.7) * 0.055;
      // Local plate face follows the tangent of the ring.
      local[0] = c * size; local[1] = s * size; local[2] = 0;
      local[4] = 0; local[5] = 0; local[6] = size;
      local[8] = s; local[9] = -c; local[10] = 0;
      local[12] = c * radius + Math.cos(sectorTheta) * outward;
      local[13] = s * radius + Math.sin(sectorTheta) * outward;
      local[14] = depth;
      const twist = rotation(opening * Math.sin(sectorTheta) * 0.12, opening * Math.cos(sectorTheta) * 0.1, 0);
      const model = multiply(root, multiply(local, twist));
      const accent = i === 49 || i === 50;
      const shade = 0.94 + 0.06 * Math.sin(theta * 3);
      draw(model, accent ? [1.0, 0.17, 0.095] : [0.73 * shade, 0.81 * shade, 0.89 * shade], accent ? 1 : 0);
    }
    const presence = smooth(0.26, 0.72, p);
    if (presence > 0.001) {
      bind(core);
      const scale = 0.43 * presence;
      const model = identity(); model[0] = model[5] = model[10] = scale;
      draw(multiply(root, model), [0.72, 0.79, 0.86], 0, 1, core);
      // A recessed-looking amber status point becomes visible with the protected core.
      const status = identity();
      status[0] = status[5] = status[10] = 0.059 * presence;
      status[12] = -0.07; status[13] = 0.04; status[14] = scale * 0.98;
      draw(multiply(root, status), [1.0, 0.17, 0.095], 1, 1, core);
    }
  }
  function onContextLost(event) {
    event.preventDefault();
    lost = true;
    canvas.dataset.sculptureUnavailable = 'true';
    canvas.closest('.sculpture-wrap')?.classList.remove('ready');
  }
  canvas.addEventListener('webglcontextlost', onContextLost);
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    canvas.removeEventListener('webglcontextlost', onContextLost);
    meshes.forEach(m => { gl.deleteBuffer(m.buffer); gl.deleteBuffer(m.indexBuffer); });
    gl.deleteProgram(program);
  }
  resize();
  return { render, resize, destroy };
}
