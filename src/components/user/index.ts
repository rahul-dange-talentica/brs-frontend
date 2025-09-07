/**
 * User Components Exports
 * All user profile and dashboard related components
 */

// Dashboard components
// UserDashboard is in pages directory
export { default as ProfileSummary } from './ProfileSummary';
export { default as ReadingStatistics } from './ReadingStatistics';
export { default as RecentActivity } from './RecentActivity';
export { default as QuickActions } from './QuickActions';

// Profile management components
export { default as UserProfilePage } from './UserProfilePage';
export { default as EditProfilePage } from './EditProfilePage';
export { default as ProfileHeader } from './ProfileHeader';
export { default as ProfileForm } from './ProfileForm';
export { default as UserAvatar } from './UserAvatar';

// Favorites management components
export { default as FavoritesPage } from './FavoritesPage';
export { default as FavoritesList } from './FavoritesList';
export { default as FavoriteButton } from './FavoriteButton';

// Review history components
export { default as ReviewStatistics } from './ReviewStatistics';

// Type exports
export * from './types';
