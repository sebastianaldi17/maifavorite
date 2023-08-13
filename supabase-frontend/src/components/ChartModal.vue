<template>
    <v-dialog v-model="showModal" width="unset">
        <v-card max-width="360px">
            <v-img :src="chartData.image" cover>
                <v-chip class="ma-1" color="blue-lighten-1" variant="elevated">
                    {{ internalLevel }}
                </v-chip>
                <v-chip class="ma-1" color="black" variant="elevated">
                    {{ chartData.type }}
                </v-chip>
                <v-chip class="ma-1" :color="difficultyColor" variant="elevated">
                    {{ difficultyText }}
                </v-chip>
            </v-img>
            <v-card-title>
                {{ chartData.title }}
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
                Title (romaji): {{ chartData.title_romaji }}
            </v-card-text>
            <v-card-text>
                Artist: {{ chartData.artist }}
            </v-card-text>
            <v-card-text>
                Category: {{ chartData.category }}
            </v-card-text>
            <v-card-text>
                Version: {{ chartData.version }}
            </v-card-text>
            <v-card-text v-if="chartData.score !== undefined">
                Your best: {{ chartData.score }}
            </v-card-text>
            <v-divider></v-divider>
            <v-text-field label="Accuracy" v-model="accuracy" type="number" min="0" max="101" step="any" />
            <v-card-text>
                Estimated rating: {{ estimatedRating }}
            </v-card-text>
            <v-card-actions>
                <v-btn color="red" icon="mdi-video"
                    :href="`https://www.youtube.com/results?search_query=maimai ${chartData.title} ${chartData.difficulty} ${chartData.type}`">
                </v-btn>
                <v-btn color="primary" v-if="isFavorite" @click="this.$emit('deleteFromList', chartData.id)">-Fav</v-btn>
                <v-btn color="primary" v-else @click="this.$emit('addToList', chartData.id)">+Fav</v-btn>
                <v-btn color="secondary" @click="this.$emit('triggerOpen', false)">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>

const accFactor = [
    [100.5, 22.4],
    [100, 21.6],
    [99.5, 21.1],
    [99, 20.8],
    [98, 20.3],
    [97, 20],
    [94, 16.8],
    [90, 15.2],
    [80, 13.6],
]

export default {
    data() {
        return {
            accuracy: 0,
            difficultyColor: "black",
            difficultyText: "",
            estimatedRating: 0,
            internalLevel: "",
            showModal: false,
        }
    },

    emits: ['addToList', 'deleteFromList', 'triggerOpen'],

    watch: {
        chartData() {
            this.internalLevel = this.chartData.internal_level
            this.accuracy = 0
            this.estimatedRating = 0
            if (!isNaN(this.chartData.internal_level)) {
                let floatInternal = parseFloat(this.chartData.internal_level)
                this.internalLevel = floatInternal.toFixed(1)
            }
            switch (this.chartData.difficulty) {
                case 'BASIC':
                    this.difficultyColor = "green-lighten-1"
                    this.difficultyText = "BAS"
                    break
                case 'ADVANCED':
                    this.difficultyColor = "orange-darken-1"
                    this.difficultyText = "ADV"
                    break
                case 'EXPERT':
                    this.difficultyColor = "red-darken-2"
                    this.difficultyText = "EXP"
                    break
                case 'MASTER':
                    this.difficultyColor = "deep-purple"
                    this.difficultyText = "MAS"
                    break
                case 'RE:MASTER':
                    this.difficultyColor = "purple-accent-1"
                    this.difficultyText = "RE:MAS"
                    break
                default:
                    this.difficultyColor = "black"
                    this.difficultyText = "?"
            }
        },

        accuracy() {
            if (isNaN(this.accuracy) || this.accuracy < 0 || this.accuracy > 101) {
                this.estimatedRating = "Invalid"
                return
            }

            let accToFactor = 13.6
            for (let i = 0; i < accFactor.length; i += 1) {
                if (this.accuracy >= accFactor[i][0]) {
                    accToFactor = accFactor[i][1]
                    break
                }
            }

            this.estimatedRating = Math.floor(this.accuracy * accToFactor * parseFloat(this.chartData.internal_level) / 100)
        }
    },

    props: {
        chartData: Object,
        isFavorite: Boolean
    }
}
</script>