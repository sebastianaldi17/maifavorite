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
        <v-btn color="teal-lighten-2" class="mb-4 mr-2" @click="() => { toggleFilters = !toggleFilters }">Show/Hide
            filters</v-btn>
        <v-btn color="red-accent-4" class="mb-4 mr-2" @click="clearCache">Clear cache</v-btn>
        <v-btn color="blue-lighten-1" @click="getRandomChart" class="mb-4 mr-2">Randomize</v-btn>
        <v-btn color="red-lighten-1" @click="deleteFavorites" class="mb-4 mr-2">Clear Favorites</v-btn>
        <v-row v-if="toggleFilters">
            <v-col>
                <v-combobox label="Title search" v-model="titleFilter" :items="titles"/>
                <v-combobox label="Title (romaji) search" v-model="titleRomajiFilter" :items="romajis"/>
                <v-combobox label="Artist search" v-model="artistFilter" :items="artists"/>
                <v-row>
                    <v-col cols="6">
                        <v-select label="Min level" v-model="minInternalFilter" :items="internalDifficultiesFilter" hide-details></v-select>
                    </v-col>
                    <v-col cols="6">
                        <v-select label="Max level" v-model="maxInternalFilter" :items="internalDifficultiesFilter" hide-details></v-select>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="6" sm="3">
                        <v-select label="Type filter" :items="chartTypes" v-model="typesFilter" chips multiple clearable hide-details />
                    </v-col>
                    <v-col cols="6" sm="3">
                        <v-select label="Version select" :items="versions" v-model="versionsFilter" chips multiple clearable hide-details />
                    </v-col>
                    <v-col cols="6" sm="3">
                        <v-select label="Cateogry select" :items="categories" v-model="categoriesFilter" chips multiple clearable hide-details />
                    </v-col>
                    <v-col cols="6" sm="3">
                        <v-select label="Difficulty select" :items="difficulties" v-model="difficultiesFilter" chips multiple clearable hide-details />
                    </v-col>
                </v-row>
                <v-col cols="6">
                    <v-switch v-model="toggleFavorite" label="Favorites only?" color="red" hide-details></v-switch>
                </v-col>
                <v-divider />
            </v-col>
        </v-row>
        <v-row>
            <v-progress-linear v-model="filteredChartPercent" :height="16" color="red-lighten-2">
                {{ `${filteredChartCount} / ${chartCount} charts` }}
            </v-progress-linear>
            <v-col v-for="chart in filteredCharts" :key="chart.id" cols="6" sm="4" md="3" lg="2">
                <ChartCard :chart-data="chart" @passed-chart="(chartData) => { modalData = chartData }"
                    @trigger-open="(triggerOpen) => { showModal = triggerOpen }" />
            </v-col>
            <ChartModal :is-favorite="favorites.includes(modalData.id)" :chart-data="modalData" v-model="showModal"
                @trigger-open="(triggerOpen) => { showModal = triggerOpen }"
                @add-to-list="(chartID) => { addFavorite(chartID) }"
                @delete-from-list="(chartID) => { deleteFavorite(chartID) }" 
                @copy-to-clipboard-title="(chartTitle) => {snackbarWarnText = `Copied ${chartTitle} to clipboard.`}"
                @copy-to-clipboard-bool="(showModal) => {snackbarWarn = showModal}"
                />
        </v-row>
        <v-pagination :length="pageCount" v-model="currentPage">

        </v-pagination>
    </v-container>
</template>

<script>
import axios from 'axios'
import ChartCard from '../components/ChartCard.vue'
import ChartModal from '../components/ChartModal.vue'
import { toRomaji } from 'wanakana'
export default {
    components: {
        ChartCard,
        ChartModal,
    },

    computed: {
        chartCount() {
            return this.charts.length
        },

        filteredChartCount() {
            return this.getFilteredCharts().length
        },

        filteredChartPercent() {
            return this.getFilteredCharts().length / parseFloat(this.charts.length) * 100
        },

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
            artists: [],
            categories: [],
            chartTypes: ['STD', 'DX', 'UTAGE'],
            difficulties: ['BASIC', 'ADVANCED', 'EXPERT', 'MASTER', 'RE:MASTER'],
            versions: [],
            titles: [],
            romajis: [],

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
            typesFilter: [],
            versionsFilter: [],
            categoriesFilter: [],
            minInternalFilter: "1",
            maxInternalFilter: "15",
            difficultiesFilter: [],
            internalDifficultiesFilter: [],

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
            showModal: false,
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
                localStorage.setItem("cacheDate", Date.now().toString())
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

        getFilteredCharts() {
            let finalCharts = this.charts

            // Title filter
            finalCharts = finalCharts.filter((chart) => {
                return !this.titleFilter || chart.title.toLowerCase().includes(this.titleFilter.toLowerCase())
            })

            finalCharts = finalCharts.filter((chart) => {
                return !this.titleRomajiFilter || chart.title_romaji.toLowerCase().includes(this.titleRomajiFilter.toLowerCase())
            })

            // Artist filter
            finalCharts = finalCharts.filter((chart) => {
                return !this.artistFilter || chart.artist.toLowerCase().includes(this.artistFilter.toLowerCase())
            })

            // Type filter (STD, DX)
            finalCharts = finalCharts.filter((chart) => {
                return this.typesFilter <= 0 || this.typesFilter.includes(chart.type)
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
            let titleSet = new Set()
            let romajiSet = new Set()
            let artistSet = new Set()
            let internalDifficultySet = new Set()
            let fetchedCharts = []
            for (let i = 0; i < data.length; i += 1) {
                let song = data[i]
                versionSet.add(song.version)
                categorySet.add(song.category)
                titleSet.add(song.title)
                romajiSet.add(toRomaji(song.title_kana))
                artistSet.add(song.artist)
                for (let j = 0; j < song.diff.length; j += 1) {
                    let chart = song.diff[j]
                    internalDifficultySet.add(parseFloat(chart.internal_level).toFixed(1))
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
                    })
                }
            }
            this.artists = [...artistSet]
            this.charts = fetchedCharts
            this.categories = [...categorySet]
            this.romajis = [...romajiSet]
            this.titles = [...titleSet]
            this.versions = [...versionSet]
            this.internalDifficultiesFilter = [...internalDifficultySet]
            this.internalDifficultiesFilter.sort((a, b) => {return a-b})
            this.charts.reverse()
            this.loading = false
        }
    },

    mounted() {
        try {
            let cacheDate = Number.parseInt(localStorage.getItem("cacheDate"))
            if(isNaN(cacheDate)) {
                throw "Cache date not a number"
            }
            if(Date.now() - cacheDate > 86400000) {
                this.snackbarError = true
                this.snackbarErrorText = "Cache is stale, fetching new data..."
                localStorage.setItem("cacheDate", Date.now().toString())
                localStorage.removeItem("cache")
            }
        } catch (err) {
            localStorage.setItem("cacheDate", Date.now().toString())
            localStorage.removeItem("cache")
            this.snackbarError = true
            this.snackbarErrorText = "Cache timestamp broken / not found, removing stale data..."
        }

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