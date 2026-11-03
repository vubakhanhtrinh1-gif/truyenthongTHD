/**
 * 3D High-Fidelity Monument & Statue of Duc Thanh Tran (Hung Dao Dai Vuong Tran Quoc Tuan)
 * Centerpiece for Zone 2: Development Room (1974–2026) — Inaugurated August 28, 2006.
 *
 * Sculptural Features:
 * - Multi-tiered Octagonal Lotus Pedestal with Bronze Inscription Plaque
 * - Heroic Stance: Anchored stance facing south toward gallery visitors
 * - Right Hand: Holding high the unrolled sacred scroll of "Hịch Tướng Sĩ"
 * - Left Hand: Rested authoritatively upon the pommel of the Sword of Command
 * - Royal Regalia: Dragon-crest war helmet, long flowing sage beard, cuirass with
 *   Gilded Heart-Guard Mirror (Hộ Tâm Kính), draconic pauldrons, and windblown royal cloak.
 */

import * as THREE from 'three';
import { DevelopmentMaterialSet } from '../materials/DevelopmentMaterials';
import {
  createTranHungDaoPlaqueTexture,
  createHichTuongSiScrollTexture,
} from '../textures/DevelopmentProceduralTextures';

export interface TranHungDaoStatueResult {
  statueGroup: THREE.Group;
  interactiveMesh: THREE.Mesh;
  statueSpotlight: THREE.SpotLight;
}

