export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
  timestamp: number;
}

export interface UILoadingState {
  loading: boolean;
  error?: string | null;
}

export interface AsyncState<T = any> extends UILoadingState {
  data: T | null;
}

export type Theme = 'light' | 'dark' | 'system';

export interface UIPreferences {
  theme: Theme;
  mobileMenuOpen: boolean;
  sidebarCollapsed: boolean;
  notificationsEnabled: boolean;
}
