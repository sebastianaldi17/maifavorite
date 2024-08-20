<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="6" md="4" v-for="pattern in patterns">
                <v-row class="d-flex align-center justify-center">
                    <video width="320" controls preload="none" :poster="`/thumbnail/${pattern.name}.webp`" onloadstart="this.volume=0.5">
                        <source :src="`/webm/${pattern.name}.webm`">
                    </video>
                </v-row>
                <a class="d-flex align-center justify-center mt-4" :href="pattern.link">{{ pattern.name }}</a>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    export default {
        data() {
            return {
                patterns: [
                    {
                        name: "trill",
                        link: "https://youtu.be/LQ1pOS8Rnlg?si=--IwQuL_Wvi3V-hF&t=15"
                    },
                    {
                        name: "spin",
                        link: "https://youtu.be/YCd5nUkbj9E?si=f2aAouCaTlg_HCEF&t=20"
                    },
                    {
                        name: "jack",
                        link: "https://youtu.be/pjJYNWvWpNo?si=usl8CqeDdaA2OxP5&t=149"
                    },
                    {
                        name: "umiyuri",
                        link: "https://youtu.be/ANGign6Car8?si=1oYR6FxjpKxWc0YD&t=81"
                    },
                    {
                        name: "gallop",
                        link: "https://youtu.be/EJfRxnSNZHc?si=X4qa_9NSD4Ov14HN&t=42"
                    },
                    {
                        name: "zigzag",
                        link: "https://youtu.be/LX6Q31Yrnco?si=FUJNhwBUMn1yhpLe&t=63"
                    },
                    {
                        name: "slide-tap",
                        link: "https://youtu.be/9rwdZ8oqfVs?si=Qj9N7Q6myD6kAcfm&t=37"
                    },
                    {
                        name: "stream",
                        link: "https://youtu.be/4pVdhWrOSJE?si=4r4DkN9ttiAoOnLf&t=40"
                    },
                    {
                        name: "3-stream",
                        link: "https://youtu.be/kMt20N3760U?si=xXZHLC6YRzQtqYAe&t=124"
                    },
                    
                ]
            }
        }
    }
</script>