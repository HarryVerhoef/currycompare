import { type LambdaHandler } from "../../../types/lambda";

export const handler: LambdaHandler = async (event) => {
  // Force workflow test 4
  console.log("Request event:", event);

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain",
    },
    body: "hello, world",
  };
};
