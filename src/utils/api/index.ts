import {
  getCurryhousesQueryStringParams,
  getCurryhousesResponse,
} from "../../types/api/curryhouses/get";
import type * as t from "io-ts";
import { isLeft } from "fp-ts/lib/Either";
import { combineDecoderErrors } from "../combineDecoderErrors";
import { HTTPMethod } from "../../types/api";
import axios from "axios";
import { Environment, getEnvironment } from "../getEnvironment";

const PROD_API_URL = "https://api.currycompare.com";
const DEV_API_URL = "https://api.dev.currycompare.com";
const LOCAL_API_URL = "localhost:3000/api";

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
    body: t.TypeOf<BodyCodec>;
    query: t.TypeOf<QueryCodec>;
  }) => Promise<t.TypeOf<ResponseCodec>>) =>
  async ({ body = {}, query = {} }) => {
    const decodedBody = bodyCodec?.decode(body);
    const decodedQuery = queryCodec?.decode(query);

    if (decodedBody !== undefined && isLeft(decodedBody)) {
      throw new Error(
        `Unable to parse request body: ${combineDecoderErrors(decodedBody.left)}`,
      );
    }

    if (decodedQuery !== undefined && isLeft(decodedQuery)) {
      throw new Error(
        `Unable to parse request query params: ${combineDecoderErrors(decodedQuery.left)}`,
      );
    }

    const response = await axios({
      method,
      url: `${getApiUrl()}${path}`,
      data: decodedBody?.right,
      params: decodedQuery?.right,
    });

    const decodedResponse = responseCodec?.decode(response);

    if (decodedResponse !== undefined && isLeft(decodedResponse)) {
      throw new Error(
        `Unable to parse response: ${combineDecoderErrors(decodedResponse.left)}`,
      );
    }

    return decodedResponse?.right;
  };

export const getCurryhouses = buildApiCall({
  method: HTTPMethod.GET,
  path: "/curryhouses",
  queryCodec: getCurryhousesQueryStringParams,
  responseCodec: getCurryhousesResponse,
});
