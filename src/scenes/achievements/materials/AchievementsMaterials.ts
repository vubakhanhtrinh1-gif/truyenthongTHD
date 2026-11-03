/**
 * Three.js Material Library for Zone 3: Achievements Room
 * Concept: MODERN HERITAGE — THE TEMPLE OF GLORY & ACADEMIC TRIUMPH
 *
 * Harmonized with Room 1 (History) & Room 2 (Development):
 * - Luxurious Honey Oak Parquet Floor with Central 24K Gold Inlay Strips
 * - Imperial Museum Limestone & Deep Obsidian Navy Wall
 * - Coffered Walnut Ceiling with Brass Molding & Museum Downlights
 * - Ornate 24K Gilded Picture Frames & Deep Velvet Matting
 */

import * as THREE from 'three';
import {
  createHistoryWoodFloorTexture,
  createHistoryWallTexture,
} from '../../history/textures/HistoryProceduralTextures';
import { createDarkWoodTexture } from '../../../entrance/textures/ProceduralTextures';
import { createAchievementsCeilingTexture } from '../textures/AchievementsProceduralTextures';

export interface AchievementsMaterialSet {
  floor: THREE.MeshStandardMaterial;
  wall: THREE.MeshStandardMaterial;
  ceiling: THREE.MeshStandardMaterial;
  trimWood: THREE.MeshStandardMaterial;
  brass: THREE.MeshStandardMaterial;
  champagneGold: THREE.MeshStandardMaterial;
  luminousGold: THREE.MeshStandardMaterial;
  antiqueBronze: THREE.MeshStandardMaterial;
  pedestalStone: THREE.MeshStandardMaterial;
  velvetMatting: THREE.MeshStandardMaterial;
  doorwayDepth: THREE.MeshBasicMaterial;
  honorRedLacquer: THREE.MeshStandardMaterial;
  medalBronze: THREE.MeshStandardMaterial;
  medalSilver: THREE.MeshStandardMaterial;
  medalGold: THREE.MeshStandardMaterial;
}

export function createAchievementsMaterials(): AchievementsMaterialSet {
  const floorTex = createHistoryWoodFloorTexture();
  const wallTex = createHistoryWallTexture();
  const ceilingTex = createAchievementsCeilingTexture();
  const woodTex = createDarkWoodTexture();

  // 1. Smoked Natural Oak Parquet Gallery Floor (restrained, neutral, not overly orange)
  const floor = new THREE.MeshStandardMaterial({
    map: floorTex,
    color: 0x8f8272,
    roughness: 0.42,
    metalness: 0.08,
  });

  // 2. Bright Museum Limestone Wall (high legibility, distinct from columns)
  const wall = new THREE.MeshStandardMaterial({
    map: wallTex,
    color: 0xf5f0e8,
    roughness: 0.88,
    metalness: 0.02,
  });

  // 3. Coffered Walnut & Gold Ceiling
  const ceiling = new THREE.MeshStandardMaterial({
    map: ceilingTex,
    color: 0x14100c,
    roughness: 0.78,
    metalness: 0.05,
  });

  // 4. Deep Smoked Ebony-Walnut Trim & Columns (crisp distinction from walls)
  const trimWood = new THREE.MeshStandardMaterial({
    map: woodTex,
    color: 0x1a120c,
    roughness: 0.45,
    metalness: 0.12,
  });

  // 5. Polished 24K Museum Brass & Gold Leaf
  const brass = new THREE.MeshStandardMaterial({
    color: 0xd4af37,
    roughness: 0.25,
    metalness: 0.88,
  });

  // 6. Champagne Gold Accent
  const champagneGold = new THREE.MeshStandardMaterial({
    color: 0xe5c175,
    roughness: 0.25,
    metalness: 0.82,
  });

  // 7. Luminous Gold with Warm Emissive Glow
  const luminousGold = new THREE.MeshStandardMaterial({
    color: 0xffe89e,
    emissive: 0xd4af37,
    emissiveIntensity: 1.6,
    roughness: 0.18,
    metalness: 0.65,
  });

  // 8. Antique Bronze
  const antiqueBronze = new THREE.MeshStandardMaterial({
    color: 0x6e522e,
    roughness: 0.45,
    metalness: 0.72,
  });

  // 9. Pedestal Honed Beige Marble Stone
  const pedestalStone = new THREE.MeshStandardMaterial({
    color: 0xdfd7cb,
    roughness: 0.42,
    metalness: 0.08,
  });

  // 10. Deep Velvet Matting for Picture Frames
  const velvetMatting = new THREE.MeshStandardMaterial({
    color: 0x0a101d,
    roughness: 0.85,
    metalness: 0.05,
  });

  // 11. Doorway Depth
  const doorwayDepth = new THREE.MeshBasicMaterial({
    color: 0x050810,
  });

  // 12. Honor Red Lacquer for Medals and Ribbons
  const honorRedLacquer = new THREE.MeshStandardMaterial({
    color: 0x8a1820,
    roughness: 0.22,
    metalness: 0.45,
  });

  // 13. Bronze Medal Material
  const medalBronze = new THREE.MeshStandardMaterial({
    color: 0xcd7f32,
    roughness: 0.3,
    metalness: 0.8,
  });

  // 14. Silver Medal Material
  const medalSilver = new THREE.MeshStandardMaterial({
    color: 0xe0e0e0,
    roughness: 0.25,
    metalness: 0.85,
  });

  // 15. Gold Medal Material
  const medalGold = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    roughness: 0.2,
    metalness: 0.9,
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
    velvetMatting,
    doorwayDepth,
    honorRedLacquer,
    medalBronze,
    medalSilver,
    medalGold,
  };
}
