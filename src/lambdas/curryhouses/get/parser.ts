import { type Either, isLeft, left, right } from "fp-ts/lib/Either";
import { type LambdaEvent } from "../../../types/lambda";
import {
  getCurryhousesQueryStringParams,
  type GetCurryhousesEvent,
} from "../../../types/api/curryhouses/get";

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
