/**
 * Real-time Rating Polling Hook
 * Periodically fetches book rating updates to keep ratings synchronized
 */

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { updateBookRating } from '@/store/booksSlice';
import { booksService } from '@/services';
// import { API_CONFIG } from '@/config/api';

interface UseRatingPollingOptions {
  enabled?: boolean;
  interval?: number;
  onError?: (error: Error) => void;
}

/**
 * Hook for polling book rating updates
 */
export const useRatingPolling = (
  bookId: string | null,
  options: UseRatingPollingOptions = {}
) => {
  const {
    enabled = true,
    interval = 60000, // 60 seconds for single book polling
    onError,
  } = options;

  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(false);

  const pollRating = async () => {
    if (!bookId || isPollingRef.current) return;

    isPollingRef.current = true;
    try {
      const bookDetails = await booksService.getBookById(bookId);
      
      dispatch(updateBookRating({
        bookId,
        averageRating: parseFloat(bookDetails.average_rating) || 0,
        totalReviews: bookDetails.total_reviews,
      }));
    } catch (error) {
      console.warn('Failed to poll rating updates:', error);
      if (onError) {
        onError(error as Error);
      }
    } finally {
      isPollingRef.current = false;
    }
  };

  useEffect(() => {
    if (!enabled || !bookId) {
      return;
    }

    // Initial fetch
    pollRating();

    // Set up polling interval
    intervalRef.current = setInterval(pollRating, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
    };
  }, [bookId, enabled, interval, dispatch]);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPollingRef.current = false;
  };

  const startPolling = () => {
    if (!intervalRef.current && enabled && bookId) {
      intervalRef.current = setInterval(pollRating, interval);
    }
  };

  const forceUpdate = () => {
    if (bookId) {
      pollRating();
    }
  };

  return {
    stopPolling,
    startPolling,
    forceUpdate,
    isPolling: !!intervalRef.current,
  };
};

/**
 * Hook for polling multiple books' ratings (for book lists)
 */
export const useMultipleRatingPolling = (
  bookIds: string[],
  options: UseRatingPollingOptions = {}
) => {
  const {
    enabled = true,
    interval = 120000, // 120 seconds for multiple books (longer than single book)
    onError,
  } = options;

  const dispatch = useAppDispatch();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isPollingRef = useRef<boolean>(false);

  const pollRatings = async () => {
    if (bookIds.length === 0 || isPollingRef.current) return;

    isPollingRef.current = true;
    try {
      // Poll ratings for multiple books (limited to prevent API overload)
      const limitedBookIds = bookIds.slice(0, 5); // Limit to 5 books at once
      
      const promises = limitedBookIds.map(async (bookId) => {
        try {
          const bookDetails = await booksService.getBookById(bookId);
          return {
            bookId,
            averageRating: parseFloat(bookDetails.average_rating) || 0,
            totalReviews: bookDetails.total_reviews,
          };
        } catch (error) {
          console.warn(`Failed to poll rating for book ${bookId}:`, error);
        }
        return null;
      });

      const results = await Promise.allSettled(promises);
      
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          dispatch(updateBookRating(result.value));
        }
      });
    } catch (error) {
      console.warn('Failed to poll multiple rating updates:', error);
      if (onError) {
        onError(error as Error);
      }
    } finally {
      isPollingRef.current = false;
    }
  };

  useEffect(() => {
    if (!enabled || bookIds.length === 0) {
      return;
    }

    // Set up polling interval
    intervalRef.current = setInterval(pollRatings, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPollingRef.current = false;
    };
  }, [bookIds, enabled, interval, dispatch]);

  const stopPolling = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPollingRef.current = false;
  };

  const startPolling = () => {
    if (!intervalRef.current && enabled && bookIds.length > 0) {
      intervalRef.current = setInterval(pollRatings, interval);
    }
  };

  return {
    stopPolling,
    startPolling,
    isPolling: !!intervalRef.current,
  };
};

export default useRatingPolling;
