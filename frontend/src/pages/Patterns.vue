<template>
    <v-container>
        <v-row>
            <v-switch v-model="loadVideo" label="Load video?" color="indigo"></v-switch>
        </v-row>
        <v-row>
            <v-col cols="12" sm="6" md="4" v-for="pattern in patterns">
                <v-row class="d-flex align-center justify-center">
                    <video width="320" controls preload="none" :poster="pattern.thumbnail_url"
                        onloadstart="this.volume=0.5">
                        <source :src="pattern.preview_url" v-if="loadVideo">
                    </video>
                </v-row>
                <a class="d-flex align-center justify-center mt-4" :href="pattern.youtube_url">{{ pattern.name }}</a>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios'
export default {
    data() {
        return {
            loadVideo: false,
            patterns: []
        }
    },
    mounted() {
        axios.get(`${import.meta.env.VITE_API_URL}/get-patterns`)
        .then((resp) => {
            for(let i = 0; i < resp.data.patterns.length; i += 1) {
                let pattern = resp.data.patterns[i]
                this.patterns.push(pattern)
            }
        })
        .catch((err) => {
            console.error(err)
            alert("An error occured, please refresh the page")
        })
    }
}
</script>