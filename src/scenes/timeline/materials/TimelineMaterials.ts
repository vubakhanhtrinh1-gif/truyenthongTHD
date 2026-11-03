import * as THREE from 'three';
import {
  createTimelineFloorTexture,
  createTimelineWallTexture,
  createTimelineSpineTexture,
  createFinaleMedallionTexture,
  createTimelineEntrancePlaqueTexture,
} from '../textures/TimelineProceduralTextures';

export interface TimelineMaterialSet {
  wallStone: THREE.MeshStandardMaterial;
  floorBeige: THREE.MeshStandardMaterial;
  charcoalFrame: THREE.MeshStandardMaterial;
  columnIvoryStone: THREE.MeshStandardMaterial;
  pedestalWhiteMarble: THREE.MeshStandardMaterial;
  royalBrass: THREE.MeshStandardMaterial;
  bronzeTrim: THREE.MeshStandardMaterial;
  deepNavyPanel: THREE.MeshStandardMaterial;
  heritageGold: THREE.MeshStandardMaterial;
  luminousGold: THREE.MeshStandardMaterial;
  champagneGlow: THREE.MeshStandardMaterial;
  timelineSpine: THREE.MeshStandardMaterial;
  riverWaterSheen: THREE.MeshBasicMaterial;
  riverCyanGlow: THREE.MeshBasicMaterial;
  finaleMedallion: THREE.MeshStandardMaterial;
  entrancePlaque: THREE.MeshStandardMaterial;
  portalDepth: THREE.MeshBasicMaterial;
  frostedGlass: THREE.MeshPhysicalMaterial;
}

export function createTimelineMaterials(): TimelineMaterialSet {
  const floorTex = createTimelineFloorTexture();
  const wallTex = createTimelineWallTexture();
  const spineTex = createTimelineSpineTexture();
  const finaleTex = createFinaleMedallionTexture();
  const entranceTex = createTimelineEntrancePlaqueTexture();

  // 1. Walls: Warm Ivory Limestone (#FAF7F0)
  const wallStone = new THREE.MeshStandardMaterial({
    map: wallTex,
    color: 0xFAF7F0,
    roughness: 0.55,
    metalness: 0.05,
  });

  // 2. Floor: Polished Crema Marfil Marble (#FAF6ED)
  const floorBeige = new THREE.MeshStandardMaterial({
    map: floorTex,
    color: 0xFAF6ED,
    roughness: 0.18,
    metalness: 0.12,
  });

  // 3. Slender Fluted Columns: Warm Ivory Limestone (#F7EFE2)
  const columnIvoryStone = new THREE.MeshStandardMaterial({
    color: 0xF7EFE2,
    roughness: 0.38,
    metalness: 0.08,
  });

  // 3B. Backward compatibility for any charcoal reference - now refined ivory stone
  const charcoalFrame = new THREE.MeshStandardMaterial({
    color: 0xF5EDE0,
    roughness: 0.36,
    metalness: 0.10,
  });

  // 4. White Marble Milestone Pedestals (#FAF8F4)
  const pedestalWhiteMarble = new THREE.MeshStandardMaterial({
    color: 0xFAF8F4,
    roughness: 0.20,
    metalness: 0.10,
  });

  // 5. Royal Brass & 24K Gold Trims (#D4AF37)
  const royalBrass = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    roughness: 0.22,
    metalness: 0.88,
  });

  const heritageGold = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    roughness: 0.22,
    metalness: 0.88,
  });

  const bronzeTrim = new THREE.MeshStandardMaterial({
    color: 0x5C462B,
    roughness: 0.38,
    metalness: 0.65,
  });

  // 6. Deep Royal Sapphire Navy Accent Panels (#141E30)
  const deepNavyPanel = new THREE.MeshStandardMaterial({
    color: 0x141E30,
    roughness: 0.28,
    metalness: 0.25,
  });

  // 7. Luminous Gold Spine Accents (#FFE28A)
  const luminousGold = new THREE.MeshStandardMaterial({
    color: 0xFFE28A,
    emissive: 0xD4AF37,
    emissiveIntensity: 1.45,
    roughness: 0.18,
    metalness: 0.75,
  });

  // 8. Warm Champagne Highlights (#FFF2C4)
  const champagneGlow = new THREE.MeshStandardMaterial({
    color: 0xFFF2C4,
    emissive: 0xE8CE85,
    emissiveIntensity: 1.50,
    roughness: 0.18,
    metalness: 0.45,
  });

  // 9. Central "River of Time" Aquatic Spine (#0C4B59 to #146E7E)
  const timelineSpine = new THREE.MeshStandardMaterial({
    map: spineTex,
    roughness: 0.12,
    metalness: 0.38,
  });

  // 10. Water Surface Golden / Cyan Sheen Layer (Translucent Additive Blending)
  const riverWaterSheen = new THREE.MeshBasicMaterial({
    color: 0x55E0EE,
    transparent: true,
    opacity: 0.20,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const riverCyanGlow = new THREE.MeshBasicMaterial({
    color: 0xFFE594,
    transparent: true,
    opacity: 0.18,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  // 11. North Wall 60-Year Finale Ceremonial Medallion
  const finaleMedallion = new THREE.MeshStandardMaterial({
    map: finaleTex,
    roughness: 0.25,
    metalness: 0.38,
  });

  // 12. South Entrance Portal Plaque
  const entrancePlaque = new THREE.MeshStandardMaterial({
    map: entranceTex,
    roughness: 0.24,
    metalness: 0.32,
  });

  // 13. Doorway Depth Void
  const portalDepth = new THREE.MeshBasicMaterial({
    color: 0x0A0F1A,
  });

  // 14. Museum Crystal Glass
  const frostedGlass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
    roughness: 0.12,
    transmission: 0.92,
    ior: 1.52,
  });

  return {
    wallStone,
    floorBeige,
    charcoalFrame,
    columnIvoryStone,
    pedestalWhiteMarble,
    royalBrass,
    bronzeTrim,
    deepNavyPanel,
    heritageGold,
    luminousGold,
    champagneGlow,
    timelineSpine,
    riverWaterSheen,
    riverCyanGlow,
    finaleMedallion,
    entrancePlaque,
    portalDepth,
    frostedGlass,
  };
}
