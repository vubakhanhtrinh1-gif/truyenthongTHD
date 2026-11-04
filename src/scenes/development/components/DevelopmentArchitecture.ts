/**
 * 3D Physical Architecture & Interactive Exhibition Generator for Zone 2: Development Room
 * Concept: MODERN HERITAGE — THE JOURNEY OF TRANSFORMATION (1974–2026)
 * Harmonized with Room 1 (History Room):
 * - Glossy Obsidian Black Hole Sphere with Golden Accretion Bands & Photon Ring
 * - Luxurious Honey Oak Parquet Floor with 24K Central Gold Inlay Guide Strips
 * - Coffered Ceiling with Walnut Transverse Arch Ribs & Brass Gold Molding
 * - Gilded Perimeter Skirting & Picture Rail Moldings
 * - Zero Panel/Column Intersections, Clean Unobstructed Bays, Layout Validated
 */

import * as THREE from 'three';
import { DevelopmentMaterialSet } from '../materials/DevelopmentMaterials';
import {
  createCentralTimelineEmblemTexture,
  createMilestonePlaqueTexture,
  createLeadershipPlaqueTexture,
  createComparativeScaleChartTexture,
  createOrganizationalPlaqueTexture,
  createDucThanhTranFrameTexture,
  createMedalCardTexture,
  createCentralPillarPaintingTexture,
  createHonorsAwardCardTexture,
  createEndWallPhotoTexture,
} from '../textures/DevelopmentProceduralTextures';
import {
  ZONE_2_DEVELOPMENT_CONTENT,
  Zone2DevelopmentData,
} from '../config/developmentContentData';
import {
  validateDevelopmentLayout,
  PanelPlacement,
  DEVELOPMENT_COLUMNS,
} from '../layout/developmentLayoutValidator';

export interface InteractiveDevelopmentExhibit {
  id: string;
  mesh: THREE.Object3D;
  titleVi: string;
  subtitleVi: string;
  year?: string | number;
  category: string;
  type:
    | 'master_timeline'
    | 'milestone'
    | 'leadership'
    | 'statistics'
    | 'digital_management'
    | 'organization'
    | 'values'
    | 'tran_hung_dao_statue'
    | 'duc_thanh_tran'
    | 'important_medals'
    | 'growth_overview'
    | 'central_pillar_painting'
    | 'honors_award'
    | 'end_wall_photo';
  dataPayload?: any;
}

export interface DevelopmentSceneElements {
  group: THREE.Group;
  interactiveExhibits: InteractiveDevelopmentExhibit[];
  monumentRing: THREE.Mesh;
  blackHoleRing2?: THREE.Mesh;
  blackHoleRing3?: THREE.Mesh;
  blackHoleAccretionMesh?: THREE.Mesh;
  orbitParticles?: THREE.Points;
  timelineRotator: THREE.Object3D | null;
  sculptural60Emblem: THREE.Object3D | null;
  ambientLights: THREE.Light[];
  spotlights: THREE.SpotLight[];
}

