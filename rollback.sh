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

echo -e "${YELLOW}🔄 Starting rollback process...${NC}"

# Check if backup date is provided
if [ $# -eq 0 ]; then
    echo -e "${YELLOW}📅 Available backups:${NC}"
    aws s3 ls s3://${BUCKET_NAME}-backup/ --region $REGION | grep "PRE backup-"
    echo -e "${YELLOW}💡 Usage: ./rollback.sh [backup-date]${NC}"
    echo -e "${YELLOW}💡 Example: ./rollback.sh backup-20250107-143022${NC}"
    exit 1
fi

BACKUP_PREFIX=$1

# Verify backup exists
echo -e "${YELLOW}🔍 Verifying backup exists...${NC}"
aws s3 ls s3://${BUCKET_NAME}-backup/${BACKUP_PREFIX}/ --region $REGION > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Backup ${BACKUP_PREFIX} not found.${NC}"
    echo -e "${YELLOW}📅 Available backups:${NC}"
    aws s3 ls s3://${BUCKET_NAME}-backup/ --region $REGION | grep "PRE backup-"
    exit 1
fi

# Confirm rollback
echo -e "${YELLOW}⚠️ This will rollback the current deployment to backup: ${BACKUP_PREFIX}${NC}"
read -p "Are you sure you want to continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}❌ Rollback cancelled.${NC}"
    exit 1
fi

# Create backup of current state before rollback
echo -e "${YELLOW}💾 Creating backup of current state...${NC}"
CURRENT_BACKUP_DATE=$(date '+%Y%m%d-%H%M%S')
aws s3 sync s3://$BUCKET_NAME s3://${BUCKET_NAME}-backup/pre-rollback-${CURRENT_BACKUP_DATE}/ --region $REGION

# Perform rollback
echo -e "${YELLOW}🔄 Rolling back to ${BACKUP_PREFIX}...${NC}"
aws s3 sync s3://${BUCKET_NAME}-backup/${BACKUP_PREFIX}/ s3://$BUCKET_NAME/ --delete --region $REGION
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Rollback failed.${NC}"
    exit 1
fi

# Invalidate CloudFront cache
if [ -n "$DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
      --distribution-id $DISTRIBUTION_ID \
      --paths "/*" \
      --query 'Invalidation.Id' \
      --output text)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Invalidation created with ID: $INVALIDATION_ID${NC}"
    else
        echo -e "${RED}❌ CloudFront invalidation failed.${NC}"
    fi
fi

echo -e "${GREEN}✅ Rollback completed successfully!${NC}"
echo -e "${GREEN}🎯 Rolled back to: ${BACKUP_PREFIX}${NC}"
echo -e "${GREEN}💾 Current state backed up as: pre-rollback-${CURRENT_BACKUP_DATE}${NC}"
