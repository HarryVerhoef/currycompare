import * as t from "io-ts";

export const queryStringParams = t.record(
  t.string,
  t.union([t.string, t.undefined]),
);

export type QueryStringParams = t.TypeOf<typeof queryStringParams>;
