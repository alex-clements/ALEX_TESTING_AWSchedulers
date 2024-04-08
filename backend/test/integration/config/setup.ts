/* eslint-disable @typescript-eslint/no-unused-vars */

import { MySqlContainer } from '@testcontainers/mysql';
import { Config } from '@jest/types';
import { execSync } from 'child_process';

module.exports = async function (
  globalConfig: Config.GlobalConfig,
  projectConfig: Config.ProjectConfig
) {
  // Container is automatically removed when tests are completed
  // Creates a testcontainers/ryuk image to manage the lifecycle of the container
  const mysqlContainer = await new MySqlContainer('mysql:8.0.35')
    .withExposedPorts(3306)
    .start();

  process.env.DATABASE_URL = mysqlContainer.getConnectionUri();

  execSync('npm run install-deps');

  execSync('cd layers/prisma && npx prisma generate');
  execSync('cd layers/prisma && npx prisma migrate deploy');
  execSync(
    `cd lambda/seedDB && node -e "console.log(require('./seed').handler({}));"`
  );
};
