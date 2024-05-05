import getLambdaKeyFromPath from ".";

describe("getLambdaKeyFromPath", () => {
  it("should return null if the path does not end in index.ts", () => {
    const path = "src/lambdas/curryhouses/get/index.test.ts";
    expect(getLambdaKeyFromPath(path)).toBeNull();
  });

  it("should return null if the path does not point to a lambda", () => {
    const path = "src/utils/buildLambdaEvent/index.ts";
    expect(getLambdaKeyFromPath(path)).toBeNull();
  });

  it("should return null if the path is not in src", () => {
    const path = "infra/lambdas/curryhouses/get/index.ts"; // Fake path
    expect(getLambdaKeyFromPath(path)).toBeNull();
  });

  it("should return the path to the lambda dir from the GET /curryhouses dir", () => {
    const path = "src/lambdas/curryhouses/get/index.ts";
    expect(getLambdaKeyFromPath(path)).toBe("curryhouses/get");
  });

  it("should return the path to the lambda dir form the POST /review dir", () => {
    const path = "src/lambdas/review/post/index.ts";
    expect(getLambdaKeyFromPath(path)).toBe("review/post");
  });
});
