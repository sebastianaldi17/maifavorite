<template>
  <v-app id="inspire">
    <v-app-bar app color="purple-lighten-1">
      <v-toolbar-title>MaiFavorite</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-row>
          <v-col>
            <v-text-field label="Title search" v-model="titleFilter"></v-text-field>
            <v-text-field label="Artist search" v-model="artistFilter"></v-text-field>
            <v-select label="Version select" :items="versions" v-model="versionFilter"></v-select>
            <v-select label="Cateogry select" :items="categories" v-model="categoryFilter"></v-select>
            <v-col cols="4">
              <v-switch v-model="toggleFavorite" label="Favorites only?" color="red"></v-switch>
            </v-col>
          </v-col>
        </v-row>
        <v-row>
          <v-col v-for="chart in filteredCharts" :key="chart.id" cols="12" sm="6" md="4" lg="2">
            <v-card @click="displayModal(chart)" variant="tonal">
              <v-img :src="chart.image" height="150" cover></v-img>
              <v-card-title>
                {{ chart.title }}
              </v-card-title>
              <v-card-text>
                {{ chart.difficulty }} {{ chart.level }} ({{ chart.type }})
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
                Difficulty: {{ `${modalDifficulty} - ${modalLevel} (${modalChartType})` }}
              </v-card-text>
              <v-card-actions>
                <v-btn color="red" prepend-icon="mdi-video"
                  :href="`https://www.youtube.com/results?search_query=maimai ${modalTitle} ${modalDifficulty} ${modalChartType}`">
                  Youtube
                </v-btn>
                <v-btn color="primary" v-if="modalIsFavorite" @click="deleteFavorite(modalID)">Delete from
                  favorites</v-btn>
                <v-btn color="primary" v-else @click="addFavorite(modalID)">Add to favorites</v-btn>
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
      categories: [],
      charts: [],
      versions: [],
      showModal: false,
      modalTitle: "placeholder text",
      modalArtist: "placeholder text",
      modalCategory: "placeholder text",
      modalImage: "",
      modalDifficulty: "BASIC",
      modalLevel: "1",
      modalChartType: "STD",
      modalVersion: "",
      modalID: 0,
      modalIsFavorite: false,
      pageSize: 24,
      currentPage: 1,
      pageCount: 10,
      titleFilter: "",
      artistFilter: "",
      versionFilter: "",
      categoryFilter: "",
      toggleFavorite: false,
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
        return this.versionFilter === "" || chart.version === this.versionFilter
      })

      finalCharts = finalCharts.filter((chart) => {
        return this.categoryFilter === "" || chart.category === this.categoryFilter
      })

      finalCharts = finalCharts.filter((chart) => {
        return !this.toggleFavorite || chart.is_favorite === true
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
      axios
        .post('http://127.0.0.1:3000/favorites', { chart_id: chartID })
        .then(() => {
          window.location.reload()
        }).catch((error) => {
          alert(error.response.data)
        })
    },

    deleteFavorite(chartID) {
      axios
        .delete('http://127.0.0.1:3000/favorites', { data: { chart_id: chartID } })
        .then(() => {
          window.location.reload()
        }).catch((error) => {
          console.error(error)
          alert(error.response.data)
        })
    },

    displayModal(song) {
      this.showModal = true
      this.modalTitle = song.title
      this.modalArtist = song.artist
      this.modalCategory = song.category
      this.modalImage = song.image
      this.modalDifficulty = song.difficulty
      this.modalLevel = song.level
      this.modalChartType = song.type
      this.modalID = song.id
      this.modalIsFavorite = song.is_favorite
      this.modalVersion = song.version
    }
  },

  mounted() {
    let versionSet = new Set()
    let categorySet = new Set()
    versionSet.add('')
    categorySet.add('')
    axios
      .get('http://127.0.0.1:3000/songs')
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
              type: chart.type,
              is_favorite: chart.is_favorite,
            })
          }
        }
        this.charts = fetchedCharts
        this.categories = [...categorySet]
        this.versions = [...versionSet]
      })
      .catch((err) => {
        console.error(err)
      })
  },
}
</script>