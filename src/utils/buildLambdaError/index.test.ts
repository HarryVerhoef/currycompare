import buildLambdaError, { StatusCode } from ".";

describe("buildLambdaError", () => {
  it("should return a 400 status code if given BAD_REQUEST", () => {
    expect(buildLambdaError(StatusCode.BAD_REQUEST).statusCode).toBe(400);
  });

  it("should return a 404 status code if given NOT_FOUND", () => {
    expect(buildLambdaError(StatusCode.NOT_FOUND).statusCode).toBe(404);
  });

  it("should return a 500 status code if given INTERNAL_ERROR", () => {
    expect(buildLambdaError(StatusCode.INTERNAL_ERROR).statusCode).toBe(500);
  });

  it("should not provide an error message if one is not given", () => {
    expect(buildLambdaError(StatusCode.BAD_REQUEST).body).toEqual("{}");
  });

  it("should provide an error message if one is given", () => {
    expect(
      buildLambdaError(StatusCode.BAD_REQUEST, "Rubbish request").body,
    ).toBe('{"errorMsg":"Rubbish request"}');
  });
});
