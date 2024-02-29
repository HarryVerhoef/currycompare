import { buildDatabaseURL } from ".";

try {
  const dbUrl = buildDatabaseURL();
  console.log("YOOOO");
  console.log(`::add-mask::${dbUrl}`);
} catch (e) {
  throw Error("Something went wrong when masking the DATABASE_URL");
}
