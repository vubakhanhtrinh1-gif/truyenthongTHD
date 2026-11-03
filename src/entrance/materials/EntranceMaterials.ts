import * as THREE from 'three';
import {
  createDarkWoodTexture,
  createBrushedGoldTexture,
  createStoneFloorTexture,
  createInlayPathTexture,
  createWallReliefTexture,
} from '../textures/ProceduralTextures';

export interface EntranceMaterialSet {
  wood: THREE.MeshStandardMaterial;
  gold: THREE.MeshStandardMaterial;
  goldLuminous: THREE.MeshStandardMaterial;
  lacquerRed: THREE.MeshStandardMaterial;
  stoneFloor: THREE.MeshStandardMaterial;
  pathInlay: THREE.MeshStandardMaterial;
  wall: THREE.MeshStandardMaterial;
  ceiling: THREE.MeshStandardMaterial;
  glass: THREE.MeshPhysicalMaterial;
}

export function createEntranceMaterials(): EntranceMaterialSet {
  const woodTexture = createDarkWoodTexture();
  const goldTexture = createBrushedGoldTexture();
  const floorTexture = createStoneFloorTexture();
  const pathTexture = createInlayPathTexture();
  const wallTexture = createWallReliefTexture();

  const wood = new THREE.MeshStandardMaterial({
    map: woodTexture,
    color: 0x342921,
    roughness: 0.50,
    metalness: 0.25,
  });

  const gold = new THREE.MeshStandardMaterial({
    map: goldTexture,
    color: 0xc7a15a,
    roughness: 0.35,
    metalness: 0.82,
  });

  const goldLuminous = new THREE.MeshStandardMaterial({
    color: 0xffe29a,
    emissive: 0xc7a15a,
    emissiveIntensity: 1.6,
    roughness: 0.2,
    metalness: 0.6,
  });

  const lacquerRed = new THREE.MeshStandardMaterial({
    color: 0x5a1117,
    roughness: 0.38,
    metalness: 0.15,
  });

  const stoneFloor = new THREE.MeshStandardMaterial({
    map: floorTexture,
    color: 0x242b3a,
    roughness: 0.35,
    metalness: 0.25,
  });

  const pathInlay = new THREE.MeshStandardMaterial({
    map: pathTexture,
    transparent: true,
    opacity: 0.95,
    roughness: 0.4,
    metalness: 0.4,
  });

  const wall = new THREE.MeshStandardMaterial({
    map: wallTexture,
    color: 0xf5f6f8,
    roughness: 0.65,
    metalness: 0.05,
  });

  const ceiling = new THREE.MeshStandardMaterial({
    color: 0xfafbfc,
    roughness: 0.75,
    metalness: 0.05,
  });

  const glass = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.35,
    transmission: 0.7,
    roughness: 0.1,
    ior: 1.45,
  });

  return {
    wood,
    gold,
    goldLuminous,
    lacquerRed,
    stoneFloor,
    pathInlay,
    wall,
    ceiling,
    glass,
  };
}
