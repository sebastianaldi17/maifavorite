module.exports.queryInsertSong = `
    INSERT INTO SONGS(title_kana, title, category, artist, imageUrl, version)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (title_kana)
    DO UPDATE
    SET
        title_kana = excluded.title_kana,
        title = excluded.title,
        category = excluded.category,
        artist = excluded.artist,
        imageUrl = excluded.imageUrl,
        version = excluded.version,
        last_update = now()

`
module.exports.queryInsertCharts = function (brackets) {
    return `
    INSERT INTO CHARTS(title_kana, type, difficulty, level, internal_level)
        VALUES ${brackets.join(',')}
    ON CONFLICT (title_kana, type, difficulty)
    DO UPDATE
    SET
        level = EXCLUDED.level,
        last_update = now()
    `
}

module.exports.queryUpdateInternalLevel = `
    UPDATE charts
    SET
        internal_level = $1,
        last_update = now()
    FROM songs
    WHERE
        charts.title_kana = songs.title_kana
    AND
        songs.title = $2
    AND
        charts.type = $3
    AND
        charts.difficulty = $4
`