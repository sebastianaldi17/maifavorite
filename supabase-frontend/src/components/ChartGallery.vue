<template>
    <v-container>
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
                <v-btn color="blue-lighten-1" @click="getRandomChart">Randomize</v-btn>
                <v-col cols="6">
                    <v-switch v-model="toggleFavorite" label="Favorites only?" color="red"></v-switch>
                </v-col>
                <v-divider></v-divider>
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
        </v-row>
        <v-pagination :length="pageCount" v-model="currentPage">

        </v-pagination>
    </v-container>
</template>

<script>
import axios from 'axios'
import ChartCard from './ChartCard.vue'
import ChartModal from './ChartModal.vue'
export default {
    components: {
        ChartCard,
        ChartModal
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

    methods: {
        addFavorite(chartID) {
            this.favorites.push(chartID)
            localStorage.setItem("favorites", JSON.stringify(this.favorites))
            this.showModal = false
        },

        deleteFavorite(chartID) {
            this.favorites = this.favorites.filter((id) => { return id !== chartID })
            localStorage.setItem("favorites", JSON.stringify(this.favorites))
            this.showModal = false
        },

        getFilteredCharts() {
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

            finalCharts = finalCharts.filter((chart) => {
                return this.difficultiesFilter.length == 0 || this.difficultiesFilter.includes(chart.difficulty)
            })

            return finalCharts
        },

        getRandomChart() {
            const chartList = this.getFilteredCharts()
            const randomChart = chartList[Math.floor(Math.random() * chartList.length)]

            this.modalData = randomChart
            this.showModal = true
        },
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