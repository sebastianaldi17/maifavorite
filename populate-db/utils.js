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

module.exports.GenerateID = function(song) {
    var title = song.title_kana;
    if (song.catcode === '宴会場') {
        if(song.comment === 'バンドメンバーを集めて挑め！（ヒーロー級）') {
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
        if(res.rowCount > 0) {
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
            if(chartInternal === "-") {
                // Assume that old value is to the left of "new" value
                // Can be improved by adding a fallback index on dataIndexes
                console.log(`${title} new internal level is NaN, using old internal level`);
                chartInternal = sheet.getCell(i, dataIndexes[3] + offset - 1).value;
            }
            if (isNaN(chartInternal) || chartInternal === null || chartDiff === null || chartType === null || title === null) continue;
            // console.log(`${title} | ${chartType} | ${chartDiff} | ${chartInternal}`);

            if(titleHotfix.has(title)) {
                title = titleHotfix.get(title)
            }

            await client.query(queryUpdateInternalLevel, [chartInternal, title, chartType, chartDiff])
                .then((res) => {
                    if(res.rowCount <= 0) {
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