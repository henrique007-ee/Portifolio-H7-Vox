import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface EquipmentCanvasProps {
  className?: string;
}

export const EquipmentCanvas: React.FC<EquipmentCanvasProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const scene = new THREE.Scene();

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 0, 14.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    const canvasEl = renderer.domElement;
    const handleContextLost = (e: Event) => {
      e.preventDefault();
    };
    canvasEl.addEventListener('webglcontextlost', handleContextLost, false);

    // Studio Three-Point + Neon Green Rim Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.3);
    keyLight.position.set(6, 9, 8);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x08cc07, 2.9);
    rimLight.position.set(-7, -3, 6);
    scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xdbeafe, 1.35, 26);
    fillLight.position.set(6, -5, 7);
    scene.add(fillLight);

    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };

    // Shared Materials
    const titaniumMaterial = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x24272c,
        metalness: 0.9,
        roughness: 0.22,
      })
    );
    const camBodyMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x131519,
        metalness: 0.86,
        roughness: 0.24,
      })
    );
    const camDarkMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0a0b0e,
        metalness: 0.65,
        roughness: 0.36,
      })
    );
    const bezelMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x3b3f47,
        metalness: 0.92,
        roughness: 0.18,
      })
    );
    const lensGlassMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x040507,
        metalness: 0.94,
        roughness: 0.04,
      })
    );
    const coatingMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x08cc07,
        transparent: true,
        opacity: 0.58,
      })
    );
    const greenEmissiveMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x08cc07,
        emissive: 0x08cc07,
        emissiveIntensity: 0.95,
        metalness: 0.35,
        roughness: 0.18,
      })
    );
    const wireGreenMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x08cc07,
        wireframe: true,
        transparent: true,
        opacity: 0.36,
      })
    );

    const createRoundedRectShape = (w: number, h: number, r: number) => {
      const s = new THREE.Shape();
      s.moveTo(-w / 2 + r, -h / 2);
      s.lineTo(w / 2 - r, -h / 2);
      s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      s.lineTo(w / 2, h / 2 - r);
      s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      s.lineTo(-w / 2 + r, h / 2);
      s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      s.lineTo(-w / 2, -h / 2 + r);
      s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      return s;
    };

    // ========================================================
    // 1. BASTÃO DE LED AUDIOVISUAL (Clean Cylindrical Neon Tube Wand, Upper-Left)
    // ========================================================
    const ledTubeGroup = new THREE.Group();

    const tubeRadius = 0.155;
    const diffuserLength = 4.35;

    // Luminous Neon Green Diffuser Cylinder (Crisp silhouette, zero dark backing)
    const diffuserGeom = trackGeo(
      new THREE.CylinderGeometry(tubeRadius, tubeRadius, diffuserLength, 36)
    );
    const diffuserMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x08cc07,
        emissive: 0x08cc07,
        emissiveIntensity: 1.55,
        roughness: 0.12,
        metalness: 0.05,
      })
    );
    const diffuserMesh = new THREE.Mesh(diffuserGeom, diffuserMat);
    diffuserMesh.position.y = 0.55;
    ledTubeGroup.add(diffuserMesh);

    // Top Metallic Collar & Anodized Black End Cap (Seamless axial alignment)
    const collarGeom = trackGeo(
      new THREE.CylinderGeometry(tubeRadius * 1.04, tubeRadius * 1.04, 0.08, 36)
    );
    const topCollar = new THREE.Mesh(collarGeom, bezelMat);
    topCollar.position.y = 0.55 + diffuserLength / 2 + 0.04;
    ledTubeGroup.add(topCollar);

    const topCapGeom = trackGeo(
      new THREE.CylinderGeometry(tubeRadius * 1.03, tubeRadius * 1.04, 0.24, 36)
    );
    const topCap = new THREE.Mesh(topCapGeom, camBodyMat);
    topCap.position.y = 0.55 + diffuserLength / 2 + 0.2;
    ledTubeGroup.add(topCap);

    // Bottom Metallic Collar & Ergonomic Black Grip Handle (Seamless axial alignment)
    const botCollar = new THREE.Mesh(collarGeom, bezelMat);
    botCollar.position.y = 0.55 - diffuserLength / 2 - 0.04;
    ledTubeGroup.add(botCollar);

    const handleLength = 1.35;
    const handleGeom = trackGeo(
      new THREE.CylinderGeometry(tubeRadius * 1.03, tubeRadius * 0.98, handleLength, 36)
    );
    const handleMesh = new THREE.Mesh(handleGeom, camBodyMat);
    handleMesh.position.y = 0.55 - diffuserLength / 2 - 0.08 - handleLength / 2;
    ledTubeGroup.add(handleMesh);

    const pommelGeom = trackGeo(
      new THREE.CylinderGeometry(tubeRadius * 1.02, tubeRadius * 0.92, 0.12, 36)
    );
    const pommelMesh = new THREE.Mesh(pommelGeom, bezelMat);
    pommelMesh.position.y = 0.55 - diffuserLength / 2 - 0.08 - handleLength - 0.06;
    ledTubeGroup.add(pommelMesh);

    // Natural Scene PointLight emitted by the LED Tube
    const tubeLight = new THREE.PointLight(0x08cc07, 2.2, 14);
    tubeLight.position.set(0.3, 0.55, 0.8);
    ledTubeGroup.add(tubeLight);

    ledTubeGroup.position.set(-6.15, 1.55, -0.7);
    ledTubeGroup.rotation.set(0.14, 0.22, -0.44);
    scene.add(ledTubeGroup);

    // ========================================================
    // 2. CÂMERA DE CINEMA PROFISSIONAL 3D (Lower-Left Foreground)
    // ========================================================
    const cinemaCamGroup = new THREE.Group();

    const camBrainGeom = trackGeo(new THREE.BoxGeometry(1.18, 1.1, 1.5));
    const camBrainMesh = new THREE.Mesh(camBrainGeom, camBodyMat);
    cinemaCamGroup.add(camBrainMesh);

    // Top Handle & Rails
    const topRailGeom = trackGeo(new THREE.BoxGeometry(0.24, 0.16, 1.28));
    const topRailMesh = new THREE.Mesh(topRailGeom, bezelMat);
    topRailMesh.position.set(0, 0.74, 0.05);
    cinemaCamGroup.add(topRailMesh);

    const riserGeom = trackGeo(new THREE.CylinderGeometry(0.06, 0.06, 0.28, 14));
    const riserFront = new THREE.Mesh(riserGeom, bezelMat);
    riserFront.position.set(0, 0.58, 0.44);
    cinemaCamGroup.add(riserFront);
    const riserBack = new THREE.Mesh(riserGeom, bezelMat);
    riserBack.position.set(0, 0.58, -0.34);
    cinemaCamGroup.add(riserBack);

    // Side Monitor & Green Status Accent
    const sidePlateGeom = trackGeo(new THREE.BoxGeometry(0.05, 0.65, 0.85));
    const sidePlate = new THREE.Mesh(sidePlateGeom, bezelMat);
    sidePlate.position.set(0.61, 0, 0);
    cinemaCamGroup.add(sidePlate);

    // Cinema Prime Lens Barrel + Follow Focus Gear Ring
    const cineLensGeom = trackGeo(new THREE.CylinderGeometry(0.45, 0.47, 1.05, 32));
    cineLensGeom.rotateX(Math.PI / 2);
    const cineLensMesh = new THREE.Mesh(cineLensGeom, camDarkMat);
    cineLensMesh.position.z = 1.14;
    cinemaCamGroup.add(cineLensMesh);

    const focusRingGeom = trackGeo(new THREE.TorusGeometry(0.48, 0.036, 14, 36));
    const focusRingMesh = new THREE.Mesh(focusRingGeom, greenEmissiveMat);
    focusRingMesh.position.z = 1.08;
    cinemaCamGroup.add(focusRingMesh);

    // Cinema Matte Box Hood
    const matteBoxGeom = trackGeo(new THREE.BoxGeometry(1.28, 0.98, 0.34));
    const matteBoxMesh = new THREE.Mesh(matteBoxGeom, camDarkMat);
    matteBoxMesh.position.z = 1.7;
    cinemaCamGroup.add(matteBoxMesh);

    const matteRimGeom = trackGeo(new THREE.BoxGeometry(1.31, 1.01, 0.04));
    const matteRimMesh = new THREE.Mesh(matteRimGeom, wireGreenMat);
    matteRimMesh.position.z = 1.86;
    cinemaCamGroup.add(matteRimMesh);

    // Multi-Coated Green Cinema Front Lens Element
    const cineGlassGeom = trackGeo(new THREE.CircleGeometry(0.39, 28));
    const cineGlassMesh = new THREE.Mesh(cineGlassGeom, lensGlassMat);
    cineGlassMesh.position.z = 1.68;
    cinemaCamGroup.add(cineGlassMesh);

    const cineGlintGeom = trackGeo(new THREE.RingGeometry(0.15, 0.29, 28));
    const cineGlintMesh = new THREE.Mesh(cineGlintGeom, coatingMat);
    cineGlintMesh.position.z = 1.69;
    cinemaCamGroup.add(cineGlintMesh);

    cinemaCamGroup.position.set(-5.15, -2.05, 0.15);
    cinemaCamGroup.rotation.set(0.16, 0.62, -0.08);
    cinemaCamGroup.scale.set(0.84, 0.84, 0.84);
    scene.add(cinemaCamGroup);

    // ========================================================
    // 3. DRONE CINEMATOGRÁFICO 3D (Upper-Right Midground)
    // ========================================================
    const droneGroup = new THREE.Group();
    const droneRotors: THREE.Mesh[] = [];

    const droneBodyGeom = trackGeo(new THREE.BoxGeometry(1.25, 0.34, 1.8));
    const droneBody = new THREE.Mesh(droneBodyGeom, camBodyMat);
    droneGroup.add(droneBody);

    const droneCanopyGeom = trackGeo(new THREE.BoxGeometry(0.95, 0.2, 1.32));
    const droneCanopy = new THREE.Mesh(droneCanopyGeom, camDarkMat);
    droneCanopy.position.y = 0.24;
    droneGroup.add(droneCanopy);

    const droneLedGeom = trackGeo(new THREE.BoxGeometry(0.68, 0.04, 0.08));
    const droneLed = new THREE.Mesh(droneLedGeom, greenEmissiveMat);
    droneLed.position.set(0, 0.35, 0.6);
    droneGroup.add(droneLed);

    const armGeom = trackGeo(new THREE.CylinderGeometry(0.065, 0.08, 1.55, 16));
    armGeom.rotateZ(Math.PI / 2);
    const motorGeom = trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 0.24, 20));
    const bladeGeom = trackGeo(new THREE.BoxGeometry(1.35, 0.02, 0.12));
    const rotorRingGeom = trackGeo(new THREE.RingGeometry(0.58, 0.68, 28));
    rotorRingGeom.rotateX(Math.PI / 2);
    const rotorRingMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x08cc07,
        transparent: true,
        opacity: 0.22,
        side: THREE.DoubleSide,
      })
    );

    const armCoords = [
      { x: -1.12, z: 0.96, angle: -0.62 },
      { x: 1.12, z: 0.96, angle: 0.62 },
      { x: -1.12, z: -0.96, angle: 0.62 },
      { x: 1.12, z: -0.96, angle: -0.62 },
    ];

    armCoords.forEach((cfg) => {
      const arm = new THREE.Mesh(armGeom, camDarkMat);
      arm.position.set(cfg.x * 0.55, 0.04, cfg.z * 0.55);
      arm.rotation.y = cfg.angle;
      droneGroup.add(arm);

      const motor = new THREE.Mesh(motorGeom, bezelMat);
      motor.position.set(cfg.x, 0.14, cfg.z);
      droneGroup.add(motor);

      const strobeGeom = trackGeo(new THREE.SphereGeometry(0.055, 12, 12));
      const strobe = new THREE.Mesh(strobeGeom, greenEmissiveMat);
      strobe.position.set(cfg.x, -0.02, cfg.z);
      droneGroup.add(strobe);

      const blade = new THREE.Mesh(bladeGeom, titaniumMaterial);
      blade.position.set(cfg.x, 0.29, cfg.z);
      droneGroup.add(blade);
      droneRotors.push(blade);

      const ring = new THREE.Mesh(rotorRingGeom, rotorRingMat);
      ring.position.set(cfg.x, 0.28, cfg.z);
      droneGroup.add(ring);
    });

    // Gimbal Camera under Drone
    const gimbalHousingGeom = trackGeo(new THREE.BoxGeometry(0.42, 0.38, 0.48));
    const gimbalHousing = new THREE.Mesh(gimbalHousingGeom, camBodyMat);
    gimbalHousing.position.set(0, -0.36, 0.66);
    droneGroup.add(gimbalHousing);

    const gimbalLensGeom = trackGeo(new THREE.CylinderGeometry(0.16, 0.16, 0.24, 24));
    gimbalLensGeom.rotateX(Math.PI / 2);
    const gimbalLens = new THREE.Mesh(gimbalLensGeom, bezelMat);
    gimbalLens.position.set(0, -0.36, 0.94);
    droneGroup.add(gimbalLens);

    const gimbalGlassGeom = trackGeo(new THREE.CircleGeometry(0.12, 20));
    const gimbalGlass = new THREE.Mesh(gimbalGlassGeom, greenEmissiveMat);
    gimbalGlass.position.set(0, -0.36, 1.07);
    droneGroup.add(gimbalGlass);

    droneGroup.position.set(5.45, 2.15, -1.1);
    droneGroup.rotation.set(0.32, -0.58, 0.12);
    droneGroup.scale.set(0.82, 0.82, 0.82);
    scene.add(droneGroup);

    // ========================================================
    // 4. IPHONE 15 PRO MAX (Lower-Right Foreground)
    // ========================================================
    const iphoneGroup = new THREE.Group();

    const phoneWidth = 2.36;
    const phoneHeight = 4.78;
    const phoneDepth = 0.24;
    const cornerRadius = 0.36;

    const phoneShape = createRoundedRectShape(phoneWidth, phoneHeight, cornerRadius);
    const phoneGeometry = trackGeo(
      new THREE.ExtrudeGeometry(phoneShape, {
        depth: phoneDepth,
        bevelEnabled: true,
        bevelSegments: 5,
        steps: 1,
        bevelSize: 0.045,
        bevelThickness: 0.045,
      })
    );
    phoneGeometry.center();

    const phoneBody = new THREE.Mesh(phoneGeometry, titaniumMaterial);
    iphoneGroup.add(phoneBody);

    // Camera Island (Frosted Plateau)
    const islandSize = 1.34;
    const islandShape = createRoundedRectShape(islandSize, islandSize, 0.26);
    const islandGeom = trackGeo(
      new THREE.ExtrudeGeometry(islandShape, {
        depth: 0.1,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.02,
        bevelThickness: 0.02,
      })
    );
    islandGeom.center();
    const islandMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x1c1e24,
        metalness: 0.74,
        roughness: 0.24,
      })
    );
    const islandMesh = new THREE.Mesh(islandGeom, islandMat);
    const islandX = 0.4;
    const islandY = phoneHeight / 2 - 1.02;
    islandMesh.position.set(islandX, islandY, -phoneDepth / 2 - 0.05);
    iphoneGroup.add(islandMesh);

    const lensCoords = [
      [islandX + 0.28, islandY + 0.3],
      [islandX + 0.28, islandY - 0.3],
      [islandX - 0.26, islandY],
    ];

    const ringGeom = trackGeo(new THREE.CylinderGeometry(0.24, 0.24, 0.15, 28));
    ringGeom.rotateX(Math.PI / 2);
    const pupilGeom = trackGeo(new THREE.CylinderGeometry(0.18, 0.18, 0.16, 28));
    pupilGeom.rotateX(Math.PI / 2);
    const coatingGeom = trackGeo(new THREE.RingGeometry(0.06, 0.11, 24));

    lensCoords.forEach(([lx, ly]) => {
      const ringMesh = new THREE.Mesh(ringGeom, bezelMat);
      ringMesh.position.set(lx, ly, -phoneDepth / 2 - 0.14);
      iphoneGroup.add(ringMesh);

      const pupilMesh = new THREE.Mesh(pupilGeom, lensGlassMat);
      pupilMesh.position.set(lx, ly, -phoneDepth / 2 - 0.155);
      iphoneGroup.add(pupilMesh);

      const glintMesh = new THREE.Mesh(coatingGeom, coatingMat);
      glintMesh.position.set(lx, ly, -phoneDepth / 2 - 0.238);
      glintMesh.rotation.y = Math.PI;
      iphoneGroup.add(glintMesh);
    });

    iphoneGroup.position.set(5.45, -1.65, -0.2);
    iphoneGroup.rotation.set(0.22, -2.38, 0.14);
    iphoneGroup.scale.set(0.84, 0.84, 0.84);
    scene.add(iphoneGroup);

    // ========================================================
    // 5. ESFERA WIREFRAME 3D + ANEL ORBITAL + TRIÂNGULOS (Deep Background)
    // ========================================================
    const wireSphereGroup = new THREE.Group();
    const wireSphereGeom = trackGeo(new THREE.SphereGeometry(0.95, 16, 12));
    const wireSphereMesh = new THREE.Mesh(wireSphereGeom, wireGreenMat);
    wireSphereGroup.add(wireSphereMesh);

    const orbitRingGeom = trackGeo(new THREE.TorusGeometry(1.42, 0.02, 12, 48));
    orbitRingGeom.rotateX(1.12);
    const orbitRingMesh = new THREE.Mesh(orbitRingGeom, greenEmissiveMat);
    wireSphereGroup.add(orbitRingMesh);

    const triSatGeom = trackGeo(new THREE.TetrahedronGeometry(0.16, 0));
    const triSat1 = new THREE.Mesh(triSatGeom, greenEmissiveMat);
    triSat1.position.set(1.45, 0.25, 0);
    wireSphereGroup.add(triSat1);

    const triSat2 = new THREE.Mesh(triSatGeom, bezelMat);
    triSat2.position.set(-1.42, -0.28, 0.3);
    wireSphereGroup.add(triSat2);

    wireSphereGroup.position.set(3.25, 3.1, -3.5);
    scene.add(wireSphereGroup);

    // ========================================================
    // 6. NÚMERO "7" EM 3D & PRISMA 3D (Deep Perspective Accents, Never Overlapping LED Tube)
    // ========================================================
    const number7Group = new THREE.Group();
    const sevenShape = new THREE.Shape();
    sevenShape.moveTo(-0.52, 0.72);
    sevenShape.lineTo(0.52, 0.72);
    sevenShape.lineTo(0.52, 0.4);
    sevenShape.lineTo(-0.04, -0.75);
    sevenShape.lineTo(-0.4, -0.75);
    sevenShape.lineTo(0.15, 0.4);
    sevenShape.lineTo(-0.52, 0.4);
    sevenShape.closePath();

    const sevenGeom = trackGeo(
      new THREE.ExtrudeGeometry(sevenShape, {
        depth: 0.24,
        bevelEnabled: true,
        bevelSegments: 3,
        bevelSize: 0.03,
        bevelThickness: 0.03,
      })
    );
    sevenGeom.center();
    const sevenMesh = new THREE.Mesh(sevenGeom, camBodyMat);
    number7Group.add(sevenMesh);

    const sevenRingGeom = trackGeo(new THREE.TorusGeometry(0.95, 0.018, 10, 40));
    sevenRingGeom.rotateX(0.95);
    const sevenRingMesh = new THREE.Mesh(sevenRingGeom, greenEmissiveMat);
    number7Group.add(sevenRingMesh);

    // Placed on deep upper-left inner margin, well away from the LED Tube
    number7Group.position.set(-3.15, 3.25, -3.6);
    number7Group.rotation.set(0.15, 0.42, -0.08);
    scene.add(number7Group);

    // 3D Prism with Green Reflections in Deep Lower-Left
    const prismGroup = new THREE.Group();
    const prismGeom = trackGeo(new THREE.CylinderGeometry(0.65, 0.85, 1.45, 3));
    const prismMesh = new THREE.Mesh(prismGeom, camBodyMat);
    prismGroup.add(prismMesh);
    const prismWireGeom = trackGeo(new THREE.CylinderGeometry(0.69, 0.89, 1.49, 3));
    const prismWire = new THREE.Mesh(prismWireGeom, wireGreenMat);
    prismGroup.add(prismWire);
    prismGroup.position.set(3.1, -3.25, -3.5);
    scene.add(prismGroup);

    // ========================================================
    // INTERACTIVE MOUSE PARALLAX & RESPONSIVE LAYOUT
    // ========================================================
    let baseIphoneX = 5.45;
    let baseIphoneY = -1.65;
    let baseCamX = -5.15;
    let baseCamY = -2.05;
    let baseTubeX = -6.15;
    let baseTubeY = 1.55;
    let baseDroneX = 5.45;
    let baseDroneY = 2.15;
    let isMobileViewport = false;
    let isCanvasVisible = true;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isCanvasVisible = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    visibilityObserver.observe(container);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (isMobileViewport || prefersReducedMotion) return;
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleResize = () => {
      if (!container) return;
      const curW = container.clientWidth || window.innerWidth;
      const curH = container.clientHeight || window.innerHeight;
      camera.aspect = curW / curH;
      camera.updateProjectionMatrix();
      renderer.setSize(curW, curH);

      const dist = camera.position.z - -0.7;
      const vFovRad = (camera.fov * Math.PI) / 180;
      const visibleHalfH = Math.tan(vFovRad / 2) * dist;
      const visibleHalfW = visibleHalfH * camera.aspect;

      isMobileViewport = curW < 768;

      if (curW < 768) {
        const mobileScale = curW < 380 ? 0.36 : 0.42;
        const mEdgeX = Math.max(1.25, Math.min(1.85, visibleHalfW * 0.68));

        ledTubeGroup.scale.set(mobileScale, mobileScale, mobileScale);
        baseTubeX = -mEdgeX;
        baseTubeY = 3.65;
        ledTubeGroup.position.set(baseTubeX, baseTubeY, -2.0);

        droneGroup.visible = true;
        droneGroup.scale.set(mobileScale * 0.92, mobileScale * 0.92, mobileScale * 0.92);
        baseDroneX = mEdgeX;
        baseDroneY = 3.6;
        droneGroup.position.set(baseDroneX, baseDroneY, -2.2);

        iphoneGroup.scale.set(mobileScale, mobileScale, mobileScale);
        baseIphoneX = mEdgeX;
        baseIphoneY = -3.85;
        iphoneGroup.position.set(baseIphoneX, baseIphoneY, -1.5);

        cinemaCamGroup.visible = curW >= 350;
        cinemaCamGroup.scale.set(mobileScale * 0.88, mobileScale * 0.88, mobileScale * 0.88);
        baseCamX = -mEdgeX;
        baseCamY = -3.95;
        cinemaCamGroup.position.set(baseCamX, baseCamY, -1.6);

        number7Group.visible = false;
        prismGroup.visible = false;
        wireSphereGroup.visible = false;
      } else if (curW < 1024) {
        cinemaCamGroup.visible = true;
        droneGroup.visible = true;
        number7Group.visible = true;
        prismGroup.visible = true;
        wireSphereGroup.visible = true;

        const tEdgeX = Math.max(2.6, Math.min(4.2, visibleHalfW * 0.74));

        ledTubeGroup.scale.set(0.7, 0.7, 0.7);
        baseTubeX = -tEdgeX;
        baseTubeY = 1.45;
        ledTubeGroup.position.set(baseTubeX, baseTubeY, -1.0);

        cinemaCamGroup.scale.set(0.62, 0.62, 0.62);
        baseCamX = -(tEdgeX * 0.9);
        baseCamY = -2.1;
        cinemaCamGroup.position.set(baseCamX, baseCamY, -0.5);

        droneGroup.scale.set(0.64, 0.64, 0.64);
        baseDroneX = tEdgeX * 0.94;
        baseDroneY = 2.05;
        droneGroup.position.set(baseDroneX, baseDroneY, -1.2);

        iphoneGroup.scale.set(0.66, 0.66, 0.66);
        baseIphoneX = tEdgeX * 0.95;
        baseIphoneY = -1.75;
        iphoneGroup.position.set(baseIphoneX, baseIphoneY, -0.6);

        wireSphereGroup.scale.set(0.64, 0.64, 0.64);
        wireSphereGroup.position.set(tEdgeX * 0.6, 3.0, -3.5);

        number7Group.scale.set(0.64, 0.64, 0.64);
        number7Group.position.set(-(tEdgeX * 0.6), 3.05, -3.6);

        prismGroup.scale.set(0.62, 0.62, 0.62);
        prismGroup.position.set(tEdgeX * 0.58, -3.1, -3.5);
      } else {
        cinemaCamGroup.visible = true;
        droneGroup.visible = true;
        number7Group.visible = true;
        prismGroup.visible = true;
        wireSphereGroup.visible = true;

        const dEdgeX = Math.max(3.6, Math.min(6.0, visibleHalfW * 0.76));

        ledTubeGroup.scale.set(0.95, 0.95, 0.95);
        baseTubeX = -dEdgeX;
        baseTubeY = 1.55;
        ledTubeGroup.position.set(baseTubeX, baseTubeY, -0.7);

        cinemaCamGroup.scale.set(0.84, 0.84, 0.84);
        baseCamX = -(dEdgeX * 0.85);
        baseCamY = -2.05;
        cinemaCamGroup.position.set(baseCamX, baseCamY, 0.15);

        droneGroup.scale.set(0.84, 0.84, 0.84);
        baseDroneX = dEdgeX * 0.9;
        baseDroneY = 2.15;
        droneGroup.position.set(baseDroneX, baseDroneY, -1.1);

        iphoneGroup.scale.set(0.86, 0.86, 0.86);
        baseIphoneX = dEdgeX * 0.9;
        baseIphoneY = -1.65;
        iphoneGroup.position.set(baseIphoneX, baseIphoneY, -0.2);

        wireSphereGroup.scale.set(0.84, 0.84, 0.84);
        wireSphereGroup.position.set(dEdgeX * 0.55, 3.1, -3.5);

        number7Group.scale.set(0.84, 0.84, 0.84);
        number7Group.position.set(-(dEdgeX * 0.54), 3.25, -3.6);

        prismGroup.scale.set(0.8, 0.8, 0.8);
        prismGroup.position.set(dEdgeX * 0.52, -3.25, -3.5);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (!isCanvasVisible) return;

      if (!prefersReducedMotion) {
        const elapsedTime = clock.getElapsedTime();
        const floatAmp = isMobileViewport ? 0.07 : 0.17;

        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;

        // 1. LED Tube Wand
        ledTubeGroup.position.x = baseTubeX + currentMouseX * 0.15;
        ledTubeGroup.position.y = baseTubeY + Math.sin(elapsedTime * 0.56 + 2.6) * (floatAmp * 0.8) + currentMouseY * 0.14;
        ledTubeGroup.rotation.z = -0.44 + Math.sin(elapsedTime * 0.32) * 0.04;
        tubeLight.intensity = 2.1 + Math.sin(elapsedTime * 1.4) * 0.3;

        // 2. Cinema Camera Rig
        if (cinemaCamGroup.visible) {
          cinemaCamGroup.position.x = baseCamX - currentMouseX * 0.22;
          cinemaCamGroup.position.y = baseCamY + Math.cos(elapsedTime * 0.5 + 0.9) * (floatAmp * 0.85) - currentMouseY * 0.16;
          cinemaCamGroup.rotation.y = 0.62 + Math.sin(elapsedTime * 0.38) * 0.14 + currentMouseX * 0.15;
        }

        // 3. Cinematic Drone + Spinning Rotors
        if (droneGroup.visible) {
          droneGroup.position.x = baseDroneX + currentMouseX * 0.24;
          droneGroup.position.y = baseDroneY + Math.sin(elapsedTime * 0.78 + 1.1) * floatAmp + currentMouseY * 0.18;
          droneGroup.rotation.y = -0.58 + Math.cos(elapsedTime * 0.42) * 0.16 + currentMouseX * 0.16;
          droneGroup.rotation.z = 0.12 + Math.sin(elapsedTime * 0.6) * 0.05;
          droneRotors.forEach((blade, idx) => {
            blade.rotation.y = elapsedTime * (idx % 2 === 0 ? 15 : -15);
          });
        }

        // 4. iPhone 15 Pro Max
        iphoneGroup.rotation.y = -2.38 + Math.sin(elapsedTime * 0.42) * (isMobileViewport ? 0.08 : 0.2) + currentMouseX * 0.18;
        iphoneGroup.rotation.x = 0.22 + Math.cos(elapsedTime * 0.34) * (isMobileViewport ? 0.05 : 0.08) - currentMouseY * 0.12;
        iphoneGroup.position.x = baseIphoneX + currentMouseX * 0.22;
        iphoneGroup.position.y = baseIphoneY + Math.sin(elapsedTime * 0.68) * floatAmp + currentMouseY * 0.18;

        // 5. Wireframe Sphere & Orbital Ring
        if (wireSphereGroup.visible) {
          wireSphereMesh.rotation.y = elapsedTime * 0.26;
          wireSphereMesh.rotation.x = elapsedTime * 0.14;
          orbitRingMesh.rotation.z = -elapsedTime * 0.38;
          wireSphereGroup.position.y = 3.1 + Math.sin(elapsedTime * 0.62) * (floatAmp * 0.65);
        }

        // 6. 3D Number '7' & 3D Prism
        if (number7Group.visible) {
          number7Group.position.y = 3.25 + Math.cos(elapsedTime * 0.54 + 2.1) * (floatAmp * 0.7);
          number7Group.rotation.y = 0.42 + Math.sin(elapsedTime * 0.44) * 0.22 - currentMouseX * 0.14;
          sevenRingMesh.rotation.z = elapsedTime * 0.32;
        }
        if (prismGroup.visible) {
          prismGroup.rotation.y = -elapsedTime * 0.3;
          prismGroup.rotation.x = Math.sin(elapsedTime * 0.4) * 0.18;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      visibilityObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
