# AWSchedulers

This repository contains the code used to develop the meeting room booking system for Amazon Web Services.

## Environment Setup

### Back End

**Basic Setup**

To perform any development on the back end of the application, complete the following setup step:

1. Under backend/layers/prisma directory create a .env file. Copy paste the contents of .env.example to this file. This helps setup the database url for prisma-mysql
2. Run the command `npm run install-deps` from the `backend` directory.

**Alternative Setup**

Alternatively, you can set up the back end by running the following commands.

1. Install the AWS CDK CLI by running `npm install -g aws-cdk` from any directory.
2. From the `backend` directory run `npm install`.
3. From the `backend/layers/prisma` directory run `PRISMA_CLI_BINARY_TARGETS="rhel-openssl-3.0.x"  npm install`.
4. Generate Prisma Client by running from the `backend/layers/prisma` directory: `npx prisma generate`

**_Bootstrap cdk_**

If you are using your own account and have not done so already you need to bootstrap the cloud development kit (cdk).

1. If you have not yet configured your aws account and the aws cli please look at the following guide: https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-getting-started.html

2. To bootstrap cdk using the default aws profile, and the profiles default region run `cdk bootstrap`. If you want to use a different profile you can use `cdk bootstrap --profile PROFILE_NAME`

**Local Database Setup**

This section is only required if you are planning on developing for the database.

1. Ensure Docker is installed on your machine. Follow steps [here](https://docs.docker.com/engine/install/) if Docker is not currently installed.
2. Pull the image for MySQL version 8.0.35 from Docker Hub:
   `docker pull mysql:8.0.35`
3. Create a local MySQL container:
   `docker run --name AWSchedulersDB -e MYSQL_ROOT_PASSWORD=password -p 3306:3306 -d mysql:8.0.35`
4. Initialize database by running from the `backend/layers/prisma` directory:
   `npx prisma migrate deploy`
