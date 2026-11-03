import * as THREE from 'three';
import {
  createLobbyMarbleFloorTexture,
  createLobbyAxisPathTexture,
  createCofferedCeilingTexture,
  createLobbyWallTexture,
  createHeritageSphereTexture,
  createMedallionRingTexture,
  createSaturnAccretionDiscTexture,
} from '../textures/LobbyProceduralTextures';
import { createOfficialEmblemTexture } from '../textures/createOfficialEmblemTexture';

export interface LobbyMaterialSet {
  marbleFloor: THREE.MeshStandardMaterial;
  axisPath: THREE.MeshStandardMaterial;
  columnStone: THREE.MeshStandardMaterial;
  columnFluting: THREE.MeshStandardMaterial;
  walnutWood: THREE.MeshStandardMaterial; // Kept for backward compatibility, mapped to refined warm architectural stone/bronze
  brushedBrass: THREE.MeshStandardMaterial;
  bronzeTrim: THREE.MeshStandardMaterial;
  luminousGold: THREE.MeshStandardMaterial;
  amberFire: THREE.MeshStandardMaterial;
  lacquerRed: THREE.MeshStandardMaterial;
  cofferedCeiling: THREE.MeshStandardMaterial;
  wallStone: THREE.MeshStandardMaterial;
  frostedGlass: THREE.MeshPhysicalMaterial;
  doorwayDepth: THREE.MeshBasicMaterial;
  officialEmblem: THREE.MeshStandardMaterial;
  obsidianSphere: THREE.MeshPhysicalMaterial;
  medallionRing: THREE.MeshStandardMaterial;
  saturnAccretionDisc: THREE.MeshPhysicalMaterial;
  torchFlame: THREE.MeshStandardMaterial;
  // Refined Heritage Gate Materials
  gateIvoryStone: THREE.MeshStandardMaterial;
  gateChampagneGold: THREE.MeshStandardMaterial;
  gateBronzeTrim: THREE.MeshStandardMaterial;
  gateContourTrims: Record<string, THREE.MeshStandardMaterial>;
}

