# INSTRUCTIONS FOR ALL AI AGENTS & BUILD ENGINES

## VIRTUAL SCHOOL MUSEUM — COSMIC HERITAGE (TRƯỜNG THPT A TRẦN HƯNG ĐẠO)

> **CRITICAL INSTRUCTION FOR ALL AI ASSISTANTS:**  
> Before modifying, adding, or deleting any file in this repository, you **MUST** read and adhere to `AI_PROJECT_RULES.md`.

---

### MANDATORY AGENT DIRECTIVES

1. **READ-BEFORE-WRITE ON PROJECT RULES:**
   - Any AI agent receiving a user request in this repository must first consult `AI_PROJECT_RULES.md`.
   - Never ignore content registration when building or updating 3D rooms, UI components, datasets, or hotspots.

2. **AUTOMATIC CONTENT REGISTRATION (ZERO PROMPT RELIANCE):**
   - Even if the user prompt does not mention "CMD Admin", "database", or "registry", whenever you alter or add any museum-related text, exhibit, or media, you MUST:
     1. Register or update the record in `src/registry/contentRegistry.ts`.
     2. Classify its capabilities: Layer 1 (Text Editing) and/or Layer 2 (File Attachments).
     3. Bind the public component using real-time dynamic hooks (`useEditorialItem`, `useHistoryContent`).
     4. Ensure it is manageable in CMD Admin under **QUẢN LÝ NỘI DUNG**.

3. **NEVER SIMULATE PERSISTENCE:**
   - Persistence is implemented through real Cloud Firestore (`editorial_contents/{contentId}`) and Firebase Storage.
   - Do NOT replace real database operations with temporary `localStorage`, component state mockups, or in-memory arrays.

4. **RUN AUTOMATED VALIDATION:**
   - After completing your changes, run:
     ```bash
     npm run validate:content
     npm run lint
     ```
   - Ensure the validator outputs `REGISTRY VALIDATION PASSED (100% SUCCESS)`.

5. **PRESERVE CANONICAL ROOMS & ARCHITECTURE:**
   - Reuse existing room identifiers (`entrance`, `lobby`, `history`, `timeline`, `development`, `achievements`, `memory`, `vr_ar`, `ending`).
   - Do not invent parallel CMS architectures or modify Three.js geometries merely to register content.
