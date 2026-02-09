# Frontend Deployment Summary

## Quick Reference

### Most Common Commands
```bash
# Full deployment (recommended)
npm run build
aws s3 sync dist/ s3://brs-frontend-bucket-2025/ --delete
aws cloudfront create-invalidation --distribution-id E2N7CVOJAW1LBN --paths "/*"

# Check deployment status
aws cloudfront get-invalidation --distribution-id E2N7CVOJAW1LBN --id <INVALIDATION_ID>

# View infrastructure details
cd aws-configs && terraform output
```

### Key Information
- **Production URL**: https://d4rq1hzntu1kn.cloudfront.net
- **S3 Bucket**: `brs-frontend-bucket-2025`
- **CloudFront Distribution**: `E2N7CVOJAW1LBN`
- **AWS Region**: us-east-1

---

## Latest Deployment
**Date**: February 8, 2026 - 16:15 UTC
**Changes**: 
- Fixed rating breakdown display for books with multiple reviews
- Fixed rating distribution API limit (max 100 per request, now uses pagination)
- Fixed user reviews page to display book names and cover images
- Added logout redirect to homepage

## Deployment History

### February 8, 2026 - 16:15 UTC
**Invalidation ID**: `IDM4NJXMV5D8TF70Y2Y06VJSRX`
**Changes**:
- Added logout redirect to homepage functionality

### February 8, 2026 - 15:58 UTC
**Invalidation ID**: `I6GZ7WCCQOAF10FPZ6K8JZQPBK`
**Changes**:
- Fixed rating distribution API validation error (implemented pagination for 100-item limit)
- Fixed user reviews page to display book names and cover images
- Extended Review interface with optional book information

### February 8, 2026 - 15:46 UTC
**Invalidation ID**: `IBVNGK77TXNGQK9UDTX698C85P`
**Changes**:
- Fixed rating breakdown display for books with multiple reviews
- Implemented dynamic rating distribution calculation from actual review data

### Initial Deployment
**Invalidation ID**: `ICEZBFQRCKRRUN8S93ZOHUSORW`
**Changes**:
- Initial infrastructure setup and application deployment

## Infrastructure Details

### AWS Resources Created
- **S3 Bucket**: `brs-frontend-bucket-2025`
- **Backup Bucket**: `brs-frontend-bucket-2025-backup`
- **CloudFront Distribution ID**: `E2N7CVOJAW1LBN`
- **CloudFront Domain**: `d4rq1hzntu1kn.cloudfront.net`
- **Origin Access Control ID**: `E11L4Q32NAO0QN`

### Application URLs
- **Production URL**: https://d4rq1hzntu1kn.cloudfront.net
- **Backend API (via CloudFront Proxy)**: https://d4rq1hzntu1kn.cloudfront.net/api/
- **Backend Direct Access**: http://100.49.147.236/ (ec2-100-49-147-236.compute-1.amazonaws.com)

## Configuration

### Backend Integration
The frontend communicates with the backend API through CloudFront as a proxy to avoid mixed content issues (HTTPS → HTTP). 

**How it works:**
1. Frontend makes API requests to `https://d4rq1hzntu1kn.cloudfront.net/api/*`
2. CloudFront proxies these requests to `http://ec2-100-49-147-236.compute-1.amazonaws.com/api/*`
3. Backend responds via CloudFront over HTTPS
4. No CORS issues (same origin) and no mixed content warnings

This is set in:
- `src/config/api.ts` - BASE_URL is empty (uses same origin)
- `.env.production` - VITE_API_BASE_URL is empty
- CloudFront proxies `/api/*` requests to backend server

**CloudFront Origins:**
- **S3 Origin**: Static content (HTML, JS, CSS, images)
- **Backend Origin**: `ec2-100-49-147-236.compute-1.amazonaws.com` for `/api/*` paths

