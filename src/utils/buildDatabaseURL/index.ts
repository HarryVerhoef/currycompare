import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export const buildDatabaseURL = async ({
  username = process.env.DB_MASTER_USERNAME,
  dbPasswordSecretName = process.env.DB_PASSWORD_SECRET_NAME,
  endpoint = process.env.DB_ENDPOINT,
}): Promise<string> => {
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

  try {
    console.log("Instantiating SecretsManagerClient...");

    const client = new SecretsManagerClient();

    const input = {
      SecretId: dbPasswordSecretName,
    };

    const command = new GetSecretValueCommand(input);

    console.log("Sending GetSecretValue command...");
    const response = await client.send(command);

    console.log("Got secret value response:", response);

    if (response.SecretString === undefined) throw Error();

    const password = JSON.parse(response.SecretString).password as string;

    const encodedPassword = encodeURIComponent(password);

    return `postgresql://${process.env.DB_MASTER_USERNAME}:${encodedPassword}@${process.env.DB_ENDPOINT}:5432`;
  } catch (e) {
    console.error(e); // TEMP
    throw Error(`There was an error building the database URL: ${e}`);
  }
};
