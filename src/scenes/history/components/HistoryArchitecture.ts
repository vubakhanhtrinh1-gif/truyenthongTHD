import * as THREE from 'three';
import { historyRoomConfig } from '../config/historyRoomConfig';
import { HistoryMaterialSet } from '../materials/HistoryMaterials';
import {
  createFoundation1966MedallionTexture,
  createEnd1975PlaqueTexture,
  createZoneHeaderTexture,
  createParchmentDocumentTexture,
  createEvacuationMapPlaceholderTexture,
  createMartyrsMemorialTexture,
  createSide1FoundationTexture,
  createSide2Birth1966Texture,
  createSide3WartimeTeachingTexture,
  createSide4FiveRelocationsTexture,
  createFoundingIntroBoardTexture,
  createMentorPortraitTexture,
} from '../textures/HistoryProceduralTextures';

export interface InteractiveExhibitItem {
  id: string;
  zoneId: string;
  type:
    | 'monument_1966'
    | 'document'
    | 'wartime_map'
    | 'person'
    | 'artifact'
    | 'generation'
    | 'monument_1975'
    | 'exit_gateway'
    | 'martyrs_monument'
    | 'side_1_foundation'
    | 'side_2_birth'
    | 'side_3_wartime'
    | 'side_4_relocations';
  mesh: THREE.Object3D;
  position: [number, number, number];
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  fieldTag: string;
}

export interface HistorySceneElements {
  masterGroup: THREE.Group;
  monument1966Ring: THREE.Mesh;
  blackHoleRing2?: THREE.Mesh;
  blackHoleRing3?: THREE.Mesh;
  blackHoleAccretionMesh?: THREE.Mesh;
  orbitParticles: THREE.Points;
  interactiveExhibits: InteractiveExhibitItem[];
  interactiveMeshes: THREE.Object3D[];
  zoneSpotlights: THREE.SpotLight[];
  mentor1Mesh?: THREE.Mesh;
  mentor2Mesh?: THREE.Mesh;
}

