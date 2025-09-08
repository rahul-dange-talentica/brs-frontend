# Book Review Platform - Deployment Guide

## Overview

This guide covers the complete deployment process for the Book Review Platform frontend to AWS S3 with CloudFront CDN.

## Prerequisites

### Required Tools
- **Node.js** (v18+)
- **AWS CLI** configured with appropriate credentials
- **Git** for version control

### AWS Permissions Required
- S3 bucket creation and management
- CloudFront distribution management
- IAM permissions for deployment

## Quick Start

### 1. AWS Infrastructure Setup
```bash
# Navigate to AWS configs and run setup
npm run setup:aws
```

### 2. Environment Configuration
Create environment files with your API endpoints:
- `.env.development` (for development)
- `.env.production` (for production)

### 3. Deploy to Production
```bash
# Full production deployment
npm run deploy:production

# Or step by step
npm run build:production
npm run deploy
```

## Detailed Deployment Process

### Step 1: Build Optimization

The production build includes several optimizations:

- **Code Splitting**: Automatic chunking for better caching
- **Tree Shaking**: Removes unused code
- **Minification**: Compresses JavaScript and CSS
- **Asset Optimization**: Optimizes images and fonts

```bash
# Test production build locally
npm run test:build
```

### Step 2: AWS S3 Configuration

#### S3 Bucket Setup
```bash
# Create bucket (automated in setup script)
aws s3 mb s3://brs-frontend-bucket --region us-east-1

# Enable static website hosting
aws s3 website s3://brs-frontend-bucket --index-document index.html --error-document index.html
```

#### Bucket Policy
The bucket policy in `aws-configs/s3-bucket-policy.json` enables public read access for static assets.

#### CORS Configuration
CORS settings in `aws-configs/s3-cors-policy.json` allow proper API integration.

### Step 3: CloudFront CDN Setup

CloudFront provides:
- **Global CDN**: Fast content delivery worldwide
- **HTTPS**: Automatic SSL/TLS encryption
- **Custom Error Pages**: SPA routing support
- **Caching**: Optimized caching strategies

Configuration is in `aws-configs/cloudfront-distribution.json`.

### Step 4: Deployment Scripts

#### Main Deployment (`deploy.sh`)
- Installs dependencies
- Runs linting and tests
- Creates backup of current deployment
- Builds production bundle
- Uploads to S3 with proper headers
- Invalidates CloudFront cache

#### Rollback Script (`rollback.sh`)
- Lists available backups
- Restores from specified backup
- Invalidates CloudFront cache

## Environment Variables

### Production Environment (`.env.production`)
```env
VITE_API_BASE_URL=http://34.192.2.109
VITE_APP_NAME=Book Review Platform
VITE_POLLING_INTERVAL=30000
VITE_ENVIRONMENT=production
VITE_BUILD_VERSION=1.0.0
VITE_ANALYTICS_ENABLED=true
VITE_ERROR_TRACKING_ENABLED=true
```

### Development Environment (`.env.development`)
```env
VITE_API_BASE_URL=http://18.233.174.25
VITE_APP_NAME=Book Review Platform (Dev)
VITE_POLLING_INTERVAL=10000
VITE_ENVIRONMENT=development
VITE_BUILD_VERSION=dev
```

## Security Features

### Content Security Policy (CSP)
Enhanced CSP headers in `index.html` protect against:
- Cross-Site Scripting (XSS)
- Code injection attacks
- Unauthorized resource loading

### Security Headers
- **X-Content-Type-Options**: Prevents MIME-type sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Browser XSS protection
- **Referrer-Policy**: Controls referrer information
- **Permissions-Policy**: Restricts browser features

## Monitoring and Analytics

### Built-in Analytics
The `src/utils/analytics.ts` module provides:
- User interaction tracking
- Performance metrics
- Error tracking
- Page view analytics

### Error Tracking
Automatic error tracking includes:
- JavaScript errors
- Unhandled promise rejections
- Network failures
- User context information

## Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size and composition
npm run analyze
```

### Performance Features
- **Code Splitting**: Route-based and vendor chunking
- **Tree Shaking**: Eliminates dead code
- **Compression**: Gzip compression via CloudFront
- **Caching**: Strategic cache headers for assets

### Core Web Vitals
The deployment is optimized for:
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run build:production` | Build with linting |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run preview` | Preview production build |
| `npm run type-check` | TypeScript type checking |
| `npm run test:build` | Build and preview |
| `npm run deploy` | Deploy to AWS |
| `npm run deploy:production` | Full production deployment |
| `npm run rollback` | Rollback deployment |
| `npm run setup:aws` | Setup AWS infrastructure |
| `npm run analyze` | Analyze bundle size |
| `npm run clean` | Clean build artifacts |

## Troubleshooting

### Common Issues

#### 1. SPA Routing Issues
**Problem**: Direct URLs return 404 errors
**Solution**: CloudFront custom error pages redirect 404s to index.html

#### 2. Cache Invalidation Delays
**Problem**: Updates not visible immediately
**Solution**: Deployment script includes cache invalidation

#### 3. CORS Errors
**Problem**: API calls fail with CORS errors
**Solution**: Check CORS configuration in S3 and API server

#### 4. Build Failures
**Problem**: Build fails with TypeScript errors
**Solution**: Run `npm run type-check` to identify issues

### Deployment Verification

After deployment, verify:
- [ ] Website loads from CloudFront URL
- [ ] All routes work correctly (SPA routing)
- [ ] API integration functions properly
- [ ] Authentication flow works
- [ ] Performance metrics meet targets

### Rollback Process

If issues occur after deployment:

```bash
# List available backups
npm run rollback

# Rollback to specific backup
npm run rollback backup-20250107-143022
```

## Cost Optimization

### AWS Cost Estimates (Monthly)
- **S3 Storage**: $1-5 (depending on assets)
- **CloudFront**: $5-20 (depending on traffic)
- **Data Transfer**: $2-10 (depending on usage)
- **Total**: $8-35/month for moderate traffic

### Cost Optimization Tips
- Use appropriate S3 storage classes
- Optimize CloudFront price class
- Regular cleanup of old deployments
- Monitor usage with AWS Cost Explorer

## Maintenance

### Regular Tasks
- [ ] **Weekly**: Update dependencies
- [ ] **Monthly**: Security audits
- [ ] **Quarterly**: Performance reviews
- [ ] **Bi-annually**: Cost optimization reviews

### Update Process
1. Test updates in development
2. Run performance and security checks
3. Deploy to staging (if available)
4. Deploy to production with rollback plan

## Support

For deployment issues:
1. Check deployment logs
2. Verify AWS credentials and permissions
3. Test build locally with `npm run test:build`
4. Review CloudWatch logs for errors

---

**Last Updated**: January 7, 2025  
**Version**: 1.0.0
