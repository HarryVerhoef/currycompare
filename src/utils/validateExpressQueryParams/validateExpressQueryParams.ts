import { type Request } from "express";
import { queryStringParams } from "../../codecs/QueryStringParams";
import { isLeft } from "fp-ts/lib/Either";

export const validateExpressQueryParams = (
  req: Request,
): Record<string, string | undefined> => {
  const parsedQueryParams = queryStringParams.decode(req.query);

  if (isLeft(parsedQueryParams)) {
    throw new Error(
      `There was an error parsing the event: ${parsedQueryParams.left.join(", ")}`,
    );
  }

  return parsedQueryParams.right;
};
