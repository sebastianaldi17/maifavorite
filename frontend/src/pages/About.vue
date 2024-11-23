<template>
    <v-card variant="text">
        <v-card-title>
            About
        </v-card-title>
        <v-card-text>
            Website for showing list of charts, calulate rating and setting favorites. Favorite data is saved locally
            using javascript's localStorage.
            Source code can be seen <a href="https://github.com/sebastianaldi17/maifavorite">here</a> (populate-db
            scrapes the song, frontend is this website, supabase-serverless hosts chart data).
        </v-card-text>
        <v-card-title>
            Credits:
        </v-card-title>
        <v-card-text>
            <v-list>
                <v-list-item>
                    <template v-slot:prepend>
                        <v-btn icon="mdi-gamepad-outline" variant="plain"></v-btn>
                    </template>
                    <v-list-item-title><a
                            href="https://maimai.sega.jp/data/maimai_songs.json">SEGA</a></v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <template v-slot:prepend>
                        <v-btn icon="mdi-twitter" href="https://x.com/mailv_chihooooo" variant="plain"></v-btn>
                    </template>
                    <v-list-item-title><a href="https://x.com/maiLv_Chihooooo">@maiLv_Chihooooo</a></v-list-item-title>
                </v-list-item>
                <v-list-item>
                    <template v-slot:prepend>
                        <v-btn icon="mdi-github" href="https://github.com/zetaraku" variant="plain"></v-btn>
                    </template>
                    <v-list-item-title><a href="https://github.com/zetaraku">Zeta Raku</a></v-list-item-title>
                </v-list-item>
            </v-list>
        </v-card-text>
    </v-card>
</template>

<script>
export default {

}
</script>