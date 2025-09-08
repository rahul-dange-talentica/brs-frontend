/**
 * Search Optimization Utilities
 * Advanced search features including caching, analytics, and performance optimization
 */

import { SearchQuery, SearchResponse } from '@/types/api';
import { debounce } from './debounce';

// Search cache interface
interface SearchCacheEntry {
  query: SearchQuery;
  response: SearchResponse;
  timestamp: number;
  expiresAt: number;
}

// Search analytics interface
interface SearchAnalytics {
  query: string;
  timestamp: number;
  resultsCount: number;
  responseTime: number;
  filters?: Partial<SearchQuery>;
}

// Cache configuration
const CACHE_CONFIG = {
  MAX_ENTRIES: 50,
  DEFAULT_TTL: 5 * 60 * 1000, // 5 minutes
  ANALYTICS_KEY: 'brs-search-analytics',
  CACHE_KEY: 'brs-search-cache',
};

/**
 * Search cache manager
 */
export class SearchCache {
  private cache: Map<string, SearchCacheEntry> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Generate cache key from search query
   */
  private generateKey(query: SearchQuery): string {
    return JSON.stringify({
      q: query.q?.toLowerCase().trim(),
      genre_id: query.genre_id,
      min_rating: query.min_rating,
      skip: query.skip || 0,
      limit: query.limit || 20,
    });
  }

  /**
   * Get cached search result
   */
  get(query: SearchQuery): SearchResponse | null {
    const key = this.generateKey(query);
    const entry = this.cache.get(key);

    if (!entry) return null;

    // Check if entry has expired
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      this.saveToStorage();
      return null;
    }

    return entry.response;
  }

  /**
   * Cache search result
   */
  set(query: SearchQuery, response: SearchResponse, ttl: number = CACHE_CONFIG.DEFAULT_TTL): void {
    const key = this.generateKey(query);
    const now = Date.now();

    const entry: SearchCacheEntry = {
      query,
      response,
      timestamp: now,
      expiresAt: now + ttl,
    };

    this.cache.set(key, entry);

    // Clean up if cache is too large
    if (this.cache.size > CACHE_CONFIG.MAX_ENTRIES) {
      this.cleanup();
    }

    this.saveToStorage();
  }

  /**
   * Clear expired entries and limit cache size
   */
  private cleanup(): void {
    const now = Date.now();
    const entries = Array.from(this.cache.entries());

    // Remove expired entries
    entries.forEach(([key, entry]) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    });

    // If still too large, remove oldest entries
    if (this.cache.size > CACHE_CONFIG.MAX_ENTRIES) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);

      const toRemove = sortedEntries.slice(0, this.cache.size - CACHE_CONFIG.MAX_ENTRIES);
      toRemove.forEach(([key]) => this.cache.delete(key));
    }
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    try {
      const cacheData = Array.from(this.cache.entries());
      localStorage.setItem(CACHE_CONFIG.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to save search cache:', error);
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(CACHE_CONFIG.CACHE_KEY);
      if (stored) {
        const cacheData: [string, SearchCacheEntry][] = JSON.parse(stored);
        this.cache = new Map(cacheData);
        
        // Clean up expired entries on load
        this.cleanup();
      }
    } catch (error) {
      console.warn('Failed to load search cache:', error);
      this.cache = new Map();
    }
  }
}

/**
 * Search analytics manager
 */
export class SearchAnalyticsManager {
  private analytics: SearchAnalytics[] = [];

  constructor() {
    this.loadFromStorage();
  }

  /**
   * Record search analytics
   */
  record(query: string, resultsCount: number, responseTime: number, filters?: Partial<SearchQuery>): void {
    const analytics: SearchAnalytics = {
      query: query.toLowerCase().trim(),
      timestamp: Date.now(),
      resultsCount,
      responseTime,
      filters,
    };

    this.analytics.push(analytics);

    // Keep only recent analytics (last 1000 searches or 7 days)
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    this.analytics = this.analytics
      .filter(item => item.timestamp > sevenDaysAgo)
      .slice(-1000);

    this.saveToStorage();
  }