### Build Configuration
- **Build Tool**: Vite 5.4.19
- **Bundle Size**: ~940 KB total (uncompressed)
- **Code Splitting**: Enabled (vendor, mui, redux, routing, forms, utils)
- **Minification**: Terser (console.log and debugger statements removed in production)
- **Source Maps**: Disabled for production
- **CSS Code Splitting**: Enabled

**Current Bundle Breakdown** (Latest Build - Feb 8, 2026):
- `mui.CVMMf-WT.js`: 401.22 KB (118.54 KB gzipped) - Material-UI components
- `index.BrjI7qSm.js`: 229.56 KB (55.03 KB gzipped) - Main application code
- `vendor.DnUwWi3l.js`: 140.33 KB (45.03 KB gzipped) - React and React-DOM
- `forms.DJA4mR5a.js`: 63.42 KB (21.15 KB gzipped) - Form handling libraries
- `utils.CjTsMwYb.js`: 57.10 KB (19.62 KB gzipped) - Axios and date-fns
- `redux.CsBoUQ8d.js`: 26.08 KB (9.53 KB gzipped) - Redux Toolkit
- `routing.B0PQ4YxW.js`: 20.90 KB (7.65 KB gzipped) - React Router

## Deployment Process

### 1. Infrastructure Setup (Terraform)
```bash
cd aws-configs
terraform init
terraform apply -auto-approve
```

**Resources Created:**
- S3 buckets with versioning and encryption
- CloudFront distribution with HTTPS
- Security headers policy
- Origin Access Control for S3
- CloudWatch log group
- Lifecycle policies for backups

### 2. Frontend Build
```bash
npm run build
```

**Output:**
- Clean build directory
- TypeScript type checking
- Optimized production bundle
- Asset hashing for cache busting

### 3. Deployment to S3
```bash
aws s3 sync dist/ s3://brs-frontend-bucket-2025/ --delete
```

