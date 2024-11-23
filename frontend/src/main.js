import { createApp } from 'vue'
import App from './App.vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import '@mdi/font/css/materialdesignicons.css'

import { createRouter, createWebHistory } from 'vue-router'
import ChartGallery from './pages/ChartGallery.vue'
import About from './pages/About.vue'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi'
    },
    theme: {
        defaultTheme: 'light'
    }
})

const routes = [
    { path: '/about', component: About, name: 'about' },
    { path: '/', component: ChartGallery, name: 'index' },
    { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)
app.use(vuetify)
app.use(router)
app.mount('#app')
