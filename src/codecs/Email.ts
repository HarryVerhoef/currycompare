import * as t from "io-ts";

// Taken from https://emailregex.com/
export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface EmailBrand {
  readonly Email: unique symbol;
}

export const email = t.brand(
  t.string,
  (n): n is t.Branded<string, EmailBrand> =>
    n.length > 0 && EMAIL_REGEX.test(n),
  "Email",
);

export type Email = t.TypeOf<typeof email>;
