import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { templeAudio } from '../utils/audio';
import { Bell, Flame, Flower2, Sparkles, Eye, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';

interface Sanctum3DProps {
  onLightDiya?: () => void;
  lang?: 'te' | 'en';
}

export const Sanctum3D: React.FC<Sanctum3DProps> = ({ lang = 'te' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isKindled, setIsKindled] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<'thali' | 'diya' | 'lingam' | 'overhead'>('thali');
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [blessingMessage, setBlessingMessage] = useState<string>('॥ ఓం నమః శివాయ ॥ 🪔 పవిత్ర కార్తీక దీప దర్శనం');

  // Mutable refs for Three.js animations
  const sceneRef = useRef<THREE.Scene | null>(null);
  const flameMeshRef = useRef<THREE.Mesh | null>(null);
  const flameLightRef = useRef<THREE.PointLight | null>(null);
  const bellGroupRef = useRef<THREE.Group | null>(null);
  const bellOscillationRef = useRef<number>(0);
  const flowerParticlesRef = useRef<THREE.Points | null>(null);
  const smokeParticlesRef = useRef<THREE.Points | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cameraTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 3.2, 4.8));
  const controlsTargetPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.4, 0));

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 450;

    // 1. Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x130704); // Deep sacred dark sanctuary
    scene.fog = new THREE.FogExp2(0x130704, 0.08);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 3.2, 4.8);
    cameraRef.current = camera;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2.05; // Prevent viewing underneath floor
    controls.minDistance = 2.0;
    controls.maxDistance = 8.5;
    controls.target.set(0, 0.4, 0);
    controlsRef.current = controls;

    // 4. Procedural Studio PMREM Environment for realistic metallic brass reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 5. Lighting Rig
    const ambientLight = new THREE.HemisphereLight(0xffeedd, 0x221108, 0.7);
    scene.add(ambientLight);

    const warmKeyLight = new THREE.DirectionalLight(0xffdfa0, 1.8);
    warmKeyLight.position.set(2.5, 4.5, 2.5);
    warmKeyLight.castShadow = !isSoftwareGl;
    if (warmKeyLight.castShadow) {
      warmKeyLight.shadow.mapSize.width = 1024;
      warmKeyLight.shadow.mapSize.height = 1024;
      warmKeyLight.shadow.bias = -0.0005;
    }
    scene.add(warmKeyLight);

    const rimLight = new THREE.DirectionalLight(0xdf8435, 1.2);
    rimLight.position.set(-3, 3, -2);
    scene.add(rimLight);

    // Golden Flickering Point Light from Diya Flame
    const diyaLight = new THREE.PointLight(0xffa226, 3.2, 5.0, 1.2);
    diyaLight.position.set(-0.7, 0.75, 0.4);
    diyaLight.castShadow = !isSoftwareGl;
    scene.add(diyaLight);
    flameLightRef.current = diyaLight;

    // 6. Ground Sanctum Pedestal (Black Marble with gold inlay ring)
    const floorGeo = new THREE.CylinderGeometry(3.5, 3.6, 0.2, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x1f140f,
      roughness: 0.35,
      metalness: 0.2,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.position.y = -0.1;
    floorMesh.receiveShadow = !isSoftwareGl;
    scene.add(floorMesh);

    // Gold inlaid decorative border ring on floor
    const ringGeo = new THREE.RingGeometry(2.8, 2.88, 64);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd4a034,
      metalness: 0.85,
      roughness: 0.2,
      side: THREE.DoubleSide
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.position.y = 0.005;
    scene.add(ringMesh);

    // 7. POOJA THALI (Sacred Brass Platter)
    const thaliGroup = new THREE.Group();
    scene.add(thaliGroup);

    const brassMaterial = new THREE.MeshStandardMaterial({
      color: 0xd6992d,
      roughness: 0.25,
      metalness: 0.88,
    });

    // Thali Base
    const thaliBaseGeo = new THREE.CylinderGeometry(1.65, 1.6, 0.05, 64);
    const thaliBase = new THREE.Mesh(thaliBaseGeo, brassMaterial);
    thaliBase.position.y = 0.04;
    thaliBase.receiveShadow = !isSoftwareGl;
    thaliGroup.add(thaliBase);

    // Thali Raised Stepped Rim
    const thaliRimGeo = new THREE.TorusGeometry(1.62, 0.05, 16, 64);
    const thaliRim = new THREE.Mesh(thaliRimGeo, brassMaterial);
    thaliRim.rotation.x = Math.PI / 2;
    thaliRim.position.y = 0.09;
    thaliGroup.add(thaliRim);

    // 8. SACRED SHIVA LINGAM (Centre of the Sanctum Thali)
    const lingamGroup = new THREE.Group();
    lingamGroup.position.set(0.1, 0.065, -0.2);
    thaliGroup.add(lingamGroup);

    // Polished Black Granite Material
    const blackGraniteMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.18,
      metalness: 0.15,
    });

    // Peedam / Yoni base (Tiered oval / cylinder with spout)
    const peedamLowerGeo = new THREE.CylinderGeometry(0.55, 0.6, 0.12, 32);
    const peedamLower = new THREE.Mesh(peedamLowerGeo, blackGraniteMat);
    peedamLower.position.y = 0.06;
    lingamGroup.add(peedamLower);

    const peedamUpperGeo = new THREE.CylinderGeometry(0.48, 0.52, 0.1, 32);
    const peedamUpper = new THREE.Mesh(peedamUpperGeo, blackGraniteMat);
    peedamUpper.position.y = 0.16;
    lingamGroup.add(peedamUpper);

    // Spout (Abhisheka Pranali)
    const spoutGeo = new THREE.BoxGeometry(0.16, 0.08, 0.35);
    const spout = new THREE.Mesh(spoutGeo, blackGraniteMat);
    spout.position.set(-0.45, 0.16, 0);
    spout.rotation.y = Math.PI / 2;
    lingamGroup.add(spout);

    // Shiva Linga (Cylindrical shaft with hemispherical top)
    const lingaGeo = new THREE.CapsuleGeometry(0.24, 0.45, 16, 32);
    const lingaMesh = new THREE.Mesh(lingaGeo, blackGraniteMat);
    lingaMesh.position.y = 0.45;
    lingaMesh.castShadow = !isSoftwareGl;
    lingamGroup.add(lingaMesh);

    // Tripundra (Three Sacred White Sandalwood Vibhuti Lines)
    const tripundraGroup = new THREE.Group();
    tripundraGroup.position.set(0, 0.48, 0.23);
    const whiteLineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    [-0.035, 0, 0.035].forEach((yOffset) => {
      const lineGeo = new THREE.BoxGeometry(0.16, 0.015, 0.02);
      const lineMesh = new THREE.Mesh(lineGeo, whiteLineMat);
      lineMesh.position.y = yOffset;
      tripundraGroup.add(lineMesh);
    });
    // Red Kumkum Dot in middle
    const binduGeo = new THREE.SphereGeometry(0.02, 16, 16);
    const binduMat = new THREE.MeshBasicMaterial({ color: 0xd61c1c });
    const binduMesh = new THREE.Mesh(binduGeo, binduMat);
    binduMesh.position.set(0, 0, 0.015);
    tripundraGroup.add(binduMesh);
    lingamGroup.add(tripundraGroup);

    // Fresh Bilva Patra (Trifoliate leaves on top of Lingam)
    const bilvaMat = new THREE.MeshStandardMaterial({
      color: 0x228b22,
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide
    });
    const bilvaGeo = new THREE.CircleGeometry(0.09, 16);
    // Center leaf
    const bilvaCenter = new THREE.Mesh(bilvaGeo, bilvaMat);
    bilvaCenter.position.set(0, 0.72, 0);
    bilvaCenter.rotation.x = -Math.PI / 3;
    lingamGroup.add(bilvaCenter);
    // Left leaf
    const bilvaLeft = new THREE.Mesh(bilvaGeo, bilvaMat);
    bilvaLeft.position.set(-0.08, 0.71, 0.02);
    bilvaLeft.rotation.set(-Math.PI / 3.2, 0, Math.PI / 4);
    lingamGroup.add(bilvaLeft);
    // Right leaf
    const bilvaRight = new THREE.Mesh(bilvaGeo, bilvaMat);
    bilvaRight.position.set(0.08, 0.71, 0.02);
    bilvaRight.rotation.set(-Math.PI / 3.2, 0, -Math.PI / 4);
    lingamGroup.add(bilvaRight);

    // 9. KARTHIKA DIYA (Brass Pancha-Pradeepam Oil Lamp)
    const diyaGroup = new THREE.Group();
    diyaGroup.position.set(-0.7, 0.065, 0.4);
    thaliGroup.add(diyaGroup);

    // Diya Stand & Basin
    const diyaBaseGeo = new THREE.CylinderGeometry(0.24, 0.3, 0.08, 32);
    const diyaBase = new THREE.Mesh(diyaBaseGeo, brassMaterial);
    diyaBase.position.y = 0.04;
    diyaGroup.add(diyaBase);

    const diyaStemGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.22, 32);
    const diyaStem = new THREE.Mesh(diyaStemGeo, brassMaterial);
    diyaStem.position.y = 0.18;
    diyaGroup.add(diyaStem);

    // Diya Cup
    const diyaCupGeo = new THREE.CylinderGeometry(0.35, 0.15, 0.16, 32, 1, true);
    const diyaCup = new THREE.Mesh(diyaCupGeo, brassMaterial);
    diyaCup.position.y = 0.34;
    diyaGroup.add(diyaCup);

    // Sesame / Ghee Oil surface in lamp
    const oilGeo = new THREE.CircleGeometry(0.32, 32);
    const oilMat = new THREE.MeshStandardMaterial({
      color: 0x995511,
      roughness: 0.1,
      metalness: 0.4,
    });
    const oilMesh = new THREE.Mesh(oilGeo, oilMat);
    oilMesh.rotation.x = -Math.PI / 2;
    oilMesh.position.y = 0.38;
    diyaGroup.add(oilMesh);

    // Cotton Wick (Vatthi)
    const wickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.12, 12);
    const wickMat = new THREE.MeshBasicMaterial({ color: 0x221105 });
    const wick = new THREE.Mesh(wickGeo, wickMat);
    wick.position.set(0, 0.44, 0);
    diyaGroup.add(wick);

    // FLAME MESH (Layered tear-drop with dynamic vertex glow)
    const flameGeo = new THREE.ConeGeometry(0.09, 0.32, 16);
    flameGeo.translate(0, 0.16, 0); // Pivot at base
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0xffaa11,
      transparent: true,
      opacity: 0.95,
    });
    const flameMesh = new THREE.Mesh(flameGeo, flameMat);
    flameMesh.position.set(0, 0.46, 0);
    diyaGroup.add(flameMesh);
    flameMeshRef.current = flameMesh;

    // Outer warm corona halo
    const coronaGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xff4500,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    coronaMesh.position.set(0, 0.58, 0);
    diyaGroup.add(coronaMesh);

    // 10. TEMPLE GHANTA (Brass Bell)
    const bellGroup = new THREE.Group();
    bellGroup.position.set(0.75, 0.065, 0.45);
    thaliGroup.add(bellGroup);
    bellGroupRef.current = bellGroup;

    // Bell Body
    const bellBodyGeo = new THREE.CylinderGeometry(0.08, 0.28, 0.32, 32, 1, true);
    const bellBody = new THREE.Mesh(bellBodyGeo, brassMaterial);
    bellBody.position.y = 0.2;
    bellGroup.add(bellBody);

    // Bell Dome & Handle
    const bellDomeGeo = new THREE.SphereGeometry(0.12, 16, 16);
    const bellDome = new THREE.Mesh(bellDomeGeo, brassMaterial);
    bellDome.position.y = 0.36;
    bellGroup.add(bellDome);

    const bellHandleGeo = new THREE.CylinderGeometry(0.03, 0.04, 0.4, 16);
    const bellHandle = new THREE.Mesh(bellHandleGeo, brassMaterial);
    bellHandle.position.y = 0.6;
    bellGroup.add(bellHandle);

    // Nandi finial on bell top
    const nandiFinialGeo = new THREE.SphereGeometry(0.06, 12, 12);
    const nandiFinial = new THREE.Mesh(nandiFinialGeo, brassMaterial);
    nandiFinial.position.y = 0.82;
    bellGroup.add(nandiFinial);

    // 11. SACRED KATORIS (Kumkum & Turmeric Brass Bowls)
    const katoriMat = brassMaterial;
    // Kumkum bowl
    const kumkumBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.08, 24), katoriMat);
    kumkumBowl.position.set(0.65, 0.1, -0.45);
    thaliGroup.add(kumkumBowl);
    const kumkumPowder = new THREE.Mesh(new THREE.CircleGeometry(0.13, 24), new THREE.MeshStandardMaterial({ color: 0xb51212, roughness: 0.9 }));
    kumkumPowder.rotation.x = -Math.PI / 2;
    kumkumPowder.position.set(0.65, 0.141, -0.45);
    thaliGroup.add(kumkumPowder);

    // Turmeric & Akshata bowl
    const pasupuBowl = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.1, 0.08, 24), katoriMat);
    pasupuBowl.position.set(0.32, 0.1, -0.65);
    thaliGroup.add(pasupuBowl);
    const pasupuPowder = new THREE.Mesh(new THREE.CircleGeometry(0.13, 24), new THREE.MeshStandardMaterial({ color: 0xebb410, roughness: 0.9 }));
    pasupuPowder.rotation.x = -Math.PI / 2;
    pasupuPowder.position.set(0.32, 0.141, -0.65);
    thaliGroup.add(pasupuPowder);

    // 12. INCENSE / AGARBATTI STAND WITH RISING SMOKE
    const dhoopStand = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.06, 16), brassMaterial);
    dhoopStand.position.set(-0.6, 0.1, -0.45);
    thaliGroup.add(dhoopStand);

    // 2 Agarbatti sticks
    const stickMat = new THREE.MeshBasicMaterial({ color: 0x4a3219 });
    const stick1 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.35), stickMat);
    stick1.position.set(-0.6, 0.25, -0.45);
    stick1.rotation.z = 0.15;
    thaliGroup.add(stick1);

    // Glowing tip
    const tipMesh = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff3300 }));
    tipMesh.position.set(-0.63, 0.42, -0.45);
    thaliGroup.add(tipMesh);

    // Smoke particles
    const smokeCount = 35;
    const smokeGeo = new THREE.BufferGeometry();
    const smokePositions = new Float32Array(smokeCount * 3);
    for (let i = 0; i < smokeCount; i++) {
      smokePositions[i * 3] = -0.63 + (Math.random() - 0.5) * 0.08;
      smokePositions[i * 3 + 1] = 0.42 + Math.random() * 0.8;
      smokePositions[i * 3 + 2] = -0.45 + (Math.random() - 0.5) * 0.08;
    }
    smokeGeo.setAttribute('position', new THREE.BufferAttribute(smokePositions, 3));
    const smokeMat = new THREE.PointsMaterial({
      color: 0xcccccc,
      size: 0.05,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
    });
    const smokeParticles = new THREE.Points(smokeGeo, smokeMat);
    scene.add(smokeParticles);
    smokeParticlesRef.current = smokeParticles;

    // 13. FRESH FLOWER PETALS ON THALI (Marigolds & Lotus)
    const marigoldMat1 = new THREE.MeshStandardMaterial({ color: 0xff8c00, roughness: 0.7 });
    const marigoldMat2 = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.7 });
    const flowerCoords = [
      [-0.15, 0.08, 0.65, marigoldMat1],
      [0.2, 0.08, 0.6, marigoldMat2],
      [-0.45, 0.08, 0.1, marigoldMat2],
      [0.45, 0.08, 0.15, marigoldMat1],
      [-0.15, 0.08, -0.6, marigoldMat1],
    ];
    flowerCoords.forEach(([x, y, z, mat]) => {
      const flower = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), mat as THREE.Material);
      flower.scale.set(1, 0.5, 1);
      flower.position.set(x as number, y as number, z as number);
      thaliGroup.add(flower);
    });

    // 14. FLOATING DEVOTIONAL SPARKS & EMBERS
    const sparkCount = 45;
    const sparkGeo = new THREE.BufferGeometry();
    const sparkPositions = new Float32Array(sparkCount * 3);
    for (let i = 0; i < sparkCount; i++) {
      sparkPositions[i * 3] = (Math.random() - 0.5) * 3;
      sparkPositions[i * 3 + 1] = Math.random() * 2.5;
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
    }
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: 0xffcc33,
      size: 0.035,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const sparkParticles = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkParticles);

    // 15. OFFERING PETALS EFFECT (Instanced / Buffer system)
    const petalCount = 80;
    const petalGeo = new THREE.BufferGeometry();
    const petalPositions = new Float32Array(petalCount * 3);
    const petalVelocities: number[] = [];
    for (let i = 0; i < petalCount; i++) {
      petalPositions[i * 3] = (Math.random() - 0.5) * 1.5;
      petalPositions[i * 3 + 1] = 2.5 + Math.random() * 2;
      petalPositions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      petalVelocities.push(0.01 + Math.random() * 0.02);
    }
    petalGeo.setAttribute('position', new THREE.BufferAttribute(petalPositions, 3));
    const petalMat = new THREE.PointsMaterial({
      color: 0xff3366,
      size: 0.07,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const petalPoints = new THREE.Points(petalGeo, petalMat);
    scene.add(petalPoints);
    flowerParticlesRef.current = petalPoints;

    // 16. ANIMATION LOOP
    let animationFrameId: number;
    let clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          animationFrameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          animationFrameId = window.setTimeout(cb, 80);
        }
      };
      animationFrameId = window.setTimeout(poll, 5);
    }

    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      // Flame flicker & gentle wobble
      if (flameMeshRef.current) {
        const flicker = Math.sin(elapsedTime * 14) * 0.06 + Math.cos(elapsedTime * 23) * 0.04;
        flameMeshRef.current.scale.set(1 + flicker * 0.4, 1 + flicker * 0.9, 1 + flicker * 0.4);
        flameMeshRef.current.rotation.z = Math.sin(elapsedTime * 8) * 0.05;
        flameMeshRef.current.rotation.x = Math.cos(elapsedTime * 9) * 0.04;
      }

      // Point Light pulsating warm glow
      if (flameLightRef.current) {
        const pulse = 3.0 + Math.sin(elapsedTime * 12) * 0.45 + Math.sin(elapsedTime * 27) * 0.25;
        flameLightRef.current.intensity = pulse;
      }

      // Bell oscillation when rung
      if (bellGroupRef.current && bellOscillationRef.current > 0.001) {
        bellGroupRef.current.rotation.z = Math.sin(elapsedTime * 22) * bellOscillationRef.current;
        bellOscillationRef.current *= 0.96; // exponential decay
      } else if (bellGroupRef.current) {
        bellGroupRef.current.rotation.z = 0;
      }

      // Rising Smoke Particles
      if (smokeParticlesRef.current) {
        const pos = smokeParticlesRef.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < smokeCount; i++) {
          pos[i * 3 + 1] += 0.006;
          pos[i * 3] += Math.sin(elapsedTime + i) * 0.0015;
          if (pos[i * 3 + 1] > 1.3) {
            pos[i * 3 + 1] = 0.42;
            pos[i * 3] = -0.63 + (Math.random() - 0.5) * 0.06;
          }
        }
        smokeParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // Rising Sparks
      const sparkPos = sparkParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < sparkCount; i++) {
        sparkPos[i * 3 + 1] += 0.008;
        if (sparkPos[i * 3 + 1] > 2.6) {
          sparkPos[i * 3 + 1] = 0.1;
        }
      }
      sparkParticles.geometry.attributes.position.needsUpdate = true;

      // Flower petal shower simulation
      if (flowerParticlesRef.current && flowerParticlesRef.current.material instanceof THREE.PointsMaterial) {
        if (flowerParticlesRef.current.material.opacity > 0) {
          const pArr = flowerParticlesRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < petalCount; i++) {
            pArr[i * 3 + 1] -= petalVelocities[i];
            pArr[i * 3] += Math.sin(elapsedTime * 3 + i) * 0.004;
            if (pArr[i * 3 + 1] < 0.1) {
              pArr[i * 3 + 1] = 0.1;
            }
          }
          flowerParticlesRef.current.geometry.attributes.position.needsUpdate = true;
          flowerParticlesRef.current.material.opacity -= 0.003;
        }
      }

      // Smooth Camera view damping
      if (cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(cameraTargetPosRef.current, 0.05);
        controlsRef.current.target.lerp(controlsTargetPosRef.current, 0.05);
        controlsRef.current.update();
      }

      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    tick();

    // 17. Resize handler
    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (isSoftwareGl) {
        clearTimeout(animationFrameId);
      } else {
        cancelAnimationFrame(animationFrameId);
      }
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Action handlers
  const handleRingBell = () => {
    bellOscillationRef.current = 0.28;
    templeAudio.playTempleBell();
    setBlessingMessage(lang === 'te' 
      ? '🔔 మంగళ ఘంటారావం! సర్వ విఘ్నాలు తొలగి శుభాలు కలుగునుగాక.' 
      : '🔔 Holy Temple Bell Echoes! Dispelling negativity and inviting auspiciousness.');
  };

  const handleKindleDiya = () => {
    setIsKindled(prev => !prev);
    if (flameMeshRef.current && flameLightRef.current) {
      if (isKindled) {
        flameMeshRef.current.scale.set(0.1, 0.1, 0.1);
        flameLightRef.current.intensity = 0.5;
        setBlessingMessage(lang === 'te' ? 'దీప ప్రజ్వలన మందగించింది.' : 'Diya flame subdued.');
      } else {
        flameMeshRef.current.scale.set(1.4, 1.4, 1.4);
        flameLightRef.current.intensity = 4.5;
        templeAudio.playTempleBell();
        setBlessingMessage(lang === 'te' ? '🪔 అఖండ జ్యోతి ప్రజ్వలింపబడింది! ఓం నమః శివాయ.' : '🪔 Akhanda Karthika Jyothi kindled with divine radiance!');
      }
    }
  };

  const handleOfferFlowers = () => {
    templeAudio.playTempleBell();
    if (flowerParticlesRef.current && flowerParticlesRef.current.material instanceof THREE.PointsMaterial) {
      const pArr = flowerParticlesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 80; i++) {
        pArr[i * 3] = (Math.random() - 0.5) * 1.4;
        pArr[i * 3 + 1] = 1.8 + Math.random() * 1.5;
        pArr[i * 3 + 2] = (Math.random() - 0.5) * 1.4;
      }
      flowerParticlesRef.current.geometry.attributes.position.needsUpdate = true;
      flowerParticlesRef.current.material.opacity = 1.0;
    }
    setBlessingMessage(lang === 'te' 
      ? '🌸 శివ లింగం పై పుష్పార్చన మరియు బిల్వ సమర్పణ జరిగింది!' 
      : '🌸 Sacred Bilva & Flower petals showered upon the Shiva Lingam!');
  };

  const setCameraView = (view: 'thali' | 'diya' | 'lingam' | 'overhead') => {
    setActiveView(view);
    if (view === 'thali') {
      cameraTargetPosRef.current.set(0, 3.2, 4.8);
      controlsTargetPosRef.current.set(0, 0.4, 0);
    } else if (view === 'diya') {
      cameraTargetPosRef.current.set(-1.4, 1.5, 2.0);
      controlsTargetPosRef.current.set(-0.7, 0.5, 0.4);
    } else if (view === 'lingam') {
      cameraTargetPosRef.current.set(0.1, 1.6, 2.2);
      controlsTargetPosRef.current.set(0.1, 0.5, -0.2);
    } else if (view === 'overhead') {
      cameraTargetPosRef.current.set(0.01, 5.2, 0.01);
      controlsTargetPosRef.current.set(0, 0.1, 0);
    }
  };

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    templeAudio.setMuted(next);
  };

  return (
    <div className={`relative w-full rounded-2xl overflow-hidden shadow-2xl border-2 border-[#d9a64e]/50 bg-[#130704] transition-all duration-300 ${isZenMode ? 'fixed inset-0 z-50 rounded-none border-0' : 'h-[500px] md:h-[580px]'}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Header Badge & Devotional Sanskrit Chant */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-[#2b0d06]/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#e5ad42]/40 shadow-lg flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span className="text-xs md:text-sm font-semibold text-[#ffd778] tracking-wide">
            {lang === 'te' ? '3D కార్తీక దీపారాధన సన్నిధి' : '3D Interactive Karthika Sanctum'}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="w-9 h-9 rounded-full bg-[#2b0d06]/85 backdrop-blur-md border border-[#e5ad42]/40 text-[#ffd778] hover:bg-[#4a180d] flex items-center justify-center transition-transform hover:scale-105"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsZenMode(prev => !prev)}
            title={isZenMode ? 'Exit Zen Mode' : 'Zen Fullscreen'}
            className="w-9 h-9 rounded-full bg-[#2b0d06]/85 backdrop-blur-md border border-[#e5ad42]/40 text-[#ffd778] hover:bg-[#4a180d] flex items-center justify-center transition-transform hover:scale-105"
          >
            {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Live Devotional Message Strip */}
      <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none text-center max-w-[90%] z-10">
        <div className="inline-block bg-[#1a0804]/80 px-4 py-1.5 rounded-full border border-[#d9a64e]/30 text-amber-200 text-xs md:text-sm font-medium shadow-md">
          {blessingMessage}
        </div>
      </div>

      {/* THREE.JS SKILL DIRECTIVE: Unified Collapsible Bottom Dock (Zero Viewport Occlusion) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-2xl z-20">
        <div className="bg-[#240c06]/92 border border-[#d9a64e]/60 rounded-2xl p-2.5 md:p-3 shadow-2xl">
          {/* Main Action Buttons */}
          <div className="grid grid-cols-3 gap-2 mb-2.5">
            <button
              onClick={handleKindleDiya}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-semibold text-xs md:text-sm shadow-md transition-all active:scale-95"
            >
              <Flame className="w-4 h-4 text-amber-200 fill-amber-200" />
              <span>{lang === 'te' ? 'దీపం వెలిగించండి' : 'Kindle Diya'}</span>
            </button>

            <button
              onClick={handleRingBell}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-[#9b3a1a] to-[#77260d] hover:from-[#ba4722] hover:to-[#8c2e11] text-white font-semibold text-xs md:text-sm shadow-md transition-all active:scale-95"
            >
              <Bell className="w-4 h-4 text-amber-200" />
              <span>{lang === 'te' ? 'ఘంటారావం (Bell)' : 'Ring Bell'}</span>
            </button>

            <button
              onClick={handleOfferFlowers}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-700 to-rose-800 hover:from-rose-600 hover:to-rose-700 text-white font-semibold text-xs md:text-sm shadow-md transition-all active:scale-95"
            >
              <Flower2 className="w-4 h-4 text-rose-200" />
              <span>{lang === 'te' ? 'పుష్పార్చన' : 'Offer Flowers'}</span>
            </button>
          </div>

          {/* Camera View Angle Selector */}
          <div className="flex items-center justify-between border-t border-[#642413] pt-2 px-1">
            <span className="text-[11px] md:text-xs text-amber-300/80 font-medium flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              {lang === 'te' ? 'కెమెరా కోణం:' : 'Camera View:'}
            </span>
            <div className="flex items-center gap-1.5">
              {[
                { id: 'thali', labelTe: 'పూజా థాలి', labelEn: 'Thali' },
                { id: 'diya', labelTe: 'కార్తీక దీపం', labelEn: 'Diya' },
                { id: 'lingam', labelTe: 'శివలింగం', labelEn: 'Lingam' },
                { id: 'overhead', labelTe: 'పైనుండి', labelEn: 'Top View' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setCameraView(item.id as typeof activeView)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] md:text-xs font-medium transition-colors ${
                    activeView === item.id
                      ? 'bg-[#d9a64e] text-[#2b0d06] font-bold shadow'
                      : 'bg-[#3b150c] text-amber-200/90 hover:bg-[#521e12]'
                  }`}
                >
                  {lang === 'te' ? item.labelTe : item.labelEn}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
