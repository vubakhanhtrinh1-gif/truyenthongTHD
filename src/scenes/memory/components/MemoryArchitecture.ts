import * as THREE from 'three';
import {
  TeacherItem,
  MomentItem,
  GratitudeEssayData,
  EntranceIntroData,
} from '../config/memoryContentData';
import { MemoryMaterialSet } from '../materials/MemoryMaterials';
import {
  createTeacherFrameTexture,
  createMomentFrameTexture,
  updateTeacherFrameTexture,
  updateMomentFrameTexture,
  updateDedicationEssayTexture,
  updateWall1SectionHeaderTexture,
  updateWall2SectionHeaderTexture,
  updateExitPortalSignTexture,
  updateEntrancePlaqueTexture,
} from '../textures/MemoryProceduralTextures';

export interface InteractiveMemoryExhibit {
  type: 'teacher' | 'moment' | 'essay' | 'portal_return';
  id?: string;
  data?: TeacherItem | MomentItem | GratitudeEssayData;
}

export interface MemorySceneElements {
  masterGroup: THREE.Group;
  interactiveMeshes: THREE.Object3D[];
  teacherMeshes: Map<string, THREE.Mesh>;
  momentMeshes: Map<string, THREE.Mesh>;
  essayMesh: THREE.Mesh;
  portalMesh: THREE.Mesh;
}

/**
 * Builds the complete 3D architectural interior of the Gratitude & Memories Room,
 * modeled faithfully on the reference photograph (image_bcc828e9.png):
 * - Closely spaced parallel warm natural wood ceiling slats with integrated recessed spotlights
 * - Light natural oak timber floor planks with neutral woven linen rug
 * - Honed warm light-gray/beige sandstone walls with horizontal reveal shadow grooves (SOLID - no glass/outdoor forest)
 * - Continuous horizontal honey-oak display band mounted at eye level
 * - Dark graphite section header boards ("Path of Challenge" architectural style)
 * - Slim dark-metal framed photographic displays
 * - Wall 3 Grand Dedication Monument ("TRI ÂN NHỮNG NGƯỜI LÁI ĐÒ")
 * - Wall 4 Entrance portal & introduction panel
 * - Minimalist black steel frame benches with segmented leather cushions
 */
