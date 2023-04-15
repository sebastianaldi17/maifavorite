package songs

import (
	"github.com/jmoiron/sqlx"
)

type Resource struct {
	db *sqlx.DB
}

const (
	queryGetAllSongs = `
		SELECT
            charts.id,
            charts.type,
            charts.difficulty,
            charts.level,
            songs.title,
            songs.category,
            songs.artist,
            songs.imageurl,
            songs.version,
            EXISTS(select favorites.chart_id from favorites where favorites.chart_id = charts.id) is_favorite
        FROM
            charts
        LEFT JOIN
            songs
        ON
            charts.title_kana = songs.title_kana
        ORDER BY
            charts.id
	`
)

func New(db *sqlx.DB) *Resource {
	songs := Resource{
		db: db,
	}
	return &songs
}
