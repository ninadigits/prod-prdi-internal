# PROD-PRDI-INTERNAL

## Project Specifications

https://docs.google.com/document/d/1h4NT7diVp2goA-lUliqXy583yLTPybpF9B069X9vt8M/edit#heading=h.jsucoehhepno

## Prerequisites
- [Node.js](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)
- [Serverless](https://www.serverless.com/)
- [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)

## Technical stacks
- [Serverless](https://www.serverless.com/): Build applications comprised of microservices that run in response to events, auto-scale for you, and only charge you when they run.
- [Amazon Cloudwatch](https://aws.amazon.com/cloudwatch): Monitoring and observability service built for DevOps engineers, developers, site reliability engineers (SREs), and IT managers
- [Amazon API Gateway](https://aws.amazon.com/api-gateway/): A fully managed service that makes it easy for developers to create, publish, maintain, monitor, and secure APIs at any scale. 
- [Amazon S3](https://aws.amazon.com/s3/): Object storage built to store and retrieve any amount of data from anywhere
- [Amazon IAM](https://aws.amazon.com/iam/): Securely manage access to AWS services and resources

## Development
- Run command `aws configure` if you haven't setup aws yet
```
AWS Access Key ID: [enter APP_AWS_ACCESS_ID]
AWS Secret Access Key: [enter APP_AWS_ACCESS_KEY]
Default region name: [enter APP_AWS_REGION]
Default output format: N/A
```

- Clone repo, setup and run application
```
git clone https://github.com/
cd prod-prdi-internal
yarn install
yarn start
```
Make sure you have created a `.env` and `.env.development` file and copy the configuration in `.env.example` file

### API REQUEST DOCUMENTATION
1. Download & Import the Postman json file https://www.getpostman.com/collections/
2. Create a environment with `token` variable
3. Login

## Install
- Run command: `yarn`
