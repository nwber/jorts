# Jorts - a url jortener

## Cloudflare, D1, and limitations

Using D1 for this since it's easy and performant. It's basically SQLite under the hood and SQLite is the bomb diggity. 

D1 has a maximum size of 10GB. SQLite types have pretty variable sizes: INTEGER can be 0-8 bytes, TEXT is just encoded and can be up to 1GB, etc. 

If `short_id` is 5 UTF-8 characters and the average `long_url` is 100 UTF-8 characters, 

<!-- dash-content-start -->

D1 is Cloudflare's native serverless SQL database ([docs](https://developers.cloudflare.com/d1/)). This project demonstrates using a Worker with a D1 binding to execute a SQL statement. A simple frontend displays the result of this query:

```SQL
SELECT * FROM comments LIMIT 3;
```

The D1 database is initialized with a `comments` table and this data:

```SQL
INSERT INTO comments (author, content)
VALUES
    ('Kristian', 'Congrats!'),
    ('Serena', 'Great job!'),
    ('Max', 'Keep up the good work!')
;
```

> [!IMPORTANT]
> When using C3 to create this project, select "no" when it asks if you want to deploy. You need to follow this project's [setup steps](https://github.com/cloudflare/templates/tree/main/jorts#setup-steps) before deploying.

<!-- dash-content-end -->

## Getting Started

Outside of this repo, you can start a new project with this template using [C3](https://developers.cloudflare.com/pages/get-started/c3/) (the `create-cloudflare` CLI):

```
npm create cloudflare@latest -- --template=cloudflare/templates/jorts
```

A live public deployment of this template is available at [https://jorts.templates.workers.dev](https://jorts.templates.workers.dev)

## Setup Steps

1. Install the project dependencies with a package manager of your choice:
   ```bash
   npm install
   ```
2. Create a [D1 database](https://developers.cloudflare.com/d1/get-started/) with the name "jorts-db":
   ```bash
   npx wrangler d1 create jorts-db
   ```
   ...and update the `database_id` field in `wrangler.json` with the new database ID.
3. Run the following db migration to initialize the database (notice the `migrations` directory in this project):
   ```bash
   npx wrangler d1 migrations apply --remote jorts-db
   ```
4. Deploy the project!
   ```bash
   npx wrangler deploy
   ```
