// Taken from https://www.prisma.io/docs/orm/prisma-client/testing/unit-testing 2nd July 2024

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
export default prisma;