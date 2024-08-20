<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item prepend-icon="mdi-home" @click="redirectToHome">Home</v-list-item>
      <v-list-item prepend-icon="mdi-lock-pattern" @click="redirectToPatterns">Patterns</v-list-item>
      <v-list-item prepend-icon="mdi-information" @click="redirectToAbout">About</v-list-item>
      <v-list-item prepend-icon="mdi-message" disabled>Feedback (W.I.P.)</v-list-item>
    </v-navigation-drawer>

    <v-app-bar app color="purple-lighten-1">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title @click="$router.push('/')">
        MaiChartList v1.2.0
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script>
import { RouterView } from 'vue-router';

export default {
  data() {
    return {
      drawer: false,
    }
  },
  methods: {
    redirectToAbout() {
      this.$router.push({ name: 'about' })
    },

    redirectToHome() {
      this.$router.push({ name: 'index' })
    },

    redirectToPatterns() {
      this.$router.push({ name: 'patterns' })
    },
  }
}
</script>