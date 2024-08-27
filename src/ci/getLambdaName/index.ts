import { PostCurryhouseApplicationName } from "../../lambdas/curryhouse/application";
import { getCurryhousesName } from "../../lambdas/curryhouses/get";

const getLambdaName = (lambdaKey: string): string | undefined =>
  ({
    "curryhouse/application/post": PostCurryhouseApplicationName,
    "curryhouses/get": getCurryhousesName,
  })[lambdaKey];

export default getLambdaName;
