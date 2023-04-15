package favorites

import (
	"github.com/jmoiron/sqlx"
)

type Resource struct {
	db *sqlx.DB
}

const (
	queryGetAllFavorites = `
	SELECT
		favorites.chart_id,
		favorites.date_added,
		charts.type,
		charts.difficulty,
		charts.level,
		songs.title,
		songs.category,
		songs.artist,
		songs.imageurl,
		songs.version
	FROM
		favorites, charts, songs
	WHERE
		favorites.chart_id = charts.id
	AND
		charts.title_kana = songs.title_kana
	`

	queryAddFavorite = `
		INSERT INTO
			favorites(chart_id)
		VALUES ($1)
	`

	queryDeleteFavorite = `
		DELETE FROM
			favorites
		WHERE chart_id = $1
	`
)

func New(db *sqlx.DB) *Resource {
	fav := Resource{
		db: db,
	}
	return &fav
}
