import { buildDatabaseURL } from ".";

try {
  const dbUrl = buildDatabaseURL();

  console.log(dbUrl);
} catch (e) {
  console.error("Something went wrong!");
}
