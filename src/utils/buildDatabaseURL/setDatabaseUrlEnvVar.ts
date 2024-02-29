import { buildDatabaseURL } from ".";

try {
  const dbUrl = buildDatabaseURL();
  console.log(dbUrl);
} catch {
  console.error("Something went wrong building the database URL");
}
