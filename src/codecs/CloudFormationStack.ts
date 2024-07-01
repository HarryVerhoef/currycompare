import * as t from "io-ts";

export const cloudFormationStack = t.array(
  t.type({
    ParameterKey: t.string,
    ParameterValue: t.string,
  }),
);

export type CloudFormationStack = t.TypeOf<typeof cloudFormationStack>;
