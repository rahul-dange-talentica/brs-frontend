# Task 10: Deployment Configuration

**Sequence**: 10  
**Priority**: High  
**Estimated Duration**: 2-3 days  
**Dependencies**: All previous tasks (01-09)  
**Assigned To**: TBD  

---

## Task Overview

Configure complete AWS deployment pipeline including S3 static hosting, CloudFront CDN, automated build process, environment configuration, and production optimization for the Book Review Platform frontend.

---

## Acceptance Criteria

### AWS S3 Static Hosting
- [ ] **S3 Bucket Setup**: Configure bucket for static website hosting
- [ ] **Bucket Policy**: Set up public read access policy for website files
- [ ] **Error Pages**: Configure custom error pages for SPA routing
- [ ] **CORS Configuration**: Set up proper CORS headers for API integration

### CloudFront CDN
- [ ] **Distribution Setup**: Configure CloudFront distribution with S3 origin
- [ ] **Custom Error Pages**: Handle SPA routing with 404 -> index.html redirects
- [ ] **Caching Policies**: Optimize caching for static assets and HTML files
- [ ] **Compression**: Enable gzip compression for better performance

### Build Process Optimization
- [ ] **Production Build**: Optimize build for production deployment
- [ ] **Asset Optimization**: Minimize bundle sizes and optimize images
- [ ] **Environment Variables**: Configure production environment settings
- [ ] **Build Scripts**: Automate build and deployment process

### Deployment Automation
- [ ] **Deployment Script**: Automated deployment to AWS S3
- [ ] **Cache Invalidation**: Automatic CloudFront cache invalidation
- [ ] **Build Verification**: Pre-deployment build verification
- [ ] **Rollback Strategy**: Plan for deployment rollbacks if needed

---

## Implementation Details

### 1. AWS S3 Configuration

#### S3 Bucket Setup
```bash
# AWS CLI commands for S3 bucket creation
aws s3 mb s3://brs-frontend-bucket --region us-east-1
aws s3 website s3://brs-frontend-bucket --index-document index.html --error-document index.html
```

