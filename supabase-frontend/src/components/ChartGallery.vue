<template>
    <v-container>
        <v-dialog v-model="loading" fullscreen>
            <v-layout class="justify-center align-center">
                <v-progress-circular indeterminate color="amber" :size="128" :width="12">
                </v-progress-circular>
            </v-layout>
        </v-dialog>
        <v-snackbar v-model="snackbarWarn" key="sbwarn" top=100>
            {{ snackbarWarnText }}
            <template v-slot:actions>
                <v-btn color="pink" variant="text" @click="snackbarWarn = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
        <v-snackbar v-model="snackbarError" key="sberr">
            {{ snackbarErrorText }}
            <template v-slot:actions>
                <v-btn color="pink" variant="text" @click="snackbarError = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
        <v-btn color="teal-lighten-2" class="mb-4 mr-2" @click="() => { toggleFilters = !toggleFilters }">Toggle
            filters</v-btn>
        <v-btn color="red-accent-4" class="mb-4 mr-2" @click="clearCache">Clear cache</v-btn>
        <v-btn color="deep-purple-darken-3" class="mb-4 mr-2" @click="() => { showScoreImport = true }">Import score</v-btn>
        <v-btn color="pink-accent-2" class="mb-4 mr-2" @click="deleteScores">Clear scores</v-btn>
        <v-row v-if="toggleFilters">
            <v-col>
                <v-text-field label="Title search" v-model="titleFilter" />
                <v-text-field label="Title (romaji) search" v-model="titleRomajiFilter" />
                <v-text-field label="Artist search" v-model="artistFilter" />
                <v-row>
                    <v-col cols="6">
                        <v-text-field label="Min level" v-model="minInternalFilter" type="number" min="1" max="15"
                            step="0.1"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field label="Max level" v-model="maxInternalFilter" type="number" min="1" max="15"
                            step="0.1"></v-text-field>
                    </v-col>
                </v-row>
                <v-select label="Type filter" :items="chartTypes" v-model="typeFilter" />
                <v-select label="Version select" :items="versions" v-model="versionsFilter" chips multiple clearable />
                <v-select label="Cateogry select" :items="categories" v-model="categoriesFilter" chips multiple clearable />
                <v-select label="Difficulty select" :items="difficulties" v-model="difficultiesFilter" chips multiple
                    clearable />
                <v-btn color="blue-lighten-1" @click="getRandomChart" class="mr-2">Randomize</v-btn>
                <v-btn color="red-lighten-1" @click="deleteFavorites" class="ma-2">Clear Favorites</v-btn>
                <v-col cols="6">
                    <v-switch v-model="toggleFavorite" label="Favorites only?" color="red"></v-switch>
                </v-col>
                <v-divider />
            </v-col>
        </v-row>
        <v-row>
            <v-col v-for="chart in filteredCharts" :key="chart.id" cols="6" sm="4" md="3" lg="2">
                <ChartCard :chart-data="chart" @passed-chart="(chartData) => { modalData = chartData }"
                    @trigger-open="(triggerOpen) => { showModal = triggerOpen }" />
            </v-col>
            <ChartModal :is-favorite="favorites.includes(modalData.id)" :chart-data="modalData" v-model="showModal"
                @trigger-open="(triggerOpen) => { showModal = triggerOpen }"
                @add-to-list="(chartID) => { addFavorite(chartID) }"
                @delete-from-list="(chartID) => { deleteFavorite(chartID) }" />
            <ScoreImportDialog v-model="showScoreImport"
                @trigger-modal="(triggerModal) => { showScoreImport = triggerModal }" />
        </v-row>
        <v-pagination :length="pageCount" v-model="currentPage">

        </v-pagination>
    </v-container>
</template>

