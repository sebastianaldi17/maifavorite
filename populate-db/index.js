const axios = require('axios');
const { Client } = require('pg');
const { InsertSong, InsertChart, UpdateInternalLevel, GenerateID } = require('./utils');
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
            console.log("Checking for duplicates...");
            let titles = new Set();
            for(let i = 0; i < results.data.length; i += 1) {
                let song = results.data[i];
                let title = GenerateID(song);
                if(titles.has(title)) {
                    console.log(`${title} is duplicate title`);
                    console.error(`${title} is duplicate title`);
                    return
                }
                titles.add(title)
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
            process.exit();
        })

    await UpdateBuddiesInternalDifficulty();
    process.exit();
}

async function UpdateFestivalPlusInternalDifficulty() {
    const spreadsheet = new GoogleSpreadsheet('1xqXfzfDfxiEE9mREwgX_ITIY8AowRM7w-TH2t1I_RJE');
    spreadsheet.useApiKey(process.env.GOOGLE_KEY);
    await spreadsheet.loadInfo();
    // dataIndexes is [title, chart type (STD/DX), difficulty type (ADV/EXP/...), internal value]
    await UpdateInternalLevel(client, spreadsheet, 'FESTiVAL+新曲', [0, 1, 2, 4], [0, 6, 12, 18]);
    await UpdateInternalLevel(client, spreadsheet, '14以上', [0, 2, 3, 5], [0, 7, 14, 21]);
    await UpdateInternalLevel(client, spreadsheet, '13+', [0, 2, 3, 5], [0, 7, 14, 21]);
    await UpdateInternalLevel(client, spreadsheet, '13', [0, 2, 3, 5], [0, 7, 14, 21, 28, 35, 42, 49]);
    await UpdateInternalLevel(client, spreadsheet, '12+', [0, 1, 2, 4], [0, 7, 13, 19, 25, 31]);
}

async function UpdateBuddiesInternalDifficulty() {
    const spreadsheet = new GoogleSpreadsheet('1vSqx2ghJKjWwCLrDEyZTUMSy5wkq_gY4i0GrJgSreQc');
    spreadsheet.useApiKey(process.env.GOOGLE_KEY);
    await spreadsheet.loadInfo();
    // dataIndexes is [title, chart type (STD/DX), difficulty type (ADV/EXP/...), internal value]
    await UpdateInternalLevel(client, spreadsheet, 'BUDDiES新曲', [0, 1, 2, 4], [0, 6]);
    await UpdateInternalLevel(client, spreadsheet, '14以上', [0, 2, 3, 5], [0, 7, 14, 21, 28, 35]);
    await UpdateInternalLevel(client, spreadsheet, '13+', [0, 2, 3, 5], [0, 7, 14, 21]);
    await UpdateInternalLevel(client, spreadsheet, '13', [0, 2, 3, 5], [0, 7, 14, 21, 28, 35, 42]);
}

main();