import { Environment, getEnvironment, isDev, isLocal, isProd } from ".";

describe("getEnvironment", () => {
  afterEach(() => {
    process.env.CURRYCOMPARE_ENVIRONMENT = undefined;
  });

  it("should return Environment.PROD when CURRYCOMPARE_ENVIRONMENT='prod'", () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = "prod";

    expect(getEnvironment()).toBe(Environment.PROD);
  });

  it("should return Environment.DEV when CURRYCOMPARE_ENVIRONMENT='dev'", () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = "dev";

    expect(getEnvironment()).toBe(Environment.DEV);
  });

  it("should return Environment.LOCAL when CURRYCOMPARE_ENVIRONMENT", () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = "local";

    expect(getEnvironment()).toBe(Environment.LOCAL);
  });

  it("Should throw an error when CURRYCOMPARE_ENVIRONMENT is undefined", () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = undefined;

    expect(() => {
      getEnvironment();
    }).toThrow(
      "Invalid CURRYCOMPARE_ENVIRONMENT. Expected: 'local', 'dev', 'prod'. Got: undefined",
    );
  });

  it("Should throw an error when CURRYCOMPARE_ENVIRONMENT is not one of prod, dev or local", () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = "demo";

    expect(() => {
      getEnvironment();
    }).toThrow(
      "Invalid CURRYCOMPARE_ENVIRONMENT. Expected: 'local', 'dev', 'prod'. Got: demo",
    );
  });
});

describe("isProd", () => {
  afterEach(() => {
    process.env.CURRYCOMPARE_ENVIRONMENT = undefined;
  });

  it.each([
    { env: "prod", expected: true },
    { env: "dev", expected: false },
    { env: "local", expected: false },
  ])(
    "Should return $expected when CURRYCOMPARE_ENVIRONMENT = $env",
    ({ env, expected }) => {
      process.env.CURRYCOMPARE_ENVIRONMENT = env;
      expect(isProd()).toBe(expected);
    },
  );

  it("Should throw an error when CURRYCOMPARE_ENVIRONMENT is undefined", () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = undefined;
    expect(() => {
      isProd();
    }).toThrow();
  });

  it("Should throw an error when CURRYCOMPARE_ENVIRONMENT is invalid", () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = "Local";
    expect(() => {
      isProd();
    }).toThrow();
  });
});

describe("isDev", () => {
  afterEach(() => {
    process.env.CURRYCOMPARE_ENVIRONMENT = undefined;
  });

  it.each([
    { env: "prod", expected: false },
    { env: "dev", expected: true },
    { env: "local", expected: false },
  ])(
    "Should return $expected when CURRYCOMPARE_ENVIRONMENT = $env",
    ({ env, expected }) => {
      process.env.CURRYCOMPARE_ENVIRONMENT = env;
      expect(isDev()).toBe(expected);
    },
  );

  it("Should throw an error when CURRYCOMPARE_ENVIRONMENT is undefined", () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = undefined;
    expect(() => {
      isDev();
    }).toThrow();
  });

  it("Should throw an error when CURRYCOMPARE_ENVIRONMENT is invalid", () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = "Local";
    expect(() => {
      isDev();
    }).toThrow();
  });
});

describe("isLocal", () => {
  afterEach(() => {
    process.env.CURRYCOMPARE_ENVIRONMENT = undefined;
  });

  it.each([
    { env: "prod", expected: false },
    { env: "dev", expected: false },
    { env: "local", expected: true },
  ])(
    "Should return $expected when CURRYCOMPARE_ENVIRONMENT = $env",
    ({ env, expected }) => {
      process.env.CURRYCOMPARE_ENVIRONMENT = env;
      expect(isLocal()).toBe(expected);
    },
  );

  it("Should throw an error when CURRYCOMPARE_ENVIRONMENT is undefined", () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = undefined;
    expect(() => {
      isLocal();
    }).toThrow();
  });

  it("Should throw an error when CURRYCOMPARE_ENVIRONMENT is invalid", () => {
    process.env.CURRYCOMPARE_ENVIRONMENT = "Local";
    expect(() => {
      isLocal();
    }).toThrow();
  });
});
