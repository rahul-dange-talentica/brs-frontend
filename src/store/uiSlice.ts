import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Notification, Theme } from '../types';

interface UIState {
  notifications: Notification[];
  globalLoading: boolean;
  mobileMenuOpen: boolean;
  theme: Theme;
  sidebarCollapsed: boolean;
  searchDialogOpen: boolean;
  profileMenuOpen: boolean;
  pageLoading: boolean;
  connectionStatus: 'online' | 'offline' | 'reconnecting';
}

interface ShowNotificationPayload {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

const initialState: UIState = {
  notifications: [],
  globalLoading: false,
  mobileMenuOpen: false,
  theme: 'light',
  sidebarCollapsed: false,
  searchDialogOpen: false,
  profileMenuOpen: false,
  pageLoading: false,
  connectionStatus: 'online',
};

let notificationId = 0;

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Notification actions
    showNotification: (state, action: PayloadAction<ShowNotificationPayload>) => {
      const notification: Notification = {
        id: `notification-${++notificationId}`,
        message: action.payload.message,
        type: action.payload.type,
        duration: action.payload.duration || 5000,
        action: action.payload.action,
        timestamp: Date.now(),
      };
      
      state.notifications.push(notification);
      
      // Auto-remove after duration (this will be handled by the component)
      // We'll keep max 5 notifications
      if (state.notifications.length > 5) {
        state.notifications.shift();
      }
    },
    
    hideNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        notification => notification.id !== action.payload
      );
    },
    
    clearAllNotifications: (state) => {
      state.notifications = [];
    },
    
    // Loading states
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload;
    },
    
    setPageLoading: (state, action: PayloadAction<boolean>) => {
      state.pageLoading = action.payload;
    },
    
    // Mobile menu
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    
    setMobileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileMenuOpen = action.payload;
    },
    
    // Theme
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      // Store theme preference in localStorage
      localStorage.setItem('theme', action.payload);
    },
    
    initializeTheme: (state) => {
      const storedTheme = localStorage.getItem('theme') as Theme;
      if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
        state.theme = storedTheme;
      } else {
        // Default to system preference if available
        if (typeof window !== 'undefined' && window.matchMedia) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          state.theme = prefersDark ? 'dark' : 'light';
        }
      }
    },
    
    // Sidebar
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },
    
    // Search dialog
    setSearchDialogOpen: (state, action: PayloadAction<boolean>) => {
      state.searchDialogOpen = action.payload;
    },
    
    toggleSearchDialog: (state) => {
      state.searchDialogOpen = !state.searchDialogOpen;
    },
    
    // Profile menu
    setProfileMenuOpen: (state, action: PayloadAction<boolean>) => {
      state.profileMenuOpen = action.payload;
    },
    
    toggleProfileMenu: (state) => {
      state.profileMenuOpen = !state.profileMenuOpen;
    },
    
    // Connection status
    setConnectionStatus: (state, action: PayloadAction<'online' | 'offline' | 'reconnecting'>) => {
      state.connectionStatus = action.payload;
      
      // Show notification for connection changes
      if (action.payload === 'offline') {
        const notification: Notification = {
          id: `connection-offline-${Date.now()}`,
          message: 'Connection lost. Some features may not work properly.',
          type: 'warning',
          duration: 0, // Don't auto-hide
          timestamp: Date.now(),
        };
        state.notifications = state.notifications.filter(n => !n.id.includes('connection-'));
        state.notifications.push(notification);
      } else if (action.payload === 'online') {
        const notification: Notification = {
          id: `connection-online-${Date.now()}`,
          message: 'Connection restored.',
          type: 'success',
          duration: 3000,
          timestamp: Date.now(),
        };
        state.notifications = state.notifications.filter(n => !n.id.includes('connection-'));
        state.notifications.push(notification);
      }
    },
    
    // Batch UI updates for performance
    setBatchUIState: (state, action: PayloadAction<Partial<UIState>>) => {
      Object.assign(state, action.payload);
    },
    
    // Reset UI state (useful for logout)
    resetUIState: (state) => {
      state.notifications = [];
      state.globalLoading = false;
      state.mobileMenuOpen = false;
      state.sidebarCollapsed = false;
      state.searchDialogOpen = false;
      state.profileMenuOpen = false;
      state.pageLoading = false;
      // Keep theme and connection status
    },
  },
});

// Action creators
export const {
  showNotification,
  hideNotification,
  clearAllNotifications,
  setGlobalLoading,
  setPageLoading,
  toggleMobileMenu,
  setMobileMenuOpen,
  setTheme,
  initializeTheme,
  toggleSidebar,
  setSidebarCollapsed,
  setSearchDialogOpen,
  toggleSearchDialog,
  setProfileMenuOpen,
  toggleProfileMenu,
  setConnectionStatus,
  setBatchUIState,
  resetUIState,
} = uiSlice.actions;

// Convenience action creators
export const showSuccessNotification = (message: string, duration?: number) =>
  showNotification({ message, type: 'success', duration });

export const showErrorNotification = (message: string, duration?: number) =>
  showNotification({ message, type: 'error', duration });

export const showWarningNotification = (message: string, duration?: number) =>
  showNotification({ message, type: 'warning', duration });

export const showInfoNotification = (message: string, duration?: number) =>
  showNotification({ message, type: 'info', duration });

// Selectors
export const selectNotifications = (state: { ui: UIState }) => state.ui.notifications;
export const selectGlobalLoading = (state: { ui: UIState }) => state.ui.globalLoading;
export const selectPageLoading = (state: { ui: UIState }) => state.ui.pageLoading;
export const selectMobileMenuOpen = (state: { ui: UIState }) => state.ui.mobileMenuOpen;
export const selectTheme = (state: { ui: UIState }) => state.ui.theme;
export const selectSidebarCollapsed = (state: { ui: UIState }) => state.ui.sidebarCollapsed;
export const selectSearchDialogOpen = (state: { ui: UIState }) => state.ui.searchDialogOpen;
export const selectProfileMenuOpen = (state: { ui: UIState }) => state.ui.profileMenuOpen;
export const selectConnectionStatus = (state: { ui: UIState }) => state.ui.connectionStatus;

// Derived selectors
export const selectIsLoading = (state: { ui: UIState }) => 
  state.ui.globalLoading || state.ui.pageLoading;

export const selectActiveNotifications = (state: { ui: UIState }) => 
  state.ui.notifications.filter(notification => 
    notification.duration === 0 || 
    (Date.now() - notification.timestamp) < notification.duration!
  );

export const selectHasErrorNotifications = (state: { ui: UIState }) =>
  state.ui.notifications.some(notification => notification.type === 'error');

export const selectIsOffline = (state: { ui: UIState }) => 
  state.ui.connectionStatus === 'offline';

export const selectCurrentTheme = (state: { ui: UIState }) => {
  if (state.ui.theme === 'system') {
    // This would be handled by the component that uses this selector
    // to check the actual system preference
    return 'light';
  }
  return state.ui.theme;
};

export default uiSlice.reducer;
