import * as t from "io-ts";

export const getCurryhousesResponse = t.type({
  curryhouses: t.array(
    t.type({
      id: t.string,
      title: t.string,
      phoneNumber: t.string,
      email: t.string,
      location: t.string,
    }),
  ),
});

export type GetCurryhousesResponse = t.TypeOf<typeof getCurryhousesResponse>;