export function buildHistoryRoomArchitecture(
  materials: HistoryMaterialSet
): HistorySceneElements {
  const masterGroup = new THREE.Group();
  const interactiveExhibits: InteractiveExhibitItem[] = [];
  const interactiveMeshes: THREE.Object3D[] = [];
  const zoneSpotlights: THREE.SpotLight[] = [];
  let mentor1Mesh: THREE.Mesh | undefined;
  let mentor2Mesh: THREE.Mesh | undefined;

  const { width, length, height } = historyRoomConfig.dimensions;

  // ==========================================
  // 1. FLOOR & CEILING
  // ==========================================
  // Main Wood Floor
  const floorGeo = new THREE.PlaneGeometry(width, length);
  const floorMesh = new THREE.Mesh(floorGeo, materials.woodFloor);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0, 0);
  floorMesh.receiveShadow = true;
  masterGroup.add(floorMesh);

  // Central Gold Guide Inlay Strips along axis
  const stripGeo = new THREE.BoxGeometry(0.04, 0.015, length - 2);
  const leftStrip = new THREE.Mesh(stripGeo, materials.luminousGold);
  leftStrip.position.set(-1.8, 0.01, 0);
  masterGroup.add(leftStrip);

  const rightStrip = new THREE.Mesh(stripGeo, materials.luminousGold);
  rightStrip.position.set(1.8, 0.01, 0);
  masterGroup.add(rightStrip);

  // Vaulted Segmented Ceiling
  const ceilingGeo = new THREE.PlaneGeometry(width, length);
  const ceilingMesh = new THREE.Mesh(ceilingGeo, materials.ceiling);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(0, height, 0);
  masterGroup.add(ceilingMesh);

  // Ceiling transverse brass arch ribs
  [-12, -7, -2, 3, 8, 13].forEach((zVal) => {
    const archRib = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.12, 0.35),
      materials.walnut
    );
    archRib.position.set(0, height - 0.06, zVal);
    masterGroup.add(archRib);

    const archTrim = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.03, 0.38),
      materials.brass
    );
    archTrim.position.set(0, height - 0.13, zVal);
    masterGroup.add(archTrim);
  });

  // ==========================================
  // 2. PERIMETER WALLS
  // ==========================================
  // Left Wall (X = -width / 2)
  const leftWall = new THREE.Mesh(
    new THREE.PlaneGeometry(length, height),
    materials.wall
  );
  leftWall.position.set(-width / 2, height / 2, 0);
  leftWall.rotation.y = Math.PI / 2;
  masterGroup.add(leftWall);

  // Right Wall (X = width / 2)
  const rightWall = new THREE.Mesh(
    new THREE.PlaneGeometry(length, height),
    materials.wall
  );
  rightWall.position.set(width / 2, height / 2, 0);
  rightWall.rotation.y = -Math.PI / 2;
  masterGroup.add(rightWall);

  // Back Wall (Entrance side, Z = length / 2 = +15m)
  const frontWall = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    materials.wall
  );
  frontWall.position.set(0, height / 2, length / 2);
  frontWall.rotation.y = Math.PI;
  masterGroup.add(frontWall);

  // Front Wall (Exit side, Z = -length / 2 = -15m)
  const rearWall = new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    materials.wall
  );
  rearWall.position.set(0, height / 2, -length / 2);
  masterGroup.add(rearWall);

  // Museum Gallery Perimeter Gilded Skirting & Picture Rail Moldings
  // 1. Skirting Baseboard (Y = 0.12m, H = 0.24m)
  const skirtingMat = materials.walnut;
  const brassTrimMat = materials.brass;

  // Left & Right Skirting
  [-width / 2 + 0.05, width / 2 - 0.05].forEach((xVal) => {
    const skirtLong = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, length), skirtingMat);
    skirtLong.position.set(xVal, 0.12, 0);
    masterGroup.add(skirtLong);

    const goldRibbonLong = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, length), brassTrimMat);
    goldRibbonLong.position.set(xVal, 0.24, 0);
    masterGroup.add(goldRibbonLong);

    // Picture Rail at 4.2m
    const railLong = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, length), brassTrimMat);
    railLong.position.set(xVal, 4.2, 0);
    masterGroup.add(railLong);
  });

  // Front & Rear Skirting
  [-length / 2 + 0.05, length / 2 - 0.05].forEach((zVal) => {
    const skirtWide = new THREE.Mesh(new THREE.BoxGeometry(width, 0.24, 0.1), skirtingMat);
    skirtWide.position.set(0, 0.12, zVal);
    masterGroup.add(skirtWide);

    const goldRibbonWide = new THREE.Mesh(new THREE.BoxGeometry(width, 0.03, 0.12), brassTrimMat);
    goldRibbonWide.position.set(0, 0.24, zVal);
    masterGroup.add(goldRibbonWide);

    // Picture Rail at 4.2m
    const railWide = new THREE.Mesh(new THREE.BoxGeometry(width, 0.06, 0.08), brassTrimMat);
    railWide.position.set(0, 4.2, zVal);
    masterGroup.add(railWide);
  });

  // ==========================================
  // 3. ZONE 1: ENTRY PORTAL (Z = +13m)
  // ==========================================
  const entryPlaqueTex = createZoneHeaderTexture(
    'LỊCH SỬ HÌNH THÀNH (1966–1975)',
    'HALL OF FOUNDING HISTORY',
    'PHẦN 1'
  );
  const entryPlaqueGeo = new THREE.PlaneGeometry(4.2, 1.05);
  const entryPlaqueMat = new THREE.MeshStandardMaterial({
    map: entryPlaqueTex,
    roughness: 0.3,
    metalness: 0.3,
  });
  const entryPlaque = new THREE.Mesh(entryPlaqueGeo, entryPlaqueMat);
  entryPlaque.position.set(0, 3.8, 14.85);
  entryPlaque.rotation.y = Math.PI;
  masterGroup.add(entryPlaque);

  // ==========================================
  // SIDE 1 (SOUTH WALL / PHÍA NAM): 1.1 THÔNG TIN THÀNH LẬP
  // ==========================================
  const side1Tex = createSide1FoundationTexture();
  const side1BoardGeo = new THREE.PlaneGeometry(3.6, 2.4);
  const side1BoardMat = new THREE.MeshStandardMaterial({
    map: side1Tex,
    roughness: 0.35,
    metalness: 0.15,
  });
  const side1Mesh = new THREE.Mesh(side1BoardGeo, side1BoardMat);
  side1Mesh.position.set(0, 2.0, 14.78);
  side1Mesh.rotation.y = Math.PI;
  masterGroup.add(side1Mesh);
  interactiveMeshes.push(side1Mesh);

  const side1Frame = new THREE.Mesh(
    new THREE.BoxGeometry(3.76, 2.56, 0.08),
    materials.walnut
  );
  side1Frame.position.set(0, 2.0, 14.84);
  masterGroup.add(side1Frame);

  interactiveExhibits.push({
    id: 'side_1_foundation',
    zoneId: 'side_1_south',
    type: 'side_1_foundation',
    mesh: side1Mesh,
    position: [0, 2.0, 14.78],
    titleVi: 'BÊN 1 (PHÍA NAM) • 1.1 THÔNG TIN THÀNH LẬP',
    titleEn: 'SIDE 1 (SOUTH) • 1.1 FOUNDING INFORMATION',
    subtitleVi: 'Thời điểm thành lập, Khai giảng, Nơi thành lập, Quy mô, BGH & Tên trường',
    subtitleEn: 'Founding Milestone, Opening, Cohort Size & Leadership',
    fieldTag: '{{DB: history | 1.1_foundation_table | table | high}}',
  });

  const spotSide1 = new THREE.SpotLight(0xffecd0, 2.8);
  spotSide1.position.set(0, 4.4, 12.0);
  spotSide1.target = side1Mesh;
  spotSide1.angle = 0.6;
  spotSide1.distance = 6;
  masterGroup.add(spotSide1);
  zoneSpotlights.push(spotSide1);

  // ==========================================
  // 4. ZONE 2: 1966 MONUMENT - GLOSSY OBSIDIAN BLACK HOLE SPHERE & GOLDEN ACCRETION BANDS
  // (Quả cầu đen bóng không hoa tiết, có các dải vàng rực rỡ xung quanh như hố đen vũ trụ)
  // ==========================================
  const monument1966Group = new THREE.Group();
  monument1966Group.position.set(0, 0, 8.5);

  // Stepped Circular Pedestal
  const monBase1 = new THREE.Mesh(
    new THREE.CylinderGeometry(2.4, 2.6, 0.22, 48),
    materials.pedestalStone
  );
  monBase1.position.set(0, 0.11, 0);
  monBase1.receiveShadow = true;
  monument1966Group.add(monBase1);

  const monBase2 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.9, 2.05, 0.2, 48),
    materials.walnut
  );
  monBase2.position.set(0, 0.31, 0);
  monBase2.receiveShadow = true;
  monument1966Group.add(monBase2);

  // Brass rim nosing
  const monBrassRim = new THREE.Mesh(
    new THREE.TorusGeometry(2.06, 0.035, 16, 48),
    materials.brass
  );
  monBrassRim.rotation.x = Math.PI / 2;
  monBrassRim.position.set(0, 0.41, 0);
  monument1966Group.add(monBrassRim);

  // PURE GLOSSY OBSIDIAN BLACK SPHERE (HỐ ĐEN - KHÔNG HOA TIẾT, BÓNG GƯƠNG SÂU THẲM)
  const sphereGeo = new THREE.SphereGeometry(1.18, 64, 64);
  const blackHoleSphere = new THREE.Mesh(sphereGeo, materials.obsidianSphere);
  blackHoleSphere.position.set(0, 1.62, 0);
  blackHoleSphere.castShadow = true;
  blackHoleSphere.receiveShadow = true;
  monument1966Group.add(blackHoleSphere);
  interactiveMeshes.push(blackHoleSphere);

  // Inner Gravitational Photon Ring (Vòng viền sáng vàng rực sát hố đen)
  const photonRingGeo = new THREE.TorusGeometry(1.28, 0.022, 32, 100);
  const photonRingMat = materials.luminousGold.clone();
  photonRingMat.emissiveIntensity = 2.4;
  const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
  photonRing.position.set(0, 1.62, 0);
  photonRing.rotation.x = Math.PI / 2.3;
  monument1966Group.add(photonRing);

  // PRIMARY GOLDEN ACCRETION DISK (Dải vàng chính xoay quanh hố đen)
  const ringTorusGeo = new THREE.TorusGeometry(1.85, 0.052, 32, 100);
  const monument1966Ring = new THREE.Mesh(ringTorusGeo, materials.luminousGold);
  monument1966Ring.position.set(0, 1.62, 0);
  monument1966Ring.rotation.x = Math.PI / 2.25;
  monument1966Group.add(monument1966Ring);

  // SECONDARY GOLDEN ORBITAL BAND (Dải vàng nghiêng thứ hai)
  const ring2Geo = new THREE.TorusGeometry(2.25, 0.032, 24, 100);
  const blackHoleRing2 = new THREE.Mesh(ring2Geo, materials.brass);
  blackHoleRing2.position.set(0, 1.62, 0);
  blackHoleRing2.rotation.x = Math.PI / 1.7;
  blackHoleRing2.rotation.y = 0.42;
  monument1966Group.add(blackHoleRing2);

  // TERTIARY THIN GOLDEN CELESTIAL STREAM (Dải ánh sáng mảnh bay bổng ngoài cùng)
  const ring3Geo = new THREE.TorusGeometry(2.65, 0.018, 20, 100);
  const blackHoleRing3 = new THREE.Mesh(ring3Geo, materials.luminousGold);
  blackHoleRing3.position.set(0, 1.62, 0);
  blackHoleRing3.rotation.x = Math.PI / 2.8;
  blackHoleRing3.rotation.z = -0.38;
  monument1966Group.add(blackHoleRing3);

  // Glowing Accretion Energy Halo Disc (Đĩa phát sáng mờ ảo quanh xích đạo hố đen)
  const accretionDiscGeo = new THREE.RingGeometry(1.22, 2.7, 64);
  const accretionDiscMat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const blackHoleAccretionMesh = new THREE.Mesh(accretionDiscGeo, accretionDiscMat);
  blackHoleAccretionMesh.position.set(0, 1.62, 0);
  blackHoleAccretionMesh.rotation.x = Math.PI / 2.25;
  monument1966Group.add(blackHoleAccretionMesh);

  // Warm Core Glow Light inside the Black Hole Accretion
  const blackHoleCoreLight = new THREE.PointLight(0xffdf88, 2.2, 6, 2);
  blackHoleCoreLight.position.set(0, 1.62, 0);
  monument1966Group.add(blackHoleCoreLight);

  // Dedicated Dramatic Exhibition Spotlight for the Black Hole Sphere
  const spot1966 = new THREE.SpotLight(0xffecd0, 3.8);
  spot1966.position.set(0, 5.2, 9.8);
  spot1966.target = blackHoleSphere;
  spot1966.angle = 0.55;
  spot1966.penumbra = 0.5;
  spot1966.distance = 9;
  spot1966.castShadow = true;
  monument1966Group.add(spot1966);
  zoneSpotlights.push(spot1966);

  masterGroup.add(monument1966Group);

  interactiveExhibits.push({
    id: 'foundation_1966_monument',
    zoneId: 'foundation_1966',
    type: 'monument_1966',
    mesh: blackHoleSphere,
    position: [0, 1.62, 8.5],
    titleVi: 'KHỞI NGUỒN 1966 • TRƯỜNG THPT A TRẦN HƯNG ĐẠO',
    titleEn: 'THE FOUNDATION YEAR 1966',
    subtitleVi: 'Khối cầu hố đen huyền thoại và dải quỹ đạo hoàng kim khởi nguồn',
    subtitleEn: 'Obsidian Black Hole Sphere & Golden Orbital Heritage Bands',
    fieldTag: '{{DB: history | year_foundation | number | high}}',
  });

  // ==========================================
  // 5. ZONE 3: CONTEXT 1966 (Left Wall, Z = +4.5m, X = -5.8m)
  // ==========================================
  const contextPlaqueTex = createZoneHeaderTexture(
    'KHU 1.2 • BỐI CẢNH RA ĐỜI (1966)',
    'HISTORICAL CONTEXT',
    'TƯ LIỆU GỐC'
  );
  const contextPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 0.8),
    new THREE.MeshStandardMaterial({ map: contextPlaqueTex, roughness: 0.3 })
  );
  contextPlaque.position.set(-5.88, 3.4, 4.5);
  contextPlaque.rotation.y = Math.PI / 2;
  masterGroup.add(contextPlaque);

  // Framed Parchment Document Display (Decisions / Charters)
  const docTex = createParchmentDocumentTexture(
    'MỐC THÀNH LẬP TRƯỜNG',
    'Tư liệu lưu trữ lịch sử tỉnh Nam Hà (1966)',
    '{{DB: history | foundation_document | pdf/image | high}}'
  );
  const docFrameGeo = new THREE.BoxGeometry(0.12, 2.2, 1.6);
  const docFrame = new THREE.Mesh(docFrameGeo, materials.walnut);
  docFrame.position.set(-5.85, 1.9, 4.5);
  masterGroup.add(docFrame);

  const docPaperGeo = new THREE.PlaneGeometry(1.45, 2.05);
  const docPaperMat = new THREE.MeshStandardMaterial({
    map: docTex,
    roughness: 0.6,
  });
  const docPaper = new THREE.Mesh(docPaperGeo, docPaperMat);
  docPaper.position.set(-5.78, 1.9, 4.5);
  docPaper.rotation.y = Math.PI / 2;
  masterGroup.add(docPaper);
  interactiveMeshes.push(docPaper);

  interactiveExhibits.push({
    id: 'context_document_charter',
    zoneId: 'context_1966',
    type: 'document',
    mesh: docPaper,
    position: [-5.78, 1.9, 4.5],
    titleVi: 'TƯ LIỆU KHỞI NGUỒN 1966',
    titleEn: 'FOUNDING DOCUMENTS & HISTORICAL CONTEXT',
    subtitleVi: 'Tư liệu đối chiếu văn thư lưu trữ của tỉnh (1966)',
    subtitleEn: 'Archival Reference Documents (1966)',
    fieldTag: '{{DB: history | context_document_01 | pdf/image | high}}',
  });

  // Spotlight for Context Document
  const spotContext = new THREE.SpotLight(0xfff0d8, 2.2);
  spotContext.position.set(-3.2, 4.2, 4.5);
  spotContext.target = docPaper;
  spotContext.angle = 0.5;
  spotContext.distance = 6;
  masterGroup.add(spotContext);
  zoneSpotlights.push(spotContext);

  // ==========================================
  // SIDE 2 (WEST WALL / PHÍA TÂY): 1.2 TRƯỜNG RA ĐỜI NĂM 1966
  // ==========================================
  const side2Tex = createSide2Birth1966Texture();
  const side2BoardGeo = new THREE.PlaneGeometry(3.6, 2.4);
  const side2BoardMat = new THREE.MeshStandardMaterial({
    map: side2Tex,
    roughness: 0.35,
    metalness: 0.15,
  });
  const side2Mesh = new THREE.Mesh(side2BoardGeo, side2BoardMat);
  side2Mesh.position.set(-5.82, 2.0, 1.2);
  side2Mesh.rotation.y = Math.PI / 2;
  masterGroup.add(side2Mesh);
  interactiveMeshes.push(side2Mesh);

  const side2Frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 2.56, 3.76),
    materials.walnut
  );
  side2Frame.position.set(-5.86, 2.0, 1.2);
  masterGroup.add(side2Frame);

  interactiveExhibits.push({
    id: 'side_2_birth',
    zoneId: 'side_2_west',
    type: 'side_2_birth',
    mesh: side2Mesh,
    position: [-5.82, 2.0, 1.2],
    titleVi: 'BÊN 2 (PHÍA TÂY) • 1.2 TRƯỜNG RA ĐỜI NĂM 1966',
    titleEn: 'SIDE 2 (WEST) • 1.2 FOUNDATION YEAR 1966',
    subtitleVi: 'Bối cảnh kháng chiến, Mở trường giữa bom đạn & Triết lý học tập không gián đoạn',
    subtitleEn: 'Founding context, wartime education & non-disrupted learning ethos',
    fieldTag: '{{DB: history | 1.2_birth_1966 | narrative | high}}',
  });

  const spotSide2 = new THREE.SpotLight(0xffecd0, 2.8);
  spotSide2.position.set(-3.2, 4.4, 1.2);
  spotSide2.target = side2Mesh;
  spotSide2.angle = 0.6;
  spotSide2.distance = 6;
  masterGroup.add(spotSide2);
  zoneSpotlights.push(spotSide2);

  // ==========================================
  // SIDE 3 (EAST WALL / PHÍA ĐÔNG): 1.3 DẠY VÀ HỌC TRONG CHIẾN TRANH
  // ==========================================
  const side3Tex = createSide3WartimeTeachingTexture();
  const side3BoardGeo = new THREE.PlaneGeometry(3.6, 2.4);
  const side3BoardMat = new THREE.MeshStandardMaterial({
    map: side3Tex,
    roughness: 0.35,
    metalness: 0.15,
  });
  const side3Mesh = new THREE.Mesh(side3BoardGeo, side3BoardMat);
  side3Mesh.position.set(5.82, 2.0, 1.2);
  side3Mesh.rotation.y = -Math.PI / 2;
  masterGroup.add(side3Mesh);
  interactiveMeshes.push(side3Mesh);

  const side3Frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 2.56, 3.76),
    materials.walnut
  );
  side3Frame.position.set(5.86, 2.0, 1.2);
  masterGroup.add(side3Frame);

  interactiveExhibits.push({
    id: 'side_3_wartime',
    zoneId: 'side_3_east',
    type: 'side_3_wartime',
    mesh: side3Mesh,
    position: [5.82, 2.0, 1.2],
    titleVi: 'BÊN 3 (PHÍA ĐÔNG) • 1.3 DẠY VÀ HỌC TRONG CHIẾN TRANH',
    titleEn: 'SIDE 3 (EAST) • 1.3 TEACHING & STUDYING IN WARTIME',
    subtitleVi: 'Ba khu học Lang Xá, Lớp học hầm hào, xe đạp xe bò & nhân dân đùm bọc',
    subtitleEn: '3 study zones, trenches, bomb alarms & community support',
    fieldTag: '{{DB: history | 1.3_wartime_teaching | chronicle | high}}',
  });

  const spotSide3 = new THREE.SpotLight(0xffecd0, 2.8);
  spotSide3.position.set(3.2, 4.4, 1.2);
  spotSide3.target = side3Mesh;
  spotSide3.angle = 0.6;
  spotSide3.distance = 6;
  masterGroup.add(spotSide3);
  zoneSpotlights.push(spotSide3);

  // ==========================================
  // 6. ZONE 4: WARTIME MEMORY & EVACUATION MAP (Right Wall, Z = 0, X = +5.8m)
  // ==========================================
  const warPlaqueTex = createZoneHeaderTexture(
    'KHU 1.3 • NHỮNG NĂM THÁNG THỜI CHIẾN',
    'WARTIME MEMORY & EVACUATION',
    '1966 - 1972'
  );
  const warPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 0.8),
    new THREE.MeshStandardMaterial({ map: warPlaqueTex, roughness: 0.3 })
  );
  warPlaque.position.set(5.88, 3.4, 0);
  warPlaque.rotation.y = -Math.PI / 2;
  masterGroup.add(warPlaque);

  // Evacuation Map Display Console
  const mapTex = createEvacuationMapPlaceholderTexture();
  const mapStand = new THREE.Mesh(
    new THREE.BoxGeometry(0.8, 1.05, 2.4),
    materials.walnut
  );
  mapStand.position.set(4.8, 0.525, 0);
  masterGroup.add(mapStand);

  const mapBoardGeo = new THREE.BoxGeometry(0.06, 1.6, 2.5);
  const mapBoardMat = new THREE.MeshStandardMaterial({
    map: mapTex,
    roughness: 0.35,
    metalness: 0.2,
  });
  const mapBoard = new THREE.Mesh(mapBoardGeo, mapBoardMat);
  mapBoard.position.set(4.75, 1.45, 0);
  mapBoard.rotation.z = Math.PI / 10;
  masterGroup.add(mapBoard);
  interactiveMeshes.push(mapBoard);

  interactiveExhibits.push({
    id: 'wartime_evacuation_map',
    zoneId: 'wartime',
    type: 'wartime_map',
    mesh: mapBoard,
    position: [4.75, 1.45, 0],
    titleVi: 'SƠ ĐỒ ĐỊA BÀN SƠ TÁN THỜI CHIẾN',
    titleEn: 'WARTIME EVACUATION & TRENCH CLASSROOM MAP',
    subtitleVi: 'Các cứ điểm học tập phân tán thời kỳ bom đạn (1966–1972)',
    subtitleEn: 'Dispersed Study Coordinates during Bombardments',
    fieldTag: '{{DB: history | evacuation_map | image/png 3000x2000 | high}}',
  });

  const spotMap = new THREE.SpotLight(0xfff0d8, 2.4);
  spotMap.position.set(3.0, 4.2, 0);
  spotMap.target = mapBoard;
  spotMap.angle = 0.55;
  spotMap.distance = 6;
  masterGroup.add(spotMap);
  zoneSpotlights.push(spotMap);

  // ==========================================
  // 6B. ZONE 1.5: MARTYRS & MILITARY ENLISTMENT MEMORIAL STELE (Right Wall, Z = -4.5m, X = +5.8m)
  // ==========================================
  const martyrsPlaqueTex = createZoneHeaderTexture(
    'KHU 1.5 • THẦY & TRÒ NHẬP NGŨ',
    'MARTYRS & HEROIC SACRIFICES',
    'TƯỞNG NIỆM & TRI ÂN'
  );
  const martyrsPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 0.8),
    new THREE.MeshStandardMaterial({ map: martyrsPlaqueTex, roughness: 0.3 })
  );
  martyrsPlaque.position.set(5.88, 3.4, -4.5);
  martyrsPlaque.rotation.y = -Math.PI / 2;
  masterGroup.add(martyrsPlaque);

  // Lacquer Stele Base & Frame
  const steleFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 2.2, 2.8),
    materials.walnut
  );
  steleFrame.position.set(5.85, 1.85, -4.5);
  masterGroup.add(steleFrame);

  const steleTrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 2.26, 2.86),
    materials.brass
  );
  steleTrim.position.set(5.86, 1.85, -4.5);
  masterGroup.add(steleTrim);

  // High-res Martyrs Texture Mesh
  const martyrsTex = createMartyrsMemorialTexture();
  const steleMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.7, 2.1),
    new THREE.MeshStandardMaterial({
      map: martyrsTex,
      roughness: 0.25,
      metalness: 0.2,
    })
  );
  steleMesh.position.set(5.77, 1.85, -4.5);
  steleMesh.rotation.y = -Math.PI / 2;
  masterGroup.add(steleMesh);
  interactiveMeshes.push(steleMesh);

  interactiveExhibits.push({
    id: 'martyrs_memorial_stele',
    zoneId: 'martyrs',
    type: 'martyrs_monument',
    mesh: steleMesh,
    position: [5.77, 1.85, -4.5],
    titleVi: '1.5 THẦY VÀ TRÒ LÊN ĐƯỜNG NHẬP NGŨ',
    titleEn: 'TEACHERS & STUDENTS ENLISTMENT AND MARTYRS',
    subtitleVi: 'Bia Tưởng niệm các Anh hùng Liệt sĩ nhà trường đã hy sinh vì Tổ quốc [cần xác nhận]',
    subtitleEn: 'Memorial stele honoring martyrs of the school during wartime',
    fieldTag: '{{DB: history | martyrs_list | json/xlsx | high}}',
  });

  // Solemn spotlight on martyrs stele
  const spotMartyrs = new THREE.SpotLight(0xffddb8, 2.6);
  spotMartyrs.position.set(3.2, 4.2, -4.5);
  spotMartyrs.target = steleMesh;
  spotMartyrs.angle = 0.55;
  spotMartyrs.distance = 6;
  masterGroup.add(spotMartyrs);
  zoneSpotlights.push(spotMartyrs);

  // ==========================================
  // 7. ZONE 5: FOUNDING PEOPLE (Left Wall, Z = -4.5m, X = -5.8m)
  // 1 Bảng Giới Thiệu + 2 Chân Dung Vị Thầy Tiền Bối (Hiệu trưởng & Phó Hiệu trưởng đầu tiên)
  // ==========================================
  const peoplePlaqueTex = createZoneHeaderTexture(
    'KHU 1.4 • NGƯỜI ĐẶT NỀN MÓNG',
    'FOUNDING PIONEERS (1966–1975)',
    'TRI ÂN TIỀN BỐI'
  );
  const peoplePlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(3.8, 0.8),
    new THREE.MeshStandardMaterial({ map: peoplePlaqueTex, roughness: 0.3 })
  );
  peoplePlaque.position.set(-5.88, 3.4, -4.5);
  peoplePlaque.rotation.y = Math.PI / 2;
  masterGroup.add(peoplePlaque);

  // 1. Introduction Board: "BẢNG GIỚI THIỆU: NHỮNG NGƯỜI ĐẶT NỀN MÓNG (1966–1975)"
  // Placed at Z = -3.15m (first station encountered when walking from entrance)
  const introFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 1.55, 1.25),
    materials.walnut
  );
  introFrame.position.set(-5.85, 1.85, -3.15);
  masterGroup.add(introFrame);

  const introBrassTrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 1.6, 1.3),
    materials.brass
  );
  introBrassTrim.position.set(-5.86, 1.85, -3.15);
  masterGroup.add(introBrassTrim);

  const introBoardTex = createFoundingIntroBoardTexture();
  const introBoardMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.15, 1.45),
    new THREE.MeshStandardMaterial({ map: introBoardTex, roughness: 0.35 })
  );
  introBoardMesh.position.set(-5.78, 1.85, -3.15);
  introBoardMesh.rotation.y = Math.PI / 2;
  masterGroup.add(introBoardMesh);
  interactiveMeshes.push(introBoardMesh);

  interactiveExhibits.push({
    id: 'founding_intro_board',
    zoneId: 'founding_people',
    type: 'person',
    mesh: introBoardMesh,
    position: [-5.78, 1.85, -3.15],
    titleVi: 'LỜI GIỚI THIỆU • BAN GIÁM HIỆU SÁNG LẬP (1966)',
    titleEn: 'FOUNDING LEADERSHIP INTRODUCTION (1966)',
    subtitleVi: 'Khởi dựng mái trường mùa thu 1966 tại sân đình Lang Xá',
    subtitleEn: 'School founding era in Autumn 1966 at Lang Xa temple',
    fieldTag: '{{DB: history | foundation_people | text | high}}',
  });

  // 2. Mentor 1: Thầy Phạm Quốc Dũng — Hiệu trưởng đầu tiên (từ 6/1966)
  // Placed at Z = -4.5m
  const mentor1Frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 1.5, 1.1),
    materials.walnut
  );
  mentor1Frame.position.set(-5.85, 1.85, -4.5);
  masterGroup.add(mentor1Frame);

  const mentor1BrassTrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.55, 1.15),
    materials.brass
  );
  mentor1BrassTrim.position.set(-5.86, 1.85, -4.5);
  masterGroup.add(mentor1BrassTrim);

  const mentor1Tex = createMentorPortraitTexture(
    'Hiệu trưởng đầu tiên (từ 6/1966)',
    'Thầy Phạm Quốc Dũng',
    'Lãnh đạo nhà trường từ những ngày đầu bom đạn tại sân đình Lang Xá; xây dựng nền móng kỷ cương.',
    '01'
  );
  mentor1Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.98, 1.38),
    new THREE.MeshStandardMaterial({ map: mentor1Tex, roughness: 0.38 })
  );
  mentor1Mesh.position.set(-5.78, 1.85, -4.5);
  mentor1Mesh.rotation.y = Math.PI / 2;
  masterGroup.add(mentor1Mesh);
  interactiveMeshes.push(mentor1Mesh);

  interactiveExhibits.push({
    id: 'founding_mentor_01',
    zoneId: 'founding_people',
    type: 'person',
    mesh: mentor1Mesh,
    position: [-5.78, 1.85, -4.5],
    titleVi: 'THẦY PHẠM QUỐC DŨNG — HIỆU TRƯỞNG ĐẦU TIÊN',
    titleEn: 'MR. PHAM QUOC DUNG — FIRST PRINCIPAL',
    subtitleVi: 'Lãnh đạo khởi dựng nhà trường thời kỳ 1966–1975',
    subtitleEn: 'Founding principal during wartime era 1966–1975',
    fieldTag: '{{DB: history | foundation_people | principal | high}}',
  });

  // 3. Mentor 2: Thầy Đặng Công Thành — Phó Hiệu trưởng đầu tiên
  // Placed at Z = -5.85m
  const mentor2Frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 1.5, 1.1),
    materials.walnut
  );
  mentor2Frame.position.set(-5.85, 1.85, -5.85);
  masterGroup.add(mentor2Frame);

  const mentor2BrassTrim = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 1.55, 1.15),
    materials.brass
  );
  mentor2BrassTrim.position.set(-5.86, 1.85, -5.85);
  masterGroup.add(mentor2BrassTrim);

  const mentor2Tex = createMentorPortraitTexture(
    'Phó Hiệu trưởng đầu tiên',
    'Thầy Đặng Công Thành',
    'Cùng Hiệu trưởng gầy dựng 3 tổ chuyên môn và 5 lớp học đầu tiên; phụ trách chuyên môn bám trường bám lớp.',
    '02'
  );
  mentor2Mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(0.98, 1.38),
    new THREE.MeshStandardMaterial({ map: mentor2Tex, roughness: 0.38 })
  );
  mentor2Mesh.position.set(-5.78, 1.85, -5.85);
  mentor2Mesh.rotation.y = Math.PI / 2;
  masterGroup.add(mentor2Mesh);
  interactiveMeshes.push(mentor2Mesh);

  interactiveExhibits.push({
    id: 'founding_mentor_02',
    zoneId: 'founding_people',
    type: 'person',
    mesh: mentor2Mesh,
    position: [-5.78, 1.85, -5.85],
    titleVi: 'THẦY ĐẶNG CÔNG THÀNH — PHÓ HIỆU TRƯỞNG ĐẦU TIÊN',
    titleEn: 'MR. DANG CONG THANH — FIRST VICE PRINCIPAL',
    subtitleVi: 'Gầy dựng 3 tổ chuyên môn và phong trào dạy học đầu tiên',
    subtitleEn: 'Founding vice principal and academic pioneer',
    fieldTag: '{{DB: history | foundation_people | vicePrincipal | high}}',
  });

  // Dedicated Wall Spotlight focused on Founding Pioneers installation
  const spotFoundingPeople = new THREE.SpotLight(0xfff0d0, 2.8);
  spotFoundingPeople.position.set(-3.2, 4.2, -4.5);
  spotFoundingPeople.target = peoplePlaque;
  spotFoundingPeople.angle = 0.65;
  spotFoundingPeople.distance = 7;
  masterGroup.add(spotFoundingPeople);
  zoneSpotlights.push(spotFoundingPeople);

  // ==========================================
  // (Artifact vitrine pedestals at center floor removed as requested to clear walkway & vista)
  // ==========================================

  // ==========================================
  // 9. ZONE 7: EARLY GENERATIONS (Right Wall, Z = -10m, X = +5.8m)
  // ==========================================
  const genPlaqueTex = createZoneHeaderTexture(
    'KHU 1.6 • CÁC THẾ HỆ ĐẦU TIÊN',
    'EARLY GENERATIONS (1966–1975)',
    'DẤU ẤN HỌC TRÒ'
  );
  const genPlaque = new THREE.Mesh(
    new THREE.PlaneGeometry(3.4, 0.8),
    new THREE.MeshStandardMaterial({ map: genPlaqueTex, roughness: 0.3 })
  );
  genPlaque.position.set(5.88, 3.4, -10);
  genPlaque.rotation.y = -Math.PI / 2;
  masterGroup.add(genPlaque);

  // Panorama Class Photo Frame
  const classPhotoCanvas = document.createElement('canvas');
  classPhotoCanvas.width = 1024;
  classPhotoCanvas.height = 512;
  const cCtx = classPhotoCanvas.getContext('2d')!;
  cCtx.fillStyle = '#141a29';
  cCtx.fillRect(0, 0, 1024, 512);
  cCtx.strokeStyle = '#c7a15a';
  cCtx.lineWidth = 4;
  cCtx.strokeRect(16, 16, 992, 480);
  cCtx.fillStyle = '#ffd988';
  cCtx.textAlign = 'center';
  cCtx.font = 'bold 32px serif';
  cCtx.fillText('ẢNH KỶ YẾU CÁC KHÓA HỌC SINH ĐẦU TIÊN (1966–1975)', 512, 240);
  cCtx.fillStyle = '#a6b4cc';
  cCtx.font = '16px monospace';
  cCtx.fillText('{{DB: history | early_class_images | image/jpg_gallery | high}}', 512, 290);

  const classPhotoTex = new THREE.CanvasTexture(classPhotoCanvas);
  const classPhotoFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 1.8, 3.2),
    materials.walnut
  );
  classPhotoFrame.position.set(5.85, 1.8, -10);
  masterGroup.add(classPhotoFrame);

  const classPhoto = new THREE.Mesh(
    new THREE.PlaneGeometry(3.0, 1.6),
    new THREE.MeshStandardMaterial({ map: classPhotoTex, roughness: 0.4 })
  );
  classPhoto.position.set(5.78, 1.8, -10);
  classPhoto.rotation.y = -Math.PI / 2;
  masterGroup.add(classPhoto);
  interactiveMeshes.push(classPhoto);

  interactiveExhibits.push({
    id: 'early_generations_gallery',
    zoneId: 'early_generations',
    type: 'generation',
    mesh: classPhoto,
    position: [5.78, 1.8, -10],
    titleVi: 'HÌNH ẢNH KỶ NIỆM CÁC KHÓA HỌC SINH ĐẦU TIÊN',
    titleEn: 'FIRST COHORTS & CLASS PHOTOGRAPHS',
    subtitleVi: 'Dấu ấn thầy trò trong những năm tháng gian nan mà hào hùng',
    subtitleEn: 'Historic cohort memories (1966–1975)',
    fieldTag: '{{DB: history | early_class_images | image/jpg_gallery | high}}',
  });

  // ==========================================
  // 10. ZONE 8: 1975 CULMINATION MONUMENT (Z = -12.5m, X = 0)
  // ==========================================
  const end1975Group = new THREE.Group();
  end1975Group.position.set(0, 0, -12.5);

  const end1975Tex = createEnd1975PlaqueTexture();
  const end1975Geo = new THREE.PlaneGeometry(4.2, 2.1);
  const end1975Mat = new THREE.MeshStandardMaterial({
    map: end1975Tex,
    roughness: 0.28,
    metalness: 0.35,
  });
  const end1975Mesh = new THREE.Mesh(end1975Geo, end1975Mat);
  end1975Mesh.position.set(0, 2.1, 0);
  end1975Group.add(end1975Mesh);
  interactiveMeshes.push(end1975Mesh);

  // Brass framing around 1975 monument
  const endFrame = new THREE.Mesh(
    new THREE.BoxGeometry(4.35, 2.25, 0.15),
    materials.brass
  );
  endFrame.position.set(0, 2.1, -0.08);
  end1975Group.add(endFrame);

  // Spotlight on 1975 monument
  const spot1975 = new THREE.SpotLight(0xffecd0, 3.2);
  spot1975.position.set(0, 4.6, -10.5);
  spot1975.target = end1975Mesh;
  spot1975.angle = 0.6;
  spot1975.distance = 8;
  end1975Group.add(spot1975);
  zoneSpotlights.push(spot1975);

  masterGroup.add(end1975Group);

  interactiveExhibits.push({
    id: 'culmination_1975_monument',
    zoneId: 'end_1975',
    type: 'monument_1975',
    mesh: end1975Mesh,
    position: [0, 2.1, -12.5],
    titleVi: 'MỐC SON 1975 • HÒA BÌNH THỐNG NHẤT',
    titleEn: 'CULMINATION 1975 • NATIONAL REUNIFICATION',
    subtitleVi: 'Khép lại chặng đường 10 năm đầu tiên – Điểm tựa vững bền',
    subtitleEn: 'Closing of the Founding Decade (1966–1975)',
    fieldTag: '{{DB: history | period_end_year | number | high}}',
  });

  // ==========================================
  // SIDE 4 (NORTH WALL / PHÍA BẮC): 1.4 NĂM LẦN DI CHUYỂN
  // ==========================================
  const side4Tex = createSide4FiveRelocationsTexture();
  const side4BoardGeo = new THREE.PlaneGeometry(3.8, 2.5);
  const side4BoardMat = new THREE.MeshStandardMaterial({
    map: side4Tex,
    roughness: 0.35,
    metalness: 0.15,
  });
  const side4Mesh = new THREE.Mesh(side4BoardGeo, side4BoardMat);
  side4Mesh.position.set(-3.1, 2.2, -14.76);
  side4Mesh.rotation.y = 0;
  masterGroup.add(side4Mesh);
  interactiveMeshes.push(side4Mesh);

  const side4Frame = new THREE.Mesh(
    new THREE.BoxGeometry(3.96, 2.66, 0.08),
    materials.walnut
  );
  side4Frame.position.set(-3.1, 2.2, -14.82);
  masterGroup.add(side4Frame);

  interactiveExhibits.push({
    id: 'side_4_relocations',
    zoneId: 'side_4_north',
    type: 'side_4_relocations',
    mesh: side4Mesh,
    position: [-3.1, 2.2, -14.76],
    titleVi: 'BÊN 4 (PHÍA BẮC) • 1.4 NĂM LẦN DI CHUYỂN',
    titleEn: 'SIDE 4 (NORTH) • 1.4 FIVE HISTORIC RELOCATIONS',
    subtitleVi: '5 chặng di chuyển (1966–1974) và ổn định tại số 75/203 đường Trần Thái Tông',
    subtitleEn: 'Five relocations and settling in Tran Thai Tong street (Oct 1974)',
    fieldTag: '{{DB: history | 1.4_five_relocations | timeline | high}}',
  });

  const spotSide4 = new THREE.SpotLight(0xffecd0, 2.8);
  spotSide4.position.set(-3.1, 4.4, -12.2);
  spotSide4.target = side4Mesh;
  spotSide4.angle = 0.6;
  spotSide4.distance = 6;
  masterGroup.add(spotSide4);
  zoneSpotlights.push(spotSide4);

  // ==========================================
  // 11. ZONE 9: EXIT GATEWAY TO DEVELOPMENT (Z = -14.8m)
  // ==========================================
  const exitPortalGroup = new THREE.Group();
  exitPortalGroup.position.set(0, 0, -14.8);

  const exitArchGeo = new THREE.BoxGeometry(3.6, 4.2, 0.4);
  const exitArch = new THREE.Mesh(exitArchGeo, materials.walnut);
  exitArch.position.set(0, 2.1, 0);
  exitPortalGroup.add(exitArch);

  // Dark doorway opening into future room
  const exitDoorGeo = new THREE.PlaneGeometry(2.8, 3.8);
  const exitDoor = new THREE.Mesh(exitDoorGeo, materials.doorwayDepth);
  exitDoor.position.set(0, 1.9, 0.21);
  exitPortalGroup.add(exitDoor);
  interactiveMeshes.push(exitDoor);

  // Luminous outline ring on exit portal
  const exitRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.6, 0.04, 16, 64),
    materials.luminousGold
  );
  exitRing.position.set(0, 2.2, 0.25);
  exitPortalGroup.add(exitRing);

  masterGroup.add(exitPortalGroup);

  interactiveExhibits.push({
    id: 'exit_to_development',
    zoneId: 'exit_development',
    type: 'exit_gateway',
    mesh: exitDoor,
    position: [0, 2.1, -14.8],
    titleVi: 'TIẾN BƯỚC SANG PHẦN 2 • GIAI ĐOẠN PHÁT TRIỂN (1975 - NAY)',
    titleEn: 'PROCEED TO PART 2 • CAMPUS & DEVELOPMENT ERA',
    subtitleVi: 'Cổng kết nối tiếp theo trong hành trình di sản 60 năm',
    subtitleEn: 'Gateway to the next chapter of the 60-year chronicle',
    fieldTag: '[Destination ID: development]',
  });

  // ==========================================
  // 12. SPARSE COSMIC STAR PARTICLES
  // ==========================================
  const starCount = 350;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * (width - 1.2);
    starPos[i * 3 + 1] = Math.random() * (height - 1.2) + 0.8;
    starPos[i * 3 + 2] = (Math.random() - 0.5) * (length - 2);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));

  const starMat = new THREE.PointsMaterial({
    color: 0xffe8aa,
    size: 0.032,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
  });
  const orbitParticles = new THREE.Points(starGeo, starMat);
  masterGroup.add(orbitParticles);

  return {
    masterGroup,
    monument1966Ring,
    blackHoleRing2,
    blackHoleRing3,
    blackHoleAccretionMesh,
    orbitParticles,
    interactiveExhibits,
    interactiveMeshes,
    zoneSpotlights,
    mentor1Mesh,
    mentor2Mesh,
  };
}
