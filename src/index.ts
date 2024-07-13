/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { expressRequestToLambdaEvent } from "./utils/expressRequestToLambdaEvent/expressRequestToLambaEvent";
import { type LambdaEvent } from "./types/lambda";
import { handler as getCurryhouses } from "./lambdas/curryhouses/get";
import buildLambdaContext from "./utils/buildLambdaContext";
import { type Context } from "aws-lambda";

const app = express();
const port = process.env.BACKEND_API_PORT ?? 3000;

const lambdaContext: Context = buildLambdaContext();

app.get("/curryhouses", async (req, res) => {
  const lambdaEvent: LambdaEvent = expressRequestToLambdaEvent(req);

  try {
    const lambdaResponse = await getCurryhouses(
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
});

app.listen(port);
