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
    ResponseCodec extends t.Type<any, any, any>,
  >({
    path,
    method,
    bodyCodec,
    queryCodec,
    responseCodec,
  }: {
    path: string;
    method: HTTPMethod;
    bodyCodec?: BodyCodec;
    queryCodec?: QueryCodec;
    responseCodec?: ResponseCodec;
  }): (({
    body,
    query,
  }: {
    body?: t.TypeOf<BodyCodec>;
    query?: t.TypeOf<QueryCodec>;
  }) => Promise<ApiResponse<t.TypeOf<ResponseCodec>>>) =>
  async ({ body = {}, query = {} }) => {
    try {
      const decodedBody = bodyCodec?.decode(body);
      const decodedQuery = queryCodec?.decode(query);

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

      const response = await axios({
        method,
        url: `${getApiUrl()}${path}`,
        data: decodedBody?.right,
        params: decodedQuery?.right,
      });

      console.log(response.data.curryhouses);

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
