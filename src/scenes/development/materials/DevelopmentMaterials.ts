import * as THREE from 'three';
import {
  createHistoryWoodFloorTexture,
  createHistoryWallTexture,
} from '../../history/textures/HistoryProceduralTextures';
import {
  createDevelopmentCeilingTexture,
  createDucThanhTranFrameTexture,
} from '../textures/DevelopmentProceduralTextures';
import { createDarkWoodTexture } from '../../../entrance/textures/ProceduralTextures';

export interface DevelopmentMaterialSet {
  floor: THREE.MeshStandardMaterial;
  wall: THREE.MeshStandardMaterial;
  ceiling: THREE.MeshStandardMaterial;
  trimWood: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  champagneGold: THREE.MeshStandardMaterial;
  luminousGold: THREE.MeshStandardMaterial;
  antiqueBronze: THREE.MeshStandardMaterial;
  pedestalStone: THREE.MeshStandardMaterial;
  emissiveGold: THREE.MeshStandardMaterial;
  doorwayDepth: THREE.MeshBasicMaterial;
  lacquerRedAccent: THREE.MeshStandardMaterial;
  obsidianSphere: THREE.MeshPhysicalMaterial;
  ducThanhTranFrame: THREE.MeshStandardMaterial;
  statuePatinatedBronze: THREE.MeshStandardMaterial;
  statuePolishedBronze: THREE.MeshStandardMaterial;
  statueGildedGold: THREE.MeshStandardMaterial;
  statueDarkGranite: THREE.MeshStandardMaterial;
  statueCrimsonSilk: THREE.MeshStandardMaterial;
}

export function createDevelopmentMaterials(): DevelopmentMaterialSet {
  const floorTex = createHistoryWoodFloorTexture();
  const wallTex = createHistoryWallTexture();
  const ceilingTex = createDevelopmentCeilingTexture();
  const woodTex = createDarkWoodTexture();

  // 1. Luxurious Golden Parquet / Polished Honey Oak Gallery Floor (identical to Room 1)
  const floor = new THREE.MeshStandardMaterial({
    map: floorTex,
    color: 0xc8aa78,
    roughness: 0.28,
    metalness: 0.12,
  });

  // 2. Imperial Museum Warm Champagne Cream Limestone Wall (identical to Room 1)
  const wall = new THREE.MeshStandardMaterial({
    map: wallTex,
    color: 0xf2ebe1,
    roughness: 0.85,
    metalness: 0.02,
  });

  // 3. Luxurious Coffered Ceiling in Warm Walnut & Champagne Bronze (identical to Room 1)
  const ceiling = new THREE.MeshStandardMaterial({
    map: ceilingTex,
    color: 0x1f1710,
    roughness: 0.75,
    metalness: 0.05,
  });

  // 4. Dark Royal Walnut Wood & Imperial Rosewood Trim (identical to Room 1)
  const trimWood = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: 0x2a1a10,
    roughness: 0.38,
    metalness: 0.18,
  });

  // 5. Polished 24K Museum Brass & Gold Leaf (identical to Room 1)
  const brass = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.88,
  });

  // 6. Champagne Gold Accent (Subtle, refined)
  const champagneGold = new THREE.MeshStandardMaterial({
    color: 0xe5c175,
    roughness: 0.25,
    metalness: 0.82,
  });

  // 7. Luminous 24K Gold Accent with Warm Emissive Glow (identical to Room 1)
  const luminousGold = new THREE.MeshStandardMaterial({
    color: 0xffe89e,
    emissive: 0xd4af37,
    emissiveIntensity: 1.8,
    roughness: 0.18,
    metalness: 0.65,
  });

  // 8. Antique Bronze
  const antiqueBronze = new THREE.MeshStandardMaterial({
    color: 0x6e522e,
    roughness: 0.45,
    metalness: 0.72,
  });

  // 9. Anti-reflective Museum Showcase Glass
  const museumGlass = new THREE.MeshPhysicalMaterial({
    color: 0xfffef8,
    transparent: true,
    opacity: 0.20,
    roughness: 0.05,
    metalness: 0.08,
    transmission: 0.92,
    ior: 1.52,
    thickness: 0.5,
  });

  // 10. Crema Marfil & Imperial Gold Polished Marble Pedestal Stone (identical to Room 1)
  const pedestalStone = new THREE.MeshStandardMaterial({
    color: 0xf6ede0,
    roughness: 0.24,
    metalness: 0.18,
  });

  // 11. Subtle Warm Gold Emissive Marker
  const emissiveGold = new THREE.MeshStandardMaterial({
    color: 0xffe699,
    emissive: 0xd4af37,
    emissiveIntensity: 0.85,
    roughness: 0.25,
    metalness: 0.65,
  });

  // 12. Warm Golden Shadow for Transition Portal (identical to Room 1)
  const doorwayDepth = new THREE.MeshBasicMaterial({
    color: 0x3d2b19,
  });

  // 13. Royal Vietnamese Imperial Red Lacquer Accent (identical to Room 1)
  const lacquerRedAccent = new THREE.MeshStandardMaterial({
    color: 0x8a1b24,
    roughness: 0.28,
    metalness: 0.25,
  });

  // 14. Glossy Obsidian Black Hole Sphere (identical to Room 1: Pure black glossy mirror-like surface)
  const obsidianSphere = new THREE.MeshPhysicalMaterial({
    color: 0x050505,
    roughness: 0.04,
    metalness: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    reflectivity: 1.0,
  });

  // 15. Heroic Monument Bronze & Accents for Tran Hung Dao Statue
  const statuePatinatedBronze = new THREE.MeshStandardMaterial({
    color: 0x3d4338,
    roughness: 0.42,
    metalness: 0.78,
  });

  const statuePolishedBronze = new THREE.MeshStandardMaterial({
    color: 0x8a6230,
    roughness: 0.28,
    metalness: 0.85,
  });

  const statueGildedGold = new THREE.MeshStandardMaterial({
    color: 0xe6b840,
    roughness: 0.22,
    metalness: 0.88,
  });

  const statueDarkGranite = new THREE.MeshStandardMaterial({
    color: 0x1e2024,
    roughness: 0.35,
    metalness: 0.15,
  });

  const statueCrimsonSilk = new THREE.MeshStandardMaterial({
    color: 0x820c16,
    roughness: 0.65,
    metalness: 0.08,
  });

  const ducThanhTranFrame = new THREE.MeshStandardMaterial({
    map: createDucThanhTranFrameTexture(),
    roughness: 0.22,
    metalness: 0.15,
  });

  return {
    floor,
    wall,
    ceiling,
    trimWood,
    brass,
    champagneGold,
    luminousGold,
    antiqueBronze,
    pedestalStone,
    emissiveGold,
    doorwayDepth,
    lacquerRedAccent,
    obsidianSphere,
    ducThanhTranFrame,
    statuePatinatedBronze,
    statuePolishedBronze,
    statueGildedGold,
    statueDarkGranite,
    statueCrimsonSilk,
  };
}
