import { type Either, isLeft, left, right } from "fp-ts/lib/Either";
import {
  type LambdaEventWithQueryParams,
  type LambdaEvent,
} from "../../../types/lambda";
import * as t from "io-ts";
import { searchRadius } from "../../../codecs/SearchRadius";
import { latitudeFromString } from "../../../codecs/LatitudeFromString";
import { longitudeFromString } from "../../../codecs/LongitudeFromString";

const getCurryhousesQueryStringParams = t.type({
  lat: latitudeFromString,
  lng: longitudeFromString,
  rad: searchRadius,
});

type GetCurryhousesQueryStringParams = t.TypeOf<
  typeof getCurryhousesQueryStringParams
>;

type GetCurryhousesEvent =
  LambdaEventWithQueryParams<GetCurryhousesQueryStringParams>;

export const parseGetCurryhouseEvent = (
  event: LambdaEvent,
): Either<string, GetCurryhousesEvent> => {
  const decodedQueryParams = getCurryhousesQueryStringParams.decode(
    event.queryStringParameters,
  );

  if (isLeft(decodedQueryParams)) {
    const errorMsg = decodedQueryParams.left
      .map((error) =>
        error.message !== undefined
          ? `There was an error parsing the request: ${error.message}`
          : `There was an error parsing the request`,
      )
      .join("\n");

    return left(errorMsg);
  }

  return right({
    ...event,
    queryStringParameters: {
      ...event.queryStringParameters,
      ...decodedQueryParams.right,
    },
  });
};
