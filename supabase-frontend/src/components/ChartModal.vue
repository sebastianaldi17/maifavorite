<template>
    <v-dialog v-model="showModal" width="unset">
        <v-card max-width="360px">
            <v-img :src="chartData.image" cover>
                <v-chip class="ma-1" color="blue-lighten-1" variant="elevated">
                    {{ chartData.internal_level }}
                </v-chip>
                <v-chip class="ma-1" color="white" variant="elevated">
                    {{ chartData.type }}
                </v-chip>
            </v-img>
            <v-divider></v-divider>
            <v-card-title>
                {{ chartData.title }}
            </v-card-title>
            <v-card-text>
                Artist: {{ chartData.artist }}
            </v-card-text>
            <v-card-text>
                Category: {{ chartData.category }}
            </v-card-text>
            <v-card-text>
                Version: {{ chartData.version }}
            </v-card-text>
            <v-card-text>
                Difficulty: {{ `${chartData.difficulty} - ${chartData.level}` }}
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
            showModal: false,
        }
    },

    emits: ['addToList', 'deleteFromList', 'triggerOpen'],

    props: {
        chartData: Object,
        isFavorite: Boolean
    }
}
</script>