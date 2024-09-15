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

describe("POST /curryhouse/application", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const dummyContext = buildLambdaContext();

  (buildDatabaseURLUtils.buildDatabaseURL as jest.Mock).mockImplementation(
    () => dummyDBURL,
  );

  it("should respond with a 400 if title is not included in the request", async () => {
    const event = buildLambdaEvent({
      body: JSON.stringify({
        phoneNumber: "07777777777",
        lat: "90",
        lng: "90",
        contactEmail: "harry@currycompare.com",
      }),
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should respond with a 400 if the phone number is not included in the request", async () => {
    const event = buildLambdaEvent({
      body: JSON.stringify({
        title: "Clapham Curries",
        lat: "90",
        lng: "90",
        contactEmail: "harry@currycompare.com",
      }),
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should respond with a 400 if the latitude is not included in the request", async () => {
    const event = buildLambdaEvent({
      body: JSON.stringify({
        title: "Clapham Curries",
        phoneNumber: "07777777777",
        lng: "90",
        contactEmail: "harry@currycompare.com",
      }),
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should respond with a 400 if the longitude is not included in the request", async () => {
    const event = buildLambdaEvent({
      body: JSON.stringify({
        title: "Clapham Curries",
        phoneNumber: "07777777777",
        lat: "90",
        contactEmail: "harry@currycompare.com",
      }),
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should respond with a 400 if the latitude is out of range", async () => {
    const event = buildLambdaEvent({
      body: JSON.stringify({
        title: "Clapham Curries",
        phoneNumber: "07777777777",
        lat: "95",
        lng: "90",
        contactEmail: "harry@currycompare.com",
      }),
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should respond with a 400 if the longitude is out of range", async () => {
    const event = buildLambdaEvent({
      body: JSON.stringify({
        title: "Clapham Curries",
        phoneNumber: "07777777777",
        lat: "90",
        lng: "190",
        contactEmail: "harry@currycompare.com",
      }),
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should respond with a 400 if the contact email is not included in the request", async () => {
    const event = buildLambdaEvent({
      body: JSON.stringify({
        title: "Clapham Curries",
        phoneNumber: "07777777777",
        lat: "90",
        lng: "90",
      }),
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "There was an error parsing the request: Unexpected type",
    );
  });

  it("should respond with a 204 if everything that is required is included in the request", async () => {
    const event = buildLambdaEvent({
      body: JSON.stringify({
        title: "Clapham Curries",
        phoneNumber: "07777777777",
        lat: "90",
        lng: "90",
        contactEmail: "harry@currycompare.com",
        websiteUrl: undefined,
        description: undefined,
      }),
    });

    const { statusCode } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(204);
  });

  it("should respond with a 204 if everything that is required is included in the request, with website url provided", async () => {
    const event = buildLambdaEvent({
      body: JSON.stringify({
        title: "Clapham Curries",
        phoneNumber: "07777777777",
        lat: "90",
        lng: "90",
        contactEmail: "harry@currycompare.com",
        websiteUrl: "https://currycompare.com",
        description: undefined,
      }),
    });

    const { statusCode } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(204);
  });

  it("should respond with a 204 if everything that is required is included in the request, with website description provided", async () => {
    const event = buildLambdaEvent({
      body: JSON.stringify({
        title: "Clapham Curries",
        phoneNumber: "07777777777",
        lat: "90",
        lng: "90",
        contactEmail: "harry@currycompare.com",
        websiteUrl: undefined,
        description: "The home of curry",
      }),
    });

    const { statusCode } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(204);
  });

  it("should respond with a 204 if everything is provided in the request", async () => {
    const event = buildLambdaEvent({
      body: JSON.stringify({
        title: "Clapham Curries",
        phoneNumber: "07777777777",
        lat: "90",
        lng: "90",
        contactEmail: "harry@currycompare.com",
        websiteUrl: "https://currycompare.com",
        description: "The home of curry",
      }),
    });

    const { statusCode } = await handler(event, dummyContext, () => {});
    expect(statusCode).toBe(204);
  });
});
