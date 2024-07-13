export enum Environment {
  LOCAL,
  DEV,
  PROD,
}

export const getEnvironment = (): Environment => {
  if (process.env.CURRYCOMPARE_ENVIRONMENT === "prod") return Environment.PROD;
  if (process.env.CURRYCOMPARE_ENVIRONMENT === "dev") return Environment.DEV;
  if (process.env.CURRYCOMPARE_ENVIRONMENT === "local")
    return Environment.LOCAL;

  throw new Error(
    `Invalid CURRYCOMPARE_ENVIRONMENT. Expected: 'local', 'dev', 'prod'. Got: ${process.env.CURRYCOMPARE_ENVIRONMENT}`,
  );
};

export const isProd = (): boolean => getEnvironment() === Environment.PROD;
export const isDev = (): boolean => getEnvironment() === Environment.DEV;
export const isLocal = (): boolean => getEnvironment() === Environment.LOCAL;
