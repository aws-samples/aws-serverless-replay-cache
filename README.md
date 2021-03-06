[![Build Status](https://travis-ci.org/aws-samples/aws-serverless-replay-cache.svg?branch=master)](https://travis-ci.org/aws-samples/aws-serverless-replay-cache)

## AWS Serverless Replay Cache (Beta)
AWS Serverless Replay Cache is a serverless implementation of cache solution for dynamic and static content using Lambda@Edge.


## Solution Blueprint
![Solution Blueprint](blueprint.png)


## Requirements
- AWS CLI installed and configured
- SAM CLI installed and configured
- CloudFront Distribution created and with Behavior(s) configured

:warning: CloudFront [requires](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-requirements-limits.html#lambda-requirements-cloudfront-triggers) the deployment to be made in the US East (N. Virginia) Region.

## Git Clone
```
git clone https://github.com/aws-samples/aws-serverless-replay-cache.git
```

## Copy configuration file (FOR WINDOWS USERS ONLY)
```
cp conf/config.json content-manager/
cp conf/config.json origin-request/
cp conf/config.json origin-response/
```

## Create SAM Bucket
```
aws s3 mb s3://<SAM_BUCKET_NAME>
```

## Deploy SAM Application
```
sam deploy --stack-name replay-cache --s3-bucket <SAM_BUCKET_NAME> --capabilities CAPABILITY_NAMED_IAM --parameter-overrides BucketName=<CACHE_BUCKET_NAME>
```

## Configure CloudFront
1. Open the CloudFront console at https://console.aws.amazon.com/cloudfront
4. In the navigation panel select **Distributions**, and then click in the ID of the CloudFront Distribution to be configured
5. Under **Origins and Origin Groups** tab, click on **Create Origin** button
6. Origin Domain Name select the bucket specified in the parameter **<CACHE_BUCKET_NAME>** of SAM deployment
7. Restrict Bucket Access select **Yes**
8. Origin Access Identity select **Create a New Identity**
9. Grant Read Permissions Bucket select **Yes, Update Bucket Policy**
10. Click on **Create** button
11. Under **Origins and Origin Groups** tab, click on **Create Origin Group** button
12. Origins select the **website** Origin and click on **Add** button
13. Origins select the **S3 Cache Bucket** Origin and click on **Add** button
14. Failover criteria select all **5xx** errors
15. Origin Group ID enter **ReplayCache-OriginGroup**
16. Click on **Create** button
17. Under **Behaviors** tab, edit or create a new Behavior that will serve cached content in case of a failover
18. Origin or Origin Group select **ReplayCache-OriginGroup**
19. Cache and origin request settings select **Use legacy cache setting**
20. Cache Based on Selected Request Headers select **Whitelist**
21. Whitelist Headers input enter **Host** value and click on **Add Custom >>** button
22. Whitelist Headers list **CloudFront-Forwarded-Proto** and click on **Add >>** button
23. Click on **Create** or **Yes, Edit** button


## Deploy Origin Request Lambda@Edge
1. Open the Lambda console at https://console.aws.amazon.com/lambda
2. In the navigation panel select **Functions**, and then open **replay-cache-origin-request** function
3. Click on **Action** button and select **Deploy to Lambda@Edge** option
4. Select the appropriated Distribution and Behavior
5. CloudFront event select **Origin request**
6. Check the acknowledge checkbox
7. Click on **Deploy** button


## Deploy Origin Response Lambda@Edge
1. Open the Lambda console at https://console.aws.amazon.com/lambda
2. In the navigation panel select **Functions**, and then open **replay-cache-origin-response** function
3. Click on **Action** button and select **Deploy to Lambda@Edge** option
4. Select the appropriated Distribution and Behavior
5. CloudFront event select **Origin response**
6. Check the acknowledge checkbox
7. Click on **Deploy** button


## Add Region(s) on DynamoDB Global Table
1. Open the DynamoDB console at https://console.aws.amazon.com/dynamodb
2. In the navigation panel select **Tables**, and then open **replay-cache** table
3. Under **Global Tables** tab, click on **Add region**
4. Select the appropriated Region
5. Click on **Create replica** button


## Cleanup
1. Remove Lambda@Edge function associations. Please note it may take a few hours to be completed.
2. Delete the DynamoDB Global Table regions
3. Empty S3 content bucket:
```
aws s3 rm s3://<CACHE_BUCKET_NAME> --recursive
```
4. Delete the CloudFormation Stack
```
aws cloudformation delete-stack --stack-name replay-cache
```

## Application Design
![Caching ](Replay%20Cache-Caching.png)
![Failover](Replay%20Cache-Failover.png)


## Troubleshooting
1. I can't see anything being cached.

It's likely you didn't created a DynamoDB Global Table replica in the region that Amazon CloudFront is serving you. In each region you'd like to trigger the caching process must have its own replica. Notice, by default the table is created in us-east-1 region.

You can additionaly confirm this in the Origin Response function logs at Amazon CloudWatch in the respective region.


## License
This library is licensed under the MIT-0 License. See the LICENSE file.
