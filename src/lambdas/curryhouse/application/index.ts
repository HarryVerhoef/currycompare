import { type LambdaHandler } from "../../../types/lambda";
import buildLambdaHandler from "../../../utils/buildLambdaHandler";

// force job

export const PostCurryhouseApplicationName = "SubmitCurryhouseApplication";

export const handler: LambdaHandler = buildLambdaHandler({
  handler: async (event) => {
    console.log("Request event:", event);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([]),
    };
  },
});
