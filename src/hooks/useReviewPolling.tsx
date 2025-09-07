/**
 * useReviewPolling Hook
 * Real-time polling for review and rating updates
 */

import { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateBookRating } from '@/store/booksSlice';
import { booksService, reviewsService } from '@/services';

interface UseReviewPollingOptions {
  enabled?: boolean;
  interval?: number; // In milliseconds
  onError?: (error: Error) => void;
}

// interface ReviewMetadata {
//   averageRating: number;
//   totalReviews: number;
//   ratingDistribution?: {
//     5: number;
//     4: number;
//     3: number;
//     2: number;
//     1: number;
//   };
// }

export const useReviewPolling = (
  bookId: string | null,
  options: UseReviewPollingOptions = {}
) => {
  const {
    enabled = true,
    interval = 60000, // 60 seconds default (consistent with single book polling)
    onError
  } = options;

  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const pollReviewUpdates = useCallback(async () => {
    if (!bookId || !enabled) return;

    try {
      // Get updated book details with ratings
      const bookResponse = await booksService.getBookById(bookId);
      
      if (bookResponse) {
        // Update book rating in the store
        dispatch(updateBookRating({
          bookId,
          averageRating: parseFloat(bookResponse.average_rating),
          totalReviews: bookResponse.total_reviews
        }));

        // Optionally get detailed review metadata
        try {
          const reviewsResponse = await reviewsService.getBookReviews(bookId, {
            limit: 1, // Just get the count/metadata
            skip: 0
          });

          // Calculate rating distribution from reviews if available
          if (reviewsResponse.reviews) {
            // const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
            // Note: This would need a specific API endpoint to get rating distribution
            // For now, we'll use the book's total reviews as an approximation
          }
        } catch (reviewError) {
          // Reviews might not be available, but we still have book rating data
          console.debug('Review metadata not available:', reviewError);
        }

        lastUpdateRef.current = Date.now();
      }
    } catch (error) {
      console.error('Failed to poll review updates:', error);
      onError?.(error as Error);
    }
  }, [bookId, enabled, dispatch, onError]);

  // Start polling
  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial poll
    pollReviewUpdates();

    // Set up interval
    intervalRef.current = setInterval(pollReviewUpdates, interval);
  }, [pollReviewUpdates, interval]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Manually trigger update
  const triggerUpdate = useCallback(() => {
    pollReviewUpdates();
  }, [pollReviewUpdates]);

  // Set up polling when conditions are met
  useEffect(() => {
    if (enabled && bookId) {
      startPolling();
    } else {
      stopPolling();
    }

    return stopPolling;
  }, [enabled, bookId, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  return {
    triggerUpdate,
    startPolling,
    stopPolling,
    lastUpdate: lastUpdateRef.current
  };
};

export default useReviewPolling;
