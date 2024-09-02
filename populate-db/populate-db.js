const axios = require('axios');
const { Client } = require('pg');
const { InsertSong, InsertChart, GenerateID } = require('./utils');

require('dotenv').config()

const client = new Client({
    host: process.env.HOST,
    port: process.env.PORT,
    database: process.env.DBNAME,
    user: process.env.DBUSER,
    password: process.env.DBPASS,
});
client.connect();

async function main() {
    await axios.get('https://maimai.sega.jp/data/maimai_songs.json')
        .then(async (results) => {
            console.log("Checking for duplicates...");
            let titles = new Set();
            for(let i = 0; i < results.data.length; i += 1) {
                let song = results.data[i];
                let title = GenerateID(song);
                if(titles.has(title)) {
                    console.log(`${title} is duplicate title`);
                    console.error(`${title} is duplicate title`);
                    process.exit(0);
                }
                titles.add(title);
            }
            console.log("Duplicate check finished")
            for (const song of results.data) {
                let ID = GenerateID(song);
                await InsertSong(client, song, ID);
                await InsertChart(client, song, ID);
            }
        })
        .catch((error) => {
            console.error(error);
        })
        .finally(() => {
            process.exit();
        })
}

main();