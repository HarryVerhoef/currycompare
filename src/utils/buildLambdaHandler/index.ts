import { isLeft } from "fp-ts/lib/Either";
import {
  type ValidatedLambdaHandler,
  type LambdaHandler,
} from "../../types/lambda";
import type * as t from "io-ts";
import buildLambdaError, { StatusCode } from "../buildLambdaError";
import { combineDecoderErrors } from "../combineDecoderErrors";
import { type UserRole } from "../../prisma/generated";
import jwt from "jsonwebtoken";
import { decodedJwt } from "../../codecs/DecodedJwt";
import { intersects } from "radash";

const buildLambdaHandler =
  <
    BodyCodec extends t.Type<any, any, any>,
    QueryCodec extends t.Type<any, any, any>,
    PathCodec extends t.Type<any, any, any>,
  >({
    bodyCodec,
    queryCodec,
    pathCodec,
    handler,
    roles = [],
  }: {
    bodyCodec?: BodyCodec;
    queryCodec?: QueryCodec;
    pathCodec?: PathCodec;
    handler: ValidatedLambdaHandler<
      t.TypeOf<BodyCodec>,
      t.TypeOf<QueryCodec>,
      t.TypeOf<PathCodec>
    >;
    roles?: UserRole[];
  }): LambdaHandler =>
  async (event, context, callback) => {
    try {
      if (roles.length > 0) {
        const token =
          event.headers?.Authorization ?? event.headers?.authorization;

        if (token === undefined) {
          console.log("Unauthorized: No token provided");
          return buildLambdaError(
            StatusCode.UNAUTHORIZED,
            "You are not authorized to access this resource.",
          );
        }

        // See why it is safe to use jwt.decode instead of jwt.verify here in documentation/architecture/user-authorisation.md
        const claims = jwt.decode(token);

        if (claims === null) {
          console.log("Unauthorized: No claims found in decoded JWT");

          return buildLambdaError(
            StatusCode.UNAUTHORIZED,
            "You are not authorized to access this resource.",
          );
        }

        const decoded = decodedJwt.decode(claims);

        if (isLeft(decoded)) {
          console.error("Unauthorized: Claims could not be decoded");

          return buildLambdaError(
            StatusCode.UNAUTHORIZED,
            "You are not authorized to access this resource.",
          );
        }

        const requestRoles = decoded.right["cognito:groups"];

        if (!intersects(requestRoles, roles)) {
          return buildLambdaError(
            StatusCode.UNAUTHORIZED,
            "You are not authorized to access this resource.",
          );
        }
      }

      const decodedBody =
        event.body !== undefined
          ? bodyCodec?.decode(JSON.parse(event.body))
          : undefined;
      const decodedQueryParams = queryCodec?.decode(
        event.queryStringParameters,
      );
      const decodedPathParams = pathCodec?.decode(event.pathParameters);

      if (decodedBody !== undefined && isLeft(decodedBody)) {
        console.log("Bad request: Body could not be decoded");
        console.log(event);
        return buildLambdaError(
          StatusCode.BAD_REQUEST,
          `There was an error parsing the request: ${combineDecoderErrors(decodedBody.left)}`,
        );
      }

      if (decodedQueryParams !== undefined && isLeft(decodedQueryParams)) {
        console.log("Bad request: Query parameters could not be decoded");
        return buildLambdaError(
          StatusCode.BAD_REQUEST,
          `There was an error parsing the request: ${combineDecoderErrors(decodedQueryParams.left)}`,
        );
      }

      if (decodedPathParams !== undefined && isLeft(decodedPathParams)) {
        console.log("Bad request: Path parameters could not be decoded");
        return buildLambdaError(
          StatusCode.BAD_REQUEST,
          `There was an error parsing the request: ${combineDecoderErrors(decodedPathParams.left)}`,
        );
      }

      return await handler(
        {
          ...event,
          body: decodedBody?.right,
          queryStringParameters: decodedQueryParams?.right,
          pathParameters: decodedPathParams?.right,
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
