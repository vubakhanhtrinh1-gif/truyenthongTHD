import * as THREE from 'three';
import {
  createHonedStoneWallTexture,
  createOakWoodFloorTexture,
  createHoneyWoodTexture,
  createNeutralRugTexture,
  createWall1SectionHeaderTexture,
  createWall2SectionHeaderTexture,
  createDedicationEssayTexture,
  createExitPortalSignTexture,
  createEntrancePlaqueTexture,
} from '../textures/MemoryProceduralTextures';
import {
  GratitudeEssayData,
  EntranceIntroData,
} from '../config/memoryContentData';

export interface MemoryMaterialSet {
  wallStone: THREE.MeshStandardMaterial;
  floorOak: THREE.MeshStandardMaterial;
  neutralRug: THREE.MeshStandardMaterial;
  woodHoney: THREE.MeshStandardMaterial;
  darkMetal: THREE.MeshStandardMaterial;
  benchLeather: THREE.MeshStandardMaterial;
  champagneGold: THREE.MeshStandardMaterial;
  spotlightLens: THREE.MeshStandardMaterial;
  coveGlow: THREE.MeshBasicMaterial;
  sectionHeaderWall1: THREE.MeshStandardMaterial;
  sectionHeaderWall2: THREE.MeshStandardMaterial;
  dedicationEssay: THREE.MeshStandardMaterial;
  entranceIntro: THREE.MeshStandardMaterial;
  introWallPlaque: THREE.MeshStandardMaterial;
  portalDepth: THREE.MeshBasicMaterial;
}

export function createMemoryMaterials(
  essay: GratitudeEssayData,
  intro: EntranceIntroData,
  wall1Title: string,
  wall1Subtitle: string,
  wall2Title: string,
  wall2Subtitle: string
): MemoryMaterialSet {
  const wallTex = createHonedStoneWallTexture();
  const floorTex = createOakWoodFloorTexture();
  const woodTex = createHoneyWoodTexture();
  const rugTex = createNeutralRugTexture();
  const w1HeadTex = createWall1SectionHeaderTexture(wall1Title, wall1Subtitle);
  const w2HeadTex = createWall2SectionHeaderTexture(wall2Title, wall2Subtitle);
  const dedicationTex = createDedicationEssayTexture(essay);
  const exitSignTex = createExitPortalSignTexture(intro);
  const introWallTex = createEntrancePlaqueTexture(intro);

  // 1. Walls: Warm light-gray / beige honed sandstone panels with reveal joints
  const wallStone = new THREE.MeshStandardMaterial({
    map: wallTex,
    color: 0xFFFFFF,
    roughness: 0.72,
    metalness: 0.04,
  });

  // 2. Floor: Light natural oak wood timber planks
  const floorOak = new THREE.MeshStandardMaterial({
    map: floorTex,
    color: 0xFFFFFF,
    roughness: 0.38,
    metalness: 0.08,
  });

  // 3. Neutral Area Rug: Linen / oatmeal flat weave
  const neutralRug = new THREE.MeshStandardMaterial({
    map: rugTex,
    roughness: 0.88,
    metalness: 0.02,
  });

  // 4. Wood: Medium-brown honey oak for horizontal display band & ceiling slats
  const woodHoney = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: 0xFFFFFF,
    roughness: 0.45,
    metalness: 0.05,
  });

  // 5. Dark Metal: Matte black powder-coated steel for frames and bench legs
  const darkMetal = new THREE.MeshStandardMaterial({
    color: 0x1E2126,
    roughness: 0.35,
    metalness: 0.85,
  });

  // 6. Leather: Dark charcoal / black leather cushion pads for benches
  const benchLeather = new THREE.MeshStandardMaterial({
    color: 0x181A1D,
    roughness: 0.60,
    metalness: 0.12,
  });

  // 7. Champagne Gold: Fine architectural accents and corner trims
  const champagneGold = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    roughness: 0.22,
    metalness: 0.82,
  });

  // 8. Spotlight Lens: Luminous warm white recessed downlight bulb
  const spotlightLens = new THREE.MeshStandardMaterial({
    color: 0xFFF8E7,
    emissive: 0xFFE8BD,
    emissiveIntensity: 1.8,
    roughness: 0.2,
    metalness: 0.1,
  });

  // 9. Wall 1 Section Header Plaque
  const sectionHeaderWall1 = new THREE.MeshStandardMaterial({
    map: w1HeadTex,
    roughness: 0.28,
    metalness: 0.15,
  });

  // 10. Wall 2 Section Header Plaque
  const sectionHeaderWall2 = new THREE.MeshStandardMaterial({
    map: w2HeadTex,
    roughness: 0.28,
    metalness: 0.15,
  });

  // 11. Wall 3: Grand Dedication Essay Plaque
  const dedicationEssay = new THREE.MeshStandardMaterial({
    map: dedicationTex,
    roughness: 0.30,
    metalness: 0.12,
  });

  // 9. Concealed Architectural Cove Glow Strip (top of Wall 1 & Wall 2)
  const coveGlow = new THREE.MeshBasicMaterial({
    color: 0xFFE5B4,
  });

  // 12. Wall 4: High-Res 4:1 Exit Portal Sign ("VỀ SẢNH CHÍNH")
  const entranceIntro = new THREE.MeshStandardMaterial({
    map: exitSignTex,
    roughness: 0.22,
    metalness: 0.08,
  });

  // 13. Wall 4: Wall-Mounted Curatorial Introduction Plaque ("DẤU ẤN CỦA LÒNG BIẾT ƠN")
  const introWallPlaque = new THREE.MeshStandardMaterial({
    map: introWallTex,
    roughness: 0.28,
    metalness: 0.12,
  });

  // 14. Portal Return Void
  const portalDepth = new THREE.MeshBasicMaterial({
    color: 0x0E1014,
  });

  return {
    wallStone,
    floorOak,
    neutralRug,
    woodHoney,
    darkMetal,
    benchLeather,
    champagneGold,
    spotlightLens,
    coveGlow,
    sectionHeaderWall1,
    sectionHeaderWall2,
    dedicationEssay,
    entranceIntro,
    introWallPlaque,
    portalDepth,
  };
}
