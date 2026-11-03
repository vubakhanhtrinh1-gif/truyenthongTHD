/**
 * Development Room (Zone 2) Exhibition Layout Validator
 * Verifies non-overlapping panel placement, column clearance, and architectural grid alignment.
 */

export interface PanelPlacement {
  id: string;
  name: string;
  wall: 'west' | 'east' | 'north' | 'center' | 'south';
  centerZ: number;
  centerX?: number;
  centerY: number;
  width: number;
  height: number;
}

export interface ColumnPlacement {
  id: string;
  wall: 'west' | 'east';
  centerZ: number;
  widthZ: number;
}

export interface LayoutValidationResult {
  passed: boolean;
  totalPanels: number;
  totalColumns: number;
  panelCollisions: string[];
  columnOcclusions: string[];
  boundsViolations: string[];
  summary: string;
}

/**
 * Canonical structural column grid for Zone 2 (36m long room, Z from -18 to +18)
 * 8 bays of 4.5m each. Pilasters are located at structural grid lines:
 * Z = -18, -13.5, -9.0, -4.5, 0.0, 4.5, 9.0, 13.5, 18
 */
export const DEVELOPMENT_COLUMNS: ColumnPlacement[] = [
  { id: 'col_z_m18', wall: 'west', centerZ: -18.0, widthZ: 0.35 },
  { id: 'col_z_m13_5', wall: 'west', centerZ: -13.5, widthZ: 0.35 },
  { id: 'col_z_m9', wall: 'west', centerZ: -9.0, widthZ: 0.35 },
  { id: 'col_z_m4_5', wall: 'west', centerZ: -4.5, widthZ: 0.35 },
  { id: 'col_z_0', wall: 'west', centerZ: 0.0, widthZ: 0.35 },
  { id: 'col_z_p4_5', wall: 'west', centerZ: 4.5, widthZ: 0.35 },
  { id: 'col_z_p9', wall: 'west', centerZ: 9.0, widthZ: 0.35 },
  { id: 'col_z_p13_5', wall: 'west', centerZ: 13.5, widthZ: 0.35 },
  { id: 'col_z_p18', wall: 'west', centerZ: 18.0, widthZ: 0.35 },

  { id: 'col_east_z_m18', wall: 'east', centerZ: -18.0, widthZ: 0.35 },
  { id: 'col_east_z_m13_5', wall: 'east', centerZ: -13.5, widthZ: 0.35 },
  { id: 'col_east_z_m9', wall: 'east', centerZ: -9.0, widthZ: 0.35 },
  { id: 'col_east_z_m4_5', wall: 'east', centerZ: -4.5, widthZ: 0.35 },
  { id: 'col_east_z_0', wall: 'east', centerZ: 0.0, widthZ: 0.35 },
  { id: 'col_east_z_p4_5', wall: 'east', centerZ: 4.5, widthZ: 0.35 },
  { id: 'col_east_z_p9', wall: 'east', centerZ: 9.0, widthZ: 0.35 },
  { id: 'col_east_z_p13_5', wall: 'east', centerZ: 13.5, widthZ: 0.35 },
  { id: 'col_east_z_p18', wall: 'east', centerZ: 18.0, widthZ: 0.35 },
];

/**
 * Validates the spatial layout of exhibition panels against neighboring panels and columns.
 */
export function validateDevelopmentLayout(
  panels: PanelPlacement[],
  columns: ColumnPlacement[] = DEVELOPMENT_COLUMNS,
  roomHeight: number = 5.6
): LayoutValidationResult {
  const panelCollisions: string[] = [];
  const columnOcclusions: string[] = [];
  const boundsViolations: string[] = [];

  // 1. Check Panel-to-Panel Overlaps on the same wall
  for (let i = 0; i < panels.length; i++) {
    const a = panels[i];
    const aZMin = a.centerZ - a.width / 2;
    const aZMax = a.centerZ + a.width / 2;
    const aYMin = a.centerY - a.height / 2;
    const aYMax = a.centerY + a.height / 2;

    // Bounds check
    if (aYMin < 0.2) {
      boundsViolations.push(`Panel '${a.id}' touches floor (bottom Y = ${aYMin.toFixed(2)}m < 0.2m)`);
    }
    if (aYMax > roomHeight - 0.2) {
      boundsViolations.push(`Panel '${a.id}' touches ceiling (top Y = ${aYMax.toFixed(2)}m > ${roomHeight - 0.2}m)`);
    }

    for (let j = i + 1; j < panels.length; j++) {
      const b = panels[j];
      if (a.wall !== b.wall) continue;

      const bZMin = b.centerZ - b.width / 2;
      const bZMax = b.centerZ + b.width / 2;
      const bYMin = b.centerY - b.height / 2;
      const bYMax = b.centerY + b.height / 2;

      // Check 2D overlap with a 0.05m tolerance margin
      let horizontalOverlap = false;
      if (a.wall === 'north' && a.centerX !== undefined && b.centerX !== undefined) {
        const aXMin = a.centerX - a.width / 2;
        const aXMax = a.centerX + a.width / 2;
        const bXMin = b.centerX - b.width / 2;
        const bXMax = b.centerX + b.width / 2;
        horizontalOverlap = aXMin < bXMax - 0.05 && aXMax > bXMin + 0.05;
      } else {
        horizontalOverlap = aZMin < bZMax - 0.05 && aZMax > bZMin + 0.05;
      }
      const yOverlap = aYMin < bYMax - 0.05 && aYMax > bYMin + 0.05;

      if (horizontalOverlap && yOverlap) {
        panelCollisions.push(
          `Overlap between '${a.id}' and '${b.id}' on ${a.wall} wall`
        );
      }
    }
  }

  // 2. Check Column Occlusions (Panels intersecting with columns on the same wall)
  for (const panel of panels) {
    if (panel.wall !== 'west' && panel.wall !== 'east') continue;

    const pZMin = panel.centerZ - panel.width / 2;
    const pZMax = panel.centerZ + panel.width / 2;

    for (const col of columns) {
      if (col.wall !== panel.wall) continue;

      const cZMin = col.centerZ - col.widthZ / 2;
      const cZMax = col.centerZ + col.widthZ / 2;

      // Panel must not intersect column interval (with minimum 0.08m clearance)
      const intersects = pZMin < cZMax + 0.08 && pZMax > cZMin - 0.08;
      if (intersects) {
        columnOcclusions.push(
          `Column occlusion: Panel '${panel.id}' intersects column '${col.id}' at Z=${col.centerZ} on ${panel.wall} wall.`
        );
      }
    }
  }

  const passed =
    panelCollisions.length === 0 &&
    columnOcclusions.length === 0 &&
    boundsViolations.length === 0;

  const summary = passed
    ? `[Zone 2 Layout Validation] 100% SUCCESS: All ${panels.length} panels are cleanly positioned in unobstructed bays with zero column occlusions.`
    : `[Zone 2 Layout Validation] FAILED: ${panelCollisions.length} panel collisions, ${columnOcclusions.length} column occlusions, ${boundsViolations.length} bounds violations.`;

  return {
    passed,
    totalPanels: panels.length,
    totalColumns: columns.length,
    panelCollisions,
    columnOcclusions,
    boundsViolations,
    summary,
  };
}
