import { Octokit } from "octokit";
import { REPO_NAME, REPO_OWNER } from "../constants";
import getLambdaKeyFromPath from "../getLambdaKeyFromPath";

const triggerLambdaDeployments = async (): Promise<void> => {
  if (process.env.GITHUB_TOKEN === undefined)
    throw new Error("GITHUB_TOKEN not defined");

  if (process.env.COMMIT_SHA === undefined)
    throw new Error("COMMIT_SHA not defined");

  try {
    const { rest } = new Octokit({ auth: process.env.GITHUB_TOKEN });

    console.log(
      `Getting changed files for commit ${process.env.COMMIT_SHA}...`,
    );

    const response = await rest.repos.getCommit({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      ref: process.env.COMMIT_SHA,
    });

    const changedLambdas =
      response.data.files
        ?.map(({ filename: filepath }) => getLambdaKeyFromPath(filepath))
        .filter<string>((key): key is string => key !== null) ?? [];

    console.log("Found changed lambdas: ", changedLambdas);

    changedLambdas.forEach((key) => {
      // Trigger workflow for key
    });
  } catch (error) {
    console.error("Error triggering lambda deployments:", error);
    throw error;
  }
};

export default triggerLambdaDeployments;
