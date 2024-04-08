const { getPrisma } = process.env.AWS_REGION
  ? require('/opt/client')
  : require('../../../layers/prisma/client_local');

const { createUserSchema, updateUserSchema, handleError } = process.env
  .AWS_REGION
  ? require('/opt/dist/client')
  : require('../../../layers/zod/dist/client');

const {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminListGroupsForUserCommand,
  AdminDisableUserCommand,
  AdminEnableUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

let prisma;

const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': '*',
};

exports.handler = async function (event, context) {
  try {
    if (!prisma) prisma = await getPrisma();

    let response = {};
    const body = event?.body ? JSON.parse(event?.body) : {};
    const id = event?.queryStringParameters?.id;
    const httpMethod = event?.httpMethod;

    if ((httpMethod == 'PUT' || httpMethod == 'DELETE') && !id) {
      response = {
        error: 'ID not provided.',
        status: 400,
      };
    } else if (httpMethod === 'POST') {
      if (body.email && (await emailExist(body.email))) {
        return {
          statusCode: 400,
          headers: headers,
          body: JSON.stringify({ error: 'Duplicated email.' }),
        };
      }
      response = await createUserPoolUser(body);
      if (response.error === undefined) {
        response = await createUser(body);
      }
    } else if (httpMethod === 'PUT') {
      // disable also uses this request
      const username = await findUsername(id);
      response = await updateUser(id, body, username);
    } else if (httpMethod === 'GET') {
      response = await getUsers(id);

      if (response === null) {
        response = {
          error: 'User not found.',
          status: 404,
        };
      }
    }

    return {
      statusCode: 'error' in response ? response.status : 200,
      headers: headers,
      body:
        'error' in response
          ? JSON.stringify({ error: response.error })
          : JSON.stringify({ result: response }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: headers,
      body: JSON.stringify({
        error: 'Something went wrong. Please try again.',
      }),
    };
  }
};

const listUsersGroup = async (cognito, username) => {
  const listGroupsInput = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
  };
  const command = new AdminListGroupsForUserCommand(listGroupsInput);
  const response = await cognito.send(command);
  return response;
};

const addUserToGroup = async (cognito, username) => {
  const addToGroupInput = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
    GroupName: 'Admin',
  };

  const command = new AdminAddUserToGroupCommand(addToGroupInput);
  const response = await cognito.send(command);
  return response;
};

const removeUserFromGroup = async (cognito, username) => {
  const removeFromGroupInput = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
    GroupName: 'Admin',
  };
  const command = new AdminRemoveUserFromGroupCommand(removeFromGroupInput);
  const response = await cognito.send(command);
  return response;
};

const createUserPoolUser = async (data) => {
  try {
    data = createUserSchema.parse(data);

    let cognito = new CognitoIdentityProviderClient();

    let createUserInput;

    // Uses frontend supplied temporary password if provided
    if (data?.temporaryPassword) {
      createUserInput = {
        UserPoolId: process.env.USER_POOL_ID,
        Username: data.username,
        MessageAction: 'SUPPRESS',
        ...(data?.email && {
          UserAttributes: [{ Name: 'email', Value: data.email }],
        }),
        TemporaryPassword: data.temporaryPassword,
      };
      // Otherwise, uses email to send the temporary password
    } else if (data?.email) {
      createUserInput = {
        UserPoolId: process.env.USER_POOL_ID,
        Username: data.username,
        DesiredDeliveryMediums: ['EMAIL'],
        UserAttributes: [{ Name: 'email', Value: data.email }],
      };
    } else {
      return {
        error: 'Email or Temporary Password must be provided to create user.',
        status: 400,
      };
    }

    const command = new AdminCreateUserCommand(createUserInput);
    const response = await cognito.send(command);

    if (data.isAdmin) {
      return await addUserToGroup(cognito, data.username);
    }
    return response;
  } catch (err) {
    if (err.name === 'UsernameExistsException') {
      return {
        error: 'Duplicated username.',
        status: 400,
      };
    }

    return {
      error: 'User not created in user pool.',
      status: 400,
    };
  }
};

