# Backend (Go)

Local API for serving maimai chart data & storing favorite charts

# Initial setup

1. Copy `db-sample.json` to `db.json`, and then fill up the fields as needed.
2. Run `go mod vendor`
3. Run `go run main.go` (make sure postgres is running on your specified host,
   may it be locally or remotely)

Alternatively, do step 1 and then let docker do all the work by running
`docker compose up` on the root directory (`cd ../`)

# To-do list

- Generate unit tests
- Make port used by API into a config
