import * as t from "io-ts";

interface URLBrand {
  readonly URL: unique symbol;
}

const isValidHttpUrl = (s: string): boolean => {
  try {
    const parsedUrl = new URL(s);
    if (["http:", "https:"].includes(parsedUrl.protocol)) return true;

    return false;
  } catch {
    return false;
  }
};

export const url = t.brand(
  t.string,
  (s): s is t.Branded<string, URLBrand> => isValidHttpUrl(s),
  "URL",
);

export type URL = t.TypeOf<typeof url>;