export function buildMemoryArchitecture(
  materials: MemoryMaterialSet,
  teachers: TeacherItem[],
  moments: MomentItem[]
): MemorySceneElements {
  const masterGroup = new THREE.Group();
  const interactiveMeshes: THREE.Object3D[] = [];
  const teacherMeshes = new Map<string, THREE.Mesh>();
  const momentMeshes = new Map<string, THREE.Mesh>();

  // Logical room dimensions
  const roomWidth = 18; // X: -9.0 to +9.0
  const roomLength = 24; // Z: -12.0 to +12.0
  const roomHeight = 5.2; // Y: 0 to 5.2

  // =========================================================================
  // 1. FLOOR & NEUTRAL WOVEN AREA RUG
  // =========================================================================
  // Main light oak timber plank floor
  const floorGeo = new THREE.PlaneGeometry(roomWidth, roomLength);
  const floorMesh = new THREE.Mesh(floorGeo, materials.floorOak);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  masterGroup.add(floorMesh);

  // Neutral woven area rug (inspired directly by the reference image)
  // Positioned where visitors walk and view the exhibits
  const rugWidth = 7.0;
  const rugLength = 17.0;
  const rugGeo = new THREE.PlaneGeometry(rugWidth, rugLength);
  const rugMesh = new THREE.Mesh(rugGeo, materials.neutralRug);
  rugMesh.rotation.x = -Math.PI / 2;
  rugMesh.position.set(0, 0.006, 0);
  rugMesh.receiveShadow = true;
  masterGroup.add(rugMesh);

  // Slim perimeter expansion trim along floor perimeter
  const floorTrimGeo = new THREE.BoxGeometry(0.04, 0.06, roomLength);
  const leftFloorTrim = new THREE.Mesh(floorTrimGeo, materials.champagneGold);
  leftFloorTrim.position.set(-roomWidth / 2 + 0.02, 0.03, 0);
  masterGroup.add(leftFloorTrim);

  const rightFloorTrim = new THREE.Mesh(floorTrimGeo, materials.champagneGold);
  rightFloorTrim.position.set(roomWidth / 2 - 0.02, 0.03, 0);
  masterGroup.add(rightFloorTrim);

  // =========================================================================
  // 2. CEILING: PARALLEL WARM NATURAL-WOOD SLATS & RECESSED PIN-SPOTLIGHTS
  // =========================================================================
  // Dark plenum backdrop above slats
  const ceilingPlenumGeo = new THREE.PlaneGeometry(roomWidth, roomLength);
  const ceilingPlenumMat = new THREE.MeshBasicMaterial({ color: 0x14161A });
  const ceilingPlenum = new THREE.Mesh(ceilingPlenumGeo, ceilingPlenumMat);
  ceilingPlenum.rotation.x = Math.PI / 2;
  ceilingPlenum.position.set(0, roomHeight + 0.05, 0);
  masterGroup.add(ceilingPlenum);

  // Parallel wood ceiling slats running lengthwise (along Z axis)
  // Slats: width 0.08m, height 0.14m, length roomLength - 0.6m
  const slatCount = 76;
  const slatSpacing = (roomWidth - 1.2) / (slatCount - 1);
  const slatWidth = 0.075;
  const slatDepth = 0.12;
  const slatGeo = new THREE.BoxGeometry(slatWidth, slatDepth, roomLength - 0.4);

  for (let i = 0; i < slatCount; i++) {
    const xPos = -roomWidth / 2 + 0.6 + i * slatSpacing;
    const slat = new THREE.Mesh(slatGeo, materials.woodHoney);
    slat.position.set(xPos, roomHeight - slatDepth / 2, 0);
    masterGroup.add(slat);
  }

  // Solid wood header fascias framing the ceiling edges (reference detail)
  const headerGeoX = new THREE.BoxGeometry(roomWidth, 0.25, 0.35);
  const frontHeader = new THREE.Mesh(headerGeoX, materials.woodHoney);
  frontHeader.position.set(0, roomHeight - 0.12, -roomLength / 2 + 0.18);
  masterGroup.add(frontHeader);

  const backHeader = new THREE.Mesh(headerGeoX, materials.woodHoney);
  backHeader.position.set(0, roomHeight - 0.12, roomLength / 2 - 0.18);
  masterGroup.add(backHeader);

  const headerGeoZ = new THREE.BoxGeometry(0.35, 0.25, roomLength);
  const leftHeader = new THREE.Mesh(headerGeoZ, materials.woodHoney);
  leftHeader.position.set(-roomWidth / 2 + 0.18, roomHeight - 0.12, 0);
  masterGroup.add(leftHeader);

  const rightHeader = new THREE.Mesh(headerGeoZ, materials.woodHoney);
  rightHeader.position.set(roomWidth / 2 - 0.18, roomHeight - 0.12, 0);
  masterGroup.add(rightHeader);

  // Recessed pinhole downlights embedded in neat rows between the ceiling slats
  // Spotlights distributed regularly across the room (4 rows in X, 6 columns in Z)
  const spotXPositions = [-5.5, -2.0, 2.0, 5.5];
  const spotZPositions = [-8.5, -5.0, -1.5, 2.0, 5.5, 9.0];
  const spotHousingGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.06, 16);

  spotZPositions.forEach((sz) => {
    spotXPositions.forEach((sx) => {
      // Small circular recessed spotlight housing
      const spotMesh = new THREE.Mesh(spotHousingGeo, materials.spotlightLens);
      spotMesh.position.set(sx, roomHeight - 0.08, sz);
      masterGroup.add(spotMesh);

      // Warm pool lighting on floor and displays (controlled intensity, 3000K warm white)
      const downlight = new THREE.PointLight(0xFFF3DD, 0.65, 8.5, 2);
      downlight.position.set(sx, roomHeight - 0.2, sz);
      masterGroup.add(downlight);
    });
  });

  // =========================================================================
  // 3. ARCHITECTURAL WALLS (HONED SANDSTONE PANELS - 100% SOLID INTERIOR)
  // =========================================================================
  // Wall 1: West Wall (Left, x = -roomWidth / 2)
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(roomLength, roomHeight),
    materials.wallStone
  );
  leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  leftWall.receiveShadow = true;
  masterGroup.add(leftWall);

  // Wall 2: East Wall (Right, x = +roomWidth / 2)
  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(roomLength, roomHeight),
    materials.wallStone
  );
  rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  rightWall.receiveShadow = true;
  masterGroup.add(rightWall);

  // Wall 3: North Wall (Dedication Centerpiece, z = -roomLength / 2)
  const northWall = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, roomHeight),
    materials.wallStone
  );
  northWall.position.set(0, roomHeight / 2, -roomLength / 2);
  northWall.receiveShadow = true;
  masterGroup.add(northWall);

  // Wall 4: South Wall (Entrance, z = +roomLength / 2)
  const southWall = new THREE.Mesh(
    new THREE.PlaneGeometry(roomWidth, roomHeight),
    materials.wallStone
  );
  southWall.position.set(0, roomHeight / 2, roomLength / 2);
  southWall.rotation.y = Math.PI;
  southWall.receiveShadow = true;
  masterGroup.add(southWall);

  // Slim walnut/dark-metal baseboard around room base
  const makeBaseboard = (w: number, l: number, posX: number, posZ: number, rotY: number) => {
    const bb = new THREE.Mesh(new THREE.BoxGeometry(w, 0.16, 0.05), materials.darkMetal);
    bb.position.set(posX, 0.08, posZ);
    bb.rotation.y = rotY;
    masterGroup.add(bb);
  };
  makeBaseboard(roomLength, 0, -roomWidth / 2 + 0.025, 0, Math.PI / 2);
  makeBaseboard(roomLength, 0, roomWidth / 2 - 0.025, 0, -Math.PI / 2);
  makeBaseboard(roomWidth, 0, 0, -roomLength / 2 + 0.025, 0);
  makeBaseboard(roomWidth, 0, 0, roomLength / 2 - 0.025, Math.PI);

  // =========================================================================
  // 4. WALL 1 (LEFT / WEST): "NHỮNG NGƯỜI LÁI ĐÒ" (HONORING EDUCATORS)
  // Continuous horizontal honey-oak display band + Dark Section Header + Displays
  // =========================================================================
  const wall1Group = new THREE.Group();
  wall1Group.position.set(-roomWidth / 2 + 0.06, 0, 0);
  wall1Group.rotation.y = Math.PI / 2;

  // Architectural Vertical Wood Slats behind the band (inspired by image_e89e9c29.png)
  const wallVSlatGeo = new THREE.BoxGeometry(0.045, 3.4, 0.035);
  for (let vx = -9.6; vx <= 9.6; vx += 0.28) {
    const vSlat = new THREE.Mesh(wallVSlatGeo, materials.woodHoney);
    vSlat.position.set(vx, 2.1, 0.02);
    wall1Group.add(vSlat);
  }

  // Concealed Top Cove Light Baffle & Glow Strip (image_9b26ec39.png & image_e89e9c29.png)
  const coveBaffle = new THREE.Mesh(
    new THREE.BoxGeometry(20.5, 0.14, 0.22),
    materials.woodHoney
  );
  coveBaffle.position.set(0, roomHeight - 0.07, 0.11);
  wall1Group.add(coveBaffle);

  const coveStrip = new THREE.Mesh(
    new THREE.BoxGeometry(20.2, 0.03, 0.04),
    materials.coveGlow
  );
  coveStrip.position.set(0, roomHeight - 0.12, 0.05);
  wall1Group.add(coveStrip);

  // Warm grazing top cove light wash onto Wall 1
  [-6.5, -2.0, 2.5, 7.0].forEach((lx) => {
    const coveLight = new THREE.PointLight(0xFFE5B8, 0.65, 5.5, 2);
    coveLight.position.set(lx, roomHeight - 0.25, 0.35);
    wall1Group.add(coveLight);
  });

  // The Signature Horizontal Wood Display Band (reference feature)
  // Width: 20m, Height: 1.5m, Centered at Y = 2.05m
  const bandLength = 20.0;
  const bandHeight = 1.45;
  const bandDepth = 0.07;
  const woodBandGeo = new THREE.BoxGeometry(bandLength, bandHeight, bandDepth);
  const wall1WoodBand = new THREE.Mesh(woodBandGeo, materials.woodHoney);
  wall1WoodBand.position.set(0, 2.05, bandDepth / 2);
  wall1Group.add(wall1WoodBand);

  // Top and bottom shadow reveal rails on the wood band
  const bandRailGeo = new THREE.BoxGeometry(bandLength, 0.025, bandDepth + 0.02);
  const w1TopRail = new THREE.Mesh(bandRailGeo, materials.champagneGold);
  w1TopRail.position.set(0, 2.05 + bandHeight / 2 + 0.012, bandDepth / 2);
  wall1Group.add(w1TopRail);

  const w1BtmRail = new THREE.Mesh(bandRailGeo, materials.champagneGold);
  w1BtmRail.position.set(0, 2.05 - bandHeight / 2 - 0.012, bandDepth / 2);
  wall1Group.add(w1BtmRail);

  // Dark Graphite Section Header Board (at one end of the band, exactly like the reference!)
  // Placed at local X = 7.8m (near South entrance)
  const headerBoardGeo = new THREE.BoxGeometry(1.65, 1.95, 0.08);
  const w1HeaderMesh = new THREE.Mesh(headerBoardGeo, materials.sectionHeaderWall1);
  w1HeaderMesh.position.set(7.8, 2.15, bandDepth + 0.04);
  wall1Group.add(w1HeaderMesh);

  // 6 Teacher Photograph Frames mounted horizontally along the wood band
  // Positions: local X = [5.5, 2.9, 0.3, -2.3, -4.9, -7.5]
  const teacherXPositions = [5.5, 2.9, 0.3, -2.3, -4.9, -7.5];

  teachers.forEach((teacher, idx) => {
    const posX = teacherXPositions[idx % teacherXPositions.length];
    const posY = 2.05;

    const frameGroup = new THREE.Group();
    frameGroup.position.set(posX, posY, bandDepth + 0.03);

    // Slim dark-metal outer frame (reference detail)
    const frameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.15, 1.25, 0.05),
      materials.darkMetal
    );
    frameGroup.add(frameMesh);

    // Inner photo canvas display
    const frameTex = createTeacherFrameTexture(teacher);
    const photoMat = new THREE.MeshStandardMaterial({
      map: frameTex,
      roughness: 0.28,
      metalness: 0.12,
    });
    const photoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.05, 1.15),
      photoMat
    );
    photoMesh.position.set(0, 0, 0.028);
    frameGroup.add(photoMesh);


    // Spot accent light directed at this photo frame
    const spot = new THREE.PointLight(0xFFF3DD, 0.75, 4.2, 2);
    spot.position.set(0, 1.2, 0.9);
    frameGroup.add(spot);

    // Interactive raycasting hitbox
    photoMesh.userData = {
      type: 'teacher',
      teacherId: teacher.id,
      teacher,
    };
    interactiveMeshes.push(photoMesh);
    teacherMeshes.set(teacher.id, photoMesh);

    wall1Group.add(frameGroup);
  });

  masterGroup.add(wall1Group);

  // =========================================================================
  // 5. WALL 2 (RIGHT / EAST): "NHỮNG KHOẢNH KHẮC KHÔNG QUÊN" (MEMORIES)
  // Matching continuous horizontal honey-oak display band + Header + Displays
  // =========================================================================
  const wall2Group = new THREE.Group();
  wall2Group.position.set(roomWidth / 2 - 0.06, 0, 0);
  wall2Group.rotation.y = -Math.PI / 2;

  // Architectural Vertical Wood Slats behind the band (inspired by image_e89e9c29.png)
  for (let vx = -9.6; vx <= 9.6; vx += 0.28) {
    const vSlat = new THREE.Mesh(wallVSlatGeo, materials.woodHoney);
    vSlat.position.set(vx, 2.1, 0.02);
    wall2Group.add(vSlat);
  }

  // Concealed Top Cove Light Baffle & Glow Strip (image_9b26ec39.png & image_e89e9c29.png)
  const coveBaffle2 = new THREE.Mesh(
    new THREE.BoxGeometry(20.5, 0.14, 0.22),
    materials.woodHoney
  );
  coveBaffle2.position.set(0, roomHeight - 0.07, 0.11);
  wall2Group.add(coveBaffle2);

  const coveStrip2 = new THREE.Mesh(
    new THREE.BoxGeometry(20.2, 0.03, 0.04),
    materials.coveGlow
  );
  coveStrip2.position.set(0, roomHeight - 0.12, 0.05);
  wall2Group.add(coveStrip2);

  // Warm grazing top cove light wash onto Wall 2
  [-6.5, -2.0, 2.5, 7.0].forEach((lx) => {
    const coveLight = new THREE.PointLight(0xFFE5B8, 0.65, 5.5, 2);
    coveLight.position.set(lx, roomHeight - 0.25, 0.35);
    wall2Group.add(coveLight);
  });

  // The Horizontal Wood Display Band
  const wall2WoodBand = new THREE.Mesh(woodBandGeo, materials.woodHoney);
  wall2WoodBand.position.set(0, 2.05, bandDepth / 2);
  wall2Group.add(wall2WoodBand);

  const w2TopRail = new THREE.Mesh(bandRailGeo, materials.champagneGold);
  w2TopRail.position.set(0, 2.05 + bandHeight / 2 + 0.012, bandDepth / 2);
  wall2Group.add(w2TopRail);

  const w2BtmRail = new THREE.Mesh(bandRailGeo, materials.champagneGold);
  w2BtmRail.position.set(0, 2.05 - bandHeight / 2 - 0.012, bandDepth / 2);
  wall2Group.add(w2BtmRail);

  // Dark Graphite Section Header Board
  const w2HeaderMesh = new THREE.Mesh(headerBoardGeo, materials.sectionHeaderWall2);
  w2HeaderMesh.position.set(-7.8, 2.15, bandDepth + 0.04);
  wall2Group.add(w2HeaderMesh);

  // 6 Moment Photograph Frames mounted along the wood band
  // Positions: local X = [-5.5, -2.9, -0.3, 2.3, 4.9, 7.5]
  const momentXPositions = [-5.5, -2.9, -0.3, 2.3, 4.9, 7.5];

  moments.forEach((moment, idx) => {
    const posX = momentXPositions[idx % momentXPositions.length];
    const posY = 2.05;

    const frameGroup = new THREE.Group();
    frameGroup.position.set(posX, posY, bandDepth + 0.03);

    // Slim dark-metal frame
    const frameMesh = new THREE.Mesh(
      new THREE.BoxGeometry(2.15, 1.25, 0.05),
      materials.darkMetal
    );
    frameGroup.add(frameMesh);

    // Inner photo canvas display
    const frameTex = createMomentFrameTexture(moment);
    const photoMat = new THREE.MeshStandardMaterial({
      map: frameTex,
      roughness: 0.28,
      metalness: 0.12,
    });
    const photoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.05, 1.15),
      photoMat
    );
    photoMesh.position.set(0, 0, 0.028);
    frameGroup.add(photoMesh);


    // Spot accent light
    const spot = new THREE.PointLight(0xFFF3DD, 0.75, 4.2, 2);
    spot.position.set(0, 1.2, 0.9);
    frameGroup.add(spot);

    // Interactive raycasting hitbox
    photoMesh.userData = {
      type: 'moment',
      momentId: moment.id,
      moment,
    };
    interactiveMeshes.push(photoMesh);
    momentMeshes.set(moment.id, photoMesh);

    wall2Group.add(frameGroup);
  });

  masterGroup.add(wall2Group);

  // =========================================================================
  // 6. WALL 3 (NORTH): "TRI ÂN NHỮNG NGƯỜI LÁI ĐÒ" (PRINCIPAL DEDICATION SHRINE)
  // Grand architectural wood slat acoustic surround + Stepped Plinth + Essay
  // =========================================================================
  const dedicationGroup = new THREE.Group();
  dedicationGroup.position.set(0, 0, -roomLength / 2 + 0.12);

  // Stepped Plinth Base
  const plinthLower = new THREE.Mesh(
    new THREE.BoxGeometry(11.2, 0.18, 1.4),
    materials.floorOak
  );
  plinthLower.position.set(0, 0.09, 0.7);
  dedicationGroup.add(plinthLower);

  const plinthGold = new THREE.Mesh(
    new THREE.BoxGeometry(11.3, 0.03, 1.45),
    materials.champagneGold
  );
  plinthGold.position.set(0, 0.195, 0.7);
  dedicationGroup.add(plinthGold);

  // Architectural Wood Feature Wall Backing (width 10.5m x height 4.6m)
  const woodBacking = new THREE.Mesh(
    new THREE.BoxGeometry(10.5, 4.6, 0.1),
    materials.woodHoney
  );
  woodBacking.position.set(0, 2.45, 0.05);
  dedicationGroup.add(woodBacking);

  // Vertical acoustic wood slat accents flanking the central essay
  const vSlatGeo = new THREE.BoxGeometry(0.06, 4.5, 0.05);
  const leftSlatXs = [-4.9, -4.7, -4.5, -4.3, -4.1];
  leftSlatXs.forEach((x) => {
    const s = new THREE.Mesh(vSlatGeo, materials.woodHoney);
    s.position.set(x, 2.45, 0.12);
    dedicationGroup.add(s);
  });
  const rightSlatXs = [4.1, 4.3, 4.5, 4.7, 4.9];
  rightSlatXs.forEach((x) => {
    const s = new THREE.Mesh(vSlatGeo, materials.woodHoney);
    s.position.set(x, 2.45, 0.12);
    dedicationGroup.add(s);
  });

  // Grand Dedication Essay Panel (Width: 7.8m x Height: 4.1m)
  const essayGeo = new THREE.PlaneGeometry(7.8, 4.1);
  const essayMesh = new THREE.Mesh(essayGeo, materials.dedicationEssay);
  essayMesh.position.set(0, 2.45, 0.12);
  dedicationGroup.add(essayMesh);

  // Architectural Dark Metal & Champagne Gold Outer Frame
  const fTop = new THREE.Mesh(new THREE.BoxGeometry(8.1, 0.1, 0.08), materials.darkMetal);
  fTop.position.set(0, 4.52, 0.14);
  dedicationGroup.add(fTop);

  const fBtm = new THREE.Mesh(new THREE.BoxGeometry(8.1, 0.1, 0.08), materials.darkMetal);
  fBtm.position.set(0, 0.38, 0.14);
  dedicationGroup.add(fBtm);

  const fLeft = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.24, 0.08), materials.darkMetal);
  fLeft.position.set(-3.95, 2.45, 0.14);
  dedicationGroup.add(fLeft);

  const fRight = new THREE.Mesh(new THREE.BoxGeometry(0.1, 4.24, 0.08), materials.darkMetal);
  fRight.position.set(3.95, 2.45, 0.14);
  dedicationGroup.add(fRight);

  // Dedicated Soft Golden Spotlights focused onto the Dedication Panel
  const spotLeft = new THREE.SpotLight(0xFFF3DD, 2.4);
  spotLeft.position.set(-3.0, roomHeight - 0.4, -roomLength / 2 + 4.0);
  spotLeft.target = essayMesh;
  spotLeft.angle = 0.65;
  spotLeft.penumbra = 0.55;
  spotLeft.distance = 9;
  dedicationGroup.add(spotLeft);

  const spotRight = new THREE.SpotLight(0xFFF3DD, 2.4);
  spotRight.position.set(3.0, roomHeight - 0.4, -roomLength / 2 + 4.0);
  spotRight.target = essayMesh;
  spotRight.angle = 0.65;
  spotRight.penumbra = 0.55;
  spotRight.distance = 9;
  dedicationGroup.add(spotRight);

  // Interactive raycasting setup
  essayMesh.userData = { type: 'essay' };
  interactiveMeshes.push(essayMesh);

  masterGroup.add(dedicationGroup);

  // =========================================================================
  // 7. WALL 4 (SOUTH): ENTRANCE PORTAL & DEDICATED EXIT SIGNAGE
  // "VỀ SẢNH CHÍNH" / "PHÒNG TRI ÂN & KÝ ỨC"
  // =========================================================================
  const entranceGroup = new THREE.Group();
  entranceGroup.position.set(0, 0, roomLength / 2 - 0.12);

  const doorWidth = 3.6;
  const doorHeight = 3.65;

  // Solid wood portal posts
  const postGeo = new THREE.BoxGeometry(0.4, doorHeight, 0.35);
  const leftPost = new THREE.Mesh(postGeo, materials.woodHoney);
  leftPost.position.set(-doorWidth / 2 - 0.2, doorHeight / 2, 0);
  entranceGroup.add(leftPost);

  const rightPost = new THREE.Mesh(postGeo, materials.woodHoney);
  rightPost.position.set(doorWidth / 2 + 0.2, doorHeight / 2, 0);
  entranceGroup.add(rightPost);

  // Lintel & Cornice
  const lintelMesh = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + 0.9, 0.32, 0.4),
    materials.woodHoney
  );
  lintelMesh.position.set(0, doorHeight + 0.16, 0);
  entranceGroup.add(lintelMesh);

  const goldCornice = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + 1.0, 0.04, 0.42),
    materials.champagneGold
  );
  goldCornice.position.set(0, doorHeight + 0.34, 0);
  entranceGroup.add(goldCornice);

  // Door Void
  const portalVoid = new THREE.Mesh(
    new THREE.PlaneGeometry(doorWidth, doorHeight),
    materials.portalDepth
  );
  portalVoid.position.set(0, doorHeight / 2, 0.02);
  portalVoid.rotation.y = Math.PI;
  entranceGroup.add(portalVoid);

  // -------------------------------------------------------------------------
  // ARCHITECTURAL EXIT SIGN FIXTURE (TASK A)
  // Dimensions: 4.0m x 1.0m (Exact 4:1 aspect ratio matching the 2048x512 texture)
  // Zero distortion, razor-sharp Vietnamese typography, warm honey-oak finish
  // -------------------------------------------------------------------------
  const signGroup = new THREE.Group();
  signGroup.position.set(0, 4.58, -0.06);
  signGroup.rotation.y = Math.PI; // Face visitor looking south toward exit

  // Outer dark-metal architectural sign box
  const signBacking = new THREE.Mesh(
    new THREE.BoxGeometry(4.18, 1.06, 0.08),
    materials.darkMetal
  );
  signGroup.add(signBacking);

  // Champagne-gold inner border reveal
  const signGoldBorder = new THREE.Mesh(
    new THREE.BoxGeometry(4.08, 0.98, 0.085),
    materials.champagneGold
  );
  signGroup.add(signGoldBorder);

  // Front sign face (Exact 4.0m x 1.0m plane, perfectly mapped 1:1)
  const exitSignFace = new THREE.Mesh(
    new THREE.PlaneGeometry(4.0, 1.0),
    materials.entranceIntro
  );
  exitSignFace.position.set(0, 0, 0.044);
  signGroup.add(exitSignFace);

  // Dedicated warm gallery spotlight grazing down onto the exit sign
  const exitSignSpot = new THREE.SpotLight(0xFFF1D4, 2.5, 6.0, 0.7, 0.5);
  exitSignSpot.position.set(0, 5.15, -0.65);
  exitSignSpot.target = exitSignFace;
  entranceGroup.add(exitSignSpot);

  entranceGroup.add(signGroup);

  // -------------------------------------------------------------------------
  // WALL-MOUNTED CURATORIAL INTRODUCTION PLAQUE (Beside the exit door)
  // Displays the full introductory narrative & tradition motto in high resolution
  // -------------------------------------------------------------------------
  const introWallGroup = new THREE.Group();
  introWallGroup.position.set(3.4, 2.25, -0.05);
  introWallGroup.rotation.y = Math.PI;

  const wallPlaqueBack = new THREE.Mesh(
    new THREE.BoxGeometry(1.4, 1.4, 0.05),
    materials.darkMetal
  );
  introWallGroup.add(wallPlaqueBack);

  const wallPlaqueGold = new THREE.Mesh(
    new THREE.BoxGeometry(1.34, 1.34, 0.055),
    materials.champagneGold
  );
  introWallGroup.add(wallPlaqueGold);

  const wallPlaqueFace = new THREE.Mesh(
    new THREE.PlaneGeometry(1.28, 1.28),
    materials.introWallPlaque
  );
  wallPlaqueFace.position.set(0, 0, 0.03);
  introWallGroup.add(wallPlaqueFace);

  const wallPlaqueSpot = new THREE.PointLight(0xFFF3DD, 0.7, 4.0, 2);
  wallPlaqueSpot.position.set(0, 0.9, 0.7);
  introWallGroup.add(wallPlaqueSpot);

  entranceGroup.add(introWallGroup);

  // Champagne gold threshold step (interactive raycast target)
  const thresholdMesh = new THREE.Mesh(
    new THREE.BoxGeometry(doorWidth + 0.4, 0.08, 1.0),
    materials.champagneGold
  );
  thresholdMesh.position.set(0, 0.04, -0.5);
  entranceGroup.add(thresholdMesh);

  // Raycast interaction registration
  thresholdMesh.userData = { type: 'portal_return' };
  exitSignFace.userData = { type: 'portal_return' };
  signBacking.userData = { type: 'portal_return' };
  portalVoid.userData = { type: 'portal_return' };
  interactiveMeshes.push(thresholdMesh, exitSignFace, portalVoid);

  masterGroup.add(entranceGroup);

  // =========================================================================
  // 8. GEORGE NELSON MID-CENTURY SLATTED PLATFORM BENCH (TASK B)
  // Solid natural honey-oak longitudinal slats with open air gaps,
  // blackened steel trapezoidal sled legs, and tailored black leather seat cushion
  // =========================================================================
  const createBench = (posX: number, posZ: number, rotY: number) => {
    const benchGroup = new THREE.Group();
    benchGroup.position.set(posX, 0, posZ);
    benchGroup.rotation.y = rotY;

    const benchLength = 3.4;
    const benchWidth = 0.70;
    const benchHeight = 0.44;

    // 1. Natural Honey Oak Platform Slats (George Nelson Slat Platform)
    const slatCount = 13;
    const slatWidth = 0.038;
    const slatHeight = 0.045;
    const gap = (benchWidth - slatCount * slatWidth) / (slatCount - 1);
    const slatGeo = new THREE.BoxGeometry(benchLength, slatHeight, slatWidth);

    for (let s = 0; s < slatCount; s++) {
      const zOffset = -benchWidth / 2 + slatWidth / 2 + s * (slatWidth + gap);
      const slat = new THREE.Mesh(slatGeo, materials.woodHoney);
      slat.position.set(0, benchHeight - slatHeight / 2, zOffset);
      benchGroup.add(slat);
    }

    // Solid Honey Oak End Rails & Center Stretcher
    const endRailGeo = new THREE.BoxGeometry(0.045, slatHeight, benchWidth);
    const leftEndRail = new THREE.Mesh(endRailGeo, materials.woodHoney);
    leftEndRail.position.set(-benchLength / 2 + 0.022, benchHeight - slatHeight / 2, 0);
    benchGroup.add(leftEndRail);

    const rightEndRail = new THREE.Mesh(endRailGeo, materials.woodHoney);
    rightEndRail.position.set(benchLength / 2 - 0.022, benchHeight - slatHeight / 2, 0);
    benchGroup.add(rightEndRail);

    const centerRail = new THREE.Mesh(endRailGeo, materials.woodHoney);
    centerRail.position.set(0, benchHeight - slatHeight / 2, 0);
    benchGroup.add(centerRail);

    // 2. Blackened Steel Sled Legs (Trapezoidal / Inverted U Frame)
    const legXs = [-benchLength / 2 + 0.45, benchLength / 2 - 0.45];
    legXs.forEach((lx) => {
      // Top mounting plate
      const legPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, 0.025, benchWidth - 0.08),
        materials.darkMetal
      );
      legPlate.position.set(lx, benchHeight - slatHeight - 0.012, 0);
      benchGroup.add(legPlate);

      // Angled trapezoidal legs (left & right)
      const legPostGeo = new THREE.BoxGeometry(0.04, benchHeight - slatHeight - 0.02, 0.04);
      const legLeft = new THREE.Mesh(legPostGeo, materials.darkMetal);
      legLeft.position.set(lx, (benchHeight - slatHeight) / 2, -benchWidth / 2 + 0.08);
      benchGroup.add(legLeft);

      const legRight = new THREE.Mesh(legPostGeo, materials.darkMetal);
      legRight.position.set(lx, (benchHeight - slatHeight) / 2, benchWidth / 2 - 0.08);
      benchGroup.add(legRight);

      // Bottom runner connecting feet
      const legRunner = new THREE.Mesh(
        new THREE.BoxGeometry(0.045, 0.02, benchWidth - 0.06),
        materials.darkMetal
      );
      legRunner.position.set(lx, 0.01, 0);
      benchGroup.add(legRunner);
    });

    // 3. Tailored Black Leather Cushion Pad on One Portion of Bench (40% coverage)
    // Modeled precisely after mid-century gallery benches, leaving wood slats exposed on 60%
    const padLength = 1.35;
    const padWidth = benchWidth - 0.04;
    const padHeight = 0.06;
    const cushionGeo = new THREE.BoxGeometry(padLength, padHeight, padWidth);
    const cushionMesh = new THREE.Mesh(cushionGeo, materials.benchLeather);
    cushionMesh.position.set(
      -benchLength / 2 + padLength / 2 + 0.06,
      benchHeight + padHeight / 2,
      0
    );
    benchGroup.add(cushionMesh);

    // Subtle channel tuft stitching on cushion
    for (let c = -padLength / 2 + 0.28; c <= padLength / 2 - 0.2; c += 0.28) {
      const rib = new THREE.Mesh(
        new THREE.BoxGeometry(0.015, 0.008, padWidth),
        materials.darkMetal
      );
      rib.position.set(
        -benchLength / 2 + padLength / 2 + 0.06 + c,
        benchHeight + padHeight + 0.002,
        0
      );
      benchGroup.add(rib);
    }

    masterGroup.add(benchGroup);
  };

  // Place benches along the edge of the neutral rug (leaving the wide central walkway open)
  // Left bench facing Wall 1
  createBench(-3.4, 0.5, 0);
  // Right bench facing Wall 2
  createBench(3.4, -2.5, 0);

  return {
    masterGroup,
    interactiveMeshes,
    teacherMeshes,
    momentMeshes,
    essayMesh,
    portalMesh: thresholdMesh,
  };
}

