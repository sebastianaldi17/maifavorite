<template>
  <v-app id="inspire">
    <v-app-bar app color="purple-lighten-1">
      <v-toolbar-title>MaiFavorite v0.0.8 </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <ChartGallery />
    </v-main>
  </v-app>
</template>

<script>
import ChartGallery from './components/ChartGallery.vue'
export default {
  components: {
    ChartGallery
  },
}
</script>