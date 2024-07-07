# CurryCompare Continuous Integration & Deployment

## Environments

CurryCompare supports 3 environments:
 - `local` (http://localhost:3000)
 - `dev` (https://dev.currycompare.com)
 - `prod` (https://currycompare.com)

## CI + CD

We use [GitHub Actions](https://github.com/features/actions) for our CI. Each commit to main triggers a deployment to the `dev` environment, and from there a CurryCompare maintainer can approve a deployment to `prod`. Only services that have been altered in the commit are deployed.

Our CI pipeline will include several automated tests, and only the tests relevant to the changed services will be run.
 - Frontend tests
   - Linting
   - unit tests
   - integration tests
   - e2e tests
 - Lambda tests
   - Linting
   - unit tests
   - integration tests

Only once all relevant tests have passed can any deployment be made.

The YAML files that control the CI + CD for this repo can be found in the `.github/workflows` directory in the project root.