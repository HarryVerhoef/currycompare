import { buildDatabaseURL } from ".";

describe("buildDatabaseURL", () => {
  const originalEnv = process.env;

  // Setup test environment
  beforeEach(() => {
    process.env.DB_MASTER_USERNAME = "testUser";
    process.env.DB_MASTER_PASSWORD = "testPass";
    process.env.DB_ENDPOINT = "testEndpoint";
  });

  // Reset environment
  afterEach(() => {
    delete process.env.DB_MASTER_USERNAME;
    delete process.env.DB_MASTER_PASSWORD;
    delete process.env.DB_ENDPOINT;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should throw an error if DB_MASTER_USERNAME is not provided", () => {
    delete process.env.DB_MASTER_USERNAME;

    expect(() => {
      buildDatabaseURL();
    }).toThrow("Environment variable 'DB_MASTER_USERNAME' not set");
  });

  it("should throw an error if DB_MASTER_PASSWORD is not set", () => {
    delete process.env.DB_MASTER_PASSWORD;

    expect(() => {
      buildDatabaseURL();
    }).toThrow("Environment variable 'DB_MASTER_PASSWORD' not set");
  });

  it("should throw an error if DB_ENDPOINT is not set", () => {
    delete process.env.DB_ENDPOINT;

    expect(() => {
      buildDatabaseURL();
    }).toThrow("Environment variable 'DB_ENDPOINT' not set");
  });

  it("should not throw an error if the required environment variables are set", () => {
    expect(() => {
      buildDatabaseURL();
    }).not.toThrow();
  });

  it("should return the correct db url given the test environment variables", () => {
    expect(buildDatabaseURL()).toBe(
      "postgresql://testUser:testPass@testEndpoint",
    );
  });

  it("should encode the username", () => {
    process.env.DB_MASTER_USERNAME = "01@$yooo$23";

    expect(buildDatabaseURL()).toBe(
      "postgresql://01%40%24yooo%2423:testPass@testEndpoint",
    );
  });

  it("should encode the password", () => {
    process.env.DB_MASTER_PASSWORD = "pa£%sw0rd";

    expect(buildDatabaseURL()).toBe(
      "postgresql://testUser:pa%C2%A3%25sw0rd@testEndpoint",
    );
  });

  it("should encode the endpoint", () => {
    process.env.DB_ENDPOINT = "https://google.com/abc?asd=%abc:1234";

    expect(buildDatabaseURL()).toBe(
      "postgresql://testUser:testPass@https%3A%2F%2Fgoogle.com%2Fabc%3Fasd%3D%25abc%3A1234",
    );
  });
});
