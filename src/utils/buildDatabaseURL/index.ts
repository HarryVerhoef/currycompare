import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export const buildDatabaseURL = async ({
  username = process.env.DB_MASTER_USERNAME,
  dbPasswordSecretName = process.env.DB_PASSWORD_SECRET_NAME,
  endpoint = process.env.DB_ENDPOINT,
  awsRegion = process.env.AWS_REGION,
}: {
  username?: string;
  dbPasswordSecretName?: string;
  endpoint?: string;
  awsRegion?: string;
} = {}): Promise<string> => {
  console.log("Building database URL...");

  if (username === undefined) {
    throw Error("Environment variable 'DB_MASTER_USERNAME' not set");
  }

  if (dbPasswordSecretName === undefined) {
    throw Error("Environment variable 'DB_PASSWORD_SECRET_NAME' not set");
  }

  if (endpoint === undefined) {
    throw Error("Environment variable 'DB_ENDPOINT' not set");
  }

  if (awsRegion === undefined) {
    throw Error("Environment variable 'AWS_REGION' not set");
  }

  try {
    console.log("Instantiating SecretsManagerClient...");

    const client = new SecretsManagerClient({
      region: awsRegion,
    });

    const input = {
      SecretId: dbPasswordSecretName,
    };

    const command = new GetSecretValueCommand(input);

    const response = await client.send(command);

    if (response.SecretString === undefined) throw Error();

    const password = JSON.parse(response.SecretString).password as string;

    const encodedPassword = encodeURIComponent(password);

    return `postgresql://${username}:${encodedPassword}@${endpoint}:5432`;
  } catch (e) {
    throw Error(`There was an error building the database URL`);
  }
};
