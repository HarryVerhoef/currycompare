import { getCurryhousePathParams } from "../../../../types/api/curryhouse/{curryHouseId}/get";
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

    const curryhouse = await prisma.$queryRaw<CurryhouseLatLng | undefined>`
    SELECT * from "Curryhouse" where "id" = ${curryHouseId}
    `;

    if (curryhouse !== undefined) {
      console.log(`Found curryhouse: ${curryhouse.title}`);
    } else {
      console.error("Found no curryhouse with the given id.");
    }

    return {
      statusCode: curryhouse !== undefined ? 200 : 404,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        curryhouse:
          curryhouse !== undefined
            ? {
                id: curryhouse.id,
                title: curryhouse.title,
                phoneNumber: curryhouse.phoneNumber,
                email: curryhouse.email,
                lat: curryhouse.lat,
                lng: curryhouse.lng,
                websiteUrl: curryhouse.websiteUrl ?? undefined,
                description: curryhouse.description ?? undefined,
              }
            : undefined,
      }),
    };
  },
});
