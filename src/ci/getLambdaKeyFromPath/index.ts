const getLambdaKeyFromPath = (path: string): string | null => {
  const validPathBeginning = "src/lambdas/";
  const validPathEnding = "/index.ts";

  if (path.startsWith(validPathBeginning)) {
    const lambdaPath = path.substring(validPathBeginning.length, path.length);

    if (lambdaPath.endsWith(validPathEnding)) {
      return lambdaPath.substring(
        0,
        lambdaPath.length - validPathEnding.length,
      );
    }
  }

  return null;
};

export default getLambdaKeyFromPath;
