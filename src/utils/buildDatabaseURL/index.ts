#!/usr/bin/env ts-node

export const buildDatabaseURL = (): string => {
  if (process.env.DB_MASTER_USERNAME === undefined) {
    throw Error("Environment variable 'DB_MASTER_USERNAME' not set");
  }

  if (process.env.DB_MASTER_PASSWORD === undefined) {
    throw Error("Environment variable 'DB_MASTER_PASSWORD' not set");
  }

  if (process.env.DB_ENDPOINT === undefined) {
    throw Error("Environment variable 'DB_ENDPOINT' not set");
  }

  const encodedPassword = encodeURIComponent(process.env.DB_MASTER_PASSWORD);

  return `postgresql://${process.env.DB_MASTER_USERNAME}:${encodedPassword}@${process.env.DB_ENDPOINT}:5432`;
};
