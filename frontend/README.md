# Frontend (Vue)

A web app developed in Vue, bootstrapped using Vite, and uses Vuetify as the UI
framework.

# Initial setup

1. Run `npm install`
2. Make sure `backend` is running (either through docker or locally)
3. Run `npm run dev`

# Create production build

Run `npm run build`. The static site should be on the `/dist` directory.

# To-do list

- Refactor `App.vue` (break down into smaller components)
- Add Dockerfile and update `docker-compose.yml`
- Parametrize port so that user can change the web port
- Add internal level data
- Add internal level filter
- Add difficulty filter
- Add type filter (STD/DX)