<script>
import axios from 'axios'
import ChartCard from './ChartCard.vue'
import ChartModal from './ChartModal.vue'
import ScoreImportDialog from './ScoreImportDialog.vue'
import { toRomaji } from 'wanakana'
export default {
    components: {
        ChartCard,
        ChartModal,
        ScoreImportDialog,
    },

    computed: {
        filteredCharts() {
            const finalCharts = this.getFilteredCharts()

            const totalPages = Math.ceil(finalCharts.length / this.pageSize)
            if (totalPages < this.currentPage) {
                this.currentPage = 1
            }

            this.pageCount = totalPages
            const initial = this.pageSize * (this.currentPage - 1)
            const final = initial + this.pageSize
            return finalCharts.slice(initial, final)
        }
    },

    data() {
        return {
            // Fixed values
            categories: [],
            chartTypes: ['STD', 'DX', '*'],
            difficulties: ['BASIC', 'ADVANCED', 'EXPERT', 'MASTER', 'RE:MASTER'],
            versions: [],

            // Datas used for modal
            modalData: {},

            // Pagination related
            pageSize: 24,
            currentPage: 1,
            pageCount: 10,

            // Filtering related
            titleFilter: "",
            titleRomajiFilter: "",
            artistFilter: "",
            typeFilter: "*",
            versionsFilter: [],
            categoriesFilter: [],
            minInternalFilter: "1",
            maxInternalFilter: "15",
            difficultiesFilter: [],

            // Toggles
            toggleFavorite: false,
            toggleFilters: true,

            // Snackbar/toaster
            snackbarWarn: false,
            snackbarError: false,
            snackbarWarnText: "",
            snackbarErrorText: "",

            // Misc.
            charts: [],
            scores: new Map(),
            showModal: false,
            showScoreImport: false,
            favorites: [],
            loading: true,
        }
    },

    methods: {
        addFavorite(chartID) {
            this.favorites.push(chartID)
            localStorage.setItem("favorites", JSON.stringify(this.favorites))
            this.showModal = false
        },

        clearCache() {
            if (confirm("Are you sure you want to clear cached chart data?")) {
                localStorage.removeItem("cache")
                window.location.reload()
            }
        },

        deleteFavorite(chartID) {
            this.favorites = this.favorites.filter((id) => { return id !== chartID })
            localStorage.setItem("favorites", JSON.stringify(this.favorites))
            this.showModal = false
        },

        deleteFavorites() {
            if (confirm("Are you sure you want to remove all favorites?")) {
                localStorage.setItem("favorites", JSON.stringify([]))
                window.location.reload()
            }
        },

        deleteScores() {
            if (confirm("Are you sure you want to clear local scores?")) {
                localStorage.removeItem("scores")
                window.location.reload()
            }
        },

        getFilteredCharts() {
            let finalCharts = this.charts

            // Title filter
            finalCharts = finalCharts.filter((chart) => {
                return chart.title.toLowerCase().includes(this.titleFilter.toLowerCase())
            })

            finalCharts = finalCharts.filter((chart) => {
                return chart.title_romaji.toLowerCase().includes(this.titleRomajiFilter.toLowerCase())
            })

            // Artist filter
            finalCharts = finalCharts.filter((chart) => {
                return chart.artist.toLowerCase().includes(this.artistFilter.toLowerCase())
            })

            // Type filter (STD, DX)
            finalCharts = finalCharts.filter((chart) => {
                return this.typeFilter === "*" || chart.type === this.typeFilter
            })

            // Version filter
            finalCharts = finalCharts.filter((chart) => {
                return this.versionsFilter.length <= 0 || this.versionsFilter.includes(chart.version)
            })

            // Category filter
            finalCharts = finalCharts.filter((chart) => {
                return this.categoriesFilter.length <= 0 || this.categoriesFilter.includes(chart.category)
            })

            // Favorite filter
            finalCharts = finalCharts.filter((chart) => {
                return !this.toggleFavorite || this.favorites.includes(chart.id)
            })

            // Internal level filter
            finalCharts = finalCharts.filter((chart) => {
                return !isNaN(this.minInternalFilter) && chart.internal_level >= parseFloat(this.minInternalFilter)
            })

            finalCharts = finalCharts.filter((chart) => {
                return !isNaN(this.maxInternalFilter) && chart.internal_level <= parseFloat(this.maxInternalFilter)
            })

            // Difficulty type filter (BAS, ADV, EXP, MAS, RE:MAS)
            finalCharts = finalCharts.filter((chart) => {
                return this.difficultiesFilter.length <= 0 || this.difficultiesFilter.includes(chart.difficulty)
            })

            return finalCharts
        },

        getRandomChart() {
            const chartList = this.getFilteredCharts()

            if (chartList.length <= 0) {
                this.snackbarWarn = true
                this.snackbarWarnText = "No charts to randomize!"
                return
            }

            const randomChart = chartList[Math.floor(Math.random() * chartList.length)]

            this.modalData = randomChart
            this.showModal = true
        },

        unpackData(data) {
            let versionSet = new Set()
            let categorySet = new Set()
            let fetchedCharts = []
            for (let i = 0; i < data.length; i += 1) {
                let song = data[i]
                versionSet.add(song.version)
                categorySet.add(song.category)
                for (let j = 0; j < song.diff.length; j += 1) {
                    let chart = song.diff[j]
                    fetchedCharts.push({
                        artist: song.artist,
                        category: song.category,
                        image: song.image_url,
                        title: song.title,
                        title_romaji: toRomaji(song.title_kana),
                        version: song.version,
                        difficulty: chart.difficulty,
                        id: chart.id,
                        level: chart.level,
                        internal_level: chart.internal_level,
                        type: chart.type,
                        score: this.scores.get(chart.id)
                    })
                }
            }
            this.charts = fetchedCharts
            this.categories = [...categorySet]
            this.versions = [...versionSet]
            this.charts.reverse()
            this.loading = false
        }
    },

    mounted() {
        try {
            let localFav = JSON.parse(localStorage.getItem("favorites"))
            if (localFav === null) {
                localFav = []
            }
            this.favorites = localFav
        } catch (err) {
            console.error(err)
            localStorage.removeItem("favorites")
            this.snackbarError = true
            this.snackbarErrorText = "Failed parsing favorites data, is it corrupt? Clearing favorites..."
        }

        try {
            let localScores = JSON.parse(localStorage.getItem("scores"))
            if (localScores === null) {
                localScores = []
            }
            let scoreMapping = new Map()
            for (const score of localScores) {
                scoreMapping.set(score[0], score[1])
            }
            this.scores = scoreMapping
        } catch (err) {
            console.error(err)
            localStorage.removeItem("scores")
            this.snackbarError = true
            this.snackbarErrorText = "Failed parsing score data, is it corrupt? Clearing scores..."
        }

        let cache = localStorage.getItem("cache")
        if (cache === null) {
            axios
                .get('https://lmqidayjwoayyhhejbtz.functions.supabase.co/get-songs')
                .then((resp) => {
                    localStorage.setItem("cache", JSON.stringify(resp.data))
                    this.unpackData(resp.data)
                })
                .catch((err) => {
                    console.error(err)
                    this.snackbarError = true
                    this.snackbarErrorText = err.message
                    this.loading = false
                })
        } else {
            cache = JSON.parse(cache)
            this.unpackData(cache)
            this.snackbarWarnText = "Loaded data from cache"
            this.snackbarWarn = true
        }
    },
}
</script>