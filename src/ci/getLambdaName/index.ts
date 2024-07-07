import { getCurryhousesName } from "../../lambdas/curryhouses/get";

const getLambdaName = (lambdaKey: string): string | undefined =>
  ({
    "curryhouses/get": getCurryhousesName,
  })[lambdaKey];

export default getLambdaName;
