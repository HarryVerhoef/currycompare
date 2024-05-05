import {
  type LambdaEvent,
  type LambdaRequestContext,
} from "../../types/lambda";

const dummyRequestContext: LambdaRequestContext = {
  accountId: "123456789012",
  apiId: "api-id",
  authentication: {
    clientCert: {
      clientCertPem:
        "-----BEGIN CERTIFICATE-----\n...\n-----END CERTIFICATE-----",
      subjectDN: "CN=example-client",
      issuerDN: "CN=example-issuer",
      serialNumber: "1234567890abcdef",
      validity: {
        notBefore: "May 1 12:00:00 2021 GMT",
        notAfter: "May 1 12:00:00 2022 GMT",
      },
    },
  },
  domainName: "example.com",
  domainPrefix: "test",
  http: {
    method: "GET",
    path: "/my/path",
    protocol: "HTTP/1.1",
    sourceIp: "192.168.1.1",
    userAgent: "CustomUserAgentString",
  },
  requestId: "request-id",
  routeKey: "$default",
  stage: "prod",
  time: "Wed, 20 Apr 2022 20:00:00 GMT",
  timeEpoch: 1650492000000,
};

const defaultEvent: LambdaEvent = {
  version: "2.0",
  routeKey: "$default",
  rawPath: "/my/path",
  rawQueryString: "param1=value1&param2=value2",
  cookies: ["sessionid=123456789"], // Optional, can be undefined if no cookies are sent
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  queryStringParameters: {
    param1: "value1",
    param2: "value2",
  },
  requestContext: dummyRequestContext,
  body: '{"key":"value"}', // Optional, can be undefined if no body is sent
  pathParameters: {
    param1: "value1",
  },
  isBase64Encoded: false,
  stageVariables: {
    stageName: "dev",
  },
};

const buildLambdaEvent = (
  overrides: Partial<LambdaEvent> = {},
): LambdaEvent => ({
  ...defaultEvent,
  ...overrides,
});

export default buildLambdaEvent;
