<template>
    <v-dialog v-model="showModal" width="unset">
        <v-card max-width="360px">
            <v-img :src="chartData.image" cover>
                <v-chip class="ma-1" color="blue-lighten-1" variant="elevated">
                    {{ chartData.internal_level }}
                </v-chip>
                <v-chip class="ma-1" color="black" variant="elevated">
                    {{ chartData.type }}
                </v-chip>
                <v-chip class="ma-1" :color="difficultyColor" variant="elevated">
                    {{ difficultyText }}
                </v-chip>
            </v-img>
            <v-divider></v-divider>
            <v-card-title>
                {{ chartData.title }}
            </v-card-title>
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
export default {
    data() {
        return {
            difficultyColor: "black",
            difficultyText: "",
            showModal: false,
        }
    },

    emits: ['addToList', 'deleteFromList', 'triggerOpen'],

    watch: {
        chartData() {
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
        }
    },

    props: {
        chartData: Object,
        isFavorite: Boolean
    }
}
</script>