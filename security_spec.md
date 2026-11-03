# Security Specification & Test Suite for Cosmic Heritage

## 1. Data Invariants
- **Identity Invariant**: Only authenticated users with an authorized record in `/admins/{uid}` or the bootstrapped administrator email can perform write operations (create, update, delete) on any collection.
- **Admin Registry Invariant**: Ordinary visitors or newly registered accounts cannot create, elevate, or modify their own or others' records in `/admins/{uid}`.
- **Public Read Invariant**: Unauthenticated or normal public visitors can ONLY read published content (`isPublished == true`) in exhibition-related collections. Draft or unpublished content is shielded from the public.
- **Verification Integrity**: Any content claiming `verificationStatus: 'verified'` must be curated strictly by authorized administrators.
- **Historical Immutability**: Historical artifacts, timeline events, and history periods cannot be overwritten by unauthorized actors.
- **Audit Traceability**: CreatedBy, updatedBy, createdAt, and updatedAt fields reflect authoritative administration.

## 2. The "Dirty Dozen" Malicious Payloads

1. **Self-Escalation Attack**: Anonymous visitor attempts `create` on `/admins/attacker_uid` with `{ role: "ADMIN", isActive: true }`. Expected: `PERMISSION_DENIED`.
2. **Public Bypass Write on Artifacts**: Unauthenticated visitor attempts `create` on `/artifacts/fake_artifact` with `{ titleVi: "Fake Artifact", isPublished: true }`. Expected: `PERMISSION_DENIED`.
3. **Privilege Tampering on Timeline**: Authenticated visitor (non-admin) attempts `update` on `/timeline_events/event_1966` to alter historical facts. Expected: `PERMISSION_DENIED`.
4. **Unpublished Content Scraping**: Public unauthenticated client queries `/artifacts` where `isPublished == false`. Expected: `PERMISSION_DENIED`.
5. **Site Settings Hijack**: Malicious user attempts `setDoc` on `/site_settings/general` to activate `maintenanceMode: true` or deface title. Expected: `PERMISSION_DENIED`.
6. **Malicious Hotspot Injection**: Attacker injects a phishing URL inside `/hotspots/phish_hotspot`. Expected: `PERMISSION_DENIED`.
7. **Source Falsification**: Attacker attempts to overwrite `/sources/archival_source_1` with fabricated references. Expected: `PERMISSION_DENIED`.
8. **AI Disclosure Removal**: Attacker attempts to set `aiGenerated: false` on an asset in `/licenses/license_ai_1` without authorization. Expected: `PERMISSION_DENIED`.
9. **Media Metadata Poisoning**: Attacker deletes legitimate file records from `/media_assets/photo_60th`. Expected: `PERMISSION_DENIED`.
10. **Room Configuration Tampering**: Attacker sets `status: 'completed'` on unbuilt room `/rooms/vr_ar`. Expected: `PERMISSION_DENIED`.
11. **Admin Impersonation via Custom Payload**: Attacker submits request with custom header or body claiming `role: 'ADMIN'`. Expected: `PERMISSION_DENIED`.
12. **Denial-of-Wallet Long ID Injection**: Attacker attempts `setDoc` with 2000-character junk document ID to exhaust Firestore resources. Expected: `PERMISSION_DENIED`.

## 3. Security Assertions & Fortress Enforcement
- `match /{document=**} { allow read, write: if false; }` ensures default-deny posture.
- `isAdmin()` verifies existence in `/admins/$(request.auth.uid)` or bootstrapped admin email with valid authentication.
- Strict path ID validation with `isValidId(id)` prevents path injection attacks.
