# Jorts - a url jortener

![](https://api.checklyhq.com/v1/badges/checks/9c2ade5d-0200-4b76-b54e-8ccbe4760796?style=flat&theme=dark)

## TO DO

- Use D1 sessions API to take advantage of RRs.
- Write tests (yawn).
- Create QR code for links.
- Do not duplicate existing records (when a record exists for `cnn.com`, fetch the short_id and return that instead of generating a new one).

## How it works

`jorts` takes a url (may be invalid) and stores it in Cloudflare D1 with a random 5 character hex string. Visiting `https://jorts.zip/<hex>` will redirect to the corresponding url. 

Local DX for CF Workers is pretty good - you can run the workerd runtime and D1 locally, just by running `npm run dev`. It even creates preview links on branch builds too, like `https://<builds>-jorts.nwber.workers.dev`. 

## Infra

Jorts is written in TypeScript and runs on Cloudflare Workers, which are pretty cool - they have a generous free tier, and lots of integrations with other tools. I would prefer to write Python (because JS/TS developers are evil), but Python Workers are in beta and only work locally at this time. Originally, I wanted to do this in Python and glue together a bunch of free services (Aiven for MySQL, Upstash for KV, a free ARM instance I have on OCI, CF for network) but this is so much easier. 

Using D1 for this since it's convenient, easy, and performant. It's basically SQLite under the hood and SQLite is the bomb diggity. 

## Limitations

Workers free tier (because I'm not paying $5/mo) is pretty good but has its limits.

D1 has a maximum size of 10GB. SQLite types have pretty variable sizes: INTEGER can be 0-8 bytes, TEXT is just encoded and can be up to 1GB, etc. If `short_id` is 5 UTF-8 characters (all ASCII, so 1 byte) and the (guesstimated) average `long_url` is 100 UTF-8 characters (mostly 1 byte), 105 characters is about 105 bytes. Let's round up to 200 to be safe. 10 billion bytes maximum / 200 bytes per row == 50 million rows. 5 hex characters in `short_id` is only 1,048,575 supported urls. Even if my math is wildly off or I decided to add a 6th character (which would allow for 16,777,215 urls), I don't see this hitting storage limits on D1.

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
