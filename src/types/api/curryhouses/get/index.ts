import * as t from "io-ts";
import { latitudeFromString } from "../../../../codecs/LatitudeFromString";
import { longitudeFromString } from "../../../../codecs/LongitudeFromString";
import { searchRadius } from "../../../../codecs/SearchRadius";
import { type LambdaEventWithQueryParams } from "../../../lambda";

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
