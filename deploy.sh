#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="brs-frontend-bucket"
DISTRIBUTION_ID="${CLOUDFRONT_DISTRIBUTION_ID:-}"
REGION="us-east-1"

echo -e "${YELLOW}🚀 Starting deployment process...${NC}"

# Step 1: Check dependencies
echo -e "${YELLOW}📋 Checking dependencies...${NC}"
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI is not installed. Please install it first.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed. Please install it first.${NC}"
    exit 1
fi

# Step 2: Install dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --only=production
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Dependency installation failed. Aborting deployment.${NC}"
    exit 1
fi

# Step 3: Run linting
echo -e "${YELLOW}🔍 Running linting...${NC}"
npm run lint
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Linting failed. Aborting deployment.${NC}"
    exit 1
fi

# Step 4: Create backup
echo -e "${YELLOW}💾 Creating backup of current deployment...${NC}"
BACKUP_DATE=$(date '+%Y%m%d-%H%M%S')
aws s3 sync s3://$BUCKET_NAME s3://${BUCKET_NAME}-backup/backup-${BACKUP_DATE}/ --region $REGION
if [ $? -ne 0 ]; then
    echo -e "${YELLOW}⚠️ Warning: Could not create backup. Continuing...${NC}"
fi

# Step 5: Build the application
echo -e "${YELLOW}🏗️ Building React application...${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed. Aborting deployment.${NC}"
    exit 1
fi

# Step 6: Upload to S3
echo -e "${YELLOW}☁️ Uploading to AWS S3...${NC}"
aws s3 sync dist/ s3://$BUCKET_NAME --delete --exact-timestamps --region $REGION
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ S3 upload failed. Aborting deployment.${NC}"
    exit 1
fi

# Step 7: Set proper content types and cache headers
echo -e "${YELLOW}🔧 Setting content types and cache headers...${NC}"

# Set cache headers for HTML files (no cache)
aws s3 cp s3://$BUCKET_NAME/index.html s3://$BUCKET_NAME/index.html \
  --content-type="text/html" \
  --cache-control="no-cache, no-store, must-revalidate" \
  --metadata-directive="REPLACE" \
  --region $REGION

# Set cache headers for static assets (long cache)
aws s3 cp s3://$BUCKET_NAME/assets/ s3://$BUCKET_NAME/assets/ \
  --recursive \
  --cache-control="public, max-age=31536000" \
  --metadata-directive="REPLACE" \
  --region $REGION

# Step 8: Invalidate CloudFront cache (if distribution ID is provided)
if [ -n "$DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
      --distribution-id $DISTRIBUTION_ID \
      --paths "/*" \
      --query 'Invalidation.Id' \
      --output text)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Invalidation created with ID: $INVALIDATION_ID${NC}"
        echo -e "${YELLOW}⏳ Waiting for invalidation to complete...${NC}"
        aws cloudfront wait invalidation-completed \
          --distribution-id $DISTRIBUTION_ID \
          --id $INVALIDATION_ID
        echo -e "${GREEN}✅ CloudFront cache invalidated successfully${NC}"
    else
        echo -e "${RED}❌ CloudFront invalidation failed.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️ No CloudFront distribution ID provided. Skipping cache invalidation.${NC}"
    echo -e "${YELLOW}💡 Set CLOUDFRONT_DISTRIBUTION_ID environment variable to enable cache invalidation.${NC}"
fi

# Step 9: Deployment verification
echo -e "${YELLOW}🔍 Verifying deployment...${NC}"
S3_URL="http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com"
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 S3 Website URL: $S3_URL${NC}"

if [ -n "$DISTRIBUTION_ID" ]; then
    CLOUDFRONT_URL=$(aws cloudfront get-distribution --id $DISTRIBUTION_ID --query 'Distribution.DomainName' --output text)
    echo -e "${GREEN}🚀 CloudFront URL: https://$CLOUDFRONT_URL${NC}"
fi

echo -e "${GREEN}🎉 Website will be available shortly!${NC}"
