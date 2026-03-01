import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface ApiStackProps extends cdk.StackProps {
  userPool: cognito.UserPool;
  lambdaFunctions: { [key: string]: lambda.Function };
}

export class ApiStack extends cdk.Stack {
  public readonly api: apigateway.RestApi;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // Create API Gateway
    this.api = new apigateway.RestApi(this, 'DrishyaCodeApi', {
      restApiName: 'Drishya Code API',
      description: 'API for Drishya Code platform',
      deployOptions: {
        stageName: 'prod',
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    // Create Cognito Authorizer
    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'ApiAuthorizer', {
      cognitoUserPools: [props.userPool],
    });

    // API Resources
    const codeAnalysis = this.api.root.addResource('analyze');
    codeAnalysis.addMethod(
      'POST',
      new apigateway.LambdaIntegration(props.lambdaFunctions.CodeAnalysis),
      { authorizer }
    );

    const visualization = this.api.root.addResource('visualize');
    visualization.addMethod(
      'POST',
      new apigateway.LambdaIntegration(props.lambdaFunctions.Visualization),
      { authorizer }
    );

    const tutor = this.api.root.addResource('tutor');
    tutor.addMethod(
      'POST',
      new apigateway.LambdaIntegration(props.lambdaFunctions.AITutor),
      { authorizer }
    );

    const audio = this.api.root.addResource('audio');
    audio.addMethod(
      'POST',
      new apigateway.LambdaIntegration(props.lambdaFunctions.AudioSynthesis),
      { authorizer }
    );

    const quiz = this.api.root.addResource('quiz');
    quiz.addMethod(
      'POST',
      new apigateway.LambdaIntegration(props.lambdaFunctions.QuizService),
      { authorizer }
    );

    const debug = this.api.root.addResource('debug');
    debug.addMethod(
      'POST',
      new apigateway.LambdaIntegration(props.lambdaFunctions.ErrorDebugger),
      { authorizer }
    );

    // Output
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: this.api.url,
      description: 'API Gateway URL',
    });
  }
}
