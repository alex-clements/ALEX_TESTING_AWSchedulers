const { getPrisma } = process.env.AWS_REGION
  ? require('/opt/client')
  : require('../../layers/prisma/client_local');
const csv = require('csv-parser');
const { Readable } = require('stream');

const {
  CognitoIdentityProviderClient,
  AdminRemoveUserFromGroupCommand,
  AdminAddUserToGroupCommand,
  AdminEnableUserCommand,
  AdminDisableUserCommand,
} = require('@aws-sdk/client-cognito-identity-provider');

let prisma;

const headers = {
  'Content-Type': 'text/plain',
  'Access-Control-Allow-Origin': '*',
};

exports.handler = async function (event, context) {
  const body = event?.body ? JSON.parse(event?.body) : {};
  if (!prisma) prisma = await getPrisma();
  const stage = body.stage;

  if (stage === 'upload') {
    try {
      await uploadUsersData(body.data);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ result: 'Success!' }),
      };
    } catch (err) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Something went wrong :(' }),
      };
    }
  } else {
    try {
      const validationResults = await validateData(body.data);
      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ result: validationResults }),
      };
    } catch (err) {
      console.log('Error encountered: ', err);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Something went wrong :(' }),
      };
    }
  }
};

const validateData = async (data) => {
  const errorsList = [];
  const warningsList = [];

  // 0. Validate CSV Format
  console.log('Validating Users Data CSV');
  await validateCsvFormat(data, errorsList, warningsList);
  if (errorsList.length > 0) {
    errorsList.unshift('Please ensure the upload file is a valid csv file.');
    return { errorsList, warningsList };
  }
  console.log('Errors list: ', errorsList);

  // 1. Get Users Data
  console.log('Getting users data');
  let usersData = await getUsersDataFromCsv(data);
  console.log('usersData: ', usersData);

  // 2. Get Buildings Data
  const buildingsData = await prisma.building.findMany();
  console.log('buildings: ', buildingsData);
  const buildingsMap = {};

  buildingsData.forEach((building) => {
    buildingsMap[`${building.airportCode}${building.number}`] = building.id;
  });

  // 3. Verify users are assigned to valid buildings
  await validateUserBuildings(usersData, buildingsMap, errorsList);
  if (errorsList.length > 0) return { errorsList, warningsList };

  // 4. Verify required user information is present
  usersData = validateUserFieldsPopulated(usersData, errorsList, warningsList);
  if (errorsList.length > 0) return { errorsList, warningsList };

  // 5. Determine if there are duplicate users in the file
  validateNoDuplicateUsernames(usersData, errorsList);
  if (errorsList.length > 0) return { errorsList, warningsList };

  // 6. Determine if there are duplicate emails in the file
  validateNoDuplicateEmails(usersData, errorsList);
  if (errorsList.length > 0) return { errorsList, warningsList };

  // 7. Validate temporary passwords in the file
  validateTemporaryPasswords(usersData, errorsList);
  if (errorsList.length > 0) return { errorsList, warningsList };

  // 8. Find if any users in file already exist
  await findExistingUsers(usersData, prisma, errorsList, warningsList);

  return { errorsList, warningsList };
};

const validateNoDuplicateUsernames = (usersData, errorsList) => {
  const usersSet = new Set();
  usersData.forEach((userData) => {
    if (usersSet.has(userData.username)) {
      errorsList.push(
        `Username ${userData.username} appears twice in the file. Please remove one occurrence.`
      );
    }
    usersSet.add(userData.username);
  });
};

const validateNoDuplicateEmails = (usersData, errorsList) => {
  const emailsSet = new Set();
  usersData.forEach((userData) => {
    if (emailsSet.has(userData.email)) {
      errorsList.push(
        `Email ${userData.email} appears twice in the file. Please remove one occurrence.`
      );
    }
    emailsSet.add(userData.email);
  });
};

const validateUserFieldsPopulated = (usersData, errorsList, warningsList) => {
  const updatedUsersData = [];
  usersData.forEach((userData, index) => {
    if (userData.username === '') {
      errorsList.push(`User on line ${index + 1} has no username specified.`);
    } else if (
      userData.name === '' ||
      userData.email === '' ||
      isNaN(userData.floorNumber) ||
      isNaN(userData.buildingNumber) ||
      userData.airportCode === ''
    ) {
      errorsList.push(
        `User ${userData.username} is missing information. Please ensure all required fields are filled out.`
      );
    }

    if (userData.isAdmin !== 'TRUE' && userData.isAdmin !== 'FALSE') {
      errorsList.push(
        `User ${userData.username} has an invalid value for "isAdmin". This should be set to TRUE or FALSE.`
      );
    }

    if (userData.isActive !== 'TRUE' && userData.isActive !== 'FALSE') {
      errorsList.push(
        `User ${userData.username} has an invalid value for "isActive". This should be set to TRUE or FALSE.`
      );
    }

    updatedUsersData.push({
      ...userData,
      isAdmin: userData.isAdmin === 'TRUE',
      isActive: userData.isActive === 'TRUE',
    });
  });

  return updatedUsersData;
};

