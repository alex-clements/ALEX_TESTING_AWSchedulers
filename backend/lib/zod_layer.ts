import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface LayerProps {
  environmentName: string;
}

export class ZodLayer extends Construct {
  public readonly layer: lambda.LayerVersion;
  constructor(scope: Construct, id: string, props: LayerProps) {
    super(scope, id);

    const { environmentName } = props;

    this.layer = new lambda.LayerVersion(scope, 'ZodLayer', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      description: `zod_layer_${environmentName}`,
      code: lambda.Code.fromAsset('layers/zod', {
        bundling: {
          user: 'root',
          image: lambda.Runtime.NODEJS_20_X.bundlingImage,
          command: [
            'bash',
            '-c',
            [
              'cp package.json client.ts tsconfig.json /asset-output',
              'cd /asset-output',
              'npm install',
              'npx tsc',
            ].join(' && '),
          ],
        },
      }),
    });
  }
}
