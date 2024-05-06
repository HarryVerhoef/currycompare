import triggerLambdaDeployments from "../triggerLambdaDeployments";

triggerLambdaDeployments().catch((error) => {
  console.error(error);
  throw error;
});