export function buildDevelopmentRoomArchitecture(
  materials: DevelopmentMaterialSet,
  content: Zone2DevelopmentData = ZONE_2_DEVELOPMENT_CONTENT
): DevelopmentSceneElements {
  const root = new THREE.Group();
  const interactiveExhibits: InteractiveDevelopmentExhibit[] = [];
  const spotlights: THREE.SpotLight[] = [];

  const ROOM_W = 16;
  const ROOM_L = 36;
  const ROOM_H = 5.6;
  const halfW = ROOM_W / 2;
  const halfL = ROOM_L / 2;

  // Track panel placements for automated layout validation
  const panelPlacements: PanelPlacement[] = [];

  // =========================================================================
  // 1. ARCHITECTURAL SHELL & FLOOR DECORATIONS (Harmonized with Room 1)
  // =========================================================================

  // 1.1 Luxurious Golden Parquet / Polished Honey Oak Floor (Y = 0)
  const floorGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_L);
  const floorMesh = new THREE.Mesh(floorGeo, materials.floor);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  root.add(floorMesh);

  // 1.2 Central 24K Gold Guide Inlay Strips along axis (identical to Room 1)
  const stripGeo = new THREE.BoxGeometry(0.04, 0.015, ROOM_L - 2);
  const leftStrip = new THREE.Mesh(stripGeo, materials.luminousGold);
  leftStrip.position.set(-1.8, 0.01, 0);
  root.add(leftStrip);

  const rightStrip = new THREE.Mesh(stripGeo, materials.luminousGold);
  rightStrip.position.set(1.8, 0.01, 0);
  root.add(rightStrip);

  // 1.3 Ceiling in Warm Champagne Bronze (Y = ROOM_H)
  const ceilGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_L);
  const ceilMesh = new THREE.Mesh(ceilGeo, materials.ceiling);
  ceilMesh.position.y = ROOM_H;
  ceilMesh.rotation.x = Math.PI / 2;
  root.add(ceilMesh);

  // 1.4 Transverse Walnut Arch Ribs & Brass Gold Trims across ceiling (eliminates monotony)
  [-13.5, -9.0, -4.5, 0.0, 4.5, 9.0, 13.5].forEach((zVal) => {
    const archRib = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_W, 0.12, 0.35),
      materials.trimWood
    );
    archRib.position.set(0, ROOM_H - 0.06, zVal);
    root.add(archRib);

    const archTrim = new THREE.Mesh(
      new THREE.BoxGeometry(ROOM_W, 0.03, 0.38),
      materials.brass
    );
    archTrim.position.set(0, ROOM_H - 0.13, zVal);
    root.add(archTrim);
  });

  // 1.5 Perimeter Walls (Champagne Bronze & Limestone Wall, identical to Room 1)
  // South Wall (Entrance / Exit Gateway, Z = +halfL)
  const southWallGroup = new THREE.Group();
  const southWallL = new THREE.Mesh(new THREE.PlaneGeometry(halfW - 2.2, ROOM_H), materials.wall);
  southWallL.position.set(-halfW / 2 - 1.1, ROOM_H / 2, halfL);
  southWallL.rotation.y = Math.PI;
  const southWallR = new THREE.Mesh(new THREE.PlaneGeometry(halfW - 2.2, ROOM_H), materials.wall);
  southWallR.position.set(halfW / 2 + 1.1, ROOM_H / 2, halfL);
  southWallR.rotation.y = Math.PI;
  const southWallTop = new THREE.Mesh(new THREE.PlaneGeometry(4.4, ROOM_H - 3.6), materials.wall);
  southWallTop.position.set(0, ROOM_H - (ROOM_H - 3.6) / 2, halfL);
  southWallTop.rotation.y = Math.PI;
  southWallGroup.add(southWallL, southWallR, southWallTop);
  root.add(southWallGroup);

  // North Wall (Far End, 60th Diamond Jubilee Monument, Z = -halfL)
  const northWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), materials.wall);
  northWallMesh.position.set(0, ROOM_H / 2, -halfL);
  northWallMesh.receiveShadow = true;
  root.add(northWallMesh);

  // West Wall (Group A: Era 1 & Group E: Statistics, X = -halfW)
  const westWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_L, ROOM_H), materials.wall);
  westWallMesh.position.set(-halfW, ROOM_H / 2, 0);
  westWallMesh.rotation.y = Math.PI / 2;
  westWallMesh.receiveShadow = true;
  root.add(westWallMesh);

  // East Wall (Group B: Era 2, Group D: Leadership, Group C & F: Digital & Org, X = +halfW)
  const eastWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_L, ROOM_H), materials.wall);
  eastWallMesh.position.set(halfW, ROOM_H / 2, 0);
  eastWallMesh.rotation.y = -Math.PI / 2;
  eastWallMesh.receiveShadow = true;
  root.add(eastWallMesh);

  // 1.55 Architectural Wainscoting Paneling along West and East Walls (Lower 1.05m, identical to Room 1)
  [-halfW + 0.04, halfW - 0.04].forEach((xVal) => {
    const wainscotGeo = new THREE.BoxGeometry(0.08, 1.05, ROOM_L);
    const wainscotMesh = new THREE.Mesh(wainscotGeo, materials.trimWood);
    wainscotMesh.position.set(xVal, 0.525, 0);
    root.add(wainscotMesh);

    // Wainscot Chair Rail Top Molding (Gold Brass Trim at 1.05m)
    const chairRailGeo = new THREE.BoxGeometry(0.12, 0.05, ROOM_L);
    const chairRailMesh = new THREE.Mesh(chairRailGeo, materials.brass);
    chairRailMesh.position.set(xVal, 1.05, 0);
    root.add(chairRailMesh);
  });

  // 1.56 Double Gold Floor Inlay Guide Lines (Embedded into Parquet Floor at X = -1.8 and +1.8)
  [-1.8, 1.8].forEach((xVal) => {
    const stripeGeo = new THREE.BoxGeometry(0.06, 0.015, ROOM_L - 2);
    const stripeMesh = new THREE.Mesh(stripeGeo, materials.brass);
    stripeMesh.position.set(xVal, 0.01, 0);
    root.add(stripeMesh);
  });

  // 1.57 Coffered Ceiling Walnut Beams across Room with 24K Gold Edging and Downlights
  [-15.75, -11.25, -6.75, -2.25, 2.25, 6.75, 11.25, 15.75].forEach((zVal) => {
    const beamGeo = new THREE.BoxGeometry(ROOM_W, 0.18, 0.38);
    const beamMesh = new THREE.Mesh(beamGeo, materials.trimWood);
    beamMesh.position.set(0, ROOM_H - 0.09, zVal);
    root.add(beamMesh);

    const beamGoldGeo = new THREE.BoxGeometry(ROOM_W, 0.03, 0.44);
    const beamGoldMesh = new THREE.Mesh(beamGoldGeo, materials.brass);
    beamGoldMesh.position.set(0, ROOM_H - 0.18, zVal);
    root.add(beamGoldMesh);

    // Warm museum downlight fixture along corridor
    const downlight = new THREE.PointLight(0xffeed6, 0.85, 10, 1.8);
    downlight.position.set(0, ROOM_H - 0.35, zVal);
    root.add(downlight);
  });

  // 1.6 Museum Gallery Perimeter Gilded Skirting & Picture Rail Moldings (like Room 1)
  // Left & Right Skirting & Rail
  [-halfW + 0.05, halfW - 0.05].forEach((xVal) => {
    const skirtLong = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, ROOM_L), materials.trimWood);
    skirtLong.position.set(xVal, 0.12, 0);
    root.add(skirtLong);

    const goldRibbonLong = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, ROOM_L), materials.brass);
    goldRibbonLong.position.set(xVal, 0.24, 0);
    root.add(goldRibbonLong);

    // Picture Rail at 4.2m
    const railLong = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, ROOM_L), materials.brass);
    railLong.position.set(xVal, 4.2, 0);
    root.add(railLong);
  });

  // Front & Rear Skirting & Rail
  [-halfL + 0.05, halfL - 0.05].forEach((zVal) => {
    const skirtWide = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W, 0.24, 0.1), materials.trimWood);
    skirtWide.position.set(0, 0.12, zVal);
    root.add(skirtWide);

    const goldRibbonWide = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W, 0.03, 0.12), materials.brass);
    goldRibbonWide.position.set(0, 0.24, zVal);
    root.add(goldRibbonWide);

    // Picture Rail at 4.2m
    const railWide = new THREE.Mesh(new THREE.BoxGeometry(ROOM_W, 0.06, 0.08), materials.brass);
    railWide.position.set(0, 4.2, zVal);
    root.add(railWide);
  });

  // 1.7 Structural Pilasters / Columns Grid (8 Bays of 4.5m along Z)
  DEVELOPMENT_COLUMNS.forEach((col, idx) => {
    const colGeo = new THREE.BoxGeometry(0.25, ROOM_H, col.widthZ);
    const colMesh = new THREE.Mesh(colGeo, materials.trimWood);
    const colX = col.wall === 'west' ? -halfW + 0.125 : halfW - 0.125;
    colMesh.position.set(colX, ROOM_H / 2, col.centerZ);
    root.add(colMesh);

    // 24K Gold accent plinths and capital collars
    const collarGeo = new THREE.BoxGeometry(0.27, 0.08, col.widthZ + 0.02);
    const collarBottom = new THREE.Mesh(collarGeo, materials.brass);
    collarBottom.position.set(colX, 0.1, col.centerZ);
    const collarTop = new THREE.Mesh(collarGeo, materials.brass);
    collarTop.position.set(colX, ROOM_H - 0.1, col.centerZ);
    root.add(collarBottom, collarTop);

    // Warm museum sconce light fixture on columns
    if (idx % 2 === 0) {
      const sconceX = col.wall === 'west' ? -halfW + 0.35 : halfW - 0.35;
      const sconceLight = new THREE.PointLight(0xffe6b8, 1.15, 8, 2);
      sconceLight.position.set(sconceX, 2.7, col.centerZ);
      root.add(sconceLight);

      const fixtureGeo = new THREE.CylinderGeometry(0.06, 0.09, 0.18, 16);
      const fixtureMesh = new THREE.Mesh(fixtureGeo, materials.brass);
      fixtureMesh.position.set(sconceX, 2.7, col.centerZ);
      root.add(fixtureMesh);
    }
  });

  // =========================================================================
  // 2. ENTRANCE GATEWAY & ORIENTATION (Z = +halfL - 0.5m)
  // =========================================================================
  const entryArch = new THREE.Group();
  entryArch.position.set(0, 0, halfL - 0.5);

  const archFrameL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.8, 0.35), materials.champagneGold);
  archFrameL.position.set(-2.2, 1.9, 0);
  const archFrameR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 3.8, 0.35), materials.champagneGold);
  archFrameR.position.set(2.2, 1.9, 0);
  const archFrameTop = new THREE.Mesh(new THREE.BoxGeometry(4.75, 0.4, 0.4), materials.champagneGold);
  archFrameTop.position.set(0, 3.8, 0);
  entryArch.add(archFrameL, archFrameR, archFrameTop);

  const doorBackdrop = new THREE.Mesh(new THREE.PlaneGeometry(4.0, 3.5), materials.doorwayDepth);
  doorBackdrop.position.set(0, 1.75, 0.18);
  doorBackdrop.rotation.y = Math.PI;
  entryArch.add(doorBackdrop);

  // Entrance Orientation Plaque on an elegant pedestal stand (X = 3.2, Z = 14.5)
  const entryPlaqueGroup = new THREE.Group();
  entryPlaqueGroup.position.set(3.2, 0, 14.5);
  entryPlaqueGroup.rotation.y = -Math.PI / 6; // Angled invitingly towards visitors approaching from south

  const entryStandBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.6), materials.pedestalStone);
  entryStandBase.position.y = 0.175;
  entryPlaqueGroup.add(entryStandBase);

  const entryStandPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 16), materials.brass);
  entryStandPole.position.y = 0.8;
  entryPlaqueGroup.add(entryStandPole);

  const entryFrameMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 0.06), materials.brass);
  entryFrameMesh.position.y = 1.65;
  entryPlaqueGroup.add(entryFrameMesh);

  const entryPlaqueTex = createMilestonePlaqueTexture(
    '1974 – 2026',
    'KHU 2: QUÁ TRÌNH PHÁT TRIỂN',
    'Hành trình hơn nửa thế kỷ từ trường sơ tán thời chiến đến trường chuẩn quốc gia hiện đại.',
    'GIỚI THIỆU PHÂN KHU'
  );
  const entryPlaqueMat = new THREE.MeshStandardMaterial({
    map: entryPlaqueTex,
    roughness: 0.28,
    metalness: 0.15,
  });
  const entryPlaqueMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.3), entryPlaqueMat);
  entryPlaqueMesh.position.set(0, 1.65, 0.035);
  entryPlaqueGroup.add(entryPlaqueMesh);
  root.add(entryPlaqueGroup);

  interactiveExhibits.push({
    id: 'development_entry_title',
    mesh: entryPlaqueMesh,
    titleVi: 'KHU 2: QUÁ TRÌNH PHÁT TRIỂN (1974–2026)',
    subtitleVi: 'Những bước chuyển mình qua hơn năm thập kỷ: từ trường tranh tre sơ tán đến trường chuẩn quốc gia.',
    category: 'orientation',
    type: 'milestone',
    dataPayload: {
      year: '1974–2026',
      period: 'Hơn 5 thập kỷ',
      sourceNote: 'Ban Giám hiệu Trường THPT A Trần Hưng Đạo',
      descriptionVi:
        'Chào mừng quý khách đến với Không gian Phân khu 2: Quá Trình Phát Triển (1974–2026). Nơi tái hiện trọn vẹn hành trình 52 năm vượt khó vươn lên, khẳng định thương hiệu giáo dục uy tín hàng đầu của tỉnh Nam Định.',
    },
  });

  root.add(entryArch);

  // =========================================================================
  // 3. CENTRAL MONUMENT COURT (Z = 2.5m & 8.5m)
  // 3A. GRAND MONUMENTAL COLUMN WITH 3 TRADITIONAL PAINTINGS (X = 0, Z = 2.5)
  //     (ƯU TIÊN SỐ 1: BỎ TƯỢNG ĐỨC THÁNH TRẦN, THAY BẰNG 1 CỘT TO GỒM 3 BỨC TRANH)
  // 3B. MASTER TIMELINE CELESTIAL DAIS (development_master_timeline, at X = 0, Z = 8.5)
  // =========================================================================

  const columnGroup = new THREE.Group();
  columnGroup.position.set(0, 0, 2.5);

  // 3.1 Stepped Monumental Pedestal Base
  const colBaseGeo1 = new THREE.CylinderGeometry(2.1, 2.3, 0.22, 32);
  const colBase1 = new THREE.Mesh(colBaseGeo1, materials.pedestalStone);
  colBase1.position.y = 0.11;
  colBase1.receiveShadow = true;
  columnGroup.add(colBase1);

  const colBaseGeo2 = new THREE.CylinderGeometry(1.85, 1.95, 0.18, 32);
  const colBase2 = new THREE.Mesh(colBaseGeo2, materials.trimWood);
  colBase2.position.y = 0.31;
  colBase2.receiveShadow = true;
  columnGroup.add(colBase2);

  const colBrassTorus = new THREE.Mesh(
    new THREE.TorusGeometry(1.88, 0.04, 16, 48),
    materials.brass
  );
  colBrassTorus.rotation.x = Math.PI / 2;
  colBrassTorus.position.y = 0.40;
  columnGroup.add(colBrassTorus);

  // 3.2 Grand Monumental Pillar Core (Fluted Honey-Onyx Marble with 24K Gold Moldings)
  const pillarGeo = new THREE.CylinderGeometry(1.45, 1.48, 4.1, 48);
  const pillarMesh = new THREE.Mesh(pillarGeo, materials.wall);
  pillarMesh.position.y = 2.45;
  pillarMesh.castShadow = true;
  pillarMesh.receiveShadow = true;
  columnGroup.add(pillarMesh);

  // Pillar Top Cornice & Capital with Brass Gold Frieze
  const colCapital1 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.65, 1.48, 0.22, 32),
    materials.brass
  );
  colCapital1.position.y = 4.45;
  columnGroup.add(colCapital1);

  const colCapital2 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.82, 1.65, 0.15, 32),
    materials.pedestalStone
  );
  colCapital2.position.y = 4.60;
  columnGroup.add(colCapital2);

  // 3.3 Elegant Inscribed Monumental Plaque on the South Face of the Column (Duc Thanh Tran)
  const ptg1 = content.centralPillarPaintings[0] || {
    order: 1,
    titleVi: 'Hưng Đạo Đại Vương Trần Quốc Tuấn',
    captionVi: 'Hình tượng Đức Thánh Trần uy nghiêm • Điểm tựa tinh thần của nhà trường',
    descriptionVi: 'Vị trí ghi danh và trưng bày hình ảnh tư liệu Đức Thánh Trần tại Cột trụ trung tâm.',
  };

  const pGroup = new THREE.Group();
  pGroup.position.set(0, 2.35, 1.48);

  const frameMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.86, 2.36, 0.08),
    materials.brass
  );
  frameMesh.castShadow = true;
  pGroup.add(frameMesh);

  const canvasTex = createCentralPillarPaintingTexture(
    1,
    ptg1.titleVi,
    ptg1.captionVi,
    ptg1.customUrl
  );
  const canvasMat = new THREE.MeshStandardMaterial({
    map: canvasTex,
    roughness: 0.32,
    metalness: 0.15,
  });
  const canvasMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.72, 2.22),
    canvasMat
  );
  canvasMesh.position.z = 0.046;
  pGroup.add(canvasMesh);

  columnGroup.add(pGroup);

  const spot = new THREE.SpotLight(0xffecd0, 2.5, 12, Math.PI / 5, 0.45, 1.2);
  spot.position.set(0, 4.9, 6.1);
  spot.target.position.set(0, 2.35, 3.98);
  root.add(spot);
  root.add(spot.target);
  spotlights.push(spot);

  interactiveExhibits.push({
    id: 'development_central_pillar_painting_1',
    mesh: canvasMesh,
    titleVi: `ẢNH ĐỨC THÁNH TRẦN: ${ptg1.titleVi.toUpperCase()}`,
    subtitleVi: ptg1.captionVi,
    category: 'artifacts',
    type: 'central_pillar_painting',
    dataPayload: {
      ...ptg1,
      cmdNote: 'Ảnh Đức Thánh Trần này được quản lý trực tiếp qua hệ thống CMD.',
    },
  });

  root.add(columnGroup);

  // 3D. MASTER TIMELINE CELESTIAL DAIS (Low-profile dais at X = 0, Z = 8.5)
  // Low-profile design (height 0.35m) ensures completely unobstructed sightlines
  const monumentGroup = new THREE.Group();
  monumentGroup.position.set(0, 0, 8.5);

  const monBase1 = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.4, 0.18, 48),
    materials.pedestalStone
  );
  monBase1.position.set(0, 0.09, 0);
  monBase1.receiveShadow = true;
  monumentGroup.add(monBase1);

  const monBase2 = new THREE.Mesh(
    new THREE.CylinderGeometry(1.85, 1.95, 0.14, 48),
    materials.trimWood
  );
  monBase2.position.set(0, 0.23, 0);
  monBase2.receiveShadow = true;
  monumentGroup.add(monBase2);

  const monBrassRim = new THREE.Mesh(
    new THREE.TorusGeometry(1.96, 0.035, 16, 48),
    materials.brass
  );
  monBrassRim.rotation.x = Math.PI / 2;
  monBrassRim.position.set(0, 0.31, 0);
  monumentGroup.add(monBrassRim);

  const dialTex = createCentralTimelineEmblemTexture();
  const dialMat = new THREE.MeshStandardMaterial({
    map: dialTex,
    roughness: 0.24,
    metalness: 0.25,
  });
  const dialMesh = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 0.04, 64), dialMat);
  dialMesh.position.set(0, 0.33, 0);
  monumentGroup.add(dialMesh);

  // Elegant low-profile celestial orb and gold orbital rings
  const sphereGeo = new THREE.SphereGeometry(0.26, 32, 32);
  const blackHoleSphere = new THREE.Mesh(sphereGeo, materials.obsidianSphere);
  blackHoleSphere.position.set(0, 0.65, 0);
  blackHoleSphere.castShadow = true;
  blackHoleSphere.receiveShadow = true;
  monumentGroup.add(blackHoleSphere);

  const photonRingGeo = new THREE.TorusGeometry(0.42, 0.012, 16, 64);
  const photonRingMat = materials.luminousGold.clone();
  photonRingMat.emissiveIntensity = 2.4;
  const photonRing = new THREE.Mesh(photonRingGeo, photonRingMat);
  photonRing.position.set(0, 0.65, 0);
  photonRing.rotation.x = Math.PI / 2.3;
  monumentGroup.add(photonRing);

  const ringTorusGeo = new THREE.TorusGeometry(0.68, 0.018, 16, 64);
  const monumentRing = new THREE.Mesh(ringTorusGeo, materials.luminousGold);
  monumentRing.position.set(0, 0.65, 0);
  monumentRing.rotation.x = Math.PI / 2.25;
  monumentGroup.add(monumentRing);

  const ring2Geo = new THREE.TorusGeometry(0.92, 0.014, 16, 64);
  const blackHoleRing2 = new THREE.Mesh(ring2Geo, materials.brass);
  blackHoleRing2.position.set(0, 0.65, 0);
  blackHoleRing2.rotation.x = Math.PI / 1.7;
  blackHoleRing2.rotation.y = 0.42;
  monumentGroup.add(blackHoleRing2);

  const ring3Geo = new THREE.TorusGeometry(1.15, 0.012, 16, 64);
  const blackHoleRing3 = new THREE.Mesh(ring3Geo, materials.luminousGold);
  blackHoleRing3.position.set(0, 0.65, 0);
  blackHoleRing3.rotation.x = Math.PI / 2.8;
  blackHoleRing3.rotation.z = -0.38;
  monumentGroup.add(blackHoleRing3);

  const accretionDiscGeo = new THREE.RingGeometry(0.4, 1.15, 48);
  const accretionDiscMat = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.16,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const blackHoleAccretionMesh = new THREE.Mesh(accretionDiscGeo, accretionDiscMat);
  blackHoleAccretionMesh.position.set(0, 0.65, 0);
  blackHoleAccretionMesh.rotation.x = Math.PI / 2.25;
  monumentGroup.add(blackHoleAccretionMesh);

  const blackHoleCoreLight = new THREE.PointLight(0xffdf88, 1.8, 5, 2);
  blackHoleCoreLight.position.set(0, 0.65, 0);
  monumentGroup.add(blackHoleCoreLight);

  const spotSphere = new THREE.SpotLight(0xffecd0, 2.5);
  spotSphere.position.set(0, 4.8, monumentGroup.position.z + 1.2);
  spotSphere.target = dialMesh;
  spotSphere.angle = 0.55;
  spotSphere.penumbra = 0.5;
  spotSphere.distance = 8;
  spotSphere.castShadow = true;
  monumentGroup.add(spotSphere);
  spotlights.push(spotSphere);

  interactiveExhibits.push({
    id: 'development_master_timeline',
    mesh: dialMesh,
    titleVi: 'TRỤC THỜI GIAN PHÁT TRIỂN (MASTER TIMELINE)',
    subtitleVi: 'Đài danh dự và dải quỹ đạo hoàng kim 3 thời kỳ phát triển (1974–2026)',
    category: 'timeline',
    type: 'master_timeline',
    dataPayload: {
      thematicTitleVi: ZONE_2_DEVELOPMENT_CONTENT.thematicTitleVi,
      coreMottoVi: ZONE_2_DEVELOPMENT_CONTENT.coreMottoVi,
      eraOne: ZONE_2_DEVELOPMENT_CONTENT.eraOne,
      eraTwo: ZONE_2_DEVELOPMENT_CONTENT.eraTwo,
      eraThree: ZONE_2_DEVELOPMENT_CONTENT.eraThree,
    },
  });

  root.add(monumentGroup);

  // 3.10 Floating Celestial Stardust Particles around room (like Room 1)
  const starParticleCount = 400;
  const starGeo = new THREE.BufferGeometry();
  const starPos = new Float32Array(starParticleCount * 3);
  for (let i = 0; i < starParticleCount; i++) {
    starPos[i * 3] = (Math.random() - 0.5) * (ROOM_W - 2);
    starPos[i * 3 + 1] = 0.5 + Math.random() * (ROOM_H - 1.2);
    starPos[i * 3 + 2] = (Math.random() - 0.5) * (ROOM_L - 4);
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({
    color: 0xffdf88,
    size: 0.045,
    transparent: true,
    opacity: 0.65,
    blending: THREE.AdditiveBlending,
  });
  const orbitParticles = new THREE.Points(starGeo, starMat);
  root.add(orbitParticles);

  // =========================================================================
  // 4. WEST WALL (X = -halfW): BÊN TRÁI — LỊCH SỬ TỪ 1975–2026 & LỊCH SỬ BAN GIÁM HIỆU
  // Organized into dedicated chronological bays aligned with the architectural column grid.
  // =========================================================================
  const westGroup = new THREE.Group();
  const era1Milestones = content.eraOne.milestones;
  const era2Milestones = content.eraTwo.milestones;
  const era3Milestones = content.eraThree.milestones;

  // 4.1 Bay 7 (Z = +11.25): Header Banner Lịch Sử Từ 1975–2026
  const era1BannerTex = createMilestonePlaqueTexture(
    '1975 – 2026',
    'LỊCH SỬ NHÀ TRƯỜNG TỪ 1975 ĐẾN 2026',
    'Hơn nửa thế kỷ kiên cường kiến thiết, đổi mới sáng tạo và khẳng định vị thế trường trọng điểm chất lượng cao.',
    'GIAI ĐOẠN LỊCH SỬ'
  );
  const era1BannerMat = new THREE.MeshStandardMaterial({
    map: era1BannerTex,
    roughness: 0.3,
    metalness: 0.12,
  });
  const era1Banner = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.6), era1BannerMat);
  era1Banner.position.set(-halfW + 0.05, 2.5, 11.25);
  era1Banner.rotation.y = Math.PI / 2;
  westGroup.add(era1Banner);

  panelPlacements.push({
    id: 'era1_banner',
    name: 'Lịch sử 1975–2026 Header Banner',
    wall: 'west',
    centerZ: 11.25,
    centerY: 2.5,
    width: 3.2,
    height: 1.6,
  });

  interactiveExhibits.push({
    id: 'era1_banner',
    mesh: era1Banner,
    titleVi: 'LỊCH SỬ NHÀ TRƯỜNG TỪ 1975 ĐẾN 2026',
    subtitleVi: 'Hơn nửa thế kỷ kiên cường kiến thiết, đổi mới sáng tạo và khẳng định vị thế trường trọng điểm chất lượng cao.',
    year: '1975–2026',
    category: 'historical_narrative',
    type: 'milestone',
    dataPayload: {
      year: '1975–2026',
      period: 'Hơn 50 năm',
      titleVi: 'Lịch Sử Nhà Trường Từ 1975 Đến 2026',
      descriptionVi:
        'Từ mốc lịch sử sau ngày thống nhất non sông, Trường THPT A Trần Hưng Đạo đã không ngừng phát triển qua các thời kỳ: Ổn định cơ sở tại Lộc Vượng sau 5 lần sơ tán (1974–1982), vinh dự mang tên Đức Thánh Trần (1982), thời kỳ Đổi Mới và đón Bác Giáp về thăm (1986–1996), đón nhận trọn bộ Huân chương Lao động và Huân chương Độc lập (2000–2016), đến thời kỳ đổi mới số và hướng tới Đại lễ Kim cương 60 năm (2016–2026).',
    },
  });

  // 4.2 Bay 6 (Z = +6.75): Mốc 1974–1982: Ổn Định Cơ Sở & Quyết Định Đổi Tên Trường
  const ms1974 = era1Milestones.find((m) => m.id === 'dev_milestone_1974')!;
  const plaque1974Tex = createMilestonePlaqueTexture(
    '1974 – 1982',
    'ỔN ĐỊNH CƠ SỞ & QUYẾT ĐỊNH ĐỔI TÊN TRƯỜNG',
    'Tháng 10/1974: Trường ổn định tại số 75/203 Trần Thái Tông sau 5 lần sơ tán • 26/10/1982: Quyết định 1042/QĐ-UB đổi tên thành Trường PTTH Trần Hưng Đạo.',
    'MỐC LỊCH SỬ'
  );
  const plaque1974Mat = new THREE.MeshStandardMaterial({
    map: plaque1974Tex,
    roughness: 0.28,
    metalness: 0.18,
  });
  const plaque1974Mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.2, 1.5), plaque1974Mat);
  plaque1974Mesh.position.set(-halfW + 0.05, 2.3, 6.75);
  plaque1974Mesh.rotation.y = Math.PI / 2;
  westGroup.add(plaque1974Mesh);

  panelPlacements.push({
    id: 'development_1974_stabilization',
    name: 'Mốc 1974-1982: Ổn định cơ sở & Đổi tên trường',
    wall: 'west',
    centerZ: 6.75,
    centerY: 2.3,
    width: 3.2,
    height: 1.5,
  });

  interactiveExhibits.push({
    id: 'development_1974_stabilization',
    mesh: plaque1974Mesh,
    titleVi: ms1974.titleVi,
    subtitleVi: ms1974.descriptionVi,
    year: '1974–1982',
    category: ms1974.category,
    type: 'milestone',
    dataPayload: ms1974,
  });

  // 4.3 Bay 5 (Z = +2.25): Mốc 1986–1996: Thời Kỳ Đổi Mới & Bác Giáp Về Thăm
  const ms1992 = era1Milestones.find((m) => m.id === 'dev_milestone_1992')!;
  const plaque1992Tex = createMilestonePlaqueTexture(
    '1986 – 1996',
    'THỜI KỲ ĐỔI MỚI & BÁC GIÁP VỀ THĂM TRƯỜNG',
    'Đại tướng Võ Nguyên Giáp về thăm trường (1992) • 1 trong 7 trường THPT toàn quốc thí điểm phân ban (1993–1994) • Huân chương Lao động hạng Nhì (1996).',
    'SỰ KIỆN LỊCH SỬ'
  );
  const plaque1992Mat = new THREE.MeshStandardMaterial({
    map: plaque1992Tex,
    roughness: 0.28,
    metalness: 0.18,
  });
  const plaque1992Mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.6), plaque1992Mat);
  plaque1992Mesh.position.set(-halfW + 0.05, 2.3, 2.25);
  plaque1992Mesh.rotation.y = Math.PI / 2;
  westGroup.add(plaque1992Mesh);

  panelPlacements.push({
    id: 'development_1992_visit',
    name: 'Mốc 1986-1996: Đổi Mới & Bác Giáp về thăm',
    wall: 'west',
    centerZ: 2.25,
    centerY: 2.3,
    width: 3.4,
    height: 1.6,
  });

  interactiveExhibits.push({
    id: 'development_1992_visit',
    mesh: plaque1992Mesh,
    titleVi: ms1992.titleVi,
    subtitleVi: ms1992.descriptionVi,
    year: '1986–1996',
    category: ms1992.category,
    type: 'milestone',
    dataPayload: ms1992,
  });

  // 4.4 Bay 4 (Z = -2.25): Mốc 2000–2016: Chuẩn Quốc Gia, Huân Chương Độc Lập & 50 Năm
  const ms2006 = era2Milestones.find((m) => m.id === 'dev_milestone_2006')!;
  const plaque2006Tex = createMilestonePlaqueTexture(
    '2000 – 2016',
    'CHUẨN QUỐC GIA, HUÂN CHƯƠNG ĐỘC LẬP & 50 NĂM',
    'Huân chương Lao động hạng Nhất (2000) • Xếp thứ 37 Top 200 toàn quốc (2007) • Chuẩn Quốc gia (2009) • Huân chương Độc lập hạng Ba (2011) • Đại lễ 50 năm (2016).',
    'MỐC VÀNG LỊCH SỬ'
  );
  const plaque2006Mat = new THREE.MeshStandardMaterial({
    map: plaque2006Tex,
    roughness: 0.28,
    metalness: 0.18,
  });
  const plaque2006Mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.6), plaque2006Mat);
  plaque2006Mesh.position.set(-halfW + 0.05, 2.3, -2.25);
  plaque2006Mesh.rotation.y = Math.PI / 2;
  westGroup.add(plaque2006Mesh);

  panelPlacements.push({
    id: 'development_2006_anniversary',
    name: 'Mốc 2000-2016: Chuẩn QG, Huân chương Độc lập & 50 năm',
    wall: 'west',
    centerZ: -2.25,
    centerY: 2.3,
    width: 3.4,
    height: 1.6,
  });

  interactiveExhibits.push({
    id: 'development_2006_anniversary',
    mesh: plaque2006Mesh,
    titleVi: 'GIAI ĐOẠN 2000–2016: BỨT PHÁ CHUẨN QUỐC GIA & HUÂN CHƯƠNG ĐỘC LẬP',
    subtitleVi: ms2006.descriptionVi,
    year: '2000–2016',
    category: ms2006.category,
    type: 'milestone',
    dataPayload: ms2006,
  });

  // 4.5 Bay 3 (Z = -6.75): Mốc 2016–2026: Đổi Tên THPT A Trần Hưng Đạo & Hướng Tới 60 Năm
  const ms2021 = era3Milestones.find((m) => m.id === 'dev_milestone_2021')!;
  const plaque2021Tex = createMilestonePlaqueTexture(
    '2016 – 2026',
    'ĐỔI TÊN THPT A TRẦN HƯNG ĐẠO & ĐẠI LỄ 60 NĂM',
    'Khánh thành nhà 4 tầng 33 phòng (2024) • Tháng 7/2025: Đổi tên thành THPT A Trần Hưng Đạo • Nhận Cờ thi đua Chính phủ & Đại lễ 60 năm (1966–2026).',
    'KỶ NGUYÊN MỚI'
  );
  const plaque2021Mat = new THREE.MeshStandardMaterial({
    map: plaque2021Tex,
    roughness: 0.28,
    metalness: 0.18,
  });
  const plaque2021Mesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.6), plaque2021Mat);
  plaque2021Mesh.position.set(-halfW + 0.05, 2.3, -6.75);
  plaque2021Mesh.rotation.y = Math.PI / 2;
  westGroup.add(plaque2021Mesh);

  panelPlacements.push({
    id: 'development_2021_anniversary',
    name: 'Mốc 2016-2026: THPT A Trần Hưng Đạo & Hướng tới 60 năm',
    wall: 'west',
    centerZ: -6.75,
    centerY: 2.3,
    width: 3.4,
    height: 1.6,
  });

  interactiveExhibits.push({
    id: 'development_2021_anniversary',
    mesh: plaque2021Mesh,
    titleVi: 'GIAI ĐOẠN 2016–2026: ĐỔI MỚI SỐ & TIẾN TỚI ĐẠI LỄ 60 NĂM',
    subtitleVi: ms2021.descriptionVi,
    year: '2016–2026',
    category: ms2021.category,
    type: 'milestone',
    dataPayload: ms2021,
  });

  // 4.6 Bay 2 (Z = -11.25): Lịch Sử Ban Giám Hiệu — Gian Tôn Vinh 9 Thế Hệ Hiệu Trưởng (1966–2026)
  const leadersGroup = new THREE.Group();
  leadersGroup.position.set(-halfW + 0.05, 2.3, -11.25);
  leadersGroup.rotation.y = Math.PI / 2;

  const leaders = content.leadershipHeritage.principals;
  const leaderPlaqueW = 0.62;
  const leaderSpacing = 0.72;

  // Background mount board in deep obsidian black-bronze with 24K gold border
  const leaderBoardMat = new THREE.MeshStandardMaterial({
    color: 0x110e0a,
    roughness: 0.35,
    metalness: 0.15,
  });
  const leaderBoardMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.2), leaderBoardMat);
  leadersGroup.add(leaderBoardMesh);

  const leaderTrim = new THREE.Mesh(new THREE.BoxGeometry(3.64, 2.24, 0.04), materials.brass);
  leaderTrim.position.set(0, 0, -0.01);
  leadersGroup.add(leaderTrim);

  // 9 leadership plaques in two balanced rows (5 top, 4 bottom centered)
  leaders.forEach((ldr, idx) => {
    const lTex = createLeadershipPlaqueTexture(ldr.order, ldr.name, ldr.role, ldr.period);
    const lMat = new THREE.MeshStandardMaterial({
      map: lTex,
      roughness: 0.28,
      metalness: 0.18,
    });
    const lMesh = new THREE.Mesh(new THREE.PlaneGeometry(leaderPlaqueW, 0.92), lMat);
    const isTopRow = idx < 5;
    const yPos = isTopRow ? 0.52 : -0.52;
    const xOffset = isTopRow ? (idx - 2) * leaderSpacing : (idx - 5 - 1.5) * leaderSpacing;
    lMesh.position.set(xOffset, yPos, 0.03);
    leadersGroup.add(lMesh);
  });

  westGroup.add(leadersGroup);

  panelPlacements.push({
    id: 'development_leadership_gallery',
    name: 'Lịch sử BGH: Danh Bộ 9 Thế Hệ Hiệu Trưởng',
    wall: 'west',
    centerZ: -11.25,
    centerY: 2.3,
    width: 3.6,
    height: 2.2,
  });

  interactiveExhibits.push({
    id: 'development_leadership_gallery',
    mesh: leaderBoardMesh,
    titleVi: content.leadershipHeritage.titleVi,
    subtitleVi: 'Danh sách 9 đời Hiệu trưởng từ Thầy Phạm Quốc Dũng (1966) đến Thầy Nguyễn Duy Phương (hiện nay).',
    category: 'leadership',
    type: 'leadership',
    dataPayload: content.leadershipHeritage,
  });

  // 4.7 Bay 1 (Z = -15.75): Lịch Sử Ban Giám Hiệu — Đội Ngũ Cán Bộ Quản Lý & Dấu Ấn Cống Hiến
  const leadershipHistTex = createMilestonePlaqueTexture(
    '1966 – 2026',
    'LỊCH SỬ CỐNG HIẾN CỦA BAN GIÁM HIỆU & CÁN BỘ QUẢN LÝ',
    'Tôn vinh các thế hệ Chi ủy, Ban Giám hiệu, Ban Chấp hành Công đoàn và Đoàn Thanh niên đã đồng tâm hiệp lực xây đắp mái trường qua 60 năm lịch sử vẻ vang.',
    'DI SẢN LÃNH ĐẠO'
  );
  const leadershipHistMat = new THREE.MeshStandardMaterial({
    map: leadershipHistTex,
    roughness: 0.28,
    metalness: 0.18,
  });
  const leadershipHistMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.6), leadershipHistMat);
  leadershipHistMesh.position.set(-halfW + 0.05, 2.3, -15.75);
  leadershipHistMesh.rotation.y = Math.PI / 2;
  westGroup.add(leadershipHistMesh);

  panelPlacements.push({
    id: 'development_leadership_history',
    name: 'Lịch sử BGH: Đội Ngũ Cán Bộ Quản Lý & Cống Hiến',
    wall: 'west',
    centerZ: -15.75,
    centerY: 2.3,
    width: 3.4,
    height: 1.6,
  });

  interactiveExhibits.push({
    id: 'development_leadership_history',
    mesh: leadershipHistMesh,
    titleVi: 'LỊCH SỬ CỐNG HIẾN CỦA BAN GIÁM HIỆU & CÁN BỘ QUẢN LÝ',
    subtitleVi: 'Tôn vinh các thế hệ Chi ủy, Ban Giám hiệu, Ban Chấp hành Công đoàn và Đoàn Thanh niên đã đồng tâm hiệp lực xây đắp mái trường qua 60 năm.',
    year: '1966–2026',
    category: 'leadership',
    type: 'leadership',
    dataPayload: {
      titleVi: 'Lịch Sử Cống Hiến Của Ban Giám Hiệu & Cán Bộ Quản Lý Qua Các Thời Kỳ',
      descriptionVi:
        'Trải qua 60 năm lịch sử (1966–2026), Ban Giám hiệu nhà trường qua các nhiệm kỳ luôn giữ vững bản lĩnh chính trị, đổi mới công tác quản lý và đồng hành cùng tập thể sư phạm. Đặc biệt năm 1985, Thầy Trần Hữu Hải được giao nhiệm vụ phụ trách trường trong giai đoạn chuyển giao nhân sự quan trọng. Sự tận tụy và tâm huyết của các thế hệ cán bộ quản lý đã tạo nên nền tảng vững chắc cho Trường THPT A Trần Hưng Đạo hôm nay.',
    },
  });

  root.add(westGroup);

  // =========================================================================
  // 5. EAST WALL (X = +halfW): BÊN PHẢI — NHỮNG ĐIỂM NỔI BẬT CỦA TRƯỜNG NGÀY NAY
  // & TRUNG TÂM KHEN THƯỞNG:
  // - Bên phải trung tâm: Ba Huân chương Lao động và hình ảnh (Bay 5, Z = +2.25)
  // - Ở giữa trung tâm: Các phần thưởng lớn khác của Tỉnh, Bộ GD&ĐT và Chính phủ (Bay 4, Z = -2.25)
  // - Bên trái trung tâm: Bằng khen Thủ tướng Chính phủ (Bay 3, Z = -6.75)
  // =========================================================================
  const eastGroup = new THREE.Group();
  const awardsData = content.centralRightAwards;

  // 5.1 Bay 7 (Z = +11.25): Trường Ngày Nay: Bảng Quy Mô & Cơ Sở Vật Chất Khang Trang Hiện Đại
  const statsGroup = new THREE.Group();
  statsGroup.position.set(halfW - 0.05, 2.3, 11.25);
  statsGroup.rotation.y = -Math.PI / 2;

  const chartTex = createComparativeScaleChartTexture();
  const chartMat = new THREE.MeshStandardMaterial({
    map: chartTex,
    roughness: 0.28,
    metalness: 0.18,
  });
  const chartMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.8), chartMat);
  statsGroup.add(chartMesh);
  eastGroup.add(statsGroup);

  panelPlacements.push({
    id: 'development_school_statistics',
    name: 'Trường Ngày Nay: Bảng Quy Mô & Tăng Trưởng',
    wall: 'east',
    centerZ: 11.25,
    centerY: 2.3,
    width: 3.6,
    height: 1.8,
  });

  interactiveExhibits.push({
    id: 'development_school_statistics',
    mesh: chartMesh,
    titleVi: 'ĐIỂM NỔI BẬT NGÀY NAY: QUY MÔ & CƠ SỞ VẬT CHẤT HIỆN ĐẠI',
    subtitleVi: 'Quy mô 39 lớp, 1.750 học sinh, 89 cán bộ giáo viên và tòa nhà 4 tầng 33 phòng học chuẩn quốc gia.',
    category: 'statistics',
    type: 'statistics',
    dataPayload: content.statistics,
  });

  // 5.2 Bay 6 (Z = +6.75): Trường Ngày Nay: Đội Ngũ Nhà Giáo Chuẩn Mực & Chất Lượng Đào Tạo Mũi Nhọn
  const facultyTex = createMilestonePlaqueTexture(
    'CHẤT LƯỢNG MŨI NHỌN',
    'ĐỘI NGŨ NHÀ GIÁO CHUẨN MỰC & HỌC SINH GIỎI',
    '100% cán bộ giáo viên đạt chuẩn, 31 Thạc sĩ • Tỷ lệ đỗ tốt nghiệp 100%, đỗ đại học nguyện vọng cao dẫn đầu tỉnh • Hàng trăm giải HSG cấp Tỉnh & Quốc gia.',
    'ĐIỂM NỔI BẬT NGÀY NAY'
  );
  const facultyMat = new THREE.MeshStandardMaterial({
    map: facultyTex,
    roughness: 0.28,
    metalness: 0.18,
  });
  const facultyMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 1.6), facultyMat);
  facultyMesh.position.set(halfW - 0.05, 2.3, 6.75);
  facultyMesh.rotation.y = -Math.PI / 2;
  eastGroup.add(facultyMesh);

  panelPlacements.push({
    id: 'development_growth_overview',
    name: 'Trường Ngày Nay: Đội Ngũ Nhà Giáo & Chất Lượng Đào Tạo',
    wall: 'east',
    centerZ: 6.75,
    centerY: 2.3,
    width: 3.4,
    height: 1.6,
  });

  interactiveExhibits.push({
    id: 'development_growth_overview',
    mesh: facultyMesh,
    titleVi: 'ĐỘI NGŨ NHÀ GIÁO CHUẨN MỰC & CHẤT LƯỢNG ĐÀO TẠO MŨI NHỌN',
    subtitleVi: '100% giáo viên đạt chuẩn, 31 Thạc sĩ, bề dày giải học sinh giỏi và kết quả thi đua xuất sắc.',
    category: 'historical_narrative',
    type: 'growth_overview',
    dataPayload: {
      titleVi: 'Đội Ngũ Nhà Giáo Chuẩn Mực & Chất Lượng Đào Tạo Mũi Nhọn',
      summaryVi:
        'Nhà trường sở hữu đội ngũ 89 cán bộ giáo viên với 100% đạt chuẩn và 31 Thạc sĩ. Chất lượng giáo dục toàn diện luôn ở vị trí tốp đầu của tỉnh, hàng nghìn học sinh đạt giải học sinh giỏi cấp tỉnh và quốc gia, tỷ lệ đỗ đại học luôn đạt mức xuất sắc.',
    },
  });

  // -------------------------------------------------------------------------
  // TRUNG TÂM BÊN PHẢI (Bays 5, 4, 3): GIỚI THIỆU CÁC DANH HIỆU NHÀ TRƯỜNG ĐẠT ĐƯỢC
  // - Bên phải phần trung tâm: Ba Huân chương Lao động và hình ảnh (Bay 5, Z = +2.25)
  // - Ở giữa: Các phần thưởng lớn khác của Tỉnh, Bộ GD&ĐT và Chính phủ (Bay 4, Z = -2.25)
  // - Bên trái: Bằng khen Thủ tướng Chính phủ (Bay 3, Z = -6.75)
  // -------------------------------------------------------------------------

  // 5.3 Bay 5 (Z = +2.25): [BÊN PHẢI PHẦN TRUNG TÂM] BA HUÂN CHƯƠNG LAO ĐỘNG VÀ HÌNH ẢNH
  const laborTex = createHonorsAwardCardTexture(
    'labor_orders',
    awardsData.threeLaborOrders.titleVi,
    awardsData.threeLaborOrders.leadNarrativeVi,
    awardsData.threeLaborOrders.captionVi,
    awardsData.threeLaborOrders.customUrl
  );
  const laborMat = new THREE.MeshStandardMaterial({
    map: laborTex,
    roughness: 0.25,
    metalness: 0.2,
  });
  const laborMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.0), laborMat);
  laborMesh.position.set(halfW - 0.05, 2.3, 2.25);
  laborMesh.rotation.y = -Math.PI / 2;
  eastGroup.add(laborMesh);

  // Ornate 24K Gold Frame
  const laborFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 2.06, 3.46),
    materials.brass
  );
  laborFrame.position.set(halfW - 0.03, 2.3, 2.25);
  eastGroup.add(laborFrame);

  panelPlacements.push({
    id: 'development_award_three_labor_orders',
    name: 'Trung tâm bên phải: Ba Huân chương Lao động & Hình ảnh',
    wall: 'east',
    centerZ: 2.25,
    centerY: 2.3,
    width: 3.4,
    height: 2.0,
  });

  interactiveExhibits.push({
    id: 'development_award_three_labor_orders',
    mesh: laborMesh,
    titleVi: awardsData.threeLaborOrders.titleVi,
    subtitleVi: awardsData.threeLaborOrders.leadNarrativeVi,
    category: 'achievements',
    type: 'honors_award',
    dataPayload: {
      awardType: 'three_labor_orders',
      positionVi: 'Bên phải cụm danh hiệu trung tâm',
      titleVi: awardsData.threeLaborOrders.titleVi,
      leadNarrativeVi: awardsData.threeLaborOrders.leadNarrativeVi,
      captionVi: awardsData.threeLaborOrders.captionVi,
      customUrl: awardsData.threeLaborOrders.customUrl,
      cmdNote: 'Lời dẫn và 3 hình ảnh tư liệu được lưu trữ, đồng bộ và quản lý qua hệ thống CMD.',
    },
  });

  // 5.4 Bay 4 (Z = -2.25): [Ở GIỮA PHẦN TRUNG TÂM] CÁC PHẦN THƯỞNG LỚN KHÁC CỦA TỈNH, BỘ GIÁO DỤC VÀ CHÍNH PHỦ
  const govTex = createHonorsAwardCardTexture(
    'ministry_province',
    awardsData.governmentMinistryProvinceAward.titleVi,
    awardsData.governmentMinistryProvinceAward.leadNarrativeVi,
    awardsData.governmentMinistryProvinceAward.captionVi,
    awardsData.governmentMinistryProvinceAward.customUrl
  );
  const govMat = new THREE.MeshStandardMaterial({
    map: govTex,
    roughness: 0.25,
    metalness: 0.2,
  });
  const govMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.0), govMat);
  govMesh.position.set(halfW - 0.05, 2.3, -2.25);
  govMesh.rotation.y = -Math.PI / 2;
  eastGroup.add(govMesh);

  const govFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 2.06, 3.46),
    materials.brass
  );
  govFrame.position.set(halfW - 0.03, 2.3, -2.25);
  eastGroup.add(govFrame);

  panelPlacements.push({
    id: 'development_award_government_ministry_province',
    name: 'Trung tâm ở giữa: Các phần thưởng lớn Tỉnh, Bộ GD&ĐT, Chính phủ',
    wall: 'east',
    centerZ: -2.25,
    centerY: 2.3,
    width: 3.4,
    height: 2.0,
  });

  interactiveExhibits.push({
    id: 'development_award_government_ministry_province',
    mesh: govMesh,
    titleVi: awardsData.governmentMinistryProvinceAward.titleVi,
    subtitleVi: awardsData.governmentMinistryProvinceAward.leadNarrativeVi,
    category: 'achievements',
    type: 'honors_award',
    dataPayload: {
      awardType: 'government_ministry_province',
      positionVi: 'Ở giữa cụm danh hiệu trung tâm',
      titleVi: awardsData.governmentMinistryProvinceAward.titleVi,
      leadNarrativeVi: awardsData.governmentMinistryProvinceAward.leadNarrativeVi,
      captionVi: awardsData.governmentMinistryProvinceAward.captionVi,
      customUrl: awardsData.governmentMinistryProvinceAward.customUrl,
      cmdNote: 'Lời dẫn và 3 hình ảnh tư liệu được lưu trữ, đồng bộ và quản lý qua hệ thống CMD.',
    },
  });

  // 5.5 Bay 3 (Z = -6.75): [BÊN TRÁI PHẦN TRUNG TÂM] BẰNG KHEN THỦ TƯỚNG CHÍNH PHỦ
  const pmTex = createHonorsAwardCardTexture(
    'prime_minister',
    awardsData.primeMinisterAward.titleVi,
    awardsData.primeMinisterAward.leadNarrativeVi,
    awardsData.primeMinisterAward.captionVi,
    awardsData.primeMinisterAward.customUrl
  );
  const pmMat = new THREE.MeshStandardMaterial({
    map: pmTex,
    roughness: 0.25,
    metalness: 0.2,
  });
  const pmMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 2.0), pmMat);
  pmMesh.position.set(halfW - 0.05, 2.3, -6.75);
  pmMesh.rotation.y = -Math.PI / 2;
  eastGroup.add(pmMesh);

  const pmFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 2.06, 3.46),
    materials.brass
  );
  pmFrame.position.set(halfW - 0.03, 2.3, -6.75);
  eastGroup.add(pmFrame);

  panelPlacements.push({
    id: 'development_award_prime_minister',
    name: 'Trung tâm bên trái: Bằng khen Thủ tướng Chính phủ',
    wall: 'east',
    centerZ: -6.75,
    centerY: 2.3,
    width: 3.4,
    height: 2.0,
  });

  interactiveExhibits.push({
    id: 'development_award_prime_minister',
    mesh: pmMesh,
    titleVi: awardsData.primeMinisterAward.titleVi,
    subtitleVi: awardsData.primeMinisterAward.leadNarrativeVi,
    category: 'achievements',
    type: 'honors_award',
    dataPayload: {
      awardType: 'prime_minister',
      positionVi: 'Bên trái cụm danh hiệu trung tâm',
      titleVi: awardsData.primeMinisterAward.titleVi,
      leadNarrativeVi: awardsData.primeMinisterAward.leadNarrativeVi,
      captionVi: awardsData.primeMinisterAward.captionVi,
      customUrl: awardsData.primeMinisterAward.customUrl,
      cmdNote: 'Lời dẫn và 3 hình ảnh tư liệu được lưu trữ, đồng bộ và quản lý qua hệ thống CMD.',
    },
  });

  // 5.6 Bay 2 (Z = -11.25): Trường Ngày Nay: Chuyển Đổi Số & Quản Trị Giáo Dục 4.0
  const digitalGroup = new THREE.Group();
  digitalGroup.position.set(halfW - 0.05, 2.3, -11.25);
  digitalGroup.rotation.y = -Math.PI / 2;

  const digitalPlaqueTex = createMilestonePlaqueTexture(
    'CHUYỂN ĐỔI SỐ',
    'QUẢN TRỊ HIỆN ĐẠI & ĐỔI MỚI DẠY HỌC',
    '100% Giáo án điện tử OneDrive & Edoc-Smas • 100% Chuẩn LMS • Nghiên cứu bài học định kỳ • STEM & Dự án.',
    'GIÁO DỤC 4.0'
  );
  const digitalPlaqueMat = new THREE.MeshStandardMaterial({
    map: digitalPlaqueTex,
    roughness: 0.28,
    metalness: 0.18,
  });
  const digitalMesh = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 1.8), digitalPlaqueMat);
  digitalGroup.add(digitalMesh);
  eastGroup.add(digitalGroup);

  panelPlacements.push({
    id: 'development_digital_management',
    name: 'Trường Ngày Nay: Chuyển Đổi Số & Quản Trị Giáo Dục 4.0',
    wall: 'east',
    centerZ: -11.25,
    centerY: 2.3,
    width: 3.6,
    height: 1.8,
  });

  interactiveExhibits.push({
    id: 'development_digital_management',
    mesh: digitalMesh,
    titleVi: content.digitalTransformation.titleVi,
    subtitleVi:
      'Hệ thống quản lý giáo án điện tử OneDrive, phần mềm Edoc-Smas, 100% chứng chỉ LMS và các mô hình lớp học tự quản.',
    category: 'digital',
    type: 'digital_management',
    dataPayload: content.digitalTransformation,
  });

  // 5.7 Bay 1 (Z = -15.75): Trường Ngày Nay: Ban Giám Hiệu & Cơ Cấu Sư Phạm Hiện Nay
  const currentOrg = content.currentOrganization;
  const orgGroup = new THREE.Group();
  orgGroup.position.set(halfW - 0.05, 2.3, -15.75);
  orgGroup.rotation.y = -Math.PI / 2;

  const orgTex = createOrganizationalPlaqueTexture(
    currentOrg.titleVi,
    currentOrg.principal,
    currentOrg.vicePrincipals
  );
  const orgMat = new THREE.MeshStandardMaterial({
    map: orgTex,
    roughness: 0.28,
    metalness: 0.18,
  });
  const orgPlaque = new THREE.Mesh(new THREE.PlaneGeometry(3.5, 1.7), orgMat);
  orgGroup.add(orgPlaque);
  eastGroup.add(orgGroup);

  panelPlacements.push({
    id: 'development_current_organization',
    name: 'Trường Ngày Nay: Ban Giám Hiệu & Cơ Cấu Sư Phạm Hiện Nay',
    wall: 'east',
    centerZ: -15.75,
    centerY: 2.3,
    width: 3.5,
    height: 1.7,
  });

  interactiveExhibits.push({
    id: 'development_current_organization',
    mesh: orgPlaque,
    titleVi: currentOrg.titleVi,
    subtitleVi: `${currentOrg.principal} • 2 Phó Hiệu trưởng • 7 Tổ chuyên môn và hành chính.`,
    category: 'organization',
    type: 'organization',
    dataPayload: currentOrg,
  });

  root.add(eastGroup);

  // =========================================================================
  // 6. NORTH WALL (Far End, Z = -halfL): Group C — 60th Diamond Jubilee Apex
  // =========================================================================
  const era3Group = new THREE.Group();
  const ms2026 = ZONE_2_DEVELOPMENT_CONTENT.eraThree.milestones.find((m) => m.id === 'dev_milestone_2026')!;

  const jubilee60Group = new THREE.Group();
  jubilee60Group.position.set(0, 0, -halfL + 0.6);

  // Refined architectural wall backdrop in deep obsidian black-bronze with gold frame
  const jubileeBackdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(7.2, 3.8),
    new THREE.MeshStandardMaterial({
      color: 0x110e0a,
      roughness: 0.35,
      metalness: 0.15,
    })
  );
  jubileeBackdrop.position.set(0, 2.4, 0);
  jubilee60Group.add(jubileeBackdrop);

  // 24K Heritage Gold Trim Frame
  const jubileeFrame = new THREE.Mesh(new THREE.BoxGeometry(7.3, 4.1, 0.06), materials.brass);
  jubileeFrame.position.set(0, 2.4, -0.02);
  jubilee60Group.add(jubileeFrame);

  // Commemorative 60 Years Master Plaque (Upper section at Y = 3.3)
  const plaque60Tex = createMilestonePlaqueTexture(
    '1966 – 2026',
    'ĐẠI LỄ KỶ NIỆM 60 NĂM THÀNH LẬP TRƯỜNG',
    'Cờ thi đua của Chính phủ (2025–2026) • 39 lớp • 1.750 học sinh • 89 cán bộ giáo viên (31 Thạc sĩ).',
    'MỐC KIM CƯƠNG 60 NĂM'
  );
  const plaque60Mat = new THREE.MeshStandardMaterial({
    map: plaque60Tex,
    roughness: 0.25,
    metalness: 0.22,
  });
  const plaque60Mesh = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 1.4), plaque60Mat);
  plaque60Mesh.position.set(0, 3.3, 0.04);
  jubilee60Group.add(plaque60Mesh);

  // North end wall preserves canonical 60th Jubilee commemoration architecture without virtual picture frames

  // Low plinth for Jubilee commemoration & Building model (positioned slightly in front at Z = 1.6m)
  const jubileePed = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.45, 1.0), materials.pedestalStone);
  jubileePed.position.set(0, 0.225, 1.5);
  jubileePed.receiveShadow = true;
  jubilee60Group.add(jubileePed);

  // Architectural 4-storey model on pedestal
  const bldgBase = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.45, 0.6), materials.wall);
  bldgBase.position.set(0, 0.675, 1.5);
  const bldgRoof = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.08, 0.65), materials.brass);
  bldgRoof.position.set(0, 0.94, 1.5);
  jubilee60Group.add(bldgBase, bldgRoof);

  era3Group.add(jubilee60Group);

  panelPlacements.push({
    id: 'development_2026_anniversary',
    name: ms2026.titleVi,
    wall: 'north',
    centerZ: -halfL + 0.6,
    centerX: 0,
    centerY: 3.3,
    width: 5.2,
    height: 1.4,
  });

  interactiveExhibits.push({
    id: 'development_2026_anniversary',
    mesh: plaque60Mesh,
    titleVi: ms2026.titleVi,
    subtitleVi: ms2026.descriptionVi,
    year: ms2026.year,
    category: ms2026.category,
    type: 'milestone',
    dataPayload: ms2026,
  });

  interactiveExhibits.push({
    id: 'development_2024_2025_building',
    mesh: jubileePed,
    titleVi: 'Mô Hình Nhà Học 4 Tầng Hiện Đại & Quy Hoạch 2026',
    subtitleVi: 'Công trình biểu tượng hướng tới đại lễ kỷ niệm 60 năm thành lập trường THPT A Trần Hưng Đạo.',
    year: '2024–2025',
    category: 'architecture',
    type: 'milestone',
    dataPayload: {
      year: '2024–2025',
      titleVi: 'Mô Hình Nhà Học 4 Tầng Hiện Đại',
      descriptionVi:
        'Công trình nhà học 4 tầng kiên cố hóa, bổ sung phòng học chức năng, phòng Lab thí nghiệm hiện đại đạt chuẩn kiểm định chất lượng mức độ cao nhất.',
    },
  });

  root.add(era3Group);

  // =========================================================================
  // 7. SCHOOL CORE VALUES STELE (Mounted on pedestal at X = -3.2, Z = 14.5)
  // Preserves 'development_values' scene object without blocking central aisle
  // =========================================================================
  const mottoGroup = new THREE.Group();
  mottoGroup.position.set(-3.2, 0, 14.5);
  mottoGroup.rotation.y = Math.PI / 6; // Angled invitingly towards visitors approaching from south

  const mottoBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.35, 0.6), materials.pedestalStone);
  mottoBase.position.y = 0.175;
  mottoGroup.add(mottoBase);

  const mottoPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 16), materials.brass);
  mottoPole.position.y = 0.8;
  mottoGroup.add(mottoPole);

  const mottoFrameMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 0.06), materials.brass);
  mottoFrameMesh.position.y = 1.65;
  mottoGroup.add(mottoFrameMesh);

  const mottoPlaqueTex = createMilestonePlaqueTexture(
    'RÈN ĐỨC – LUYỆN TÀI',
    'GIÁ TRỊ CỐT LÕI NHÀ TRƯỜNG',
    'Kiến thức vững vàng • Kỷ luật tự giác • Kết nối yêu thương • Khát vọng vươn xa.',
    'PHƯƠNG CHÂM TRUYỀN THỐNG'
  );
  const mottoPlaqueMat = new THREE.MeshStandardMaterial({
    map: mottoPlaqueTex,
    roughness: 0.28,
    metalness: 0.2,
  });
  const mottoPlaque = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.3), mottoPlaqueMat);
  mottoPlaque.position.set(0, 1.65, 0.035);
  mottoGroup.add(mottoPlaque);
  root.add(mottoGroup);

  interactiveExhibits.push({
    id: 'development_values',
    mesh: mottoPlaque,
    titleVi: 'PHƯƠNG CHÂM: "RÈN ĐỨC – LUYỆN TÀI"',
    subtitleVi: '4 giá trị cốt lõi: Kiến thức • Kỷ luật • Kết nối • Khát vọng.',
    category: 'values',
    type: 'values',
    dataPayload: ZONE_2_DEVELOPMENT_CONTENT.valuesAndMotto,
  });

  // =========================================================================
  // 8. AUTOMATED LAYOUT INTEGRITY VALIDATION
  // =========================================================================
  const validationResult = validateDevelopmentLayout(panelPlacements, DEVELOPMENT_COLUMNS, ROOM_H);
  if (!validationResult.passed) {
    console.error('Zone 2 Layout Validation Errors:', validationResult);
  } else {
    console.log(validationResult.summary);
  }

  // =========================================================================
  // 9. LUXURIOUS GOLDEN EXHIBITION LIGHTING RIG (identical to Room 1)
  // Warm golden ambiance with ~30% deep museum contrast
  // =========================================================================
  const ambientLights: THREE.Light[] = [];

  // Ambient Light (warm golden museum illumination)
  const ambLight = new THREE.AmbientLight(0xffeed6, 1.25);
  root.add(ambLight);
  ambientLights.push(ambLight);

  // Global Hemisphere Light (Soft warm sky fill & deep bronze-brown ground reflection)
  const hemiLight = new THREE.HemisphereLight(0xffeed6, 0x362414, 0.9);
  root.add(hemiLight);
  ambientLights.push(hemiLight);

  // Gallery Key Directional Light (Golden sunlight beam for architectural depth)
  const dirLight1 = new THREE.DirectionalLight(0xffeec6, 1.05);
  dirLight1.position.set(4, 8, 4);
  dirLight1.castShadow = true;
  dirLight1.shadow.mapSize.width = 1024;
  dirLight1.shadow.mapSize.height = 1024;
  dirLight1.shadow.bias = -0.0005;
  root.add(dirLight1);
  ambientLights.push(dirLight1);

  // Warm ceiling recessed downlights along the corridor axis (like Room 1)
  [-14, -10, -6, -2, 2, 6, 10, 14].forEach((zPos) => {
    const ceilingPoint = new THREE.PointLight(0xffdfa8, 1.45, 13, 1.6);
    ceilingPoint.position.set(0, ROOM_H - 0.25, zPos);
    root.add(ceilingPoint);
  });

  // Focused Warm Spotlights for key heritage exhibits
  const focalSpots = [
    { pos: [-5.0, 4.5, 6.75], target: [-halfW, 2.3, 6.75], color: 0xffebd2, intensity: 1.8 }, // 1974 Stabilization
    { pos: [-5.0, 4.5, -11.25], target: [-halfW, 2.3, -11.25], color: 0xffebd2, intensity: 1.8 }, // Statistics
    { pos: [5.0, 4.5, 6.75], target: [halfW, 2.3, 6.75], color: 0xffebd2, intensity: 1.8 }, // 2006 Monument
    { pos: [5.0, 4.5, -2.25], target: [halfW, 2.3, -2.25], color: 0xffebd2, intensity: 2.2 }, // Leadership Gallery
    { pos: [5.0, 4.5, -11.25], target: [halfW, 2.3, -11.25], color: 0xffebd2, intensity: 1.8 }, // Digital Management
    { pos: [0, 4.8, -halfL + 2.5], target: [0, 2.4, -halfL], color: 0xffdfa8, intensity: 2.8 }, // 60th Jubilee
  ];

  focalSpots.forEach((sp) => {
    const spot = new THREE.SpotLight(sp.color, sp.intensity, 20, Math.PI / 4.2, 0.45, 1.2);
    spot.position.set(sp.pos[0], sp.pos[1], sp.pos[2]);
    spot.target.position.set(sp.target[0], sp.target[1], sp.target[2]);
    root.add(spot);
    root.add(spot.target);
    spotlights.push(spot);
  });

  return {
    group: root,
    interactiveExhibits,
    monumentRing,
    blackHoleRing2,
    blackHoleRing3,
    blackHoleAccretionMesh,
    orbitParticles,
    timelineRotator: monumentRing,
    sculptural60Emblem: jubilee60Group,
    ambientLights,
    spotlights,
  };
}
