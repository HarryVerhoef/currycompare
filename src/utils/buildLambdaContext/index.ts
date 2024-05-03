import { type Context } from "aws-lambda";

const dummyLambdaContext: Context = {
  callbackWaitsForEmptyEventLoop: false,
  functionName: "myLambdaFunction",
  functionVersion: "$LATEST",
  invokedFunctionArn:
    "arn:aws:lambda:us-west-2:123456789012:function:myLambdaFunction",
  memoryLimitInMB: "128",
  awsRequestId: "unique-request-id",
  logGroupName: "/aws/lambda/myLambdaFunction",
  logStreamName: "2024/05/03/[$LATEST]abcdef1234567890abcdef1234567890",
  identity: undefined,
  clientContext: undefined,

  getRemainingTimeInMillis: () => {
    // For example purposes, we'll just return a fixed number
    // In a real scenario, this would likely calculate time based on function start time and timeout
    return 3000; // 3 seconds left
  },

  // Deprecated methods, but still part of the interface
  done: (error?: Error, result?: any) => {
    console.log("Done called", error, result);
  },
  fail: (error: Error | string) => {
    console.log("Fail called", error);
  },
  succeed: (messageOrObject: any, object?: any) => {
    console.log("Succeed called", messageOrObject, object);
  },
};

const buildLambdaContext = (overrides: Partial<Context> = {}): Context => ({
  ...dummyLambdaContext,
  ...overrides,
});

export default buildLambdaContext;
