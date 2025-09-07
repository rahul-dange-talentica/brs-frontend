# Task 02: Material-UI Theme & Layout

**Sequence**: 02  
**Priority**: High  
**Estimated Duration**: 2-3 days  
**Dependencies**: Task 01 (Project Setup)  
**Assigned To**: TBD  

---

## Task Overview

Implement Material-UI theme configuration and create the basic layout structure including header navigation, footer, and responsive layout components according to the Technical PRD design specifications.

---

## Acceptance Criteria

### Theme Configuration
- [ ] Create complete Material-UI theme with custom colors, typography, and components
- [ ] Implement theme provider in main application
- [ ] Configure responsive breakpoints and spacing system
- [ ] Set up custom component styling overrides

### Layout Components
- [ ] **Header Component**: Navigation bar with logo, menu items, and user actions
- [ ] **Footer Component**: Site links, copyright, and additional information
- [ ] **MainLayout Component**: Wrapper component for authenticated pages
- [ ] **AuthLayout Component**: Wrapper component for login/register pages
- [ ] **Loading Components**: Skeleton screens and progress indicators

### Navigation System
- [ ] Responsive navigation menu with Material-UI AppBar
- [ ] Mobile-friendly hamburger menu implementation
- [ ] Navigation items for authenticated and guest users
- [ ] Active route highlighting

### Responsive Design
- [ ] Desktop-first responsive approach
- [ ] Mobile adaptation for screens < 768px
- [ ] Tablet optimization for screens 768px-1024px
- [ ] Consistent spacing and typography across breakpoints

---

## Implementation Details

### 1. Theme Configuration

Create `src/theme/index.ts` with complete theme setup:
```typescript
import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#dc004e',
      light: '#f06292',
      dark: '#c51162',
      contrastText: '#ffffff',
    },
    // ... complete palette configuration
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    // ... complete typography configuration
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    // ... additional component overrides
  },
});
```

### 2. Header Navigation Component
```typescript
// src/components/common/Header.tsx
interface HeaderProps {
  isAuthenticated: boolean;
  user?: User;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  isAuthenticated,
  user,
  onLogout
}) => {
  // AppBar with responsive navigation
  // User menu with profile/logout options
  // Search bar integration
  // Mobile hamburger menu
};
```

### 3. Layout Structure
```typescript
// Component hierarchy
App
├── ThemeProvider
└── Router
    ├── AuthLayout (for login/register)
    │   └── AuthPages
    └── MainLayout (for authenticated pages)
        ├── Header
        ├── Main Content Area
        └── Footer
```

### 4. Responsive Breakpoints
- **xs**: 0px+ (mobile)
- **sm**: 600px+ (small mobile)
- **md**: 900px+ (tablet)
- **lg**: 1200px+ (desktop)
- **xl**: 1536px+ (large desktop)

---

## Components to Create

### Core Layout Components
1. **src/theme/index.ts** - Complete Material-UI theme configuration
2. **src/components/common/Header.tsx** - Main navigation header
3. **src/components/common/Footer.tsx** - Site footer
4. **src/components/common/MainLayout.tsx** - Layout wrapper for authenticated pages
5. **src/components/common/AuthLayout.tsx** - Layout wrapper for auth pages

### Loading Components
6. **src/components/common/LoadingSpinner.tsx** - Circular progress indicator
7. **src/components/common/LoadingSkeleton.tsx** - Skeleton screens for content
8. **src/components/common/PageLoader.tsx** - Full page loading component

### Navigation Components
9. **src/components/common/Navigation.tsx** - Navigation menu items
10. **src/components/common/MobileMenu.tsx** - Mobile hamburger menu
11. **src/components/common/UserMenu.tsx** - User dropdown menu

### Utility Components
12. **src/components/common/Container.tsx** - Custom container with consistent spacing
13. **src/components/common/Section.tsx** - Page section wrapper
14. **src/components/common/Breadcrumbs.tsx** - Navigation breadcrumbs

---

## Design Specifications

### Header Navigation
```typescript
// Navigation items for authenticated users
const authenticatedNavItems = [
  { label: 'Home', path: '/', icon: HomeIcon },
  { label: 'Browse Books', path: '/books', icon: LibraryBooksIcon },
  { label: 'My Reviews', path: '/my-reviews', icon: RateReviewIcon },
  { label: 'Favorites', path: '/favorites', icon: FavoriteIcon },
];

// User menu items
const userMenuItems = [
  { label: 'Profile', path: '/profile', icon: PersonIcon },
  { label: 'Settings', path: '/settings', icon: SettingsIcon },
  { label: 'Logout', action: 'logout', icon: LogoutIcon },
];
```

