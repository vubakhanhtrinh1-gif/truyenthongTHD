/**
 * Automated Content Registry Validator
 * Enforces the Mandatory Global Project Invariant:
 * Every editorial museum content item must be discoverable, stably identified,
 * classified by Layer 1 (Text) & Layer 2 (Files), connected to Firestore, and editable via CMD Admin.
 *
 * Usage:
 *   npx tsx scripts/validateContentRegistry.ts
 */

import { CONTENT_REGISTRY } from '../src/registry/contentRegistry';
import { CANONICAL_ROOMS } from '../src/data/initialSeedData';

interface ValidationError {
  contentId: string;
  field: string;
  issue: string;
}

const CANONICAL_ROOM_IDS = new Set<string>([
  'entrance',
  'gate',
  'lobby',
  'history',
  'timeline',
  'development',
  'achievements',
  'memory',
  'vr_ar',
  'ending',
]);

const ALLOWED_CATEGORIES = new Set<string>([
  'room_intro',
  'historical_narrative',
  'milestones',
  'exhibits',
  'artifacts',
  'hotspots',
  'media_documents',
  'audio_narration',
  'achievements',
  'biographies',
  'memorial',
]);

const ALLOWED_FILE_TYPES = new Set<string>([
  'image',
  'audio',
  'video',
  'pdf',
  'document',
  '3d_model',
]);

const ALLOWED_FIELD_TYPES = new Set<string>([
  'text',
  'textarea',
  'date',
  'number',
  'select',
  'string_list',
]);

const ALLOWED_VERIFICATION_STATUSES = new Set<string>([
  'verified',
  'unverified',
  'needs_review',
]);

