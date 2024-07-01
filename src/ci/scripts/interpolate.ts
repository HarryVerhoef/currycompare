import interpolate from "../interpolate";

interpolate(process.argv[2]).catch((error) => {
  console.error(error);
  throw new Error(
    `There was an error interpolating the CloudFormation params: ${error}`,
  );
});
