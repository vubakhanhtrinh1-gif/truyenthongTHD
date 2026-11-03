import * as THREE from 'three';
import {
  TIMELINE_MILESTONES,
  TimelineMilestone,
} from '../config/timelineContentData';
import { TimelineMaterialSet } from '../materials/TimelineMaterials';
import { createMilestoneMarkerTexture } from '../textures/TimelineProceduralTextures';

export interface InteractiveMilestoneObject {
  milestone: TimelineMilestone;
  group: THREE.Group;
  panelMesh: THREE.Mesh;
  glowBezel: THREE.Mesh;
  spotlight: THREE.PointLight;
}

export interface TimelineSceneElements {
  masterGroup: THREE.Group;
  interactiveMeshes: THREE.Object3D[];
  milestoneObjects: Map<string, InteractiveMilestoneObject>;
  portalMesh: THREE.Mesh;
  finaleMonumentGroup: THREE.Group;
  riverParticles?: THREE.Points;
  riverParticlePos?: Float32Array;
}

export function buildTimelineArchitecture(
  materials: TimelineMaterialSet
): TimelineSceneElements {
  const masterGroup = new THREE.Group();
  const interactiveMeshes: THREE.Object3D[] = [];
  const milestoneObjects = new Map<string, InteractiveMilestoneObject>();

  const roomWidth = 16;
  const roomLength = 42;
  const roomHeight = 6.8;

  // =========================================================================
  // 1. FLOOR & LUMINOUS "RIVER OF TIME" (DÒNG SÔNG THỜI GIAN 60 NĂM)
  // =========================================================================
  // Main Polished Crema Marfil Stone Floor (#FAF6ED)
  const floorGeo = new THREE.PlaneGeometry(roomWidth, roomLength);
  const floorMesh = new THREE.Mesh(floorGeo, materials.floorBeige);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  masterGroup.add(floorMesh);

  // Lateral Champagne-Gold Floor Inlay Strips along colonnades (x = ±5.8m)
  [-5.8, 5.8].forEach((lx) => {
    const stripGeo = new THREE.BoxGeometry(0.06, 0.016, roomLength - 4);
    const stripMesh = new THREE.Mesh(stripGeo, materials.royalBrass);
    stripMesh.position.set(lx, 0.01, 0);
    masterGroup.add(stripMesh);
  });

  // Central "River of Time" Aquatic Spine (Width 3.4m, from Z = +19 down to -19)
  const spineWidth = 3.4;
  const spineLength = roomLength - 4;
  const spineGeo = new THREE.PlaneGeometry(spineWidth, spineLength);
  const spineMesh = new THREE.Mesh(spineGeo, materials.timelineSpine);
  spineMesh.rotation.x = -Math.PI / 2;
  spineMesh.position.set(0, 0.008, 0);
  spineMesh.receiveShadow = true;
  masterGroup.add(spineMesh);

  // Translucent Shimmering Water Sheen Layer
  const waterSheenGeo = new THREE.PlaneGeometry(spineWidth - 0.08, spineLength);
  const waterSheenMesh = new THREE.Mesh(waterSheenGeo, materials.riverWaterSheen);
  waterSheenMesh.rotation.x = -Math.PI / 2;
  waterSheenMesh.position.set(0, 0.012, 0);
  masterGroup.add(waterSheenMesh);

  // Dual Continuous 24K Royal Brass Embankment Nosing Rails
  const railGeo = new THREE.BoxGeometry(0.08, 0.024, spineLength);
  const leftRail = new THREE.Mesh(railGeo, materials.royalBrass);
  leftRail.position.set(-spineWidth / 2 - 0.04, 0.014, 0);
  masterGroup.add(leftRail);

  const rightRail = new THREE.Mesh(railGeo, materials.royalBrass);
  rightRail.position.set(spineWidth / 2 + 0.04, 0.014, 0);
  masterGroup.add(rightRail);

  // Continuous Warm LED Underglow along the River Embankments
  [-spineWidth / 2, spineWidth / 2].forEach((rx) => {
    [-14, -7, 0, 7, 14].forEach((rz) => {
      const riverLight = new THREE.PointLight(0x55E0EE, 0.65, 5.5, 2.0);
      riverLight.position.set(rx, 0.08, rz);
      masterGroup.add(riverLight);
    });
  });

  // Flowing River of Time Star Particles (240 celestial glowing particles drifting along the river)
  const particleCount = 240;
  const riverParticleGeo = new THREE.BufferGeometry();
  const riverParticlePos = new Float32Array(particleCount * 3);

  for (let p = 0; p < particleCount; p++) {
    riverParticlePos[p * 3] = (Math.random() - 0.5) * (spineWidth - 0.3); // X
    riverParticlePos[p * 3 + 1] = 0.025 + Math.random() * 0.035;          // Y (hovering softly over water)
    riverParticlePos[p * 3 + 2] = (Math.random() - 0.5) * spineLength;    // Z
  }

  riverParticleGeo.setAttribute('position', new THREE.BufferAttribute(riverParticlePos, 3));
  const riverParticleMat = new THREE.PointsMaterial({
    color: 0x90F2FF,
    size: 0.05,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const riverParticles = new THREE.Points(riverParticleGeo, riverParticleMat);
  masterGroup.add(riverParticles);

  // =========================================================================
  // 2. CEILING & WARM RECESSED ILLUMINATION
  // =========================================================================
  const ceilingGeo = new THREE.PlaneGeometry(roomWidth, roomLength);
  const ceilingMesh = new THREE.Mesh(ceilingGeo, materials.wallStone);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(0, roomHeight, 0);
  masterGroup.add(ceilingMesh);

  // Architectural Transverse Beams in Warm Ivory Limestone with Brass Trim
  const beamPositionsZ = [-18, -12, -6, 0, 6, 12, 18];
  beamPositionsZ.forEach((bz) => {
    // Ivory stone beam fascia
    const beam = new THREE.Mesh(
      new THREE.BoxGeometry(roomWidth, 0.24, 0.52),
      materials.columnIvoryStone
    );
    beam.position.set(0, roomHeight - 0.12, bz);
    masterGroup.add(beam);

    // Stepped 24K royal brass soffit molding
    const trim = new THREE.Mesh(
      new THREE.BoxGeometry(roomWidth, 0.04, 0.58),
      materials.royalBrass
    );
    trim.position.set(0, roomHeight - 0.25, bz);
    masterGroup.add(trim);

    // Warm champagne museum downlight pool
    const dl = new THREE.PointLight(0xFFF1D8, 1.15, 12, 2.0);
    dl.position.set(0, roomHeight - 0.40, bz);
    masterGroup.add(dl);
  });

  // =========================================================================
  // 3. ARCHITECTURAL PERIMETER WALLS
  // =========================================================================
  // Left Wall (West, x = -roomWidth / 2)
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(roomLength, roomHeight),
    materials.wallStone
  );
  leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  masterGroup.add(leftWall);

  // Right Wall (East, x = +roomWidth / 2)
  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(roomLength, roomHeight),
    materials.wallStone
  );
  rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  masterGroup.add(rightWall);

  // South Wall (Entrance, z = +roomLength / 2)
  const southWall = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, roomHeight),
    materials.wallStone
  );
  southWall.position.set(0, roomHeight / 2, roomLength / 2);
  southWall.rotation.y = Math.PI;
  masterGroup.add(southWall);

  // North Wall (Finale, z = -roomLength / 2)
  const northWall = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, roomHeight),
    materials.wallStone
  );
  northWall.position.set(0, roomHeight / 2, -roomLength / 2);
  masterGroup.add(northWall);

  // =========================================================================
  // 4. SYMMETRICAL NEOCLASSICAL FLUTED COLONNADE
  // Slender circular columns in warm ivory limestone with royal brass capitals and socles
  // =========================================================================
  const colZPositions = [-16, -10, -4, 2, 8, 14];

  colZPositions.forEach((cz) => {
    [-6.4, 6.4].forEach((cx) => {
      const colGroup = new THREE.Group();
      colGroup.position.set(cx, 0, cz);

      // 1. Stepped Circular Pedestal Plinth in Ivory Limestone
      const baseGeo = new THREE.CylinderGeometry(0.50, 0.58, 0.32, 32);
      const baseMesh = new THREE.Mesh(baseGeo, materials.columnIvoryStone);
      baseMesh.position.set(0, 0.16, 0);
      baseMesh.receiveShadow = true;
      colGroup.add(baseMesh);

      // 2. 24K Royal Brass Torus Scotia Ring
      const baseTorus = new THREE.Mesh(
        new THREE.TorusGeometry(0.52, 0.028, 16, 32),
        materials.royalBrass
      );
      baseTorus.rotation.x = Math.PI / 2;
      baseTorus.position.set(0, 0.32, 0);
      colGroup.add(baseTorus);

      // 3. Slender Fluted Column Shaft (r = 0.30m, height 6.0m)
      const shaftGeo = new THREE.CylinderGeometry(0.28, 0.32, roomHeight - 0.72, 32);
      const shaftMesh = new THREE.Mesh(shaftGeo, materials.columnIvoryStone);
      shaftMesh.position.set(0, (roomHeight - 0.72) / 2 + 0.34, 0);
      shaftMesh.castShadow = true;
      shaftMesh.receiveShadow = true;
      colGroup.add(shaftMesh);

      // 4. Classical Capital Mouldings in Royal Brass
      const capCollar = new THREE.Mesh(
        new THREE.TorusGeometry(0.32, 0.024, 16, 32),
        materials.royalBrass
      );
      capCollar.rotation.x = Math.PI / 2;
      capCollar.position.set(0, roomHeight - 0.44, 0);
      colGroup.add(capCollar);

      const capGeo = new THREE.CylinderGeometry(0.48, 0.32, 0.28, 32);
      const capMesh = new THREE.Mesh(capGeo, materials.royalBrass);
      capMesh.position.set(0, roomHeight - 0.22, 0);
      colGroup.add(capMesh);

      // 5. Elegant Brass Wall/Column Sconce (Warm amber glow 0xFFE5A8)
      const sconceArm = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.35, 12),
        materials.royalBrass
      );
      sconceArm.rotation.z = cx < 0 ? Math.PI / 2 : -Math.PI / 2;
      sconceArm.position.set(cx < 0 ? 0.32 : -0.32, 2.9, 0);
      colGroup.add(sconceArm);

      const sconceLantern = new THREE.Mesh(
        new THREE.SphereGeometry(0.08, 16, 16),
        materials.luminousGold
      );
      sconceLantern.position.set(cx < 0 ? 0.48 : -0.48, 2.9, 0);
      colGroup.add(sconceLantern);

      const sconceLight = new THREE.PointLight(0xFFE5A8, 0.95, 8.0, 2.0);
      sconceLight.position.set(cx < 0 ? 0.55 : -0.55, 2.9, 0);
      colGroup.add(sconceLight);

      masterGroup.add(colGroup);
    });
  });

  // =========================================================================
  // 5. SOUTH ENTRANCE / RETURN-TO-LOBBY PORTAL
  // =========================================================================
  const portalGroup = new THREE.Group();
  portalGroup.position.set(0, 0, roomLength / 2 - 0.1);

  const doorWidth = 3.8;
  const doorHeight = 4.6;

  // Architectural Posts in warm ivory stone
  const pPostGeo = new THREE.BoxGeometry(0.52, doorHeight, 0.60);
  const pLeftPost = new THREE.Mesh(pPostGeo, materials.columnIvoryStone);
  pLeftPost.position.set(-doorWidth / 2 - 0.26, doorHeight / 2, 0);
  portalGroup.add(pLeftPost);

  const pRightPost = new THREE.Mesh(pPostGeo, materials.columnIvoryStone);
  pRightPost.position.set(doorWidth / 2 + 0.26, doorHeight / 2, 0);
  portalGroup.add(pRightPost);

  // Pillar Capital Mouldings
  const pCapGeo = new THREE.BoxGeometry(0.60, 0.18, 0.68);
  const pLeftCap = new THREE.Mesh(pCapGeo, materials.royalBrass);
  pLeftCap.position.set(-doorWidth / 2 - 0.26, doorHeight - 0.09, 0);
  portalGroup.add(pLeftCap);

  const pRightCap = new THREE.Mesh(pCapGeo, materials.royalBrass);
  pRightCap.position.set(doorWidth / 2 + 0.26, doorHeight - 0.09, 0);
  portalGroup.add(pRightCap);

  // Architrave Lintel in warm ivory limestone
  const pLintel = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + 1.36, 0.60, 0.65),
    materials.columnIvoryStone
  );
  pLintel.position.set(0, doorHeight + 0.30, 0);
  portalGroup.add(pLintel);

  // 24K Royal Brass Cornice
  const pCornice = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + 1.48, 0.12, 0.72),
    materials.royalBrass
  );
  pCornice.position.set(0, doorHeight + 0.64, 0);
  portalGroup.add(pCornice);

  // Doorway Void
  const pVoid = new THREE.Mesh(
    new THREE.PlaneGeometry(doorWidth, doorHeight),
    materials.portalDepth
  );
  pVoid.position.set(0, doorHeight / 2, 0.02);
  pVoid.rotation.y = Math.PI;
  portalGroup.add(pVoid);

  // Entrance Plaque Above Doorway
  const portalPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(doorWidth * 0.9, 1.05),
    materials.entrancePlaque
  );
  portalPlaque.position.set(0, doorHeight + 0.32, -0.34);
  portalPlaque.rotation.y = Math.PI;
  portalGroup.add(portalPlaque);

  // Elevated Threshold in Royal Brass
  const pThreshold = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + 0.8, 0.14, 1.25),
    materials.royalBrass
  );
  pThreshold.position.set(0, 0.07, -0.6);
  portalGroup.add(pThreshold);

  pThreshold.userData = { type: 'portal_return' };
  portalPlaque.userData = { type: 'portal_return' };
  interactiveMeshes.push(pThreshold, portalPlaque);

  masterGroup.add(portalGroup);

  // =========================================================================
  // 6. NORTH WALL 60-YEAR FINALE MONUMENT (1966–2026)
  // Neoclassical Monumental Stele with Layered Pilasters & Royal Gold Accents
  // =========================================================================
  const finaleMonumentGroup = new THREE.Group();
  finaleMonumentGroup.position.set(0, 0, -roomLength / 2 + 0.2);

  // Tier 1: Stepped Ivory Limestone Podium Plinth
  const plinth1 = new THREE.Mesh(
    new THREE.BoxGeometry(11.8, 0.28, 2.4),
    materials.columnIvoryStone
  );
  plinth1.position.set(0, 0.14, 0.9);
  plinth1.receiveShadow = true;
  finaleMonumentGroup.add(plinth1);

  const plinthGoldTrim = new THREE.Mesh(
    new THREE.BoxGeometry(11.9, 0.06, 2.5),
    materials.royalBrass
  );
  plinthGoldTrim.position.set(0, 0.29, 0.9);
  finaleMonumentGroup.add(plinthGoldTrim);

  // Tier 2: Twin Classical Flank Pilasters
  [-5.2, 5.2].forEach((px) => {
    const pilaster = new THREE.Mesh(
      new THREE.BoxGeometry(0.75, 5.2, 0.35),
      materials.columnIvoryStone
    );
    pilaster.position.set(px, 3.2, 0.15);
    finaleMonumentGroup.add(pilaster);

    const pilasterCap = new THREE.Mesh(
      new THREE.BoxGeometry(0.85, 0.20, 0.42),
      materials.royalBrass
    );
    pilasterCap.position.set(px, 5.75, 0.18);
    finaleMonumentGroup.add(pilasterCap);
  });

  // Grand Medallion Panel on North Wall
  const finaleMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(9.6, 4.8),
    materials.finaleMedallion
  );
  finaleMesh.position.set(0, 3.4, 0.08);
  finaleMonumentGroup.add(finaleMesh);

  // Gilded Royal Architectural Frame around Medallion
  const frameBorderGeo = new THREE.BoxGeometry(10.2, 0.18, 0.16);
  const topBorder = new THREE.Mesh(frameBorderGeo, materials.royalBrass);
  topBorder.position.set(0, 5.86, 0.10);
  finaleMonumentGroup.add(topBorder);

  const btmBorder = new THREE.Mesh(frameBorderGeo, materials.royalBrass);
  btmBorder.position.set(0, 0.94, 0.10);
  finaleMonumentGroup.add(btmBorder);

  const sideBorderGeo = new THREE.BoxGeometry(0.18, 5.1, 0.16);
  const leftBorder = new THREE.Mesh(sideBorderGeo, materials.royalBrass);
  leftBorder.position.set(-4.88, 3.4, 0.10);
  finaleMonumentGroup.add(leftBorder);

  const rightBorder = new THREE.Mesh(sideBorderGeo, materials.royalBrass);
  rightBorder.position.set(4.88, 3.4, 0.10);
  finaleMonumentGroup.add(rightBorder);

  // Dedicated Champagne Spotlight on Finale Medallion
  const finaleSpot = new THREE.SpotLight(0xFFF4D8, 4.2);
  finaleSpot.position.set(0, roomHeight - 0.4, -roomLength / 2 + 4.8);
  finaleSpot.target = finaleMesh;
  finaleSpot.angle = 0.72;
  finaleSpot.penumbra = 0.40;
  finaleSpot.distance = 12;
  finaleMonumentGroup.add(finaleSpot);

  masterGroup.add(finaleMonumentGroup);

  // =========================================================================
  // 7. 18 CHRONOLOGICAL MILESTONE DISPLAY PYLONS
  // Redesigned: White marble stepped base, royal brass collar, slender stem,
  // ergonomic 28°-tilted brass display tray, and warm champagne spotlight
  // =========================================================================
  TIMELINE_MILESTONES.forEach((milestone) => {
    const isLeft = milestone.side === 'left';
    const posX = isLeft ? -3.8 : 3.8;
    const posZ = milestone.positionZ;

    const pylonGroup = new THREE.Group();
    pylonGroup.position.set(posX, 0, posZ);

    // Subtle orientation: slight angle facing approaching visitor and central river
    const rotY = isLeft ? 0.28 : -0.28;
    pylonGroup.rotation.y = rotY;

    // 1. Pedestal Base Plinth in Polished White Marble (#FAF8F4)
    const baseGeo = new THREE.CylinderGeometry(0.50, 0.58, 0.22, 32);
    const baseMesh = new THREE.Mesh(baseGeo, materials.pedestalWhiteMarble);
    baseMesh.position.set(0, 0.11, 0);
    baseMesh.receiveShadow = true;
    pylonGroup.add(baseMesh);

    // 2. 24K Royal Brass Torus Collar
    const baseCollar = new THREE.Mesh(
      new THREE.TorusGeometry(0.50, 0.024, 16, 32),
      materials.royalBrass
    );
    baseCollar.rotation.x = Math.PI / 2;
    baseCollar.position.set(0, 0.23, 0);
    pylonGroup.add(baseCollar);

    // 3. Slender Fluted Pillar Stem in White Marble / Ivory Stone
    const stemGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.72, 24);
    const stemMesh = new THREE.Mesh(stemGeo, materials.columnIvoryStone);
    stemMesh.position.set(0, 0.60, 0);
    stemMesh.castShadow = true;
    pylonGroup.add(stemMesh);

    // 4. Royal Brass Capital Bracket Collar
    const stemTrim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.12, 0.08, 24),
      materials.royalBrass
    );
    stemTrim.position.set(0, 0.98, 0);
    pylonGroup.add(stemTrim);

    // 5. Ergonomic Display Head Assembly (~26° reading angle, x = -0.45 rad)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.05, 0);
    headGroup.rotation.x = -0.45;

    // Solid Ivory Stone / Brass Backing Tray
    const trayGeo = new THREE.BoxGeometry(1.50, 0.96, 0.05);
    const trayMesh = new THREE.Mesh(trayGeo, materials.columnIvoryStone);
    trayMesh.position.set(0, 0, 0);
    trayMesh.castShadow = true;
    headGroup.add(trayMesh);

    // 24K Royal Brass Bezel Rim
    const bezelGeo = new THREE.BoxGeometry(1.54, 1.00, 0.03);
    const bezelMesh = new THREE.Mesh(bezelGeo, materials.royalBrass);
    bezelMesh.position.set(0, 0, -0.015);
    headGroup.add(bezelMesh);

    // Dynamic Glow Highlight Rim (for hover / selection focus)
    const glowMat = materials.luminousGold.clone();
    glowMat.emissiveIntensity = 0.25;
    const glowMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.56, 1.02, 0.02),
      glowMat
    );
    glowMesh.position.set(0, 0, -0.022);
    headGroup.add(glowMesh);

    // Display Face Mesh with Crisp Parchment Vietnamese Texture
    const plaqueTex = createMilestoneMarkerTexture(milestone);
    const panelGeo = new THREE.PlaneGeometry(1.44, 0.90);
    const panelMat = new THREE.MeshStandardMaterial({
      map: plaqueTex,
      roughness: 0.22,
      metalness: 0.15,
    });
    const panelMesh = new THREE.Mesh(panelGeo, panelMat);
    panelMesh.position.set(0, 0, 0.028);
    headGroup.add(panelMesh);

    pylonGroup.add(headGroup);

    // Dedicated Warm Champagne Spotlight on the Milestone Marker
    const markerLight = new THREE.PointLight(0xFFF2D0, 1.25, 5.0, 2.0);
    markerLight.position.set(0, 1.95, 0.50);
    pylonGroup.add(markerLight);

    // Interactive user data for raycasting
    panelMesh.userData = {
      type: 'milestone',
      milestoneId: milestone.id,
      milestone,
    };
    interactiveMeshes.push(panelMesh);

    masterGroup.add(pylonGroup);

    milestoneObjects.set(milestone.id, {
      milestone,
      group: pylonGroup,
      panelMesh,
      glowBezel: glowMesh,
      spotlight: markerLight,
    });
  });

  return {
    masterGroup,
    interactiveMeshes,
    milestoneObjects,
    portalMesh: pThreshold,
    finaleMonumentGroup,
    riverParticles,
    riverParticlePos,
  };
}
