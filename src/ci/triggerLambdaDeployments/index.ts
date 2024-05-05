import { Octokit } from "octokit";
import { REPO_NAME, REPO_OWNER } from "../constants";
import getLambdaKeyFromPath from "../getLambdaKeyFromPath";

const triggerLambdaDeployments = async (): Promise<void> => {
  if (process.env.GITHUB_TOKEN === undefined)
    throw new Error("GITHUB_TOKEN not defined");

  if (process.env.COMMIT_SHA === undefined)
    throw new Error("COMMIT_SHA not defined");

  try {
    const sha: string = process.env.COMMIT_SHA;
    const { rest } = new Octokit({ auth: process.env.GITHUB_TOKEN });

    console.log(
      `Getting changed files for commit ${process.env.COMMIT_SHA}...`,
    );

    const response = await rest.repos.getCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: sha,
    });

    const changedLambdas =
      response.data.files
        ?.map(({ filename: filepath }) => getLambdaKeyFromPath(filepath))
        .filter<string>((key): key is string => key !== null) ?? [];

    console.log("Found changed lambdas: ", changedLambdas);

    await Promise.all(
      changedLambdas.map(async (key) => {
        // Trigger workflow for key
        return await rest.actions.createWorkflowDispatch({
          owner: REPO_OWNER,
          repo: REPO_NAME,
          workflow_id: "deploy-lambda.yml",
          ref: sha,
          inputs: {
            lambdaKey: key,
          },
        });
      }),
    );
  } catch (error) {
    console.error("Error triggering lambda deployments:", error);
    throw error;
  }
};

export default triggerLambdaDeployments;
