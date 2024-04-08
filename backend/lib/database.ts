import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

interface DatabaseProps {
  databaseName: string;
  vpc: cdk.aws_ec2.IVpc;
  securityGroup: cdk.aws_ec2.SecurityGroup;
  credentials: cdk.aws_rds.DatabaseSecret;
}

export class Database extends Construct {
  public readonly database: rds.DatabaseInstance;

  constructor(scope: Construct, id: string, props: DatabaseProps) {
    super(scope, id);

    const { databaseName, vpc, securityGroup, credentials } = props;

    this.database = new rds.DatabaseInstance(scope, 'db_instance', {
      engine: rds.DatabaseInstanceEngine.mysql({
        version: rds.MysqlEngineVersion.VER_8_0_35,
      }),
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      multiAz: false,
      allowMajorVersionUpgrade: true,
      autoMinorVersionUpgrade: false,
      backupRetention: cdk.Duration.days(20),
      securityGroups: [securityGroup],
      databaseName,
      port: 3306,
      allocatedStorage: 20,
      credentials: rds.Credentials.fromSecret(credentials),
    });
  }
}
