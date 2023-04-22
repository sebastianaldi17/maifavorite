<template>
    <v-card @click="passChartData(chartData)" variant="tonal">
        <v-img :src="chartData.image" height="150" cover>
            <v-chip class="ma-1" color="blue-lighten-1" variant="elevated">
                {{ chartData.internal_level }}
            </v-chip>
            <v-chip class="ma-1" color="white" variant="elevated">
                {{ chartData.type }}
            </v-chip>
        </v-img>
        <v-card-title style="font-size: 16px;">
            {{ chartData.title }}
        </v-card-title>
        <v-card-text style="font-size: 12px;">
            {{ chartData.difficulty }} {{ chartData.level }}
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    emits: ['passedChart', 'triggerOpen'],

    methods: {
        passChartData(chart) {
            this.$emit('passedChart', chart)
            this.$emit('triggerOpen', true)
        }
    },

    props: {
        chartData: Object
    }
}
</script>