export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NavigationItem {
  label: string;
  path: string;
  icon: React.ComponentType;
  requiresAuth?: boolean;
  exact?: boolean;
}

export interface UserMenuItem {
  label: string;
  path?: string;
  action?: string;
  icon: React.ComponentType;
  divider?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  active?: boolean;
}

export interface LoadingState {
  loading: boolean;
  error?: string | null;
}
