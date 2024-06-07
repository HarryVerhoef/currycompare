import { isLeft } from "fp-ts/lib/Either";
import { type LambdaHandler } from "../../../types/lambda";
import { parseGetCurryhouseEvent } from "./parser";
import buildLambdaError, { StatusCode } from "../../../utils/buildLambdaError";
import { type Curryhouse, PrismaClient } from "../../../prisma/generated";
import convertSearchRadiusToMetres from "../../../utils/convertSearchRadiusToMetres";

// https://www.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-aws-lambda#deploy-only-the-required-files

export const getCurryhousesName = "GetCurryhouses";

export const handler: LambdaHandler = async (event) => {
  console.log("Request event:", event);

  const parseResult = parseGetCurryhouseEvent(event);

  if (isLeft(parseResult)) {
    return buildLambdaError(StatusCode.BAD_REQUEST, parseResult.left);
  }

  const { lat, lng, rad } = parseResult.right.queryStringParameters;

  console.log(
    `Finding all curryhouses with latitude=${lat}, longitude=${lng}, radius=${rad}...`,
  );

  const prisma = new PrismaClient();

  // TODO: Need to ensure this is safe from injection.
  // We are using a raw query here because prisma does not support postgis (geospatial queries)
  const curryhouses = await prisma.$queryRaw<Curryhouse[]>`
    SELECT *
    FROM Curryhouses
    WHERE ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
      ${convertSearchRadiusToMetres(rad)}
    );`;

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      curryhouses,
    }),
  };
};
