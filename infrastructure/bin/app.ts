#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { ApiStack } from '../lib/stacks/api-stack';
import { AuthStack } from '../lib/stacks/auth-stack';
import { DatabaseStack } from '../lib/stacks/database-stack';
import { StorageStack } from '../lib/stacks/storage-stack';
import { LambdaStack } from '../lib/stacks/lambda-stack';

const app = new cdk.App();

const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-east-1',
};

// Create stacks in dependency order
const authStack = new AuthStack(app, 'DrishyaCodeAuthStack', { env });
const databaseStack = new DatabaseStack(app, 'DrishyaCodeDatabaseStack', { env });
const storageStack = new StorageStack(app, 'DrishyaCodeStorageStack', { env });
const lambdaStack = new LambdaStack(app, 'DrishyaCodeLambdaStack', {
  env,
  userPool: authStack.userPool,
  tables: databaseStack.tables,
  audioBucket: storageStack.audioBucket,
});
const apiStack = new ApiStack(app, 'DrishyaCodeApiStack', {
  env,
  userPool: authStack.userPool,
  lambdaFunctions: lambdaStack.functions,
});

app.synth();
