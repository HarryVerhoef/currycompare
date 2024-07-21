import { type LambdaHandler } from "../../../types/lambda";
import { PrismaClient } from "../../../prisma/generated";
import convertSearchRadiusToMetres from "../../../utils/convertSearchRadiusToMetres";
import { buildDatabaseURL } from "../../../utils/buildDatabaseURL";
import { type CurryhouseLatLng } from "../../../codecs/CurryhouseLatLng";
import buildLambdaHandler from "../../../utils/buildLambdaHandler";
import { getCurryhousesQueryStringParams } from "../../../types/api/curryhouses/get";

// https://www.prisma.io/docs/orm/prisma-client/deployment/serverless/deploy-to-aws-lambda#deploy-only-the-required-files

export const handler: LambdaHandler = buildLambdaHandler({
  queryCodec: getCurryhousesQueryStringParams,
  handler: async (event) => {
    console.log("Request event:", event);

    const { lat, lng, rad } = event.queryStringParameters;

    console.log(
      `Finding all curryhouses with latitude=${lat}, longitude=${lng}, radius=${rad}...`,
    );

    const dbUrl = await buildDatabaseURL();

    console.log(`Database URL: ${dbUrl}`);

    const prisma = new PrismaClient({ datasourceUrl: dbUrl });

    // We are using a raw query here because prisma does not support postgis (geospatial queries)
    const curryhouses = await prisma.$queryRaw<CurryhouseLatLng[]>`
    SELECT
      "id",
      "title",
      "phoneNumber",
      "email",
      ST_X("location"::geometry) AS "lng",
      ST_Y("location"::geometry) AS "lat"
    FROM "Curryhouse"
    WHERE ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint(${lng}, ${lat}), 4326),
      ${convertSearchRadiusToMetres(rad)}
    );`;

    if (curryhouses.length > 0) {
      console.log(`Found ${curryhouses.length} curryhouses:`);
      console.log(curryhouses.map((curryhouse) => curryhouse.title).join(", "));
    } else {
      console.log("Found no curryhouses within the search area.");
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        curryhouses,
      }),
    };
  },
});
