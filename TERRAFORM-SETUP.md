# Terraform Infrastructure Setup Guide

## 🚀 Quick Setup

### 1. Initialize Terraform
```bash
npm run terraform:init
```

### 2. Review the Plan
```bash
npm run terraform:plan
```

### 3. Deploy Infrastructure
```bash
npm run terraform:apply
```

### 4. Deploy Application
```bash
npm run infra:deploy
```

## 📋 Complete Infrastructure Commands

| Command | Description |
|---------|-------------|
| `npm run terraform:init` | Initialize Terraform |
| `npm run terraform:plan` | Preview infrastructure changes |
| `npm run terraform:apply` | Create/update infrastructure |
| `npm run terraform:destroy` | Destroy infrastructure |
| `npm run terraform:output` | Show infrastructure outputs |
| `npm run infra:setup` | Complete infrastructure setup |
| `npm run infra:deploy` | Build and deploy application |

## 🏗️ What Gets Created

### Core Infrastructure
- **S3 Bucket**: `brs-frontend-bucket-2025` (static hosting)
- **S3 Backup Bucket**: `brs-frontend-bucket-2025-backup`
- **CloudFront Distribution**: Global CDN with caching
- **Origin Access Control**: Secure CloudFront → S3 access

### Security Features
- Response headers policy (HSTS, CSP, etc.)
- S3 bucket encryption and versioning
- Public access blocking (CloudFront only)

### Monitoring
- CloudWatch log groups
- Access logging (optional)

## 💰 Cost Estimate
- **Monthly**: ~$8-35 for moderate traffic
- **S3**: $1-5/month
- **CloudFront**: $5-20/month
- **Logs**: $1-5/month

## 🔧 After Setup

Once infrastructure is deployed, you'll get:

```bash
# Example outputs
website_url = "https://d123456789.cloudfront.net"
s3_bucket_name = "brs-frontend-bucket-2025"
cloudfront_distribution_id = "E1234567890ABC"
```

Set environment variable for deployment:
```bash
export CLOUDFRONT_DISTRIBUTION_ID=$(cd aws-configs && terraform output -raw cloudfront_distribution_id)
```

## 🛠️ Troubleshooting

### Bucket Name Conflict
If bucket name exists, update `aws-configs/terraform.tfvars`:
```hcl
s3_bucket_name = "brs-frontend-bucket-your-unique-suffix"
```

### Terraform State
For production, consider using remote state:
```hcl
# In aws-configs/versions.tf
backend "s3" {
  bucket = "your-terraform-state-bucket"
  key    = "brs-frontend/terraform.tfstate"
  region = "us-east-1"
}
```

Ready to deploy! 🚀
