import * as t from "io-ts";

export const PHONE_NUMBER_REGEX =
  /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;

interface PhoneNumberBrand {
  readonly PhoneNumber: unique symbol;
}

export const phoneNumber = t.brand(
  t.string,
  (n): n is t.Branded<string, PhoneNumberBrand> =>
    n.length > 0 && PHONE_NUMBER_REGEX.test(n),
  "PhoneNumber",
);

export type PhoneNumber = t.TypeOf<typeof phoneNumber>;
