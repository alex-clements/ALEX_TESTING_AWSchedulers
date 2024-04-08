import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import * as cdk from 'aws-cdk-lib/core';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { Database } from './database';
import { PrismaLayer } from './prisma_layer';
import { ZodLayer } from './zod_layer';
import { Lambda } from './lambda';
import { Auth } from './auth';
import { API } from './api';

export interface BackendStackProps extends StackProps {
  vpc: ec2.Vpc;
  credentialsSecretName: string;
  credentials: rds.DatabaseSecret;
  dbInstance: Database;
  auth: Auth;
}

export class BackendStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    environmentName: string,
    props: BackendStackProps
  ) {
    super(scope, id, props);

    const { vpc, credentialsSecretName, credentials, dbInstance, auth } = props;

    // Create Authorizer Lambda
    const authorizerLambda = new Lambda(this, 'auth-lambda', {
      environmentName,
      vpc,
      handlerName: 'authorizer.handler',
      functionName: 'authorizer',
      environment: {
        USER_POOL_ID: auth.pool.userPoolId,
        CLIENT_ID: auth.poolClient.userPoolClientId,
      },
      codeDirectory: 'auth/authorizer',
    }).lambda;

    // Create Protected Route Lambda
    const protectedRouteLambda = new Lambda(this, 'protected-route-lambda', {
      environmentName,
      vpc,
      handlerName: 'check_route.handler',
      functionName: 'check_route',
      codeDirectory: 'auth/protected_routes',
    });

    // Create REST API Gateway
    const api = new API(this, 'api', {
      environmentName,
      authorizerHandler: authorizerLambda,
    });

    // Create Prisma Lambda Layer
    const layerPrisma = new PrismaLayer(this, 'prisma-layer', {
      environmentName,
    });

    // Create Zod Lambda Layer
    const layerZod = new ZodLayer(this, 'zod-layer', {
      environmentName,
    });

    // Create Lambda for Testing Zod
    const lambdaZodTesting = new Lambda(this, 'lambda-zod-testing', {
      environmentName,
      vpc,
      handlerName: 'zodTest.handler',
      functionName: 'zod_test',
      layers: [layerZod.layer],
      timeoutDuration: 10,
      codeDirectory: 'testing',
    });

    // Create Lambda for Prisma Migration
    const lambdaPrismaMigrate = new Lambda(this, 'lambda-prisma-migrate', {
      environmentName,
      vpc,
      handlerName: 'prismaMigrate.handler',
      functionName: 'prisma_migrate',
      environment: {
        CREDS_SECRET_NAME: credentialsSecretName,
      },
      layers: [layerPrisma.layer],
      credentials,
      dbInstance,
      timeoutDuration: 300,
      codeDirectory: 'prisma',
    });

    const lambdaAdminUpload = new Lambda(this, 'lambda-admin-upload', {
      environmentName,
      vpc,
      handlerName: 'upload.handler',
      functionName: 'upload_admin',
      environment: {
        CREDS_SECRET_NAME: credentialsSecretName,
        USER_POOL_ID: auth.pool.userPoolId,
      },
      layers: [layerPrisma.layer, layerZod.layer],
      credentials,
      dbInstance,
      codeDirectory: 'admin/upload',
      timeoutDuration: 300,
    });

    auth.pool.grant(
      lambdaAdminUpload.lambda,
      'cognito-idp:AdminCreateUser',
      'cognito-idp:AdminAddUserToGroup',
      'cognito-idp:AdminRemoveUserFromGroup',
      'cognito-idp:AdminDisableUser',
      'cognito-idp:AdminEnableUser'
    );

    const lambdaManipulateUsersAdmin = new Lambda(
      this,
      'lambda-user-routes-admin',
      {
        environmentName,
        vpc,
        handlerName: 'manipulateUsers_admin.handler',
        functionName: 'user_routes_admin',
        environment: {
          CREDS_SECRET_NAME: credentialsSecretName,
          USER_POOL_ID: auth.pool.userPoolId,
        },
        layers: [layerPrisma.layer, layerZod.layer],
        credentials,
        dbInstance,
        codeDirectory: 'admin/users',
      }
    );

    auth.pool.grant(
      lambdaManipulateUsersAdmin.lambda,
      'cognito-idp:AdminCreateUser',
      'cognito-idp:AdminAddUserToGroup',
      'cognito-idp:AdminRemoveUserFromGroup',
      'cognito-idp:AdminListGroupsForUser',
      'cognito-idp:AdminDisableUser',
      'cognito-idp:AdminEnableUser'
    );

    const lambdaManipulateBuildingsAdmin = new Lambda(
      this,
      'lambda-building-routes-admin',
      {
        environmentName,
        vpc,
        handlerName: 'manipulateBuildings_admin.handler',
        functionName: 'building_routes_admin',
        environment: {
          CREDS_SECRET_NAME: credentialsSecretName,
        },
        layers: [layerPrisma.layer, layerZod.layer],
        credentials,
        dbInstance,
        codeDirectory: 'admin/buildings',
      }
    );

    const lambdaBuildings = new Lambda(this, 'lambda-buildings', {
      environmentName,
      vpc,
      handlerName: 'index.handler',
      functionName: 'buildings',
      environment: {
        CREDS_SECRET_NAME: credentialsSecretName,
      },
      layers: [layerPrisma.layer],
      credentials,
      dbInstance,
      codeDirectory: 'buildings',
    });

    const lambdaAvailableRooms = new Lambda(this, 'lambda-available-rooms', {
      environmentName,
      vpc,
      handlerName: 'index.handler',
      functionName: 'available-rooms',
      environment: {
        CREDS_SECRET_NAME: credentialsSecretName,
      },
      layers: [layerPrisma.layer, layerZod.layer],
      credentials,
      dbInstance,
      codeDirectory: 'availableRooms',
    });

    const lambdaManipulateRoomsAdmin = new Lambda(
      this,
      'lambda-room-routes-admin',
      {
        environmentName,
        vpc,
        handlerName: 'manipulateRooms_admin.handler',
        functionName: 'room_routes_admin',
        environment: {
          CREDS_SECRET_NAME: credentialsSecretName,
        },
        layers: [layerPrisma.layer, layerZod.layer],
        credentials,
        dbInstance,
        codeDirectory: 'admin/rooms',
      }
    );

    const lambdaUsers = new Lambda(this, 'lambda-users', {
      environmentName,
      vpc,
      handlerName: 'index.handler',
      functionName: 'users',
      environment: {
        CREDS_SECRET_NAME: credentialsSecretName,
      },
      layers: [layerPrisma.layer],
      credentials,
      dbInstance,
      codeDirectory: 'users',
    });

    const lambdaManipulateBookingsUser = new Lambda(
      this,
      'lambda-booking-routes-user',
      {
        environmentName,
        vpc,
        handlerName: 'manipulateBookings_user.handler',
        functionName: 'booking_routes_user',
        environment: {
          CREDS_SECRET_NAME: credentialsSecretName,
        },
        layers: [layerPrisma.layer, layerZod.layer],
        credentials,
        dbInstance,
        codeDirectory: 'user/bookings',
      }
    );

    const lambdaGetOwnSchedule = new Lambda(this, 'lambda-get-own-schedule', {
      environmentName,
      vpc,
      handlerName: 'getOwnSchedule.handler',
      functionName: 'get-own-schedule',
      environment: {
        CREDS_SECRET_NAME: credentialsSecretName,
      },
      layers: [layerPrisma.layer, layerZod.layer],
      credentials,
      dbInstance,
      codeDirectory: 'user/schedule',
    });

    const lambdaDeleteOwnBookingRecord = new Lambda(
      this,
      'lambda-delete-own-BookingRecord',
      {
        environmentName,
        vpc,
        handlerName: 'deleteOwnBookingRecord.handler',
        functionName: 'delete-own-booking-record',
        environment: {
          CREDS_SECRET_NAME: credentialsSecretName,
        },
        layers: [layerPrisma.layer, layerZod.layer],
        credentials,
        dbInstance,
        codeDirectory: 'user/schedule',
      }
    );

    const lambdaGetAttendeesAvailability = new Lambda(
      this,
      'lambda-attendees-availabilities',
      {
        environmentName,
        vpc,
        handlerName: 'getAttendeesAvailability.handler',
        functionName: 'attendees-availabilities',
        environment: {
          CREDS_SECRET_NAME: credentialsSecretName,
        },
        layers: [layerPrisma.layer, layerZod.layer],
        credentials,
        dbInstance,
        codeDirectory: 'algo/attendeesAvailability',
      }
    );

    const lambdaGetBookingOptions = new Lambda(this, 'lambda-booking-options', {
      environmentName,
      vpc,
      handlerName: 'getBookingOptions.handler',
      functionName: 'booking-options',
      environment: {
        CREDS_SECRET_NAME: credentialsSecretName,
      },
      layers: [layerPrisma.layer, layerZod.layer],
      credentials,
      dbInstance,
      codeDirectory: 'algo/bookingOptions',
    });

    // Create lambda to test seedDB function
    const lambdaSeedDb = new Lambda(this, 'lambda-seed-db', {
      environmentName,
      vpc,
      handlerName: 'seed.handler',
      functionName: 'seed-db',
      environment: {
        CREDS_SECRET_NAME: credentialsSecretName,
        USER_POOL_ID: auth.pool.userPoolId,
      },
      layers: [layerPrisma.layer],
      credentials,
      dbInstance,
      codeDirectory: 'seedDB',
      timeoutDuration: 60,
    });

    auth.pool.grant(
      lambdaSeedDb.lambda,
      'cognito-idp:AdminCreateUser',
      'cognito-idp:AdminAddUserToGroup'
    );

    // Add Lambdas to API
    // Any methods under the admin resource will require the user to be in the admin group
    const adminResource = api.restApi.root.addResource('admin');
    const accessResource = api.restApi.root.addResource('access');
    const adminUserResource = adminResource.addResource('users'); //  /admin/users
    const adminBuildingsResource = adminResource.addResource('buildings'); //  /admin/buildings
    const buildingsResource = api.restApi.root.addResource('buildings'); //  /building
    const adminRoomsResource = adminResource.addResource('rooms'); //  /admin/rooms
    const availableRoomsResource =
      api.restApi.root.addResource('availableRooms'); //  /availableRooms
    const adminUploadResource = adminResource.addResource('upload'); // /admin/upload
    const userResource = api.restApi.root.addResource('user');
    const usersResource = api.restApi.root.addResource('users'); //  /users
    const userScheduleResource = userResource.addResource('schedule'); //  /user/schedule
    const userBookingResource = userResource.addResource('bookings'); //  /user/bookings
    const userBookingOptionsResource =
      userResource.addResource('bookingOptions'); //  /user/bookingOptions
    const userAttendeesAvailabilityResource = userResource.addResource(
      'attendeesAvailability'
    ); //  /user/attendeesAvailability

    // wrapper function for adding methods
    const addMethodsToResource = (
      resource: apigw.Resource,
      methods: string[],
      lambda: lambda.Function
    ) => {
      methods.forEach((method: string) => {
        resource.addMethod(method, new apigw.LambdaIntegration(lambda), {
          authorizer: api.authorizer,
        });
      });
    };

    // Check for protected routes
    const protectedRoutesMethods = ['GET'];
    addMethodsToResource(
      accessResource,
      protectedRoutesMethods,
      protectedRouteLambda.lambda
    );

    // User routes for admin
    const adminUserMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    addMethodsToResource(
      adminUserResource,
      adminUserMethods,
      lambdaManipulateUsersAdmin.lambda
    );

    // Room routes for admin
    const adminRoomMethods = ['GET', 'POST', 'PUT', 'DELETE'];
    addMethodsToResource(
      adminRoomsResource,
      adminRoomMethods,
      lambdaManipulateRoomsAdmin.lambda
    );

    // Building routes for admin
    const adminBuildingMethods = ['POST', 'PUT', 'DELETE'];
    addMethodsToResource(
      adminBuildingsResource,
      adminBuildingMethods,
      lambdaManipulateBuildingsAdmin.lambda
    );

    const buildingsMethods = ['GET'];

    addMethodsToResource(
      buildingsResource,
      buildingsMethods,
      lambdaBuildings.lambda
    );

    const availableRoomsMethods = ['POST'];

    addMethodsToResource(
      availableRoomsResource,
      availableRoomsMethods,
      lambdaAvailableRooms.lambda
    );

    const adminUploadMethods = ['POST'];
    addMethodsToResource(
      adminUploadResource,
      adminUploadMethods,
      lambdaAdminUpload.lambda
    );

    // User routes for user
    const usersMethods = ['GET'];
    addMethodsToResource(usersResource, usersMethods, lambdaUsers.lambda);

    // Booking routes for user
    const userBookingMethods = ['GET', 'POST', 'DELETE'];
    addMethodsToResource(
      userBookingResource,
      userBookingMethods,
      lambdaManipulateBookingsUser.lambda
    );

    // Schedule routes for user
    const getOwnScheduleMethods = ['GET'];
    addMethodsToResource(
      userScheduleResource,
      getOwnScheduleMethods,
      lambdaGetOwnSchedule.lambda
    );

    const deleteOwnBookingRecordMethods = ['DELETE'];
    addMethodsToResource(
      userScheduleResource,
      deleteOwnBookingRecordMethods,
      lambdaDeleteOwnBookingRecord.lambda
    );

    // Route to get booking options
    const getBookingOptionsMethods = ['POST'];
    addMethodsToResource(
      userBookingOptionsResource,
      getBookingOptionsMethods,
      lambdaGetBookingOptions.lambda
    );

    // Route to get attendees' availability
    const getAttendeesAvailabilityMethods = ['POST'];
    addMethodsToResource(
      userAttendeesAvailabilityResource,
      getAttendeesAvailabilityMethods,
      lambdaGetAttendeesAvailability.lambda
    );

    new cdk.CfnOutput(this, 'API Gateway URL', {
      value: api.restApi.url,
    });

    new cdk.CfnOutput(this, 'User Pool ID', {
      value: auth.pool.userPoolId,
    });

    new cdk.CfnOutput(this, 'User Pool Client ID', {
      value: auth.poolClient.userPoolClientId,
    });
  }
}
