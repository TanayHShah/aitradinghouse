// High-motion Three.js hero scene with reduced-motion fallback
(() => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    // Static gradient background for low-motion users
    canvas.style.background =
      'radial-gradient(circle at 10% 0, #d7ecff, #eef5ff 55%, #f6faff 90%)';
    return;
  }

  if (typeof THREE === 'undefined') {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 120);
  camera.position.set(0, 0, 16);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0xffffff, 0);

  scene.fog = new THREE.FogExp2(0xddeeff, 0.03);

  const group = new THREE.Group();
  scene.add(group);

  const pipeMaterial = new THREE.MeshStandardMaterial({
    color: 0x0d5bd7,
    metalness: 0.85,
    roughness: 0.18,
    emissive: 0x00a3ff,
    emissiveIntensity: 0.75,
  });

  const mainPipeGeom = new THREE.CylinderGeometry(0.35, 0.35, 18, 32, 1, true);
  const mainPipe = new THREE.Mesh(mainPipeGeom, pipeMaterial);
  mainPipe.rotation.z = Math.PI / 2;
  group.add(mainPipe);

  const teeGeom = new THREE.CylinderGeometry(0.28, 0.28, 10, 24, 1, true);
  const tee1 = new THREE.Mesh(teeGeom, pipeMaterial);
  tee1.rotation.x = Math.PI / 2;
  tee1.position.set(0, 1.8, 0.2);
  group.add(tee1);

  const tee2 = tee1.clone();
  tee2.position.set(-2.6, -1.6, -0.2);
  group.add(tee2);

  const slabMaterial = new THREE.MeshStandardMaterial({
    color: 0xd7e9ff,
    roughness: 0.28,
    metalness: 0.25,
  });
  const slabGeom = new THREE.BoxGeometry(18, 0.22, 6.5);
  const slab = new THREE.Mesh(slabGeom, slabMaterial);
  slab.position.set(0, -2.8, -1.5);
  group.add(slab);

  const stripGeom = new THREE.BoxGeometry(18.4, 0.02, 0.7);
  const stripMaterial = new THREE.MeshBasicMaterial({
    color: 0x00a3ff,
    transparent: true,
    opacity: 0.35,
  });
  const strip = new THREE.Mesh(stripGeom, stripMaterial);
  strip.position.set(0, -2.4, -1);
  group.add(strip);

  const heatGeom = new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(-9, -0.4, 0.4),
        new THREE.Vector3(-6, 0.2, 0.6),
        new THREE.Vector3(-2, 0.6, 0.2),
        new THREE.Vector3(2, 0.3, -0.1),
        new THREE.Vector3(5.5, -0.2, 0.3),
        new THREE.Vector3(9, -0.6, 0.2),
      ],
      false,
      'catmullrom',
      0.6
    ),
    120,
    0.08,
    16,
    false
  );
  const heatMaterial = new THREE.MeshBasicMaterial({
    color: 0x0d5bd7,
    transparent: true,
    opacity: 0.85,
  });
  const heatTube = new THREE.Mesh(heatGeom, heatMaterial);
  group.add(heatTube);

  const particles = new THREE.BufferGeometry();
  const count = 1200;
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 24;
    positions[i3 + 1] = (Math.random() - 0.5) * 14;
    positions[i3 + 2] = (Math.random() - 0.5) * 16;

    const mix = Math.random();
    const c = new THREE.Color(0x0d5bd7).lerp(new THREE.Color(0x00a3ff), mix);
    colors[i3] = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMaterial = new THREE.PointsMaterial({
    size: 0.085,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.9,
    vertexColors: true,
  });

  const particleSystem = new THREE.Points(particles, particleMaterial);
  scene.add(particleSystem);

  const ambient = new THREE.AmbientLight(0xffffff, 0.75);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0x7cc3ff, 1.2);
  keyLight.position.set(5, 8, 12);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x2f7fff, 0.85);
  rimLight.position.set(-6, -4, -8);
  scene.add(rimLight);

  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.25, 0.18, 140, 18),
    new THREE.MeshPhysicalMaterial({
      color: 0x1e75ff,
      roughness: 0.12,
      metalness: 0.88,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      transmission: 0.05,
      emissive: 0x0b4fd8,
      emissiveIntensity: 0.5,
    })
  );
  knot.position.set(3.8, 1.5, 0.5);
  scene.add(knot);

  const pointer = new THREE.Vector2(0, 0);
  const targetRotation = new THREE.Euler(0, 0, 0);

  function updatePointer(x, y) {
    const nx = (x / window.innerWidth) * 2 - 1;
    const ny = (y / window.innerHeight) * 2 - 1;
    pointer.set(nx, ny);
    targetRotation.x = ny * 0.18;
    targetRotation.y = nx * 0.22;
  }

  window.addEventListener('pointermove', e => updatePointer(e.clientX, e.clientY));

  let lastTime = performance.now();

  function animate(now) {
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    group.rotation.y += (targetRotation.y - group.rotation.y) * 3 * delta;
    group.rotation.x += (targetRotation.x - group.rotation.x) * 3 * delta;
    knot.rotation.x += 0.42 * delta;
    knot.rotation.y += 0.55 * delta;
    knot.position.y = 1.5 + Math.sin(now * 0.0019) * 0.24;

    heatTube.material.opacity = 0.75 + Math.sin(now * 0.003) * 0.15;

    const pos = particles.getAttribute('position');
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos.array[i3 + 1] += 0.06 * delta * (0.8 + Math.random() * 0.6);
      if (pos.array[i3 + 1] > 8) {
        pos.array[i3 + 1] = -8;
      }
    }
    pos.needsUpdate = true;

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

