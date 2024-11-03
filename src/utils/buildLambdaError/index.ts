import { type LambdaResponse } from "../../types/lambda";

export enum StatusCode {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_ERROR,
  UNAUTHORIZED,
}

const buildLambdaError = (s: StatusCode, errorMsg?: string): LambdaResponse => {
  const statusCode: number = {
    [StatusCode.BAD_REQUEST]: 400,
    [StatusCode.NOT_FOUND]: 404,
    [StatusCode.INTERNAL_ERROR]: 500,
    [StatusCode.UNAUTHORIZED]: 401,
  }[s];

  return {
    statusCode,
    body: JSON.stringify({ errorMsg }),
  };
};

export default buildLambdaError;
