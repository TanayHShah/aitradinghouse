// Advanced Three.js hero scene — interactive 3D insulation pipes, particles, heat flow
(() => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    canvas.style.background =
      'radial-gradient(circle at 15% 0%, rgba(31,111,235,0.25), rgba(6,12,26,0.6) 55%, #060c1a 90%)';
    return;
  }

  if (typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060c1a, 0.028);

  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 0, 18);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x060c1a, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;

  // ---------- Lighting ----------
  scene.add(new THREE.AmbientLight(0x4a6fa5, 0.5));

  const keyLight = new THREE.DirectionalLight(0x4d9fff, 1.4);
  keyLight.position.set(6, 10, 14);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x22d3ee, 0.9);
  rimLight.position.set(-8, -4, -10);
  scene.add(rimLight);

  const accentLight = new THREE.PointLight(0x1f6feb, 1.2, 30);
  accentLight.position.set(0, 2, 6);
  scene.add(accentLight);

  // ---------- Main group ----------
  const group = new THREE.Group();
  scene.add(group);

  // ---------- Insulation pipe cluster ----------
  const pipeMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a4a8a,
    metalness: 0.9,
    roughness: 0.15,
    emissive: 0x0a2a55,
    emissiveIntensity: 0.4,
  });

  const jacketMaterial = new THREE.MeshStandardMaterial({
    color: 0x9aa8c4,
    metalness: 0.7,
    roughness: 0.3,
  });

  // Main horizontal pipe
  const mainPipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.45, 0.45, 22, 48, 1, true),
    pipeMaterial
  );
  mainPipe.rotation.z = Math.PI / 2;
  group.add(mainPipe);

  // Insulation jacket around main pipe
  const jacket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.72, 0.72, 22, 48, 1, true),
    new THREE.MeshStandardMaterial({
      color: 0x3a5a8a,
      metalness: 0.4,
      roughness: 0.6,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    })
  );
  jacket.rotation.z = Math.PI / 2;
  group.add(jacket);

  // Vertical branch pipes
  const branchGeom = new THREE.CylinderGeometry(0.3, 0.3, 8, 32, 1, true);
  const branch1 = new THREE.Mesh(branchGeom, pipeMaterial);
  branch1.position.set(-3, 2.5, 0.5);
  group.add(branch1);

  const branch2 = new THREE.Mesh(branchGeom, pipeMaterial);
  branch2.position.set(3.5, -2.5, -0.3);
  group.add(branch2);

  // Elbow connectors
  const elbowGeom = new THREE.TorusGeometry(0.45, 0.12, 16, 32, Math.PI / 2);
  const elbow1 = new THREE.Mesh(elbowGeom, jacketMaterial);
  elbow1.position.set(-3, 1.5, 0.5);
  elbow1.rotation.y = Math.PI / 2;
  group.add(elbow1);

  const elbow2 = new THREE.Mesh(elbowGeom, jacketMaterial);
  elbow2.position.set(3.5, -1.5, -0.3);
  elbow2.rotation.y = -Math.PI / 2;
  group.add(elbow2);

  // ---------- Insulation slab ----------
  const slab = new THREE.Mesh(
    new THREE.BoxGeometry(14, 0.3, 5),
    new THREE.MeshStandardMaterial({
      color: 0x2a3a5a,
      roughness: 0.7,
      metalness: 0.2,
    })
  );
  slab.position.set(0, -3.5, -2);
  group.add(slab);

  // Glowing energy strip on slab
  const strip = new THREE.Mesh(
    new THREE.BoxGeometry(14.4, 0.04, 0.8),
    new THREE.MeshBasicMaterial({
      color: 0x22d3ee,
      transparent: true,
      opacity: 0.6,
    })
  );
  strip.position.set(0, -3.1, -1.5);
  group.add(strip);

  // ---------- Heat flow tube (animated path) ----------
  const heatCurve = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(-10, -0.5, 0.5),
      new THREE.Vector3(-6, 0.3, 0.8),
      new THREE.Vector3(-2, 0.8, 0.3),
      new THREE.Vector3(2, 0.4, -0.2),
      new THREE.Vector3(6, -0.3, 0.4),
      new THREE.Vector3(10, -0.8, 0.2),
    ],
    false,
    'catmullrom',
    0.5
  );
  const heatTube = new THREE.Mesh(
    new THREE.TubeGeometry(heatCurve, 160, 0.09, 20, false),
    new THREE.MeshBasicMaterial({
      color: 0x4d9fff,
      transparent: true,
      opacity: 0.8,
    })
  );
  group.add(heatTube);

  // ---------- Glowing torus knot (signature element) ----------
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.4, 0.22, 180, 24),
    new THREE.MeshPhysicalMaterial({
      color: 0x1f6feb,
      roughness: 0.1,
      metalness: 0.9,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      emissive: 0x0a3a8a,
      emissiveIntensity: 0.6,
    })
  );
  knot.position.set(5, 2, 1);
  scene.add(knot);

  // ---------- Particle field ----------
  const particleCount = 1600;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const speeds = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 30;
    positions[i3 + 1] = (Math.random() - 0.5) * 18;
    positions[i3 + 2] = (Math.random() - 0.5) * 20;

    const mix = Math.random();
    const c = new THREE.Color(0x1f6feb).lerp(new THREE.Color(0x22d3ee), mix);
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;

    sizes[i] = Math.random() * 0.12 + 0.04;
    speeds[i] = Math.random() * 0.5 + 0.3;
  }

  const particleGeom = new THREE.BufferGeometry();
  particleGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particleSystem = new THREE.Points(particleGeom, particleMaterial);
  scene.add(particleSystem);

  // ---------- Floating geometric shapes ----------
  const floaters = [];
  const floaterShapes = [
    new THREE.IcosahedronGeometry(0.4, 0),
    new THREE.OctahedronGeometry(0.45, 0),
    new THREE.TetrahedronGeometry(0.5, 0),
  ];

  for (let i = 0; i < 8; i++) {
    const geom = floaterShapes[i % floaterShapes.length];
    const mat = new THREE.MeshStandardMaterial({
      color: i % 2 === 0 ? 0x1f6feb : 0x22d3ee,
      metalness: 0.8,
      roughness: 0.2,
      emissive: i % 2 === 0 ? 0x0a2a55 : 0x0a4a55,
      emissiveIntensity: 0.5,
      wireframe: i % 3 === 0,
    });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 16,
      (Math.random() - 0.5) * 10,
      (Math.random() - 0.5) * 8 - 2
    );
    mesh.userData = {
      rotSpeed: { x: Math.random() * 0.5, y: Math.random() * 0.5, z: Math.random() * 0.3 },
      floatOffset: Math.random() * Math.PI * 2,
      floatSpeed: Math.random() * 0.5 + 0.3,
      baseY: mesh.position.y,
    };
    scene.add(mesh);
    floaters.push(mesh);
  }

  // ---------- Mouse interaction ----------
  const pointer = new THREE.Vector2(0, 0);
  const targetRotation = new THREE.Euler(0, 0, 0);
  let scrollY = 0;

  function onPointerMove(x, y) {
    pointer.set((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1);
    targetRotation.x = pointer.y * 0.15;
    targetRotation.y = pointer.x * 0.2;
  }

  window.addEventListener('pointermove', (e) => onPointerMove(e.clientX, e.clientY));
  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  // ---------- Animation loop ----------
  let lastTime = performance.now();
  const posAttr = particleGeom.getAttribute('position');

  function animate(now) {
    const delta = Math.min((now - lastTime) / 1000, 0.05);
    lastTime = now;
    const t = now * 0.001;

    // Smooth group rotation toward pointer
    group.rotation.y += (targetRotation.y - group.rotation.y) * 2.5 * delta;
    group.rotation.x += (targetRotation.x - group.rotation.x) * 2.5 * delta;

    // Parallax based on scroll
    group.position.y = scrollY * 0.002;

    // Knot rotation + float
    knot.rotation.x += 0.4 * delta;
    knot.rotation.y += 0.55 * delta;
    knot.position.y = 2 + Math.sin(t * 1.8) * 0.3;
    knot.position.x = 5 + Math.cos(t * 0.7) * 0.4;

    // Pulsing heat tube
    heatTube.material.opacity = 0.7 + Math.sin(t * 2.5) * 0.2;

    // Pulsing strip
    strip.material.opacity = 0.5 + Math.sin(t * 3) * 0.25;

    // Accent light orbit
    accentLight.position.x = Math.cos(t * 0.5) * 8;
    accentLight.position.y = Math.sin(t * 0.4) * 4 + 2;

    // Floaters
    for (const f of floaters) {
      f.rotation.x += f.userData.rotSpeed.x * delta;
      f.rotation.y += f.userData.rotSpeed.y * delta;
      f.rotation.z += f.userData.rotSpeed.z * delta;
      f.position.y = f.userData.baseY + Math.sin(t * f.userData.floatSpeed + f.userData.floatOffset) * 0.6;
    }

    // Particle drift
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      posAttr.array[i3 + 1] += speeds[i] * delta * 0.8;
      if (posAttr.array[i3 + 1] > 9) {
        posAttr.array[i3 + 1] = -9;
        posAttr.array[i3] = (Math.random() - 0.5) * 30;
      }
    }
    posAttr.needsUpdate = true;

    // Subtle camera breathing
    camera.position.z = 18 + Math.sin(t * 0.3) * 0.5;

    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
})();
