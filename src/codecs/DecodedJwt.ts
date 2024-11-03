import * as t from "io-ts";
import { UserRole } from "../prisma/generated";

export const decodedJwt = t.type({
  "cognito:groups": t.array(t.keyof(UserRole)),
});

export type DecodedJwt = t.TypeOf<typeof decodedJwt>;
