const { GoogleSpreadsheet } = require('google-spreadsheet');
const { queryInsertSong, queryInsertCharts, queryUpdateInternalLevel, queryGetPatterns, queryGetCharts, queryInsertChartPattern } = require('./queries');
const creds = require('./service-account.json')
const { JWT } = require('google-auth-library')

const SCOPES = [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
];

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
        [240, 'BUDDiES'],
        [245, 'BUDDiES PLUS']
    ]
);

const diffMapping = new Map(
    [
        ['ReMAS', 'RE:MASTER'],
        ['MAS', 'MASTER'],
        ['EXP', 'EXPERT'],
    ]
)

/* eslint-disable no-irregular-whitespace */
const titleHotfix = new Map(
    [
        ['Excalibur ～Revived Resolution～', `Excalibur ～Revived resolution～`],
        ['“411Ψ892”', `"411Ψ892"`],
        ['System "Z"', `System “Z”`],
        ['Love’s Theme of BADASS ～バッド・アス 愛のテーマ～', `Love's Theme of BADASS ～バッド・アス 愛のテーマ～`],
        ['FREEDOM DiVE(tpz Overcute Remix)', `FREEDOM DiVE (tpz Overcute Remix)`],
        ['Got more raves?', `Got more raves？`],
        ['管弦楽組曲 第3番 ニ長調「第2曲(G線上のアリア)」BWV.1068-2', `管弦楽組曲 第3番 ニ長調「第2曲（G線上のアリア）」BWV.1068-2`],
        ['D✪N’T ST✪P R✪CKIN’', `D✪N’T  ST✪P  R✪CKIN’`],
        ['Seclet Sleuth', `Secret Sleuth`],
        ['REVIVER オルタンシア･サーガ-蒼の騎士団- オリジナルVer.', `REVIVER オルタンシア・サーガ -蒼の騎士団- オリジナルVer.`],
        ['Party 4U "holy nite mix"', `Party 4U ”holy nite mix”`],
        ['L\'epilogue', `L'épilogue`],
        ['スカーレット警察のゲットーパトロール２４時', `スカーレット警察のゲットーパトロール24時`],
        ['チルノのパーフェクトさんすう教室 ⑨周年バージョン', `チルノのパーフェクトさんすう教室　⑨周年バージョン`],
        ['【東方ニコカラ】秘神マターラfeat.魂音泉【IOSYS】', `【東方ニコカラ】秘神マターラ feat.魂音泉【IOSYS】`],
        ['Change Our MIRAI!', `Change Our MIRAI！`],
        ['Save This World νMix', `Save This World νMIX`],
        ['砂の惑星 feat.HATSUNE MIKU', `砂の惑星 feat. HATSUNE MIKU`],
        ['レッツゴー！陰陽師', `レッツゴー!陰陽師`],
        ['曖昧Mind', `曖昧mind`],
        ['ガチャガチャきゅ～と・ふぃぎゅ＠メイト', `ガチャガチャきゅ～と・ふぃぎゅ@メイト`],
        ['ファンタジーゾーンOPA!-OPA! -GMT remix-', `ファンタジーゾーン OPA-OPA! -GMT remix-`],
        ['ぼくたちいつでもしゅわっしゅわ！', `ぼくたちいつでも　しゅわっしゅわ！`],
        ['Boys O\'Clock', `Boys O’Clock`],
        ['God Knows…', `God knows...`],
        ['Bad Apple!! feat.nomico 〜五十嵐撫子Ver.〜', 'Bad Apple!! feat.nomico ～五十嵐 撫子 Ver.～'],
        ['超熊猫的周遊記(ワンダーパンダートラベラー)', '超熊猫的周遊記（ワンダーパンダートラベラー）'],
        ['SQUAD -Phvntom-', 'SQUAD-Phvntom-'],
        ['ずんだもんの朝食　～目覚ましずんラップ～', 'ずんだもんの朝食　〜目覚ましずんラップ〜']
    ]
)

/* eslint-enable */

module.exports.GenerateID = function (song) {
    var title = song.title_kana;
    if (song.catcode === '宴会場') {
        if (song.comment === 'バンドメンバーを集めて挑め！（ヒーロー級）') {
            title = '[UTAGE] セイシユンコンフレツクス (ヒーロー)';
        } else if (song.comment === 'バンドメンバーを集めて楽しもう！（入門編）') {
            title = '[UTAGE] セイシユンコンフレツクス (入門編)';
        } else if (song.title_kana === 'GARAKUTADOLLPLAY') {
            title = '[UTAGE] ' + song.title;
        } else {
            title = '[UTAGE] ' + title;
        }
    }
    if (song.title === 'Trust') {
        title = title + ' Massive New Krew feat. 光吉猛修'
    }
    return title;
}

