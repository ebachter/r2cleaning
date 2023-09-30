# Public Cloud Configuration
provider "aws" {
  region                      = "eu-central-1"
  access_key                  = "test123"
  secret_key                  = "testabc"
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true
  s3_use_path_style           = true
  endpoints {
    s3 = "http://localhost:4566"

    dynamodb = "http://localhost:4566"
    lambda   = "http://localhost:4566"
    kinesis  = "http://localhost:4566"

    cloudwatch       = "http://localhost:4566"
    cloudwatchevents = "http://localhost:4566"
    iam              = "http://localhost:4566"
    sts              = "http://localhost:4566"
    sqs              = "http://localhost:4566"
  }
}

# Create Bucket
resource "aws_s3_bucket" "b" {
  bucket = "r2static"
  #acl    = "public-read"
}

locals {
  mime_types = jsondecode(file("${path.module}/mime.json"))
}

# Create S3 bucket
resource "aws_s3_bucket_object" "object" {
  for_each     = fileset("../files/", "**")
  bucket       = aws_s3_bucket.b.id
  key          = each.value
  source       = "../files/${each.value}"
  etag         = filemd5("../files/${each.value}")
  content_type = local.mime_types[element(split(".", each.value), length(split(".", each.value)) - 1)]
  acl          = "public-read"
}
