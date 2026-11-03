import * as THREE from 'three';
import { lobbyConfig, GatewayInfo } from '../config/lobbyConfig';
import { LobbyMaterialSet } from '../materials/LobbyMaterials';
import {
  createWelcomeCeremonialTexture,
  createSpatialMuseumMapTexture,
  createGatewayPlaqueTexture,
  createVisitorGuidePlaqueTexture,
} from '../textures/LobbyProceduralTextures';

export interface GatewayMeshObject {
  info: GatewayInfo;
  group: THREE.Group;
  light: THREE.SpotLight;
  plaqueMesh: THREE.Mesh;
  thresholdMesh: THREE.Mesh;
}

export interface CeremonialTorchObject {
  group: THREE.Group;
  light: THREE.PointLight;
  flameMesh: THREE.Mesh;
  baseIntensity: number;
  flameCoreMesh?: THREE.Mesh;
  emberPoints?: THREE.Points;
  emberPositions?: Float32Array;
}

export interface LobbySceneElements {
  masterGroup: THREE.Group;
  centerpieceGroup: THREE.Group;
  centerpieceRing?: THREE.Mesh;
  energyFireRing?: THREE.Mesh;
  flameAuraGroup?: THREE.Group;
  emberParticles?: THREE.Points;
  centerpieceOrbitParticles?: THREE.Points;
  starParticles?: THREE.Points;
  blackHoleSphere?: THREE.Mesh;
  emblemMesh: THREE.Mesh;
  frontMedallionMesh?: THREE.Mesh;
  saturnRingGroup?: THREE.Group;
  saturnStarBelt?: THREE.Points;
  orbitalRingGroups?: THREE.Group[];
  torches?: CeremonialTorchObject[];
  orbitingMedallionGroup?: THREE.Group;
  orbitTrack?: THREE.Mesh;
  gateways: GatewayMeshObject[];
  mapConsoleGroup: THREE.Group;
  guideConsoleGroup: THREE.Group;
  guidePanelMesh: THREE.Mesh;
  centerLight: THREE.SpotLight;
  interactiveMeshes: THREE.Object3D[];
  updateEmbers?: (delta: number) => void;
}

