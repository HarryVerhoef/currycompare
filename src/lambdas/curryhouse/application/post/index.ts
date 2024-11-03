import { type CurryhouseLatLng } from "../../../../codecs/CurryhouseLatLng";
import { PrismaClient, UserRole } from "../../../../prisma/generated";
import { submitCurryhouseApplicationBrandedRequest } from "../../../../types/api/curryhouse/application/post";
import { type LambdaHandler } from "../../../../types/lambda";
import { buildDatabaseURL } from "../../../../utils/buildDatabaseURL";
import buildLambdaHandler from "../../../../utils/buildLambdaHandler";
import { v4 as uuid } from "uuid";

export const PostCurryhouseApplicationName = "SubmitCurryhouseApplication";

export const handler: LambdaHandler = buildLambdaHandler({
  roles: [UserRole.CONSUMER, UserRole.ADMIN, UserRole.GLOBAL_ADMIN],
  bodyCodec: submitCurryhouseApplicationBrandedRequest,
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

    const id = uuid();

    // We are using a raw query here because prisma does not support postgis (geospatial queries)
    await prisma.$executeRaw<CurryhouseLatLng>`
      INSERT INTO "Curryhouse" (
        "id",
        "title",
        "phoneNumber",
        "email",
        "location",
        "websiteUrl",
        "description",
        "approved"
      )
      VALUES (
        ${id},
        ${title},
        ${phoneNumber},
        ${contactEmail},
        St_setsrid(St_makepoint(${lng}, ${lat}), 4326),
        ${websiteUrl},
        ${description},
        FALSE
      );
    `;

    return {
      statusCode: 204,
    };
  },
});
