import buildLambdaEvent from ".";
import { type LambdaEvent } from "../../types/lambda";

describe("buildLambdaEvent", () => {
  it("should build an event with no overrides provided", () => {
    const dummyEvent: LambdaEvent = buildLambdaEvent();

    expect(dummyEvent).toMatchObject({
      version: "2.0",
    });
  });

  it("should overwrite the body if given as a parameter", () => {
    const bodyOverride: string = JSON.stringify({
      curry: "compare",
    });

    const dummyEvent: LambdaEvent = buildLambdaEvent({
      body: bodyOverride,
    });

    expect(dummyEvent.body).toBe(bodyOverride);
  });

  it("should overwrite the queryStringParameters if given as a parameter", () => {
    const queryStringParametersOverride = {
      curry: "compare",
    };

    const dummyEvent: LambdaEvent = buildLambdaEvent({
      queryStringParameters: queryStringParametersOverride,
    });

    expect(dummyEvent.queryStringParameters).toEqual(
      queryStringParametersOverride,
    );
  });

  it("should overwrite the pathParameters if given as a parameter", () => {
    const pathParametersOverride = {
      curry: "compare",
    };

    const dummyEvent: LambdaEvent = buildLambdaEvent({
      pathParameters: pathParametersOverride,
    });

    expect(dummyEvent.pathParameters).toBe(pathParametersOverride);
  });
});
