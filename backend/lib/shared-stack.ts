import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
// "cdk-fck-nat reduces costs by about 2/3, this can be removed to use the default natgateway provided by AWS"
import { FckNatInstanceProvider } from 'cdk-fck-nat';

export class SharedStack extends Stack {
  public readonly vpc: ec2.Vpc;
  public readonly securityGroup: ec2.SecurityGroup;
  public readonly credentials: rds.DatabaseSecret;
  public readonly credentialsSecretName: string;

  constructor(
    scope: Construct,
    id: string,
    environmentName: string,
    props?: StackProps
  ) {
    super(scope, id, props);

    // Create NAT Gateway Provider using an EC2 Instance
    // Managed NAT Gateway is expensive
    // When deploying application at scale, remove this
    const natGatewayProvider = new FckNatInstanceProvider({
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.NANO
      ),
    });

    // Create VPC needed for DB cluster
    this.vpc = new ec2.Vpc(this, 'vpc', {
      natGatewayProvider,
    });

    // Add Ingress Rules to NAT Gateway Provider
    natGatewayProvider.securityGroup.addIngressRule(
      ec2.Peer.ipv4(this.vpc.vpcCidrBlock),
      ec2.Port.allTraffic()
    );
  }
}
