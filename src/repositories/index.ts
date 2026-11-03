/**
 * Concrete Repositories for All Cosmic Heritage Entities
 */
import { BaseRepository } from './baseRepository';
import {
  Room,
  HistoryPeriod,
  TimelineEvent,
  DevelopmentMilestone,
  Artifact,
  Achievement,
  Person,
  Memory,
  NewsEvent,
  DigitalResource,
  Hotspot,
  Source,
  License,
  MediaAsset,
  Credit,
  SiteSettings,
  AdminUser,
} from '../types';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { handleFirestoreError, OperationType } from '../services/errorHandler';

export const roomRepository = new BaseRepository<Room>('rooms');
export const historyRepository = new BaseRepository<HistoryPeriod>('history_periods');
export const timelineRepository = new BaseRepository<TimelineEvent>('timeline_events');
export const developmentRepository = new BaseRepository<DevelopmentMilestone>('development_milestones');
export const artifactRepository = new BaseRepository<Artifact>('artifacts');
export const achievementRepository = new BaseRepository<Achievement>('achievements');
export const peopleRepository = new BaseRepository<Person>('people');
export const memoryRepository = new BaseRepository<Memory>('memories');
export const newsRepository = new BaseRepository<NewsEvent>('news_events');
export const resourceRepository = new BaseRepository<DigitalResource>('digital_resources');
export const hotspotRepository = new BaseRepository<Hotspot>('hotspots');
export const sourceRepository = new BaseRepository<Source>('sources');
export const licenseRepository = new BaseRepository<License>('licenses');
export const mediaRepository = new BaseRepository<MediaAsset>('media_assets');
export const creditRepository = new BaseRepository<Credit>('credits');
export const adminRepository = new BaseRepository<AdminUser>('admins');

/**
 * Site Settings Single-Document Repository
 */
export const siteSettingsRepository = {
  async getSettings(): Promise<SiteSettings | null> {
    try {
      const docRef = doc(db, 'site_settings', 'general');
      const snap = await getDoc(docRef);
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as SiteSettings;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'site_settings/general');
    }
  },

  async updateSettings(settings: Partial<SiteSettings>): Promise<void> {
    try {
      const docRef = doc(db, 'site_settings', 'general');
      const now = new Date().toISOString();
      await setDoc(docRef, { ...settings, updatedAt: now }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'site_settings/general');
    }
  },
};
