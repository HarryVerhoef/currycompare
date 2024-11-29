import * as t from "io-ts";
import { curryhouseLatLng } from "../../../../../codecs/CurryhouseLatLng";

export const getCurryhousePathParams = t.type({
  curryHouseId: t.string,
});

export const getCurryhouseResponse = t.type({
  curryhouse: curryhouseLatLng,
});
