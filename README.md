# Jorts - a url jortener

## How it works

`jorts` takes a (potentially in)valid url and stores it in CloudFlare D1 with a corresponding 5 character hex string. Visiting `https://jorts.zip/<hex>` will redirect to the corresponding url. 

Local DX for CF Workers is pretty good - you can run the workerd runtime and D1 locally, just by running `npm run dev`.

## Cloudflare, Workers, D1, and limitations

Using D1 for this since it's convenient, easy, and performant. It's basically SQLite under the hood and SQLite is the bomb diggity. 

D1 has a maximum size of 10GB. SQLite types have pretty variable sizes: INTEGER can be 0-8 bytes, TEXT is just encoded and can be up to 1GB, etc. If `short_id` is 5 UTF-8 characters (all ASCII, so 1 byte) and the (guesstimated) average `long_url` is 100 UTF-8 characters (mostly 1 byte), 105 characters is about 105 bytes. Let's round up to 200 to be safe. 10 billion bytes maximum / 200 bytes per row == 50 million rows. 5 hex characters in `short_id` is only 1,048,575 supported urls. Even if my math is wildly off or I decided to add a 6th character (which would allow for 16,777,215 urls), I don't see this hitting storage limits on D1.

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
