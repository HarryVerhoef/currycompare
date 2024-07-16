import type * as t from "io-ts";

export const combineDecoderErrors = (errors: t.Errors): string =>
  errors.length > 1
    ? errors
        .map<string>((error) => {
          if (error.message !== undefined) return error.message;

          if (error.value instanceof Object) {
            return `Unexpected type: ${JSON.stringify(error.value, null, 2)}`;
          }

          return `Unexpected type`;
        })
        .join(", ")
    : "";
