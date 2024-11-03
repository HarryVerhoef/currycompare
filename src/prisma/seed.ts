/* eslint-disable @typescript-eslint/promise-function-async */
import { buildDatabaseURL } from "../utils/buildDatabaseURL";
import { isProd } from "../utils/getEnvironment";
import {
  PrismaClient,
  UserRole,
  type PrismaPromise,
  type User,
} from "./generated";

const createJohn = (prisma: PrismaClient): PrismaPromise<User> =>
  prisma.user.create({
    data: {
      email: "john.doe@currycompare.com",
      role: UserRole.CONSUMER,
      firstName: "John",
      lastName: "Doe",
    },
  });

const createClaphamCurries = (prisma: PrismaClient): PrismaPromise<number> =>
  prisma.$executeRaw`
  INSERT INTO "Curryhouse"
              ("id",
              "title",
              "phoneNumber",
              "email",
              "location",
              "approved")
  VALUES      ('clapham-curries',
              'Clapham Curries',
              '0777777777',
              'clapham.curries@currycompare.com',
              St_setsrid(St_makepoint('51.457992', '-0.149302'), 4326),
              FALSE);
  `;

const createBatterseaBhunas = (prisma: PrismaClient): PrismaPromise<number> =>
  prisma.$executeRaw`
  INSERT INTO "Curryhouse"
              ("id",
              "title",
              "phoneNumber",
              "email",
              "location",
              "approved")
  VALUES      ('battersea-bhunas',
              'Battersea Bhunas',
              '0777777778',
              'battersea.bhunas@currycompare.com',
              St_setsrid(St_makepoint(51.481811, -0.144589), 4326),
              FALSE);
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const createBillingshurstBhajis = (
  prisma: PrismaClient,
): PrismaPromise<number> => {
  const title = "Billingshurst Bhajis";
  const phoneNumber = "0777777779";
  const lat = 90;
  const lng = 90;
  const contactEmail = "benjamin@billingshurstbhajis.com";
  const websiteUrl = "https://currycompare.com";
  const description = "Your local bhaji focussed curryhouse";

  return prisma.$executeRaw`
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
      'billingshurst-bhajis',
      ${title},
      ${phoneNumber},
      ${contactEmail},
      St_setsrid(St_makepoint(${lng}, ${lat}), 4326),
      ${websiteUrl},
      ${description},
      FALSE
    );
`;
};

const createJane = (prisma: PrismaClient): PrismaPromise<User> =>
  prisma.user.create({
    data: {
      role: UserRole.CONSUMER,
      email: "jane.doe@currycompare.com",
      firstName: "Jane",
      lastName: "Doe",
      reviews: {
        create: [
          {
            rating: 7.5,
            comment: "Fantastic Lamb Bhuna",
            size: "Large",
            taste: 4,
            value: 2,
            curryhouse: {
              connect: {
                id: "clapham-curries",
              },
            },
          },
        ],
      },
    },
  });

const seed = async (): Promise<void> => {
  if (isProd()) throw new Error("Probably don't want to do that!");

  console.log("Seeding database...");

  const dbUrl = await buildDatabaseURL();
  const prisma = new PrismaClient({ datasourceUrl: dbUrl });

  await prisma.$transaction([
    createJohn(prisma),
    createClaphamCurries(prisma),
    createJane(prisma),
    createBatterseaBhunas(prisma),
  ]);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
