import { type Request } from "express";
import { type LambdaEvent } from "../../types/lambda";
import buildLambdaEvent from "../buildLambdaEvent";
import { validateExpressQueryParams } from "../validateExpressQueryParams/validateExpressQueryParams";
import { validateExpressHeaders } from "../validateExpressHeaders";

export const expressRequestToLambdaEvent = (req: Request): LambdaEvent => {
  console.log("Converting express request to lambda event...");

  return buildLambdaEvent({
    pathParameters: req.params,
    queryStringParameters: validateExpressQueryParams(req),
    body: JSON.stringify(req.body),
    headers: validateExpressHeaders(req),
  });
};