export function buildGrandLobbyArchitecture(
  materials: LobbyMaterialSet,
  lang: 'vi' | 'en' = 'vi'
): LobbySceneElements {
  const masterGroup = new THREE.Group();
  const interactiveMeshes: THREE.Object3D[] = [];
  const gateways: GatewayMeshObject[] = [];

  const { width, length, height } = lobbyConfig.dimensions;

  // ==========================================
  // 1. FLOOR & REFINED WARM IVORY STONE WALKWAY
  // ==========================================
  // Main Grand Polished Crema Marfil Stone Floor
  const floorGeo = new THREE.PlaneGeometry(width, length);
  const floorMesh = new THREE.Mesh(floorGeo, materials.marbleFloor);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0, 0);
  floorMesh.receiveShadow = true;
  masterGroup.add(floorMesh);

  // Ceremonial Central Walkway: Refined Light Stone Path (Proportionate 3.6m width, no red carpet)
  const axisGeo = new THREE.PlaneGeometry(3.6, length - 4);
  const axisMesh = new THREE.Mesh(axisGeo, materials.axisPath);
  axisMesh.rotation.x = -Math.PI / 2;
  axisMesh.position.set(0, 0.008, 0);
  axisMesh.receiveShadow = true;
  masterGroup.add(axisMesh);

  // Left & Right Walkway Inlay Borders (Slender continuous polished champagne-gold strips)
  const stripGeo = new THREE.BoxGeometry(0.045, 0.016, length - 4);
  const leftAxisStrip = new THREE.Mesh(stripGeo, materials.brushedBrass);
  leftAxisStrip.position.set(-1.82, 0.012, 0);
  masterGroup.add(leftAxisStrip);

  const rightAxisStrip = new THREE.Mesh(stripGeo, materials.brushedBrass);
  rightAxisStrip.position.set(1.82, 0.012, 0);
  masterGroup.add(rightAxisStrip);

  // ==========================================
  // 2. LAYERED COFFERED CEILING & UNIFIED ARCHITECTURAL BEAMS
  // ==========================================
  const ceilingGeo = new THREE.PlaneGeometry(width, length);
  const ceilingMesh = new THREE.Mesh(ceilingGeo, materials.cofferedCeiling);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(0, height, 0);
  masterGroup.add(ceilingMesh);

  // Symmetrical circular champagne-gold ceiling motifs above the central rotunda
  const centralCeilingRing = new THREE.Mesh(
    new THREE.RingGeometry(3.6, 3.72, 64),
    materials.brushedBrass
  );
  centralCeilingRing.rotation.x = Math.PI / 2;
  centralCeilingRing.position.set(0, height - 0.04, 0);
  masterGroup.add(centralCeilingRing);

  const centralCeilingInnerRing = new THREE.Mesh(
    new THREE.RingGeometry(2.35, 2.44, 64),
    materials.brushedBrass
  );
  centralCeilingInnerRing.rotation.x = Math.PI / 2;
  centralCeilingInnerRing.position.set(0, height - 0.04, 0);
  masterGroup.add(centralCeilingInnerRing);

  // Transverse Architectural Beams: Refined proportions in Warm Ivory Limestone & Champagne Gold Moldings
  [-20, -12, -4, 4, 12, 20].forEach((zPos) => {
    // Structural beam fascia in warm ivory limestone
    const rib = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.22, 0.44),
      materials.gateIvoryStone
    );
    rib.position.set(0, height - 0.11, zPos);
    masterGroup.add(rib);

    // Stepped champagne-gold soffit molding
    const ribTrim = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.04, 0.50),
      materials.brushedBrass
    );
    ribTrim.position.set(0, height - 0.23, zPos);
    masterGroup.add(ribTrim);

    // Warm champagne indirect downlight pool
    const downlight = new THREE.PointLight(0xFFE8BA, 1.1, 14, 1.8);
    downlight.position.set(0, height - 0.38, zPos);
    masterGroup.add(downlight);

    // Soft lateral cove lights
    const leftCove = new THREE.PointLight(0xFFF1D8, 0.65, 10, 2.0);
    leftCove.position.set(-11.5, height - 0.38, zPos);
    masterGroup.add(leftCove);

    const rightCove = new THREE.PointLight(0xFFF1D8, 0.65, 10, 2.0);
    rightCove.position.set(11.5, height - 0.38, zPos);
    masterGroup.add(rightCove);
  });

  // ==========================================
  // 3. ARCHITECTURAL PERIMETER WALLS & SOCLES
  // ==========================================
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(length, height),
    materials.wallStone
  );
  leftWall.position.set(-width / 2, height / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  masterGroup.add(leftWall);

  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(length, height),
    materials.wallStone
  );
  rightWall.position.set(width / 2, height / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  masterGroup.add(rightWall);

  const rearWall = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    materials.wallStone
  );
  rearWall.position.set(0, height / 2, -length / 2);
  masterGroup.add(rearWall);

  const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    materials.wallStone
  );
  frontWall.position.set(0, height / 2, length / 2);
  frontWall.rotation.y = Math.PI;
  masterGroup.add(frontWall);

  // Continuous Architectural Baseboards (Socle) in warm stone with champagne-gold torus trim
  const baseboardHeight = 0.36;
  const baseboardDepth = 0.08;

  const leftBaseboard = new THREE.Mesh(
    new THREE.BoxGeometry(baseboardDepth, baseboardHeight, length),
    materials.gateIvoryStone
  );
  leftBaseboard.position.set(-width / 2 + baseboardDepth / 2, baseboardHeight / 2, 0);
  masterGroup.add(leftBaseboard);

  const leftBaseCap = new THREE.Mesh(
    new THREE.BoxGeometry(baseboardDepth + 0.03, 0.03, length),
    materials.brushedBrass
  );
  leftBaseCap.position.set(-width / 2 + baseboardDepth / 2, baseboardHeight + 0.015, 0);
  masterGroup.add(leftBaseCap);

  const rightBaseboard = new THREE.Mesh(
    new THREE.BoxGeometry(baseboardDepth, baseboardHeight, length),
    materials.gateIvoryStone
  );
  rightBaseboard.position.set(width / 2 - baseboardDepth / 2, baseboardHeight / 2, 0);
  masterGroup.add(rightBaseboard);

  const rightBaseCap = new THREE.Mesh(
    new THREE.BoxGeometry(baseboardDepth + 0.03, 0.03, length),
    materials.brushedBrass
  );
  rightBaseCap.position.set(width / 2 - baseboardDepth / 2, baseboardHeight + 0.015, 0);
  masterGroup.add(rightBaseCap);

  // Continuous Architectural Crown Entablature at Wall Tops
  const corniceHeight = 0.38;
  const corniceDepth = 0.20;

  const leftCornice = new THREE.Mesh(
    new THREE.BoxGeometry(corniceDepth, corniceHeight, length),
    materials.gateIvoryStone
  );
  leftCornice.position.set(-width / 2 + corniceDepth / 2, height - corniceHeight / 2, 0);
  masterGroup.add(leftCornice);

  const leftCorniceGold = new THREE.Mesh(
    new THREE.BoxGeometry(corniceDepth + 0.04, 0.04, length),
    materials.brushedBrass
  );
  leftCorniceGold.position.set(-width / 2 + corniceDepth / 2, height - corniceHeight - 0.02, 0);
  masterGroup.add(leftCorniceGold);

  const rightCornice = new THREE.Mesh(
    new THREE.BoxGeometry(corniceDepth, corniceHeight, length),
    materials.gateIvoryStone
  );
  rightCornice.position.set(width / 2 - corniceDepth / 2, height - corniceHeight / 2, 0);
  masterGroup.add(rightCornice);

  const rightCorniceGold = new THREE.Mesh(
    new THREE.BoxGeometry(corniceDepth + 0.04, 0.04, length),
    materials.brushedBrass
  );
  rightCorniceGold.position.set(width / 2 - corniceDepth / 2, height - corniceHeight - 0.02, 0);
  masterGroup.add(rightCorniceGold);

  // Wall Pilaster Projections along Left & Right Walls
  [-18, -10, -2, 6, 14, 21].forEach((zPos) => {
    const leftPilaster = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, height, 0.95),
      materials.gateIvoryStone
    );
    leftPilaster.position.set(-width / 2 + 0.06, height / 2, zPos);
    masterGroup.add(leftPilaster);

    const leftPilasterTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.06, 1.02),
      materials.brushedBrass
    );
    leftPilasterTrim.position.set(-width / 2 + 0.07, height - 0.40, zPos);
    masterGroup.add(leftPilasterTrim);

    const rightPilaster = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, height, 0.95),
      materials.gateIvoryStone
    );
    rightPilaster.position.set(width / 2 - 0.06, height / 2, zPos);
    masterGroup.add(rightPilaster);

    const rightPilasterTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.06, 1.02),
      materials.brushedBrass
    );
    rightPilasterTrim.position.set(width / 2 - 0.07, height - 0.40, zPos);
    masterGroup.add(rightPilasterTrim);
  });

  // Ceremonial Welcome Plaque on Rear Upper Wall (Elevated to y = 7.75m, completely clear of the doorway portal & fully visible)
  const welcomeTex = createWelcomeCeremonialTexture();
  const welcomeGeo = new THREE.PlaneGeometry(9.8, 2.45);
  const welcomeMat = new THREE.MeshStandardMaterial({
    map: welcomeTex,
    transparent: true,
    roughness: 0.28,
    metalness: 0.35,
  });
  const welcomeMesh = new THREE.Mesh(welcomeGeo, welcomeMat);
  welcomeMesh.position.set(0, 7.75, -length / 2 + 0.15);
  masterGroup.add(welcomeMesh);

  // Dedicated warm golden wash light ensuring the elevated ceremonial sign is crisply illuminated
  const welcomeWashLight = new THREE.PointLight(0xFFE5B0, 1.25, 12, 1.8);
  welcomeWashLight.position.set(0, 7.75, -length / 2 + 1.8);
  masterGroup.add(welcomeWashLight);

  // ==========================================
  // 4. DOUBLE COLONNADE: REFINED WARM HONED IVORY LIMESTONE & BALANCED BASES
  // (Reduces heavy dark bases in favor of refined, luminous proportions)
  // ==========================================
  const colShaftGeo = new THREE.CylinderGeometry(0.38, 0.42, height - 0.8, 32);
  const colBaseGeo = new THREE.BoxGeometry(0.96, 0.18, 0.96);
  const colBaseScotiaGeo = new THREE.CylinderGeometry(0.48, 0.54, 0.16, 32);
  const colCapAbacusGeo = new THREE.BoxGeometry(1.10, 0.24, 1.10);

  const colZPositions = [-18, -10, -2, 6, 14, 21];

  colZPositions.forEach((zPos) => {
    // LEFT ROW (x = -7.6)
    const leftShaft = new THREE.Mesh(colShaftGeo, materials.gateIvoryStone);
    leftShaft.position.set(-7.6, height / 2, zPos);
    leftShaft.castShadow = true;
    leftShaft.receiveShadow = true;
    masterGroup.add(leftShaft);

    // Refined Stepped Base in warm ivory stone with thin bronze foot and gold collar
    const leftBronzeFoot = new THREE.Mesh(
      new THREE.BoxGeometry(1.02, 0.05, 1.02),
      materials.bronzeTrim
    );
    leftBronzeFoot.position.set(-7.6, 0.025, zPos);
    masterGroup.add(leftBronzeFoot);

    const leftBase = new THREE.Mesh(colBaseGeo, materials.gateIvoryStone);
    leftBase.position.set(-7.6, 0.14, zPos);
    masterGroup.add(leftBase);

    const leftBaseScotia = new THREE.Mesh(colBaseScotiaGeo, materials.gateIvoryStone);
    leftBaseScotia.position.set(-7.6, 0.31, zPos);
    masterGroup.add(leftBaseScotia);

    const leftBaseTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.035, 16, 32),
      materials.brushedBrass
    );
    leftBaseTorus.rotation.x = Math.PI / 2;
    leftBaseTorus.position.set(-7.6, 0.40, zPos);
    masterGroup.add(leftBaseTorus);

    // Classical Capital
    const leftCapTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.44, 0.035, 16, 32),
      materials.brushedBrass
    );
    leftCapTorus.rotation.x = Math.PI / 2;
    leftCapTorus.position.set(-7.6, height - 0.46, zPos);
    masterGroup.add(leftCapTorus);

    const leftCapAbacus = new THREE.Mesh(colCapAbacusGeo, materials.gateIvoryStone);
    leftCapAbacus.position.set(-7.6, height - 0.28, zPos);
    masterGroup.add(leftCapAbacus);

    const leftCapGoldTrim = new THREE.Mesh(
      new THREE.BoxGeometry(1.16, 0.04, 1.16),
      materials.brushedBrass
    );
    leftCapGoldTrim.position.set(-7.6, height - 0.14, zPos);
    masterGroup.add(leftCapGoldTrim);

    // Column Sconce Lantern in Champagne Gold
    const leftSconceLight = new THREE.PointLight(0xFFE5A8, 1.1, 9, 1.8);
    leftSconceLight.position.set(-6.9, 3.4, zPos);
    masterGroup.add(leftSconceLight);

    const leftSconceMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.05, 0.22, 16),
      materials.brushedBrass
    );
    leftSconceMesh.position.set(-7.06, 3.4, zPos);
    masterGroup.add(leftSconceMesh);

    // RIGHT ROW (x = 7.6)
    const rightShaft = new THREE.Mesh(colShaftGeo, materials.gateIvoryStone);
    rightShaft.position.set(7.6, height / 2, zPos);
    rightShaft.castShadow = true;
    rightShaft.receiveShadow = true;
    masterGroup.add(rightShaft);

    const rightBronzeFoot = new THREE.Mesh(
      new THREE.BoxGeometry(1.02, 0.05, 1.02),
      materials.bronzeTrim
    );
    rightBronzeFoot.position.set(7.6, 0.025, zPos);
    masterGroup.add(rightBronzeFoot);

    const rightBase = new THREE.Mesh(colBaseGeo, materials.gateIvoryStone);
    rightBase.position.set(7.6, 0.14, zPos);
    masterGroup.add(rightBase);

    const rightBaseScotia = new THREE.Mesh(colBaseScotiaGeo, materials.gateIvoryStone);
    rightBaseScotia.position.set(7.6, 0.31, zPos);
    masterGroup.add(rightBaseScotia);

    const rightBaseTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.48, 0.035, 16, 32),
      materials.brushedBrass
    );
    rightBaseTorus.rotation.x = Math.PI / 2;
    rightBaseTorus.position.set(7.6, 0.40, zPos);
    masterGroup.add(rightBaseTorus);

    const rightCapTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.44, 0.035, 16, 32),
      materials.brushedBrass
    );
    rightCapTorus.rotation.x = Math.PI / 2;
    rightCapTorus.position.set(7.6, height - 0.46, zPos);
    masterGroup.add(rightCapTorus);

    const rightCapAbacus = new THREE.Mesh(colCapAbacusGeo, materials.gateIvoryStone);
    rightCapAbacus.position.set(7.6, height - 0.28, zPos);
    masterGroup.add(rightCapAbacus);

    const rightCapGoldTrim = new THREE.Mesh(
      new THREE.BoxGeometry(1.16, 0.04, 1.16),
      materials.brushedBrass
    );
    rightCapGoldTrim.position.set(7.6, height - 0.14, zPos);
    masterGroup.add(rightCapGoldTrim);

    const rightSconceLight = new THREE.PointLight(0xFFE5A8, 1.1, 9, 1.8);
    rightSconceLight.position.set(6.9, 3.4, zPos);
    masterGroup.add(rightSconceLight);

    const rightSconceMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.05, 0.22, 16),
      materials.brushedBrass
    );
    rightSconceMesh.position.set(7.06, 3.4, zPos);
    masterGroup.add(rightSconceMesh);
  });

  // Longitudinal Architrave Entablature atop columns in warm ivory limestone
  const architraveGeo = new THREE.BoxGeometry(0.72, 0.42, length - 4);
  const leftArchitrave = new THREE.Mesh(architraveGeo, materials.gateIvoryStone);
  leftArchitrave.position.set(-7.6, height - 0.38, 1.5);
  masterGroup.add(leftArchitrave);

  const leftArchitraveGold = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.04, length - 4),
    materials.brushedBrass
  );
  leftArchitraveGold.position.set(-7.6, height - 0.15, 1.5);
  masterGroup.add(leftArchitraveGold);

  const rightArchitrave = new THREE.Mesh(architraveGeo, materials.gateIvoryStone);
  rightArchitrave.position.set(7.6, height - 0.38, 1.5);
  masterGroup.add(rightArchitrave);

  const rightArchitraveGold = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.04, length - 4),
    materials.brushedBrass
  );
  rightArchitraveGold.position.set(7.6, height - 0.15, 1.5);
  masterGroup.add(rightArchitraveGold);

  // ==========================================
  // 5. REFINED 60-YEAR ANNIVERSARY CENTERPIECE WITH AUTHENTIC SCHOOL EMBLEM
  // (Eliminates oversized black sphere, chaotic intersecting rings, scattered cones & clutter)
  // Clear primary focal point: Authentic school emblem mounted honorifically facing the main entrance
  // ==========================================
  // ==========================================
  // 5. MASTER 60-YEAR HERITAGE CENTERPIECE & CEREMONIAL TORCHES
  // (Stationary Black Sphere + Fixed Top THD Emblem + 3 Golden Orbital Rings + Symmetrical Torches)
  // ==========================================
  const centerpieceGroup = new THREE.Group();
  centerpieceGroup.position.set(0, 0, 0);

  // ------------------------------------------
  // 5A. REFINED MULTI-TIER CIRCULAR PODIUM & FLOOR INLAY ACCENTS
  // ------------------------------------------
  // Concentric Champagne-Gold Floor Inlay Rings around Podium
  const floorInlayRing1 = new THREE.Mesh(
    new THREE.RingGeometry(3.60, 3.65, 64),
    materials.brushedBrass
  );
  floorInlayRing1.rotation.x = -Math.PI / 2;
  floorInlayRing1.position.set(0, 0.012, 0);
  masterGroup.add(floorInlayRing1);

  const floorInlayRing2 = new THREE.Mesh(
    new THREE.RingGeometry(4.25, 4.30, 64),
    materials.brushedBrass
  );
  floorInlayRing2.rotation.x = -Math.PI / 2;
  floorInlayRing2.position.set(0, 0.012, 0);
  masterGroup.add(floorInlayRing2);

  // Radial Champagne-Gold Inlaid Floor Strips connecting to walkway
  [-4.25, 4.25].forEach((pos) => {
    const stripX = new THREE.Mesh(
      new THREE.BoxGeometry(1.2, 0.016, 0.045),
      materials.brushedBrass
    );
    stripX.position.set(pos > 0 ? 3.95 : -3.95, 0.014, 0);
    masterGroup.add(stripX);

    const stripZ = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 0.016, 1.2),
      materials.brushedBrass
    );
    stripZ.position.set(0, 0.014, pos > 0 ? 3.95 : -3.95);
    masterGroup.add(stripZ);
  });

  // Tier 1: Wide Ground Circular Plinth (radius 3.25m, height 0.14m) in Crema Marfil Stone
  const baseStep1 = new THREE.Mesh(
    new THREE.CylinderGeometry(3.15, 3.28, 0.14, 64),
    materials.marbleFloor
  );
  baseStep1.position.set(0, 0.07, 0);
  baseStep1.receiveShadow = true;
  centerpieceGroup.add(baseStep1);

  // Champagne Gold Torus Nosing on Tier 1
  const step1GoldTorus = new THREE.Mesh(
    new THREE.TorusGeometry(3.18, 0.024, 16, 64),
    materials.brushedBrass
  );
  step1GoldTorus.rotation.x = Math.PI / 2;
  step1GoldTorus.position.set(0, 0.14, 0);
  centerpieceGroup.add(step1GoldTorus);

  // Tier 2: Middle Terrace with Vertical Gold Lighting Reveals (radius 2.30m, height 0.22m)
  const baseStep2 = new THREE.Mesh(
    new THREE.CylinderGeometry(2.20, 2.32, 0.22, 64),
    materials.gateIvoryStone
  );
  baseStep2.position.set(0, 0.25, 0);
  baseStep2.receiveShadow = true;
  centerpieceGroup.add(baseStep2);

  const step2GoldTorus = new THREE.Mesh(
    new THREE.TorusGeometry(2.22, 0.022, 16, 64),
    materials.brushedBrass
  );
  step2GoldTorus.rotation.x = Math.PI / 2;
  step2GoldTorus.position.set(0, 0.36, 0);
  centerpieceGroup.add(step2GoldTorus);

  // Vertical Architectural Champagne-Gold Fluted Reveals on Tier 2 (16 reveals)
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const revealMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.18, 0.06),
      materials.brushedBrass
    );
    revealMesh.position.set(
      Math.sin(angle) * 2.26,
      0.25,
      Math.cos(angle) * 2.26
    );
    revealMesh.rotation.y = angle;
    centerpieceGroup.add(revealMesh);
  }

  // Soft warm indirect cove glow on Tier 2 lip
  const podiumCoveLight = new THREE.PointLight(0xFFE8BA, 1.2, 7.5, 2.0);
  podiumCoveLight.position.set(0, 0.42, 0);
  centerpieceGroup.add(podiumCoveLight);

  // Tier 3: Upper Pedestal Plinth (radius 1.25m, height 0.32m) in Warm Ivory Limestone
  const pedestalCore = new THREE.Mesh(
    new THREE.CylinderGeometry(1.15, 1.26, 0.32, 48),
    materials.gateIvoryStone
  );
  pedestalCore.position.set(0, 0.52, 0);
  pedestalCore.receiveShadow = true;
  centerpieceGroup.add(pedestalCore);

  const pedestalBaseTorus = new THREE.Mesh(
    new THREE.TorusGeometry(1.24, 0.028, 16, 48),
    materials.brushedBrass
  );
  pedestalBaseTorus.rotation.x = Math.PI / 2;
  pedestalBaseTorus.position.set(0, 0.38, 0);
  centerpieceGroup.add(pedestalBaseTorus);

  const pedestalCapTorus = new THREE.Mesh(
    new THREE.TorusGeometry(1.16, 0.032, 16, 48),
    materials.brushedBrass
  );
  pedestalCapTorus.rotation.x = Math.PI / 2;
  pedestalCapTorus.position.set(0, 0.68, 0);
  centerpieceGroup.add(pedestalCapTorus);

  // Gilded Bronze Commemorative Inscription Plaque Mounted on Tier 3 Plinth Face (facing South +Z)
  const plaqueCanvas = document.createElement('canvas');
  plaqueCanvas.width = 1024;
  plaqueCanvas.height = 256;
  const pctx = plaqueCanvas.getContext('2d');
  if (pctx) {
    pctx.fillStyle = '#1D1612';
    pctx.fillRect(0, 0, 1024, 256);
    pctx.strokeStyle = '#D4AF37';
    pctx.lineWidth = 8;
    pctx.strokeRect(10, 10, 1004, 236);
    pctx.strokeStyle = 'rgba(255, 235, 175, 0.7)';
    pctx.lineWidth = 2.5;
    pctx.strokeRect(22, 22, 980, 212);
    pctx.fillStyle = '#FFF5E0';
    pctx.font = 'bold 36px "Noto Serif", "Be Vietnam Pro", Georgia, serif';
    pctx.textAlign = 'center';
    pctx.textBaseline = 'middle';
    pctx.fillText('TRƯỜNG THPT A TRẦN HƯNG ĐẠO'.normalize('NFC'), 512, 85);
    pctx.fillStyle = '#E8CE85';
    pctx.font = 'italic 28px "Be Vietnam Pro", "Noto Sans", sans-serif';
    pctx.fillText('1966 – 2026 • 60 NĂM DI SẢN & TỰ HÀO'.normalize('NFC'), 512, 165);
  }
  const plaqueTex = new THREE.CanvasTexture(plaqueCanvas);
  const plaqueMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.35, 0.32),
    new THREE.MeshStandardMaterial({
      map: plaqueTex,
      roughness: 0.28,
      metalness: 0.50,
    })
  );
  plaqueMesh.position.set(0, 0.52, 1.25);
  centerpieceGroup.add(plaqueMesh);

  // Champagne-Gold Sphere Support Plinth Collar (y = 0.68m to 1.02m)
  const sphereSupportCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.92, 0.98, 0.32, 48),
    materials.brushedBrass
  );
  sphereSupportCollar.position.set(0, 0.84, 0);
  centerpieceGroup.add(sphereSupportCollar);

  const sphereCollarTorus = new THREE.Mesh(
    new THREE.TorusGeometry(0.92, 0.035, 16, 48),
    materials.brushedBrass
  );
  sphereCollarTorus.rotation.x = Math.PI / 2;
  sphereCollarTorus.position.set(0, 1.00, 0);
  centerpieceGroup.add(sphereCollarTorus);

  // ------------------------------------------
  // 5B. 60-YEAR HERITAGE OBSIDIAN SPHERE & EMBEDDED DECORATIVE GROOVES & BANDS
  // Positioned firmly at center (0, 1.95, 0) with radius 0.95m.
  // Rotated by -Math.PI / 2 so prime meridian and equatorial 60-Year inscriptions
  // face South (+Z) directly toward the ceremonial entrance walkway.
  // ------------------------------------------
  const blackHoleSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.95, 64, 64),
    materials.obsidianSphere
  );
  blackHoleSphere.position.set(0, 1.95, 0);
  blackHoleSphere.rotation.y = -Math.PI / 2;
  blackHoleSphere.castShadow = true;
  blackHoleSphere.receiveShadow = true;
  centerpieceGroup.add(blackHoleSphere);
  interactiveMeshes.push(blackHoleSphere);

  // ------------------------------------------
  // 5B.1 DECORATIVE GROOVES, PATTERNED BANDS & ORNAMENTAL DETAILS AROUND THE SPHERE
  // ------------------------------------------
  // 1. Primary Champagne-Gold Equatorial Patterned Band (y = 1.95m, R = 0.958m)
  const equatorGoldBand = new THREE.Mesh(
    new THREE.TorusGeometry(0.958, 0.016, 16, 128),
    materials.brushedBrass
  );
  equatorGoldBand.rotation.x = Math.PI / 2;
  equatorGoldBand.position.set(0, 1.95, 0);
  centerpieceGroup.add(equatorGoldBand);

  // 2. Upper and Lower Architectural Shadow Reveal Grooves flanking the Equatorial Band
  const equatorUpperGroove = new THREE.Mesh(
    new THREE.TorusGeometry(0.952, 0.007, 16, 128),
    materials.bronzeTrim
  );
  equatorUpperGroove.rotation.x = Math.PI / 2;
  equatorUpperGroove.position.set(0, 1.98, 0);
  centerpieceGroup.add(equatorUpperGroove);

  const equatorLowerGroove = new THREE.Mesh(
    new THREE.TorusGeometry(0.952, 0.007, 16, 128),
    materials.bronzeTrim
  );
  equatorLowerGroove.rotation.x = Math.PI / 2;
  equatorLowerGroove.position.set(0, 1.92, 0);
  centerpieceGroup.add(equatorLowerGroove);

  // 3. Upper Tropical Patterned Orbit Band (Latitude +30°, y = 2.425m, R = 0.823m)
  const upperTropicalBand = new THREE.Mesh(
    new THREE.TorusGeometry(0.826, 0.012, 16, 96),
    materials.brushedBrass
  );
  upperTropicalBand.rotation.x = Math.PI / 2;
  upperTropicalBand.position.set(0, 2.425, 0);
  centerpieceGroup.add(upperTropicalBand);

  const upperTropicalGroove = new THREE.Mesh(
    new THREE.TorusGeometry(0.822, 0.006, 16, 96),
    materials.bronzeTrim
  );
  upperTropicalGroove.rotation.x = Math.PI / 2;
  upperTropicalGroove.position.set(0, 2.445, 0);
  centerpieceGroup.add(upperTropicalGroove);

  // 4. Lower Tropical Patterned Orbit Band (Latitude -30°, y = 1.475m, R = 0.823m)
  const lowerTropicalBand = new THREE.Mesh(
    new THREE.TorusGeometry(0.826, 0.012, 16, 96),
    materials.brushedBrass
  );
  lowerTropicalBand.rotation.x = Math.PI / 2;
  lowerTropicalBand.position.set(0, 1.475, 0);
  centerpieceGroup.add(lowerTropicalBand);

  const lowerTropicalGroove = new THREE.Mesh(
    new THREE.TorusGeometry(0.822, 0.006, 16, 96),
    materials.bronzeTrim
  );
  lowerTropicalGroove.rotation.x = Math.PI / 2;
  lowerTropicalGroove.position.set(0, 1.455, 0);
  centerpieceGroup.add(lowerTropicalGroove);

  // 5. Four Vertical Meridian Architectural Clasp Ribs (at 0°, 90°, 180°, 270°)
  // Hugging the sphere contour from lower collar (y = 1.05m) to upper finial base (y = 2.85m)
  [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].forEach((quadAngle) => {
    // Generate curved meridian arc points adhering to sphere radius 0.958m
    const ribPts: THREE.Vector3[] = [];
    const numSteps = 24;
    for (let s = 0; s <= numSteps; s++) {
      const phi = -1.22 + (s / numSteps) * 2.44; // polar angle from south to north hemisphere
      const r = Math.cos(phi) * 0.958;
      const y = 1.95 + Math.sin(phi) * 0.958;
      const x = Math.sin(quadAngle) * r;
      const z = Math.cos(quadAngle) * r;
      ribPts.push(new THREE.Vector3(x, y, z));
    }
    const ribCurve = new THREE.CatmullRomCurve3(ribPts);
    const ribGeo = new THREE.TubeGeometry(ribCurve, 28, 0.010, 8, false);
    const ribMesh = new THREE.Mesh(ribGeo, materials.brushedBrass);
    centerpieceGroup.add(ribMesh);

    // Sculpted champagne-gold rosette boss at the equatorial intersection
    const rosetteBoss = new THREE.Mesh(
      new THREE.SphereGeometry(0.026, 16, 16),
      materials.brushedBrass
    );
    rosetteBoss.position.set(
      Math.sin(quadAngle) * 0.965,
      1.95,
      Math.cos(quadAngle) * 0.965
    );
    centerpieceGroup.add(rosetteBoss);

    const rosetteBacking = new THREE.Mesh(
      new THREE.CylinderGeometry(0.040, 0.040, 0.012, 16),
      materials.bronzeTrim
    );
    rosetteBacking.position.copy(rosetteBoss.position);
    rosetteBacking.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(Math.sin(quadAngle), 0, Math.cos(quadAngle))
    );
    centerpieceGroup.add(rosetteBacking);
  });

  // ------------------------------------------
  // 5C.0 HONORIFIC AUTHENTIC SCHOOL EMBLEM MEDALLION MOUNTED ON FRONT OF SPHERE
  // Mounted proudly on the front surface of the central sphere (y = 1.95m, z = +0.955m)
  // Perfectly perpendicular to the ceremonial entrance walkway (+Z).
  // Features authentic official school crest in ornate 24K gold inscription medallion ring.
  // ------------------------------------------
  const frontMedallionGroup = new THREE.Group();
  frontMedallionGroup.position.set(0, 1.95, 0.955);

  // 1. Heavy Champagne-Gold Base Plaque Backing with stepped bevel (Radius 0.38m, depth 0.024m)
  const medallionBaseGeo = new THREE.CylinderGeometry(0.38, 0.395, 0.024, 64);
  const medallionBaseMesh = new THREE.Mesh(medallionBaseGeo, materials.brushedBrass);
  medallionBaseMesh.rotation.x = Math.PI / 2;
  medallionBaseMesh.castShadow = true;
  medallionBaseMesh.receiveShadow = true;
  frontMedallionGroup.add(medallionBaseMesh);

  // 2. Beveled Champagne-Gold Outer Torus Nosing
  const medallionTorusGeo = new THREE.TorusGeometry(0.388, 0.016, 16, 64);
  const medallionTorusMesh = new THREE.Mesh(medallionTorusGeo, materials.brushedBrass);
  medallionTorusMesh.position.set(0, 0, 0.014);
  frontMedallionGroup.add(medallionTorusMesh);

  // 3. Ornate Inscription Ring (Diameter 0.76m, inner 0.52m) in 24K gold
  const medallionRingGeo = new THREE.RingGeometry(0.26, 0.375, 64);
  const medallionRingMesh = new THREE.Mesh(medallionRingGeo, materials.medallionRing);
  medallionRingMesh.position.set(0, 0, 0.016);
  frontMedallionGroup.add(medallionRingMesh);

  // 4. Inner Polished Gold Fillet Ring separating inscription and crest
  const innerFilletGeo = new THREE.TorusGeometry(0.258, 0.008, 16, 48);
  const innerFilletMesh = new THREE.Mesh(innerFilletGeo, materials.brushedBrass);
  innerFilletMesh.position.set(0, 0, 0.018);
  frontMedallionGroup.add(innerFilletMesh);

  // 5. Authentic School Crest (Inner Shield Face, Radius 0.25m)
  const frontDiamondSpan = 0.25;
  const frontDiamondShape = new THREE.Shape();
  frontDiamondShape.moveTo(0, frontDiamondSpan);
  frontDiamondShape.lineTo(frontDiamondSpan, 0);
  frontDiamondShape.lineTo(0, -frontDiamondSpan);
  frontDiamondShape.lineTo(-frontDiamondSpan, 0);
  frontDiamondShape.closePath();

  const frontDiamondGeo = new THREE.ShapeGeometry(frontDiamondShape);
  const fPos = frontDiamondGeo.attributes.position;
  const fUv = new Float32Array(fPos.count * 2);
  for (let i = 0; i < fPos.count; i++) {
    fUv[i * 2] = (fPos.getX(i) + frontDiamondSpan) / (frontDiamondSpan * 2);
    fUv[i * 2 + 1] = (fPos.getY(i) + frontDiamondSpan) / (frontDiamondSpan * 2);
  }
  frontDiamondGeo.setAttribute('uv', new THREE.BufferAttribute(fUv, 2));

  const frontEmblemMesh = new THREE.Mesh(frontDiamondGeo, materials.officialEmblem);
  frontEmblemMesh.position.set(0, 0, 0.022);
  frontMedallionGroup.add(frontEmblemMesh);

  // 6. Four Architectural Clasp Brackets at 0°, 90°, 180°, 270°
  [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].forEach((cAngle) => {
    const clasp = new THREE.Mesh(
      new THREE.BoxGeometry(0.045, 0.08, 0.02),
      materials.brushedBrass
    );
    clasp.position.set(Math.sin(cAngle) * 0.39, Math.cos(cAngle) * 0.39, 0.015);
    clasp.rotation.z = -cAngle;
    frontMedallionGroup.add(clasp);
  });

  centerpieceGroup.add(frontMedallionGroup);
  interactiveMeshes.push(frontEmblemMesh);
  interactiveMeshes.push(medallionBaseMesh);

  // ------------------------------------------
  // 5C. RESTORED ORIGINAL AUTHENTIC SCHOOL LOGO IN ORIGINAL FRAME AT APEX
  // Positioned atop the central sphere apex (y = 2.90m to 4.02m, centered at y = 3.53m)
  // Preserves authentic logo: red chevron, gold star, pagoda tower, torch, 1966 book, Ninh Binh ribbon
  // Framed in classical champagne-gold beveled diamond tube frame with extruded backing stele.
  // ------------------------------------------
  const emblemCrownGroup = new THREE.Group();

  // 1. Champagne-Gold Architectural Finial Mounting Assembly atop the Sphere (y = 2.90m to 3.12m)
  const finialBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.32, 0.06, 32),
    materials.brushedBrass
  );
  finialBase.position.set(0, 2.93, 0);
  emblemCrownGroup.add(finialBase);

  const finialStalk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.18, 0.10, 32),
    materials.brushedBrass
  );
  finialStalk.position.set(0, 3.01, 0);
  emblemCrownGroup.add(finialStalk);

  const finialCradle = new THREE.Mesh(
    new THREE.TorusGeometry(0.20, 0.035, 16, 32),
    materials.brushedBrass
  );
  finialCradle.rotation.x = Math.PI / 2;
  finialCradle.position.set(0, 3.09, 0);
  emblemCrownGroup.add(finialCradle);

  // 4 Architectural Support Scroll Brackets at the base of the stele
  [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2].forEach((bAngle) => {
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(0.035, 0.14, 0.05),
      materials.brushedBrass
    );
    bracket.position.set(Math.sin(bAngle) * 0.14, 3.04, Math.cos(bAngle) * 0.14);
    bracket.rotation.y = bAngle;
    bracket.rotation.z = 0.22;
    emblemCrownGroup.add(bracket);
  });

  // 2. The Monumental Diamond Stele & Logo Frame (Centered at y = 3.53m)
  const emblemGroup = new THREE.Group();
  emblemGroup.position.set(0, 3.53, 0);

  const diamondSpan = 0.44; // 0.44m half-diagonal (88cm height, perfectly proportioned to 1.9m sphere)
  const diamondShape = new THREE.Shape();
  diamondShape.moveTo(0, diamondSpan);
  diamondShape.lineTo(diamondSpan, 0);
  diamondShape.lineTo(0, -diamondSpan);
  diamondShape.lineTo(-diamondSpan, 0);
  diamondShape.closePath();

  // Architectural Extruded Stele Backing in Champagne Gold
  const diamondSteleGeo = new THREE.ExtrudeGeometry(diamondShape, {
    depth: 0.045,
    bevelEnabled: true,
    bevelSegments: 3,
    steps: 1,
    bevelSize: 0.015,
    bevelThickness: 0.015,
  });
  diamondSteleGeo.center();
  const diamondStele = new THREE.Mesh(diamondSteleGeo, materials.brushedBrass);
  diamondStele.castShadow = true;
  diamondStele.receiveShadow = true;
  emblemGroup.add(diamondStele);

  // Diamond Face Geometry with verified UV coordinate mapping
  const diamondFaceGeo = new THREE.ShapeGeometry(diamondShape);
  const posAttr = diamondFaceGeo.attributes.position;
  const uvArr = new Float32Array(posAttr.count * 2);
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vy = posAttr.getY(i);
    uvArr[i * 2] = (vx + diamondSpan) / (diamondSpan * 2);
    uvArr[i * 2 + 1] = (vy + diamondSpan) / (diamondSpan * 2);
  }
  diamondFaceGeo.setAttribute('uv', new THREE.BufferAttribute(uvArr, 2));

  // Front Authentic School Emblem Face (Facing South +Z to welcome visitors)
  const emblemMeshFront = new THREE.Mesh(diamondFaceGeo, materials.officialEmblem);
  emblemMeshFront.position.set(0, 0, 0.026);
  emblemGroup.add(emblemMeshFront);

  // Back Authentic School Emblem Face (Facing North -Z for visitors viewing from behind)
  const emblemMeshBack = new THREE.Mesh(diamondFaceGeo, materials.officialEmblem);
  emblemMeshBack.position.set(0, 0, -0.026);
  emblemMeshBack.rotation.y = Math.PI;
  emblemGroup.add(emblemMeshBack);

  // Champagne-Gold Beveled Diamond Rim Tube Frame (Front and Back)
  const diamondFramePoints = [
    new THREE.Vector3(0, diamondSpan, 0),
    new THREE.Vector3(diamondSpan, 0, 0),
    new THREE.Vector3(0, -diamondSpan, 0),
    new THREE.Vector3(-diamondSpan, 0, 0),
    new THREE.Vector3(0, diamondSpan, 0),
  ];
  const diamondFrameCurve = new THREE.CatmullRomCurve3(diamondFramePoints, true);
  const diamondFrameGeo = new THREE.TubeGeometry(diamondFrameCurve, 40, 0.022, 12, true);

  const diamondFrameFront = new THREE.Mesh(diamondFrameGeo, materials.brushedBrass);
  diamondFrameFront.position.set(0, 0, 0.028);
  emblemGroup.add(diamondFrameFront);

  const diamondFrameBack = new THREE.Mesh(diamondFrameGeo, materials.brushedBrass);
  diamondFrameBack.position.set(0, 0, -0.028);
  emblemGroup.add(diamondFrameBack);

  // Gilded Five-Point Star Crowning Apex of the Diamond Frame (y = 3.53 + 0.48 = 4.01m)
  const starCrownGroup = new THREE.Group();
  starCrownGroup.position.set(0, diamondSpan + 0.038, 0);

  const starCore = new THREE.Mesh(
    new THREE.SphereGeometry(0.032, 16, 16),
    materials.brushedBrass
  );
  starCrownGroup.add(starCore);

  for (let s = 0; s < 5; s++) {
    const sAngle = (s / 5) * Math.PI * 2 - Math.PI / 2;
    const ray = new THREE.Mesh(
      new THREE.ConeGeometry(0.015, 0.070, 8),
      materials.brushedBrass
    );
    ray.position.set(Math.cos(sAngle) * 0.042, Math.sin(sAngle) * 0.042, 0);
    ray.rotation.z = sAngle - Math.PI / 2;
    starCrownGroup.add(ray);
  }
  emblemGroup.add(starCrownGroup);

  emblemCrownGroup.add(emblemGroup);
  centerpieceGroup.add(emblemCrownGroup);

  interactiveMeshes.push(emblemMeshFront);
  interactiveMeshes.push(diamondStele);

  // ------------------------------------------
  // 5D. GRAND CELESTIAL SATURN ACCRETION RING (VÀNH ĐAI SAO THỔ CỠ LỚN NHƯ PHÒNG LỊCH SỬ)
  // A majestic, wide golden glowing accretion disc and heavy gilded torus ring
  // enveloping the obsidian sphere at center (0, 1.95, 0), angled elegantly (~24° inclination)
  // Featuring high-resolution 24K museum brass finish, micro-grooves, and specular lighting
  // ------------------------------------------
  const saturnRingGroup = new THREE.Group();
  saturnRingGroup.position.set(0, 1.95, 0);
  saturnRingGroup.rotation.x = Math.PI / 2.25;
  saturnRingGroup.rotation.y = 0.15;
  saturnRingGroup.rotation.z = -0.10;

  // 1. Primary High-Resolution 24K Museum Brass & Gold Accretion Disc ('Lich Su' Finish)
  // Mapped with procedural circular micro-grooves, Cassini division, and brushed anisotropic sheen
  const saturnDiscGeo = new THREE.RingGeometry(1.22, 2.55, 128);
  const saturnAccretionMesh = new THREE.Mesh(saturnDiscGeo, materials.saturnAccretionDisc);
  saturnAccretionMesh.receiveShadow = true;
  saturnRingGroup.add(saturnAccretionMesh);

  // 2. Translucent Additive Golden Radiant Sheen Layer
  // Augments the physical brass disc with ethereal celestial warmth and ambient depth
  const saturnGlowGeo = new THREE.RingGeometry(1.22, 2.55, 96);
  const saturnGlowMat = new THREE.MeshBasicMaterial({
    color: 0xFFDF73,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const saturnGlowMesh = new THREE.Mesh(saturnGlowGeo, saturnGlowMat);
  saturnGlowMesh.position.set(0, 0, 0.002);
  saturnRingGroup.add(saturnGlowMesh);

  // 3. Inner Gravitational Photon Ring (Emissive Gold) hugging the sphere
  const saturnPhotonGeo = new THREE.TorusGeometry(1.25, 0.020, 24, 96);
  const saturnPhotonMat = materials.luminousGold.clone();
  saturnPhotonMat.emissiveIntensity = 2.4;
  const saturnPhotonMesh = new THREE.Mesh(saturnPhotonGeo, saturnPhotonMat);
  saturnRingGroup.add(saturnPhotonMesh);

  // 4. Primary Thick Golden Accretion Band (Dải vàng đúc chính, Torus R=1.85m, tube=0.048m)
  const saturnPrimaryTorusGeo = new THREE.TorusGeometry(1.85, 0.048, 32, 128);
  const saturnPrimaryMesh = new THREE.Mesh(saturnPrimaryTorusGeo, materials.luminousGold);
  saturnRingGroup.add(saturnPrimaryMesh);

  // 5. Middle Cassini Division Accent Ring (Torus R=2.16m, tube=0.014m)
  const saturnDivisionGeo = new THREE.TorusGeometry(2.16, 0.014, 16, 96);
  const saturnDivisionMesh = new THREE.Mesh(saturnDivisionGeo, materials.bronzeTrim);
  saturnRingGroup.add(saturnDivisionMesh);

  // 6. Outer Gilded Resonance Rim (Torus R=2.52m, tube=0.018m)
  const saturnOuterRimGeo = new THREE.TorusGeometry(2.52, 0.018, 24, 128);
  const saturnOuterRimMesh = new THREE.Mesh(saturnOuterRimGeo, materials.brushedBrass);
  saturnRingGroup.add(saturnOuterRimMesh);

  // 7. Warm Core Radial Light inside the Accretion Ring
  const saturnCoreLight = new THREE.PointLight(0xFFE292, 2.0, 7.0, 2.0);
  saturnRingGroup.add(saturnCoreLight);

  // 7B. Celestial Starlight Particle Belt orbiting within the Saturn Accretion Ring
  const saturnStarCount = 240;
  const saturnStarGeo = new THREE.BufferGeometry();
  const saturnStarPos = new Float32Array(saturnStarCount * 3);
  for (let i = 0; i < saturnStarCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const r = 1.28 + Math.random() * 1.22;
    saturnStarPos[i * 3] = Math.cos(angle) * r;
    saturnStarPos[i * 3 + 1] = Math.sin(angle) * r;
    saturnStarPos[i * 3 + 2] = (Math.random() - 0.5) * 0.04;
  }
  saturnStarGeo.setAttribute('position', new THREE.BufferAttribute(saturnStarPos, 3));
  const saturnStarMat = new THREE.PointsMaterial({
    color: 0xFFEB99,
    size: 0.045,
    transparent: true,
    opacity: 0.88,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const saturnStarBelt = new THREE.Points(saturnStarGeo, saturnStarMat);
  saturnRingGroup.add(saturnStarBelt);

  // 7C. Cosmic Orbiting Star Aura around the Central Sphere
  const orbitStarCount = 160;
  const orbitStarGeo = new THREE.BufferGeometry();
  const orbitStarPos = new Float32Array(orbitStarCount * 3);
  for (let i = 0; i < orbitStarCount; i++) {
    const u = Math.random();
    const v = Math.random();
    const theta = u * 2.0 * Math.PI;
    const phi = Math.acos(2.0 * v - 1.0);
    const r = 1.06 + Math.random() * 0.16;
    const sinPhi = Math.sin(phi);
    orbitStarPos[i * 3] = r * sinPhi * Math.cos(theta);
    orbitStarPos[i * 3 + 1] = 1.95 + r * Math.cos(phi);
    orbitStarPos[i * 3 + 2] = r * sinPhi * Math.sin(theta);
  }
  orbitStarGeo.setAttribute('position', new THREE.BufferAttribute(orbitStarPos, 3));
  const orbitStarMat = new THREE.PointsMaterial({
    color: 0xFFDF88,
    size: 0.038,
    transparent: true,
    opacity: 0.78,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const centerpieceOrbitParticles = new THREE.Points(orbitStarGeo, orbitStarMat);
  centerpieceGroup.add(centerpieceOrbitParticles);

  // 8. DEDICATED SPECULAR LIGHTING RIG FOR SATURN ACCRETION DISC
  // High-intensity grazing spotlights calibrated to trigger brilliant metallic highlights
  // on the high-resolution brushed brass texture across the disc's surface
  const saturnTargetFront = new THREE.Object3D();
  saturnTargetFront.position.set(0, 1.95, 0.40);
  centerpieceGroup.add(saturnTargetFront);

  const saturnSpecularFront = new THREE.SpotLight(0xFFF5DE, 3.8);
  saturnSpecularFront.position.set(0, 5.8, 3.8);
  saturnSpecularFront.target = saturnTargetFront;
  saturnSpecularFront.angle = 0.58;
  saturnSpecularFront.penumbra = 0.35;
  saturnSpecularFront.distance = 15;
  centerpieceGroup.add(saturnSpecularFront);

  const saturnTargetBack = new THREE.Object3D();
  saturnTargetBack.position.set(0, 1.95, -0.40);
  centerpieceGroup.add(saturnTargetBack);

  const saturnSpecularBack = new THREE.SpotLight(0xFFE4A2, 3.2);
  saturnSpecularBack.position.set(0, 5.8, -3.8);
  saturnSpecularBack.target = saturnTargetBack;
  saturnSpecularBack.angle = 0.58;
  saturnSpecularBack.penumbra = 0.40;
  saturnSpecularBack.distance = 15;
  centerpieceGroup.add(saturnSpecularBack);

  // Lateral Glancing Specular Point Lights for Cross-Reflections (at 9 o'clock and 3 o'clock)
  const leftSpecularGlance = new THREE.PointLight(0xFFD572, 1.6, 6.5, 2.0);
  leftSpecularGlance.position.set(-3.2, 2.6, 0);
  centerpieceGroup.add(leftSpecularGlance);

  const rightSpecularGlance = new THREE.PointLight(0xFFD572, 1.6, 6.5, 2.0);
  rightSpecularGlance.position.set(3.2, 2.6, 0);
  centerpieceGroup.add(rightSpecularGlance);

  centerpieceGroup.add(saturnRingGroup);
  interactiveMeshes.push(saturnAccretionMesh);

  // ------------------------------------------
  // 5E. 3 REFINED GOLDEN ORBITAL RINGS
  // Preserved with slender champagne-gold tubing and balanced inclinations
  // that gracefully frame the centerpiece and weave through the Saturn accretion disc.
  // ------------------------------------------
  const orbitalRingGroups: THREE.Group[] = [];

  // Ring 1: Lower Equatorial / Slight Rearward Tilt (radius 1.52m, tube 0.015m)
  const ring1Group = new THREE.Group();
  ring1Group.position.set(0, 1.82, 0);
  ring1Group.rotation.x = 0.28;
  ring1Group.rotation.z = -0.12;
  const ring1Mesh = new THREE.Mesh(
    new THREE.TorusGeometry(1.52, 0.015, 24, 96),
    materials.brushedBrass
  );
  ring1Mesh.rotation.x = Math.PI / 2;
  ring1Group.add(ring1Mesh);
  // Add 3 milestone beads (epochs 1966, 1986, 2006)
  for (let b = 0; b < 3; b++) {
    const bAngle = (b / 3) * Math.PI * 2;
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.032, 16, 16), materials.brushedBrass);
    bead.position.set(Math.cos(bAngle) * 1.52, 0, Math.sin(bAngle) * 1.52);
    ring1Group.add(bead);
  }
  centerpieceGroup.add(ring1Group);
  orbitalRingGroups.push(ring1Group);

  // Ring 2: Diagonal Inclined Ring (radius 1.68m, inclination ~32°)
  const ring2Group = new THREE.Group();
  ring2Group.position.set(0, 1.95, 0);
  ring2Group.rotation.x = -0.48;
  ring2Group.rotation.z = 0.44;
  const ring2Mesh = new THREE.Mesh(
    new THREE.TorusGeometry(1.68, 0.014, 24, 96),
    materials.brushedBrass
  );
  ring2Mesh.rotation.x = Math.PI / 2;
  ring2Group.add(ring2Mesh);
  for (let b = 0; b < 3; b++) {
    const bAngle = (b / 3) * Math.PI * 2 + 0.5;
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.028, 16, 16), materials.brushedBrass);
    bead.position.set(Math.cos(bAngle) * 1.68, 0, Math.sin(bAngle) * 1.68);
    ring2Group.add(bead);
  }
  centerpieceGroup.add(ring2Group);
  orbitalRingGroups.push(ring2Group);

  // Ring 3: Counter-Diagonal Ring (radius 1.84m, inclination ~34°)
  const ring3Group = new THREE.Group();
  ring3Group.position.set(0, 1.95, 0);
  ring3Group.rotation.x = 0.50;
  ring3Group.rotation.z = -0.42;
  const ring3Mesh = new THREE.Mesh(
    new THREE.TorusGeometry(1.84, 0.013, 24, 96),
    materials.brushedBrass
  );
  ring3Mesh.rotation.x = Math.PI / 2;
  ring3Group.add(ring3Mesh);
  for (let b = 0; b < 3; b++) {
    const bAngle = (b / 3) * Math.PI * 2 + 1.0;
    const bead = new THREE.Mesh(new THREE.SphereGeometry(0.026, 16, 16), materials.brushedBrass);
    bead.position.set(Math.cos(bAngle) * 1.84, 0, Math.sin(bAngle) * 1.84);
    ring3Group.add(bead);
  }
  centerpieceGroup.add(ring3Group);
  orbitalRingGroups.push(ring3Group);

  // ------------------------------------------
  // 5E. 4 CEREMONIAL GOLDEN TORCHES
  // Symmetrically arranged around the circular podium outside the walking route.
  // 4-part classical procedural models with sculpted amber flames and warm glow.
  // ------------------------------------------
  const torches: CeremonialTorchObject[] = [];
  const torchCoords = [
    { x: -4.20, z: 4.20 }, // Front-Left
    { x: 4.20, z: 4.20 },  // Front-Right
    { x: -4.20, z: -3.20 }, // Rear-Left
    { x: 4.20, z: -3.20 },  // Rear-Right
  ];

  // Procedural flame profile
  const flamePoints = [
    new THREE.Vector2(0.02, 0.0),
    new THREE.Vector2(0.10, 0.08),
    new THREE.Vector2(0.12, 0.18),
    new THREE.Vector2(0.09, 0.28),
    new THREE.Vector2(0.04, 0.36),
    new THREE.Vector2(0.0, 0.42),
  ];
  const flameGeo = new THREE.LatheGeometry(flamePoints, 24);

  torchCoords.forEach((coord, idx) => {
    const torchGroup = new THREE.Group();
    torchGroup.position.set(coord.x, 0, coord.z);

    // 1. Stepped flared circular gold base
    const basePlinth = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.36, 0.06, 32),
      materials.brushedBrass
    );
    basePlinth.position.set(0, 0.03, 0);
    torchGroup.add(basePlinth);

    const baseScotia = new THREE.Mesh(
      new THREE.CylinderGeometry(0.20, 0.30, 0.10, 32),
      materials.brushedBrass
    );
    baseScotia.position.set(0, 0.11, 0);
    torchGroup.add(baseScotia);

    const baseTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.20, 0.02, 16, 32),
      materials.brushedBrass
    );
    baseTorus.rotation.x = Math.PI / 2;
    baseTorus.position.set(0, 0.16, 0);
    torchGroup.add(baseTorus);

    // 2. Slender classical fluted column shaft
    const shaft = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.095, 1.25, 32),
      materials.brushedBrass
    );
    shaft.position.set(0, 0.79, 0);
    torchGroup.add(shaft);

    const midCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.09, 0.016, 16, 32),
      materials.brushedBrass
    );
    midCollar.rotation.x = Math.PI / 2;
    midCollar.position.set(0, 0.85, 0);
    torchGroup.add(midCollar);

    const capTorus = new THREE.Mesh(
      new THREE.TorusGeometry(0.10, 0.018, 16, 32),
      materials.brushedBrass
    );
    capTorus.rotation.x = Math.PI / 2;
    capTorus.position.set(0, 1.42, 0);
    torchGroup.add(capTorus);

    // 3. Flared ceremonial gold bowl / chalice
    const chalice = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.10, 0.22, 32),
      materials.brushedBrass
    );
    chalice.position.set(0, 1.54, 0);
    torchGroup.add(chalice);

    const chaliceRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.22, 0.02, 16, 32),
      materials.brushedBrass
    );
    chaliceRim.rotation.x = Math.PI / 2;
    chaliceRim.position.set(0, 1.65, 0);
    torchGroup.add(chaliceRim);

    // 4A. Sculpted translucent warm amber outer flame
    const flameMesh = new THREE.Mesh(flameGeo, materials.torchFlame);
    flameMesh.position.set(0, 1.65, 0);
    torchGroup.add(flameMesh);

    // 4B. High-Luminance Inner Flame Core (Golden-White Radiant Cone)
    const flameCoreGeo = new THREE.ConeGeometry(0.065, 0.28, 16);
    const flameCoreMat = new THREE.MeshBasicMaterial({
      color: 0xFFFBE6,
    });
    const flameCoreMesh = new THREE.Mesh(flameCoreGeo, flameCoreMat);
    flameCoreMesh.position.set(0, 1.78, 0);
    torchGroup.add(flameCoreMesh);

    // 4C. Drifting Ember Particles per Torch (24 particles drifting upward)
    const emberCount = 24;
    const emberPositions = new Float32Array(emberCount * 3);
    for (let e = 0; e < emberCount; e++) {
      const eAngle = Math.random() * Math.PI * 2;
      const eRad = Math.random() * 0.14;
      emberPositions[e * 3] = Math.cos(eAngle) * eRad;
      emberPositions[e * 3 + 1] = 1.68 + Math.random() * 0.75;
      emberPositions[e * 3 + 2] = Math.sin(eAngle) * eRad;
    }
    const emberGeo = new THREE.BufferGeometry();
    emberGeo.setAttribute('position', new THREE.BufferAttribute(emberPositions, 3));
    const emberMat = new THREE.PointsMaterial({
      color: 0xFFA532,
      size: 0.035,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const emberPoints = new THREE.Points(emberGeo, emberMat);
    torchGroup.add(emberPoints);

    // 5. Warm amber flame point light
    const baseIntensity = 1.25;
    const flameLight = new THREE.PointLight(0xFFA532, baseIntensity, 6.5, 2.0);
    flameLight.position.set(0, 1.88, 0);
    torchGroup.add(flameLight);

    masterGroup.add(torchGroup);
    torches.push({
      group: torchGroup,
      light: flameLight,
      flameMesh,
      flameCoreMesh,
      emberPoints,
      emberPositions,
      baseIntensity,
    });
  });

  // Dedicated central lighting: front key spotlight for authentic medallion + crown and halo
  // 1. Dedicated Front Key Spotlight focused directly on the authentic front emblem medallion
  const centerLight = new THREE.SpotLight(0xFFF7E6, 3.8);
  centerLight.position.set(0, 4.4, 3.8);
  centerLight.target = frontMedallionGroup;
  centerLight.angle = 0.52;
  centerLight.penumbra = 0.40;
  centerLight.distance = 14;
  centerLight.castShadow = true;
  centerpieceGroup.add(centerLight);

  // 2. Dedicated Spotlight focused on the apex crown emblem
  const centerBackLight = new THREE.SpotLight(0xFFF0D4, 2.8);
  centerBackLight.position.set(0, 6.2, -3.8);
  centerBackLight.target = emblemMeshBack;
  centerBackLight.angle = 0.46;
  centerBackLight.penumbra = 0.45;
  centerBackLight.distance = 14;
  centerpieceGroup.add(centerBackLight);

  // 3. Subtle Warm Gold Halo Accent Light within the centerpiece
  const haloLight = new THREE.PointLight(0xFFDCA8, 1.4, 5.0, 2.0);
  haloLight.position.set(0, 2.1, 0);
  centerpieceGroup.add(haloLight);

  masterGroup.add(centerpieceGroup);

  // ==========================================
  // 6. COMPACT ARCHITECTURAL ORIENTATION LECTERNS
  // Replaced heavy oversized containers with slender, elegant lecterns positioned
  // along the colonnade line (x = ±6.8, z = 10.5), completely opening the central vista!
  // ==========================================
  // 6A. MAP LECTERN (x = 6.8, z = 10.5)
  const mapConsoleGroup = new THREE.Group();
  mapConsoleGroup.position.set(6.8, 0, 10.5);

  const mapStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.50, 0.95, 0.40),
    materials.gateIvoryStone
  );
  mapStand.position.set(0, 0.475, 0);
  mapStand.castShadow = true;
  mapStand.receiveShadow = true;
  mapConsoleGroup.add(mapStand);

  const mapStandFoot = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.06, 0.46),
    materials.bronzeTrim
  );
  mapStandFoot.position.set(0, 0.03, 0);
  mapConsoleGroup.add(mapStandFoot);

  const mapStandCap = new THREE.Mesh(
    new THREE.BoxGeometry(0.54, 0.04, 0.44),
    materials.brushedBrass
  );
  mapStandCap.position.set(0, 0.97, 0);
  mapConsoleGroup.add(mapStandCap);

  // Angled Reading Head
  const mapHeadGroup = new THREE.Group();
  mapHeadGroup.position.set(0, 1.02, 0);
  mapHeadGroup.rotation.x = -0.45;

  const mapTray = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.04, 0.95),
    materials.gateIvoryStone
  );
  mapHeadGroup.add(mapTray);

  const mapBezel = new THREE.Mesh(
    new THREE.BoxGeometry(1.29, 0.02, 0.99),
    materials.brushedBrass
  );
  mapBezel.position.set(0, 0.012, 0);
  mapHeadGroup.add(mapBezel);

  const mapPanelTex = createSpatialMuseumMapTexture();
  const mapPanelGeo = new THREE.PlaneGeometry(1.18, 0.88);
  const mapPanelMat = new THREE.MeshStandardMaterial({
    map: mapPanelTex,
    roughness: 0.22,
    metalness: 0.18,
  });
  const mapPanel = new THREE.Mesh(mapPanelGeo, mapPanelMat);
  mapPanel.position.set(0, 0.024, 0);
  mapPanel.rotation.x = -Math.PI / 2;
  mapHeadGroup.add(mapPanel);

  mapConsoleGroup.add(mapHeadGroup);
  interactiveMeshes.push(mapPanel);

  const mapLight = new THREE.PointLight(0xFFE5A8, 1.1, 5, 2);
  mapLight.position.set(0, 1.8, 0.2);
  mapConsoleGroup.add(mapLight);

  masterGroup.add(mapConsoleGroup);

  // 6B. VISITOR GUIDE LECTERN (x = -6.8, z = 10.5)
  const guideConsoleGroup = new THREE.Group();
  guideConsoleGroup.position.set(-6.8, 0, 10.5);

  const guideStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.50, 0.95, 0.40),
    materials.gateIvoryStone
  );
  guideStand.position.set(0, 0.475, 0);
  guideStand.castShadow = true;
  guideStand.receiveShadow = true;
  guideConsoleGroup.add(guideStand);

  const guideStandFoot = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 0.06, 0.46),
    materials.bronzeTrim
  );
  guideStandFoot.position.set(0, 0.03, 0);
  guideConsoleGroup.add(guideStandFoot);

  const guideStandCap = new THREE.Mesh(
    new THREE.BoxGeometry(0.54, 0.04, 0.44),
    materials.brushedBrass
  );
  guideStandCap.position.set(0, 0.97, 0);
  guideConsoleGroup.add(guideStandCap);

  const guideHeadGroup = new THREE.Group();
  guideHeadGroup.position.set(0, 1.02, 0);
  guideHeadGroup.rotation.x = -0.45;

  const guideTray = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 0.04, 0.95),
    materials.gateIvoryStone
  );
  guideHeadGroup.add(guideTray);

  const guideBezel = new THREE.Mesh(
    new THREE.BoxGeometry(1.29, 0.02, 0.99),
    materials.brushedBrass
  );
  guideBezel.position.set(0, 0.012, 0);
  guideHeadGroup.add(guideBezel);

  const guidePanelTex = createVisitorGuidePlaqueTexture();
  const guidePanelGeo = new THREE.PlaneGeometry(1.18, 0.88);
  const guidePanelMat = new THREE.MeshStandardMaterial({
    map: guidePanelTex,
    roughness: 0.22,
    metalness: 0.18,
  });
  const guidePanel = new THREE.Mesh(guidePanelGeo, guidePanelMat);
  guidePanel.position.set(0, 0.024, 0);
  guidePanel.rotation.x = -Math.PI / 2;
  guideHeadGroup.add(guidePanel);

  guideConsoleGroup.add(guideHeadGroup);
  interactiveMeshes.push(guidePanel);

  const guideLight = new THREE.PointLight(0xFFE5A8, 1.1, 5, 2);
  guideLight.position.set(0, 1.8, 0.2);
  guideConsoleGroup.add(guideLight);

  masterGroup.add(guideConsoleGroup);

  // ==========================================
  // 7. DIRECTIONAL GATEWAYS (EXHIBITION THRESHOLDS)
  // ==========================================
  lobbyConfig.gateways.forEach((gw) => {
    const gwGroup = new THREE.Group();
    gwGroup.position.set(...gw.position);
    gwGroup.rotation.y = gw.rotationY;

    const doorFrameWidth = gw.doorWidth;
    const doorFrameHeight = gw.doorHeight;
    const zoneContourMat = materials.gateContourTrims[gw.id] || materials.gateChampagneGold;

    // Architectural Posts in warm ivory limestone
    const postGeo = new THREE.BoxGeometry(0.56, doorFrameHeight, 0.68);
    const leftPost = new THREE.Mesh(postGeo, materials.gateIvoryStone);
    leftPost.position.set(-doorFrameWidth / 2 - 0.28, doorFrameHeight / 2, 0);
    leftPost.castShadow = true;
    leftPost.receiveShadow = true;
    gwGroup.add(leftPost);

    const rightPost = new THREE.Mesh(postGeo, materials.gateIvoryStone);
    rightPost.position.set(doorFrameWidth / 2 + 0.28, doorFrameHeight / 2, 0);
    rightPost.castShadow = true;
    rightPost.receiveShadow = true;
    gwGroup.add(rightPost);

    // Pillar Base Pedestals (Architectural Bronze + Champagne Gold)
    const basePedGeo = new THREE.BoxGeometry(0.70, 0.28, 0.80);
    const leftBase = new THREE.Mesh(basePedGeo, materials.gateBronzeTrim);
    leftBase.position.set(-doorFrameWidth / 2 - 0.28, 0.14, 0);
    gwGroup.add(leftBase);

    const rightBase = new THREE.Mesh(basePedGeo, materials.gateBronzeTrim);
    rightBase.position.set(doorFrameWidth / 2 + 0.28, 0.14, 0);
    gwGroup.add(rightBase);

    const baseRingGeo = new THREE.BoxGeometry(0.74, 0.05, 0.84);
    const leftBaseRing = new THREE.Mesh(baseRingGeo, materials.gateChampagneGold);
    leftBaseRing.position.set(-doorFrameWidth / 2 - 0.28, 0.31, 0);
    gwGroup.add(leftBaseRing);

    const rightBaseRing = new THREE.Mesh(baseRingGeo, materials.gateChampagneGold);
    rightBaseRing.position.set(doorFrameWidth / 2 + 0.28, 0.31, 0);
    gwGroup.add(rightBaseRing);

    // Pillar Capital Mouldings
    const capGeo = new THREE.BoxGeometry(0.72, 0.24, 0.82);
    const leftCap = new THREE.Mesh(capGeo, materials.gateChampagneGold);
    leftCap.position.set(-doorFrameWidth / 2 - 0.28, doorFrameHeight - 0.12, 0);
    gwGroup.add(leftCap);

    const rightCap = new THREE.Mesh(capGeo, materials.gateChampagneGold);
    rightCap.position.set(doorFrameWidth / 2 + 0.28, doorFrameHeight - 0.12, 0);
    gwGroup.add(rightCap);

    // Architrave Lintel in warm ivory limestone
    const lintelGeo = new THREE.BoxGeometry(doorFrameWidth + 1.36, 0.68, 0.78);
    const lintel = new THREE.Mesh(lintelGeo, materials.gateIvoryStone);
    lintel.position.set(0, doorFrameHeight + 0.34, 0);
    lintel.castShadow = true;
    lintel.receiveShadow = true;
    gwGroup.add(lintel);

    const lintelGoldCornice = new THREE.Mesh(
      new THREE.BoxGeometry(doorFrameWidth + 1.48, 0.12, 0.86),
      materials.gateChampagneGold
    );
    lintelGoldCornice.position.set(0, doorFrameHeight + 0.72, 0);
    gwGroup.add(lintelGoldCornice);

    const lintelLowerBezel = new THREE.Mesh(
      new THREE.BoxGeometry(doorFrameWidth + 1.38, 0.05, 0.80),
      materials.gateBronzeTrim
    );
    lintelLowerBezel.position.set(0, doorFrameHeight + 0.025, 0);
    gwGroup.add(lintelLowerBezel);

    // Zone Contour Trims
    const contourGeoV = new THREE.BoxGeometry(0.05, doorFrameHeight, 0.08);
    const leftContour = new THREE.Mesh(contourGeoV, zoneContourMat);
    leftContour.position.set(-doorFrameWidth / 2 + 0.025, doorFrameHeight / 2, 0.06);
    gwGroup.add(leftContour);

    const rightContour = new THREE.Mesh(contourGeoV, zoneContourMat);
    rightContour.position.set(doorFrameWidth / 2 - 0.025, doorFrameHeight / 2, 0.06);
    gwGroup.add(rightContour);

    const contourGeoH = new THREE.BoxGeometry(doorFrameWidth, 0.05, 0.08);
    const topContour = new THREE.Mesh(contourGeoH, zoneContourMat);
    topContour.position.set(0, doorFrameHeight - 0.025, 0.06);
    gwGroup.add(topContour);

    // Elevated Marble Threshold
    const thresholdGeo = new THREE.BoxGeometry(doorFrameWidth + 0.88, 0.16, 1.35);
    const thresholdMesh = new THREE.Mesh(thresholdGeo, materials.gateIvoryStone);
    thresholdMesh.position.set(0, 0.08, 0);
    thresholdMesh.receiveShadow = true;
    gwGroup.add(thresholdMesh);
    interactiveMeshes.push(thresholdMesh);

    const nosing = new THREE.Mesh(
      new THREE.BoxGeometry(doorFrameWidth + 0.92, 0.04, 0.07),
      materials.gateChampagneGold
    );
    nosing.position.set(0, 0.15, 0.67);
    gwGroup.add(nosing);

    // Doorway Depth Void
    const depthOpeningGeo = new THREE.PlaneGeometry(doorFrameWidth - 0.06, doorFrameHeight - 0.06);
    const depthOpening = new THREE.Mesh(depthOpeningGeo, materials.doorwayDepth);
    depthOpening.position.set(0, doorFrameHeight / 2, -0.20);
    gwGroup.add(depthOpening);

    // Signage Plaque Above Doorway
    const plaqueTex = createGatewayPlaqueTexture(gw, lang);
    const plaqueGeo = new THREE.PlaneGeometry(doorFrameWidth * 0.88, 1.02);
    const plaqueMat = new THREE.MeshStandardMaterial({
      map: plaqueTex,
      roughness: 0.28,
      metalness: 0.35,
    });
    const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
    plaqueMesh.position.set(0, doorFrameHeight + 0.34, 0.42);
    gwGroup.add(plaqueMesh);
    interactiveMeshes.push(plaqueMesh);

    // Warm Overhead Portal Spotlight in Champagne Gold (0xFFF1D8)
    const gwSpotLight = new THREE.SpotLight(0xFFF1D8, 3.2);
    gwSpotLight.position.set(0, doorFrameHeight + 1.6, 2.4);
    gwSpotLight.target = thresholdMesh;
    gwSpotLight.angle = 0.60;
    gwSpotLight.penumbra = 0.45;
    gwSpotLight.distance = 11;
    gwGroup.add(gwSpotLight);

    // Soft Portal Lantern Glow
    const portalLantern = new THREE.PointLight(0xFFE5A8, 1.2, 6, 1.8);
    portalLantern.position.set(0, doorFrameHeight - 0.22, 0.32);
    gwGroup.add(portalLantern);

    masterGroup.add(gwGroup);

    gateways.push({
      info: gw,
      group: gwGroup,
      light: gwSpotLight,
      plaqueMesh,
      thresholdMesh,
    });
  });

  return {
    masterGroup,
    centerpieceGroup,
    centerpieceRing: ring1Mesh,
    blackHoleSphere,
    emblemMesh: emblemMeshFront,
    frontMedallionMesh: frontEmblemMesh,
    saturnRingGroup,
    saturnStarBelt,
    centerpieceOrbitParticles,
    orbitalRingGroups,
    torches,
    gateways,
    mapConsoleGroup,
    guideConsoleGroup,
    guidePanelMesh: guidePanel,
    centerLight,
    interactiveMeshes,
  };
}
