// Taken from https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing 2nd July 2024

import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

import prisma from './client';

jest.mock('./client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

beforeEach(() => {
  mockReset(prismaMock)
});

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>