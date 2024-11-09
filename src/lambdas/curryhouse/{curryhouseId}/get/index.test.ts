import { handler } from ".";
import buildLambdaContext from "../../../../utils/buildLambdaContext";
import buildLambdaEvent from "../../../../utils/buildLambdaEvent";

import * as buildDatabaseURLUtils from "../../../../utils/buildDatabaseURL";

jest.mock("../../../../utils/buildDatabaseURL", () => ({
  buildDatabaseURL: jest.fn(),
}));

const mockPrismaClient = {
  $queryRaw: jest.fn(),
};
jest.mock("../../../../prisma/generated", () => ({
  ...jest.requireActual("../../../../prisma/generated"),
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));

const dummyDBURL =
  "postgresql://currycompare_user:mysecretpassword@currycompare.com:5432";

describe("GET /curryhouse/{curryhouseId}", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const dummyContext = buildLambdaContext();

  (buildDatabaseURLUtils.buildDatabaseURL as jest.Mock).mockImplementation(
    () => dummyDBURL,
  );

  it("should return a 400 if curryHouseId if pathParameters is undefined", async () => {
    const event = buildLambdaEvent({
      pathParameters: undefined,
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should return a 400 if curryHouseId is not present in pathParameters", async () => {
    const event = buildLambdaEvent({
      pathParameters: {},
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should return a 400 if curryHouseId is not a string", async () => {
    const event = buildLambdaEvent({
      pathParameters: {
        curryHouseId: 123 as unknown as string,
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should return a 404 if curryHouseId is a string and present in pathParameters but no curryhouses found", async () => {
    const event = buildLambdaEvent({
      pathParameters: {
        curryHouseId: "123",
      },
    });

    const { statusCode } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(404);
  });

  it("should return a 200 if a curryhouse exists", async () => {
    const event = buildLambdaEvent({
      pathParameters: {
        curryHouseId: "123",
      },
    });

    mockPrismaClient.$queryRaw.mockResolvedValueOnce({
      id: "123",
    });

    const { statusCode } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(200);
  });
});
