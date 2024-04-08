import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Database } from './database';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

interface LambdaProps {
  environmentName: string;
  vpc: cdk.aws_ec2.IVpc;
  handlerName: string;
  functionName: string;
  codeDirectory: string;
  environment?: { [key: string]: string };
  layers?: lambda.LayerVersion[];
  credentials?: cdk.aws_rds.DatabaseSecret;
  dbInstance?: Database;
  timeoutDuration?: number;
}

export class Lambda extends Construct {
  public readonly lambda;
  constructor(scope: Construct, id: string, props: LambdaProps) {
    super(scope, id);

    const {
      environmentName,
      vpc,
      handlerName,
      functionName,
      layers,
      environment,
      credentials,
      dbInstance,
      timeoutDuration,
      codeDirectory,
    } = props;

    this.lambda = new lambda.Function(
      scope,
      `${functionName}_${environmentName}`,
      {
        functionName: `${functionName}_${environmentName}`,
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: handlerName,
        code: lambda.Code.fromAsset('lambda/' + codeDirectory),
        vpc,
        environment,
        timeout: cdk.Duration.seconds(timeoutDuration || 10),
        ...(layers && { layers: [...layers] }),
      }
    );

    credentials?.grantRead(this.lambda);

    if (dbInstance) {
      this.lambda.connections.allowTo(
        dbInstance.database,
        ec2.Port.allTraffic()
      );
    }
  }
}
