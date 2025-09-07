/**
 * App Initializer
 * Handles app initialization including authentication verification
 */

import { store } from '@/store';
import { verifyToken, setInitialized } from '@/store/authSlice';
import { authService } from '@/services/authService';

/**
 * Initialize the application
 * This should be called when the app starts
 */
export const initializeApp = async (): Promise<void> => {
  try {
    // Check if user has a token and verify it
    if (authService.hasToken()) {
      console.log('🔍 Found authentication token, verifying...');
      
      try {
        await store.dispatch(verifyToken()).unwrap();
        console.log('✅ Authentication verified successfully');
      } catch (error) {
        console.warn('⚠️ Authentication verification failed:', error);
        // Token will be removed by the verifyToken action
        // verifyToken.rejected will set isInitialized = true
      }
    } else {
      console.log('ℹ️ No authentication token found');
      // Mark initialization as complete when no token exists
      store.dispatch(setInitialized());
    }
  } catch (error) {
    console.error('❌ App initialization failed:', error);
    // Always mark initialization as complete, even on error
    store.dispatch(setInitialized());
  }
};

export default initializeApp;
