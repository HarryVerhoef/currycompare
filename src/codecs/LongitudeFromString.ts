import * as t from "io-ts";
import numberFromString from "./NumberFromString";

interface LongitudeFromStringBrand {
  readonly LongitudeFromString: unique symbol;
}

export const longitudeFromString = t.brand(
  numberFromString,
  (n): n is t.Branded<number, LongitudeFromStringBrand> =>
    n >= -180 && n <= 180,
  "LongitudeFromString",
);

export type LongitudeFromString = t.TypeOf<typeof longitudeFromString>;
