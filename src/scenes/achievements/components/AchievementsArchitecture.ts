/**
 * 3D Physical Architecture & Interactive Exhibition Generator for Zone 3: Achievements Room
 * Concept: MODERN HERITAGE — THE TEMPLE OF GLORY & 60-YEAR ACHIEVEMENTS
 *
 * Implements:
 * - WALL A: School Awards and Honours (divided into exactly 3 sections:
 *   1. Huân chương Lao động (1991 Ba, 1996 Nhì, 2000 Nhất) - 3 distinct bays
 *   2. Bằng khen của Thủ tướng Chính phủ (2006 dịp 40 năm) - grand central bay
 *   3. Các danh hiệu, khen thưởng và công nhận khác (5 awards)
 *   + Dedicated 3D Interactive Plaque: "XEM TOÀN BỘ HUÂN CHƯƠNG, HUY CHƯƠNG VÀ KHEN THƯỞNG"
 * - WALL B: Academic Achievements, School Year 2025–2026 (Infographics, STEM, Quality trends, 2026 Graduation Exam)
 * - NORTH WALL: Magnificent "ĐÀI VINH DANH" displaying published achievements, uploaded photos, and citations
 * - FLOOR: Flush commemorative medallion (zero tripping obstruction, open sightlines)
 * - Zero panel-to-column occlusions, zero panel-to-panel overlaps.
 */

import * as THREE from 'three';
import { AchievementsMaterialSet } from '../materials/AchievementsMaterials';
import {
  createAchievementRoomIntroTexture,
  createAwardFrameTexture,
  createAcademicStatisticTexture,
  createCentralHonorDaisTexture,
  createDaiVinhDanhTexture,
  createCataloguePlaqueTexture,
  createCulturalArtisticTexture,
  createExternalCompetitionsTexture,
} from '../textures/AchievementsProceduralTextures';
import {
  ZONE_3_ACHIEVEMENTS_CONTENT,
  Zone3AchievementsData,
  AwardItem,
  AcademicStatisticItem,
} from '../config/achievementsContentData';

export interface InteractiveAchievementExhibit {
  id: string;
  mesh: THREE.Object3D;
  titleVi: string;
  subtitleVi: string;
  category:
    | 'award_labor'
    | 'award_prime_minister'
    | 'award_other'
    | 'academic_stat'
    | 'orientation'
    | 'central_dais'
    | 'dai_vinh_danh'
    | 'catalogue_button'
    | 'cultural_artistic'
    | 'external_competitions';
  dataPayload: any;
}

export interface AchievementsSceneElements {
  group: THREE.Group;
  interactiveExhibits: InteractiveAchievementExhibit[];
  centerDaisMesh: THREE.Mesh | null;
  daiVinhDanhMesh: THREE.Mesh | null;
  ambientLights: THREE.Light[];
  spotlights: THREE.SpotLight[];
}

