# AI PROJECT RULES — MANDATORY GLOBAL GOVERNANCE

## AUTOMATIC CONTENT DISCOVERY, REGISTRATION, AND CMD EDITABILITY

> **STATUS:** PERMANENT ARCHITECTURAL REQUIREMENT  
> **SCOPE:** ENTIRE VIRTUAL SCHOOL MUSEUM PROJECT (COSMIC HERITAGE — 60 NĂM TRƯỜNG THPT A TRẦN HƯNG ĐẠO)  
> **APPLICABILITY:** ALL CURRENT AND FUTURE AI AGENTS, DEVELOPERS, AND IMPLEMENTATION SESSIONS.

---

### 1. MANDATORY GLOBAL INVARIANT

Whenever you create, modify, migrate, or integrate museum-related content, you **MUST** identify all editorial content affected by your changes, classify its editing capabilities, and register it with the shared CMD Admin content-management system.

This requirement applies to:
- All rooms (`entrance`, `lobby`, `history`, `timeline`, `development`, `achievements`, `memory`, `ending`).
- All 3D scene objects and interactive hotspots (monuments, plaques, models, exhibit stands).
- All descriptions, timeline entries, narratives, biographies, honors, and exhibits.
- All media references (images, audio narration, video clips, archival PDFs, 3D models).

**DO NOT rely on individual prompts to remind you of this requirement.** Any implementation that introduces editorial text or media without registering it in `src/registry/contentRegistry.ts` and connecting it to Firestore `editorial_contents` violates project governance.

---

### 2. REQUIRED CONTENT CLASSIFICATION

Every applicable editorial content record must be classified into two independent capabilities:

1. **TEXT EDITING (Layer 1):** Titles, subtitles, narratives, descriptions, captions, dates, labels, source notes, and custom editorial fields.
2. **FILE UPLOAD / ATTACHMENT (Layer 2):** Images, archival PDF scans, audio recordings, video clips, and 3D assets stored in Firebase Storage.

A content record may support text editing, file attachments, or both.

#### Architectural Boundary:
- **Editorial Content (Managed via CMD):** Text copy, historical narratives, exhibit captions, images, PDFs, audio.
- **Structural Code (Immutable Codebase):** Three.js 3D geometry, mesh vertex shaders, camera collision math, routing, Firebase Auth security rules, service credentials, technical configuration. Never expose structural code through content editing fields.

---

### 3. STABLE IDENTIFIERS & SHARED REGISTRY

Every editorial item in `src/registry/contentRegistry.ts` must maintain an explicit mapping:

```typescript
export interface ContentRegistryItem {
  contentId: string;              // e.g., 'history.section1_1_overview' (unique, permanent)
  roomId: string;                 // canonical room id ('entrance', 'lobby', 'history', etc.)
  roomNameVi: string;             // human-readable room name in Vietnamese
  sceneObjectId?: string;         // 3D scene object id when placed in a 3D environment
  displayName: string;            // human-readable title in Vietnamese
  displayNameEn?: string;          // English title
  category: ContentCategory;      // 'historical_narrative' | 'artifacts' | 'milestones' | ...
  categoryLabelVi: string;        // category label in Vietnamese
  capabilities: {
    textEditing: boolean;         // Layer 1 capability
    fileAttachments: boolean;     // Layer 2 capability
  };
  dataSource: {
    type: 'firestore_editorial';  // Real database type
    collection: string;           // 'editorial_contents'
    documentId: string;           // matches contentId
  };
  fields: EditorialFieldDefinition[]; // form schema for text editing
  allowedFileTypes?: ('image' | 'audio' | 'video' | 'pdf' | 'document' | '3d_model')[];
  defaultTextValues: Record<string, any>;
  defaultAttachments?: FileAttachment[];
  verificationStatus: 'verified' | 'unverified' | 'needs_review';
  isPublished: boolean;
  connectedToPublicView: boolean;
  publicViewDescription: string;  // exact scene/component location where content renders
  requiredPermissions: ('admin' | 'editor' | 'superadmin')[];
}
```

**Rule:** Never invent fictitious collection names or duplicate existing IDs. Always reuse established identifiers.

---

### 4. DIRECT CMD INTEGRATION & ZERO-REBUILD PERSISTENCE

Every registered content record is managed directly inside the CMD Admin interface:
1. Authorized school administrators select the item in **QUẢN LÝ NỘI DUNG**.
2. They edit text fields and/or upload attachments via `ContentDetailEditorModal`.
3. Changes save directly to Cloud Firestore collection `editorial_contents/{contentId}` and Firebase Storage.
4. Changes persist across reloads and propagate in real time to the public museum views (History 3D room, Main Hall, Entrance, Orbital Timeline, etc.) via reactive hooks (`useHistoryContent`, `useEditorialItem`, `useRoomEditorialMap`).
5. **No Google AI Studio prompt, no code editing, and no application rebuild is needed for school admins to manage museum content.**

---

### 5. AUTOMATED VALIDATION ENFORCEMENT

Run automated validation after any content change:

```bash
npm run validate:content
```

The validator (`scripts/validateContentRegistry.ts`) checks:
- Content IDs are 100% unique and stable.
- Room IDs match canonical room definitions (`entrance`, `lobby`, `history`, `timeline`, `development`, `achievements`, `memory`, `ending`).
- All canonical rooms have registered content.
- Data sources point to real Firestore collections and valid document IDs.
- Field definitions and required defaults match schema.
- Verification and publication flags are valid.
- `requiredPermissions` is explicitly declared.

---

### 6. WORKFLOW CHECKLIST FOR EVERY DEVELOPMENT TASK

Before modifying or creating museum components:
1. **Inspect:** Check existing `CONTENT_REGISTRY` in `src/registry/contentRegistry.ts`.
2. **Register:** Add any new room, hotspot, exhibit, or narrative to `CONTENT_REGISTRY`.
3. **Connect Public View:** Use `useEditorialItem` or `dynamicContentService` so edits in Firestore immediately take effect in the public UI.
4. **Validate:** Execute `npm run validate:content` and `npm run lint`.
5. **Report:** Clearly report registered items and validation results in task summaries.