const disableUserPoolUser = async (username) => {
  try {
    let cognito = new CognitoIdentityProviderClient();

    // Remove user from user pool
    const disableUserInput = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
    };

    const command = new AdminDisableUserCommand(disableUserInput);
    let response = await cognito.send(command);

    return response;
  } catch (err) {
    return {
      error: 'User not removed from user pool.',
      status: 400,
    };
  }
};

const enableUserPoolUser = async (username) => {
  try {
    let cognito = new CognitoIdentityProviderClient();

    const enableUserInput = {
      UserPoolId: process.env.USER_POOL_ID,
      Username: username,
    };

    const command = new AdminEnableUserCommand(enableUserInput);
    let response = await cognito.send(command);

    return response;
  } catch (err) {
    return {
      error: 'User not enabled in user pool. User group not updated.',
      status: 400,
    };
  }
};

const updateUserGroup = async (username, isAdmin) => {
  try {
    if (username === undefined) {
      return {
        error: 'Username not provided - update user group failed.',
        status: 400,
      };
    }

    let cognito = new CognitoIdentityProviderClient();

    // Get user group
    const response = await listUsersGroup(cognito, username);

    if (isAdmin && response.Groups.length === 0) {
      // add user to admin group
      return await addUserToGroup(cognito, username);
    } else if (!isAdmin && response.Groups.length > 0) {
      // Remove user from admin group
      return await removeUserFromGroup(cognito, username);
    } else {
      return { result: 'User group not updated' };
    }
  } catch (err) {
    return {
      error: 'User group not updated.',
      status: 400,
    };
  }
};

const createUser = async (data) => {
  try {
    data = createUserSchema.parse(data);

    if ('temporaryPassword' in data) {
      delete data.temporaryPassword;
    }

    if ('Building' in data) {
      data.Building = {
        connect: {
          id: data.Building,
        },
      };
    }

    return await prisma.user.create({
      data: data,
    });
  } catch (err) {
    return handleError(err);
  }
};

const updateUser = async (id, data, username) => {
  try {
    data = updateUserSchema.parse(data);

    if (Object.keys(data).length === 0) {
      return {
        error: 'Data not provided for update.',
        status: 400,
      };
    } else if ('username' in data) {
      return {
        error: 'Username cannot be updated.',
        status: 400,
      };
    } else if ('isAdmin' in data) {
      // update user group with the retrieved username

      const response = await updateUserGroup(username, data.isAdmin);
      if ('error' in response) {
        return response;
      } else if ('isActive' in data) {
        const currentUserObject = await prisma.user.findUnique({
          where: {
            id: id,
          },
        });
        if (currentUserObject.isActive != data.isActive) {
          if (!data.isActive) {
            const response = await disableUserPoolUser(username);
            if (response.error) {
              return {
                error: 'Could not disable user in user pool. Please try again.',
                status: 400,
              };
            }
          } else {
            const response = await enableUserPoolUser(username);
            if (response.error) {
              return {
                error: 'Could not enable user in user pool. Please try again.',
                status: 400,
              };
            }
          }
        }
      }
    }

    if ('Building' in data) {
      data.Building = {
        connect: {
          id: data.Building,
        },
      };
    }

    return await prisma.user.update({
      where: {
        id: id,
      },
      data: data,
    });
  } catch (err) {
    return handleError(err);
  }
};

// const deleteUser = async (id) => {
//   try {
//     const response = await prisma.user.delete({
//       where: {
//         id: id,
//       },
//     });
//     return response;
//   } catch (err) {
//     return {
//       error: 'Something went wrong - Delete failed',
//       status: 404,
//     };
//   }
// };

const getUsers = async (id) => {
  let response = {};

  if (!id) {
    response = await prisma.user.findMany();

    response = response.length === 0 ? null : response;
  } else {
    response = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  return response;
};

const findUsername = async (id) => {
  const result = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      username: true,
    },
  });
  return result.username;
};

const emailExist = async (email) => {
  const result = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  return result !== null;
};
