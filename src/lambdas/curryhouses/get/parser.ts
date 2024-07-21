import { type Either, isLeft, left, right } from "fp-ts/Either";
import { type LambdaEvent } from "../../../types/lambda";
import {
  getCurryhousesQueryStringParams,
  type GetCurryhousesEvent,
} from "../../../types/api/curryhouses/get";
import { combineDecoderErrors } from "../../../utils/combineDecoderErrors";

export const parseGetCurryhouseEvent = (
  event: LambdaEvent,
): Either<string, GetCurryhousesEvent> => {
  const decodedQueryParams = getCurryhousesQueryStringParams.decode(
    event.queryStringParameters,
  );

  if (isLeft(decodedQueryParams))
    return left(
      `There was an error parsing the request: ${combineDecoderErrors(decodedQueryParams.left)}`,
    );

  return right({
    ...event,
    queryStringParameters: decodedQueryParams.right,
  });
};
