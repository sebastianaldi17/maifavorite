module.exports.queryInsertSong = `
    INSERT INTO SONGS(title_kana, title, category, artist, imageUrl, version)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (title_kana)
    DO NOTHING
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

module.exports.queryGetPatterns = `
    SELECT
        id, name
    FROM
        patterns
`

module.exports.queryGetCharts = `
    SELECT
        charts.id as id,
        charts.difficulty as difficulty,
        songs.title as title,
        charts.internal_level as level
    FROM
        charts
    JOIN
        songs
    ON
        charts.title_kana = songs.title_kana
    ORDER BY
        charts.internal_level DESC, id
`

module.exports.queryInsertChartPattern = function (brackets) {
    return `
    INSERT INTO chart_to_pattern(chart_id, pattern_id)
    VALUES ${brackets.join(',')}
    ON CONFLICT (chart_id, pattern_id)
    DO NOTHING
`}