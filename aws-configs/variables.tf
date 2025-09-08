# Input variables for the Book Review Platform infrastructure

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "prod"
  
  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "brs-frontend"
}

variable "s3_bucket_name" {
  description = "Name of the S3 bucket for website hosting"
  type        = string
  default     = "brs-frontend-bucket"
  
  validation {
    condition     = can(regex("^[a-z0-9][a-z0-9-]*[a-z0-9]$", var.s3_bucket_name))
    error_message = "S3 bucket name must be lowercase, alphanumeric, and hyphens only."
  }
}

variable "backup_retention_days" {
  description = "Number of days to retain backup files"
  type        = number
  default     = 30
}

variable "cloudfront_price_class" {
  description = "CloudFront price class"
  type        = string
  default     = "PriceClass_100"
  
  validation {
    condition     = contains(["PriceClass_All", "PriceClass_200", "PriceClass_100"], var.cloudfront_price_class)
    error_message = "Price class must be one of: PriceClass_All, PriceClass_200, PriceClass_100."
  }
}

# Domain and SSL Configuration
variable "domain_name" {
  description = "Custom domain name for the website (optional)"
  type        = string
  default     = null
}

variable "domain_aliases" {
  description = "List of domain aliases for CloudFront"
  type        = list(string)
  default     = []
}

variable "ssl_certificate_arn" {
  description = "ARN of the SSL certificate from ACM (must be in us-east-1 for CloudFront)"
  type        = string
  default     = null
}

# Route53 Configuration
variable "create_route53_zone" {
  description = "Whether to create a new Route53 hosted zone"
  type        = bool
  default     = false
}

variable "create_route53_record" {
  description = "Whether to create Route53 DNS records"
  type        = bool
  default     = false
}

variable "existing_zone_id" {
  description = "Existing Route53 zone ID (required if create_route53_zone is false but create_route53_record is true)"
  type        = string
  default     = null
}

# Origin Access Control Configuration
variable "create_oac" {
  description = "Whether to create a new Origin Access Control"
  type        = bool
  default     = true
}

variable "existing_oac_id" {
  description = "Existing Origin Access Control ID (required if create_oac is false)"
  type        = string
  default     = null
}

# Monitoring and Logging
variable "enable_logging" {
  description = "Enable CloudWatch logging"
  type        = bool
  default     = true
}

variable "log_retention_days" {
  description = "Number of days to retain logs"
  type        = number
  default     = 14
}

# Tags
variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}