/**
 * Safely updates all memory room content surfaces in place.
 * Does not rebuild meshes, does not tear down Three.js scene,
 * does not reset camera or player coordinates.
 */
export function updateMemoryArchitectureContent(
  elements: MemorySceneElements,
  materials: MemoryMaterialSet,
  teachers: TeacherItem[],
  moments: MomentItem[],
  essay: GratitudeEssayData,
  intro: EntranceIntroData,
  wall1Title: string,
  wall1Subtitle: string,
  wall2Title: string,
  wall2Subtitle: string
): void {
  // 1. Update teachers gallery in place
  teachers.forEach((t) => {
    const mesh = elements.teacherMeshes.get(t.id);
    if (mesh) {
      mesh.userData.teacher = t;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && mat.map && mat.map instanceof THREE.CanvasTexture) {
        updateTeacherFrameTexture(mat.map, t);
      }
    }
  });

  // 2. Update moments gallery in place
  moments.forEach((m) => {
    const mesh = elements.momentMeshes.get(m.id);
    if (mesh) {
      mesh.userData.moment = m;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat && mat.map && mat.map instanceof THREE.CanvasTexture) {
        updateMomentFrameTexture(mat.map, m);
      }
    }
  });

  // 3. Update Wall 3 Dedication Essay in place
  if (materials.dedicationEssay.map && materials.dedicationEssay.map instanceof THREE.CanvasTexture) {
    updateDedicationEssayTexture(materials.dedicationEssay.map, essay);
  }

  // 4. Update Wall 1 & Wall 2 Section Headers in place
  if (materials.sectionHeaderWall1.map && materials.sectionHeaderWall1.map instanceof THREE.CanvasTexture) {
    updateWall1SectionHeaderTexture(materials.sectionHeaderWall1.map, wall1Title, wall1Subtitle);
  }
  if (materials.sectionHeaderWall2.map && materials.sectionHeaderWall2.map instanceof THREE.CanvasTexture) {
    updateWall2SectionHeaderTexture(materials.sectionHeaderWall2.map, wall2Title, wall2Subtitle);
  }

  // 5. Update Entrance / Exit Portal & Plaque in place
  if (materials.entranceIntro.map && materials.entranceIntro.map instanceof THREE.CanvasTexture) {
    updateExitPortalSignTexture(materials.entranceIntro.map, intro);
  }
  if (materials.introWallPlaque.map && materials.introWallPlaque.map instanceof THREE.CanvasTexture) {
    updateEntrancePlaqueTexture(materials.introWallPlaque.map, intro);
  }
}

