import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DatabaseStack extends cdk.Stack {
  public readonly tables: {
    users: dynamodb.Table;
    sessions: dynamodb.Table;
    audioCache: dynamodb.Table;
    analytics: dynamodb.Table;
  };

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Users Table
    const usersTable = new dynamodb.Table(this, 'UsersTable', {
      tableName: 'drishya-code-users',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      pointInTimeRecovery: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // Sessions Table
    const sessionsTable = new dynamodb.Table(this, 'SessionsTable', {
      tableName: 'drishya-code-sessions',
      partitionKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      timeToLiveAttribute: 'ttl',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    sessionsTable.addGlobalSecondaryIndex({
      indexName: 'UserIdIndex',
      partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'timestamp', type: dynamodb.AttributeType.NUMBER },
    });

    // Audio Cache Table
    const audioCacheTable = new dynamodb.Table(this, 'AudioCacheTable', {
      tableName: 'drishya-code-audio-cache',
      partitionKey: { name: 'contentHash', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      timeToLiveAttribute: 'expiresAt',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Analytics Table
    const analyticsTable = new dynamodb.Table(this, 'AnalyticsTable', {
      tableName: 'drishya-code-analytics',
      partitionKey: { name: 'date', type: dynamodb.AttributeType.STRING },
      sortKey: { name: 'userSessionId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    this.tables = {
      users: usersTable,
      sessions: sessionsTable,
      audioCache: audioCacheTable,
      analytics: analyticsTable,
    };

    // Outputs
    new cdk.CfnOutput(this, 'UsersTableName', {
      value: usersTable.tableName,
    });
    new cdk.CfnOutput(this, 'SessionsTableName', {
      value: sessionsTable.tableName,
    });
    new cdk.CfnOutput(this, 'AudioCacheTableName', {
      value: audioCacheTable.tableName,
    });
    new cdk.CfnOutput(this, 'AnalyticsTableName', {
      value: analyticsTable.tableName,
    });
  }
}
