/**
 * Data Models for Zone 2: Development Room (1974–2026)
 * COSMIC HERITAGE — TRƯỜNG THPT A TRẦN HƯNG ĐẠO
 */

export interface DucThanhTranConfig {
  imageUrl?: string;
  storagePath?: string;
  captionVi: string;
  captionEn?: string;
  sourceNote: string;
  statueSpecs: {
    material: string;
    height: string;
    weight: string;
    foundry: string;
    sculptor: string;
    inaugurationDate: string;
    occasion: string;
  };
  updatedAt?: string;
  uploadedBy?: string;
}

export interface ImportantMedalItem {
  id: string;
  titleVi: string;
  titleEn?: string;
  year: number | string;
  descriptionVi: string;
  significanceVi?: string;
  source: string;
  imageUrl?: string;
  storagePath?: string;
  displayOrder: number;
  isPublished: boolean;
  verificationStatus: 'verified' | 'needs_review';
}

export interface LeadershipProfile {
  id: string;
  order: number;
  name: string;
  role: string;
  period: string;
  noteVi: string;
  biographyVi?: string;
  imageUrl?: string;
  storagePath?: string;
  isCurrentLeadership: boolean;
  verificationStatus: 'verified' | 'needs_review';
}

export interface HistoryEraItem {
  id: 'era1' | 'era2' | 'era3';
  code: string;
  titleVi: string;
  titleEn: string;
  periodLabel: string;
  headingVi: string;
  summaryVi: string;
  descriptionVi: string;
  imageUrl?: string;
  storagePath?: string;
  milestones: Array<{
    year: string | number;
    titleVi: string;
    descriptionVi: string;
    significanceVi?: string;
    sourceNote?: string;
  }>;
}

export interface Khu2CompleteData {
  ducThanhTran: DucThanhTranConfig;
  historyEras: {
    era1: HistoryEraItem;
    era2: HistoryEraItem;
    era3: HistoryEraItem;
  };
  medals: ImportantMedalItem[];
  leadership: {
    current: LeadershipProfile[];
    historical: LeadershipProfile[];
  };
}
