import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

interface LambdaStackProps extends cdk.StackProps {
  userPool: cognito.UserPool;
  tables: {
    users: dynamodb.Table;
    sessions: dynamodb.Table;
    audioCache: dynamodb.Table;
    analytics: dynamodb.Table;
  };
  audioBucket: s3.Bucket;
}

export class LambdaStack extends cdk.Stack {
  public readonly functions: {
    [key: string]: lambda.Function;
  };

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    this.functions = {};

    // Common Lambda environment variables
    const commonEnv = {
      USERS_TABLE: props.tables.users.tableName,
      SESSIONS_TABLE: props.tables.sessions.tableName,
      AUDIO_CACHE_TABLE: props.tables.audioCache.tableName,
      ANALYTICS_TABLE: props.tables.analytics.tableName,
      AUDIO_BUCKET: props.audioBucket.bucketName,
    };

    // Placeholder Lambda functions (to be implemented in later phases)
    const functionConfigs = [
      { name: 'CodeAnalysis', handler: 'code-analysis/handler.handler' },
      { name: 'Visualization', handler: 'visualization/handler.handler' },
      { name: 'AITutor', handler: 'ai-tutor/handler.handler' },
      { name: 'AudioSynthesis', handler: 'audio-synthesis/handler.handler' },
      { name: 'SyncService', handler: 'sync-service/handler.handler' },
      { name: 'QuizService', handler: 'quiz-service/handler.handler' },
      { name: 'ErrorDebugger', handler: 'error-debugger/handler.handler' },
    ];

    functionConfigs.forEach((config) => {
      const fn = new lambda.Function(this, config.name, {
        functionName: `drishya-code-${config.name.toLowerCase()}`,
        runtime: lambda.Runtime.NODEJS_20_X,
        code: lambda.Code.fromAsset('../backend'),
        handler: config.handler,
        environment: commonEnv,
        timeout: cdk.Duration.seconds(30),
        memorySize: 512,
      });

      // Grant permissions
      props.tables.users.grantReadWriteData(fn);
      props.tables.sessions.grantReadWriteData(fn);
      props.tables.audioCache.grantReadWriteData(fn);
      props.tables.analytics.grantReadWriteData(fn);
      props.audioBucket.grantReadWrite(fn);

      this.functions[config.name] = fn;
    });
  }
}
