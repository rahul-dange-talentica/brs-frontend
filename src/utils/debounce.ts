/**
 * Debounce utility for search optimization
 * Prevents excessive API calls during rapid user input
 */

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Throttle utility for rate limiting
 * Ensures function is called at most once per interval
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

/**
 * Debounce with immediate execution option
 * Useful for search suggestions that need immediate feedback
 */
export function debounceImmediate<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
  immediate = false
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    const callNow = immediate && !timeoutId;
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      timeoutId = null as any;
      if (!immediate) func(...args);
    }, delay);
    
    if (callNow) func(...args);
  };
}

/**
 * Cancel debounced function execution
 */
export function createCancellableDebounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): {
  execute: (...args: Parameters<T>) => void;
  cancel: () => void;
} {
  let timeoutId: NodeJS.Timeout;
  
  const cancel = () => {
    clearTimeout(timeoutId);
  };
  
  const execute = (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
  
  return { execute, cancel };
}
