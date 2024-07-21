import * as t from "io-ts";

export const curryhouseLatLng = t.type({
  id: t.string,
  title: t.string,
  phoneNumber: t.string,
  email: t.string,
  lat: t.number,
  lng: t.number,
});

export type CurryhouseLatLng = t.TypeOf<typeof curryhouseLatLng>;
