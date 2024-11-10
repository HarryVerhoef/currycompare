import { getCurryhousePathParams } from "../../../../types/api/curryhouse/:curryHouseId/get";
import { buildDatabaseURL } from "../../../../utils/buildDatabaseURL";
import buildLambdaHandler from "../../../../utils/buildLambdaHandler";
import { PrismaClient } from "../../../../prisma/generated";
import { type CurryhouseLatLng } from "../../../../codecs/CurryhouseLatLng";

export const getCurryhouseName = "GetCurryhouse";

export const handler = buildLambdaHandler({
  pathCodec: getCurryhousePathParams,
  handler: async (event) => {
    console.log("Request event:", event);

    const { curryHouseId } = event.pathParameters;

    console.log(`Finding curryHouse with id=${curryHouseId}...`);

    const dbUrl = await buildDatabaseURL();

    console.log(`Database URL: ${dbUrl}`);

    const prisma = new PrismaClient({ datasourceUrl: dbUrl });

    const curryhouses = await prisma.$queryRaw<CurryhouseLatLng[]>`
    SELECT 
      "id",
      "title",
      "phoneNumber",
      "email",
      ST_X("location"::geometry) AS "lng",
      ST_Y("location"::geometry) AS "lat",
      "websiteUrl",
      "description",
      "approved"
    FROM "Curryhouse" WHERE "id" = ${curryHouseId};
    `;

    if (curryhouses.length > 0) {
      console.log(`Found curryhouse: ${curryhouses[0].title}`);
    } else {
      console.error("Found no curryhouse with the given id.");
    }

    return {
      statusCode: curryhouses.length > 0 ? 200 : 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        curryhouse:
          curryhouses.length > 0
            ? {
                id: curryhouses[0].id,
                title: curryhouses[0].title,
                phoneNumber: curryhouses[0].phoneNumber,
                email: curryhouses[0].email,
                lat: curryhouses[0].lat,
                lng: curryhouses[0].lng,
                websiteUrl: curryhouses[0].websiteUrl ?? undefined,
                description: curryhouses[0].description ?? undefined,
                approved: curryhouses[0].approved,
              }
            : undefined,
      }),
    };
  },
});
