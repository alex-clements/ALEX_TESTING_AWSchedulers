const PrismaClient = require('@prisma/client').PrismaClient;

const path = require('path');
const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require('@aws-sdk/client-secrets-manager');

let dbInfo;

const getCredentials = async () => {
  const secrets = new SecretsManagerClient({
    region: process.env.AWS_REGION,
  });

  const input = {
    SecretId: process.env.CREDS_SECRET_NAME,
  };

  const command = new GetSecretValueCommand(input);
  const data = await secrets.send(command);
  dbInfo = JSON.parse(data.SecretString);
};

const getPrisma = async () => {
  if (!dbInfo) await getCredentials();
  const { username, password, host } = dbInfo;
  return new PrismaClient({
    datasources: {
      db: {
        url: `mysql://${username}:${password}@${host}:3306/AWSchedulersDB`,
      },
    },
  });
};

const executePrismaMigration = async () => {
  if (!dbInfo) await getCredentials();
  const { username, password, host } = dbInfo;
  const exitVal = await new Promise((resolve, reject) => {
    var execFile = require('child_process').execFile;
    let database_url = `mysql://${username}:${password}@${host}:3306/AWSchedulersDB`;
    execFile(
      path.resolve('/opt/node_modules/prisma/build/index.js'),
      ['migrate', 'deploy', '--schema', '/opt/prisma/schema.prisma'],
      {
        env: {
          ...process.env,
          DATABASE_URL: database_url,
          PRISMA_CLI_BINARY_TARGETS: 'rhel-openssl-3.0.x',
          PRISMA_SCHEMA_ENGINE_BINARY:
            '/opt/node_modules/@prisma/engines/schema-engine-rhel-openssl-3.0.x',
        },
      },
      (err, stdout, stderr) => {
        if (err) {
          console.log(`err from execFile: ${err}`);
          reject(err);
          err;
        } else {
          console.log(`stdout from execFile: ${stdout}`);
          console.log(`stderr from execFile: ${stderr}`);
          resolve(stdout);
        }
      }
    );
  });

  return { exitVal };
};

module.exports = {
  getPrisma,
  executePrismaMigration,
};
