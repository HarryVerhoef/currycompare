# Mocking Prisma

Since Prisma is the ORM used by the lambdas, it is essential for the sake of the unit tests to be
able to mock the `PrismaClient`. The `PrismaClient` is initialised like so:

```ts
import { PrismaClient } from ".../prisma/generated";

const prisma = new PrismaClient();
```

Once initialised, the client can be used in many ways to query the database, see the [Prisma Client
API](https://www.prisma.io/docs/orm/reference/prisma-client-reference#model-queries). For instance:

```ts
const curryhouse = prisma.curryhouses.findUnique({
  where: {
    id: "curryhouse-1"
  }
});
```

To mock this in a jest, we can mock the module exposed by `.../prisma/generated` with a method that
returns a deep partial mock:

```ts
const mockPrismaClient = {
  curryhouses: {
    findUnique: jest.fn(),
  },
};

jest.mock(".../prisma/generated", () => ({
  ...jest.requireActual(".../prisma/generated");
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient),
}));
```

This means that for each test where we want to change the result of `prisma.curryhouses.findUnique`,
we can simply do:

```ts
mockPrismaClient.curryhouses.findUnique.mockResolvedValue([
  {
    id: "curryhouse-1",
    title: "Curryhouse 1",
    phoneNumber: "0123456789",
    email: "curryhouse1@currycompare.com",
  }
]);
```

