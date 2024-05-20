import buildLambdaEvent from "../../../utils/buildLambdaEvent";
import { handler } from ".";
import buildLambdaContext from "../../../utils/buildLambdaContext";
import { type LambdaContext, type LambdaEvent } from "../../../types/lambda";

describe("GET /curryhouses", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const dummyEvent: LambdaEvent = buildLambdaEvent();
  const dummyContext: LambdaContext = buildLambdaContext();

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
        rad: "5",
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "Missing required query string parameter: 'lng'",
    );
  });

  it("should respond with a 400 if lat is not included as a query string parameter", async () => {
    const event = buildLambdaEvent({
      queryStringParameters: {
        lng: "10",
        rad: "5",
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "Missing required query string parameter: 'lat'",
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
      "Missing required query string parameter: 'rad'",
    );
  });

  it("should respond with a 400 if lat is not a number", async () => {
    const event = buildLambdaEvent({
      queryStringParameters: {
        lat: "ten",
        lng: "10",
        rad: "5",
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "Expected 'lat' to be a number",
    );
  });

  it("should respond with a 400 if lng is not a number", async () => {
    const event = buildLambdaEvent({
      queryStringParameters: {
        lat: "10",
        lng: "ten",
        rad: "5",
      },
    });

    const { statusCode, body } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(400);
    expect(JSON.parse(body ?? "{}").errorMsg).toBe(
      "Expected 'lat' to be a number",
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
      "Expected 'rad' to be a number",
    );
  });
});
