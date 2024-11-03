import { type Request } from "express";
import { headers } from "../../codecs/Headers";
import { isLeft } from "fp-ts/lib/Either";

export const validateExpressHeaders = (
  req: Request,
): Record<string, string | undefined> => {
  const decodedHeaders = headers.decode(req.headers);

  if (isLeft(decodedHeaders)) {
    throw new Error(
      `There was an error parsing the headers: ${decodedHeaders.left.join(", ")}`,
    );
  }

  return decodedHeaders.right;
};
