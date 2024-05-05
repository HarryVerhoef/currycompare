import { type Context } from "aws-lambda";
import buildLambdaContext from ".";

describe("buildLambdaContext", () => {
  it("should provide a context if no overrides are provided", () => {
    const dummyContext: Context = buildLambdaContext();

    expect(dummyContext).toMatchObject({ functionVersion: "$LATEST" });
  });

  it("should overwrite the functionName if provided as an override", () => {
    const dummyContext: Context = buildLambdaContext({
      functionName: "currycompare",
    });

    expect(dummyContext.functionName).toBe("currycompare");
  });

  it("should overwrite the awsrequestId if provided as an override", () => {
    const dummyContext: Context = buildLambdaContext({
      awsRequestId: "curry-compare",
    });

    expect(dummyContext.awsRequestId).toBe("curry-compare");
  });
});
