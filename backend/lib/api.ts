import { Construct } from 'constructs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { IFunction } from 'aws-cdk-lib/aws-lambda';

interface APIProps {
  environmentName: string;
  authorizerHandler: IFunction;
}

export class API extends Construct {
  public readonly restApi;
  public readonly authorizer;
  constructor(scope: Construct, id: string, props: APIProps) {
    super(scope, id);

    const { environmentName, authorizerHandler } = props;

    this.restApi = new apigw.RestApi(
      this,
      `AWScheduler API ${environmentName}`,
      {
        defaultCorsPreflightOptions: {
          allowOrigins: apigw.Cors.ALL_ORIGINS,
          allowHeaders: apigw.Cors.DEFAULT_HEADERS,
          allowMethods: apigw.Cors.ALL_METHODS,
        },
        deployOptions: {
          stageName: environmentName,
        },
      }
    );

    this.authorizer = new apigw.RequestAuthorizer(this, 'Authorizer', {
      authorizerName: 'Authorizer',
      handler: authorizerHandler,
      identitySources: [apigw.IdentitySource.header('Authorization')],
    });
  }
}
