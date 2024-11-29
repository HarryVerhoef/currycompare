export const interpolatePath = (
  path: string,
  pathParams?: Record<string, string>,
): string =>
  path.replace(/{([^}]+)}/g, (_, key) => {
    if (pathParams?.[key] === undefined)
      throw new Error(`No value provided for path param ${key}`);

    return pathParams[key];
  });
