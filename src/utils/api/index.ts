import {
  getCurryhousesRequest,
  getCurryhousesResponse,
} from "../../types/api/curryhouses/get";
import type * as t from "io-ts";
import { isLeft, isRight } from "fp-ts/lib/Either";
import { combineDecoderErrors } from "../combineDecoderErrors";
import {
  type ApiResponse,
  type FailureApiResponse,
  HTTPMethod,
  type SuccessApiResponse,
} from "../../types/api";
import axios, { isAxiosError } from "axios";
import { Environment, getEnvironment } from "../getEnvironment";
import { curryCompareAPIError } from "../../codecs/CurryCompareAPIError";
import { submitCurryhouseApplicationRequest } from "../../types/api/curryhouse/application/post";
import {
  getCurryhousePathParams,
  getCurryhouseResponse,
} from "../../types/api/curryhouse/:curryHouseId/get";
import { interpolatePath } from "../interpolatePath";

const PROD_API_URL = "https://api.currycompare.com";
const DEV_API_URL = "https://api.dev.currycompare.com";
const LOCAL_API_URL = "http://localhost:3000/api";

const apiSuccess = <T>(
  response: T,
  status?: number,
): SuccessApiResponse<T> => ({
  success: true,
  data: response,
  status,
});

const apiFailure = (reason?: string, status?: number): FailureApiResponse => ({
  success: false,
  reason,
  status,
});

export const getApiUrl = (): string =>
  ({
    [Environment.PROD]: PROD_API_URL,
    [Environment.DEV]: DEV_API_URL,
    [Environment.LOCAL]: LOCAL_API_URL,
  })[getEnvironment()];

const buildApiCall =
  <
    BodyCodec extends t.Type<any, any, any>,
    QueryCodec extends t.Type<any, any, any>,
    PathParamsCodec extends t.Decoder<any, Record<string, string>>,
    ResponseCodec extends t.Type<any, any, any>,
  >({
    path,
    method,
    bodyCodec,
    queryCodec,
    pathParamsCodec,
    responseCodec,
  }: {
    path: string;
    method: HTTPMethod;
    bodyCodec?: BodyCodec;
    queryCodec?: QueryCodec;
    pathParamsCodec?: PathParamsCodec;
    responseCodec?: ResponseCodec;
  }): (({
    body,
    query,
    pathParams,
    authorization,
  }: {
    body?: t.TypeOf<BodyCodec>;
    query?: t.TypeOf<QueryCodec>;
    pathParams?: ReturnType<PathParamsCodec["decode"]> extends t.Validation<
      infer U
    >
      ? U
      : never;
    authorization?: string;
  }) => Promise<ApiResponse<t.TypeOf<ResponseCodec>>>) =>
  async ({ body = {}, query = {}, pathParams = {}, authorization }) => {
    try {
      const decodedBody = bodyCodec?.decode(body);
      const decodedQuery = queryCodec?.decode(query);
      const decodedPathParams = pathParamsCodec?.decode(pathParams);

      if (decodedBody !== undefined && isLeft(decodedBody)) {
        return apiFailure(
          `Unable to parse request body: ${combineDecoderErrors(decodedBody.left)}`,
          400,
        );
      }

      if (decodedQuery !== undefined && isLeft(decodedQuery)) {
        return apiFailure(
          `Unable to parse request query params: ${combineDecoderErrors(decodedQuery.left)}`,
          400,
        );
      }

      if (decodedPathParams !== undefined && isLeft(decodedPathParams)) {
        return apiFailure(
          `Unable to parse request path params: ${combineDecoderErrors(decodedPathParams.left)}`,
          400,
        );
      }

      const response = await axios({
        method,
        url: `${getApiUrl()}${interpolatePath(path, decodedPathParams?.right)}`,
        data: JSON.stringify(decodedBody?.right),
        params: decodedQuery?.right,
        headers: {
          "Content-Type": "application/json",
          Authorization: authorization,
        },
      });

      const decodedResponse = responseCodec?.decode(response.data);

      if (decodedResponse !== undefined && isLeft(decodedResponse)) {
        return apiFailure(
          `Unable to parse response: ${combineDecoderErrors(decodedResponse.left)}`,
        );
      }

      return apiSuccess(decodedResponse?.right, response.status);
    } catch (error) {
      console.error("Couldn't complete API request: ", error);

      if (isAxiosError(error)) {
        const maybeCurryCompareError = curryCompareAPIError.decode(
          error.response?.data,
        );

        if (isRight(maybeCurryCompareError)) {
          return apiFailure(
            maybeCurryCompareError.right.errorMsg,
            error.response?.status,
          );
        }

        return apiFailure(error.cause?.message, error.response?.status);
      }

      return apiFailure();
    }
  };

export const getCurryhouses = buildApiCall({
  method: HTTPMethod.GET,
  path: "/curryhouses",
  queryCodec: getCurryhousesRequest,
  responseCodec: getCurryhousesResponse,
});

export const submitCurryhouseApplication = buildApiCall({
  method: HTTPMethod.POST,
  path: "/curryhouse/application",
  bodyCodec: submitCurryhouseApplicationRequest,
});

export const getCurryhouse = buildApiCall({
  method: HTTPMethod.GET,
  path: "/curryhouse/{curryHouseId}",
  pathParamsCodec: getCurryhousePathParams,
  responseCodec: getCurryhouseResponse,
});
