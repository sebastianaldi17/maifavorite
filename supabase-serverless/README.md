# Supabase-Serverless

Repo containing [Edge function(s)](https://supabase.com/docs/guides/functions)
to serve maimai chart data.

# Initial setup

1. [Install the Supabase CLI](https://supabase.com/docs/guides/cli)
2. Create a Supabase project (or even account+project), if you haven't.
3. Login to the Supabase CLI using `supabase login`
4. Initialize Supabase by using `supabase init`.
5. Link to your Supabase project by using
   `supabase link --project-ref your-project-ref`
6. Deploy the edge function by using
   `supabase functions deploy get-songs --no-verify-jwt`
7. Populate your Supabase database by running the `populate-db` script. Change
   the env variables to your project connection info (visible on
   https://app.supabase.com/project/some_project_pref/settings/database).

You might need to install deno and enable deno language support for linting
purposes.

# References:

- https://supabase.com/docs/guides/functions/quickstart
