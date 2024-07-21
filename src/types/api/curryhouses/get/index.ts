import * as t from "io-ts";
import { searchRadius } from "../../../../codecs/SearchRadius";
import { type LambdaEventWithQueryParams } from "../../../lambda";
import { latitudeFromString } from "../../../../codecs/LatitudeFromString";
import { longitudeFromString } from "../../../../codecs/LongitudeFromString";
import { curryhouseLatLng } from "../../../../codecs/CurryhouseLatLng";

export const getCurryhousesRequest = t.type({
  lat: t.string,
  lng: t.string,
  rad: searchRadius,
});

export const getCurryhousesQueryStringParams = t.type({
  lat: latitudeFromString,
  lng: longitudeFromString,
  rad: searchRadius,
});

export type GetCurryhousesQueryStringParams = t.TypeOf<
  typeof getCurryhousesQueryStringParams
>;

export type GetCurryhousesEvent =
  LambdaEventWithQueryParams<GetCurryhousesQueryStringParams>;

export const getCurryhousesResponse = t.type({
  curryhouses: t.array(curryhouseLatLng),
});

export type GetCurryhousesResponse = t.TypeOf<typeof getCurryhousesResponse>;
