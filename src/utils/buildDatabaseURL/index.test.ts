import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from "@aws-sdk/client-secrets-manager";
import { buildDatabaseURL } from ".";
import { mockClient } from "aws-sdk-client-mock";

describe("buildDatabaseURL", () => {
  const dbUrl = process.env.DATABASE_URL;
  const testUser = "testUser";
  const testPass = "01@$yooo$23";
  const testPassSecretName = "testPassSecretName";
  const testEndpoint = "testEndpoint";
  const testRegion = "global";

  const secretsManagerMock = mockClient(SecretsManagerClient);

  secretsManagerMock.on(GetSecretValueCommand).resolves({
    SecretString: JSON.stringify({
      password: testPass,
    }),
  });

  beforeEach(() => {
    process.env.CURRYCOMPARE_ENVIRONMENT = "dev";
  });

  afterAll(() => {
    process.env.DATABASE_URL = dbUrl;
  });

  it("should throw an error in a local context and DATABASE_URL is not set", async () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = "local";

    await expect(buildDatabaseURL()).rejects.toThrow(
      "Environment variable 'DATABASE_URL' is not set",
    );
  });

  it("should return DATABASE_URL if in a local context and it is set", async () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = "local";
    process.env.DATABASE_URL =
      "postgresql://user:mysecretpassword@localhost:5432";

    await expect(
      buildDatabaseURL({
        username: testUser,
        dbPasswordSecretName: testPassSecretName,
        endpoint: testEndpoint,
        awsRegion: testRegion,
      }),
    ).resolves.toBe("postgresql://user:mysecretpassword@localhost:5432");
  });

  it("should throw an error if DB_MASTER_USERNAME is not set", async () => {
    await expect(
      buildDatabaseURL({
        username: undefined,
        dbPasswordSecretName: testPassSecretName,
        endpoint: testEndpoint,
        awsRegion: testRegion,
      }),
    ).rejects.toThrow("Environment variable 'DB_MASTER_USERNAME' not set");
  });

  it("should throw an error if DB_PASSWORD_SECRET_NAME is not set", async () => {
    await expect(
      buildDatabaseURL({
        username: testUser,
        dbPasswordSecretName: undefined,
        endpoint: testEndpoint,
        awsRegion: testRegion,
      }),
    ).rejects.toThrow("Environment variable 'DB_PASSWORD_SECRET_NAME' not set");
  });

  it("should throw an error if DB_ENDPOINT is not set", async () => {
    await expect(
      buildDatabaseURL({
        username: testUser,
        dbPasswordSecretName: testPassSecretName,
        endpoint: undefined,
        awsRegion: testRegion,
      }),
    ).rejects.toThrow("Environment variable 'DB_ENDPOINT' not set");
  });

  it("should throw an error if AWS_REGION is not set", async () => {
    await expect(
      buildDatabaseURL({
        username: testUser,
        dbPasswordSecretName: testPassSecretName,
        endpoint: testEndpoint,
        awsRegion: undefined,
      }),
    ).rejects.toThrow("Environment variable 'AWS_REGION' not set");
  });

  it("should not throw an error if the required environment variables are set", async () => {
    await expect(
      buildDatabaseURL({
        username: testUser,
        dbPasswordSecretName: testPassSecretName,
        endpoint: testEndpoint,
        awsRegion: testRegion,
      }),
    ).resolves.not.toThrow();
  });

  it("should return the correct db url given the test environment variables", async () => {
    await expect(
      buildDatabaseURL({
        username: testUser,
        dbPasswordSecretName: testPassSecretName,
        endpoint: testEndpoint,
        awsRegion: testRegion,
      }),
    ).resolves.toBe(
      "postgresql://testUser:01%40%24yooo%2423@testEndpoint:5432",
    );
  });
});
