import * as t from "io-ts";
import { latitudeFromString } from "../../../../../codecs/LatitudeFromString";
import { longitudeFromString } from "../../../../../codecs/LongitudeFromString";
import { email } from "../../../../../codecs/Email";
import { phoneNumber } from "../../../../../codecs/PhoneNumber";
import { url } from "../../../../../codecs/URL";

export const submitCurryhouseApplicationRequest = t.type({
  title: t.string,
  phoneNumber: t.string,
  lat: t.string,
  lng: t.string,
  contactEmail: t.string,
  websiteUrl: t.union([t.undefined, t.string]),
  description: t.union([t.undefined, t.string]),
});

export const submitCurryhouseApplicationBrandedRequest = t.type({
  title: t.string,
  phoneNumber,
  lat: latitudeFromString,
  lng: longitudeFromString,
  contactEmail: email,
  websiteUrl: t.union([t.undefined, url]),
  description: t.union([t.undefined, t.string]),
});

export type SubmitCurryhouseApplicationBrandedRequest = t.TypeOf<
  typeof submitCurryhouseApplicationBrandedRequest
>;
