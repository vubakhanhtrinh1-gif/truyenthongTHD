/**
 * COSMIC HERITAGE – DẤU ẤN 60 NĂM (1966–2026)
 * TRƯỜNG THPT A TRẦN HƯNG ĐẠO
 * Core TypeScript Data Models for Cloud Firestore
 */

export type VerificationStatus = 'unverified' | 'verified' | 'needs_review';

export type RoomStatus = 'planned' | 'draft' | 'in_progress' | 'completed';

export type ArtifactType =
  | 'medal'
  | 'certificate'
  | 'document'
  | 'photo'
  | 'photo_album'
  | 'object'
  | 'other';

export type TimelineCategory =
  | 'foundation'
  | 'war_period'
  | 'development'
  | 'achievement'
  | 'milestone'
  | 'anniversary'
  | 'other';

export type AchievementCategory =
  | 'school'
  | 'academic'
  | 'student'
  | 'science'
  | 'arts'
  | 'sports'
  | 'youth'
  | 'other'
  | 'labor_medal'
  | 'independence_medal'
  | 'prime_minister'
  | 'ministry_local'
  | 'other_award'
  | 'academic_olympiad'
  | 'stem_science'
  | 'graduation_exam';

export type SourceType =
  | 'school_document'
  | 'official_document'
  | 'photo'
  | 'interview'
  | 'book'
  | 'website'
  | 'archive'
  | 'other';

export type MediaType =
  | 'image'
  | 'panorama'
  | 'audio'
  | 'video'
  | 'pdf'
  | 'document'
  | '3d_model';

export type DigitalResourceType =
  | 'video'
  | 'podcast'
  | 'document'
  | 'online_archive'
  | 'external_reference'
  | 'source_material';

export interface AdminUser {
  id: string; // Firebase Auth UID
  uid: string;
  email: string;
  role: 'ADMIN';
  displayName: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: string;
  projectTitle: string;
  projectSubtitle: string;
  tagline: string;
  schoolName: string;
  defaultLanguage: 'vi' | 'en';
  supportedLanguages: string[];
  welcomeMessageVi: string;
  welcomeMessageEn: string;
  contactInformation: string;
  maintenanceMode: boolean;
  updatedAt: string;
}

export interface SchoolBranding {
  id?: string;
  logoUrl: string;
  storagePath?: string;
  fileName: string;
  fileSize: number;
  dimensions?: { width: number; height: number };
  mimeType: string;
  updatedAt: string;
  uploadedBy?: string;
}

export interface Room {
  id: string; // Stable ID: 'gate' | 'lobby' | 'history' | 'timeline' | 'development' | 'achievements' | 'memory' | 'ending'
  nameVi: string;
  nameEn: string;
  slug: string;
  descriptionVi: string;
  descriptionEn: string;
  displayOrder: number;
  status: RoomStatus;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryPeriod {
  id: string;
  titleVi: string;
  titleEn: string;
  yearStart: number;
  yearEnd: number;
  subtitleVi: string;
  subtitleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  storyVi: string;
  storyEn: string;
  imageGallery: string[];
  audioUrl?: string;
  videoUrl?: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  date?: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  category: TimelineCategory;
  imageGallery: string[];
  audioUrl?: string;
  videoUrl?: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface DevelopmentMilestone {
  id: string;
  titleVi: string;
  titleEn: string;
  period: string; // e.g. "1966 - 1975"
  yearStart: number;
  yearEnd?: number;
  descriptionVi: string;
  descriptionEn: string;
  imageGallery: string[];
  audioUrl?: string;
  videoUrl?: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Artifact {
  id: string;
  type: ArtifactType;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  year?: number;
  descriptionVi: string;
  descriptionEn: string;
  storyVi: string;
  storyEn: string;
  imageGallery: string[];
  captionVi: string;
  captionEn: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Achievement {
  id: string;
  titleVi: string;
  titleEn: string;
  year: number;
  date?: string;
  authorityVi?: string;
  authorityEn?: string;
  badgeType?: string;
  category: AchievementCategory;
  descriptionVi: string;
  descriptionEn: string;
  imageGallery: string[];
  documentUrl?: string;
  sourceIds: string[];
  featuredInHonorWall?: boolean;
  verificationStatus: VerificationStatus;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Person {
  id: string;
  name: string;
  roleVi: string;
  roleEn: string;
  period: string; // e.g., "1966-1972" or "Khóa 1980-1983"
  shortBioVi: string;
  shortBioEn: string;
  bioVi: string;
  bioEn: string;
  imageUrl?: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Memory {
  id: string;
  titleVi: string;
  titleEn: string;
  author: string;
  generation?: string;
  year?: number;
  contentVi: string;
  contentEn: string;
  imageGallery: string[];
  audioUrl?: string;
  videoUrl?: string;
  sourceIds: string[];
  verificationStatus: VerificationStatus;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface NewsEvent {
  id: string;
  titleVi: string;
  titleEn: string;
  summaryVi: string;
  summaryEn: string;
  contentVi: string;
  contentEn: string;
  coverImage?: string;
  imageGallery: string[];
  publishedDate: string;
  category: string;
  sourceIds: string[];
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface DigitalResource {
  id: string;
  type: DigitalResourceType;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  url: string;
  thumbnailUrl?: string;
  sourceIds: string[];
  licenseIds: string[];
  year?: number;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface Hotspot {
  id: string;
  roomId: string; // Maps to stable room IDs e.g. 'history', 'lobby'
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
  descriptionEn: string;
  mediaAssetIds: string[];
  audioUrl?: string;
  sourceIds: string[];
  displayOrder: number;
  isPublished: boolean;
  verificationStatus: VerificationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface Source {
  id: string;
  title: string;
  type: SourceType;
  organization: string;
  author: string;
  date: string;
  url?: string;
  description: string;
  referenceCode: string; // e.g. "TL-THD-1966-01"
  verificationStatus: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface License {
  id: string;
  assetName: string;
  assetType: string;
  creator: string;
  licenseType: string;
  licenseUrl?: string;
  sourceUrl?: string;
  aiGenerated: boolean;
  aiTool?: string;
  aiDisclosure?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MediaAsset {
  id: string;
  fileName: string;
  storagePath: string;
  downloadUrl: string;
  type: MediaType;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  altTextVi: string;
  altTextEn: string;
  sourceIds: string[];
  licenseIds: string[];
  aiGenerated: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

export interface Credit {
  id: string;
  name: string;
  role: string;
  organization: string;
  description: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}
