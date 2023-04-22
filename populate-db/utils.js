const { queryInsertSong, queryInsertCharts, queryUpdateInternalLevel } = require('./queries');
const versionMapping = new Map(
    [
        [0, null],
        [100, 'maimai'],
        [110, 'maimai PLUS'],
        [120, 'GreeN'],
        [130, 'GreeN PLUS'],
        [140, 'ORANGE'],
        [150, 'ORANGE PLUS'],
        [160, 'PiNK'],
        [170, 'PiNK PLUS'],
        [180, 'MURASAKi'],
        [185, 'MURASAKi PLUS'],
        [190, 'MiLK'],
        [195, 'MiLK PLUS'],
        [199, 'FiNALE'],
        [200, 'maimaiでらっくす'],
        [205, 'maimaiでらっくす PLUS'],
        [210, 'Splash'],
        [215, 'Splash PLUS'],
        [220, 'UNiVERSE'],
        [225, 'UNiVERSE PLUS'],
        [230, 'FESTiVAL'],
        [235, 'FESTiVAL PLUS'],
    ]
);

const diffMapping = new Map(
    [
        ['ReMAS', 'RE:MASTER'],
        ['MAS', 'MASTER'],
        ['EXP', 'EXPERT'],
    ]
)

module.exports.InsertSong = async function (client, song) {
    const versionKey = Number(song.version.substring(0, 3));
    const version = versionMapping.get(versionKey);
    await client.query(
        queryInsertSong, [song.title_kana, song.title, song.catcode, song.artist, `https://maimaidx.jp/maimai-mobile/img/Music/${song.image_url}`, version]
    ).then(() => {
        console.log(`${song.title} added to song table`);
    }).catch((error) => {
        console.error(error);
        process.exit();
    });
}

module.exports.InsertChart = async function (client, song) {
    let values = [
        [song.title_kana, 'STD', 'BASIC', song.lev_bas],
        [song.title_kana, 'STD', 'ADVANCED', song.lev_adv],
        [song.title_kana, 'STD', 'EXPERT', song.lev_exp],
        [song.title_kana, 'STD', 'MASTER', song.lev_mas],
        [song.title_kana, 'STD', 'RE:MASTER', song.lev_remas],
        [song.title_kana, 'DX', 'BASIC', song.dx_lev_bas],
        [song.title_kana, 'DX', 'ADVANCED', song.dx_lev_adv],
        [song.title_kana, 'DX', 'EXPERT', song.dx_lev_exp],
        [song.title_kana, 'DX', 'MASTER', song.dx_lev_mas],
        [song.title_kana, 'DX', 'RE:MASTER', song.dx_lev_remas],
    ].filter((chart) => { return chart[3] })

    for (let i = 0; i < values.length; i += 1) {
        let level = values[i][3];
        let plus = level.includes('+');
        let parsedLevel = parseInt(level.replace('+', ''));
        if (plus) {
            parsedLevel += 0.7;
        }
        values[i].push(parsedLevel);
    }

    values = values.flat();

    let brackets = [];
    for (let i = 1; i < values.length; i += 5) {
        brackets.push(`($${i}, $${i + 1}, $${i + 2}, $${i + 3}, $${i + 4})`);
    }
    await client.query(queryInsertCharts(brackets), values)
        .then(() => {
            console.log(`${song.title} difficulties generated`);
        })
        .catch((error) => {
            console.error(error);
            process.exit();
        })
}

module.exports.UpdateInternalLevel = async function (client, spreadsheet, sheetname, dataIndexes, dataOffsets) {
    const sheet = spreadsheet.sheetsByTitle[sheetname];
    await sheet.loadCells();
    for (let j = 0; j < dataOffsets.length; j++) {
        let offset = dataOffsets[j];
        for (let i = 3; i < sheet.rowCount; i += 1) {
            let title = sheet.getCell(i, dataIndexes[0] + offset).value;
            let chartType = sheet.getCell(i, dataIndexes[1] + offset).value;
            let chartDiff = diffMapping.get(sheet.getCell(i, dataIndexes[2] + offset).value);
            let chartInternal = sheet.getCell(i, dataIndexes[3] + offset).value;
            if (isNaN(chartInternal) || chartDiff === null || chartType === null || title === null) continue;
            // console.log(`${title} | ${chartType} | ${chartDiff} | ${chartInternal}`);

            await client.query(queryUpdateInternalLevel, [chartInternal, title, chartType, chartDiff])
                .then((res) => {
                    if(res.rowCount <= 0) {
                        console.log(`${title} ${chartType} ${chartDiff} is not updated (not present in DB)`)
                    } else {
                        console.log(`${title} ${chartType} ${chartDiff} updated to ${chartInternal}`);
                    }
                })
                .catch((error) => {
                    console.error(error);
                    process.exit();
                })
        }
    }
}