/*
This file is for local testing only.
*/

const PrismaClient = require('@prisma/client').PrismaClient;

const getPrisma = async () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });
};
module.exports = {
  getPrisma,
};
