import { Octokit } from "octokit";
import { REPO_NAME, REPO_OWNER } from "../constants";
import getLambdaKeyFromPath from "../getLambdaKeyFromPath";

const triggerLambdaDeployments = async (): Promise<void> => {
  if (process.env.GITHUB_TOKEN === undefined)
    throw new Error("GITHUB_TOKEN not defined");

  if (process.env.PULL_REQUEST_ID === undefined)
    throw new Error("PULL_REQUEST_ID not defined");

  try {
    const { rest } = new Octokit({ auth: process.env.GITHUB_TOKEN });

    const pullNumber = Number(process.env.PULL_REQUEST_ID);

    console.log(`Getting changed files for pull request #${pullNumber}...`);

    const response = await rest.pulls.listFiles({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      pull_number: pullNumber,
    });

    const changedPaths: string[] = response.data.map(
      ({ filename }) => filename,
    );

    changedPaths.forEach((path) => {
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