export function buildAchievementsRoomArchitecture(
  materials: AchievementsMaterialSet,
  content: Zone3AchievementsData = ZONE_3_ACHIEVEMENTS_CONTENT
): AchievementsSceneElements {
  const root = new THREE.Group();
  const interactiveExhibits: InteractiveAchievementExhibit[] = [];
  const spotlights: THREE.SpotLight[] = [];

  const ROOM_W = 16;
  const ROOM_L = 32;
  const ROOM_H = 5.6;
  const halfW = ROOM_W / 2;
  const halfL = ROOM_L / 2;

  // =========================================================================
  // 1. ARCHITECTURAL SHELL & FLOOR
  // =========================================================================

  // 1.1 Natural Smoked Oak Gallery Floor (Y = 0)
  const floorGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_L);
  const floorMesh = new THREE.Mesh(floorGeo, materials.floor);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  root.add(floorMesh);

  // 1.2 Central 24K Gold Guide Inlay Strips along axis
  const stripGeo = new THREE.BoxGeometry(0.04, 0.015, ROOM_L - 2);
  const leftStrip = new THREE.Mesh(stripGeo, materials.luminousGold);
  leftStrip.position.set(-2.0, 0.008, 0);
  root.add(leftStrip);

  const rightStrip = new THREE.Mesh(stripGeo, materials.luminousGold);
  rightStrip.position.set(2.0, 0.008, 0);
  root.add(rightStrip);

  // 1.3 Ceiling in Warm Walnut & Gold (Y = ROOM_H)
  const ceilGeo = new THREE.PlaneGeometry(ROOM_W, ROOM_L);
  const ceilMesh = new THREE.Mesh(ceilGeo, materials.ceiling);
  ceilMesh.position.y = ROOM_H;
  ceilMesh.rotation.x = Math.PI / 2;
  root.add(ceilMesh);

  // 1.4 Transverse Arch Ribs & Brass Gold Trims across ceiling
  [-12.0, -8.0, -4.0, 0.0, 4.0, 8.0, 12.0].forEach((zVal) => {
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

    // Warm museum downlight fixture along corridor
    const downlight = new THREE.PointLight(0xfff6ec, 0.75, 10, 1.8);
    downlight.position.set(0, ROOM_H - 0.35, zVal);
    root.add(downlight);
  });

  // 1.5 Perimeter Walls
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

  // North Wall (Far End, Grand Wall, Z = -halfL)
  const northWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_W, ROOM_H), materials.wall);
  northWallMesh.position.set(0, ROOM_H / 2, -halfL);
  northWallMesh.receiveShadow = true;
  root.add(northWallMesh);

  // West Wall (WALL A: School Awards & Honours, X = -halfW)
  const westWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_L, ROOM_H), materials.wall);
  westWallMesh.position.set(-halfW, ROOM_H / 2, 0);
  westWallMesh.rotation.y = Math.PI / 2;
  westWallMesh.receiveShadow = true;
  root.add(westWallMesh);

  // East Wall (WALL B: Academic Achievements 2025–2026, X = +halfW)
  const eastWallMesh = new THREE.Mesh(new THREE.PlaneGeometry(ROOM_L, ROOM_H), materials.wall);
  eastWallMesh.position.set(halfW, ROOM_H / 2, 0);
  eastWallMesh.rotation.y = -Math.PI / 2;
  eastWallMesh.receiveShadow = true;
  root.add(eastWallMesh);

  // Gilded Skirting & Picture Rail Moldings
  [-halfW + 0.05, halfW - 0.05].forEach((xVal) => {
    const skirtLong = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.24, ROOM_L), materials.trimWood);
    skirtLong.position.set(xVal, 0.12, 0);
    root.add(skirtLong);

    const railLong = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, ROOM_L), materials.brass);
    railLong.position.set(xVal, 4.3, 0);
    root.add(railLong);
  });

  // Structural Pilasters / Columns Grid (Spacing 4.0m along Z)
  // Columns are at Z: [-12.0, -8.0, -4.0, 0.0, 4.0, 8.0, 12.0]
  // Depth in Z is 0.4m (extends from z - 0.2 to z + 0.2).
  // All exhibition bays sit cleanly between columns!
  [-12.0, -8.0, -4.0, 0.0, 4.0, 8.0, 12.0].forEach((zVal, idx) => {
    [-halfW + 0.125, halfW - 0.125].forEach((colX, cIdx) => {
      const colGeo = new THREE.BoxGeometry(0.25, ROOM_H, 0.4);
      const colMesh = new THREE.Mesh(colGeo, materials.trimWood);
      colMesh.position.set(colX, ROOM_H / 2, zVal);
      root.add(colMesh);

      // Gold collar plinths
      const collarGeo = new THREE.BoxGeometry(0.27, 0.08, 0.42);
      const collarB = new THREE.Mesh(collarGeo, materials.brass);
      collarB.position.set(colX, 0.1, zVal);
      const collarT = new THREE.Mesh(collarGeo, materials.brass);
      collarT.position.set(colX, ROOM_H - 0.1, zVal);
      root.add(collarB, collarT);

      // Sconce Lights on alternating columns
      if (idx % 2 === 0) {
        const sconceX = cIdx === 0 ? colX + 0.22 : colX - 0.22;
        const sconceLight = new THREE.PointLight(0xffecd2, 0.95, 7, 2);
        sconceLight.position.set(sconceX, 2.7, zVal);
        root.add(sconceLight);

        const fixture = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.16, 16), materials.brass);
        fixture.position.set(sconceX, 2.7, zVal);
        root.add(fixture);
      }
    });
  });

  // =========================================================================
  // 2. ENTRANCE GATEWAY & ORIENTATION PLAQUE (Z = +halfL - 0.5m)
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

  // Entrance Orientation Plaque on an elegant pedestal stand (X = 3.2, Z = 13.5)
  const entryPlaqueGroup = new THREE.Group();
  entryPlaqueGroup.position.set(3.2, 0, 13.5);
  entryPlaqueGroup.rotation.y = -Math.PI / 6;

  const entryStandBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.25, 0.6), materials.pedestalStone);
  entryStandBase.position.y = 0.125;
  entryPlaqueGroup.add(entryStandBase);

  const entryStandPole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.1, 16), materials.brass);
  entryStandPole.position.y = 0.75;
  entryPlaqueGroup.add(entryStandPole);

  const entryFrameMesh = new THREE.Mesh(new THREE.BoxGeometry(2.6, 1.4, 0.06), materials.brass);
  entryFrameMesh.position.y = 1.6;
  entryPlaqueGroup.add(entryFrameMesh);

  const entryPlaqueTex = createAchievementRoomIntroTexture(
    '1966 – 2026',
    'KHU 3: BẢNG VÀNG THÀNH TÍCH',
    'Tôn vinh các Huân chương cao quý của Đảng, Nhà nước và những bứt phá thành tích giáo dục toàn diện.'
  );
  const entryPlaqueMat = new THREE.MeshStandardMaterial({
    map: entryPlaqueTex,
    roughness: 0.28,
    metalness: 0.15,
  });
  const entryPlaqueMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.3), entryPlaqueMat);
  entryPlaqueMesh.position.set(0, 1.6, 0.035);
  entryPlaqueGroup.add(entryPlaqueMesh);
  root.add(entryPlaqueGroup);

  interactiveExhibits.push({
    id: 'achievements_entry_intro',
    mesh: entryPlaqueMesh,
    titleVi: 'KHU 3: BẢNG VÀNG THÀNH TÍCH (1966–2026)',
    subtitleVi: 'Khám phá Vách A (Danh hiệu & Phần thưởng) và Vách B (Thành tích giáo dục 2025–2026).',
    category: 'orientation',
    dataPayload: {
      thematicTitleVi: content.thematicTitleVi,
      coreMottoVi: content.coreMottoVi,
      descriptionVi:
        'Chào mừng quý khách đến với Không gian Phân khu 3: Bảng Vàng Thành Tích Trường THPT A Trần Hưng Đạo. Nơi hội tụ các danh hiệu cao quý của Đảng, Nhà nước và những số liệu kiểm chứng về chất lượng giáo dục hàng đầu.',
    },
  });

  root.add(entryArch);

  // =========================================================================
  // 3. WALL A — SCHOOL AWARDS AND HONOURS (West Wall, X = -halfW)
  // Structured into EXACTLY 3 Sections with ZERO column overlaps:
  // Bay 1 (Z = 10.0): Labor Medal 1991 (Hạng Ba)
  // Bay 2 (Z = 6.0): Labor Medal 1996 (Hạng Nhì)
  // Bay 3 (Z = 2.0): Labor Medal 2000 (Hạng Nhất)
  // Bay 4 (Z = -2.0): Bằng khen Thủ tướng Chính phủ 2006 (Prominent Center)
  // Bay 5 (Z = -6.0): Bộ Văn hóa 1975 & Chuẩn Quốc Gia 2009
  // Bay 6 (Z = -10.0): Huân chương Độc lập hạng Ba 2011 & Phù Đổng 2015
  // Bay 7 (Z = -13.5): Cờ Thi Đua Chính Phủ 2026
  // Plaque at Z = 13.5: "XEM TOÀN BỘ HUÂN CHƯƠNG, HUY CHƯƠNG VÀ KHEN THƯỞNG"
  // =========================================================================

  const wallAGroup = new THREE.Group();
  wallAGroup.position.set(-halfW + 0.05, 0, 0);

  // Wall A Header Frieze
  const wallABannerGeo = new THREE.BoxGeometry(0.08, 0.45, 27);
  const wallABanner = new THREE.Mesh(wallABannerGeo, materials.trimWood);
  wallABanner.position.set(0.04, 4.4, 0);
  wallAGroup.add(wallABanner);

  // 3.0 Interactive Plaque on Wall A: "XEM TOÀN BỘ HUÂN CHƯƠNG, HUY CHƯƠNG VÀ KHEN THƯỞNG"
  // Placed at Z = 13.6m (Bay 0, between south gateway and column at 12.0)
  const catPlaqueGroup = new THREE.Group();
  catPlaqueGroup.position.set(0.08, 2.3, 13.6);
  catPlaqueGroup.rotation.y = Math.PI / 2;

  const catPlaqueW = 2.0;
  const catPlaqueH = 1.35;
  const catPlaqueFrame = new THREE.Mesh(
    new THREE.BoxGeometry(catPlaqueW + 0.12, catPlaqueH + 0.12, 0.08),
    materials.brass
  );
  catPlaqueGroup.add(catPlaqueFrame);

  const catPlaqueTex = createCataloguePlaqueTexture();
  const catPlaqueMat = new THREE.MeshStandardMaterial({
    map: catPlaqueTex,
    roughness: 0.25,
    metalness: 0.2,
  });
  const catPlaqueMesh = new THREE.Mesh(new THREE.PlaneGeometry(catPlaqueW, catPlaqueH), catPlaqueMat);
  catPlaqueMesh.position.z = 0.045;
  catPlaqueGroup.add(catPlaqueMesh);
  wallAGroup.add(catPlaqueGroup);

  interactiveExhibits.push({
    id: 'achievements_view_all_catalogue_button',
    mesh: catPlaqueMesh,
    titleVi: 'XEM TOÀN BỘ HUÂN CHƯƠNG, HUY CHƯƠNG VÀ KHEN THƯỞNG',
    subtitleVi: 'Mở danh mục tra cứu toàn diện, tìm kiếm và lọc tất cả danh hiệu 1966–2026.',
    category: 'catalogue_button',
    dataPayload: {
      action: 'open_catalogue',
    },
  });

  // Section 1: Huân chương Lao động (3 distinct frames, centered perfectly in bays)
  // Z = 10.0m (Bay 1), Z = 6.0m (Bay 2), Z = 2.0m (Bay 3)
  const laborZCoords = [10.0, 6.0, 2.0];
  content.wallA.laborMedals.forEach((award, idx) => {
    const zPos = laborZCoords[idx];
    const frameGroup = new THREE.Group();
    frameGroup.position.set(0.08, 2.3, zPos);
    frameGroup.rotation.y = Math.PI / 2;

    const fW = 1.8;
    const fH = 2.4;
    const outerFrame = new THREE.Mesh(
      new THREE.BoxGeometry(fW + 0.14, fH + 0.14, 0.08),
      materials.brass
    );
    outerFrame.castShadow = true;
    frameGroup.add(outerFrame);

    const innerVelvet = new THREE.Mesh(
      new THREE.BoxGeometry(fW + 0.02, fH + 0.02, 0.085),
      materials.velvetMatting
    );
    frameGroup.add(innerVelvet);

    const awardTex = createAwardFrameTexture(award);
    const canvasMat = new THREE.MeshStandardMaterial({
      map: awardTex,
      roughness: 0.28,
      metalness: 0.15,
    });
    const canvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(fW, fH), canvasMat);
    canvasMesh.position.z = 0.046;
    frameGroup.add(canvasMesh);

    wallAGroup.add(frameGroup);

    // Dedicated warm spotlight
    const spot = new THREE.SpotLight(0xfff6ec, 2.2, 12, Math.PI / 5, 0.45, 1.2);
    spot.position.set(-halfW + 3.2, 5.0, zPos);
    spot.target.position.set(-halfW + 0.1, 2.3, zPos);
    root.add(spot);
    root.add(spot.target);
    spotlights.push(spot);

    interactiveExhibits.push({
      id: award.id,
      mesh: canvasMesh,
      titleVi: `${award.titleVi.toUpperCase()} (${award.yearOrPeriod})`,
      subtitleVi: award.captionVi,
      category: 'award_labor',
      dataPayload: award,
    });
  });

  // Section 2: Bằng khen của Thủ tướng Chính phủ (2006)
  // Prominently centered at Z = -2.0m (Bay 4, completely unobstructed)
  const pmAward = content.wallA.primeMinisterCommendation;
  const pmGroup = new THREE.Group();
  pmGroup.position.set(0.1, 2.3, -2.0);
  pmGroup.rotation.y = Math.PI / 2;

  const pmW = 2.4;
  const pmH = 2.5;
  const pmOuterFrame = new THREE.Mesh(
    new THREE.BoxGeometry(pmW + 0.2, pmH + 0.2, 0.1),
    materials.brass
  );
  pmOuterFrame.castShadow = true;
  pmGroup.add(pmOuterFrame);

  const pmVelvet = new THREE.Mesh(
    new THREE.BoxGeometry(pmW + 0.04, pmH + 0.04, 0.105),
    materials.velvetMatting
  );
  pmGroup.add(pmVelvet);

  const pmTex = createAwardFrameTexture(pmAward);
  const pmMat = new THREE.MeshStandardMaterial({
    map: pmTex,
    roughness: 0.26,
    metalness: 0.18,
  });
  const pmMesh = new THREE.Mesh(new THREE.PlaneGeometry(pmW, pmH), pmMat);
  pmMesh.position.z = 0.055;
  pmGroup.add(pmMesh);

  wallAGroup.add(pmGroup);

  // Dedicated center spotlight for Prime Minister's commendation
  const pmSpot = new THREE.SpotLight(0xfff8ee, 2.8, 14, Math.PI / 4, 0.4, 1.2);
  pmSpot.position.set(-halfW + 3.8, 5.1, -2.0);
  pmSpot.target.position.set(-halfW + 0.1, 2.3, -2.0);
  root.add(pmSpot);
  root.add(pmSpot.target);
  spotlights.push(pmSpot);

  interactiveExhibits.push({
    id: pmAward.id,
    mesh: pmMesh,
    titleVi: `${pmAward.titleVi.toUpperCase()} (${pmAward.yearOrPeriod})`,
    subtitleVi: pmAward.captionVi,
    category: 'award_prime_minister',
    dataPayload: pmAward,
  });

  // Section 3: Các danh hiệu, khen thưởng và công nhận khác (5 awards)
  // Bay 5 (Z = -5.1m & Z = -6.9m), Bay 6 (Z = -9.1m & Z = -10.9m), Bay 7 (Z = -13.5m)
  const otherZCoords = [-5.1, -6.9, -9.1, -10.9, -13.5];
  content.wallA.otherHonors.forEach((award, idx) => {
    const zPos = otherZCoords[idx];
    const frameGroup = new THREE.Group();
    frameGroup.position.set(0.08, 2.3, zPos);
    frameGroup.rotation.y = Math.PI / 2;

    const fW = idx === 4 ? 1.6 : 1.25;
    const fH = 2.3;
    const outerFrame = new THREE.Mesh(
      new THREE.BoxGeometry(fW + 0.12, fH + 0.12, 0.08),
      materials.brass
    );
    outerFrame.castShadow = true;
    frameGroup.add(outerFrame);

    const innerVelvet = new THREE.Mesh(
      new THREE.BoxGeometry(fW + 0.02, fH + 0.02, 0.085),
      materials.velvetMatting
    );
    frameGroup.add(innerVelvet);

    const awardTex = createAwardFrameTexture(award);
    const canvasMat = new THREE.MeshStandardMaterial({
      map: awardTex,
      roughness: 0.28,
      metalness: 0.15,
    });
    const canvasMesh = new THREE.Mesh(new THREE.PlaneGeometry(fW, fH), canvasMat);
    canvasMesh.position.z = 0.046;
    frameGroup.add(canvasMesh);

    wallAGroup.add(frameGroup);

    // Dedicated spotlight
    const spot = new THREE.SpotLight(0xfff6ec, 2.0, 11, Math.PI / 5, 0.45, 1.2);
    spot.position.set(-halfW + 3.0, 5.0, zPos);
    spot.target.position.set(-halfW + 0.1, 2.3, zPos);
    root.add(spot);
    root.add(spot.target);
    spotlights.push(spot);

    interactiveExhibits.push({
      id: award.id,
      mesh: canvasMesh,
      titleVi: `${award.titleVi.toUpperCase()} (${award.yearOrPeriod})`,
      subtitleVi: award.captionVi,
      category: 'award_other',
      dataPayload: award,
    });
  });

  root.add(wallAGroup);

  // =========================================================================
  // 4. WALL B — ACADEMIC ACHIEVEMENTS 2025–2026 (East Wall, X = +halfW)
  // Perfectly positioned between columns:
  // Bay 1 (Z = 10.0m): Olympiad
  // Bay 2 (Z = 6.0m): STEM & Science
  // Bay 3 (Z = 2.0m): Educational Quality Trends
  // Bay 4 (Z = -2.0m): 2026 Graduation Examination
  // =========================================================================

  const wallBGroup = new THREE.Group();
  wallBGroup.position.set(halfW - 0.05, 0, 0);

  // Wall B Header Frieze
  const wallBBannerGeo = new THREE.BoxGeometry(0.08, 0.45, 27);
  const wallBBanner = new THREE.Mesh(wallBBannerGeo, materials.trimWood);
  wallBBanner.position.set(-0.04, 4.4, 0);
  wallBGroup.add(wallBBanner);

  const statsList: AcademicStatisticItem[] = [
    content.wallB.olympiad,
    content.wallB.stemAndScience,
    content.wallB.educationalQuality,
    content.wallB.graduationExam,
  ];
  const statZCoords = [10.0, 6.0, 2.0, -2.0];

  statsList.forEach((stat, idx) => {
    const zPos = statZCoords[idx];
    const statGroup = new THREE.Group();
    statGroup.position.set(-0.08, 2.3, zPos);
    statGroup.rotation.y = -Math.PI / 2;

    const pW = 2.6;
    const pH = 2.4;

    // Outer Gilded Bezel Frame
    const outerBezel = new THREE.Mesh(
      new THREE.BoxGeometry(pW + 0.14, pH + 0.14, 0.08),
      materials.brass
    );
    outerBezel.castShadow = true;
    statGroup.add(outerBezel);

    const innerMat = new THREE.Mesh(
      new THREE.BoxGeometry(pW + 0.02, pH + 0.02, 0.085),
      materials.velvetMatting
    );
    statGroup.add(innerMat);

    const statTex = createAcademicStatisticTexture(stat);
    const statMat = new THREE.MeshStandardMaterial({
      map: statTex,
      roughness: 0.28,
      metalness: 0.18,
    });
    const statMesh = new THREE.Mesh(new THREE.PlaneGeometry(pW, pH), statMat);
    statMesh.position.z = 0.046;
    statGroup.add(statMesh);

    wallBGroup.add(statGroup);

    // Dedicated spotlight for each statistical bay
    const spot = new THREE.SpotLight(0xfff6ec, 2.4, 12, Math.PI / 4, 0.45, 1.2);
    spot.position.set(halfW - 3.2, 5.0, zPos);
    spot.target.position.set(halfW - 0.1, 2.3, zPos);
    root.add(spot);
    root.add(spot.target);
    spotlights.push(spot);

    interactiveExhibits.push({
      id: stat.id,
      mesh: statMesh,
      titleVi: stat.titleVi,
      subtitleVi: stat.leadNarrativeVi,
      category: 'academic_stat',
      dataPayload: stat,
    });
  });

  // =========================================================================
  // Bay 5 (Z = -6.0m): EMPTY WALL SECTION A — DẤU ẤN VĂN HÓA — VĂN NGHỆ
  // Width 2.6m, clearance to column -4.0 is 0.50m, clearance to column -8.0 is 0.50m
  // =========================================================================
  const cultItem = content.wallB.culturalArtistic;
  const cultGroup = new THREE.Group();
  cultGroup.position.set(-0.08, 2.3, -6.0);
  cultGroup.rotation.y = -Math.PI / 2;

  const cultW = 2.6;
  const cultH = 2.4;
  const cultOuterBezel = new THREE.Mesh(
    new THREE.BoxGeometry(cultW + 0.14, cultH + 0.14, 0.08),
    materials.brass
  );
  cultOuterBezel.castShadow = true;
  cultGroup.add(cultOuterBezel);

  const cultInnerMat = new THREE.Mesh(
    new THREE.BoxGeometry(cultW + 0.02, cultH + 0.02, 0.085),
    materials.velvetMatting
  );
  cultGroup.add(cultInnerMat);

  const cultTex = createCulturalArtisticTexture(cultItem);
  const cultMat = new THREE.MeshStandardMaterial({
    map: cultTex,
    roughness: 0.28,
    metalness: 0.18,
  });
  const cultMesh = new THREE.Mesh(new THREE.PlaneGeometry(cultW, cultH), cultMat);
  cultMesh.position.z = 0.046;
  cultGroup.add(cultMesh);
  wallBGroup.add(cultGroup);

  const cultSpot = new THREE.SpotLight(0xfff6ec, 2.4, 12, Math.PI / 4, 0.45, 1.2);
  cultSpot.position.set(halfW - 3.2, 5.0, -6.0);
  cultSpot.target.position.set(halfW - 0.1, 2.3, -6.0);
  root.add(cultSpot);
  root.add(cultSpot.target);
  spotlights.push(cultSpot);

  interactiveExhibits.push({
    id: cultItem.id,
    mesh: cultMesh,
    titleVi: cultItem.titleVi,
    subtitleVi: cultItem.featuredRecordVi,
    category: 'cultural_artistic',
    dataPayload: cultItem,
  });

  // =========================================================================
  // Bay 6 (Z = -10.0m): EMPTY WALL SECTION B — DẤU ẤN TẠI CÁC SÂN CHƠI LIÊN TRƯỜNG VÀ CẤP NGÀNH
  // Width 2.6m, clearance to column -8.0 is 0.50m, clearance to column -12.0 is 0.50m
  // Clean text-based layout, does not require image uploads
  // =========================================================================
  const extItem = content.wallB.externalCompetitions;
  const extGroup = new THREE.Group();
  extGroup.position.set(-0.08, 2.3, -10.0);
  extGroup.rotation.y = -Math.PI / 2;

  const extW = 2.6;
  const extH = 2.4;
  const extOuterBezel = new THREE.Mesh(
    new THREE.BoxGeometry(extW + 0.14, extH + 0.14, 0.08),
    materials.brass
  );
  extOuterBezel.castShadow = true;
  extGroup.add(extOuterBezel);

  const extInnerMat = new THREE.Mesh(
    new THREE.BoxGeometry(extW + 0.02, extH + 0.02, 0.085),
    materials.velvetMatting
  );
  extGroup.add(extInnerMat);

  const extTex = createExternalCompetitionsTexture(extItem);
  const extMat = new THREE.MeshStandardMaterial({
    map: extTex,
    roughness: 0.28,
    metalness: 0.18,
  });
  const extMesh = new THREE.Mesh(new THREE.PlaneGeometry(extW, extH), extMat);
  extMesh.position.z = 0.046;
  extGroup.add(extMesh);
  wallBGroup.add(extGroup);

  const extSpot = new THREE.SpotLight(0xfff6ec, 2.4, 12, Math.PI / 4, 0.45, 1.2);
  extSpot.position.set(halfW - 3.2, 5.0, -10.0);
  extSpot.target.position.set(halfW - 0.1, 2.3, -10.0);
  root.add(extSpot);
  root.add(extSpot.target);
  spotlights.push(extSpot);

  interactiveExhibits.push({
    id: extItem.id,
    mesh: extMesh,
    titleVi: extItem.titleVi,
    subtitleVi: 'Thành tích tại các cuộc thi liên trường, cấp ngành và đại học',
    category: 'external_competitions',
    dataPayload: extItem,
  });

  root.add(wallBGroup);

  // =========================================================================
  // 5. CENTER FLOOR: FLUSH 60-YEAR COMMEMORATIVE MEDALLION (X = 0, Z = 0)
  // Flush with floor (Y = 0.012m), zero walking obstruction, open sightlines
  // =========================================================================
  const centerMedallionGroup = new THREE.Group();
  centerMedallionGroup.position.set(0, 0.01, 0);

  const brassTrimRing = new THREE.Mesh(
    new THREE.RingGeometry(1.58, 1.65, 48),
    materials.brass
  );
  brassTrimRing.rotation.x = -Math.PI / 2;
  brassTrimRing.receiveShadow = true;
  centerMedallionGroup.add(brassTrimRing);

  const daisTex = createCentralHonorDaisTexture();
  const daisMat = new THREE.MeshStandardMaterial({
    map: daisTex,
    roughness: 0.28,
    metalness: 0.55,
  });
  const daisMesh = new THREE.Mesh(new THREE.CircleGeometry(1.58, 48), daisMat);
  daisMesh.rotation.x = -Math.PI / 2;
  daisMesh.receiveShadow = true;
  centerMedallionGroup.add(daisMesh);

  root.add(centerMedallionGroup);

  interactiveExhibits.push({
    id: 'achievements_center_honor_dais',
    mesh: daisMesh,
    titleVi: 'BIỂU TƯỢNG BẢNG VÀNG 60 NĂM (1966–2026)',
    subtitleVi: 'Huy hiệu tôn vinh truyền thống vẻ vang 60 năm trường THPT A Trần Hưng Đạo.',
    category: 'central_dais',
    dataPayload: {
      thematicTitleVi: content.thematicTitleVi,
      coreMottoVi: content.coreMottoVi,
      totalAwardsNoteVi:
        'Trọn bộ 3 Huân chương Lao động (1991, 1996, 2000), Bằng khen Thủ tướng Chính phủ (2006), Huân chương Độc lập hạng Ba (2011), Cờ thi đua của Chính phủ (2025–2026) cùng bảng vàng thành tích HSG và nghiên cứu KHKT dẫn đầu toàn tỉnh.',
    },
  });

  // =========================================================================
  // 6. NORTH WALL: MONUMENTAL "ĐÀI VINH DANH" (Z = -halfL + 0.15m)
  // Replaces the empty black display with a grand illuminated showcase!
  // =========================================================================
  const daiVinhDanhGroup = new THREE.Group();
  daiVinhDanhGroup.position.set(0, 0, -halfL + 0.15);

  const dvdW = 12.0;
  const dvdH = 4.0;

  // Outer Gilded Heritage Frame
  const dvdOuterFrame = new THREE.Mesh(
    new THREE.BoxGeometry(dvdW + 0.25, dvdH + 0.25, 0.1),
    materials.brass
  );
  dvdOuterFrame.position.y = 2.6;
  dvdOuterFrame.castShadow = true;
  daiVinhDanhGroup.add(dvdOuterFrame);

  // Inner Velvet Backing
  const dvdVelvet = new THREE.Mesh(
    new THREE.BoxGeometry(dvdW + 0.04, dvdH + 0.04, 0.105),
    materials.velvetMatting
  );
  dvdVelvet.position.y = 2.6;
  daiVinhDanhGroup.add(dvdVelvet);

  // Grand Canvas Texture
  const dvdTex = createDaiVinhDanhTexture();
  const dvdMat = new THREE.MeshStandardMaterial({
    map: dvdTex,
    roughness: 0.28,
    metalness: 0.15,
  });
  const dvdMesh = new THREE.Mesh(new THREE.PlaneGeometry(dvdW, dvdH), dvdMat);
  dvdMesh.position.set(0, 2.6, 0.055);
  daiVinhDanhGroup.add(dvdMesh);

  // Top Motto Arch Trim
  const dvdTopTrim = new THREE.Mesh(
    new THREE.BoxGeometry(10.5, 0.25, 0.12),
    materials.brass
  );
  dvdTopTrim.position.set(0, 4.8, 0.04);
  daiVinhDanhGroup.add(dvdTopTrim);

  // Dedicated Grand Spotlights for Đài Vinh Danh
  const dvdSpotL = new THREE.SpotLight(0xfff8ee, 3.2, 16, Math.PI / 4, 0.45, 1.2);
  dvdSpotL.position.set(-3.5, 5.2, -halfL + 4.5);
  dvdSpotL.target.position.set(-2.5, 2.6, -halfL + 0.15);
  root.add(dvdSpotL);
  root.add(dvdSpotL.target);
  spotlights.push(dvdSpotL);

  const dvdSpotR = new THREE.SpotLight(0xfff8ee, 3.2, 16, Math.PI / 4, 0.45, 1.2);
  dvdSpotR.position.set(3.5, 5.2, -halfL + 4.5);
  dvdSpotR.target.position.set(2.5, 2.6, -halfL + 0.15);
  root.add(dvdSpotR);
  root.add(dvdSpotR.target);
  spotlights.push(dvdSpotR);

  root.add(daiVinhDanhGroup);

  interactiveExhibits.push({
    id: 'achievements_dai_vinh_danh',
    mesh: dvdMesh,
    titleVi: 'ĐÀI VINH DANH • DANH HIỆU & THÀNH TỰU TIÊU BIỂU (1966–2026)',
    subtitleVi: 'Khu vực vinh danh cao quý tổng hợp các danh hiệu tiêu biểu nhất của trường qua 60 năm.',
    category: 'dai_vinh_danh',
    dataPayload: {
      thematicTitleVi: 'ĐÀI VINH DANH • TRUYỀN THỐNG 60 NĂM',
      descriptionVi:
        'Đài Vinh Danh ghi nhận các danh hiệu cao quý nhất: 3 Huân chương Lao động (1991, 1996, 2000), Bằng khen Thủ tướng Chính phủ (2006), Huân chương Độc lập hạng Ba (2011), Cờ Thi đua của Chính phủ (2025–2026) cùng kết quả bứt phá thi HSG Tỉnh và kỳ thi Tốt nghiệp THPT 2026.',
    },
  });

  // =========================================================================
  // 7. AMBIENT & GALLERY LIGHTING (Warm Heritage Balance)
  // =========================================================================
  const ambientLight = new THREE.AmbientLight(0xfff8f2, 1.05);
  root.add(ambientLight);

  const mainHemi = new THREE.HemisphereLight(0xfff4e6, 0x14100c, 0.9);
  root.add(mainHemi);

  return {
    group: root,
    interactiveExhibits,
    centerDaisMesh: daisMesh,
    daiVinhDanhMesh: dvdMesh,
    ambientLights: [ambientLight, mainHemi],
    spotlights,
  };
}
