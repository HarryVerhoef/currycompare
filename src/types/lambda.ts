import {
  type APIGatewayProxyStructuredResultV2,
  type APIGatewayEventRequestContextV2,
  type APIGatewayProxyEventV2WithRequestContext,
  type APIGatewayProxyHandlerV2,
  type Context,
  type Callback,
  type APIGatewayProxyEventQueryStringParameters,
  type APIGatewayProxyEventPathParameters,
} from "aws-lambda";

export type LambdaRequestContext = APIGatewayEventRequestContextV2;

export type LambdaEvent =
  APIGatewayProxyEventV2WithRequestContext<LambdaRequestContext>;

export type LambdaEventWithQueryParams<
  Q = APIGatewayProxyEventQueryStringParameters,
> = Omit<LambdaEvent, "queryStringParameters"> & {
  queryStringParameters: Q;
};

export type ValidatedLambdaEvent<
  B,
  Q = APIGatewayProxyEventQueryStringParameters,
  P = APIGatewayProxyEventPathParameters,
> = Omit<LambdaEvent, "body" | "queryStringParameters" | "pathParameters"> & {
  body: B;
  queryStringParameters: Q;
  pathParameters: P;
};

export type LambdaResponse = APIGatewayProxyStructuredResultV2;

export type LambdaHandler<T = LambdaResponse> = (
  event: LambdaEvent,
  context: LambdaContext,
  callback: Callback<T>,
) => Promise<T>;

export type ValidatedLambdaHandler<
  B,
  Q = APIGatewayProxyEventQueryStringParameters,
  P = APIGatewayProxyEventPathParameters,
  T = LambdaResponse,
> = (
  event: ValidatedLambdaEvent<B, Q, P>,
  context: LambdaContext,
  callback: Callback<T>,
) => Promise<T>;

export type LambdaHandlerWithQueryParams<
  Q = APIGatewayProxyEventQueryStringParameters,
  T = LambdaResponse,
> = (
  event: LambdaEventWithQueryParams<Q>,
  context: LambdaContext,
  callback: Callback<LambdaResponse>,
) => Promise<T>;

export type VoidLambdaHandler =
  APIGatewayProxyHandlerV2<APIGatewayProxyStructuredResultV2>;

export type LambdaContext = Context;
