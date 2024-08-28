import * as t from "io-ts";
import { latitudeFromString } from "../../../../../codecs/LatitudeFromString";
import { longitudeFromString } from "../../../../../codecs/LongitudeFromString";

export const body = t.type({
  title: t.string,
  phoneNumber: t.string, // TODO: Codec for this
  lat: latitudeFromString,
  lng: longitudeFromString,
  contactEmail: t.string, // TODO: Codec for this
  websiteUrl: t.union([t.undefined, t.string]), // TODO: Codec for this
  description: t.union([t.undefined, t.string]),
});
