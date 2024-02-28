import { buildDatabaseURL } from ".";

try {
  process.env.DATABASE_URL = buildDatabaseURL();
  console.log(buildDatabaseURL());
} catch {
  console.error("Something went wrong building the database URL");
}
