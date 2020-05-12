## AWS Serverless Replay Cache
AWS Serverless Replay Cache is a serverless implementation of cache solution for dynamic and static content.

## Requirements
- Install: SAM CLI
- Setup: CloudFront
- Uninstall: AWS CLI

## Install
```
sam deploy --stack-name replay-cache --s3-bucket <SAM_BUCKET_NAME> --capabilities CAPABILITY_NAMED_IAM --parameter-overrides BucketName=<CACHE_BUCKET_NAME>
```

## Setup
1. Lambda -> Functions -> replay-cache-origin-request
    - Actions -> Deploy to Lambda@Edge
        - CloudFront event: Origin Request

2. Lambda --> Functions -> replay-cache-origin-response
    - Actions -> Deploy to Lambda@Edge
        - CloudFront event: Origin Response

## Uninstall
1. Remove Lambda@EDGE function associations
2. Empty S3 content bucket:
```
aws s3 rm s3://<CACHE_BUCKET_NAME> --recursive
```
3. Delete the CloudFormation Stack
```
aws cloudformation delete-stack --stack-name replay-cache
```

## License
This library is licensed under the MIT-0 License. See the LICENSE file.
