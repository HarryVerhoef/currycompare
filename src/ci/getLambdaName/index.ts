import { postCurryhouseApplicationName } from "../../lambdas/curryhouse/application/post";
import { getCurryhouseName } from "../../lambdas/curryhouse/{curryHouseId}/get";
import { getCurryhousesName } from "../../lambdas/curryhouses/get";

const getLambdaName = (lambdaKey: string): string | undefined =>
  ({
    "curryhouse/{curryHouseId}/get": getCurryhouseName,
    "curryhouse/application/post": postCurryhouseApplicationName,
    "curryhouses/get": getCurryhousesName,
  })[lambdaKey];

export default getLambdaName;
