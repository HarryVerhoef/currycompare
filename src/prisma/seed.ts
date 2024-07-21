/* eslint-disable @typescript-eslint/promise-function-async */
import { buildDatabaseURL } from "../utils/buildDatabaseURL";
import { isProd } from "../utils/getEnvironment";
import { PrismaClient, type PrismaPromise, type User } from "./generated";

const createJohn = (prisma: PrismaClient): PrismaPromise<User> =>
  prisma.user.create({
    data: {
      email: "john.doe@currycompare.com",
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
              "location")
  VALUES      ('clapham-curries',
              'Clapham Curries',
              '0777777777',
              'clapham.curries@currycompare.com',
              St_setsrid(St_makepoint('51.457992', '-0.149302'), 4326));
  `;

const createBatterseaBhunas = (prisma: PrismaClient): PrismaPromise<number> =>
  prisma.$executeRaw`
  INSERT INTO "Curryhouse"
              ("id",
              "title",
              "phoneNumber",
              "email",
              "location")
  VALUES      ('battersea-bhunas',
              'Battersea Bhunas',
              '0777777778',
              'battersea.bhunas@currycompare.com',
              St_setsrid(St_makepoint('51.481811', '-0.144589'), 4326));
`;

const createJane = (prisma: PrismaClient): PrismaPromise<User> =>
  prisma.user.create({
    data: {
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
