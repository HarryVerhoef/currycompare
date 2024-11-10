/* eslint-disable @typescript-eslint/no-misused-promises */
import express, { type Request, type Response } from "express";
import { expressRequestToLambdaEvent } from "./utils/expressRequestToLambdaEvent/expressRequestToLambaEvent";
import { type LambdaHandler, type LambdaEvent } from "./types/lambda";
import { handler as getCurryhouses } from "./lambdas/curryhouses/get";
import { handler as submitCurryhouseApplication } from "./lambdas/curryhouse/application/post";
import { handler as getCurryhouse } from "./lambdas/curryhouse/{curryHouseId}/get";
import buildLambdaContext from "./utils/buildLambdaContext";
import { type Context } from "aws-lambda";

const app = express();
app.use(express.json());
const port = process.env.BACKEND_API_PORT ?? 3000;

const lambdaContext: Context = buildLambdaContext();

const handleRequestFactory =
  (handler: LambdaHandler) => async (req: Request, res: Response) => {
    const lambdaEvent: LambdaEvent = expressRequestToLambdaEvent(req);

    try {
      const lambdaResponse = await handler(
        lambdaEvent,
        lambdaContext,
        () => {},
      );

      if (lambdaResponse.statusCode !== undefined) {
        res.status(lambdaResponse.statusCode);
      }

      if (lambdaResponse.body !== undefined) {
        res.send(lambdaResponse.body);
      } else {
        res.send();
      }
    } catch (error) {
      console.error(error);
    }
  };

app.get("/api/curryhouse/:curryHouseId", handleRequestFactory(getCurryhouse));
app.get("/api/curryhouses", handleRequestFactory(getCurryhouses));
app.post(
  "/api/curryhouse/application",
  handleRequestFactory(submitCurryhouseApplication),
);

app.listen(port);
