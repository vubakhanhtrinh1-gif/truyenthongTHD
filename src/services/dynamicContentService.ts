/**
 * Dynamic Editorial Content Service & Hooks
 * Connects public museum scenes and components directly to Cloud Firestore editorial_contents.
 * Guarantees zero code builds or manual updates needed for content changes.
 */

import { useState, useEffect } from 'react';
import { StoredEditorialContent, FileAttachment } from '../types/contentRegistry';
import { editorialContentRepository } from '../repositories/editorialContentRepository';

/**
 * Universal hook for subscribing to a single registered editorial content record
 */
export function useEditorialItem<T extends Record<string, any>>(
  contentId: string,
  defaultValues: T
): { data: T; attachments: FileAttachment[]; isLoaded: boolean } {
  const [data, setData] = useState<T>(defaultValues);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Load initial + listen to updates
    const unsubscribe = editorialContentRepository.subscribeContent(
      contentId,
      (stored: StoredEditorialContent | null) => {
        if (!isMounted) return;
        if (stored && stored.isPublished && stored.textValues) {
          setData({ ...defaultValues, ...(stored.textValues as Partial<T>) });
          if (stored.attachments) {
            setAttachments(stored.attachments);
          }
        } else {
          setData(defaultValues);
          setAttachments([]);
        }
        setIsLoaded(true);
      },
      (err: any) => {
        console.warn(`Dynamic subscription fallback for ${contentId}:`, err);
        if (isMounted) setIsLoaded(true);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [contentId]);

  return { data, attachments, isLoaded };
}

/**
 * Hook for subscribing to all editorial content items within a specific room
 */
export function useRoomEditorialMap(roomId: string): {
  itemsMap: Map<string, StoredEditorialContent>;
  isLoaded: boolean;
} {
  const [itemsMap, setItemsMap] = useState<Map<string, StoredEditorialContent>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const unsubscribe = editorialContentRepository.subscribeByRoom(
      roomId,
      (items: StoredEditorialContent[]) => {
        if (!isMounted) return;
        const map = new Map<string, StoredEditorialContent>();
        for (const item of items) {
          if (item.isPublished) {
            map.set(item.contentId, item);
          }
        }
        setItemsMap(map);
        setIsLoaded(true);
      },
      (err: any) => {
        console.warn(`Room subscription fallback for ${roomId}:`, err);
        if (isMounted) setIsLoaded(true);
      }
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [roomId]);

  return { itemsMap, isLoaded };
}
