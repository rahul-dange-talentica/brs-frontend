#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
BUCKET_NAME="brs-frontend-bucket"
REGION="us-east-1"

echo -e "${YELLOW}🚀 Setting up AWS infrastructure for Book Review Platform...${NC}"

# Step 1: Create S3 bucket
echo -e "${YELLOW}📦 Creating S3 bucket...${NC}"
aws s3 mb s3://$BUCKET_NAME --region $REGION
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ S3 bucket created successfully${NC}"
else
    echo -e "${YELLOW}⚠️ Bucket might already exist, continuing...${NC}"
fi

# Step 2: Enable static website hosting
echo -e "${YELLOW}🌐 Enabling static website hosting...${NC}"
aws s3 website s3://$BUCKET_NAME --index-document index.html --error-document index.html

# Step 3: Apply bucket policy
echo -e "${YELLOW}🔒 Applying bucket policy...${NC}"
aws s3api put-bucket-policy --bucket $BUCKET_NAME --policy file://s3-bucket-policy.json

# Step 4: Apply CORS configuration
echo -e "${YELLOW}🔗 Applying CORS configuration...${NC}"
aws s3api put-bucket-cors --bucket $BUCKET_NAME --cors-configuration file://s3-cors-policy.json

# Step 5: Create backup bucket
echo -e "${YELLOW}💾 Creating backup bucket...${NC}"
aws s3 mb s3://${BUCKET_NAME}-backup --region $REGION
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Backup bucket created successfully${NC}"
else
    echo -e "${YELLOW}⚠️ Backup bucket might already exist, continuing...${NC}"
fi

# Step 6: Create CloudFront distribution
echo -e "${YELLOW}☁️ Creating CloudFront distribution...${NC}"
DISTRIBUTION_OUTPUT=$(aws cloudfront create-distribution --distribution-config file://cloudfront-distribution.json)
DISTRIBUTION_ID=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.Id')
DISTRIBUTION_DOMAIN=$(echo $DISTRIBUTION_OUTPUT | jq -r '.Distribution.DomainName')

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ CloudFront distribution created successfully${NC}"
    echo -e "${GREEN}🆔 Distribution ID: $DISTRIBUTION_ID${NC}"
    echo -e "${GREEN}🌐 Distribution Domain: $DISTRIBUTION_DOMAIN${NC}"
    echo -e "${YELLOW}💡 Add this to your environment: export CLOUDFRONT_DISTRIBUTION_ID=$DISTRIBUTION_ID${NC}"
else
    echo -e "${RED}❌ Failed to create CloudFront distribution${NC}"
fi

echo -e "${GREEN}🎉 AWS infrastructure setup completed!${NC}"
echo -e "${GREEN}📋 Summary:${NC}"
echo -e "${GREEN}   S3 Bucket: $BUCKET_NAME${NC}"
echo -e "${GREEN}   Backup Bucket: ${BUCKET_NAME}-backup${NC}"
echo -e "${GREEN}   Website URL: http://${BUCKET_NAME}.s3-website-${REGION}.amazonaws.com${NC}"
if [ -n "$DISTRIBUTION_ID" ]; then
    echo -e "${GREEN}   CloudFront URL: https://$DISTRIBUTION_DOMAIN${NC}"
fi
