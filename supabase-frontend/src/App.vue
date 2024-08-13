<template>
  <v-app id="inspire">
    <v-app-bar app color="purple-lighten-1">
      <v-toolbar-title>MaiChartList v1.1.1 </v-toolbar-title>
      <template v-slot:append>
        <v-btn prepend-icon="mdi-information-outline" @click="()=> {showAbout = true}">About</v-btn>
      </template>
    </v-app-bar>

    <v-main>
      <ChartGallery />
      <About v-model="showAbout" @trigger-open="(triggerOpen) => {showAbout = triggerOpen}"/>
    </v-main>
  </v-app>
</template>

<script>
import About from './components/About.vue'
import ChartGallery from './components/ChartGallery.vue'

export default {
  components: {
    About,
    ChartGallery
  },

  data() {
    return {
      showAbout: false,
    }
  }
}
</script>