# Database

For our database, we will be using [Amazon RDS](https://aws.amazon.com/rds/). In the future, it would be nice to migrate to Aurora, but it is maybe a little overkill for now.

## Prisma

We will use [prisma](https://www.prisma.io/) to manage our ORM. It will allow us to maintain and version our model in code, and migrate our database easily in a CI/CD pipeline. Prisma allows us to generate types based on the schema and use these types throughout the platform.

### Schema

The prisma schema consists of [data sources](https://www.prisma.io/docs/orm/prisma-schema/overview/data-sources), [generators](https://www.prisma.io/docs/orm/prisma-schema/overview/generators), and the [data model definition](https://www.prisma.io/docs/orm/prisma-schema/data-model). It will be located in `src/prisma/schema.prisma` so that it is effectively in scope for both the front and backend.

- **data sources:** For the data source we can use an environment variable, `DB_URL`, to differentiate between environments, local and cloud-based.
- **generators:** For now we will just be using the default `prisma-client-js` generator, and writing generated assets to `src/prisma/generated`.
- **data model definition:** Here we can maintain the below data model in code and more clearly specify all relations and types.

### Migration

To migrate the local database, use `npm run db:migrate:local`, ensuring a `DATBASE_URL` environment variable has been set in an in-scope `.env` file, pointing to the local database. For cloud database migrations, change the `DATABASE_URL` envitonment variable so that it is pointing to the relevant cloud-based database instance, and run `npm run db:migrate:deploy`. Unfortunately, having tried to automate this process with a CI pipeline, there is simply too much complexity revolving around the connection between the GitHub Actions worker and the VPC.

The `DATABASE_URL` variable needs to have certain characters escaped. Taking the necessary variables directly from the AWS Console and setting them in an in-scope `.env` file, use `npm run log:db:url` to have the escaped database URL logged to stdout, where it can then be used for `DATABASE_URL`.

## Data model

One thing worth noting is that in this diagram, relation tables (such as `curry_house_review`), are explicitly shown. These tables are handy for when there is a many-to-many relationship. Prisma handles these tables implicitly, so in our prisma data model there is not need to specify `curry_house_review` table (but the equivalent table will exist).

```mermaid
erDiagram
user {
  string user_id
  string email
  string first_name
  string last_name
}

user ||--o{ review : writes

review {
  string review_id
  string curry_house_id
  string user_id
  number rating
  string comment
  number chillies
  string size
  number taste
  number value
}

curry_house {
  string curry_house_id
  string title
  string phone_number
  string email
  point location
}

curry_house_review {
  string curry_house_id
  string review_id
}

curry_house ||--o{ curry_house_review : has

review ||--|| curry_house_review : has

user_review {
  string user_id
  string review_id
}

user ||--o{ user_review : has
user_review ||--|| review : has
```