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

    const changedPaths = response.data.files?.map(({ filename }) => filename);

    changedPaths?.forEach((path) => {
      // If path indicates a change to a lambda, trigger a lambda deployment job
      const lambdaKey: string | null = getLambdaKeyFromPath(path);

      if (lambdaKey !== null) {
        console.log("Found changed lambda: ", lambdaKey);
      }
    });
  } catch (error) {
    console.error("Error triggering lambda deployments:", error);
    throw error;
  }
};

export default triggerLambdaDeployments;
