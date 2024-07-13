FROM node:20.11.1-alpine
ARG DATABASE_URL
ENV DATABASE_URL $DATABASE_URL
WORKDIR /usr/app
COPY . .
RUN npm install --quiet
RUN npm run db:generate