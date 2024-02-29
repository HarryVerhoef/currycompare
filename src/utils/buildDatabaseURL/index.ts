#!/usr/bin/env ts-node

export const buildDatabaseURL = (): string => {
  if (process.env.DB_MASTER_USERNAME === undefined) {
    throw Error("Environment variable 'DB_MASTER_USERNAME' not set");
  }

  if (process.env.DB_MASTER_PASSWORD === undefined) {
    throw Error("Environment variable 'DB_MASTER_PASSWORD' not set");
  }

  if (process.env.DB_ENDPOINT === undefined) {
    throw Error("Environment variable 'DB_ENDPOINT' not set");
  }

  const encodedUsername = encodeURIComponent(process.env.DB_MASTER_USERNAME);
  const encodedPassword = encodeURIComponent(process.env.DB_MASTER_PASSWORD);
  // const encodedEndpoint = encodeURIComponent(process.env.DB_ENDPOINT);

  const dbUrl = `postgresql://${encodedUsername}:${encodedPassword}@${process.env.DB_ENDPOINT}:5432/currycompare`;

  console.log(dbUrl);

  return dbUrl;
};

const percentEncode = (str: string): string => {
  const replacements: Record<string, string> = {
    ":": "%3A",
    "/": "%2F",
    "?": "%3F",
    "#": "%23",
    "[": "%5B",
    "]": "%5D",
    "@": "%40",
    "!": "%21",
    $: "%24",
    "&": "%26",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "*": "%2A",
    "+": "%2B",
    ",": "%2C",
    ";": "%3B",
    "=": "%3D",
    "%": "%25",
    " ": "+", // or '%20' if you prefer spaces to be encoded as '%20'
  };

  return str
    .split("")
    .map((char) => replacements[char] ?? char)
    .join("");
};
