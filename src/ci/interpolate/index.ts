import { isLeft } from "fp-ts/lib/Either";
import { readFile, writeFile } from "fs/promises";
import { type Validation } from "io-ts";
import { resolve } from "path";
import {
  cloudFormationStack,
  type CloudFormationStack,
} from "../../codecs/CloudFormationStack";

const interpolateParameterValue = (value: string): string => {
  const regex = /\$\{\{\s*(\w+)\s*\}\}/g;

  return value.replace(regex, (_, varName) => {
    const envVar = process.env[varName];

    if (envVar === undefined) {
      throw new Error(`Environment variable ${varName} is not set`);
    }

    return envVar;
  });
};

const interpolate = async (filepath: string): Promise<void> => {
  if (!filepath.endsWith(".json"))
    throw new Error("CloudFormation parameters file must be JSON");

  const absolutePath = resolve(__dirname, filepath);

  const contents = await readFile(absolutePath, { encoding: "utf8" });

  const json = JSON.parse(contents);

  const params: Validation<CloudFormationStack> =
    cloudFormationStack.decode(json);

  if (isLeft(params)) {
    throw new Error("Could not parse CloudFormation params");
  }

  const interpolatedParams: CloudFormationStack = params.right.map(
    ({ ParameterKey, ParameterValue }) => ({
      ParameterKey,
      ParameterValue: interpolateParameterValue(ParameterValue),
    }),
  );
  await writeFile(absolutePath, JSON.stringify(interpolatedParams, null, 2), {
    encoding: "utf8",
  });
};

export default interpolate;
