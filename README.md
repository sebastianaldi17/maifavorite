# Maifavorite

Maifavorite is a project of mine that allows users to search for maimai charts,
and then mark them as favorites.

The chart data is fetched using a node script (see the `populate-db` directory
for details). The charts you mark as favorites are stored on the same database,
on a separate table.

I'm currently working on a version that saves the favorite data on
`localStorage` instead of a database, so that a static site can fetch the chart
data & mark which ones are favorites.

# Directory explanation

- backend: Golang REST API that serves chart data & favorite data
- dbscripts: Contains SQL scripts that creates the tables required to store
  chart data
- frontend: Vue web app that displays chart & favorite data
- populate-db: Node script that fetches chart data and stores it to a postgres
  database
- supabase-serverless: Supabase edge function that serves ONLY chart data.
  Currently creating a version of frontend that accepts the chart data and
  process favorite data internally using `localStorage`

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

I am working on creating a Dockerfile and a docker compose entry for the
frontend, so maybe step 3 can be skipped later in the future.

## Serving on Supabase

Folow all the initial setup steps on `supabase-serverless`.

The frontend that utilizes Supabase is still a work in progress, and running the
current `frontend` directory will lead to problems because it points directly to
localhost, and the Supabase version does not support POST request for marking as
favorite.
