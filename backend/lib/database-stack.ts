import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';

import { Database } from './database';

export interface DatabaseStackProps extends StackProps {
  vpc: ec2.Vpc;
}

export class DatabaseStack extends Stack {
  public readonly dbInstance: Database;
  public readonly credentialsSecretName: string;
  public readonly credentials: rds.DatabaseSecret;
  public readonly securityGroup: ec2.SecurityGroup;

  constructor(
    scope: Construct,
    id: string,
    environmentName: string,
    props: DatabaseStackProps
  ) {
    super(scope, id, props);

    // Create Credentials for My SQL Instance
    const instanceIdentifier = `mysql-awschedulers-${environmentName}`;
    this.credentialsSecretName =
      `/${id}/rds/creds/${instanceIdentifier}`.toLowerCase();
    this.credentials = new rds.DatabaseSecret(this, 'MysqlRdsCredentials', {
      secretName: this.credentialsSecretName,
      username: 'admin',
    });

    // Create Security Group
    this.securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      vpc: props.vpc,
      securityGroupName: `CDK Security Group ${environmentName}`,
    });

    // Create Database Instance
    this.dbInstance = new Database(this, 'database', {
      databaseName: 'AWSchedulersDB',
      vpc: props.vpc,
      securityGroup: this.securityGroup,
      credentials: this.credentials,
    });
  }
}
