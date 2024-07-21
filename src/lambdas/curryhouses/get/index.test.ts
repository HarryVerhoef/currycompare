/* eslint-disable @typescript-eslint/no-non-null-assertion */
import buildLambdaEvent from "../../../utils/buildLambdaEvent";
import { handler } from ".";
import buildLambdaContext from "../../../utils/buildLambdaContext";
import { type LambdaContext, type LambdaEvent } from "../../../types/lambda";
import { SearchRadius } from "../../../codecs/SearchRadius";

import * as buildDatabaseURLUtils from "../../../utils/buildDatabaseURL";

jest.mock("../../../utils/buildDatabaseURL", () => ({
  buildDatabaseURL: jest.fn(),
}));

const mockPrismaClient = {
  $queryRaw: jest.fn(),
};
jest.mock("../../../prisma/generated", () => ({
  ...jest.requireActual("../../../prisma/generated"),
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));

describe("GET /curryhouses", () => {
  const dummyDBURL =
    "postgresql://currycompare_user:mysecretpassword@currycompare.com:5432";

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const dummyEvent: LambdaEvent = buildLambdaEvent();
  const dummyContext: LambdaContext = buildLambdaContext();

  (buildDatabaseURLUtils.buildDatabaseURL as jest.Mock).mockImplementation(
    () => dummyDBURL,
  );

  it("should log the request event", async () => {
    console.log = jest.fn();
    await handler(dummyEvent, dummyContext, () => {});

    expect(console.log).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith("Request event:", dummyEvent);
  });

  it("should respond with a 400 if lng is not included as a query string parameter", async () => {
    const event = buildLambdaEvent({
      queryStringParameters: {
        lat: "10",
        rad: SearchRadius.FIVE,
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should respond with a 400 if lat is not included as a query string parameter", async () => {
    const event = buildLambdaEvent({
      queryStringParameters: {
        lng: "10",
        rad: SearchRadius.FIVE,
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should respond with a 400 if rad is not included as a query string parameter", async () => {
    const event = buildLambdaEvent({
      queryStringParameters: {
        lat: "10",
        lng: "10",
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should respond with a 400 if lat is not a number", async () => {
    const event = buildLambdaEvent({
      queryStringParameters: {
        lat: "ten",
        lng: "10",
        rad: SearchRadius.FIVE,
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: cannot parse ten to a number",
    );
  });

  it("should respond with a 400 if lng is not a number", async () => {
    const event = buildLambdaEvent({
      queryStringParameters: {
        lat: "10",
        lng: "ten",
        rad: SearchRadius.FIVE,
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: cannot parse ten to a number",
    );
  });

  it("should respond with a 400 if rad is not a number", async () => {
    const event = buildLambdaEvent({
      queryStringParameters: {
        lat: "10",
        lng: "10",
        rad: "five",
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should respond with a 200 if everything is in order", async () => {
    mockPrismaClient.$queryRaw.mockResolvedValueOnce([]);

    const event = buildLambdaEvent({
      queryStringParameters: {
        lat: "10",
        lng: "10",
        rad: SearchRadius.FIVE,
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(200);
    expect(body).not.toBeUndefined();
    expect(JSON.parse(body!).curryhouses).toEqual([]);
  });

  it("should respond with any found curryhouses", async () => {
    mockPrismaClient.$queryRaw.mockResolvedValueOnce([
      {
        id: "curryhouse-1",
        title: "Curryhouse 1",
        phoneNumber: "0123456789",
        email: "curryhouse1@currycompare.com",
      },
    ]);

    const event = buildLambdaEvent({
      queryStringParameters: {
        lat: "10",
        lng: "10",
        rad: SearchRadius.FIVE,
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(200);
    expect(body).not.toBeUndefined();
    expect(JSON.parse(body!).curryhouses).toEqual([
      {
        id: "curryhouse-1",
        title: "Curryhouse 1",
        phoneNumber: "0123456789",
        email: "curryhouse1@currycompare.com",
      },
    ]);
  });
});
