import { buildDatabaseURL } from ".";

try {
  buildDatabaseURL({
    username: undefined,
    dbPasswordSecretName: undefined,
    endpoint: undefined,
  })
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
} catch (e) {
  console.error("Something went wrong!");
}
