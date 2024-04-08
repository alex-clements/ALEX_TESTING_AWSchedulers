const { userSchema } = require('/opt/dist/client');

exports.handler = async function () {
  try {
    const userData = {
      username: 'test_user',
      name: 'name',
      floorNumber: 23,
      building: 1,
    };

    userSchema.parse(userData);

    return 'userdata successfully parsed';
  } catch (err) {
    return `userdata not successfully parsed: , ${err}`;
  }
};
