/**
 * Types and Capabilities for the Unified Museum Editorial Content Registry
 * Implements Layer 1 (Text Editing) & Layer 2 (File Attachments)
 */

export type ContentCapabilityType = 'text' | 'files' | 'both';

export type ContentCategory =
  | 'room_intro'
  | 'historical_narrative'
  | 'milestones'
  | 'exhibits'
  | 'artifacts'
  | 'hotspots'
  | 'media_documents'
  | 'audio_narration'
  | 'achievements'
  | 'biographies'
  | 'memorial';

export interface EditorialFieldDefinition {
  key: string;
  labelVi: string;
  labelEn?: string;
  type: 'text' | 'textarea' | 'date' | 'number' | 'select' | 'string_list';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  helpText?: string;
  rows?: number;
}

export interface FileAttachment {
  id: string;
  fileName: string;
  originalName?: string;
  downloadUrl: string;
  storagePath: string;
  mimeType: string;
  size: number;
  type: 'image' | 'audio' | 'video' | 'pdf' | 'document' | '3d_model';
  caption?: string;
  source?: string;
  uploadedAt: string;
  uploadedBy?: string;
}

export interface ContentRegistryItem {
  contentId: string;
  roomId: string;
  roomNameVi: string;
  sceneObjectId?: string;
  displayName: string;
  displayNameEn?: string;
  category: ContentCategory;
  categoryLabelVi: string;
  capabilities: {
    textEditing: boolean;
    fileAttachments: boolean;
  };
  dataSource: {
    type: 'firestore_editorial' | 'firestore_collection';
    collection: string;
    documentId: string;
  };
  fields: EditorialFieldDefinition[];
  allowedFileTypes?: ('image' | 'audio' | 'video' | 'pdf' | 'document' | '3d_model')[];
  defaultTextValues: Record<string, any>;
  defaultAttachments?: FileAttachment[];
  verificationStatus: 'verified' | 'unverified' | 'needs_review';
  isPublished: boolean;
  connectedToPublicView: boolean;
  publicViewDescription: string;
  requiredPermissions?: ('admin' | 'editor' | 'superadmin')[];
}

export interface StoredEditorialContent {
  id: string; // matches contentId
  contentId: string;
  roomId: string;
  sceneObjectId?: string;
  displayNameVi: string;
  category: string;
  textValues: Record<string, any>;
  attachments: FileAttachment[];
  verificationStatus: 'verified' | 'unverified' | 'needs_review';
  isPublished: boolean;
  notes?: string;
  createdAt?: string;
  updatedAt: string;
  updatedBy?: string;
}