### Color Scheme
- **Primary**: Blue (#1976d2) - Used for main actions and links
- **Secondary**: Pink (#dc004e) - Used for accent elements
- **Background**: Light gray (#f5f5f5) - Page background
- **Paper**: White (#ffffff) - Card and component backgrounds
- **Text Primary**: Dark gray (#333333) - Main text color
- **Text Secondary**: Medium gray (#666666) - Secondary text

### Typography Scale
- **H1**: 2.5rem, weight 300 - Page titles
- **H2**: 2rem, weight 400 - Section headers
- **H3**: 1.75rem, weight 400 - Subsection headers
- **H4**: 1.5rem, weight 500 - Component titles
- **Body1**: 1rem, line-height 1.5 - Main text
- **Button**: 0.875rem, weight 500, no text transform

---

## Testing Checklist

### Theme Integration
- [ ] ThemeProvider wraps entire application correctly
- [ ] Custom theme colors are applied to Material-UI components
- [ ] Typography styles are consistent across components
- [ ] Component style overrides work as expected

### Layout Components
- [ ] Header renders with proper navigation items
- [ ] Footer displays correctly on all pages
- [ ] MainLayout wraps content with proper spacing
- [ ] AuthLayout provides clean authentication interface

### Responsive Design
- [ ] Header collapses to hamburger menu on mobile
- [ ] Navigation items stack properly on small screens
- [ ] Footer remains at bottom of viewport
- [ ] Content is readable and accessible on all screen sizes

### Navigation Functionality
- [ ] Navigation links highlight active routes
- [ ] User menu opens/closes correctly
- [ ] Mobile menu toggles properly
- [ ] Breadcrumbs update based on current route

---

## Accessibility Requirements

### Navigation Accessibility
- [ ] Proper ARIA labels for navigation elements
- [ ] Keyboard navigation support (Tab, Enter, Escape)
- [ ] Focus indicators visible and consistent
- [ ] Screen reader friendly navigation structure

### Color Contrast
- [ ] Text meets WCAG AA contrast requirements (4.5:1)
- [ ] Interactive elements have sufficient contrast
- [ ] Focus states are clearly visible
- [ ] Color is not the only means of conveying information

### Mobile Accessibility
- [ ] Touch targets are at least 44px in size
- [ ] Text is readable without zooming
- [ ] Interactive elements are easily tappable
- [ ] Content reflows properly on small screens

---

## Definition of Done

- [ ] Complete Material-UI theme is configured and applied
- [ ] Header navigation works on all screen sizes
- [ ] Footer renders consistently across pages
- [ ] Layout components provide proper structure
- [ ] Loading states are visually appealing
- [ ] Responsive design works from 320px to 1920px+
- [ ] Accessibility requirements are met
- [ ] All components are properly typed with TypeScript
- [ ] Basic routing structure is ready for authentication (Task 04)

---

## Integration Points

### With Authentication (Task 04)
- Header navigation will receive authentication state
- User menu will show/hide based on login status
- AuthLayout will be used for login/register pages
- Protected routes will use MainLayout

### With Redux Store (Task 03)
- Theme preferences can be stored in UI slice
- Navigation state management for mobile menu
- Loading states will be controlled by Redux actions

---

## Potential Issues & Solutions

### Issue: Material-UI Bundle Size
**Problem**: Large bundle size due to Material-UI imports
**Solution**: Use selective imports and tree-shaking configuration in Vite

### Issue: Mobile Navigation Performance
**Problem**: Hamburger menu animation lag on slower devices
**Solution**: Use CSS transforms and avoid DOM manipulations in animations

### Issue: Theme Customization Conflicts
**Problem**: Custom styles being overridden by Material-UI defaults
**Solution**: Proper CSS specificity and use of styled components

---

## Next Task Dependencies

This task enables:
- **Task 03**: Redux Store (UI slice for theme/navigation state)
- **Task 04**: Authentication (AuthLayout and navigation integration)
- **Task 06**: Book Management (MainLayout structure for content)

---

**Created**: January 7, 2025  
**Status**: Not Started  
**Last Updated**: January 7, 2025
