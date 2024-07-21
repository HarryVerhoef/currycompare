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
    const decodedBody = bodyCodec?.decode(event.body);
    const decodedQueryParams = queryCodec?.decode(event.queryStringParameters);

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
  };

export default buildLambdaHandler;
