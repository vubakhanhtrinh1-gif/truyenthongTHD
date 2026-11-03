/**
 * Service for Dynamic History Room Content
 * Seamlessly merges Cloud Firestore editorial items over canonical ZONE_1_HISTORY_CONTENT
 * Enables direct content editing inside CMD Admin without rebuilding code.
 */

import { useState, useEffect } from 'react';
import { ZONE_1_HISTORY_CONTENT, Zone1HistoryData } from '../scenes/history/config/historyContentData';
import { StoredEditorialContent } from '../types/contentRegistry';
import { editorialContentRepository } from '../repositories/editorialContentRepository';

export function mergeHistoryContent(
  base: Zone1HistoryData,
  storedItems: StoredEditorialContent[]
): Zone1HistoryData {
  if (!storedItems || storedItems.length === 0) return base;

  // Clone base data
  const merged: Zone1HistoryData = JSON.parse(JSON.stringify(base));

  for (const item of storedItems) {
    if (!item.isPublished && !item.textValues) continue;
    const tv = item.textValues || {};

    if (item.contentId === 'history.section1_1_overview') {
      if (tv.decision) {
        merged.overview.decision = tv.decision;
      }
      if (tv.openingCeremony) {
        merged.overview.openingCeremony = tv.openingCeremony;
      }
      if (tv.foundingLocation) {
        merged.overview.foundingLocation = tv.foundingLocation;
      }
      if (tv.initialScale) {
        merged.overview.initialScale = tv.initialScale;
      }
      if (tv.principal) {
        merged.overview.firstLeadership.principal = tv.principal;
      }
      if (tv.vicePrincipal) {
        merged.overview.firstLeadership.vicePrincipal = tv.vicePrincipal;
      }
      if (tv.stabilization) {
        merged.overview.stabilization = tv.stabilization;
      }
      if (tv.periodName) {
        merged.overview.periodName = tv.periodName;
      }

      // Sync section1_1_overview items array
      merged.section1_1_overview.items = [
        { label: 'Thời điểm thành lập', value: merged.overview.decision },
        { label: 'Khai giảng khóa đầu', value: merged.overview.openingCeremony },
        { label: 'Nơi thành lập', value: merged.overview.foundingLocation },
        { label: 'Quy mô ngày đầu', value: merged.overview.initialScale },
        {
          label: 'Ban Giám hiệu đầu tiên',
          value: `Hiệu trưởng: ${merged.overview.firstLeadership.principal}. Phó Hiệu trưởng: ${merged.overview.firstLeadership.vicePrincipal}`,
        },
        { label: 'Ổn định địa điểm', value: merged.overview.stabilization },
        { label: 'Tên trường giai đoạn này', value: merged.overview.periodName },
      ];
    }

    if (item.contentId === 'history.section1_2_birth1966') {
      if (tv.title) {
        merged.section1_2_birth1966.title = tv.title;
      }
      if (tv.content) {
        merged.section1_2_birth1966.content = tv.content;
        merged.introduction = tv.content;
      }
    }

    if (item.contentId === 'history.section1_3_wartime') {
      if (tv.title) {
        merged.section1_3_wartimeTeaching.title = tv.title;
      }
      if (tv.description) {
        merged.section1_3_wartimeTeaching.description = tv.description;
        merged.wartimeTeaching.description = tv.description;
      }
      if (tv.bulletPoints) {
        const points = String(tv.bulletPoints)
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
        if (points.length > 0) {
          merged.section1_3_wartimeTeaching.bulletPoints = points;
          merged.wartimeTeaching.bulletPoints = points;
        }
      }
    }

    if (item.contentId === 'history.section1_4_relocations') {
      if (tv.title) {
        merged.section1_4_fiveRelocations.title = tv.title;
      }
      if (tv.summaryRoute) {
        merged.section1_4_fiveRelocations.summaryRoute = tv.summaryRoute;
        merged.fiveRelocations.route = tv.summaryRoute;
      }
      if (tv.settlement1974) {
        merged.section1_4_fiveRelocations.settlement1974 = tv.settlement1974;
        merged.fiveRelocations.settlement1974 = tv.settlement1974;
      }
      if (tv.schoolYear1974_1975) {
        merged.section1_4_fiveRelocations.schoolYear1974_1975 = tv.schoolYear1974_1975;
        merged.fiveRelocations.schoolYear1974_1975 = tv.schoolYear1974_1975;
      }
    }

    if (item.contentId === 'history.section1_5_martyrs') {
      if (tv.title) {
        merged.section1_5_militaryEnlistment.title = tv.title;
      }
      if (tv.content) {
        merged.section1_5_militaryEnlistment.content = tv.content;
      }
      if (tv.martyrsList) {
        const list = String(tv.martyrsList)
          .split('\n')
          .map((s) => s.trim())
          .filter(Boolean);
        if (list.length > 0) {
          merged.section1_5_militaryEnlistment.martyrs = list;
        }
      }
      if (tv.verificationNote) {
        merged.section1_5_militaryEnlistment.note = tv.verificationNote;
      }
    }

    if (item.contentId === 'history.foundation_people') {
      if (tv.title) merged.foundationPeople.title = tv.title;
      if (tv.principal && merged.foundationPeople.leaders[0]) {
        merged.foundationPeople.leaders[0].name = tv.principal;
      }
      if (tv.vicePrincipal && merged.foundationPeople.leaders[1]) {
        merged.foundationPeople.leaders[1].name = tv.vicePrincipal;
      }
      if (tv.firstTeachersNote && merged.foundationPeople.firstTeachers[0]) {
        merged.foundationPeople.firstTeachers[0].note = tv.firstTeachersNote;
      }
      if (tv.historicRole) {
        (merged.foundationPeople as any).historicRole = tv.historicRole;
      }
      if (item.attachments && item.attachments.length > 0) {
        const images = item.attachments.filter(
          (a) => a.type === 'image' || (a.downloadUrl && (a.downloadUrl.includes('image') || a.downloadUrl.startsWith('data:image/')))
        );
        if (images[0] && merged.foundationPeople.leaders[0]) {
          (merged.foundationPeople.leaders[0] as any).imageUrl = images[0].downloadUrl;
        }
        if (images[1] && merged.foundationPeople.leaders[1]) {
          (merged.foundationPeople.leaders[1] as any).imageUrl = images[1].downloadUrl;
        }
      }
    }

    if (item.contentId === 'history.artifacts') {
      if (tv.artifact1_decision && merged.artifacts[0]) {
        merged.artifacts[0].description = tv.artifact1_decision;
      }
      if (tv.artifact2_langXa && merged.artifacts[1]) {
        merged.artifacts[1].description = tv.artifact2_langXa;
      }
      if (tv.artifact3_trenchClass && merged.artifacts[2]) {
        merged.artifacts[2].description = tv.artifact3_trenchClass;
      }
      if (tv.artifact4_martyrs && merged.artifacts[3]) {
        merged.artifacts[3].description = tv.artifact4_martyrs;
      }
      if (tv.artifact5_certificate && merged.artifacts[4]) {
        merged.artifacts[4].description = tv.artifact5_certificate;
      }
    }
  }

  return merged;
}

/**
 * React Hook for real-time history content binding
 */
export function useHistoryContent(): Zone1HistoryData {
  const [content, setContent] = useState<Zone1HistoryData>(ZONE_1_HISTORY_CONTENT);

  useEffect(() => {
    const unsubscribe = editorialContentRepository.subscribeAll(
      (items) => {
        const merged = mergeHistoryContent(ZONE_1_HISTORY_CONTENT, items);
        setContent(merged);
      },
      (err) => {
        console.warn('Realtime history content subscription failed, using fallback:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  return content;
}
