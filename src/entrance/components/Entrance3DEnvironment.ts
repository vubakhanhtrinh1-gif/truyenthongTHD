import * as THREE from 'three';
import { EntranceMaterialSet } from '../materials/EntranceMaterials';
import {
  createGateHeaderSignageTexture,
  createThresholdSignageTexture,
  createMysticalFogPuffTexture,
} from '../textures/ProceduralTextures';
import { createOfficialEmblemTexture } from '../../scenes/lobby/textures/createOfficialEmblemTexture';

export interface EntranceSceneElements {
  group: THREE.Group;
  goldRing: THREE.Mesh;
  goldRingOuter: THREE.Mesh;
  orbitalParticles: THREE.Points;
  starParticles: THREE.Points;
  ringPointLight: THREE.PointLight;
  pathSpotLight: THREE.SpotLight;
  interactiveObjects: THREE.Object3D[];
  fogPlanes: THREE.Mesh[];
  volumetricBeam: THREE.Mesh;
}

export function buildEntrance3DScene(materials: EntranceMaterialSet): EntranceSceneElements {
  const group = new THREE.Group();
  const interactiveObjects: THREE.Object3D[] = [];

  // ==========================================
  // 1. FLOOR & APPROACH PATHWAY
  // ==========================================
  // Main polished stone floor
  const floorGeo = new THREE.PlaneGeometry(24, 36);
  const floorMesh = new THREE.Mesh(floorGeo, materials.stoneFloor);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0, 4);
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // Inlay Approach Path (Golden guide toward the gate threshold)
  const pathGeo = new THREE.PlaneGeometry(3.6, 22);
  const pathMesh = new THREE.Mesh(pathGeo, materials.pathInlay);
  pathMesh.rotation.x = -Math.PI / 2;
  pathMesh.position.set(0, 0.005, 7);
  pathMesh.receiveShadow = true;
  group.add(pathMesh);

  // Left & Right luminous floor strip guides
  const stripGeo = new THREE.BoxGeometry(0.04, 0.02, 20);
  const stripMat = materials.goldLuminous.clone();
  stripMat.emissiveIntensity = 0.8;

  const leftStrip = new THREE.Mesh(stripGeo, stripMat);
  leftStrip.position.set(-1.82, 0.01, 7);
  group.add(leftStrip);

  const rightStrip = new THREE.Mesh(stripGeo, stripMat);
  rightStrip.position.set(1.82, 0.01, 7);
  group.add(rightStrip);

  // ==========================================
  // 2. ARCHITECTURAL CEILING
  // ==========================================
  const ceilingGeo = new THREE.PlaneGeometry(24, 36);
  const ceilingMesh = new THREE.Mesh(ceilingGeo, materials.ceiling);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(0, 5.8, 4);
  group.add(ceilingMesh);

  // Ceiling orbital decorative concentric rings
  const ceilingRingGeo1 = new THREE.RingGeometry(2.4, 2.45, 64);
  const ceilingRing1 = new THREE.Mesh(ceilingRingGeo1, materials.gold);
  ceilingRing1.rotation.x = Math.PI / 2;
  ceilingRing1.position.set(0, 5.78, 2);
  group.add(ceilingRing1);

  const ceilingRingGeo2 = new THREE.RingGeometry(4.2, 4.24, 64);
  const ceilingRing2 = new THREE.Mesh(ceilingRingGeo2, materials.gold);
  ceilingRing2.rotation.x = Math.PI / 2;
  ceilingRing2.position.set(0, 5.78, 2);
  group.add(ceilingRing2);

  // ==========================================
  // 3. SIDE WALLS & FRAMING
  // ==========================================
  const wallGeo = new THREE.PlaneGeometry(36, 6);

  // Left Wall
  const leftWall = new THREE.Mesh(wallGeo, materials.wall);
  leftWall.position.set(-8, 3, 4);
  leftWall.rotation.y = Math.PI / 2;
  group.add(leftWall);

  // Right Wall
  const rightWall = new THREE.Mesh(wallGeo, materials.wall);
  rightWall.position.set(8, 3, 4);
  rightWall.rotation.y = -Math.PI / 2;
  group.add(rightWall);

  // Architectural columns along side walls
  const colGeo = new THREE.BoxGeometry(0.4, 5.8, 0.4);
  const colBaseGeo = new THREE.BoxGeometry(0.5, 0.25, 0.5);

  [-6, -1, 4, 9, 14].forEach((zPos) => {
    // Left side column
    const leftCol = new THREE.Mesh(colGeo, materials.wood);
    leftCol.position.set(-7.75, 2.9, zPos);
    group.add(leftCol);

    const leftColBase = new THREE.Mesh(colBaseGeo, materials.gold);
    leftColBase.position.set(-7.75, 0.125, zPos);
    group.add(leftColBase);

    // Right side column
    const rightCol = new THREE.Mesh(colGeo, materials.wood);
    rightCol.position.set(7.75, 2.9, zPos);
    group.add(rightCol);

    const rightColBase = new THREE.Mesh(colBaseGeo, materials.gold);
    rightColBase.position.set(7.75, 0.125, zPos);
    group.add(rightColBase);
  });

  // ==========================================
  // 4. MAIN ENTRANCE GATE (HERO STRUCTURE)
  // ==========================================
  const gateGroup = new THREE.Group();
  gateGroup.position.set(0, 0, 0);

  // Gate Raised Threshold Step
  const stepGeo = new THREE.BoxGeometry(7.2, 0.14, 1.4);
  const stepMesh = new THREE.Mesh(stepGeo, materials.stoneFloor);
  stepMesh.position.set(0, 0.07, 0);
  stepMesh.receiveShadow = true;
  gateGroup.add(stepMesh);

  // Brass nosing on the threshold
  const nosingGeo = new THREE.BoxGeometry(7.22, 0.03, 0.06);
  const nosingMesh = new THREE.Mesh(nosingGeo, materials.gold);
  nosingMesh.position.set(0, 0.13, 0.7);
  gateGroup.add(nosingMesh);

  // Left Gate Main Pillar
  const pillarGeo = new THREE.BoxGeometry(0.7, 5.0, 0.7);
  const pillarCapGeo = new THREE.BoxGeometry(0.85, 0.22, 0.85);

  const leftPillar = new THREE.Mesh(pillarGeo, materials.wood);
  leftPillar.position.set(-2.8, 2.5, 0);
  leftPillar.castShadow = true;
  leftPillar.receiveShadow = true;
  gateGroup.add(leftPillar);

  // Pillar Lacquer Red Inset Trim
  const pillarTrimGeo = new THREE.BoxGeometry(0.12, 4.4, 0.71);
  const leftPillarTrim = new THREE.Mesh(pillarTrimGeo, materials.lacquerRed);
  leftPillarTrim.position.set(-2.8, 2.5, 0);
  gateGroup.add(leftPillarTrim);

  const leftPillarBase = new THREE.Mesh(pillarCapGeo, materials.gold);
  leftPillarBase.position.set(-2.8, 0.18, 0);
  gateGroup.add(leftPillarBase);

  const leftPillarCap = new THREE.Mesh(pillarCapGeo, materials.gold);
  leftPillarCap.position.set(-2.8, 5.0, 0);
  gateGroup.add(leftPillarCap);

  // Right Gate Main Pillar
  const rightPillar = new THREE.Mesh(pillarGeo, materials.wood);
  rightPillar.position.set(2.8, 2.5, 0);
  rightPillar.castShadow = true;
  rightPillar.receiveShadow = true;
  gateGroup.add(rightPillar);

  const rightPillarTrim = new THREE.Mesh(pillarTrimGeo, materials.lacquerRed);
  rightPillarTrim.position.set(2.8, 2.5, 0);
  gateGroup.add(rightPillarTrim);

  const rightPillarBase = new THREE.Mesh(pillarCapGeo, materials.gold);
  rightPillarBase.position.set(2.8, 0.18, 0);
  gateGroup.add(rightPillarBase);

  const rightPillarCap = new THREE.Mesh(pillarCapGeo, materials.gold);
  rightPillarCap.position.set(2.8, 5.0, 0);
  gateGroup.add(rightPillarCap);

  // Top Architectural Architrave & Crossbeams
  const beamMainGeo = new THREE.BoxGeometry(7.0, 0.6, 0.8);
  const beamMain = new THREE.Mesh(beamMainGeo, materials.wood);
  beamMain.position.set(0, 5.1, 0);
  beamMain.castShadow = true;
  gateGroup.add(beamMain);

  const beamGoldTrimGeo = new THREE.BoxGeometry(7.1, 0.05, 0.85);
  const beamGoldTrim = new THREE.Mesh(beamGoldTrimGeo, materials.gold);
  beamGoldTrim.position.set(0, 4.78, 0);
  gateGroup.add(beamGoldTrim);

  const beamGoldTrimTop = new THREE.Mesh(beamGoldTrimGeo, materials.gold);
  beamGoldTrimTop.position.set(0, 5.42, 0);
  gateGroup.add(beamGoldTrimTop);

  // Architectural Header Signage Plaque (Mounted directly on gate header)
  const headerSignTexture = createGateHeaderSignageTexture();
  const signGeo = new THREE.PlaneGeometry(4.8, 1.2);
  const signMat = new THREE.MeshStandardMaterial({
    map: headerSignTexture,
    roughness: 0.3,
    metalness: 0.2,
  });
  const signMesh = new THREE.Mesh(signGeo, signMat);
  signMesh.position.set(0, 4.4, 0.42);
  gateGroup.add(signMesh);

  // AUTHENTIC OFFICIAL SCHOOL EMBLEM MOUNTED ATOP ENTRANCE GATE
  const emblemTex = createOfficialEmblemTexture();
  const emblemPlinthGeo = new THREE.BoxGeometry(1.4, 1.4, 0.1);
  const emblemPlinth = new THREE.Mesh(emblemPlinthGeo, materials.wood);
  emblemPlinth.position.set(0, 6.1, 0.38);
  emblemPlinth.rotation.z = Math.PI / 4; // diamond plinth matching the diamond emblem shield
  gateGroup.add(emblemPlinth);

  const emblemPlinthTrimGeo = new THREE.BoxGeometry(1.46, 1.46, 0.08);
  const emblemPlinthTrim = new THREE.Mesh(emblemPlinthTrimGeo, materials.gold);
  emblemPlinthTrim.position.set(0, 6.1, 0.36);
  emblemPlinthTrim.rotation.z = Math.PI / 4;
  gateGroup.add(emblemPlinthTrim);

  const gateEmblemGeo = new THREE.PlaneGeometry(1.3, 1.3);
  const gateEmblemMat = new THREE.MeshStandardMaterial({
    map: emblemTex,
    emissive: 0xffffff,
    emissiveMap: emblemTex,
    emissiveIntensity: 0.35,
    transparent: true,
    alphaTest: 0.05,
    roughness: 0.18,
    metalness: 0.12,
  });
  const gateEmblemMesh = new THREE.Mesh(gateEmblemGeo, gateEmblemMat);
  gateEmblemMesh.position.set(0, 6.1, 0.45);
  gateGroup.add(gateEmblemMesh);
  interactiveObjects.push(gateEmblemMesh);

  // Secondary side wings flanking the gate
  const wingGeo = new THREE.BoxGeometry(1.8, 4.4, 0.3);
  const leftWing = new THREE.Mesh(wingGeo, materials.wood);
  leftWing.position.set(-4.2, 2.3, -0.2);
  gateGroup.add(leftWing);

  const rightWing = new THREE.Mesh(wingGeo, materials.wood);
  rightWing.position.set(4.2, 2.3, -0.2);
  gateGroup.add(rightWing);

  // ==========================================
  // 5. THE SIGNATURE COSMIC GOLD RING
  // ==========================================
  // Primary Luminous Gold Ring
  const ringTorusGeo = new THREE.TorusGeometry(1.88, 0.055, 32, 100);
  const goldRing = new THREE.Mesh(ringTorusGeo, materials.goldLuminous);
  goldRing.position.set(0, 2.38, 0);
  gateGroup.add(goldRing);
  interactiveObjects.push(goldRing);

  // Outer Thin Decorative Concentric Ring
  const ringOuterGeo = new THREE.TorusGeometry(2.15, 0.018, 24, 100);
  const ringOuterMat = materials.gold.clone();
  ringOuterMat.roughness = 0.2;
  const goldRingOuter = new THREE.Mesh(ringOuterGeo, ringOuterMat);
  goldRingOuter.position.set(0, 2.38, -0.05);
  gateGroup.add(goldRingOuter);

  // Floating Concept Signage: [01 CỔNG VÀO] ENTER THE MEMORY
  const thresholdSignTexture = createThresholdSignageTexture();
  const thresholdSignGeo = new THREE.PlaneGeometry(2.4, 1.2);
  const thresholdSignMat = new THREE.MeshBasicMaterial({
    map: thresholdSignTexture,
    transparent: true,
    opacity: 0.95,
  });
  const thresholdSignMesh = new THREE.Mesh(thresholdSignGeo, thresholdSignMat);
  thresholdSignMesh.position.set(0, 2.38, 0.15);
  gateGroup.add(thresholdSignMesh);
  interactiveObjects.push(thresholdSignMesh);

  // Add gateGroup to master scene group
  group.add(gateGroup);

  // ==========================================
  // 6. DEEP BACKGROUND (BEYOND THE GATE)
  // ==========================================
  // Deep background portal frames creating infinite spatial continuation
  [-4, -8, -13, -19].forEach((zDepth, idx) => {
    const depthFrameGeo = new THREE.BoxGeometry(4.4 + idx * 0.8, 5.2 + idx * 0.4, 0.2);
    const depthFrame = new THREE.Mesh(depthFrameGeo, materials.ceiling);
    depthFrame.position.set(0, 2.6, zDepth);
    group.add(depthFrame);

    // Warm faint light node in the distance
    const innerLight = new THREE.PointLight(0xffdfa0, 0.6 / (idx + 1), 12);
    innerLight.position.set(0, 2.4, zDepth + 1);
    group.add(innerLight);
  });

  // ==========================================
  // 7. PARTICLES: STARS & ORBITAL DUST
  // ==========================================
  // A. Sparse 3D Star Particles (Atmospheric cosmic dust)
  const starCount = 450;
  const starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);
  const starAlphas = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 16;
    starPositions[i * 3 + 1] = Math.random() * 5.6 + 0.2;
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 26 + 2;
    starAlphas[i] = Math.random() * 0.7 + 0.3;
  }

  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

  const starMat = new THREE.PointsMaterial({
    color: 0xfff0cc,
    size: 0.038,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
  });

  const starParticles = new THREE.Points(starGeo, starMat);
  group.add(starParticles);

  // B. Orbital Particles revolving around the Gold Ring
  const orbitCount = 80;
  const orbitGeo = new THREE.BufferGeometry();
  const orbitPositions = new Float32Array(orbitCount * 3);

  for (let i = 0; i < orbitCount; i++) {
    const angle = (i / orbitCount) * Math.PI * 2;
    const radius = 1.88 + (Math.random() - 0.5) * 0.24;
    orbitPositions[i * 3] = Math.cos(angle) * radius;
    orbitPositions[i * 3 + 1] = 2.38 + Math.sin(angle) * radius;
    orbitPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
  }

  orbitGeo.setAttribute('position', new THREE.BufferAttribute(orbitPositions, 3));

  const orbitMat = new THREE.PointsMaterial({
    color: 0xffd988,
    size: 0.052,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  const orbitalParticles = new THREE.Points(orbitGeo, orbitMat);
  group.add(orbitalParticles);

  // ==========================================
  // 8. SIGNATURE LIGHTING RIG
  // ==========================================
  // Signature Gold Ring Point Light (Creates warm radiance on threshold and pillars)
  const ringPointLight = new THREE.PointLight(0xffdf9a, 2.2, 10, 1.8);
  ringPointLight.position.set(0, 2.38, 0.4);
  group.add(ringPointLight);

  // Spotlight focusing on the approach pathway
  const pathSpotLight = new THREE.SpotLight(0xfff1d0, 1.8);
  pathSpotLight.position.set(0, 5.4, 4.0);
  pathSpotLight.target = stepMesh;
  pathSpotLight.angle = 0.55;
  pathSpotLight.penumbra = 0.6;
  pathSpotLight.distance = 14;
  group.add(pathSpotLight);

  // Side Wall Sconce Lights (Warm museum framing)
  [-4, 2, 8].forEach((zVal) => {
    const leftSconce = new THREE.PointLight(0xffd588, 0.45, 6, 2);
    leftSconce.position.set(-7.5, 3.2, zVal);
    group.add(leftSconce);

    const rightSconce = new THREE.PointLight(0xffd588, 0.45, 6, 2);
    rightSconce.position.set(7.5, 3.2, zVal);
    group.add(rightSconce);
  });

  // ==========================================
  // 9. MYSTICAL GROUND FOG & VOLUMETRIC HAZE
  // ==========================================
  const fogPlanes: THREE.Mesh[] = [];
  const fogTexture = createMysticalFogPuffTexture();
  const fogPlaneGeo = new THREE.PlaneGeometry(5.2, 5.2);

  // Generate 16 ground fog patches drifting along the entrance axis
  const fogPositions = [
    [-1.2, 0.14, 1.2],
    [1.1, 0.16, 2.4],
    [-0.5, 0.18, 4.2],
    [1.4, 0.12, 5.8],
    [-1.5, 0.22, 7.5],
    [0.3, 0.15, 8.8],
    [-0.8, 0.19, 10.2],
    [1.2, 0.14, 11.5],
    [0.0, 0.12, 0.2], // Direct threshold
    [-1.8, 0.25, -1.2], // Behind gate left
    [1.8, 0.25, -1.2], // Behind gate right
    [0.0, 0.28, -2.5], // Deep beyond gate
    [-2.2, 0.18, 3.5],
    [2.2, 0.18, 3.5],
    [-2.0, 0.22, 8.0],
    [2.0, 0.22, 8.0],
  ];

  fogPositions.forEach((pos, idx) => {
    const fogMat = new THREE.MeshBasicMaterial({
      map: fogTexture,
      transparent: true,
      opacity: 0.32 + (idx % 3) * 0.05,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: idx % 2 === 0 ? 0xffdfa8 : 0xadc0e8, // Blend of warm heritage amber and midnight mist
    });

    const fogMesh = new THREE.Mesh(fogPlaneGeo, fogMat);
    fogMesh.rotation.x = -Math.PI / 2;
    fogMesh.rotation.z = Math.random() * Math.PI * 2;
    fogMesh.position.set(pos[0], pos[1], pos[2]);
    group.add(fogMesh);
    fogPlanes.push(fogMesh);
  });

  // Volumetric Warm God Ray / Atmospheric Light Beam through the gate
  const beamGeo = new THREE.CylinderGeometry(1.6, 2.8, 8.0, 32, 1, true);
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xffdca0,
    transparent: true,
    opacity: 0.09,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const volumetricBeam = new THREE.Mesh(beamGeo, beamMat);
  volumetricBeam.rotation.x = Math.PI / 2;
  volumetricBeam.position.set(0, 2.38, 1.5);
  group.add(volumetricBeam);

  return {
    group,
    goldRing,
    goldRingOuter,
    orbitalParticles,
    starParticles,
    ringPointLight,
    pathSpotLight,
    interactiveObjects,
    fogPlanes,
    volumetricBeam,
  };
}
