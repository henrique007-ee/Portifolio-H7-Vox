import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export type Section3DPreset =
  | 'services'
  | 'backstage'
  | 'branding'
  | 'portfolio'
  | 'motion'
  | 'simulator';

interface Section3DShowcaseProps {
  preset: Section3DPreset;
  className?: string;
}

/**
 * Full-bleed Ambient 3D Background Layer (pointer-events-none, z-0, zero borders, zero text labels).
 * Renders floating 3D audiovisual equipment and geometric sculptures integrated into the background
 * of each section across the entire website at varied scales, depths, and perspectives.
 */
export const Section3DShowcase: React.FC<Section3DShowcaseProps> = ({
  preset,
  className = '',
}) => {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [isNearViewport, setIsNearViewport] = useState(false);

  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNearViewport(entry.isIntersecting);
      },
      { rootMargin: '260px 0px', threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = hostRef.current;
    if (!container || !isNearViewport) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 640;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 13.5);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    container.appendChild(renderer.domElement);

    // Cinematic Studio Lighting with #08CC07 Rim Reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.68);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.1);
    keyLight.position.set(6, 8, 7);
    scene.add(keyLight);

    const greenRimLight = new THREE.PointLight(0x08cc07, 4.2, 26);
    greenRimLight.position.set(-6, 4, 6);
    scene.add(greenRimLight);

    const backFillLight = new THREE.PointLight(0x08cc07, 3.0, 22);
    backFillLight.position.set(6, -3, 4);
    scene.add(backFillLight);

    // Materials
    const darkMetalMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x14161a,
        metalness: 0.88,
        roughness: 0.22,
      })
    );
    const carbonDarkMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0b0c0e,
        metalness: 0.65,
        roughness: 0.35,
      })
    );
    const cushionMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x090a0c,
        metalness: 0.2,
        roughness: 0.75,
      })
    );
    const chromeAccentMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x383c45,
        metalness: 0.94,
        roughness: 0.16,
      })
    );
    const neonGreenMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x08cc07,
        emissive: 0x08cc07,
        emissiveIntensity: 0.95,
        metalness: 0.3,
        roughness: 0.2,
      })
    );
    const wireframeGreenMat = trackMat(
      new THREE.MeshBasicMaterial({
        color: 0x08cc07,
        wireframe: true,
        transparent: true,
        opacity: 0.38,
      })
    );

    const leftAnchor = new THREE.Group();
    const rightAnchor = new THREE.Group();
    const deepOrbitalGroup = new THREE.Group();
    const rotorsList: THREE.Mesh[] = [];

    scene.add(leftAnchor);
    scene.add(rightAnchor);
    scene.add(deepOrbitalGroup);

    // Helper builders for reusable 3D objects
    const buildStudioHeadphones = () => {
      const headphones = new THREE.Group();
      const archGeom = trackGeo(new THREE.TorusGeometry(1.5, 0.13, 18, 48, Math.PI));
      const archMesh = new THREE.Mesh(archGeom, darkMetalMat);
      archMesh.position.y = 0.25;
      headphones.add(archMesh);

      const innerArchGeom = trackGeo(new THREE.TorusGeometry(1.38, 0.085, 14, 40, Math.PI * 0.76));
      const innerArchMesh = new THREE.Mesh(innerArchGeom, cushionMat);
      innerArchMesh.position.y = 0.25;
      innerArchMesh.rotation.z = Math.PI * 0.12;
      headphones.add(innerArchMesh);

      const seamArchGeom = trackGeo(new THREE.TorusGeometry(1.62, 0.022, 10, 48, Math.PI * 0.85));
      const seamArchMesh = new THREE.Mesh(seamArchGeom, neonGreenMat);
      seamArchMesh.position.y = 0.25;
      seamArchMesh.rotation.z = Math.PI * 0.075;
      headphones.add(seamArchMesh);

      [-1, 1].forEach((side) => {
        const cupAssembly = new THREE.Group();
        cupAssembly.position.set(side * 1.44, -0.44, 0);
        cupAssembly.rotation.z = side * 0.18;

        const rodGeom = trackGeo(new THREE.CylinderGeometry(0.055, 0.055, 0.72, 16));
        const rodMesh = new THREE.Mesh(rodGeom, chromeAccentMat);
        rodMesh.position.y = 0.5;
        cupAssembly.add(rodMesh);

        const shellGeom = trackGeo(new THREE.CylinderGeometry(0.65, 0.74, 0.4, 32));
        shellGeom.rotateZ(Math.PI / 2);
        const shellMesh = new THREE.Mesh(shellGeom, darkMetalMat);
        cupAssembly.add(shellMesh);

        const ringGeom = trackGeo(new THREE.TorusGeometry(0.58, 0.03, 14, 36));
        ringGeom.rotateY(Math.PI / 2);
        const ringMesh = new THREE.Mesh(ringGeom, neonGreenMat);
        ringMesh.position.x = side * 0.21;
        cupAssembly.add(ringMesh);

        const padGeom = trackGeo(new THREE.TorusGeometry(0.55, 0.19, 20, 36));
        padGeom.rotateY(Math.PI / 2);
        const padMesh = new THREE.Mesh(padGeom, cushionMat);
        padMesh.position.x = -side * 0.21;
        cupAssembly.add(padMesh);

        headphones.add(cupAssembly);
      });
      return headphones;
    };

    const buildOctahedron = () => {
      const group = new THREE.Group();
      const octaCoreGeom = trackGeo(new THREE.OctahedronGeometry(1.12, 0));
      group.add(new THREE.Mesh(octaCoreGeom, darkMetalMat));
      const octaWireGeom = trackGeo(new THREE.OctahedronGeometry(1.22, 0));
      group.add(new THREE.Mesh(octaWireGeom, wireframeGreenMat));
      const eqRingGeom = trackGeo(new THREE.TorusGeometry(1.62, 0.02, 12, 48));
      eqRingGeom.rotateX(Math.PI / 2.6);
      group.add(new THREE.Mesh(eqRingGeom, neonGreenMat));
      return group;
    };

    const buildDrone = () => {
      const droneGroup = new THREE.Group();
      const bodyGeom = trackGeo(new THREE.BoxGeometry(1.3, 0.36, 1.88));
      droneGroup.add(new THREE.Mesh(bodyGeom, darkMetalMat));

      const canopyGeom = trackGeo(new THREE.BoxGeometry(1.0, 0.2, 1.38));
      const canopyMesh = new THREE.Mesh(canopyGeom, carbonDarkMat);
      canopyMesh.position.y = 0.24;
      droneGroup.add(canopyMesh);

      const ledStripGeom = trackGeo(new THREE.BoxGeometry(0.7, 0.04, 0.08));
      const ledStripMesh = new THREE.Mesh(ledStripGeom, neonGreenMat);
      ledStripMesh.position.set(0, 0.36, 0.62);
      droneGroup.add(ledStripMesh);

      const armConfigs = [
        { x: -1.16, z: 1.0, angle: -0.64 },
        { x: 1.16, z: 1.0, angle: 0.64 },
        { x: -1.16, z: -1.0, angle: 0.64 },
        { x: 1.16, z: -1.0, angle: -0.64 },
      ];
      const armGeom = trackGeo(new THREE.CylinderGeometry(0.065, 0.085, 1.6, 16));
      armGeom.rotateZ(Math.PI / 2);
      const motorGeom = trackGeo(new THREE.CylinderGeometry(0.17, 0.17, 0.25, 20));
      const rotorBladeGeom = trackGeo(new THREE.BoxGeometry(1.4, 0.02, 0.13));

      armConfigs.forEach((cfg) => {
        const arm = new THREE.Mesh(armGeom, carbonDarkMat);
        arm.position.set(cfg.x * 0.55, 0.04, cfg.z * 0.55);
        arm.rotation.y = cfg.angle;
        droneGroup.add(arm);

        const motor = new THREE.Mesh(motorGeom, chromeAccentMat);
        motor.position.set(cfg.x, 0.15, cfg.z);
        droneGroup.add(motor);

        const strobeGeom = trackGeo(new THREE.SphereGeometry(0.06, 12, 12));
        const strobe = new THREE.Mesh(strobeGeom, neonGreenMat);
        strobe.position.set(cfg.x, -0.02, cfg.z);
        droneGroup.add(strobe);

        const blade = new THREE.Mesh(rotorBladeGeom, darkMetalMat);
        blade.position.set(cfg.x, 0.3, cfg.z);
        droneGroup.add(blade);
        rotorsList.push(blade);
      });

      const gimbalGroup = new THREE.Group();
      gimbalGroup.position.set(0, -0.38, 0.68);
      gimbalGroup.add(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.44, 0.4, 0.5)), darkMetalMat));
      const gimbalLensGeom = trackGeo(new THREE.CylinderGeometry(0.17, 0.17, 0.26, 24));
      gimbalLensGeom.rotateX(Math.PI / 2);
      const gimbalLens = new THREE.Mesh(gimbalLensGeom, chromeAccentMat);
      gimbalLens.position.z = 0.3;
      gimbalGroup.add(gimbalLens);
      const lensCoating = new THREE.Mesh(trackGeo(new THREE.CircleGeometry(0.13, 20)), neonGreenMat);
      lensCoating.position.z = 0.44;
      gimbalGroup.add(lensCoating);
      droneGroup.add(gimbalGroup);

      return droneGroup;
    };

    const buildCinemaCamera = () => {
      const cinemaCam = new THREE.Group();
      cinemaCam.add(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.05, 1.05, 1.35)), darkMetalMat));
      const handleBar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.22, 0.16, 1.15)), chromeAccentMat);
      handleBar.position.set(0, 0.72, 0);
      cinemaCam.add(handleBar);

      const barrelGeom = trackGeo(new THREE.CylinderGeometry(0.42, 0.44, 0.95, 28));
      barrelGeom.rotateX(Math.PI / 2);
      const barrelMesh = new THREE.Mesh(barrelGeom, carbonDarkMat);
      barrelMesh.position.z = 1.05;
      cinemaCam.add(barrelMesh);

      const focusGear = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.45, 0.038, 12, 36)), neonGreenMat);
      focusGear.position.z = 1.02;
      cinemaCam.add(focusGear);

      const matteBox = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.18, 0.92, 0.32)), carbonDarkMat);
      matteBox.position.z = 1.58;
      cinemaCam.add(matteBox);

      const frontGlass = new THREE.Mesh(trackGeo(new THREE.CircleGeometry(0.34, 24)), neonGreenMat);
      frontGlass.position.z = 1.56;
      cinemaCam.add(frontGlass);
      return cinemaCam;
    };

    const buildLetterH = () => {
      const letterHGroup = new THREE.Group();
      const leftPillar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.56, 2.45, 0.56)), darkMetalMat);
      leftPillar.position.x = -0.8;
      letterHGroup.add(leftPillar);

      const leftWire = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.59, 2.48, 0.59)), wireframeGreenMat);
      leftWire.position.x = -0.8;
      letterHGroup.add(leftWire);

      const rightTop = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.56, 1.1, 0.56)), darkMetalMat);
      rightTop.position.set(0.8, 0.68, 0);
      letterHGroup.add(rightTop);

      const rightBot = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.56, 1.1, 0.56)), darkMetalMat);
      rightBot.position.set(0.8, -0.68, 0);
      letterHGroup.add(rightBot);

      const cutPlate = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.6, 0.08, 0.6)), neonGreenMat);
      cutPlate.position.set(0.8, 0, 0);
      letterHGroup.add(cutPlate);

      letterHGroup.add(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.0, 0.5, 0.46)), chromeAccentMat));
      letterHGroup.add(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.04, 0.09, 0.5)), neonGreenMat));
      return letterHGroup;
    };

    const buildNumber7 = () => {
      const group = new THREE.Group();
      const sevenShape = new THREE.Shape();
      sevenShape.moveTo(-0.55, 0.78);
      sevenShape.lineTo(0.55, 0.78);
      sevenShape.lineTo(0.55, 0.42);
      sevenShape.lineTo(-0.05, -0.8);
      sevenShape.lineTo(-0.42, -0.8);
      sevenShape.lineTo(0.16, 0.42);
      sevenShape.lineTo(-0.55, 0.42);
      sevenShape.closePath();

      const sevenGeom = trackGeo(
        new THREE.ExtrudeGeometry(sevenShape, {
          depth: 0.28,
          bevelEnabled: true,
          bevelSegments: 3,
          bevelSize: 0.035,
          bevelThickness: 0.035,
        })
      );
      sevenGeom.center();
      group.add(new THREE.Mesh(sevenGeom, darkMetalMat));

      const ringGeom = trackGeo(new THREE.TorusGeometry(1.12, 0.02, 12, 44));
      ringGeom.rotateX(1.05);
      group.add(new THREE.Mesh(ringGeom, neonGreenMat));
      return group;
    };

    const buildPrism = () => {
      const prismGroup = new THREE.Group();
      prismGroup.add(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.9, 1.2, 2.0, 3)), darkMetalMat));
      prismGroup.add(new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.95, 1.25, 2.05, 3)), wireframeGreenMat));
      return prismGroup;
    };

    const buildLedWand = () => {
      const wand = new THREE.Group();
      const r = 0.13;
      const len = 3.6;
      const diff = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(r, r, len, 32)),
        trackMat(
          new THREE.MeshStandardMaterial({
            color: 0x08cc07,
            emissive: 0x08cc07,
            emissiveIntensity: 1.5,
            roughness: 0.12,
            metalness: 0.05,
          })
        )
      );
      diff.position.y = 0.4;
      wand.add(diff);

      const topCap = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(r * 1.04, r * 1.04, 0.22, 32)), darkMetalMat);
      topCap.position.y = 0.4 + len / 2 + 0.11;
      wand.add(topCap);

      const grip = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(r * 1.04, r * 0.98, 1.1, 32)), darkMetalMat);
      grip.position.y = 0.4 - len / 2 - 0.55;
      wand.add(grip);

      wand.rotation.set(0.15, 0.2, -0.45);
      return wand;
    };

    // Populate scene based on preset
    if (preset === 'services') {
      leftAnchor.add(buildStudioHeadphones());
      rightAnchor.add(buildOctahedron());
    } else if (preset === 'backstage') {
      leftAnchor.add(buildDrone());
      rightAnchor.add(buildCinemaCamera());
    } else if (preset === 'branding') {
      leftAnchor.add(buildLetterH());
      rightAnchor.add(buildPrism());
    } else if (preset === 'portfolio') {
      leftAnchor.add(buildLedWand());
      rightAnchor.add(buildCinemaCamera());
    } else if (preset === 'motion') {
      leftAnchor.add(buildStudioHeadphones());
      rightAnchor.add(buildDrone());
    } else if (preset === 'simulator') {
      leftAnchor.add(buildNumber7());
      rightAnchor.add(buildLetterH());
    }

    // Add deep background wireframe sphere & orbiting triangles to all presets
    const sphereGeom = trackGeo(new THREE.SphereGeometry(0.82, 14, 12));
    const sphereMesh = new THREE.Mesh(sphereGeom, wireframeGreenMat);
    sphereMesh.position.set(0, 1.8, -3.5);
    deepOrbitalGroup.add(sphereMesh);

    const bigOrbitGeom = trackGeo(new THREE.TorusGeometry(3.2, 0.018, 12, 64));
    bigOrbitGeom.rotateX(1.22);
    bigOrbitGeom.rotateY(0.28);
    deepOrbitalGroup.add(new THREE.Mesh(bigOrbitGeom, neonGreenMat));

    const triGeom = trackGeo(new THREE.TetrahedronGeometry(0.2, 0));
    for (let i = 0; i < 4; i++) {
      const tri = new THREE.Mesh(triGeom, i % 2 === 0 ? neonGreenMat : chromeAccentMat);
      const angle = (i / 4) * Math.PI * 2;
      tri.position.set(Math.cos(angle) * 4.2, Math.sin(angle * 2) * 1.4, Math.sin(angle) * 1.6 - 2.0);
      deepOrbitalGroup.add(tri);
    }

    const handleResize = () => {
      if (!container) return;
      const curW = container.clientWidth || window.innerWidth;
      const curH = container.clientHeight || 640;
      camera.aspect = curW / curH;
      camera.updateProjectionMatrix();
      renderer.setSize(curW, curH);

      // Compute exact visible horizontal half-width at object depth z = -1.0 (dist = 14.5)
      const dist = camera.position.z - -1.0;
      const vFovRad = (camera.fov * Math.PI) / 180;
      const visibleHalfH = Math.tan(vFovRad / 2) * dist;
      const visibleHalfW = visibleHalfH * camera.aspect;

      if (curW < 768) {
        const edgeX = Math.max(1.25, Math.min(2.2, visibleHalfW * 0.68));
        leftAnchor.scale.set(0.55, 0.55, 0.55);
        leftAnchor.position.set(-edgeX, 2.5, -2.0);
        rightAnchor.scale.set(0.55, 0.55, 0.55);
        rightAnchor.position.set(edgeX, -2.5, -2.0);
        deepOrbitalGroup.scale.set(0.6, 0.6, 0.6);
      } else if (curW < 1200) {
        const edgeX = Math.max(2.4, Math.min(4.5, visibleHalfW * 0.72));
        leftAnchor.scale.set(0.82, 0.82, 0.82);
        leftAnchor.position.set(-edgeX, 0.85, -1.0);
        rightAnchor.scale.set(0.82, 0.82, 0.82);
        rightAnchor.position.set(edgeX, -0.75, -1.2);
        deepOrbitalGroup.scale.set(0.85, 0.85, 0.85);
      } else {
        const edgeX = Math.max(3.1, Math.min(5.6, visibleHalfW * 0.74));
        leftAnchor.scale.set(0.98, 0.98, 0.98);
        leftAnchor.position.set(-edgeX, 0.9, -0.8);
        rightAnchor.scale.set(0.98, 0.98, 0.98);
        rightAnchor.position.set(edgeX, -0.8, -1.0);
        deepOrbitalGroup.scale.set(1, 1, 1);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    let animId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        const t = clock.getElapsedTime();

        leftAnchor.position.y += Math.sin(t * 0.7) * 0.0025;
        leftAnchor.rotation.y = Math.sin(t * 0.42) * 0.34 + 0.35;
        leftAnchor.rotation.x = Math.cos(t * 0.34) * 0.12 + 0.14;

        rightAnchor.position.y += Math.cos(t * 0.62 + 1.2) * 0.0025;
        rightAnchor.rotation.y = -t * 0.28 - 0.35;
        rightAnchor.rotation.z = Math.sin(t * 0.38) * 0.12;

        deepOrbitalGroup.rotation.y = t * 0.18;
        deepOrbitalGroup.rotation.z = Math.sin(t * 0.24) * 0.1;

        rotorsList.forEach((rotor, idx) => {
          rotor.rotation.y = t * (idx % 2 === 0 ? 14 : -14);
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
    };
  }, [preset, isNearViewport]);

  return (
    <div
      ref={hostRef}
      className={`section-3d-canvas-host pointer-events-none select-none absolute inset-0 w-full h-full overflow-hidden z-0 opacity-75 sm:opacity-90 lg:opacity-95 ${className}`}
      aria-hidden="true"
    />
  );
};