  /**
   * Get popular search queries
   */
  getPopularQueries(limit: number = 10): Array<{ query: string; count: number; avgResults: number }> {
    const queryStats = new Map<string, { count: number; totalResults: number }>();

    this.analytics.forEach(item => {
      const existing = queryStats.get(item.query) || { count: 0, totalResults: 0 };
      queryStats.set(item.query, {
        count: existing.count + 1,
        totalResults: existing.totalResults + item.resultsCount,
      });
    });

    return Array.from(queryStats.entries())
      .map(([query, stats]) => ({
        query,
        count: stats.count,
        avgResults: stats.totalResults / stats.count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Get search performance metrics
   */
  getPerformanceMetrics(): {
    avgResponseTime: number;
    totalSearches: number;
    avgResultsPerSearch: number;
    searchesLast24h: number;
  } {
    if (this.analytics.length === 0) {
      return {
        avgResponseTime: 0,
        totalSearches: 0,
        avgResultsPerSearch: 0,
        searchesLast24h: 0,
      };
    }

    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);

    const totalResponseTime = this.analytics.reduce((sum, item) => sum + item.responseTime, 0);
    const totalResults = this.analytics.reduce((sum, item) => sum + item.resultsCount, 0);
    const searchesLast24h = this.analytics.filter(item => item.timestamp > last24h).length;

    return {
      avgResponseTime: totalResponseTime / this.analytics.length,
      totalSearches: this.analytics.length,
      avgResultsPerSearch: totalResults / this.analytics.length,
      searchesLast24h,
    };
  }

  /**
   * Get trending search queries (popular in recent time)
   */
  getTrendingQueries(hours: number = 24, limit: number = 5): Array<{ query: string; count: number }> {
    const cutoffTime = Date.now() - (hours * 60 * 60 * 1000);
    const recentAnalytics = this.analytics.filter(item => item.timestamp > cutoffTime);

    const queryCount = new Map<string, number>();
    recentAnalytics.forEach(item => {
      queryCount.set(item.query, (queryCount.get(item.query) || 0) + 1);
    });

    return Array.from(queryCount.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  /**
   * Clear analytics data
   */
  clear(): void {
    this.analytics = [];
    this.saveToStorage();
  }

  /**
   * Save analytics to localStorage
   */
  private saveToStorage(): void {
    try {
      localStorage.setItem(CACHE_CONFIG.ANALYTICS_KEY, JSON.stringify(this.analytics));
    } catch (error) {
      console.warn('Failed to save search analytics:', error);
    }
  }

  /**
   * Load analytics from localStorage
   */
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(CACHE_CONFIG.ANALYTICS_KEY);
      if (stored) {
        this.analytics = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load search analytics:', error);
      this.analytics = [];
    }
  }
}

/**
 * Global search optimization instances
 */
export const searchCache = new SearchCache();
export const searchAnalytics = new SearchAnalyticsManager();

/**
 * Optimized search function with caching and analytics
 */
export const createOptimizedSearch = (
  searchFunction: (query: SearchQuery) => Promise<SearchResponse>
) => {
  const debouncedSearch = debounce(async (query: SearchQuery, callback: (result: SearchResponse | Error) => void) => {
    try {
      // Check cache first
      const cachedResult = searchCache.get(query);
      if (cachedResult) {
        callback(cachedResult);
        return;
      }

      // Perform search and measure time
      const startTime = Date.now();
      const result = await searchFunction(query);
      const responseTime = Date.now() - startTime;

      // Cache result
      searchCache.set(query, result);

      // Record analytics
      if (query.q) {
        searchAnalytics.record(query.q, result.total, responseTime, query);
      }

      callback(result);
    } catch (error) {
      callback(error as Error);
    }
  }, 300);

  return debouncedSearch;
};

/**
 * Query normalization for better cache hits
 */
export const normalizeSearchQuery = (query: SearchQuery): SearchQuery => {
  return {
    ...query,
    q: query.q?.toLowerCase().trim(),
    skip: query.skip || 0,
    limit: query.limit || 20,
  };
};

/**
 * Smart query suggestions based on analytics and partial matching
 */
export const getSmartSuggestions = (
  input: string,
  limit: number = 5
): Array<{ suggestion: string; type: 'popular' | 'recent' | 'trending' }> => {
  const suggestions: Array<{ suggestion: string; type: 'popular' | 'recent' | 'trending' }> = [];
  
  if (!input.trim()) return suggestions;

  const lowercaseInput = input.toLowerCase();

  // Get popular queries that match input
  const popularQueries = searchAnalytics.getPopularQueries(20);
  popularQueries.forEach(({ query }) => {
    if (query.includes(lowercaseInput) && query !== lowercaseInput) {
      suggestions.push({ suggestion: query, type: 'popular' });
    }
  });

  // Get trending queries that match input
  const trendingQueries = searchAnalytics.getTrendingQueries(24, 10);
  trendingQueries.forEach(({ query }) => {
    if (query.includes(lowercaseInput) && query !== lowercaseInput) {
      suggestions.push({ suggestion: query, type: 'trending' });
    }
  });

  // Remove duplicates and limit results
  const uniqueSuggestions = suggestions.reduce((acc, current) => {
    if (!acc.find(item => item.suggestion === current.suggestion)) {
      acc.push(current);
    }
    return acc;
  }, [] as Array<{ suggestion: string; type: 'popular' | 'recent' | 'trending' }>);

  return uniqueSuggestions.slice(0, limit);
};
