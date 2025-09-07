# Task 01: Project Setup & Configuration

**Sequence**: 01  
**Priority**: Critical  
**Estimated Duration**: 1-2 days  
**Dependencies**: None  
**Assigned To**: TBD  

---

## Task Overview

Initialize the React TypeScript project with Vite build tool and configure all necessary development tools, dependencies, and project structure according to the Technical PRD specifications.

---

## Acceptance Criteria

### Core Setup
- [ ] Create React 18 + TypeScript project using Vite template
- [ ] Install all required dependencies from Technical PRD
- [ ] Configure TypeScript with proper compiler options and path aliases
- [ ] Set up Vite configuration with path resolvers and build optimization
- [ ] Configure ESLint and Prettier for code quality

### Dependencies Installation
- [ ] **Core Framework**: React 18.x, React DOM 18.x
- [ ] **TypeScript**: TypeScript 5.x, @types/react, @types/react-dom
- [ ] **Material-UI**: @mui/material, @mui/icons-material, @emotion packages
- [ ] **State Management**: @reduxjs/toolkit, react-redux
- [ ] **Routing**: react-router-dom
- [ ] **HTTP Client**: axios
- [ ] **Forms**: react-hook-form, @hookform/resolvers, yup
- [ ] **Build Tools**: Vite, @vitejs/plugin-react

### Configuration Files
- [ ] **package.json**: Scripts for dev, build, lint, preview, deploy
- [ ] **tsconfig.json**: TypeScript configuration with path aliases
- [ ] **vite.config.ts**: Vite configuration with resolvers and optimization
- [ ] **.eslintrc.cjs**: ESLint rules and TypeScript integration
- [ ] **.prettierrc**: Code formatting rules
- [ ] **index.html**: Base HTML template with CSP headers

### Project Structure
Create the complete folder structure:
```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components
│   ├── auth/            # Authentication components
│   ├── books/           # Book-related components
│   ├── reviews/         # Review components
│   └── user/            # User profile components
├── pages/               # Page-level components
├── store/               # Redux store configuration
├── services/            # API service functions
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── theme/               # Material-UI theme configuration
└── App.tsx              # Main application component
```

---

## Implementation Details

### 1. Project Initialization
```bash
# Create React + TypeScript project with Vite
npm create vite@latest brs-frontend -- --template react-ts
cd brs-frontend
```

### 2. Package Dependencies
Use the exact package.json configuration from Technical PRD:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@mui/material": "^5.15.0",
    "@mui/icons-material": "^5.15.0",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@reduxjs/toolkit": "^2.0.1",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.20.1",
    "axios": "^1.6.2",
    "react-hook-form": "^7.48.2",
    "@hookform/resolvers": "^3.3.2",
    "yup": "^1.3.3"
  }
}
```

### 3. TypeScript Configuration
Configure `tsconfig.json` with path aliases:
```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/components/*": ["components/*"],
      "@/pages/*": ["pages/*"],
      "@/store/*": ["store/*"],
      "@/services/*": ["services/*"],
      "@/types/*": ["types/*"],
      "@/utils/*": ["utils/*"],
      "@/hooks/*": ["hooks/*"]
    }
  }
}
```

### 4. Vite Configuration
Set up `vite.config.ts` with path resolution and build optimization according to Technical PRD.

### 5. Content Security Policy
Add CSP headers to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline'; 
               style-src 'self' 'unsafe-inline' fonts.googleapis.com; 
               font-src 'self' fonts.gstatic.com; 
               img-src 'self' data: https:; 
               connect-src 'self' http://34.192.2.109;">
```

---

## Files to Create/Modify

### Configuration Files
1. **package.json** - Project metadata and dependencies
2. **tsconfig.json** - TypeScript compiler configuration
3. **vite.config.ts** - Vite build tool configuration
4. **.eslintrc.cjs** - ESLint rules and parser settings
5. **.prettierrc** - Code formatting configuration
6. **index.html** - HTML template with CSP headers

### Basic Structure Files
7. **src/App.tsx** - Main application component (basic shell)
8. **src/main.tsx** - Application entry point
9. **src/vite-env.d.ts** - Vite environment types

### Environment Configuration
10. **.env.development** - Development environment variables
```env
VITE_API_BASE_URL=http://34.192.2.109
VITE_APP_NAME=Book Review Platform
VITE_POLLING_INTERVAL=30000
```

---

## Testing Checklist

### Development Environment
- [ ] `npm run dev` starts development server on port 3000
- [ ] Hot module replacement works correctly
- [ ] TypeScript compilation has no errors
- [ ] ESLint runs without errors
- [ ] Prettier formats code correctly

### Build Process
- [ ] `npm run build` creates production build successfully
- [ ] Built files are optimized and under size limits
- [ ] `npm run preview` serves production build correctly

### Path Aliases
- [ ] Import statements work with @ aliases
- [ ] TypeScript recognizes all path mappings
- [ ] IDE/VS Code provides proper IntelliSense

---

## Definition of Done

- [ ] Project structure matches Technical PRD specifications
- [ ] All dependencies are installed and versions match requirements
- [ ] Development server runs without errors
- [ ] Production build completes successfully
- [ ] ESLint and Prettier configurations are working
- [ ] TypeScript path aliases are configured and functional
- [ ] Basic App.tsx renders without errors
- [ ] Project is ready for Theme & Layout implementation (Task 02)

---

## Potential Issues & Solutions

### Issue: Path Alias Resolution
**Problem**: Import paths with @ aliases not resolving correctly
**Solution**: Ensure both tsconfig.json and vite.config.ts have matching path configurations

### Issue: Material-UI Peer Dependencies
**Problem**: Emotion packages version conflicts
**Solution**: Use exact versions specified in Technical PRD

### Issue: ESLint Configuration
**Problem**: ESLint rules conflicting with React + TypeScript
**Solution**: Use provided .eslintrc.cjs configuration from Technical PRD

---

## Next Task Dependencies

This task must be completed before:
- **Task 02**: Material-UI Theme & Layout (requires project structure)
- **Task 03**: Redux Store Configuration (requires TypeScript setup)
- **Task 04**: Authentication System (requires routing foundation)

---

**Created**: January 7, 2025  
**Status**: Not Started  
**Last Updated**: January 7, 2025
