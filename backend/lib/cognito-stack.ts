import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Auth } from './auth';

export interface CognitoStackProps extends StackProps {
  vpc: ec2.Vpc;
}

export class CognitoStack extends Stack {
  public readonly auth: Auth;
  constructor(
    scope: Construct,
    id: string,
    environmentName: string,
    props: CognitoStackProps
  ) {
    super(scope, id, props);

    const { vpc } = props;

    this.auth = new Auth(this, 'cognito', { environmentName, vpc });
  }
}
