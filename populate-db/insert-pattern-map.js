const { Client } = require('pg');
const { PushPatternToDB } = require('./utils');

require('dotenv').config()

async function main() {
    const client = new Client({
        host: process.env.HOST,
        port: process.env.PORT,
        database: process.env.DBNAME,
        user: process.env.DBUSER,
        password: process.env.DBPASS,
    });
    client.connect();

    await PushPatternToDB(client)
    process.exit()
}

main();