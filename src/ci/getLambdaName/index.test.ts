import getLambdaName from ".";

describe("getLambdaName", () => {
  it.each([
    ["not/a/path", undefined],
    ["review/post", undefined],
    ["review/put", undefined],
    ["review/delete", undefined],
    ["user/reviews/get", undefined],
    ["curryhouses/get", "GetCurryhouses"], // Parameterise environment when building prod
    ["curryhouse/application/post", "SubmitCurryhouseApplication"],
    ["curryhouse/application/patch", undefined],
    ["curryhouse/get", undefined],
    ["curryhouse/put", undefined],
  ])("getLambdaName(%s) = %s", (lambdaKey, expected) => {
    expect(getLambdaName(lambdaKey)).toBe(expected);
  });
});
