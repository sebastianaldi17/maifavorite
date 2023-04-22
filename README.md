# Maifavorite

Maifavorite is a project of mine that allows users to search for maimai charts,
and then mark them as favorites.

The chart data is fetched using a node script (see the `populate-db` directory
for details). The charts you mark as favorites are stored on the same database,
on a separate table.

# Directory explanation

- backend: Golang REST API that serves chart data & favorite data
- dbscripts: Contains SQL scripts that creates the tables required to store
  chart data
- frontend: Vue web app that displays chart & favorite data. Needs `backend` to
  be running. No longer maintained in favor of `supabase-frontend`
- populate-db: Node script that fetches chart data and stores it to a postgres
  database
- supabase-serverless: Supabase edge function that serves ONLY chart data.
- supabase-frontend: A frontend version that uses the Supabase edge function on
  `supabase-serverless`, and stores favorites using `localStorage`.

# Initial setup

There are setups for each directory, but here are my personal recommendations on
what to do.

## Running locally

1. Run `docker compose up`
2. Go to `populate-db` and copy the `sample.env` to `.env`.
   - The sample env file already contains all of the default data needed, so all
     you have to do is to fill the Google API key.
   - Alternatively, you can choose not to fill the internal level data, and just
     comment out all lines between `const spreadsheet` and
     `await UpdateInternallevel` (as of writing, comment out lines 30 to 35)
3. Go to `frontend` and run `npm run dev`.

## Serving on Supabase

Folow all the initial setup steps on `supabase-serverless`.
