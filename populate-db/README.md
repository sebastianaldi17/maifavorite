# Populate-DB

Node script for populating DB by fetching data from
https://maimai.sega.jp/data/maimai_songs.json, as well as
https://docs.google.com/spreadsheets/d/1xqXfzfDfxiEE9mREwgX_ITIY8AowRM7w-TH2t1I_RJE
for internal level data

# Initial setup

1. Go to https://console.cloud.google.com/apis/credentials and create an API key
   for accessing Google Sheets. You may need to make a new GCP project if you
   don't have an existing one.
2. Copy `sample.env` to `.env` and then fill out the fields as needed.
3. Ensure that your postgres database has the same tables as dictated in
   `dbscripts` directory.
4. Run `npm run populate-db`. Query your postgres to see if your database is
   being populated by data or not.
5. If there is an update to the chart data (new songs added, or chart re-rated),
   re-run step 4. It should be safe because the query checks for conflicts, and
   then updates the data instead of inserting it.
