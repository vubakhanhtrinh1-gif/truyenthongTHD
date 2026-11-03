/**
 * Dynamic Editorial Service for Zone 2: Development Room (1974–2026)
 * Merges Cloud Firestore editorial_contents over ZONE_2_DEVELOPMENT_CONTENT
 * Guarantees zero code rebuilds needed for school administrators to update historical content.
 */

import { useState, useEffect } from 'react';
import {
  ZONE_2_DEVELOPMENT_CONTENT,
  Zone2DevelopmentData,
} from '../config/developmentContentData';
import { StoredEditorialContent } from '../../../types/contentRegistry';
import { editorialContentRepository } from '../../../repositories/editorialContentRepository';

export function mergeDevelopmentContent(
  base: Zone2DevelopmentData,
  storedItems: StoredEditorialContent[]
): Zone2DevelopmentData {
  if (!storedItems || storedItems.length === 0) return base;

  const merged: Zone2DevelopmentData = JSON.parse(JSON.stringify(base));

  for (const item of storedItems) {
    if (!item.isPublished || !item.textValues) continue;
    const tv = item.textValues;

    if (item.contentId === 'development.growth_overview') {
      if (tv.titleVi) merged.thematicTitleVi = tv.titleVi;
      if (tv.summaryVi) merged.coreMottoVi = tv.summaryVi;
      if (tv.coreMottoVi) merged.coreMottoVi = tv.coreMottoVi;
    }

    if (item.contentId === 'development.era1_consolidation') {
      if (tv.titleVi) merged.eraOne.titleVi = tv.titleVi;
      if (tv.descriptionVi) merged.eraOne.descriptionVi = tv.descriptionVi;
    }

    if (item.contentId === 'development.era2_growth') {
      if (tv.titleVi) merged.eraTwo.titleVi = tv.titleVi;
      if (tv.descriptionVi) merged.eraTwo.descriptionVi = tv.descriptionVi;
    }

    if (item.contentId === 'development.era3_future') {
      if (tv.titleVi) merged.eraThree.titleVi = tv.titleVi;
      if (tv.descriptionVi) merged.eraThree.descriptionVi = tv.descriptionVi;
    }

    if (item.contentId === 'development.statistics_comparison') {
      if (tv.titleVi) merged.statistics.titleVi = tv.titleVi;
    }

    if (item.contentId === 'development.digital_management') {
      if (tv.titleVi) merged.digitalTransformation.titleVi = tv.titleVi;
      if (tv.onlineLessonPlanning) merged.digitalTransformation.onlineLessonPlanning = tv.onlineLessonPlanning;
      if (tv.lmsTraining) merged.digitalTransformation.lmsTraining = tv.lmsTraining;
      if (tv.professionalStudy) merged.digitalTransformation.professionalStudy = tv.professionalStudy;
    }

    if (item.contentId === 'development.leadership_heritage') {
      if (tv.titleVi) merged.leadershipHeritage.titleVi = tv.titleVi;
      if (tv.historicalAssignmentNote) {
        merged.leadershipHeritage.historicalAssignmentNote = tv.historicalAssignmentNote;
      }
    }

    if (item.contentId === 'development.current_organization') {
      if (tv.titleVi) merged.currentOrganization.titleVi = tv.titleVi;
      if (tv.principal) merged.currentOrganization.principal = tv.principal;
    }

    if (item.contentId === 'development.motto_values') {
      if (tv.motto) merged.valuesAndMotto.motto = tv.motto;
      if (tv.explanationVi) merged.valuesAndMotto.explanationVi = tv.explanationVi;
    }

    if (item.contentId === 'development.tran_hung_dao_statue') {
      if (tv.titleVi) merged.tranHungDaoStatue.titleVi = tv.titleVi;
      if (tv.descriptionVi) merged.tranHungDaoStatue.descriptionVi = tv.descriptionVi;
      if (tv.sacredQuoteVi) merged.tranHungDaoStatue.sacredQuoteVi = tv.sacredQuoteVi;
      if (tv.significanceVi) merged.tranHungDaoStatue.significanceVi = tv.significanceVi;
      if (tv.inaugurationDate) merged.tranHungDaoStatue.inaugurationDate = tv.inaugurationDate;
    }

    if (item.contentId === 'development.duc_thanh_tran') {
      if (tv.captionVi) merged.ducThanhTran.captionVi = tv.captionVi;
      if (tv.sourceNote) merged.ducThanhTran.sourceNote = tv.sourceNote;
      if (item.attachments && item.attachments.length > 0) {
        merged.ducThanhTran.customUrl = item.attachments[0].downloadUrl;
      }
    }

    if (item.contentId === 'development.central_pillar_painting_1') {
      if (tv.titleVi) merged.centralPillarPaintings[0].titleVi = tv.titleVi;
      if (tv.captionVi) merged.centralPillarPaintings[0].captionVi = tv.captionVi;
      if (tv.descriptionVi) merged.centralPillarPaintings[0].descriptionVi = tv.descriptionVi;
      if (item.attachments && item.attachments.length > 0) {
        merged.centralPillarPaintings[0].customUrl = item.attachments[0].downloadUrl;
      }
    }

    if (item.contentId === 'development.central_pillar_painting_2') {
      if (tv.titleVi) merged.centralPillarPaintings[1].titleVi = tv.titleVi;
      if (tv.captionVi) merged.centralPillarPaintings[1].captionVi = tv.captionVi;
      if (tv.descriptionVi) merged.centralPillarPaintings[1].descriptionVi = tv.descriptionVi;
      if (item.attachments && item.attachments.length > 0) {
        merged.centralPillarPaintings[1].customUrl = item.attachments[0].downloadUrl;
      }
    }

    if (item.contentId === 'development.central_pillar_painting_3') {
      if (tv.titleVi) merged.centralPillarPaintings[2].titleVi = tv.titleVi;
      if (tv.captionVi) merged.centralPillarPaintings[2].captionVi = tv.captionVi;
      if (tv.descriptionVi) merged.centralPillarPaintings[2].descriptionVi = tv.descriptionVi;
      if (item.attachments && item.attachments.length > 0) {
        merged.centralPillarPaintings[2].customUrl = item.attachments[0].downloadUrl;
      }
    }

    if (item.contentId === 'development.award_prime_minister') {
      if (tv.titleVi) merged.centralRightAwards.primeMinisterAward.titleVi = tv.titleVi;
      if (tv.leadNarrativeVi) merged.centralRightAwards.primeMinisterAward.leadNarrativeVi = tv.leadNarrativeVi;
      if (tv.captionVi) merged.centralRightAwards.primeMinisterAward.captionVi = tv.captionVi;
      if (item.attachments && item.attachments.length > 0) {
        merged.centralRightAwards.primeMinisterAward.customUrl = item.attachments[0].downloadUrl;
      }
    }

    if (item.contentId === 'development.award_government_ministry_province') {
      if (tv.titleVi) merged.centralRightAwards.governmentMinistryProvinceAward.titleVi = tv.titleVi;
      if (tv.leadNarrativeVi) merged.centralRightAwards.governmentMinistryProvinceAward.leadNarrativeVi = tv.leadNarrativeVi;
      if (tv.captionVi) merged.centralRightAwards.governmentMinistryProvinceAward.captionVi = tv.captionVi;
      if (item.attachments && item.attachments.length > 0) {
        merged.centralRightAwards.governmentMinistryProvinceAward.customUrl = item.attachments[0].downloadUrl;
      }
    }

    if (item.contentId === 'development.award_three_labor_orders') {
      if (tv.titleVi) merged.centralRightAwards.threeLaborOrders.titleVi = tv.titleVi;
      if (tv.leadNarrativeVi) merged.centralRightAwards.threeLaborOrders.leadNarrativeVi = tv.leadNarrativeVi;
      if (tv.captionVi) merged.centralRightAwards.threeLaborOrders.captionVi = tv.captionVi;
      if (item.attachments && item.attachments.length > 0) {
        merged.centralRightAwards.threeLaborOrders.customUrl = item.attachments[0].downloadUrl;
      }
    }

    if (item.contentId === 'development.end_wall_photo_1') {
      if (tv.titleVi) merged.endWallPhotos[0].titleVi = tv.titleVi;
      if (tv.captionVi) merged.endWallPhotos[0].captionVi = tv.captionVi;
      if (tv.descriptionVi) merged.endWallPhotos[0].descriptionVi = tv.descriptionVi;
      if (item.attachments && item.attachments.length > 0) {
        merged.endWallPhotos[0].customUrl = item.attachments[0].downloadUrl;
      }
    }

    if (item.contentId === 'development.end_wall_photo_2') {
      if (tv.titleVi) merged.endWallPhotos[1].titleVi = tv.titleVi;
      if (tv.captionVi) merged.endWallPhotos[1].captionVi = tv.captionVi;
      if (tv.descriptionVi) merged.endWallPhotos[1].descriptionVi = tv.descriptionVi;
      if (item.attachments && item.attachments.length > 0) {
        merged.endWallPhotos[1].customUrl = item.attachments[0].downloadUrl;
      }
    }

    if (item.contentId === 'development.end_wall_photo_3') {
      if (tv.titleVi) merged.endWallPhotos[2].titleVi = tv.titleVi;
      if (tv.captionVi) merged.endWallPhotos[2].captionVi = tv.captionVi;
      if (tv.descriptionVi) merged.endWallPhotos[2].descriptionVi = tv.descriptionVi;
      if (item.attachments && item.attachments.length > 0) {
        merged.endWallPhotos[2].customUrl = item.attachments[0].downloadUrl;
      }
    }

    if (item.contentId === 'development.important_medals') {
      if (tv.groupTitle) merged.importantMedals.groupTitle = tv.groupTitle;
      if (tv.overviewVi) merged.importantMedals.overviewVi = tv.overviewVi;
    }
  }

  return merged;
}

/**
 * React hook for live binding Zone 2 Development content from Cloud Firestore
 */
export function useDevelopmentContent(): Zone2DevelopmentData {
  const [content, setContent] = useState<Zone2DevelopmentData>(ZONE_2_DEVELOPMENT_CONTENT);

  useEffect(() => {
    const unsubscribe = editorialContentRepository.subscribeByRoom(
      'development',
      (items) => {
        const merged = mergeDevelopmentContent(ZONE_2_DEVELOPMENT_CONTENT, items);
        setContent(merged);
      },
      (err) => {
        console.warn('Realtime development content subscription fallback:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  return content;
}
