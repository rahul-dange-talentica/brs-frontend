# Output values for the Book Review Platform infrastructure

output "s3_bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.website.bucket
}

output "s3_bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.website.arn
}

output "s3_bucket_domain_name" {
  description = "Domain name of the S3 bucket"
  value       = aws_s3_bucket.website.bucket_domain_name
}

output "s3_bucket_regional_domain_name" {
  description = "Regional domain name of the S3 bucket"
  value       = aws_s3_bucket.website.bucket_regional_domain_name
}

output "backup_bucket_name" {
  description = "Name of the backup S3 bucket"
  value       = aws_s3_bucket.backup.bucket
}

output "cloudfront_distribution_id" {
  description = "ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.id
}

output "cloudfront_distribution_arn" {
  description = "ARN of the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.arn
}

output "cloudfront_domain_name" {
  description = "Domain name of the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "Hosted zone ID of the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.hosted_zone_id
}

output "cloudfront_distribution_status" {
  description = "Status of the CloudFront distribution"
  value       = aws_cloudfront_distribution.website.status
}

output "website_url" {
  description = "URL of the website"
  value       = "https://${aws_cloudfront_distribution.website.domain_name}"
}

output "custom_domain_url" {
  description = "Custom domain URL (if configured)"
  value       = var.domain_name != null ? "https://${var.domain_name}" : null
}

output "route53_zone_id" {
  description = "Route53 hosted zone ID (if created)"
  value       = var.create_route53_zone ? aws_route53_zone.main[0].zone_id : null
}

output "route53_name_servers" {
  description = "Route53 name servers (if zone created)"
  value       = var.create_route53_zone ? aws_route53_zone.main[0].name_servers : null
}

output "origin_access_control_id" {
  description = "Origin Access Control ID"
  value       = var.create_oac ? aws_cloudfront_origin_access_control.main[0].id : var.existing_oac_id
}

output "security_headers_policy_id" {
  description = "CloudFront response headers policy ID"
  value       = aws_cloudfront_response_headers_policy.security_headers.id
}

output "deployment_commands" {
  description = "Commands to deploy the application"
  value = {
    sync_to_s3 = "aws s3 sync dist/ s3://${aws_s3_bucket.website.bucket}/ --delete"
    invalidate_cache = "aws cloudfront create-invalidation --distribution-id ${aws_cloudfront_distribution.website.id} --paths '/*'"
  }
}
