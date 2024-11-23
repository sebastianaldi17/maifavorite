<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list-item prepend-icon="mdi-home" @click="redirectToHome">Home</v-list-item>
      <v-list-item prepend-icon="mdi-information" @click="redirectToAbout">About</v-list-item>
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
  }
}
</script>