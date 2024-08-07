<template>
    <v-dialog v-model="showModal">
        <v-card>
            <v-card-title>
                About
            </v-card-title>
            <v-card-text>
                Website for showing list of charts & setting favorites for certain charts. Favorite data is saved locally using javascript's localStorage.
                Kind of obsolete since BUDDiES PLUS allows you to have favorite songs in-game.
                Source code can be seen <a href="https://github.com/sebastianaldi17/maifavorite">here</a> (populate-db scrapes the song, supabase-frontend is this website, supabase-serverless hosts chart data).
            </v-card-text>            
            <v-card-text>
                Contact me:
                <v-list>
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-btn icon="mdi-github" href="https://github.com/sebastianaldi17" variant="plain"></v-btn>
                        </template>
                        <v-list-item-title><a href="https://github.com/sebastianaldi17">Github</a></v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-btn icon="mdi-instagram" href="https://www.instagram.com/bas_or_aldi/" variant="plain"></v-btn>
                        </template>
                        <v-list-item-title><a href="https://www.instagram.com/bas_or_aldi/">Instagram</a></v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-btn icon="mdi-linkedin" href="https://www.linkedin.com/in/sebastian-aldi-95863a187/" variant="plain"></v-btn>
                        </template>
                        <v-list-item-title><a href="https://www.linkedin.com/in/sebastian-aldi-95863a187/">Linkedin</a></v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-text>
                Credits:
                <v-list>
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-btn icon="mdi-gamepad-outline" variant="plain"></v-btn>
                        </template>
                        <v-list-item-title>SEGA's song list API, which can be seen <a href="https://maimai.sega.jp/data/maimai_songs.json">here</a></v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-btn icon="mdi-twitter" href="https://x.com/mailv_chihooooo" variant="plain"></v-btn>
                        </template>
                        <v-list-item-title><a href="https://www.instagram.com/bas_or_aldi/">@maiLv_Chihooooo</a>'s internal level spreadsheet, their latest spreadsheet can be found on their twitter bio.</v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-btn icon="mdi-github" href="https://github.com/zetaraku" variant="plain"></v-btn>
                        </template>
                        <v-list-item-title><a href="https://github.com/zetaraku">Zeta Raku</a>, creator of <a href="https://arcade-songs.zetaraku.dev/">arcade-songs</a>. Go check out their awesome <a href="https://github.com/zetaraku/arcade-songs">open source</a> website, which includes other rhythm games too!</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="this.$emit('triggerOpen', false)">
                    Close
                </v-btn>
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
    emits: ['triggerOpen'],
}
</script>