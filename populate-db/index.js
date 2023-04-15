const axios = require('axios');
const { Client } = require('pg');
const { InsertSong, InsertChart, UpdateInternalLevel } = require('./utils');
const { GoogleSpreadsheet } = require('google-spreadsheet');

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
            for (const song of results.data) {
                await InsertSong(client, song);
                await InsertChart(client, song);
            }
        })
        .catch((error) => {
            console.error(error);
            process.exit();
        })

    const spreadsheet = new GoogleSpreadsheet('1xqXfzfDfxiEE9mREwgX_ITIY8AowRM7w-TH2t1I_RJE');
    spreadsheet.useApiKey(process.env.GOOGLE_KEY);
    await spreadsheet.loadInfo();
    await UpdateInternalLevel(client, spreadsheet, '14以上', [0, 2, 3, 5], [0, 7, 14, 21]);
    await UpdateInternalLevel(client, spreadsheet, '13+', [0, 2, 3, 5], [0, 7, 14, 21]);
    await UpdateInternalLevel(client, spreadsheet, '13', [0, 2, 3, 5], [0, 7, 14, 21, 28, 35, 42, 49]);
    process.exit();
}

main();