export function createLobbyMaterials(customLogoUrl?: string): LobbyMaterialSet {
  const floorTex = createLobbyMarbleFloorTexture();
  const axisTex = createLobbyAxisPathTexture();
  const ceilingTex = createCofferedCeilingTexture();
  const wallTex = createLobbyWallTexture();
  const emblemTex = createOfficialEmblemTexture(customLogoUrl);
  const sphereTex = createHeritageSphereTexture();
  const medallionRingTex = createMedallionRingTexture();
  const saturnDiscTex = createSaturnAccretionDiscTexture();

  // 1. Main Floor: Warm luminous Crema Marfil cream-ivory stone (#F6F1E7) with delicate golden veins
  const marbleFloor = new THREE.MeshStandardMaterial({
    map: floorTex,
    color: 0xF8F4EB,
    roughness: 0.22,
    metalness: 0.12,
  });

  // 2. Ceremonial Central Walkway: Royal Heritage Runner with Champagne Gold Inlays
  const axisPath = new THREE.MeshStandardMaterial({
    map: axisTex,
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.98,
    roughness: 0.25,
    metalness: 0.35,
  });

  // 3. Architectural Columns: Warm Honed Ivory French Limestone (#F5EFE6)
  // Replaces oversized heavy black structures with dignified, luminous architectural stone
  const columnStone = new THREE.MeshStandardMaterial({
    color: 0xF5EFE6,
    roughness: 0.32,
    metalness: 0.10,
  });

  const columnFluting = new THREE.MeshStandardMaterial({
    color: 0xECE4D4,
    roughness: 0.38,
    metalness: 0.08,
  });

  // walnutWood alias mapped to refined warm architectural stone for seamless compatibility
  const walnutWood = columnStone;

  // 4. Decorative Rings, Capitals, Bases & Metallic Trims: Polished Champagne Gold (#D4AF37)
  const brushedBrass = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    roughness: 0.18,
    metalness: 0.88,
  });

  // Architectural Brushed Bronze Accent (#6E5033)
  const bronzeTrim = new THREE.MeshStandardMaterial({
    color: 0x6E5033,
    roughness: 0.28,
    metalness: 0.65,
  });

  // 5. Luminous Polished Heritage Gold with controlled glow (#FFE28A / #D4AF37)
  const luminousGold = new THREE.MeshStandardMaterial({
    color: 0xFFE28A,
    emissive: 0xD4AF37,
    emissiveIntensity: 1.35,
    roughness: 0.18,
    metalness: 0.75,
  });

  // 6. Warm Accent Highlights: Champagne Gold Energy (#F4D58B / #D4AF37)
  const amberFire = new THREE.MeshStandardMaterial({
    color: 0xF4D58B,
    emissive: 0xD4AF37,
    emissiveIntensity: 1.40,
    roughness: 0.20,
    metalness: 0.40,
  });

  // 7. Imperial Lacquer Red Accent
  const lacquerRed = new THREE.MeshStandardMaterial({
    color: 0x8B2029,
    roughness: 0.25,
    metalness: 0.25,
  });

  // 8. Ceiling: Warm Alabaster Ivory with Layered Gilded Relief Moldings (#FAF6EF)
  const cofferedCeiling = new THREE.MeshStandardMaterial({
    map: ceilingTex,
    color: 0xFAF6EF,
    roughness: 0.55,
    metalness: 0.08,
  });

  // 9. Walls: Warm Honed French Limestone with Fluted Relief (#F4EFE6)
  const wallStone = new THREE.MeshStandardMaterial({
    map: wallTex,
    color: 0xF4EFE6,
    roughness: 0.48,
    metalness: 0.06,
  });

  // 10. Showcase Museum Crystal Glass
  const frostedGlass = new THREE.MeshPhysicalMaterial({
    color: 0xFFFFFF,
    transparent: true,
    opacity: 0.35,
    transmission: 0.88,
    roughness: 0.15,
    ior: 1.50,
  });

  // 11. Portal Doorway Void (Warm architectural shadow depth, #1E1610)
  const doorwayDepth = new THREE.MeshBasicMaterial({
    color: 0x1E1610,
  });

  // 12. Official Authentic School Emblem Material
  const officialEmblem = new THREE.MeshStandardMaterial({
    map: emblemTex,
    emissive: 0xFFFFFF,
    emissiveMap: emblemTex,
    emissiveIntensity: 0.40,
    transparent: true,
    alphaTest: 0.05,
    roughness: 0.18,
    metalness: 0.15,
    side: THREE.DoubleSide,
    depthWrite: true,
  });

  // 13. Refined 60-Year Heritage Obsidian & Champagne-Gold Sphere Material
  // Smooth, high-quality PBR material with realistic reflections, subtle bronze highlights and engraved meridians
  const obsidianSphere = new THREE.MeshPhysicalMaterial({
    map: sphereTex,
    color: 0xFFFFFF,
    roughness: 0.14,
    metalness: 0.82,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    reflectivity: 0.95,
    sheen: 0.48,
    sheenColor: new THREE.Color(0xD4AF37),
    sheenRoughness: 0.25,
  });

  // 13B. Front-Facing Circular Gold Medallion Inscription Bezel Material
  const medallionRing = new THREE.MeshStandardMaterial({
    map: medallionRingTex,
    color: 0xFFFFFF,
    transparent: true,
    roughness: 0.20,
    metalness: 0.85,
    side: THREE.DoubleSide,
    depthWrite: true,
  });

  // 13C. Grand Saturn Accretion Disc 24K Museum Brass & Gold Material ('Lich Su' Finish)
  // Deep metallic brass with rich specular reflections, clearcoat lacquer, and golden radiance
  const saturnAccretionDisc = new THREE.MeshPhysicalMaterial({
    map: saturnDiscTex,
    color: 0xFFE28A,
    emissive: 0xD4AF37,
    emissiveMap: saturnDiscTex,
    emissiveIntensity: 0.48,
    roughness: 0.24,
    metalness: 0.88,
    clearcoat: 0.90,
    clearcoatRoughness: 0.10,
    reflectivity: 0.98,
    sheen: 0.65,
    sheenColor: new THREE.Color(0xFFDF73),
    sheenRoughness: 0.20,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -1,
    polygonOffsetUnits: -1,
  });

  // 14. Ceremonial Torch Amber Flame Material
  const torchFlame = new THREE.MeshStandardMaterial({
    color: 0xFFA534,
    emissive: 0xEE7218,
    emissiveIntensity: 1.8,
    roughness: 0.16,
    metalness: 0.12,
    transparent: true,
    opacity: 0.94,
  });

  // 15. Refined Heritage Entrance Gate Architectural Materials
  // Warm Ivory Limestone (#F5EFE6) - replaces old dark charcoal
  const gateIvoryStone = new THREE.MeshStandardMaterial({
    color: 0xF5EFE6,
    roughness: 0.34,
    metalness: 0.10,
  });

  // Polished Champagne Gold (#D4AF37)
  const gateChampagneGold = new THREE.MeshStandardMaterial({
    color: 0xD4AF37,
    roughness: 0.18,
    metalness: 0.88,
  });

  // Warm architectural bronze trim (#6E5033)
  const gateBronzeTrim = new THREE.MeshStandardMaterial({
    color: 0x6E5033,
    roughness: 0.28,
    metalness: 0.60,
  });

  // Zone-specific distinct contour & silhouette outline trims
  const gateContourTrims: Record<string, THREE.MeshStandardMaterial> = {
    history: new THREE.MeshStandardMaterial({
      color: 0xB91C1C,
      emissive: 0x8B1E22,
      emissiveIntensity: 0.70,
      roughness: 0.22,
      metalness: 0.65,
    }),
    timeline: new THREE.MeshStandardMaterial({
      color: 0xD97706,
      emissive: 0xB45309,
      emissiveIntensity: 0.72,
      roughness: 0.20,
      metalness: 0.70,
    }),
    development: new THREE.MeshStandardMaterial({
      color: 0x15803D,
      emissive: 0x166534,
      emissiveIntensity: 0.70,
      roughness: 0.22,
      metalness: 0.65,
    }),
    achievements: new THREE.MeshStandardMaterial({
      color: 0xEAB308,
      emissive: 0xCA8A04,
      emissiveIntensity: 0.80,
      roughness: 0.18,
      metalness: 0.80,
    }),
    memory: new THREE.MeshStandardMaterial({
      color: 0xBE123C,
      emissive: 0x9F1239,
      emissiveIntensity: 0.70,
      roughness: 0.22,
      metalness: 0.65,
    }),
  };

  return {
    marbleFloor,
    axisPath,
    columnStone,
    columnFluting,
    walnutWood,
    brushedBrass,
    bronzeTrim,
    luminousGold,
    amberFire,
    lacquerRed,
    cofferedCeiling,
    wallStone,
    frostedGlass,
    doorwayDepth,
    officialEmblem,
    obsidianSphere,
    medallionRing,
    saturnAccretionDisc,
    torchFlame,
    gateIvoryStone,
    gateChampagneGold,
    gateBronzeTrim,
    gateContourTrims,
  };
}
