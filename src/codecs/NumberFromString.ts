import * as t from "io-ts";
import { chain } from "fp-ts/Either";
import { pipe } from "fp-ts/lib/function";

const numberFromString = new t.Type<number, string, unknown>(
  "NumberFromString",
  t.number.is,
  (u, c) =>
    pipe(
      t.string.validate(u, c),
      chain((s) => {
        const n = +s;
        return isNaN(n)
          ? t.failure(u, c, `cannot parse ${s} to a number`)
          : t.success(n);
      }),
    ),
  String,
);

export type NumberFromString = t.TypeOf<typeof numberFromString>;

export default numberFromString;