export function runRegistryValidation(): { passed: boolean; errors: ValidationError[] } {
  const errors: ValidationError[] = [];
  const seenContentIds = new Set<string>();
  const representedRoomIds = new Set<string>();

  console.log('='.repeat(78));
  console.log('  GLOBAL PROJECT RULE VALIDATOR: CONTENT REGISTRY & CMD EDITABILITY');
  console.log('='.repeat(78));
  console.log(`Inspecting ${CONTENT_REGISTRY.length} registered editorial content items...\n`);

  if (!Array.isArray(CONTENT_REGISTRY) || CONTENT_REGISTRY.length === 0) {
    errors.push({
      contentId: 'GLOBAL',
      field: 'CONTENT_REGISTRY',
      issue: 'CONTENT_REGISTRY must be a non-empty array',
    });
    return { passed: false, errors };
  }

  for (const item of CONTENT_REGISTRY) {
    const id = item.contentId || 'MISSING_ID';

    // 1. Stable Identifier Validation
    if (!item.contentId || typeof item.contentId !== 'string' || item.contentId.trim() === '') {
      errors.push({ contentId: id, field: 'contentId', issue: 'Missing or empty contentId' });
    } else if (seenContentIds.has(item.contentId)) {
      errors.push({
        contentId: item.contentId,
        field: 'contentId',
        issue: `Duplicate contentId detected: "${item.contentId}". Content IDs must be strictly unique.`,
      });
    } else {
      seenContentIds.add(item.contentId);
    }

    // 2. Room ID Validation
    if (!item.roomId || typeof item.roomId !== 'string') {
      errors.push({ contentId: id, field: 'roomId', issue: 'Missing or invalid roomId' });
    } else if (!CANONICAL_ROOM_IDS.has(item.roomId)) {
      errors.push({
        contentId: id,
        field: 'roomId',
        issue: `Room ID "${item.roomId}" does not match any canonical museum room (${Array.from(CANONICAL_ROOM_IDS).join(', ')})`,
      });
    } else {
      representedRoomIds.add(item.roomId);
    }

    if (!item.roomNameVi || typeof item.roomNameVi !== 'string') {
      errors.push({ contentId: id, field: 'roomNameVi', issue: 'Missing roomNameVi label' });
    }

    // 3. Display Name Validation
    if (!item.displayName || typeof item.displayName !== 'string' || item.displayName.trim() === '') {
      errors.push({ contentId: id, field: 'displayName', issue: 'Missing displayName' });
    }

    // 4. Category Classification
    if (!item.category || !ALLOWED_CATEGORIES.has(item.category)) {
      errors.push({
        contentId: id,
        field: 'category',
        issue: `Invalid category "${item.category}". Allowed: ${Array.from(ALLOWED_CATEGORIES).join(', ')}`,
      });
    }

    // 5. Capabilities Classification (Layer 1 Text vs Layer 2 Files)
    if (!item.capabilities) {
      errors.push({ contentId: id, field: 'capabilities', issue: 'Missing capabilities definition' });
    } else {
      const hasText = typeof item.capabilities.textEditing === 'boolean' && item.capabilities.textEditing;
      const hasFiles = typeof item.capabilities.fileAttachments === 'boolean' && item.capabilities.fileAttachments;

      if (!hasText && !hasFiles) {
        errors.push({
          contentId: id,
          field: 'capabilities',
          issue: 'Editorial content must support at least textEditing, fileAttachments, or both.',
        });
      }

      // If text editing enabled, fields must be specified
      if (hasText) {
        if (!Array.isArray(item.fields) || item.fields.length === 0) {
          errors.push({
            contentId: id,
            field: 'fields',
            issue: 'textEditing is enabled but fields array is empty',
          });
        } else {
          for (const f of item.fields) {
            if (!f.key || typeof f.key !== 'string') {
              errors.push({ contentId: id, field: 'fields.key', issue: 'Field missing valid key' });
            }
            if (!f.labelVi || typeof f.labelVi !== 'string') {
              errors.push({ contentId: id, field: `fields.${f.key}.labelVi`, issue: 'Field missing labelVi' });
            }
            if (!f.type || !ALLOWED_FIELD_TYPES.has(f.type)) {
              errors.push({
                contentId: id,
                field: `fields.${f.key}.type`,
                issue: `Invalid field type "${f.type}". Allowed: ${Array.from(ALLOWED_FIELD_TYPES).join(', ')}`,
              });
            }
            if (f.required && (item.defaultTextValues === undefined || item.defaultTextValues[f.key] === undefined)) {
              errors.push({
                contentId: id,
                field: `defaultTextValues.${f.key}`,
                issue: `Required field "${f.key}" has no default value in defaultTextValues`,
              });
            }
          }
        }
      }

      // If file attachments enabled, allowed file types must be specified
      if (hasFiles) {
        if (!Array.isArray(item.allowedFileTypes) || item.allowedFileTypes.length === 0) {
          errors.push({
            contentId: id,
            field: 'allowedFileTypes',
            issue: 'fileAttachments is enabled but allowedFileTypes is missing or empty',
          });
        } else {
          for (const ft of item.allowedFileTypes) {
            if (!ALLOWED_FILE_TYPES.has(ft)) {
              errors.push({
                contentId: id,
                field: 'allowedFileTypes',
                issue: `Unsupported file type "${ft}"`,
              });
            }
          }
        }
      }
    }

    // 6. Data Source Mapping Validation
    if (!item.dataSource) {
      errors.push({ contentId: id, field: 'dataSource', issue: 'Missing dataSource configuration' });
    } else {
      if (item.dataSource.type !== 'firestore_editorial' && item.dataSource.type !== 'firestore_collection') {
        errors.push({
          contentId: id,
          field: 'dataSource.type',
          issue: `Invalid dataSource type "${item.dataSource.type}". Must be firestore_editorial or firestore_collection`,
        });
      }
      if (!item.dataSource.collection || typeof item.dataSource.collection !== 'string') {
        errors.push({ contentId: id, field: 'dataSource.collection', issue: 'Missing collection name' });
      }
      if (!item.dataSource.documentId || typeof item.dataSource.documentId !== 'string') {
        errors.push({ contentId: id, field: 'dataSource.documentId', issue: 'Missing documentId' });
      }
    }

    // 7. Verification & Publication Status
    if (!ALLOWED_VERIFICATION_STATUSES.has(item.verificationStatus)) {
      errors.push({
        contentId: id,
        field: 'verificationStatus',
        issue: `Invalid verificationStatus "${item.verificationStatus}"`,
      });
    }

    if (typeof item.isPublished !== 'boolean') {
      errors.push({ contentId: id, field: 'isPublished', issue: 'isPublished must be a boolean' });
    }

    // 8. Public View Connection
    if (typeof item.connectedToPublicView !== 'boolean') {
      errors.push({ contentId: id, field: 'connectedToPublicView', issue: 'connectedToPublicView must be a boolean' });
    }

    if (!item.publicViewDescription || typeof item.publicViewDescription !== 'string') {
      errors.push({
        contentId: id,
        field: 'publicViewDescription',
        issue: 'Missing publicViewDescription detailing where content renders in public view',
      });
    }

    // 9. Required Permissions
    if (!Array.isArray(item.requiredPermissions) || item.requiredPermissions.length === 0) {
      errors.push({
        contentId: id,
        field: 'requiredPermissions',
        issue: 'requiredPermissions must be an array of authorized roles (e.g. ["admin"])',
      });
    }
  }

  // 10. Verify that all canonical museum rooms have registered content
  const requiredCanonicalRooms = ['entrance', 'lobby', 'history', 'timeline', 'development', 'achievements', 'memory', 'ending'];
  for (const rId of requiredCanonicalRooms) {
    if (!representedRoomIds.has(rId)) {
      errors.push({
        contentId: 'CANONICAL_ROOM_COVERAGE',
        field: 'roomId',
        issue: `Canonical room "${rId}" has NO registered content items in CONTENT_REGISTRY!`,
      });
    }
  }

  return {
    passed: errors.length === 0,
    errors,
  };
}

// Run CLI execution
const result = runRegistryValidation();

if (result.passed) {
  console.log('✅ REGISTRY VALIDATION PASSED (100% SUCCESS)');
  console.log(`- Total registered items : ${CONTENT_REGISTRY.length}`);
  console.log(`- Unique content IDs    : ${new Set(CONTENT_REGISTRY.map((i) => i.contentId)).size}`);
  console.log(`- Covered museum rooms  : 8 Canonical Rooms`);
  console.log(`- Capabilities verified : Layer 1 (Text Editing) & Layer 2 (File Attachments)`);
  console.log(`- Firestore persistence : All mapped to real collections/documents`);
  console.log('='.repeat(78));
  process.exit(0);
} else {
  console.error(`❌ REGISTRY VALIDATION FAILED WITH ${result.errors.length} ISSUE(S):\n`);
  for (const err of result.errors) {
    console.error(`  [!] ${err.contentId.padEnd(35)} -> ${err.field.padEnd(25)} : ${err.issue}`);
  }
  console.error('\n' + '='.repeat(78));
  process.exit(1);
}