module.exports.InsertSong = async function (client, song, ID) {
    const versionKey = Number(song.version.substring(0, 3));
    const version = versionMapping.get(versionKey);
    await client.query(
        queryInsertSong, [ID, song.title.trim(), song.catcode, song.artist, `https://maimaidx.jp/maimai-mobile/img/Music/${song.image_url}`, version]
    ).then((res) => {
        if (res.rowCount > 0) {
            console.log(`${song.title.trim()} / ${ID} added to song table`);
        } else {
            console.log(`${ID} already exists on song table`);
        }
    }).catch((error) => {
        console.error(error);
        process.exit();
    });
}

module.exports.InsertChart = async function (client, song, ID) {
    let values = [
        [ID, 'STD', 'BASIC', song.lev_bas],
        [ID, 'STD', 'ADVANCED', song.lev_adv],
        [ID, 'STD', 'EXPERT', song.lev_exp],
        [ID, 'STD', 'MASTER', song.lev_mas],
        [ID, 'STD', 'RE:MASTER', song.lev_remas],
        [ID, 'DX', 'BASIC', song.dx_lev_bas],
        [ID, 'DX', 'ADVANCED', song.dx_lev_adv],
        [ID, 'DX', 'EXPERT', song.dx_lev_exp],
        [ID, 'DX', 'MASTER', song.dx_lev_mas],
        [ID, 'DX', 'RE:MASTER', song.dx_lev_remas],
        [ID, 'UTAGE', 'UTAGE', song.lev_utage],
    ].filter((chart) => { return chart[3] })

    for (let i = 0; i < values.length; i += 1) {
        let level = values[i][3];
        let plus = level.includes('+');
        let parsedLevel = parseInt(level.replace('+', '').replace('?', ''));
        if (plus) {
            parsedLevel += 0.6;
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
            if (chartInternal === "-") {
                // Assume that old value is to the left of "new" value
                // Can be improved by adding a fallback index on dataIndexes
                console.log(`${title} new internal level is NaN, using old internal level`);
                chartInternal = sheet.getCell(i, dataIndexes[3] + offset - 1).value;
            }
            if (isNaN(chartInternal) || chartInternal === null || chartDiff === null || chartType === null || title === null) continue;
            // console.log(`${title} | ${chartType} | ${chartDiff} | ${chartInternal}`);

            if (titleHotfix.has(title)) {
                title = titleHotfix.get(title)
            }

            await client.query(queryUpdateInternalLevel, [chartInternal, title, chartType, chartDiff])
                .then((res) => {
                    if (res.rowCount <= 0) {
                        console.log(`<${title}> ${chartType} ${chartDiff} is not updated (not present in DB), check the title`)
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
module.exports.UpdateFestivalPlusInternalDifficulty = async function (client) {
    const spreadsheet = new GoogleSpreadsheet('1xqXfzfDfxiEE9mREwgX_ITIY8AowRM7w-TH2t1I_RJE', { apiKey: process.env.GOOGLE_KEY });
    await spreadsheet.loadInfo();
    // dataIndexes is [title, chart type (STD/DX), difficulty type (ADV/EXP/...), internal value]
    await module.exports.UpdateInternalLevel(client, spreadsheet, 'FESTiVAL+新曲', [0, 1, 2, 4], [0, 6, 12, 18]);
    await module.exports.UpdateInternalLevel(client, spreadsheet, '14以上', [0, 2, 3, 5], [0, 7, 14, 21]);
    await module.exports.UpdateInternalLevel(client, spreadsheet, '13+', [0, 2, 3, 5], [0, 7, 14, 21]);
    await module.exports.UpdateInternalLevel(client, spreadsheet, '13', [0, 2, 3, 5], [0, 7, 14, 21, 28, 35, 42, 49]);
    await module.exports.UpdateInternalLevel(client, spreadsheet, '12+', [0, 1, 2, 4], [0, 7, 13, 19, 25, 31]);
}

module.exports.UpdateBuddiesInternalDifficulty = async function (client) {
    const spreadsheet = new GoogleSpreadsheet('1vSqx2ghJKjWwCLrDEyZTUMSy5wkq_gY4i0GrJgSreQc', { apiKey: process.env.GOOGLE_KEY });
    await spreadsheet.loadInfo();
    // dataIndexes is [title, chart type (STD/DX), difficulty type (ADV/EXP/...), internal value]
    await module.exports.UpdateInternalLevel(client, spreadsheet, 'BUDDiES新曲', [0, 1, 2, 4], [0, 6, 12, 18, 24]);
    await module.exports.UpdateInternalLevel(client, spreadsheet, '14以上', [0, 2, 3, 5], [0, 7, 14, 21, 28, 35]);
    await module.exports.UpdateInternalLevel(client, spreadsheet, '13+', [0, 2, 3, 5], [0, 7, 14, 21]);
    await module.exports.UpdateInternalLevel(client, spreadsheet, '13', [0, 2, 3, 5], [0, 7, 14, 21, 28, 35, 42]);
}

module.exports.UpdateBuddiesPlusInternalDifficulty = async function (client) {
    const spreadsheet = new GoogleSpreadsheet('1d1AjO92Hj-iay10MsqdR_5TswEaikzC988aEOtFyybo', { apiKey: process.env.GOOGLE_KEY });
    await spreadsheet.loadInfo();
    // dataIndexes is [title, chart type (STD/DX), difficulty type (ADV/EXP/...), internal value]
    await module.exports.UpdateInternalLevel(client, spreadsheet, 'BUDDiES+新曲', [0, 1, 2, 4], [0, 6, 12, 18]);
    await module.exports.UpdateInternalLevel(client, spreadsheet, '14以上', [0, 2, 3, 5], [0, 7, 15, 22, 29, 37]);
    await module.exports.UpdateInternalLevel(client, spreadsheet, '13+', [0, 2, 3, 5], [0, 8, 15, 22, 29]);
    await module.exports.UpdateInternalLevel(client, spreadsheet, '13', [0, 2, 3, 5], [0, 8, 18, 25, 32, 39, 47]);
}

module.exports.PopulateBaseSpreadsheet = async function (client) {
    try {
        const spreadsheet = new GoogleSpreadsheet(process.env.PATTERN_SHEET_ID, new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: SCOPES,
        }))
    
        await spreadsheet.loadInfo()

        console.log("Load spreadsheet done")
        
        const sheet = spreadsheet.sheetsByIndex[0]
        await sheet.loadCells()
        console.log("Load sheet done")
    
        sheet.getCellByA1("A2").value = "ChartID"
        sheet.getCellByA1("B2").value = "Song title"
        sheet.getCellByA1("C2").value = "Difficulty"
        sheet.getCellByA1("D1").value = "PatternID"
        sheet.getCellByA1("D2").value = "Level"
    
        const patternsRes = await client.query(queryGetPatterns)
        for(let i = 0; i < patternsRes.rows.length; i += 1) {
            sheet.getCell(0, 4 + i).value = patternsRes.rows[i].id
            sheet.getCell(1, 4 + i).value = patternsRes.rows[i].name
        }
    
        const songsRes = await client.query(queryGetCharts)
        sheet.setDataValidation({sheetId: 0, startRowIndex: 2, startColumnIndex: 4, endColumnIndex: 4 + patternsRes.rows.length, endRowIndex: 1 + songsRes.rows.length}, {condition: {type: 'BOOLEAN'}})
        await sheet.saveUpdatedCells()

        let lastSave = Date.now()

        for(let i = 0; i < songsRes.rows.length; i += 1) {
            let chart = songsRes.rows[i]
            sheet.getCell(2 + i, 0).value = chart.id
            sheet.getCell(2 + i, 1).value = chart.title
            sheet.getCell(2 + i, 2).value = chart.difficulty
            sheet.getCell(2 + i, 3).value = chart.level
            for(let j = 0; j < patternsRes.rows.length; j += 1) {
                sheet.getCell(2 + i, 4 + j).boolValue = false
            }

            if(Date.now() - lastSave >= 60000) {
                await sheet.saveUpdatedCells()
                lastSave = Date.now()
            }
        }
    
        await sheet.saveUpdatedCells()
    } catch (error) {
        console.log(error)
        console.error(error)
    }
}

module.exports.PushPatternToDB = async function (client) {
    try {
        const spreadsheet = new GoogleSpreadsheet(process.env.PATTERN_SHEET_ID, new JWT({
            email: creds.client_email,
            key: creds.private_key,
            scopes: SCOPES,
        }))
    
        await spreadsheet.loadInfo()

        console.log("Load spreadsheet done")
        
        const sheet = spreadsheet.sheetsByIndex[0]
        await sheet.loadCells()
        console.log("Load sheet done")

        const patternsRes = await client.query(queryGetPatterns)

        let values = []

        for(let currentRow = 2; currentRow < 2000; currentRow += 1) { // change 2000 with other value
            const chartID = sheet.getCell(currentRow, 0).numberValue
            if(chartID === null || isNaN(chartID) || chartID <= 0) {
                break
            }
            for(let currentCol = 4; currentCol < patternsRes.rows.length; currentCol += 1) {
                if (sheet.getCell(currentRow, currentCol).boolValue) {
                    const patternID = sheet.getCell(0, currentCol).numberValue
                    if(patternID === null || isNaN(patternID) || patternID <= 0) {
                        continue
                    }
                    values.push([chartID, patternID])
                }
            }
        }
        values = values.flat()
        let brackets = []
        for (let i = 1; i < values.length; i += 2) {
            brackets.push(`($${i}, $${i + 1})`);
        }

        await client.query(queryInsertChartPattern(brackets), values)
    } catch (error) {
        console.log(error)
        console.error(error)
    }
}