import * as t from "io-ts";

export const curryCompareAPIError = t.type({
  errorMsg: t.string,
});

export type CurryCompareAPIError = t.TypeOf<typeof curryCompareAPIError>;
