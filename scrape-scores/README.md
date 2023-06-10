# Scrape-Scores

Node script for scrapping your best scores from [maimaiNet international](https://maimaidx-eng.com/), and then outputting a JSON string that can be imported to `supabase-frontend` v0.0.7 or above.

# Initial setup
1. Copy `sample.env` to `.env` and then fill out the fields as needed. This script does not support logging in via SSO.
2. Run `npm run scrape`. A file called `logs.txt` should be generated.
3. Copy the contents of `logs.txt` (from line 3), and paste it to your supabase frontend (or my [hosted static site](http://sebastianaldi17.github.io/))
4. Simply run step 2 and 3 if you want to update your scores to the latest version.