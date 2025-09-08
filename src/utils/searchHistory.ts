/**
 * Search History Management
 * Handles storing and retrieving user search history from localStorage
 */

const SEARCH_HISTORY_KEY = 'brs-search-history';
const MAX_HISTORY_ITEMS = 10;

export interface SearchHistoryItem {
  query: string;
  timestamp: string;
  resultsCount?: number;
}

/**
 * Get search history from localStorage
 */
export const getSearchHistory = (): SearchHistoryItem[] => {
  try {
    const history = localStorage.getItem(SEARCH_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.warn('Failed to retrieve search history:', error);
    return [];
  }
};

/**
 * Add a new search query to history
 */
export const addToSearchHistory = (
  query: string, 
  resultsCount?: number
): void => {
  try {
    if (!query.trim()) return;
    
    const history = getSearchHistory();
    const newItem: SearchHistoryItem = {
      query: query.trim(),
      timestamp: new Date().toISOString(),
      resultsCount,
    };
    
    // Remove existing entry with same query
    const filteredHistory = history.filter(item => 
      item.query.toLowerCase() !== query.toLowerCase()
    );
    
    // Add new item to the beginning and limit to MAX_HISTORY_ITEMS
    const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.warn('Failed to save search history:', error);
  }
};

/**
 * Remove a specific search query from history
 */
export const removeFromSearchHistory = (query: string): void => {
  try {
    const history = getSearchHistory();
    const updatedHistory = history.filter(item => 
      item.query.toLowerCase() !== query.toLowerCase()
    );
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.warn('Failed to remove from search history:', error);
  }
};

/**
 * Clear all search history
 */
export const clearSearchHistory = (): void => {
  try {
    localStorage.removeItem(SEARCH_HISTORY_KEY);
  } catch (error) {
    console.warn('Failed to clear search history:', error);
  }
};

/**
 * Get recent search suggestions based on input
 */
export const getSearchSuggestions = (input: string, limit = 5): string[] => {
  if (!input.trim()) return [];
  
  try {
    const history = getSearchHistory();
    const lowercaseInput = input.toLowerCase();
    
    return history
      .filter(item => 
        item.query.toLowerCase().includes(lowercaseInput) &&
        item.query.toLowerCase() !== lowercaseInput
      )
      .map(item => item.query)
      .slice(0, limit);
  } catch (error) {
    console.warn('Failed to get search suggestions:', error);
    return [];
  }
};

/**
 * Get most frequent search queries
 */
export const getFrequentSearches = (limit = 5): string[] => {
  try {
    const history = getSearchHistory();
    
    // Count query frequency
    const queryFrequency: Record<string, number> = {};
    history.forEach(item => {
      const normalizedQuery = item.query.toLowerCase();
      queryFrequency[normalizedQuery] = (queryFrequency[normalizedQuery] || 0) + 1;
    });
    
    // Sort by frequency and return top queries
    return Object.entries(queryFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([query]) => query);
  } catch (error) {
    console.warn('Failed to get frequent searches:', error);
    return [];
  }
};

/**
 * Clean old search history entries (older than 30 days)
 */
export const cleanOldSearchHistory = (): void => {
  try {
    const history = getSearchHistory();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentHistory = history.filter(item => 
      new Date(item.timestamp) > thirtyDaysAgo
    );
    
    if (recentHistory.length !== history.length) {
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(recentHistory));
    }
  } catch (error) {
    console.warn('Failed to clean old search history:', error);
  }
};

/**
 * Export search history for backup or analysis
 */
export const exportSearchHistory = (): SearchHistoryItem[] => {
  return getSearchHistory();
};

/**
 * Import search history from backup
 */
export const importSearchHistory = (history: SearchHistoryItem[]): void => {
  try {
    // Validate imported data
    const validHistory = history.filter(item => 
      typeof item.query === 'string' && 
      typeof item.timestamp === 'string'
    );
    
    // Merge with existing history and remove duplicates
    const existingHistory = getSearchHistory();
    const mergedHistory = [...validHistory, ...existingHistory];
    
    // Remove duplicates based on query and keep most recent
    const uniqueHistory = mergedHistory.reduce((acc, item) => {
      const existing = acc.find(h => h.query.toLowerCase() === item.query.toLowerCase());
      if (!existing) {
        acc.push(item);
      } else if (new Date(item.timestamp) > new Date(existing.timestamp)) {
        const index = acc.indexOf(existing);
        acc[index] = item;
      }
      return acc;
    }, [] as SearchHistoryItem[]);
    
    // Sort by timestamp (most recent first) and limit
    const sortedHistory = uniqueHistory
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(sortedHistory));
  } catch (error) {
    console.warn('Failed to import search history:', error);
  }
};
