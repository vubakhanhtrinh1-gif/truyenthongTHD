import * as THREE from 'three';
import {
  createHistoryWoodFloorTexture,
  createHistoryWallTexture,
} from '../textures/HistoryProceduralTextures';
import { createDarkWoodTexture } from '../../../entrance/textures/ProceduralTextures';

export interface HistoryMaterialSet {
  woodFloor: THREE.MeshStandardMaterial;
  wall: THREE.MeshStandardMaterial;
  ceiling: THREE.MeshStandardMaterial;
  walnut: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  luminousGold: THREE.MeshStandardMaterial;
  lacquerRed: THREE.MeshStandardMaterial;
  museumGlass: THREE.MeshPhysicalMaterial;
  pedestalStone: THREE.MeshStandardMaterial;
  doorwayDepth: THREE.MeshBasicMaterial;
  obsidianSphere: THREE.MeshPhysicalMaterial;
}

export function createHistoryMaterials(): HistoryMaterialSet {
  const floorTex = createHistoryWoodFloorTexture();
  const wallTex = createHistoryWallTexture();
  const woodTex = createDarkWoodTexture();

  // 1. Luxurious Golden Parquet / Polished Honey Oak Gallery Floor with 30% deep richness
  const woodFloor = new THREE.MeshStandardMaterial({
    map: floorTex,
    color: 0xc8aa78,
    roughness: 0.28,
    metalness: 0.16,
  });

  // 2. Imperial Museum Champagne Bronze & Limestone Wall (balanced tone)
  const wall = new THREE.MeshStandardMaterial({
    map: wallTex,
    color: 0xcac0ad,
    roughness: 0.58,
    metalness: 0.04,
  });

  // 3. Luxurious Coffered Ceiling in Warm Champagne Bronze
  const ceiling = new THREE.MeshStandardMaterial({
    color: 0x9e927c,
    roughness: 0.65,
    metalness: 0.05,
  });

  // 4. Warm Golden Teak & Imperial Honey Rosewood Trim
  const walnut = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: 0x8f6333,
    roughness: 0.42,
    metalness: 0.22,
  });

  // 5. Polished 24K Museum Brass & Gold Leaf
  const brass = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.88,
  });

  // 6. Luminous 24K Gold Accent with Warm Glow
  const luminousGold = new THREE.MeshStandardMaterial({
    color: 0xffe89e,
    emissive: 0xd4af37,
    emissiveIntensity: 1.8,
    roughness: 0.18,
    metalness: 0.65,
  });

  // 7. Royal Vietnamese Imperial Red Lacquer
  const lacquerRed = new THREE.MeshStandardMaterial({
    color: 0x8a1b24,
    roughness: 0.28,
    metalness: 0.25,
  });

  // 8. Crystal Museum Display Glass
  const museumGlass = new THREE.MeshPhysicalMaterial({
    color: 0xfffef8,
    transparent: true,
    opacity: 0.22,
    transmission: 0.92,
    roughness: 0.05,
    ior: 1.52,
  });

  // 9. Crema Marfil & Imperial Gold Polished Marble Pedestal Stone
  const pedestalStone = new THREE.MeshStandardMaterial({
    color: 0xf6ede0,
    roughness: 0.24,
    metalness: 0.18,
  });

  // 10. Warm Golden Shadow for Transition Portal
  const doorwayDepth = new THREE.MeshBasicMaterial({
    color: 0x3d2b19,
  });

  // 11. Glossy Obsidian Black Hole Sphere (Pure black glossy mirror-like surface)
  const obsidianSphere = new THREE.MeshPhysicalMaterial({
    color: 0x050505,
    roughness: 0.04,
    metalness: 0.95,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    reflectivity: 1.0,
  });

  return {
    woodFloor,
    wall,
    ceiling,
    walnut,
    brass,
    luminousGold,
    lacquerRed,
    museumGlass,
    pedestalStone,
    doorwayDepth,
    obsidianSphere,
  };
}
