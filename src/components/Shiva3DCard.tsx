import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { Rotate3D } from 'lucide-react';

export const Shiva3DCard: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isInteracting, setIsInteracting] = useState(false);

  // References for animation
  const flamesRef = useRef<THREE.Mesh[]>([]);
  const lightsRef = useRef<THREE.PointLight[]>([]);
  const petalsRef = useRef<THREE.Points | null>(null);
  const smokeRef = useRef<THREE.Points | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 340;
    const height = 370;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. WebGL Renderer with transparent background
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    container.appendChild(renderer.domElement);

    // 2. Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 1.8, 3.8);

    // OrbitControls for true 3D inspection
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI / 2.05; // Don't look below floor
    controls.minPolarAngle = Math.PI / 3.8;
    controls.target.set(0, 0.35, 0);

    // PMREM Environment for polished stone & brass reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 3. Lighting Rig
    const ambientLight = new THREE.HemisphereLight(0xffecd0, 0x1a0a04, 0.85);
    scene.add(ambientLight);

    const celestialDirectional = new THREE.DirectionalLight(0xffdfa0, 1.8);
    celestialDirectional.position.set(2, 4, 2);
    scene.add(celestialDirectional);

    // 4. SANCTUM POOJA ROOT GROUP
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // --- A. SANCTUM BASE PEDESTAL (Black Marble with Golden Inlay) ---
    const pedestalGeo = new THREE.CylinderGeometry(1.5, 1.6, 0.12, 48);
    const marbleMat = new THREE.MeshStandardMaterial({
      color: 0x18100c,
      roughness: 0.3,
      metalness: 0.3,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, marbleMat);
    pedestal.position.y = -0.06;
    rootGroup.add(pedestal);

    // Inlaid Gold Ring on Pedestal
    const goldRingGeo = new THREE.RingGeometry(1.3, 1.36, 48);
    const goldRingMat = new THREE.MeshStandardMaterial({
      color: 0xe5b138,
      roughness: 0.2,
      metalness: 0.9,
      side: THREE.DoubleSide
    });
    const goldRing = new THREE.Mesh(goldRingGeo, goldRingMat);
    goldRing.rotation.x = -Math.PI / 2;
    goldRing.position.y = 0.005;
    rootGroup.add(goldRing);

    // --- B. SACRED SHIVA LINGAM (Centre of Sanctum) ---
    const lingamGroup = new THREE.Group();
    rootGroup.add(lingamGroup);

    // Polished Black Granite Material
    const blackGraniteMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.18,
      metalness: 0.2,
    });

    // Peedam / Yoni (Tiered oval base with Abhishekam spout)
    const peedamLower = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 0.14, 32), blackGraniteMat);
    peedamLower.position.y = 0.07;
    lingamGroup.add(peedamLower);

    const peedamUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.54, 0.12, 32), blackGraniteMat);
    peedamUpper.position.y = 0.19;
    lingamGroup.add(peedamUpper);

    // Spout (Pranali) extending forward
    const spout = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.1, 0.38), blackGraniteMat);
    spout.position.set(-0.46, 0.19, 0);
    spout.rotation.y = Math.PI / 2;
    lingamGroup.add(spout);

    // Central Shiva Linga (Cylinder with hemispherical top)
    const lingaGeo = new THREE.CapsuleGeometry(0.26, 0.52, 16, 32);
    const lingaMesh = new THREE.Mesh(lingaGeo, blackGraniteMat);
    lingaMesh.position.y = 0.52;
    lingamGroup.add(lingaMesh);

    // Tripundra (Three Sacred White Chandan/Vibhuti Lines)
    const tripundraGroup = new THREE.Group();
    tripundraGroup.position.set(0, 0.56, 0.255);
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-0.04, 0, 0.04].forEach((yOff) => {
      const lineMesh = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.016, 0.02), whiteMat);
      lineMesh.position.y = yOff;
      tripundraGroup.add(lineMesh);
    });
    // Red Kumkum Bindu in center of Tripundra
    const kumkumDot = new THREE.Mesh(new THREE.SphereGeometry(0.024, 16, 16), new THREE.MeshBasicMaterial({ color: 0xcc1111 }));
    kumkumDot.position.set(0, 0, 0.015);
    tripundraGroup.add(kumkumDot);
    lingamGroup.add(tripundraGroup);

    // Fresh Trifoliate Bilva Patra (బిల్వ పత్రాలు) on top of Shiva Lingam
    const bilvaMat = new THREE.MeshStandardMaterial({
      color: 0x1f7a1f,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const leafGeo = new THREE.CircleGeometry(0.1, 16);
    // Center Leaf
    const leaf1 = new THREE.Mesh(leafGeo, bilvaMat);
    leaf1.position.set(0, 0.83, 0);
    leaf1.rotation.x = -Math.PI / 3;
    lingamGroup.add(leaf1);
    // Left Leaf
    const leaf2 = new THREE.Mesh(leafGeo, bilvaMat);
    leaf2.position.set(-0.09, 0.82, 0.02);
    leaf2.rotation.set(-Math.PI / 3.2, 0, Math.PI / 4);
    lingamGroup.add(leaf2);
    // Right Leaf
    const leaf3 = new THREE.Mesh(leafGeo, bilvaMat);
    leaf3.position.set(0.09, 0.82, 0.02);
    leaf3.rotation.set(-Math.PI / 3.2, 0, -Math.PI / 4);
    lingamGroup.add(leaf3);

    // --- C. DEEPALU (కార్తీక దీపాలు - GLOWING OIL LAMPS ALL AROUND SHIVA LINGAM) ---
    const diyaBrassMat = new THREE.MeshStandardMaterial({
      color: 0xdf9926,
      roughness: 0.25,
      metalness: 0.88,
    });
    const diyaCount = 6;
    const diyaRadius = 1.05;
    const flames: THREE.Mesh[] = [];
    const pointLights: THREE.PointLight[] = [];

    for (let i = 0; i < diyaCount; i++) {
      const angle = (i / diyaCount) * Math.PI * 2;
      const dx = Math.cos(angle) * diyaRadius;
      const dz = Math.sin(angle) * diyaRadius;

      const diyaGrp = new THREE.Group();
      diyaGrp.position.set(dx, 0.04, dz);

      // Brass Diya Base & Bowl
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.06, 24), diyaBrassMat);
      base.position.y = 0.03;
      diyaGrp.add(base);

      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.1, 0.1, 24, 1, true), diyaBrassMat);
      cup.position.y = 0.11;
      diyaGrp.add(cup);

      // Oil Surface inside lamp
      const oil = new THREE.Mesh(
        new THREE.CircleGeometry(0.18, 24),
        new THREE.MeshStandardMaterial({ color: 0x995511, roughness: 0.1, metalness: 0.4 })
      );
      oil.rotation.x = -Math.PI / 2;
      oil.position.y = 0.14;
      diyaGrp.add(oil);

      // Cotton Wick
      const wick = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.08, 8),
        new THREE.MeshBasicMaterial({ color: 0x1f0f04 })
      );
      wick.position.set(0, 0.17, 0);
      diyaGrp.add(wick);

      // Glowing Teardrop Flame Mesh
      const flameGeo = new THREE.ConeGeometry(0.065, 0.22, 16);
      flameGeo.translate(0, 0.11, 0);
      const flameMesh = new THREE.Mesh(
        flameGeo,
        new THREE.MeshBasicMaterial({ color: 0xffaa11, transparent: true, opacity: 0.95 })
      );
      flameMesh.position.set(0, 0.18, 0);
      diyaGrp.add(flameMesh);
      flames.push(flameMesh);

      // Outer Corona Glow
      const corona = new THREE.Mesh(
        new THREE.SphereGeometry(0.12, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xff4500, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending })
      );
      corona.position.set(0, 0.25, 0);
      diyaGrp.add(corona);

      // Point Light from Diya illuminating the Shiva Lingam!
      const pLight = new THREE.PointLight(0xffa022, 1.8, 3.2, 1.3);
      pLight.position.set(dx, 0.35, dz);
      scene.add(pLight);
      pointLights.push(pLight);

      rootGroup.add(diyaGrp);
    }

    flamesRef.current = flames;
    lightsRef.current = pointLights;

    // --- D. FRESH FLOWER OFFERINGS (పుష్పార్చన - MARIGOLD & LOTUS PETALS) ---
    const flowerMatYellow = new THREE.MeshStandardMaterial({ color: 0xffb703, roughness: 0.7 });
    const flowerMatOrange = new THREE.MeshStandardMaterial({ color: 0xfb8500, roughness: 0.7 });
    const flowerMatRed = new THREE.MeshStandardMaterial({ color: 0xd90429, roughness: 0.7 });

    const flowerPositions = [
      [0.65, 0.06, 0.45, flowerMatYellow],
      [-0.65, 0.06, 0.45, flowerMatOrange],
      [0.15, 0.06, 0.75, flowerMatRed],
      [-0.2, 0.06, -0.65, flowerMatYellow],
      [0.55, 0.06, -0.45, flowerMatOrange],
      [-0.55, 0.06, -0.5, flowerMatRed],
    ];

    flowerPositions.forEach(([x, y, z, mat]) => {
      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), mat as THREE.Material);
      flower.scale.set(1, 0.45, 1);
      flower.position.set(x as number, y as number, z as number);
      rootGroup.add(flower);
    });

    // --- E. INCENSE AGARBATTI STAND WITH RISING PUJA SMOKE ---
    const dhoop = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.1, 0.06, 16), diyaBrassMat);
    dhoop.position.set(-0.75, 0.06, 0.15);
    rootGroup.add(dhoop);

    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.32, 8), new THREE.MeshBasicMaterial({ color: 0x4a2a12 }));
    stick.position.set(-0.75, 0.2, 0.15);
    stick.rotation.z = 0.18;
    rootGroup.add(stick);

    const redTip = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff2200 }));
    redTip.position.set(-0.78, 0.35, 0.15);
    rootGroup.add(redTip);

    // Rising Smoke Particles
    const smokeCount = 30;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount; i++) {
      smokePositions[i * 3] = -0.78 + (Math.random() - 0.5) * 0.06;
      smokePositions[i * 3 + 1] = 0.35 + Math.random() * 0.9;
      smokePositions[i * 3 + 2] = 0.15 + (Math.random() - 0.5) * 0.06;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xdddddd,
      size: 0.055,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    scene.add(smokeParticles);
    smokeRef.current = smokeParticles;

    // --- F. FALLING SACRED FLOWER PETALS (CONTINUOUS DIVINE PUJA SHOWER) ---
    const petalCount = 65;
    const petalGeo = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);
    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3] = (Math.random() - 0.5) * 1.6;
      petalPositions[i * 3 + 1] = 0.2 + Math.random() * 1.8;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
    }
    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));
    const petalMat = new THREE.PointsMaterial({
      color: 0xff3b7a,
      size: 0.065,
      transparent: true,
      opacity: 0.8,
      depthWrite: false,
    });
    const petals = new THREE.Points(petalGeo, petalMat);
    scene.add(petals);
    petalsRef.current = petals;

    // 5. ANIMATION LOOP
    let animId: number;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          animId = window.setTimeout(cb, 80);
        }
      };
      animId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const t = clock.getElapsedTime();

      // Gentle continuous celestial rotation of the sanctum
      rootGroup.rotation.y = t * 0.15;

      // Realistic Diya Flames Flickering
      flames.forEach((flame, idx) => {
        const flick = Math.sin(t * 14 + idx * 2) * 0.08 + Math.cos(t * 22 + idx * 3) * 0.05;
        flame.scale.set(1 + flick * 0.5, 1 + flick * 0.8, 1 + flick * 0.5);
        flame.rotation.z = Math.sin(t * 10 + idx) * 0.06;
      });

      // Warm Point Lights Pulsating
      pointLights.forEach((light, idx) => {
        light.intensity = 1.6 + Math.sin(t * 12 + idx * 1.5) * 0.4;
      });

      // Rising Incense Smoke
      if (smokeRef.current) {
        const pos = smokeRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < smokeCount; i++) {
          pos[i * 3 + 1] += 0.006;
          pos[i * 3] += Math.sin(t * 2 + i) * 0.001;
          if (pos[i * 3 + 1] > 1.3) {
            pos[i * 3 + 1] = 0.35;
            pos[i * 3] = -0.78 + (Math.random() - 0.5) * 0.05;
          }
        }
        smokeRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Continuous Falling Petals Shower animation
      if (petalsRef.current) {
        const pArr = petalsRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < petalCount; i++) {
          pArr[i * 3 + 1] -= 0.008;
          pArr[i * 3] += Math.sin(t * 2 + i) * 0.002;
          if (pArr[i * 3 + 1] < 0.1) {
            pArr[i * 3 + 1] = 1.6 + Math.random() * 0.8;
            pArr[i * 3] = (Math.random() - 0.5) * 1.5;
            pArr[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
          }
        }
        petalsRef.current.geometry.attributes.position.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animId = requestAnimationFrame(tick);
      }
    };

    tick();

    // Resize Handling
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 340;
      camera.aspect = w / height;
      camera.updateProjectionMatrix();
      renderer.setSize(w, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) clearTimeout(animId);
      else cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="my-2 relative flex flex-col items-center justify-center">
      {/* 3D WebGL Canvas Container with Divine Golden Glow */}
      <div className="relative w-full max-w-[340px] sm:max-w-[400px] h-[370px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing">
        {/* Soft Sanctum Glow Backdrop */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-amber-600/35 via-yellow-400/40 to-orange-500/30 filter blur-2xl pointer-events-none animate-pulse" />

        <div
          ref={mountRef}
          onMouseDown={() => setIsInteracting(true)}
          onMouseUp={() => setIsInteracting(false)}
          onTouchStart={() => setIsInteracting(true)}
          onTouchEnd={() => setIsInteracting(false)}
          className="w-full h-full relative z-10"
        />

        {/* 3D Drag Rotation Hint Pill */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 pointer-events-none z-20">
          <div className="px-3 py-1 rounded-full bg-[#180603]/85 border border-[#ffd76b]/60 shadow-lg text-[10px] sm:text-[11px] font-bold text-[#ffd778] flex items-center gap-1.5 backdrop-blur-xs">
            <Rotate3D className="w-3.5 h-3.5 text-amber-400" />
            <span>{isInteracting ? '3D లో తిరుగుతోంది...' : '3D లో తిప్పండి (Rotate 3D)'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
