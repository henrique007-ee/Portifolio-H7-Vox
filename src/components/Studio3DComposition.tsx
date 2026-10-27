import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface Studio3DProps {
  className?: string;
}

export const Studio3DComposition: React.FC<Studio3DProps> = ({ className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setIsSupported(false);
        return;
      }
    } catch {
      setIsSupported(false);
      return;
    }

    const width = container.clientWidth || 480;
    const height = container.clientHeight || 520;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 4.4);

    // Renderer
    const isMobile = window.innerWidth < 768;
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isMobile;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(3, 4, 3);
    keyLight.castShadow = !isMobile;
    scene.add(keyLight);

    const neonRimLight = new THREE.DirectionalLight(0x08cc07, 3.5);
    neonRimLight.position.set(-3, 2, -2);
    scene.add(neonRimLight);

    const warmFill = new THREE.PointLight(0xfff4e0, 1.2, 10);
    warmFill.position.set(2, -2, 2);
    scene.add(warmFill);

    // Master Group containing all 5 audiovisual composition elements
    const masterGroup = new THREE.Group();
    scene.add(masterGroup);

    // -------------------------------------------------------------
    // ELEMENT 1: iPhone 15 Pro Max (Titanium finish, realistic scale)
    // Proportions: ~1.6 height, 0.77 width, 0.08 depth
    // -------------------------------------------------------------
    const phoneGroup = new THREE.Group();
    masterGroup.add(phoneGroup);

    // Chassis (Titanium body)
    const phoneBodyGeo = new THREE.BoxGeometry(0.82, 1.68, 0.08);
    const phoneBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x242426,
      metalness: 0.92,
      roughness: 0.22,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });
    const phoneBody = new THREE.Mesh(phoneBodyGeo, phoneBodyMat);
    phoneBody.castShadow = !isMobile;
    phoneGroup.add(phoneBody);

    // Screen Canvas (Dynamic Audio Visualizer & H7.VOX UI)
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 1024;
    const ctx = screenCanvas.getContext('2d');
    if (ctx) {
      // Screen background
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, 512, 1024);

      // Gradient overlay
      const grad = ctx.createLinearGradient(0, 0, 512, 1024);
      grad.addColorStop(0, '#0c1b0c');
      grad.addColorStop(0.5, '#080808');
      grad.addColorStop(1, '#051205');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 1024);

      // REC Bar top
      ctx.fillStyle = '#ff2b2b';
      ctx.beginPath();
      ctx.arc(60, 90, 10, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 26px monospace';
      ctx.fillText('REC', 82, 98);
      ctx.fillText('4K 60FPS', 330, 98);

      // Dynamic Island Pill
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.roundRect(196, 40, 120, 36, 18);
      ctx.fill();

      // Audio waveform bars
      const barCount = 18;
      const startX = 60;
      const barWidth = 16;
      const gap = 6;
      for (let i = 0; i < barCount; i++) {
        const h = 60 + Math.sin(i * 0.6) * 45 + Math.random() * 30;
        ctx.fillStyle = i % 3 === 0 ? '#08CC07' : '#ffffff';
        ctx.fillRect(startX + i * (barWidth + gap), 580 - h, barWidth, h);
      }

      // Brand text on screen
      ctx.fillStyle = '#08CC07';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('H7.VOX', 180, 680);

      ctx.fillStyle = '#ffffff';
      ctx.font = '24px sans-serif';
      ctx.fillText('PORTFÓLIO AUDIOVISUAL', 110, 725);

      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '20px sans-serif';
      ctx.fillText('ENDSON HENRIQUE', 160, 765);
    }

    const screenTexture = new THREE.CanvasTexture(screenCanvas);
    screenTexture.colorSpace = THREE.SRGBColorSpace;
    const phoneScreenGeo = new THREE.PlaneGeometry(0.76, 1.62);
    const phoneScreenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
    });
    const phoneScreen = new THREE.Mesh(phoneScreenGeo, phoneScreenMat);
    phoneScreen.position.z = 0.042;
    phoneGroup.add(phoneScreen);

    // Rear Camera Module Island
    const cameraIslandGeo = new THREE.BoxGeometry(0.38, 0.4, 0.035);
    const cameraIslandMat = new THREE.MeshPhysicalMaterial({
      color: 0x1a1a1c,
      metalness: 0.85,
      roughness: 0.25,
    });
    const cameraIsland = new THREE.Mesh(cameraIslandGeo, cameraIslandMat);
    cameraIsland.position.set(-0.16, 0.54, -0.045);
    phoneGroup.add(cameraIsland);

    // 3 Lenses on back
    const lensGeo = new THREE.CylinderGeometry(0.065, 0.065, 0.025, 24);
    lensGeo.rotateX(Math.PI / 2);
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: 0x050505,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0,
      transmission: 0.3,
    });
    const lens1 = new THREE.Mesh(lensGeo, lensMat);
    lens1.position.set(-0.21, 0.62, -0.065);
    phoneGroup.add(lens1);

    const lens2 = new THREE.Mesh(lensGeo, lensMat);
    lens2.position.set(-0.21, 0.46, -0.065);
    phoneGroup.add(lens2);

    const lens3 = new THREE.Mesh(lensGeo, lensMat);
    lens3.position.set(-0.09, 0.54, -0.065);
    phoneGroup.add(lens3);

    // -------------------------------------------------------------
    // ELEMENT 2: Hollyland Lark M2 Wireless Mic (Audio reference)
    // Small circular button transmitter with green LED ring
    // -------------------------------------------------------------
    const micGroup = new THREE.Group();
    micGroup.position.set(0.72, -0.55, 0.35);
    masterGroup.add(micGroup);

    const micBodyGeo = new THREE.CylinderGeometry(0.16, 0.16, 0.06, 32);
    const micBodyMat = new THREE.MeshPhysicalMaterial({
      color: 0x151515,
      metalness: 0.85,
      roughness: 0.35,
    });
    const micBody = new THREE.Mesh(micBodyGeo, micBodyMat);
    micBody.rotation.x = Math.PI / 2;
    micGroup.add(micBody);

    // Front acoustic mesh
    const meshGeo = new THREE.CircleGeometry(0.12, 24);
    const meshMat = new THREE.MeshStandardMaterial({
      color: 0x282828,
      roughness: 0.8,
      metalness: 0.5,
    });
    const micMesh = new THREE.Mesh(meshGeo, meshMat);
    micMesh.position.z = 0.032;
    micGroup.add(micMesh);

    // Hollyland Green Ring LED Status
    const ledRingGeo = new THREE.RingGeometry(0.125, 0.145, 32);
    const ledRingMat = new THREE.MeshBasicMaterial({
      color: 0x08cc07,
      side: THREE.DoubleSide,
    });
    const ledRing = new THREE.Mesh(ledRingGeo, ledRingMat);
    ledRing.position.z = 0.033;
    micGroup.add(ledRing);

    // Rear clip
    const clipGeo = new THREE.BoxGeometry(0.08, 0.18, 0.02);
    const clipMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 });
    const clip = new THREE.Mesh(clipGeo, clipMat);
    clip.position.set(0, 0, -0.04);
    micGroup.add(clip);

    // -------------------------------------------------------------
    // ELEMENT 3: RGB Cinema LED Light Wand (Lighting reference)
    // Long cylinder stick glowing neon green and clean warm light
    // -------------------------------------------------------------
    const lightWandGroup = new THREE.Group();
    lightWandGroup.position.set(-0.78, 0.1, -0.2);
    lightWandGroup.rotation.z = Math.PI / 12;
    lightWandGroup.rotation.y = Math.PI / 8;
    masterGroup.add(lightWandGroup);

    // Wand handle
    const wandHandleGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.45, 20);
    const wandHandleMat = new THREE.MeshStandardMaterial({
      color: 0x1f1f1f,
      roughness: 0.5,
      metalness: 0.7,
    });
    const wandHandle = new THREE.Mesh(wandHandleGeo, wandHandleMat);
    wandHandle.position.y = -0.7;
    lightWandGroup.add(wandHandle);

    // Luminous tube
    const wandTubeGeo = new THREE.CylinderGeometry(0.042, 0.042, 1.15, 32);
    const wandTubeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x08cc07,
      emissiveIntensity: 1.8,
      roughness: 0.2,
      metalness: 0.1,
    });
    const wandTube = new THREE.Mesh(wandTubeGeo, wandTubeMat);
    wandTube.position.y = 0.1;
    lightWandGroup.add(wandTube);

    // End caps
    const capGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.05, 20);
    const capMat = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const capTop = new THREE.Mesh(capGeo, capMat);
    capTop.position.y = 0.69;
    lightWandGroup.add(capTop);

    // -------------------------------------------------------------
    // ELEMENT 4: The Number "7" in 3D (H7.VOX Brand Graphic)
    // Sculpted angular 7 floating dynamically
    // -------------------------------------------------------------
    const sevenGroup = new THREE.Group();
    sevenGroup.position.set(0.68, 0.58, -0.15);
    masterGroup.add(sevenGroup);

    const sevenMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      emissive: 0x08cc07,
      emissiveIntensity: 0.35,
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
    });

    // Top horizontal bar of "7"
    const topBarGeo = new THREE.BoxGeometry(0.36, 0.08, 0.07);
    const topBar = new THREE.Mesh(topBarGeo, sevenMat);
    sevenGroup.add(topBar);

    // Diagonal leg of "7"
    const diagLegGeo = new THREE.BoxGeometry(0.09, 0.44, 0.07);
    const diagLeg = new THREE.Mesh(diagLegGeo, sevenMat);
    diagLeg.position.set(0.06, -0.2, 0);
    diagLeg.rotation.z = Math.PI / 6.5;
    sevenGroup.add(diagLeg);

    // -------------------------------------------------------------
    // ELEMENT 5: Crown Detail (Subtle Royal Identity Emblem)
    // 5 peaks with beveled tips atop phone or 7
    // -------------------------------------------------------------
    const crownGroup = new THREE.Group();
    crownGroup.position.set(0, 0.98, 0.05);
    masterGroup.add(crownGroup);

    const crownMat = new THREE.MeshPhysicalMaterial({
      color: 0x08cc07,
      emissive: 0x08cc07,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.15,
    });

    // Crown base ring
    const crownBaseGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.03, 24);
    const crownBase = new THREE.Mesh(crownBaseGeo, crownMat);
    crownGroup.add(crownBase);

    // 5 Peak Cones
    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2;
      const peakHeight = i === 2 ? 0.12 : i % 2 === 0 ? 0.09 : 0.07;
      const peakGeo = new THREE.ConeGeometry(0.024, peakHeight, 16);
      const peak = new THREE.Mesh(peakGeo, crownMat);
      peak.position.set(Math.cos(angle) * 0.11, peakHeight / 2 + 0.015, Math.sin(angle) * 0.11);
      crownGroup.add(peak);
    }

    // Floating Contact Shadow Grounding
    const shadowGeo = new THREE.PlaneGeometry(2.2, 1.2);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const sGrad = sCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.6)');
      sGrad.addColorStop(0.5, 'rgba(8, 204, 7, 0.12)');
      sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = sGrad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      depthWrite: false,
    });
    const groundShadow = new THREE.Mesh(shadowGeo, shadowMat);
    groundShadow.rotation.x = -Math.PI / 2;
    groundShadow.position.y = -1.1;
    scene.add(groundShadow);

    // -------------------------------------------------------------
    // Animation & Smooth Interaction Loop
    // -------------------------------------------------------------
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.45;
      targetRotX = y * 0.25;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!e.touches[0]) return;
      const rect = container.getBoundingClientRect();
      const x = ((e.touches[0].clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.touches[0].clientY - rect.top) / rect.height) * 2 - 1);
      targetRotY = x * 0.35;
      targetRotX = y * 0.2;
    };

    container.addEventListener('mousemove', handlePointerMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Exponential damping
      currentRotY += (targetRotY - currentRotY) * 0.05;
      currentRotX += (targetRotX - currentRotX) * 0.05;

      // Natural slow rotation & floating levitation
      if (!prefersReducedMotion) {
        const floatOffset = Math.sin(elapsedTime * 1.5) * 0.04;
        masterGroup.position.y = floatOffset;

        // Auto slow turntable rotation + interactive tilt
        const autoTurntable = Math.sin(elapsedTime * 0.6) * 0.35;
        phoneGroup.rotation.y = autoTurntable + currentRotY * 0.8;
        phoneGroup.rotation.x = currentRotX * 0.6;

        // Independent micro motion for mic & wand
        micGroup.rotation.y = elapsedTime * 0.8;
        lightWandGroup.rotation.x = Math.sin(elapsedTime * 1.2) * 0.15;
        sevenGroup.rotation.y = -elapsedTime * 0.4;
      } else {
        phoneGroup.rotation.y = currentRotY;
        phoneGroup.rotation.x = currentRotX;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth || 400;
      const newHeight = container.clientHeight || 500;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousemove', handlePointerMove);
      container.removeEventListener('touchmove', handleTouchMove);

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      phoneBodyGeo.dispose();
      phoneBodyMat.dispose();
      phoneScreenGeo.dispose();
      phoneScreenMat.dispose();
      screenTexture.dispose();
      cameraIslandGeo.dispose();
      cameraIslandMat.dispose();
      lensGeo.dispose();
      lensMat.dispose();
      micBodyGeo.dispose();
      micBodyMat.dispose();
      wandTubeGeo.dispose();
      wandTubeMat.dispose();
      sevenMat.dispose();
      crownMat.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      shadowTexture.dispose();
    };
  }, []);

  if (!isSupported) {
    return (
      <div className={`relative flex items-center justify-center p-8 bg-[#101010] rounded-2xl border border-white/10 ${className}`}>
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-2xl bg-[#08CC07]/10 border border-[#08CC07]/30 flex items-center justify-center mx-auto text-[#08CC07] font-display font-black text-2xl">
            7
          </div>
          <p className="text-xs font-mono text-white/60 uppercase tracking-widest">
            H7.VOX 3D AUDIOVISUAL
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-[380px] sm:h-[480px] lg:h-[540px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`}
    >
      {/* 3D Viewport Corner Tag */}
      <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-[10px] font-mono text-white/50 backdrop-blur-sm pointer-events-none flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#08CC07]" />
        <span>3D INTERATIVO</span>
      </div>

      {/* Floating hints */}
      <div
        className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1 rounded-full bg-black/70 border border-white/10 text-[11px] font-mono text-white/60 pointer-events-none transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-60'
        }`}
      >
        Arraste para girar em 3D
      </div>
    </div>
  );
};
