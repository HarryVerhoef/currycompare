import * as t from "io-ts";

export const headers = t.record(t.string, t.union([t.string, t.undefined]));

export type Headers = t.TypeOf<typeof headers>;
