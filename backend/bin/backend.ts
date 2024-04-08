#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { BackendStack } from '../lib/backend-stack';
import { SharedStack } from '../lib/shared-stack';
import { DatabaseStack } from '../lib/database-stack';
import * as dotenv from 'dotenv';
import path = require('path');
import { CognitoStack } from '../lib/cognito-stack';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = new cdk.App();
// new BackendStack(app, 'BackendStack', 'Development', {
//   /* If you don't specify 'env', this stack will be environment-agnostic.
//    * Account/Region-dependent features and context lookups will not work,
//    * but a single synthesized template can be deployed anywhere. */
//   /* Uncomment the next line to specialize this stack for the AWS Account
//    * and Region that are implied by the current CLI configuration. */
//   // env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
//   /* Uncomment the next line if you know exactly what Account and Region you
//    * want to deploy the stack to. */
//   // env: { account: '123456789012', region: 'us-east-1' },
//   /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
// });
const env = process.env.DEPLOYMENT_ENVIRONMENT || 'Development';
const postfix = env === 'Production' ? '' : `-${env}`;
const env_data = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

// Create SharedStack to create the VPC for the application
const sharedStack = new SharedStack(app, 'SharedStack' + postfix, env, {
  env: env_data,
});

// Create a CognitoStack so the Cognito instance is independent
const cognitoStack = new CognitoStack(app, 'CognitoStack' + postfix, env, {
  vpc: sharedStack.vpc,
  env: env_data,
});

// Create a DatabaseStack for the Database, so it is independent of any Lambdas
const databaseStack = new DatabaseStack(app, 'DatabaseStack' + postfix, env, {
  vpc: sharedStack.vpc,
  env: env_data,
});

// Create BackendStack, complete with Lambdas and routing
const backendStack = new BackendStack(app, 'BackendStack' + postfix, env, {
  vpc: sharedStack.vpc,
  credentials: databaseStack.credentials,
  credentialsSecretName: databaseStack.credentialsSecretName,
  dbInstance: databaseStack.dbInstance,
  auth: cognitoStack.auth,
  env: env_data,
});