**Files Deployed:**
- index.html (3.36 KB)
- JavaScript bundles (assets/*.js)
- Static assets (vite.svg)

### 4. CloudFront Cache Invalidation
```bash
aws cloudfront create-invalidation --distribution-id E2N7CVOJAW1LBN --paths "/*"
```

**Latest Invalidation ID**: `IDM4NJXMV5D8TF70Y2Y06VJSRX`
**Previous Invalidation IDs**: 
- `I6GZ7WCCQOAF10FPZ6K8JZQPBK` (15:58 UTC)
- `IBVNGK77TXNGQK9UDTX698C85P` (15:46 UTC)
- `ICEZBFQRCKRRUN8S93ZOHUSORW` (Initial)

## Security Features

### CloudFront Security Headers
- Strict-Transport-Security (HSTS) with 1-year max-age
- Content-Type-Options (nosniff)
- Frame-Options (DENY)
- Referrer-Policy (strict-origin-when-cross-origin)
- Permissions-Policy (camera, microphone, geolocation disabled)

### S3 Security
- Server-side encryption (AES256)
- Versioning enabled
- Public access blocked (CloudFront only access)
- Bucket policy restricted to CloudFront service principal

### Cache Configuration

### CloudFront Caching
- **API Requests (`/api/*`)**: No caching (TTL = 0) - always fresh data from backend
- **Default TTL**: 24 hours (86400s)
- **Max TTL**: 1 year (31536000s)
- **Assets TTL**: 1 year (static assets with content hash for cache busting)
- **Compression**: Enabled (gzip and brotli)

### SPA Routing Support
Custom error responses configured for 403 and 404 errors redirect to `/index.html` for client-side routing. This ensures React Router handles all routes correctly.

## Monitoring

### CloudWatch Logs
- **Log Group**: `/aws/cloudfront/brs-frontend`
- **Retention**: 14 days

## Future Deployments

### Quick Deployment
```bash
# Build and deploy
npm run build
aws s3 sync dist/ s3://brs-frontend-bucket-2025/ --delete
aws cloudfront create-invalidation --distribution-id E2N7CVOJAW1LBN --paths "/*"
```

### Using NPM Scripts
```bash
# Complete deployment pipeline (requires manual fix for PowerShell compatibility)
# Note: npm run infra:deploy has issues with PowerShell commands in bash
# Use manual deployment instead:
npm run build
aws s3 sync dist/ s3://brs-frontend-bucket-2025/ --delete
aws cloudfront create-invalidation --distribution-id E2N7CVOJAW1LBN --paths "/*"
```

### Terraform Management
```bash
cd aws-configs

# View current infrastructure
terraform output

# Update infrastructure
terraform plan
terraform apply

# Destroy infrastructure (CAUTION!)
terraform destroy
```

## Terraform Outputs

To view all infrastructure details:
```bash
cd aws-configs
terraform output
```

Key outputs available:
- `website_url`: CloudFront distribution URL
- `s3_bucket_name`: S3 bucket name
- `cloudfront_distribution_id`: Distribution ID for invalidations
- `deployment_commands`: Helper commands for deployment

## Rollback Procedure

In case of issues, use S3 versioning to rollback:
```bash
# List versions
aws s3api list-object-versions --bucket brs-frontend-bucket-2025

# Restore specific version
aws s3api copy-object \
  --copy-source brs-frontend-bucket-2025/index.html?versionId=VERSION_ID \
  --bucket brs-frontend-bucket-2025 \
  --key index.html

# Invalidate cache
aws cloudfront create-invalidation --distribution-id E2N7CVOJAW1LBN --paths "/*"
```

## Cost Optimization

### Current Configuration
- **S3**: Pay per GB stored + requests
- **CloudFront**: PriceClass_100 (US, Canada, Europe)
- **Backup Retention**: 30 days
- **Log Retention**: 14 days

### Estimated Costs
- S3 Storage: ~$0.023/GB/month
- CloudFront Data Transfer: ~$0.085/GB (first 10TB)
- CloudWatch Logs: ~$0.50/GB ingested

## Troubleshooting

### Common Issues

#### 1. 403 Forbidden on CloudFront
- Check Origin Access Control configuration
- Verify S3 bucket policy allows CloudFront
- Ensure files exist in S3

#### 2. Stale Content After Deployment
- Create CloudFront invalidation
- Wait 1-2 minutes for invalidation to complete
- Check invalidation status in AWS console

#### 3. API Connection Errors
- CloudFront proxies `/api/*` to backend automatically
- No direct HTTP calls - all via HTTPS through CloudFront
- Check CloudFront origin health in AWS console
- Verify backend is accessible: `curl http://ec2-100-49-147-236.compute-1.amazonaws.com/api/v1/`
- Check browser Network tab for actual error messages

#### 4. Build Failures
- Run `npm run clean` to clear cache
- Check `npm run type-check` for TypeScript errors
- Verify all dependencies installed

#### 5. NPM Script Deployment Issues
**Issue**: `npm run infra:deploy` fails with PowerShell syntax errors in bash shell
**Solution**: Use manual deployment commands instead:
```bash
npm run build
aws s3 sync dist/ s3://brs-frontend-bucket-2025/ --delete
aws cloudfront create-invalidation --distribution-id E2N7CVOJAW1LBN --paths "/*"
```
**Root Cause**: The `terraform:sync` and `terraform:invalidate` scripts use PowerShell-specific syntax (`Get-Content`) which doesn't work in bash environments.

## Maintenance

### Regular Tasks
- Monitor CloudWatch logs for errors
- Review S3 storage costs monthly
- Update dependencies quarterly
- Review and rotate old backup versions
- Monitor CloudFront usage patterns

### Backup Strategy
- S3 versioning enabled (automatic)
- Backup bucket with 30-day retention
- Noncurrent versions expire after 30 days

## Support

For infrastructure issues:
1. Check AWS Console for service health
2. Review CloudWatch logs
3. Verify Terraform state matches deployed resources
4. Contact AWS Support if needed

## Notes

- Infrastructure managed by Terraform (IaC)
- All resources tagged with Project, Environment, and ManagedBy
- HTTPS enforced via CloudFront
- IPv6 enabled on CloudFront
- No custom domain configured (using CloudFront default)
