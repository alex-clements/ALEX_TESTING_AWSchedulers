import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import { Lambda } from './lambda';
import * as cdk from 'aws-cdk-lib';

interface AuthProps {
  environmentName: string;
  vpc: cdk.aws_ec2.IVpc;
}

export class Auth extends Construct {
  public readonly pool;
  public readonly poolClient;
  constructor(scope: Construct, id: string, props: AuthProps) {
    super(scope, id);

    const { environmentName, vpc } = props;

    // Define Cognito User Pool
    this.pool = new cognito.UserPool(this, `userPoolBooking`, {
      email: cognito.UserPoolEmail.withCognito(),
      userPoolName: `User Pool Booking ${environmentName}`,
      signInAliases: {
        email: true,
        username: true,
      },
    });
    this.poolClient = this.pool.addClient('app-client');

    new cognito.CfnUserPoolGroup(this, 'AdminGroup', {
      groupName: 'Admin',
      userPoolId: this.pool.userPoolId,
      description: 'Administrators Group',
    });
  }
}
