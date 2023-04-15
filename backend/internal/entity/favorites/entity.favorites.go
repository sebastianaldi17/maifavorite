package favorites

import "time"

type Favorite struct {
	DateAdded       time.Time `json:"date_added" db:"date_added"`
	ChartID         int64     `json:"chart_id" db:"chart_id"`
	ChartType       string    `json:"chart_type" db:"type"`
	ChartDifficulty string    `json:"chart_difficulty" db:"difficulty"`
	ChartLevel      string    `json:"chart_level" db:"level"`
	Title           string    `json:"title" db:"title"`
	Category        string    `json:"category" db:"category"`
	Artist          string    `json:"artist" db:"artist"`
	ImageURL        string    `json:"image_url" db:"imageurl"`
	Version         string    `json:"version" db:"version"`
}

type FavoriteReq struct {
	ChartID int64 `json:"chart_id"`
}
