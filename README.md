# dynamo-and-lambda
Example of using DynamoDB and Lambda in AWS using Serverless framework

## Setup

Install Serverless CLI

For more info on serverless see [docs](https://serverless.com/framework/docs/)

```bash
npm install serverless -g
```

Install project dependencies
```bash
npm install
```

Install required version of node:

```bash
nvm use
```
Note on node version:

The Lambda's use node `v10.x` however `serverless-offline` requires `v12.x` to
be installed to run.

## Run locally

Start Dynamo local

```bash
sls dynamodb start
```

Start app in offline mode

```bash
sls offline
```

## Deploying

Set up AWS credentials in preferred way. For options see [docs](https://serverless.com/framework/docs/providers/aws/guide/credentials/#create-an-iam-user-and-access-key)

```bash
sls deploy
```
