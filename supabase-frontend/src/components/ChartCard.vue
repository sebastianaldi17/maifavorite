<template>
    <v-card @click="passChartData(chartData)" variant="tonal">
        <v-img :src="chartData.image" height="150" cover>
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
        <v-card-title style="font-size: 16px;">
            {{ chartData.title }}
        </v-card-title>
    </v-card>
</template>

<script>
export default {
    data() {
        return {
            difficultyColor: "black",
            difficultyText: "",
        }
    },

    emits: ['passedChart', 'triggerOpen'],

    methods: {
        passChartData(chart) {
            this.$emit('passedChart', chart)
            this.$emit('triggerOpen', true)
        }
    },

    mounted() {
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

    props: {
        chartData: Object
    },
}
</script>