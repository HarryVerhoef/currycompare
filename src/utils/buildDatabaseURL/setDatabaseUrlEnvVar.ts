import { buildDatabaseURL } from ".";

try {
  const dbUrl = buildDatabaseURL();
  console.log(dbUrl);
} catch {
  throw Error("Something went wrong building the database URL");
}