export function createTranHungDaoStatue(materials: DevelopmentMaterialSet): TranHungDaoStatueResult {
  const statueGroup = new THREE.Group();
  statueGroup.name = 'TranHungDaoMonumentGroup';

  const bronzeMat = materials.statuePatinatedBronze;
  const highlightBronzeMat = materials.statuePolishedBronze;
  const goldMat = materials.statueGildedGold;
  const graniteMat = materials.statueDarkGranite;
  const silkRedMat = materials.statueCrimsonSilk;

  // =========================================================================
  // 1. MULTI-TIERED MONUMENTAL PEDESTAL (Bệ Đài Sen Tam Cấp)
  // =========================================================================
  const pedestalGroup = new THREE.Group();
  pedestalGroup.name = 'MonumentPedestal';

  // Tier 1: Ground Octagonal Base (R=1.75m, H=0.22m)
  const tier1Geo = new THREE.CylinderGeometry(1.75, 1.82, 0.22, 8);
  const tier1Mesh = new THREE.Mesh(tier1Geo, graniteMat);
  tier1Mesh.position.y = 0.11;
  tier1Mesh.receiveShadow = true;
  pedestalGroup.add(tier1Mesh);

  // Tier 1 Gilded Edge Trim
  const tier1TrimGeo = new THREE.CylinderGeometry(1.83, 1.83, 0.03, 8);
  const tier1Trim = new THREE.Mesh(tier1TrimGeo, goldMat);
  tier1Trim.position.y = 0.21;
  pedestalGroup.add(tier1Trim);

  // Tier 2: Mid Octagonal Plinth (R=1.45m, H=0.20m)
  const tier2Geo = new THREE.CylinderGeometry(1.45, 1.55, 0.20, 8);
  const tier2Mesh = new THREE.Mesh(tier2Geo, materials.pedestalStone);
  tier2Mesh.position.y = 0.32;
  tier2Mesh.receiveShadow = true;
  pedestalGroup.add(tier2Mesh);

  // Tier 3: Main Pedestal Body Column (R=1.20m, H=0.48m)
  const tier3Geo = new THREE.CylinderGeometry(1.20, 1.25, 0.48, 8);
  const tier3Mesh = new THREE.Mesh(tier3Geo, graniteMat);
  tier3Mesh.position.y = 0.66;
  tier3Mesh.receiveShadow = true;
  pedestalGroup.add(tier3Mesh);

  // Tier 3 Gold Corner Fillets / Astragal
  const astragalGeo = new THREE.CylinderGeometry(1.24, 1.24, 0.04, 8);
  const astragalMesh = new THREE.Mesh(astragalGeo, goldMat);
  astragalMesh.position.y = 0.88;
  pedestalGroup.add(astragalMesh);

  // =========================================================================
  // 2. TRAN DYNASTY LOTUS THRONE (Đài Sen Chạm Cánh Kép Thời Trần)
  // =========================================================================
  const lotusGroup = new THREE.Group();
  lotusGroup.position.y = 0.90;

  // Lotus Base Core
  const lotusCoreGeo = new THREE.CylinderGeometry(1.15, 1.05, 0.18, 32);
  const lotusCore = new THREE.Mesh(lotusCoreGeo, highlightBronzeMat);
  lotusGroup.add(lotusCore);

  // 24 Stylized Tran-Dynasty Double Lotus Petals wrapping the circumference
  const petalCount = 24;
  const petalGeo = new THREE.BoxGeometry(0.22, 0.24, 0.06);
  const petalTipGeo = new THREE.ConeGeometry(0.11, 0.12, 4);

  for (let i = 0; i < petalCount; i++) {
    const angle = (i / petalCount) * Math.PI * 2;
    const r = 1.14;
    const px = Math.cos(angle) * r;
    const pz = Math.sin(angle) * r;

    const singlePetal = new THREE.Group();
    singlePetal.position.set(px, 0.04, pz);
    singlePetal.rotation.y = -angle + Math.PI / 2;
    singlePetal.rotation.x = -0.22; // Petals splay gracefully outwards

    const petalMesh = new THREE.Mesh(petalGeo, bronzeMat);
    const petalTip = new THREE.Mesh(petalTipGeo, goldMat);
    petalTip.position.y = 0.14;
    petalTip.rotation.y = Math.PI / 4;

    singlePetal.add(petalMesh);
    singlePetal.add(petalTip);
    lotusGroup.add(singlePetal);
  }

  // Top Pedestal Footplate (Where statue feet stand securely)
  const footPlateGeo = new THREE.CylinderGeometry(1.05, 1.10, 0.08, 32);
  const footPlate = new THREE.Mesh(footPlateGeo, bronzeMat);
  footPlate.position.y = 0.12;
  footPlate.receiveShadow = true;
  lotusGroup.add(footPlate);

  pedestalGroup.add(lotusGroup);

  // =========================================================================
  // 3. FRONT MEMORIAL BRONZE PLAQUE (Bia Kỷ Niệm 2006 Hướng Nam)
  // =========================================================================
  const plaqueTex = createTranHungDaoPlaqueTexture();
  const plaqueMat = new THREE.MeshStandardMaterial({
    map: plaqueTex,
    roughness: 0.28,
    metalness: 0.75,
  });
  const plaqueGeo = new THREE.PlaneGeometry(1.35, 0.44);
  const plaqueMesh = new THREE.Mesh(plaqueGeo, plaqueMat);
  // Position on South face of the octagonal pedestal
  plaqueMesh.position.set(0, 0.65, 1.22);
  plaqueMesh.rotation.x = -0.08; // slight upward tilt for comfortable reading angle
  pedestalGroup.add(plaqueMesh);

  // Plaque Bronze Frame
  const frameGeo = new THREE.BoxGeometry(1.41, 0.50, 0.03);
  const frameMesh = new THREE.Mesh(frameGeo, goldMat);
  frameMesh.position.set(0, 0.65, 1.205);
  frameMesh.rotation.x = -0.08;
  pedestalGroup.add(frameMesh);

  statueGroup.add(pedestalGroup);

  // =========================================================================
  // 4. STATUE FIGURE OF HUNG DAO DAI VUONG TRAN QUOC TUAN (Tượng Đức Thánh Trần)
  // Base standing height Y starts at 1.06m (top of lotus footplate)
  // Total statue height ~ 2.35m (reaching Y ~ 3.41m)
  // =========================================================================
  const figureGroup = new THREE.Group();
  figureGroup.name = 'TranHungDaoFigure';
  figureGroup.position.set(0, 1.06, 0);

  // -------------------------------------------------------------------------
  // 4.1 FEET & VIETNAMESE MILITARY BOOTS (Chiến Hài Thời Trần)
  // -------------------------------------------------------------------------
  // Left Foot: Forward left (leading foot)
  const leftBoot = new THREE.Group();
  leftBoot.position.set(-0.24, 0.06, 0.16);
  leftBoot.rotation.y = 0.18;

  const bootSoleGeo = new THREE.BoxGeometry(0.18, 0.08, 0.38);
  const bootSoleL = new THREE.Mesh(bootSoleGeo, highlightBronzeMat);
  leftBoot.add(bootSoleL);

  const toeTipGeo = new THREE.ConeGeometry(0.09, 0.14, 8);
  const toeTipL = new THREE.Mesh(toeTipGeo, goldMat);
  toeTipL.position.set(0, 0.04, 0.20);
  toeTipL.rotation.x = Math.PI / 3; // traditional upward curved toe
  leftBoot.add(toeTipL);

  const leftShinGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.45, 16);
  const leftShin = new THREE.Mesh(leftShinGeo, bronzeMat);
  leftShin.position.set(0, 0.28, -0.02);
  leftBoot.add(leftShin);

  // Gilded Shin Guard (Hộ cẳng chân)
  const leftGreaveGeo = new THREE.CylinderGeometry(0.115, 0.095, 0.38, 16, 1, false, 0, Math.PI);
  const leftGreave = new THREE.Mesh(leftGreaveGeo, goldMat);
  leftGreave.position.set(0, 0.28, -0.02);
  leftGreave.rotation.y = Math.PI / 2;
  leftBoot.add(leftGreave);

  figureGroup.add(leftBoot);

  // Right Foot: Firmly anchored back right
  const rightBoot = new THREE.Group();
  rightBoot.position.set(0.26, 0.06, -0.12);
  rightBoot.rotation.y = -0.22;

  const bootSoleR = new THREE.Mesh(bootSoleGeo, highlightBronzeMat);
  rightBoot.add(bootSoleR);

  const toeTipR = new THREE.Mesh(toeTipGeo, goldMat);
  toeTipR.position.set(0, 0.04, 0.20);
  toeTipR.rotation.x = Math.PI / 3;
  rightBoot.add(toeTipR);

  const rightShinGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.45, 16);
  const rightShin = new THREE.Mesh(rightShinGeo, bronzeMat);
  rightShin.position.set(0, 0.28, -0.02);
  rightBoot.add(rightShin);

  const rightGreave = new THREE.Mesh(leftGreaveGeo, goldMat);
  rightGreave.position.set(0, 0.28, -0.02);
  rightGreave.rotation.y = Math.PI / 2;
  rightBoot.add(rightGreave);

  figureGroup.add(rightBoot);

  // -------------------------------------------------------------------------
  // 4.2 LOWER WARRIOR ROBES & DRAPERY (Chiến Bào Hạ Thân)
  // -------------------------------------------------------------------------
  const lowerRobeGroup = new THREE.Group();
  lowerRobeGroup.position.set(0, 0.65, 0);

  // Outer silk skirt draping over legs
  const skirtGeo = new THREE.CylinderGeometry(0.38, 0.62, 0.68, 20);
  const skirtMesh = new THREE.Mesh(skirtGeo, bronzeMat);
  skirtMesh.castShadow = true;
  lowerRobeGroup.add(skirtMesh);

  // Pleated fabric folds around lower hem
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 1.5 - Math.PI * 0.75;
    const foldGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.65, 8);
    const foldMesh = new THREE.Mesh(foldGeo, highlightBronzeMat);
    foldMesh.position.set(Math.sin(angle) * 0.44, 0, Math.cos(angle) * 0.44);
    foldMesh.rotation.z = Math.sin(angle) * 0.12;
    lowerRobeGroup.add(foldMesh);
  }

  // Front Center Embroidered Silk Sash (Dải lụa thắt đai buông thả)
  const sashGeo = new THREE.BoxGeometry(0.20, 0.72, 0.05);
  const sashMesh = new THREE.Mesh(sashGeo, silkRedMat);
  sashMesh.position.set(0, -0.08, 0.42);
  lowerRobeGroup.add(sashMesh);

  // Sash Gold Embroidery Edge & Tassel
  const sashBorderGeo = new THREE.BoxGeometry(0.22, 0.04, 0.06);
  const sashBorder = new THREE.Mesh(sashBorderGeo, goldMat);
  sashBorder.position.set(0, -0.42, 0.42);
  lowerRobeGroup.add(sashBorder);

  const tasselGeo = new THREE.ConeGeometry(0.06, 0.14, 8);
  const tassel = new THREE.Mesh(tasselGeo, goldMat);
  tassel.position.set(0, -0.50, 0.42);
  tassel.rotation.x = Math.PI;
  lowerRobeGroup.add(tassel);

  figureGroup.add(lowerRobeGroup);

  // -------------------------------------------------------------------------
  // 4.3 WARRIOR BELT & TIGER/DRAGON BUCKLE (Đai Ngọc & Khóa Đầu Hổ Phù)
  // -------------------------------------------------------------------------
  const beltGroup = new THREE.Group();
  beltGroup.position.set(0, 1.02, 0);

  const beltGeo = new THREE.CylinderGeometry(0.39, 0.41, 0.12, 24);
  const beltMesh = new THREE.Mesh(beltGeo, highlightBronzeMat);
  beltGroup.add(beltMesh);

  // Gilded Belt Trims
  const beltTrimUpper = new THREE.Mesh(new THREE.TorusGeometry(0.395, 0.015, 8, 32), goldMat);
  beltTrimUpper.rotation.x = Math.PI / 2;
  beltTrimUpper.position.y = 0.05;
  beltGroup.add(beltTrimUpper);

  const beltTrimLower = new THREE.Mesh(new THREE.TorusGeometry(0.405, 0.015, 8, 32), goldMat);
  beltTrimLower.rotation.x = Math.PI / 2;
  beltTrimLower.position.y = -0.05;
  beltGroup.add(beltTrimLower);

  // Central Buckle: Tiger/Dragon Face (Đầu Hổ Phù Thời Trần)
  const buckleFace = new THREE.Group();
  buckleFace.position.set(0, 0, 0.41);

  const buckleMaskGeo = new THREE.DodecahedronGeometry(0.12, 1);
  const buckleMask = new THREE.Mesh(buckleMaskGeo, goldMat);
  buckleFace.add(buckleMask);

  // Buckle Ring holding the sash
  const buckleRingGeo = new THREE.TorusGeometry(0.08, 0.02, 12, 24);
  const buckleRing = new THREE.Mesh(buckleRingGeo, goldMat);
  buckleRing.position.set(0, -0.08, 0.03);
  buckleFace.add(buckleRing);

  beltGroup.add(buckleFace);
  figureGroup.add(beltGroup);

  // -------------------------------------------------------------------------
  // 4.4 TORSO, CUIRASS & HEART-GUARD MIRROR (Giáp Hộ Thân & Hộ Tâm Kính)
  // -------------------------------------------------------------------------
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 1.35, 0);

  // Muscular Cuirass Body
  const cuirassGeo = new THREE.CylinderGeometry(0.42, 0.36, 0.58, 20);
  const cuirassMesh = new THREE.Mesh(cuirassGeo, bronzeMat);
  cuirassMesh.castShadow = true;
  torsoGroup.add(cuirassMesh);

  // Layered scale pattern plates on torso (Giáp vảy cá thời Trần)
  for (let r = 0; r < 4; r++) {
    const scaleY = -0.18 + r * 0.11;
    const ringGeo = new THREE.TorusGeometry(0.37 + r * 0.015, 0.018, 8, 24);
    const scaleRing = new THREE.Mesh(ringGeo, highlightBronzeMat);
    scaleRing.rotation.x = Math.PI / 2;
    scaleRing.position.y = scaleY;
    torsoGroup.add(scaleRing);
  }

  // HỘ TÂM KÍNH (Heart-Guard Mirror): Iconic gilded circular plate on chest center
  const mirrorGroup = new THREE.Group();
  mirrorGroup.position.set(0, 0.06, 0.39);

  // Outer Gilded Sunburst Ring
  const mirrorOuterGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.03, 32);
  const mirrorOuter = new THREE.Mesh(mirrorOuterGeo, goldMat);
  mirrorOuter.rotation.x = Math.PI / 2;
  mirrorGroup.add(mirrorOuter);

  // Convex Bronze Core Mirror (catching dramatic specular reflections)
  const mirrorCoreGeo = new THREE.SphereGeometry(0.14, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
  const mirrorCore = new THREE.Mesh(mirrorCoreGeo, goldMat);
  mirrorCore.rotation.x = Math.PI / 2;
  mirrorCore.position.z = 0.015;
  mirrorGroup.add(mirrorCore);

  // Tran Dragon Emblem Relief in center of mirror
  const emblemGeo = new THREE.TorusGeometry(0.07, 0.016, 8, 24);
  const emblemMesh = new THREE.Mesh(emblemGeo, materials.statuePatinatedBronze);
  emblemMesh.position.z = 0.06;
  mirrorGroup.add(emblemMesh);

  torsoGroup.add(mirrorGroup);

  // Gorget & Neck Armor (Giáp hộ cảnh)
  const gorgetGeo = new THREE.CylinderGeometry(0.24, 0.34, 0.14, 16);
  const gorgetMesh = new THREE.Mesh(gorgetGeo, goldMat);
  gorgetMesh.position.y = 0.32;
  torsoGroup.add(gorgetMesh);

  figureGroup.add(torsoGroup);

  // -------------------------------------------------------------------------
  // 4.5 DRACONIC SHOULDER GUARDS / PAULDRONS (Giáp Vai Hộ Kiên Đầu Lân)
  // -------------------------------------------------------------------------
  const leftPauldron = new THREE.Group();
  leftPauldron.position.set(-0.46, 1.54, 0);

  const pauldronGeo = new THREE.SphereGeometry(0.19, 16, 16, 0, Math.PI, 0, Math.PI);
  const pauldronMeshL = new THREE.Mesh(pauldronGeo, goldMat);
  pauldronMeshL.rotation.z = -Math.PI / 2.8;
  leftPauldron.add(pauldronMeshL);

  // Dragon horn flare
  const hornGeo = new THREE.ConeGeometry(0.06, 0.18, 8);
  const hornL = new THREE.Mesh(hornGeo, highlightBronzeMat);
  hornL.position.set(-0.10, 0.14, 0);
  hornL.rotation.z = Math.PI / 4;
  leftPauldron.add(hornL);

  figureGroup.add(leftPauldron);

  const rightPauldron = new THREE.Group();
  rightPauldron.position.set(0.46, 1.54, 0);

  const pauldronMeshR = new THREE.Mesh(pauldronGeo, goldMat);
  pauldronMeshR.rotation.z = Math.PI / 2.8;
  rightPauldron.add(pauldronMeshR);

  const hornR = new THREE.Mesh(hornGeo, highlightBronzeMat);
  hornR.position.set(0.10, 0.14, 0);
  hornR.rotation.z = -Math.PI / 4;
  rightPauldron.add(hornR);

  figureGroup.add(rightPauldron);

  // -------------------------------------------------------------------------
  // 4.6 WINDBLOWN ROYAL CLOAK (Chiến Bào Phi Phong Lộng Gió)
  // Attached at shoulders, billowing backwards and to the left
  // -------------------------------------------------------------------------
  const capeGroup = new THREE.Group();
  capeGroup.position.set(0, 1.48, -0.22);

  // Upper cape collar fold
  const capeCollarGeo = new THREE.TorusGeometry(0.38, 0.08, 12, 24, Math.PI);
  const capeCollar = new THREE.Mesh(capeCollarGeo, bronzeMat);
  capeCollar.rotation.x = Math.PI / 2;
  capeCollar.position.y = 0.02;
  capeGroup.add(capeCollar);

  // Main billowing cape sheet modeled in curved cascading sections
  for (let s = 0; s < 5; s++) {
    const sweepZ = -0.15 - s * 0.14;
    const sweepX = -0.05 - s * 0.08; // dynamic billow towards the left in ocean wind
    const capeTierGeo = new THREE.CylinderGeometry(
      0.44 + s * 0.10,
      0.54 + s * 0.12,
      0.30,
      16,
      1,
      false,
      Math.PI * 0.7,
      Math.PI * 1.0
    );
    const capeTierMesh = new THREE.Mesh(capeTierGeo, bronzeMat);
    capeTierMesh.position.set(sweepX, -s * 0.26, sweepZ);
    capeTierMesh.rotation.y = Math.PI * 0.85;
    capeTierMesh.castShadow = true;
    capeGroup.add(capeTierMesh);
  }

  figureGroup.add(capeGroup);

  // -------------------------------------------------------------------------
  // 4.7 LEFT ARM & THE SWORD OF COMMAND (Tay Trái Tì Đốc Bảo Kiếm)
  // -------------------------------------------------------------------------
  const leftArmGroup = new THREE.Group();
  leftArmGroup.position.set(-0.42, 1.50, 0);

  // Upper arm angled down and back
  const upperArmGeo = new THREE.CylinderGeometry(0.10, 0.09, 0.36, 12);
  const upperArmL = new THREE.Mesh(upperArmGeo, bronzeMat);
  upperArmL.position.set(-0.06, -0.16, -0.04);
  upperArmL.rotation.z = 0.28;
  upperArmL.rotation.x = -0.12;
  leftArmGroup.add(upperArmL);

  // Forearm angled inward toward sword hilt
  const forearmGeo = new THREE.CylinderGeometry(0.09, 0.08, 0.34, 12);
  const forearmL = new THREE.Mesh(forearmGeo, bronzeMat);
  forearmL.position.set(0.04, -0.42, 0.12);
  forearmL.rotation.z = -0.42;
  forearmL.rotation.x = 0.45;
  leftArmGroup.add(forearmL);

  // Bracer (Giáp hộ uyển cổ tay)
  const bracerGeo = new THREE.CylinderGeometry(0.095, 0.085, 0.20, 12);
  const bracerL = new THREE.Mesh(bracerGeo, goldMat);
  bracerL.position.set(0.04, -0.42, 0.12);
  bracerL.rotation.z = -0.42;
  bracerL.rotation.x = 0.45;
  leftArmGroup.add(bracerL);

  // Left Hand: Firmly grasping the sword pommel
  const handGeo = new THREE.SphereGeometry(0.08, 12, 12);
  const handL = new THREE.Mesh(handGeo, highlightBronzeMat);
  handL.position.set(0.14, -0.52, 0.24);
  leftArmGroup.add(handL);

  // THƯỢNG PHƯƠNG BẢO KIẾM (The Sacred Sword of Command)
  const swordGroup = new THREE.Group();
  swordGroup.position.set(0.14, -0.52, 0.24);
  swordGroup.rotation.z = 0.38; // Angled down along left hip
  swordGroup.rotation.x = 0.18;

  // Pommel (Đốc Kiếm)
  const pommelGeo = new THREE.SphereGeometry(0.06, 12, 12);
  const pommel = new THREE.Mesh(pommelGeo, goldMat);
  swordGroup.add(pommel);

  // Sword Grip (Chuôi kiếm)
  const gripGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.20, 10);
  const grip = new THREE.Mesh(gripGeo, highlightBronzeMat);
  grip.position.y = -0.10;
  swordGroup.add(grip);

  // Sword Crossguard (Ngăn kiếm hình cánh rồng thời Trần)
  const guardGeo = new THREE.BoxGeometry(0.18, 0.04, 0.06);
  const guard = new THREE.Mesh(guardGeo, goldMat);
  guard.position.y = -0.21;
  swordGroup.add(guard);

  // Scabbard (Bao kiếm thon thả dài chạm hoa văn)
  const scabbardGeo = new THREE.CylinderGeometry(0.042, 0.028, 1.15, 8);
  const scabbard = new THREE.Mesh(scabbardGeo, bronzeMat);
  scabbard.position.y = -0.80;
  swordGroup.add(scabbard);

  // Scabbard Gilded Bands (Vòng nẹp vàng bao kiếm)
  for (let b = 0; b < 3; b++) {
    const bandGeo = new THREE.CylinderGeometry(0.046, 0.046, 0.035, 8);
    const band = new THREE.Mesh(bandGeo, goldMat);
    band.position.y = -0.45 - b * 0.28;
    swordGroup.add(band);
  }

  // Sword Chape (Chóp mũi bao kiếm)
  const chapeGeo = new THREE.ConeGeometry(0.034, 0.10, 8);
  const chape = new THREE.Mesh(chapeGeo, goldMat);
  chape.position.y = -1.42;
  chape.rotation.x = Math.PI;
  swordGroup.add(chape);

  // Sword Scarlet Silk Tassel (Tua kiếm đỏ hoàng gia)
  const swordTasselGeo = new THREE.CylinderGeometry(0.015, 0.035, 0.35, 8);
  const swordTassel = new THREE.Mesh(swordTasselGeo, silkRedMat);
  swordTassel.position.set(-0.04, -0.22, 0.02);
  swordTassel.rotation.z = -0.15;
  swordGroup.add(swordTassel);

  leftArmGroup.add(swordGroup);
  figureGroup.add(leftArmGroup);

  // -------------------------------------------------------------------------
  // 4.8 RIGHT ARM & SACRED SCROLL OF HỊCH TƯỚNG SĨ (Tay Phải Nâng Cuộn Hịch)
  // -------------------------------------------------------------------------
  const rightArmGroup = new THREE.Group();
  rightArmGroup.position.set(0.42, 1.50, 0);

  // Upper arm angled forward
  const upperArmR = new THREE.Mesh(upperArmGeo, bronzeMat);
  upperArmR.position.set(0.08, -0.14, 0.08);
  upperArmR.rotation.z = -0.32;
  upperArmR.rotation.x = 0.52;
  rightArmGroup.add(upperArmR);

  // Forearm raised high and forward presenting the proclamation
  const forearmR = new THREE.Mesh(forearmGeo, bronzeMat);
  forearmR.position.set(-0.02, -0.06, 0.32);
  forearmR.rotation.z = 0.22;
  forearmR.rotation.x = 1.15;
  rightArmGroup.add(forearmR);

  // Right Bracer
  const bracerR = new THREE.Mesh(bracerGeo, goldMat);
  bracerR.position.set(-0.02, -0.06, 0.32);
  bracerR.rotation.z = 0.22;
  bracerR.rotation.x = 1.15;
  rightArmGroup.add(bracerR);

  // Right Hand: Grasping the proclamation scroll
  const handR = new THREE.Mesh(handGeo, highlightBronzeMat);
  handR.position.set(-0.06, 0.06, 0.48);
  rightArmGroup.add(handR);

  // CUỘN HỊCH TƯỚNG SĨ (The Proclamation to the Officers)
  const scrollGroup = new THREE.Group();
  scrollGroup.position.set(-0.06, 0.08, 0.50);
  scrollGroup.rotation.y = -0.25;
  scrollGroup.rotation.z = 0.15;

  // Main Scroll Roll Cylinder
  const scrollTex = createHichTuongSiScrollTexture();
  const scrollMat = new THREE.MeshStandardMaterial({
    map: scrollTex,
    roughness: 0.32,
    metalness: 0.20,
  });

  const scrollCylGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.42, 16);
  const scrollCyl = new THREE.Mesh(scrollCylGeo, scrollMat);
  scrollCyl.rotation.z = Math.PI / 3;
  scrollGroup.add(scrollCyl);

  // Scroll Gilded End Caps (Hai đầu bọc vàng cuộn thư)
  const capGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.035, 16);
  const capTop = new THREE.Mesh(capGeo, goldMat);
  capTop.position.set(0.18, 0.10, 0);
  capTop.rotation.z = Math.PI / 3;
  scrollGroup.add(capTop);

  const capBottom = new THREE.Mesh(capGeo, goldMat);
  capBottom.position.set(-0.18, -0.10, 0);
  capBottom.rotation.z = Math.PI / 3;
  scrollGroup.add(capBottom);

  // Partially unrolled parchment flap showing the calligraphic text
  const flapGeo = new THREE.PlaneGeometry(0.24, 0.32);
  const flapMesh = new THREE.Mesh(flapGeo, scrollMat);
  flapMesh.position.set(0.02, -0.12, 0.06);
  flapMesh.rotation.x = -0.32;
  flapMesh.rotation.y = 0.18;
  scrollGroup.add(flapMesh);

  rightArmGroup.add(scrollGroup);
  figureGroup.add(rightArmGroup);

  // -------------------------------------------------------------------------
  // 4.9 HEAD, SAGE BEARD & TRAN DYNASTY BATTLE HELMET (Đầu, Râu Dài & Mũ Trụ)
  // -------------------------------------------------------------------------
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.84, 0.04);

  // Neck
  const neckGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.18, 16);
  const neckMesh = new THREE.Mesh(neckGeo, highlightBronzeMat);
  neckMesh.position.y = -0.06;
  headGroup.add(neckMesh);

  // Noble Visage & Chin
  const headGeo = new THREE.BoxGeometry(0.24, 0.28, 0.26);
  const headMesh = new THREE.Mesh(headGeo, highlightBronzeMat);
  headMesh.position.y = 0.10;
  headMesh.castShadow = true;
  headGroup.add(headMesh);

  // Defined Cheekbones & Nose
  const noseGeo = new THREE.ConeGeometry(0.04, 0.12, 6);
  const noseMesh = new THREE.Mesh(noseGeo, highlightBronzeMat);
  noseMesh.position.set(0, 0.09, 0.17);
  noseMesh.rotation.x = -Math.PI / 4;
  headGroup.add(noseMesh);

  // FLOWING SAGE BEARD (Chòm Râu Dài Ba Chòm Uy Dũng Của Đức Thánh Trần)
  const beardGroup = new THREE.Group();
  beardGroup.position.set(0, 0, 0.14);

  // Center flowing beard strand
  const mainBeardGeo = new THREE.ConeGeometry(0.08, 0.42, 8);
  const mainBeard = new THREE.Mesh(mainBeardGeo, bronzeMat);
  mainBeard.position.set(0, -0.18, 0.02);
  mainBeard.rotation.x = 0.18;
  beardGroup.add(mainBeard);

  // Left & right beard whiskers
  const whiskerGeo = new THREE.ConeGeometry(0.035, 0.32, 6);
  const whiskerL = new THREE.Mesh(whiskerGeo, bronzeMat);
  whiskerL.position.set(-0.06, -0.14, 0.01);
  whiskerL.rotation.z = -0.15;
  whiskerL.rotation.x = 0.15;
  beardGroup.add(whiskerL);

  const whiskerR = new THREE.Mesh(whiskerGeo, bronzeMat);
  whiskerR.position.set(0.06, -0.14, 0.01);
  whiskerR.rotation.z = 0.15;
  whiskerR.rotation.x = 0.15;
  beardGroup.add(whiskerR);

  // Moustache curling along upper lip
  const stacheGeo = new THREE.TorusGeometry(0.06, 0.018, 6, 12, Math.PI);
  const stache = new THREE.Mesh(stacheGeo, bronzeMat);
  stache.position.set(0, 0.03, 0.04);
  stache.rotation.x = Math.PI * 0.9;
  beardGroup.add(stache);

  headGroup.add(beardGroup);

  // TRAN DYNASTY WARRIOR HELMET (Mũ Trụ Khôi Giáp Thời Trần)
  const helmetGroup = new THREE.Group();
  helmetGroup.position.set(0, 0.18, 0);

  // Helmet Bowl Dome
  const helmetDomeGeo = new THREE.SphereGeometry(0.17, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const helmetDome = new THREE.Mesh(helmetDomeGeo, bronzeMat);
  helmetGroup.add(helmetDome);

  // Gilded Forehead Lotus Band (Vành Kim Khôi Chạm Cánh Sen)
  const lotusBandGeo = new THREE.CylinderGeometry(0.175, 0.18, 0.06, 24, 1, true);
  const lotusBand = new THREE.Mesh(lotusBandGeo, goldMat);
  lotusBand.position.y = 0.01;
  helmetGroup.add(lotusBand);

  // Cheek & Ear Guards (Giáp Hộ Nhĩ Hai Bên Tai)
  const earGuardGeo = new THREE.BoxGeometry(0.04, 0.18, 0.12);
  const earGuardL = new THREE.Mesh(earGuardGeo, goldMat);
  earGuardL.position.set(-0.16, -0.06, 0);
  earGuardL.rotation.z = -0.12;
  helmetGroup.add(earGuardL);

  const earGuardR = new THREE.Mesh(earGuardGeo, goldMat);
  earGuardR.position.set(0.16, -0.06, 0);
  earGuardR.rotation.z = 0.12;
  helmetGroup.add(earGuardR);

  // Pointed Helmet Crest Spire (Chóp Mũ Trụ Chiến Tướng)
  const crestGeo = new THREE.ConeGeometry(0.04, 0.24, 12);
  const crestMesh = new THREE.Mesh(crestGeo, goldMat);
  crestMesh.position.y = 0.24;
  helmetGroup.add(crestMesh);

  // Crest Red Feathers / Tassel (Chỏm Lông Vũ Đỏ Trên Đỉnh Mũ)
  const featherGeo = new THREE.ConeGeometry(0.03, 0.16, 8);
  const featherMesh = new THREE.Mesh(featherGeo, silkRedMat);
  featherMesh.position.set(0, 0.32, -0.04);
  featherMesh.rotation.x = -0.28;
  helmetGroup.add(featherMesh);

  headGroup.add(helmetGroup);
  figureGroup.add(headGroup);

  statueGroup.add(figureGroup);

  // =========================================================================
  // 5. INVISIBLE INTERACTIVE BOUNDING HIT-BOX (For Raycaster Clicks)
  // =========================================================================
  const hitGeo = new THREE.CylinderGeometry(1.4, 1.7, 3.4, 16);
  const hitMat = new THREE.MeshBasicMaterial({
    visible: false,
  });
  const interactiveMesh = new THREE.Mesh(hitGeo, hitMat);
  interactiveMesh.position.set(0, 1.7, 0);
  interactiveMesh.name = 'TranHungDaoInteractiveHotspot';
  statueGroup.add(interactiveMesh);

  // =========================================================================
  // 6. DEDICATED MUSEUM GALLERY SPOTLIGHT (Đèn Chiếu Tượng Điêu Khắc)
  // Warm dramatic illumination highlighting bronze patina and gilded gold
  // =========================================================================
  const statueSpotlight = new THREE.SpotLight(0xffecd0, 4.2);
  statueSpotlight.position.set(0, 5.2, 2.2);
  statueSpotlight.target = headMesh;
  statueSpotlight.angle = 0.52;
  statueSpotlight.penumbra = 0.45;
  statueSpotlight.distance = 9.5;
  statueSpotlight.castShadow = true;
  statueGroup.add(statueSpotlight);

  // Subtle lateral rim light to sculpt the cape and sword
  const rimLight = new THREE.PointLight(0xffdf88, 1.6, 6, 2);
  rimLight.position.set(-1.4, 2.4, -0.6);
  statueGroup.add(rimLight);

  return {
    statueGroup,
    interactiveMesh,
    statueSpotlight,
  };
}
