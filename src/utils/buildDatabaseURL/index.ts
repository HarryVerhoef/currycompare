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

  const encodedUsername = encodeURIComponent(process.env.DB_MASTER_USERNAME);
  const encodedPassword = encodeURIComponent(process.env.DB_MASTER_PASSWORD);
  // const encodedEndpoint = encodeURIComponent(process.env.DB_ENDPOINT);

  return `postgresql://${encodedUsername}:${encodedPassword}@${process.env.DB_ENDPOINT}:5432/currycompare`;
};
