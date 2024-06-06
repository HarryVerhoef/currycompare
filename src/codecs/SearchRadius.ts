import * as t from "io-ts";

export enum SearchRadius {
  ONE = "ONE",
  FIVE = "FIVE",
  TEN = "TEN",
  FIFTY = "FIFTY",
  HUNDRED = "HUNDRED",
}

export const searchRadius = t.keyof({
  [SearchRadius.ONE]: null,
  [SearchRadius.FIVE]: null,
  [SearchRadius.TEN]: null,
  [SearchRadius.FIFTY]: null,
  [SearchRadius.HUNDRED]: null,
});
