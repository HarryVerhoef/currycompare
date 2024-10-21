import { isLeft } from "fp-ts/lib/Either";
import {
  type ValidatedLambdaHandler,
  type LambdaHandler,
} from "../../types/lambda";
import type * as t from "io-ts";
import buildLambdaError, { StatusCode } from "../buildLambdaError";
import { combineDecoderErrors } from "../combineDecoderErrors";

const buildLambdaHandler =
  <
    BodyCodec extends t.Type<any, any, any>,
    QueryCodec extends t.Type<any, any, any>,
  >({
    bodyCodec,
    queryCodec,
    handler,
  }: {
    bodyCodec?: BodyCodec;
    queryCodec?: QueryCodec;
    handler: ValidatedLambdaHandler<t.TypeOf<BodyCodec>, t.TypeOf<QueryCodec>>;
  }): LambdaHandler =>
  async (event, context, callback) => {
    try {
      const decodedBody =
        event.body !== undefined ? bodyCodec?.decode(event.body) : undefined;
      const decodedQueryParams = queryCodec?.decode(
        event.queryStringParameters,
      );

      if (decodedBody !== undefined && isLeft(decodedBody)) {
        return buildLambdaError(
          StatusCode.BAD_REQUEST,
          `There was an error parsing the request: ${combineDecoderErrors(decodedBody.left)}`,
        );
      }

      if (decodedQueryParams !== undefined && isLeft(decodedQueryParams)) {
        return buildLambdaError(
          StatusCode.BAD_REQUEST,
          `There was an error parsing the request: ${combineDecoderErrors(decodedQueryParams.left)}`,
        );
      }

      return await handler(
        {
          ...event,
          body: decodedBody?.right,
          queryStringParameters: decodedQueryParams?.right,
        },
        context,
        callback,
      );
    } catch (error) {
      console.error("Request: ", event);
      console.error(error);
      return buildLambdaError(
        StatusCode.INTERNAL_ERROR,
        "There was an error parsing your request, please try again later.",
      );
    }
  };

export default buildLambdaHandler;
