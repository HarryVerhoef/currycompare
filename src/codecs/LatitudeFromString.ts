import * as t from "io-ts";
import numberFromString from "./NumberFromString";

interface LatitudeFromStringBrand {
  readonly LatitudeFromString: unique symbol;
}

export const latitudeFromString = t.brand(
  numberFromString,
  (n): n is t.Branded<number, LatitudeFromStringBrand> => n >= -90 && n <= 90,
  "LatitudeFromString",
);

export type LatitudeFromString = t.TypeOf<typeof latitudeFromString>;
