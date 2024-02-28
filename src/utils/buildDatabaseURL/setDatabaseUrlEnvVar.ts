import { buildDatabaseURL } from ".";

try {
  process.env.DATABASE_URL = buildDatabaseURL();
} catch {
  console.error("Something went wrong building the database URL");
}
