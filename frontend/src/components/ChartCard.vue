<template>
    <v-card @click="passChartData(chartData)" variant="tonal">
        <v-img :src="chartData.image" height="150" cover>
            <v-chip class="ma-1" :color="difficultyColor" variant="elevated">
                {{ difficultyText }}
            </v-chip>
            <v-chip class="ma-1" color="black" variant="elevated" v-if="chartData.type !== 'UTAGE'">
                {{ chartData.type }}
            </v-chip>
            <v-chip class="ma-1" color="blue-lighten-1" variant="elevated" v-if="chartData.type !== 'UTAGE'">
                {{ internalLevel }}
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
            internalLevel: "",
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
        this.internalLevel = this.chartData.internal_level
        if (!isNaN(this.chartData.internal_level)) {
            let floatInternal = parseFloat(this.chartData.internal_level)
            this.internalLevel = floatInternal.toFixed(1)
        }
        switch (this.chartData.difficulty) {
            case 'BASIC':
                this.difficultyColor = "green-lighten-1"
                this.difficultyText = "BAS " + this.chartData.level
                break
            case 'ADVANCED':
                this.difficultyColor = "orange-darken-1"
                this.difficultyText = "ADV " + this.chartData.level
                break
            case 'EXPERT':
                this.difficultyColor = "red-darken-2"
                this.difficultyText = "EXP " + this.chartData.level
                break
            case 'MASTER':
                this.difficultyColor = "deep-purple"
                this.difficultyText = "MAS " + this.chartData.level
                break
            case 'RE:MASTER':
                this.difficultyColor = "purple-accent-1"
                this.difficultyText = "RE:MAS " + this.chartData.level
                break
            case 'UTAGE':
                this.difficultyColor = "lime-darken-3"
                this.difficultyText = "UTAGE " + this.chartData.level
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