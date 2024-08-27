import { handler } from ".";
import buildLambdaContext from "../../../../utils/buildLambdaContext";
import buildLambdaEvent from "../../../../utils/buildLambdaEvent";

describe("POST /curryhouse/application", () => {
  const dummyContext = buildLambdaContext();
  it("should return a 200 for now", async () => {
    const event = buildLambdaEvent();
    const { statusCode } = await handler(event, dummyContext, () => {});

    expect(statusCode).toBe(200);
  });
});
