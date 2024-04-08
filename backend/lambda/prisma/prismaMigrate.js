const prismaLayer = require('/opt/client');

exports.handler = async function () {
  try {
    const res = await prismaLayer.executePrismaMigration();
    return {
      status: 'Success',
      Result: res,
    };
  } catch (err) {
    console.log(err);
    return {
      status: 'Fail',
      Error: `Something went wrong with the migration, ${err}`,
    };
  }
};
