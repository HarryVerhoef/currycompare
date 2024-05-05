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

  it("should return hello world with a 200 status code", async () => {
    const { statusCode, body } = await handler(
      dummyEvent,
      dummyContext,
      () => {},
    );

    expect(statusCode).toBe(200);
    expect(body).toBe("hello, world");
  });
});
