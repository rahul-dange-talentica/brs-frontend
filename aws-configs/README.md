# AWS Infrastructure for Book Review Platform Frontend

This directory contains Terraform configuration files to set up the complete AWS infrastructure for the Book Review Platform frontend deployment.

## 🏗️ Infrastructure Components

### Core Resources
- **S3 Bucket**: Static website hosting with versioning and encryption
- **S3 Backup Bucket**: Automated backups with lifecycle policies
- **CloudFront Distribution**: Global CDN with custom error pages for SPA routing
- **Origin Access Control**: Secure access from CloudFront to S3

### Security Features
- **Response Headers Policy**: Security headers (HSTS, CSP, X-Frame-Options, etc.)
- **Bucket Policies**: Restrict access to CloudFront only
- **Encryption**: Server-side encryption for S3 buckets
- **Public Access Block**: Prevent accidental public exposure

### Optional Components
- **Route53**: DNS management for custom domains
- **SSL Certificate**: HTTPS support via ACM
- **CloudWatch Logs**: Monitoring and logging

## 🚀 Quick Start

### Prerequisites
1. **AWS CLI** configured with appropriate credentials
2. **Terraform** installed (>= 1.0)
3. **Appropriate AWS permissions** for the resources being created

### Step 1: Initialize Terraform
```bash
cd aws-configs
terraform init
```

### Step 2: Configure Variables
```bash
# Copy the example file
cp terraform.tfvars.example terraform.tfvars

# Edit with your specific values
notepad terraform.tfvars  # On Windows
```

### Step 3: Plan the Deployment
```bash
terraform plan
```

### Step 4: Apply the Configuration
```bash
terraform apply
```

### Step 5: Note the Outputs
After successful deployment, Terraform will output important values:
- CloudFront Distribution ID
- S3 bucket names
- Website URLs
- Deployment commands

## 📋 Configuration Options

### Basic Configuration
```hcl
aws_region   = "us-east-1"
environment  = "prod"
project_name = "brs-frontend"
s3_bucket_name = "your-unique-bucket-name"
```

### Custom Domain Setup
```hcl
domain_name         = "bookreviews.yourdomain.com"
domain_aliases      = ["bookreviews.yourdomain.com"]
ssl_certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/..."
create_route53_zone = true
create_route53_record = true
```

### Cost Optimization
```hcl
# Use PriceClass_100 for lowest cost (US, Canada, Europe)
cloudfront_price_class = "PriceClass_100"

# Adjust backup retention
backup_retention_days = 30

# Minimize log retention
log_retention_days = 7
```

## 🔧 Deployment Integration

### Update Package.json Scripts
After infrastructure is deployed, update your deployment scripts:

```json
{
  "scripts": {
    "deploy:terraform": "cd aws-configs && terraform apply -auto-approve",
    "deploy:app": "npm run build && aws s3 sync dist/ s3://$(terraform -chdir=aws-configs output -raw s3_bucket_name)/ --delete",
    "invalidate:cache": "aws cloudfront create-invalidation --distribution-id $(terraform -chdir=aws-configs output -raw cloudfront_distribution_id) --paths '/*'"
  }
}
```

### Environment Variables
Update your deployment scripts to use Terraform outputs:

```bash
# Get values from Terraform
BUCKET_NAME=$(terraform -chdir=aws-configs output -raw s3_bucket_name)
DISTRIBUTION_ID=$(terraform -chdir=aws-configs output -raw cloudfront_distribution_id)

# Use in deployment
aws s3 sync dist/ s3://$BUCKET_NAME/ --delete
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"
```

## 🔍 Resource Details

### S3 Bucket Configuration
- **Versioning**: Enabled for rollback capability
- **Encryption**: AES256 server-side encryption
- **Public Access**: Blocked (access only through CloudFront)
- **CORS**: Configured for API integration

### CloudFront Distribution
- **Origin**: S3 bucket with Origin Access Control
- **Caching**: Optimized for static assets and HTML
- **Security**: Custom response headers policy
- **Error Pages**: SPA routing support (404/403 → index.html)
- **Compression**: Enabled for better performance

### Security Headers
- **HSTS**: HTTP Strict Transport Security
- **X-Content-Type-Options**: nosniff
- **X-Frame-Options**: DENY
- **X-XSS-Protection**: Enabled
- **Referrer-Policy**: strict-origin-when-cross-origin

## 💰 Cost Estimation

### Monthly Costs (Moderate Traffic)
- **S3 Storage**: $1-5 (depends on asset size)
- **CloudFront**: $5-20 (depends on traffic and price class)
- **Route53**: $0.50 (if using hosted zone)
- **Data Transfer**: $2-10 (depends on usage)
- **Total**: ~$8-35/month

### Cost Optimization Tips
1. Use `PriceClass_100` for regional deployment
2. Set appropriate cache TTLs
3. Optimize asset sizes before deployment
4. Monitor usage with AWS Cost Explorer

## 🔄 Management Commands

### View Current State
```bash
terraform show
terraform state list
```

### Update Infrastructure
```bash
terraform plan
terraform apply
```

### Destroy Infrastructure
```bash
terraform destroy
```

### Get Outputs
```bash
# All outputs
terraform output

# Specific output
terraform output cloudfront_distribution_id
terraform output website_url
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Bucket Name Already Exists
**Error**: `BucketAlreadyExists`
**Solution**: Change `s3_bucket_name` in `terraform.tfvars`

#### 2. SSL Certificate Issues
**Error**: Certificate not found or invalid region
**Solution**: Ensure ACM certificate is in `us-east-1` region for CloudFront

#### 3. Domain Validation
**Error**: Domain not validated
**Solution**: Complete ACM certificate validation before applying

#### 4. Permissions Issues
**Error**: Access denied
**Solution**: Ensure AWS credentials have required permissions:
- S3 full access
- CloudFront full access
- Route53 (if using custom domain)
- IAM (for policies)

### Getting Help
1. Check Terraform logs: `TF_LOG=DEBUG terraform apply`
2. Validate configuration: `terraform validate`
3. Check AWS CloudTrail for API errors
4. Review AWS documentation for service limits

## 📚 Additional Resources

- [Terraform AWS Provider Documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS S3 Static Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [AWS CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [Terraform Best Practices](https://www.terraform.io/docs/cloud/guides/recommended-practices/index.html)

---

**Last Updated**: January 7, 2025
**Version**: 1.0.0
