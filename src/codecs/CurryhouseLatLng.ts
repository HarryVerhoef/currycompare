import * as t from "io-ts";
import { url } from "./URL";
import { email } from "./Email";
import { phoneNumber } from "./PhoneNumber";

export const curryhouseLatLng = t.type({
  id: t.string,
  title: t.string,
  phoneNumber,
  email,
  lat: t.number,
  lng: t.number,
  websiteUrl: t.union([t.undefined, url]),
  description: t.union([t.undefined, t.string]),
  approved: t.boolean,
});

export type CurryhouseLatLng = t.TypeOf<typeof curryhouseLatLng>;
