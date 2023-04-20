<template>
  <v-app id="inspire">
    <v-app-bar app color="purple-lighten-1">
      <v-toolbar-title>MaiFavorite 0.0.2</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-dialog v-model="loading" fullscreen>
        <v-layout class="justify-center align-center">
          <v-progress-circular indeterminate color="amber" :size="128" :width="12">
          </v-progress-circular>
        </v-layout>
      </v-dialog>
      <v-snackbar v-model="snackbar">
        {{ snackbarText }}
        <template v-slot:actions>
          <v-btn color="pink" variant="text" @click="snackbar = false">
            Close
          </v-btn>
        </template>
      </v-snackbar>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field label="Title search" v-model="titleFilter"></v-text-field>
            <v-text-field label="Artist search" v-model="artistFilter"></v-text-field>
            <v-text-field label="Min level" v-model="minInternalFilter" type="number" min="1" max="15"
              step="0.1"></v-text-field>
            <v-text-field label="Max level" v-model="maxInternalFilter" type="number" min="1" max="15"
              step="0.1"></v-text-field>
            <v-select label="Type filter" :items="chartTypes" v-model="typeFilter"></v-select>
            <v-select label="Version select" :items="versions" v-model="versionFilter"></v-select>
            <v-select label="Cateogry select" :items="categories" v-model="categoryFilter"></v-select>
            <v-select label="Difficulty select" :items="difficulties" v-model="difficultiesFilter" chips multiple />
            <v-col cols="6">
              <v-switch v-model="toggleFavorite" label="Favorites only?" color="red"></v-switch>
            </v-col>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="chart in filteredCharts" :key="chart.id" cols="6" sm="4" md="3" lg="2">
            <v-card @click="displayModal(chart)" variant="tonal">
              <v-img :src="chart.image" height="150" cover></v-img>
              <v-card-title>
                {{ chart.title }} {{ chart.type }}
              </v-card-title>
              <v-card-text>
                {{ chart.difficulty }} {{ chart.level }} ({{ chart.internal_level }})
              </v-card-text>
            </v-card>
          </v-col>
          <v-dialog v-model="showModal" width="unset">
            <v-card>
              <v-img :src="modalImage" cover></v-img>
              <v-card-title>
                {{ modalTitle }}
              </v-card-title>
              <v-card-text>
                Artist: {{ modalArtist }}
              </v-card-text>
              <v-card-text>
                Category: {{ modalCategory }}
              </v-card-text>
              <v-card-text>
                Version: {{ modalVersion }}
              </v-card-text>
              <v-card-text>
                Difficulty: {{ `${modalDifficulty} - ${modalLevel}(${modalInternalLevel}) [${modalChartType}]` }}
              </v-card-text>
              <v-card-actions>
                <v-btn color="red" icon="mdi-video"
                  :href="`https://www.youtube.com/results?search_query=maimai ${modalTitle} ${modalDifficulty} ${modalChartType}`">
                </v-btn>
                <v-btn color="primary" v-if="modalIsFavorite" @click="deleteFavorite(modalID)">-Fav</v-btn>
                <v-btn color="primary" v-else @click="addFavorite(modalID)">+Fav</v-btn>
                <v-btn color="secondary" @click="showModal = false">Close</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
        <v-pagination :length="pageCount" v-model="currentPage">

        </v-pagination>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      // Fixed values
      categories: [],
      chartTypes: ['STD', 'DX', '*'],
      difficulties: ['BASIC', 'ADVANCED', 'EXPERT', 'MASTER', 'RE:MASTER'],
      versions: [],

      // Datas used for modal
      modalTitle: "placeholder text",
      modalArtist: "placeholder text",
      modalCategory: "placeholder text",
      modalImage: "",
      modalDifficulty: "BASIC",
      modalLevel: "1",
      modalInternalLevel: 1,
      modalChartType: "STD",
      modalVersion: "",
      modalID: 0,
      modalIsFavorite: false,

      // Pagination related
      pageSize: 24,
      currentPage: 1,
      pageCount: 10,

      // Filtering related
      titleFilter: "",
      artistFilter: "",
      typeFilter: "*",
      versionFilter: "*",
      categoryFilter: "*",
      minInternalFilter: "1",
      maxInternalFilter: "15",
      difficultiesFilter: [],

      // Toggles
      toggleFavorite: false,

      // Snackbar/toaster
      snackbar: false,
      snackbarText: "",

      // Misc.
      charts: [],
      showModal: false,
      favorites: [],
      loading: true,
    }
  },

  computed: {
    filteredCharts() {
      let finalCharts = this.charts
      finalCharts = finalCharts.filter((chart) => {
        return chart.title.toLowerCase().includes(this.titleFilter)
      })

      finalCharts = finalCharts.filter((chart) => {
        return chart.artist.toLowerCase().includes(this.artistFilter)
      })

      finalCharts = finalCharts.filter((chart) => {
        return this.typeFilter === "*" || chart.type === this.typeFilter
      })

      finalCharts = finalCharts.filter((chart) => {
        return this.versionFilter === "*" || chart.version === this.versionFilter
      })

      finalCharts = finalCharts.filter((chart) => {
        return this.categoryFilter === "*" || chart.category === this.categoryFilter
      })

      finalCharts = finalCharts.filter((chart) => {
        return !this.toggleFavorite || this.favorites.includes(chart.id)
      })

      finalCharts = finalCharts.filter((chart) => {
        return !isNaN(this.minInternalFilter) && chart.internal_level >= parseFloat(this.minInternalFilter)
      })

      finalCharts = finalCharts.filter((chart) => {
        return !isNaN(this.maxInternalFilter) && chart.internal_level <= parseFloat(this.maxInternalFilter)
      })

      console.log(this.difficultiesFilter)
      finalCharts = finalCharts.filter((chart) => {
        return this.difficultiesFilter.length == 0 || this.difficultiesFilter.includes(chart.difficulty)
      })

      let totalPages = Math.ceil(finalCharts.length / this.pageSize)
      if (totalPages < this.currentPage) {
        this.currentPage = 1
      }

      this.pageCount = totalPages
      let initial = this.pageSize * (this.currentPage - 1)
      let final = initial + this.pageSize
      return finalCharts.slice(initial, final)
    }
  },

  methods: {
    addFavorite(chartID) {
      this.favorites.push(chartID)
      localStorage.setItem("favorites", JSON.stringify(this.favorites))
      this.showModal = false
    },

    deleteFavorite(chartID) {
      console.log(this.favorites)
      console.log(chartID)
      this.favorites = this.favorites.filter((id) => { return id !== chartID })
      console.log(this.favorites)
      localStorage.setItem("favorites", JSON.stringify(this.favorites))
      this.showModal = false
    },

    displayModal(song) {
      this.showModal = true
      this.modalTitle = song.title
      this.modalArtist = song.artist
      this.modalCategory = song.category
      this.modalImage = song.image
      this.modalDifficulty = song.difficulty
      this.modalLevel = song.level
      this.modalInternalLevel = song.internal_level
      this.modalChartType = song.type
      this.modalID = song.id
      this.modalIsFavorite = this.favorites.includes(song.id)
      this.modalVersion = song.version
    }
  },

  mounted() {
    let localFav = JSON.parse(localStorage.getItem("favorites"))
    if (localFav === null) {
      localFav = []
    }

    this.favorites = localFav

    let versionSet = new Set()
    let categorySet = new Set()
    versionSet.add('*')
    categorySet.add('*')
    axios
      .get('https://lmqidayjwoayyhhejbtz.functions.supabase.co/get-songs')
      .then((resp) => {
        let fetchedCharts = []
        for (let i = 0; i < resp.data.length; i += 1) {
          let song = resp.data[i]
          versionSet.add(song.version)
          categorySet.add(song.category)
          for (let j = 0; j < song.diff.length; j += 1) {
            let chart = song.diff[j]
            fetchedCharts.push({
              artist: song.artist,
              category: song.category,
              image: song.image_url,
              title: song.title,
              version: song.version,
              difficulty: chart.difficulty,
              id: chart.id,
              level: chart.level,
              internal_level: chart.internal_level,
              type: chart.type,
            })
          }
        }
        this.charts = fetchedCharts
        this.categories = [...categorySet]
        this.versions = [...versionSet]
        this.charts.reverse()
        this.loading = false
      })
      .catch((err) => {
        console.error(err.message)
        this.snackbar = true
        this.snackbarText = err.message
        this.loading = false
      })
  },
}
</script>