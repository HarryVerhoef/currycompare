import { type Request } from "express";
import { type LambdaEvent } from "../../types/lambda";
import buildLambdaEvent from "../buildLambdaEvent";
import { validateExpressQueryParams } from "../validateExpressQueryParams/validateExpressQueryParams";

export const expressRequestToLambdaEvent = (req: Request): LambdaEvent =>
  buildLambdaEvent({
    pathParameters: req.params,
    queryStringParameters: validateExpressQueryParams(req),
    body: req.body,
  });