#### Bucket Policy Configuration
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::brs-frontend-bucket/*"
    }
  ]
}
```

#### S3 CORS Configuration
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

### 2. CloudFront Distribution Configuration

#### Distribution Settings
```json
{
  "CallerReference": "brs-frontend-distribution",
  "Comment": "Book Review Platform Frontend CDN",
  "DefaultRootObject": "index.html",
  "Origins": [
    {
      "Id": "S3-brs-frontend-bucket",
      "DomainName": "brs-frontend-bucket.s3.amazonaws.com",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-brs-frontend-bucket",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {
        "Forward": "none"
      }
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000
  },
  "CustomErrorResponses": [
    {
      "ErrorCode": 403,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html",
      "ErrorCachingMinTTL": 300
    },
    {
      "ErrorCode": 404,
      "ResponseCode": 200,
      "ResponsePagePath": "/index.html",
      "ErrorCachingMinTTL": 300
    }
  ],
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
```

### 3. Production Build Optimization

#### Vite Production Configuration Updates
```typescript
// vite.config.ts - Production optimizations
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // ... other aliases
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable source maps for production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          routing: ['react-router-dom'],
        },
        assetFileNames: 'assets/[name].[hash][extname]',
        chunkFileNames: 'assets/[name].[hash].js',
        entryFileNames: 'assets/[name].[hash].js',
      }
    },
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true
  }
});
```

---

## Files to Create/Modify

### Deployment Scripts
1. **deploy.sh** - Main deployment script
```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="brs-frontend-bucket"
DISTRIBUTION_ID="YOUR_CLOUDFRONT_DISTRIBUTION_ID"

echo -e "${YELLOW}Starting deployment process...${NC}"

# Step 1: Install dependencies
echo -e "${YELLOW}Installing dependencies...${NC}"
npm ci --only=production

# Step 2: Run linting
echo -e "${YELLOW}Running linting...${NC}"
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}Linting failed. Aborting deployment.${NC}"
    exit 1
fi

# Step 3: Build the application
echo -e "${YELLOW}Building React application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed. Aborting deployment.${NC}"
    exit 1
fi

# Step 4: Upload to S3
echo -e "${YELLOW}Uploading to AWS S3...${NC}"
aws s3 sync dist/ s3://$BUCKET_NAME --delete --exact-timestamps
if [ $? -ne 0 ]; then
    echo -e "${RED}S3 upload failed. Aborting deployment.${NC}"
    exit 1
fi

# Step 5: Set proper content types
echo -e "${YELLOW}Setting content types...${NC}"
aws s3 cp s3://$BUCKET_NAME/index.html s3://$BUCKET_NAME/index.html --content-type="text/html" --cache-control="no-cache"

# Step 6: Invalidate CloudFront cache
echo -e "${YELLOW}Invalidating CloudFront cache...${NC}"
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
if [ $? -ne 0 ]; then
    echo -e "${RED}CloudFront invalidation failed.${NC}"
    exit 1
fi

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${GREEN}Website will be available shortly at your CloudFront distribution URL.${NC}"
```

### Environment Configuration
2. **.env.production** - Production environment variables
```env
# Production Environment Variables
VITE_API_BASE_URL=http://34.192.2.109
VITE_APP_NAME=Book Review Platform
VITE_POLLING_INTERVAL=30000
VITE_ENVIRONMENT=production
VITE_BUILD_VERSION=1.0.0
```

3. **.env.development** - Development environment variables (already created in Task 01)

### AWS Configuration
4. **aws-config.json** - AWS resource configuration template
5. **cloudfront-config.json** - CloudFront distribution configuration
6. **s3-policy.json** - S3 bucket policy configuration

### CI/CD Configuration (Future Enhancement)
7. **github-actions.yml** - GitHub Actions workflow (optional)
8. **buildspec.yml** - AWS CodeBuild specification (optional)

---

## Deployment Process Steps

### Pre-Deployment Checklist
- [ ] AWS CLI configured with proper credentials
- [ ] S3 bucket created and configured
- [ ] CloudFront distribution set up
- [ ] Domain name configured (if using custom domain)
- [ ] SSL certificate provisioned (if using HTTPS)

### Deployment Process
```bash
# 1. Local testing
npm run build
npm run preview

# 2. Production deployment
chmod +x deploy.sh
./deploy.sh

# 3. Verify deployment
# Check S3 bucket contents
aws s3 ls s3://brs-frontend-bucket --recursive

# Check CloudFront distribution status
aws cloudfront get-distribution --id YOUR_DISTRIBUTION_ID
```

### Post-Deployment Verification
- [ ] Website loads correctly from CloudFront URL
- [ ] All routes work correctly (SPA routing)
- [ ] API integration functions properly
- [ ] Authentication flow works with production API
- [ ] Performance metrics meet targets (< 5s load time)

---

## Performance Optimization

### Build Optimization
```typescript
// Additional Vite configuration for performance
export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react', 'react-dom'], // Use CDN for React (optional)
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    },
    // Enable experimental features for better performance
    cssCodeSplit: true,
    emptyOutDir: true,
  },
  // Enable CSS preprocessing optimization
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
```

### CloudFront Optimization
- **Cache Headers**: Set appropriate cache headers for different file types
- **Compression**: Enable gzip/brotli compression
- **HTTP/2**: Ensure HTTP/2 support is enabled
- **Origin Shield**: Consider enabling for better performance

### Asset Optimization
- **Image Optimization**: Use WebP format where supported
- **Font Loading**: Optimize web font loading
- **Code Splitting**: Implement route-based code splitting
- **Tree Shaking**: Ensure unused code is eliminated

---

## Security Configuration

### Content Security Policy
```html
<!-- Enhanced CSP for production -->
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src 'self' https://fonts.gstatic.com; 
               img-src 'self' data: https: blob:; 
               connect-src 'self' http://34.192.2.109 https://api.bookreviews.com;
               frame-ancestors 'none';
               base-uri 'self';">
```

### HTTPS Configuration
- **SSL Certificate**: Use AWS Certificate Manager for SSL
- **HSTS Headers**: Implement HTTP Strict Transport Security
- **Secure Cookies**: Ensure authentication cookies are secure
- **Mixed Content**: Prevent mixed HTTP/HTTPS content

---

## Monitoring and Analytics

### CloudWatch Integration
- **Access Logs**: Enable CloudFront access logs
- **Error Monitoring**: Set up CloudWatch alarms for errors
- **Performance Metrics**: Monitor page load times and user interactions
- **Cost Monitoring**: Track AWS usage and costs

### Application Monitoring
```typescript
// src/utils/analytics.ts
export const initializeAnalytics = () => {
  // Initialize analytics (Google Analytics, etc.)
  if (import.meta.env.VITE_ENVIRONMENT === 'production') {
    // Production analytics code
    console.log('Analytics initialized for production');
  }
};

// Error tracking
export const trackError = (error: Error, context?: string) => {
  if (import.meta.env.VITE_ENVIRONMENT === 'production') {
    // Send error to monitoring service
    console.error('Production error:', error, context);
  }
};
```

---

## Testing Checklist

### Pre-Deployment Testing
- [ ] Local build runs without errors
- [ ] All features work in production build
- [ ] Performance metrics meet requirements
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness verified

### Deployment Testing
- [ ] S3 upload completes successfully
- [ ] CloudFront distribution updates correctly
- [ ] Cache invalidation works properly
- [ ] SSL certificate functions correctly
- [ ] Custom domain resolves properly (if configured)

### Post-Deployment Testing
- [ ] Website loads from production URL
- [ ] All routes work correctly
- [ ] API integration functions properly
- [ ] Authentication flow works end-to-end
- [ ] Real-time features work as expected

### Performance Testing
- [ ] Page load times under 5 seconds
- [ ] Lighthouse scores meet targets
- [ ] Core Web Vitals within acceptable ranges
- [ ] CDN caching works effectively
- [ ] Concurrent user load testing

---

## Rollback Strategy

### Rollback Process
1. **Immediate Rollback**: Revert to previous S3 deployment
2. **CloudFront Cache**: Clear cache to ensure updates propagate
3. **Health Check**: Verify rollback was successful
4. **User Communication**: Notify users if necessary

### Rollback Script
```bash
#!/bin/bash
# rollback.sh

BUCKET_NAME="brs-frontend-bucket"
BACKUP_PREFIX="backup-$(date -d '1 day ago' '+%Y%m%d')"

echo "Rolling back to previous version..."

# Restore from backup
aws s3 sync s3://$BUCKET_NAME-backup/$BACKUP_PREFIX/ s3://$BUCKET_NAME/ --delete

# Invalidate cache
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"

echo "Rollback completed!"
```

---

## Definition of Done

- [ ] AWS S3 bucket is configured for static website hosting
- [ ] CloudFront CDN is set up with proper caching and error handling
- [ ] Production build is optimized for performance and security
- [ ] Deployment script automates the entire deployment process
- [ ] Environment variables are properly configured for production
- [ ] SSL/HTTPS is configured and working
- [ ] SPA routing works correctly through CloudFront
- [ ] Performance targets are met (< 5 second load time)
- [ ] Security headers and CSP are properly configured
- [ ] Monitoring and error tracking are implemented
- [ ] Rollback strategy is tested and documented

---

## Cost Optimization

### AWS Cost Management
- **S3 Storage Class**: Use appropriate storage class for static files
- **CloudFront Pricing**: Choose cost-effective price class
- **Resource Cleanup**: Regular cleanup of old deployments
- **Usage Monitoring**: Monitor and optimize resource usage

### Estimated Monthly Costs
- **S3 Storage**: ~$1-5 (depending on assets size)
- **CloudFront**: ~$5-20 (depending on traffic)
- **Data Transfer**: ~$2-10 (depending on usage)
- **Total Estimated**: $8-35/month for moderate traffic

---

## Potential Issues & Solutions

### Issue: SPA Routing with CloudFront
**Problem**: Direct URLs return 404 errors
**Solution**: Configure custom error pages to redirect 404s to index.html

### Issue: Cache Invalidation Delays
**Problem**: Updates not visible immediately after deployment
**Solution**: Implement selective cache invalidation and appropriate TTL settings

### Issue: CORS Errors with API
**Problem**: Frontend can't communicate with backend API
**Solution**: Configure proper CORS headers and ensure API endpoints are accessible

### Issue: Build Size Too Large
**Problem**: Bundle size exceeds optimal limits
**Solution**: Implement code splitting, tree shaking, and asset optimization

---

## Maintenance and Updates

### Regular Maintenance Tasks
- [ ] **Dependency Updates**: Regular updates of npm packages
- [ ] **Security Patches**: Apply security updates promptly
- [ ] **Performance Monitoring**: Regular performance audits
- [ ] **Cost Optimization**: Monthly cost reviews and optimization

### Update Process
1. **Staging Deployment**: Test updates in staging environment
2. **Performance Testing**: Verify performance impacts
3. **Security Review**: Check for security implications
4. **Production Deployment**: Deploy with rollback plan ready

---

**Created**: January 7, 2025  
**Status**: Not Started  
**Last Updated**: January 7, 2025
