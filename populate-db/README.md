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
6. (Optional) Run `npm run update-internal-level` to update the internal level / chart constants.

# Initial setup for pattern map

1. [Create a new](https://cloud.google.com/iam/docs/service-accounts-create) / use an existing google service account as the user.
2. Download the service account, put it in the folder and rename it to `service-account.json`
3. Create a new empty spreadsheet, and give edit access to the service account
4. The first sheet will be populated with the initial values based on the database (so make sure initial setup is done)
5. After editing the sheet, run `npm run insert-pattern-map.js` to save the results

# Todo

- Move to typescript
- Use service account for reading internal level, instead of API key
- Clean up file directory, instead of having everything at root folder of repository