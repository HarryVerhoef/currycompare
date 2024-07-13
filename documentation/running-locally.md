# Running locally

In order to run currycompare locally, you will need to:
 - Clone the repo: `git clone https://github.com/HarryVerhoef/currycompare.git`
 - Install [docker compose](https://docs.docker.com/compose/), if it isn't already installed: `brew install docker-compose` (Assuming homebrew is installed)
 - (Optional) Install [Node Version Manager](https://github.com/nvm-sh/nvm), if it isn't already installed: `brew install nvm`
 - Align your node version with the project's: `nvm use`
 - Navigate to the `src` directory, and install the packages: `npm install`
 - Then, to start the docker containers, run `npm run serve:local`
 - Once the containers are healthy, run `npm run db:migrate:local` to apply the database migrations.
  
