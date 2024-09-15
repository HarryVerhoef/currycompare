import { type CurryhouseLatLng } from "../../../../codecs/CurryhouseLatLng";
import { PrismaClient } from "../../../../prisma/generated";
import { submitCurryhouseApplicationRequest } from "../../../../types/api/curryhouse/application/post";
import { type LambdaHandler } from "../../../../types/lambda";
import { buildDatabaseURL } from "../../../../utils/buildDatabaseURL";
import buildLambdaHandler from "../../../../utils/buildLambdaHandler";

// force job

export const PostCurryhouseApplicationName = "SubmitCurryhouseApplication";

export const handler: LambdaHandler = buildLambdaHandler({
  bodyCodec: submitCurryhouseApplicationRequest,
  handler: async (event) => {
    console.log("Request event:", event);

    const {
      title,
      phoneNumber,
      lat,
      lng,
      contactEmail,
      websiteUrl,
      description,
    } = event.body;

    const dbUrl = await buildDatabaseURL();

    console.log(`Database URL: ${dbUrl}`);

    const prisma = new PrismaClient({ datasourceUrl: dbUrl });

    // We are using a raw query here because prisma does not support postgis (geospatial queries)
    await prisma.$queryRaw<CurryhouseLatLng>`
      INSERT INTO "Curryhouse" (
        "title",
        "phoneNumber",
        "email",
        "location",
        "websiteUrl",
        "description",
        "approvalStatus"
      )
      VALUES (
        ${title},
        ${phoneNumber},
        ${contactEmail},
        St_setsrid(St_makepoint(${lng}, ${lat}), 4326)),
        ${websiteUrl},
        ${description},
        FALSE
      );
    `;

    return {
      statusCode: 204,
      headers: {
        "Content-Type": "application/json",
      },
    };
  },
});