const validateUserBuildings = async (usersData, buildingsMap, errorsList) => {
  for (let userData of usersData) {
    const assignedBuilding =
      buildingsMap[`${userData.airportCode}${userData.buildingNumber}`];
    if (assignedBuilding === undefined) {
      errorsList.push(
        `User ${userData.username} is not assigned to a valid building. ${userData.airportCode} ${userData.buildingNumber} does not exist.`
      );
    }
  }
};

const findExistingUsers = async (
  usersData,
  prisma,
  errorsList,
  warningsList
) => {
  for (let userData of usersData) {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: userData.username,
      },
    });

    if (existingUser) {
      warningsList.push(
        `User ${userData.username} already exists. Proceeding from here will update their information. Note that temporary passwords, emails, and usernames will not be updated.`
      );
    }
  }
};

const validateCsvFormat = async (data, errorsList) => {
  return new Promise((resolve, reject) => {
    try {
      const dataStream = Readable.from(data);
      dataStream.pipe(csv()).on('headers', (headers) => {
        const requiredColumns = new Set([
          'username',
          'name',
          'email',
          'isAdmin',
          'isActive',
          'airportCode',
          'buildingNumber',
          'floorNumber',
          'temporaryPassword',
        ]);

        const foundColumns = new Set(headers);
        console.log('found columns: ', headers);

        const remainingColumns = new Set();
        requiredColumns.forEach((item) => {
          if (!foundColumns.has(item)) {
            remainingColumns.add(item);
          }
        });

        if (remainingColumns.size > 0) {
          remainingColumns.forEach((column) => {
            console.log(`Found missing column heading: ${column}`);
            errorsList.push(
              `Missing "${column}" column heading in uploader file.`
            );
          });
        }
        resolve(true);
      });
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
};

const uploadUsersData = async (data) => {
  console.log('Uploading Users Data');
  // 1. Get Users Data
  let usersData = await getUsersDataFromCsv(data);

  // 2. Change isAdmin and isActive from usersData
  usersData = replaceIsAdminAndIsActive(usersData);
  console.log('usersData: ', usersData);

  // 2. Get Buildings Data
  const buildingsData = await prisma.building.findMany();
  console.log('buildings: ', buildingsData);
  const buildingsMap = {};

  buildingsData.forEach((building) => {
    buildingsMap[`${building.airportCode}${building.number}`] = building.id;
  });

  // 3. Add Users to Cognito
  console.log('Adding users to Cognito');
  await createCognitoUsers(usersData);

  // 4. Enable / Disable Cognito Users
  console.log('Updating user statuses in Cognito');
  await enableDisableCognitoUsers(usersData);

  // 5. Update Cognito User Groups
  console.log('Updating Cognito User group placements');
  await updateCognitoUserGroups(usersData);

  // 6. Add Users to Database
  console.log('Adding users to database');
  await addUpdateDbUsers(prisma, usersData, buildingsMap);
};

const replaceIsAdminAndIsActive = (usersData) => {
  const updatedData = [];
  usersData.forEach((user) => {
    updatedData.push({
      ...user,
      isAdmin: user.isAdmin === 'TRUE',
      isActive: user.isActive === 'TRUE',
    });
  });
  return updatedData;
};

const getUsersDataFromCsv = (data) => {
  return new Promise((resolve, reject) => {
    try {
      const usersData = [];
      const dataStream = Readable.from(data);
      dataStream
        .pipe(csv())
        .on('data', (data) => {
          const {
            username,
            name,
            email,
            isAdmin,
            isActive,
            floorNumber,
            temporaryPassword,
            buildingNumber,
            airportCode,
          } = data;
          usersData.push({
            username,
            name,
            email,
            isAdmin,
            isActive,
            floorNumber: parseInt(floorNumber),
            temporaryPassword,
            buildingNumber: parseInt(buildingNumber),
            airportCode,
          });
        })
        .on('end', () => {
          resolve(usersData);
        });
    } catch (err) {
      reject(err);
    }
  });
};

//TODO:
async function addUpdateDbUsers(prisma, userData, buildingsDataMap) {
  const userDataProcessed = [];
  userData.forEach((user, index) => {
    userDataProcessed.push({
      username: user.username,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isActive: user.isActive,
      floorNumber: user.floorNumber,
      buildingId: buildingsDataMap[`${user.airportCode}${user.buildingNumber}`],
    });
  });

  const userUpdates = [];
  const newUserCreation = [];

  for (const userDataItem of userDataProcessed) {
    const existingUser = await prisma.user.findUnique({
      where: {
        username: userDataItem.username,
      },
    });

    if (existingUser) {
      userUpdates.push(
        prisma.user.update({
          where: {
            username: userDataItem.username,
          },
          data: { ...userDataItem, email: existingUser.email },
        })
      );
    } else {
      newUserCreation.push(
        prisma.user.create({
          data: userDataItem,
        })
      );
    }
  }

  await prisma.$transaction([...userUpdates, ...newUserCreation]);
}

async function createCognitoUsers(userData) {
  const cognitoUserData = [];
  userData.forEach((user) => {
    cognitoUserData.push({
      username: user.username,
      isAdmin: user.isAdmin,
      temporaryPassword: user.temporaryPassword,
      email: user.email,
    });
  });

  const cognitoUserPromises = cognitoUserData.map(async (user) => {
    try {
      const {
        CognitoIdentityProviderClient,
        AdminCreateUserCommand,
      } = require('@aws-sdk/client-cognito-identity-provider');

      let cognito = new CognitoIdentityProviderClient();
      // Create user in user pool
      let createUserInput = {
        UserPoolId: process.env.USER_POOL_ID,
        Username: user.username,
        UserAttributes: [{ Name: 'email', Value: user.email }],
      };

      if (!user.temporaryPassword) {
        createUserInput = {
          DesiredDeliveryMediums: ['EMAIL'],
          ...createUserInput,
        };
      } else {
        createUserInput = {
          MessageAction: 'SUPPRESS',
          TemporaryPassword: user.temporaryPassword,
          ...createUserInput,
        };
      }

      const command = new AdminCreateUserCommand(createUserInput);
      const response = await cognito.send(command);

      if (user.isAdmin) {
        const adminResponse = await addUserToGroup(cognito, user.username);
      }
    } catch (err) {
      console.log('Got error here', user);
      return {
        error: 'User not created in user pool.',
      };
    }
  });

  await Promise.all(cognitoUserPromises);
  console.log('finished waiting for cognito promises');
}

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

const enableDisableCognitoUsers = async (usersData) => {
  const promises = [];
  usersData.forEach((userData) => {
    if (userData.isActive) {
      promises.push(enableUserPoolUser(userData.username));
    } else {
      promises.push(disableUserPoolUser(userData.username));
    }
  });

  await Promise.all(promises);
};

const disableUserPoolUser = async (username) => {
  let cognito = new CognitoIdentityProviderClient();

  const disableUserInput = {
    UserPoolId: process.env.USER_POOL_ID,
    Username: username,
  };

  const command = new AdminDisableUserCommand(disableUserInput);
  let response = await cognito.send(command);

  return response;
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

const updateCognitoUserGroups = async (usersData) => {
  const promises = [];
  const cognito = new CognitoIdentityProviderClient();
  usersData.forEach((userData) => {
    if (userData.isAdmin) {
      promises.push(addUserToGroup(cognito, userData.username));
    } else {
      promises.push(removeUserFromGroup(cognito, userData.username));
    }
  });
  await Promise.all(promises);
};

const validateTemporaryPasswords = (usersData, errorsList) => {
  const lengthRegex = /^\S{8,}$/;
  const specialCharacterRegex = /[!@#$%^&*()\-_=+[\]{};:'"|<>,.?/]/;
  const lowerCaseRegex = /[a-z]+/;
  const upperCaseRegex = /[A-Z]+/;
  const numberRegex = /[0-9]+/;

  usersData.forEach((userData) => {
    const temporaryPassword = userData.temporaryPassword;
    if (userData.temporaryPassword) {
      const lengthTest = lengthRegex.test(temporaryPassword);
      const specialCharacterTest =
        specialCharacterRegex.test(temporaryPassword);
      const lowerCaseTest = lowerCaseRegex.test(temporaryPassword);
      const upperCaseTest = upperCaseRegex.test(temporaryPassword);
      const numberTest = numberRegex.test(temporaryPassword);

      const testResults =
        lengthTest &&
        specialCharacterTest &&
        lowerCaseTest &&
        upperCaseTest &&
        numberTest;

      if (!testResults) {
        errorsList.push(
          `Temporary password for ${userData.username} not satisfied. Must include at least 8 characters, one special character, one lowercase character, one uppercase character, and one number.`
        );
      }
    }
  });
};
