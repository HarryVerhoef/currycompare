import {
  type APIGatewayProxyStructuredResultV2,
  type APIGatewayEventRequestContextV2,
  type APIGatewayProxyEventV2WithRequestContext,
  type APIGatewayProxyHandlerV2,
  type Context,
  type Callback,
} from "aws-lambda";

export type LambdaRequestContext = APIGatewayEventRequestContextV2;

export type LambdaEvent =
  APIGatewayProxyEventV2WithRequestContext<LambdaRequestContext>;

export type LambdaResponse = APIGatewayProxyStructuredResultV2;

export type LambdaHandler<T = LambdaResponse> = (
  event: LambdaEvent,
  context: LambdaContext,
  callback: Callback<LambdaResponse>,
) => Promise<T>;

export type VoidLambdaHandler =
  APIGatewayProxyHandlerV2<APIGatewayProxyStructuredResultV2>;

export type LambdaContext = Context;
