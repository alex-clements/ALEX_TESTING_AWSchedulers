import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

interface LayerProps {
  environmentName: string;
}

export class PrismaLayer extends Construct {
  public readonly layer: lambda.LayerVersion;
  constructor(scope: Construct, id: string, props: LayerProps) {
    super(scope, id);

    const { environmentName } = props;

    this.layer = new lambda.LayerVersion(scope, 'PrismaLayer', {
      compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
      description: `prisma_layer_${environmentName}`,
      code: lambda.Code.fromAsset('layers/prisma', {
        bundling: {
          user: 'root',
          image: lambda.Runtime.NODEJS_20_X.bundlingImage,
          command: [
            'bash',
            '-c',
            [
              'cp package.json package-lock.json client.js /asset-output',
              'cp -r prisma /asset-output/prisma',
              'cp -r node_modules /asset-output/node_modules',
              'rm -rf /asset-output/node_modules/.cache',
              'rm -rf /asset-output/node_modules/@prisma/engines/node_modules || true',
              'rm -rf /asset-output/node_modules/.prisma/client/*darwin*.node || true',
              'rm -rf /asset-output/node_modules/.prisma/client/*-arm64-*.node || true',
              'npx prisma generate',
            ].join(' && '),
          ],
        },
      }),
    });
  }
}
